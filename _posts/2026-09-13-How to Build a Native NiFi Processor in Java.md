---
layout: single
title: "How to Build a Native NiFi Processor in Java (the Read Side of Iceberg)"
excerpt: "NiFi's Iceberg bundle is write-only. So I built GetIceberg — a native Java/NAR read processor that plugs the same RESTCatalogService and returns real rows from a CDP Data Share table."
date: 2026-09-13
classes: wide
header:
  teaser: "/assets/images/QueryFlights.png"
categories:
  - blog
tags:
  - nifi
  - java
  - nar
  - iceberg
  - cloudera
  - kubernetes
  - custom-processor
---

This is the third post in the custom-processor series. The first two — [Custom Processors with Cloudera Streaming Operators](https://cldr-steven-matison.github.io/blog/Custom-Processors-With-Cloudera-Streaming-Operators/) and [How to Build and Test Custom NiFi Processors with AI](https://cldr-steven-matison.github.io/blog/How-to-AI-with-NiFi-and-Python/) — are both the Python path: drop a `.py` file into a mounted extensions folder, wait 30 seconds, and NiFi hot-reloads it. That path is unbeatable for glue logic and iteration speed. But it can't reach a controller service, and it isn't the JVM. When you need either, you build a *native* processor: Java compiled into a NAR and loaded as a first-class type. This post is that path end to end, and the worked example is a processor I actually needed and shipped — `GetIceberg`, the read counterpart to NiFi's write-only `PutIceberg`, returning real rows from a Cloudera Data Share table.

## The symptom: NiFi's Iceberg bundle can't read

NiFi ships `PutIceberg` and `PutIcebergCDC`. Both write. There is no `GetIceberg` — no first-class way to pull the rows of an Iceberg table into a flow. On a CDP Data Share, where the whole point is that a consumer reads a shared table through a REST catalog, that gap is the whole game. You can call the REST Catalog API by hand with `InvokeHTTP` and an OAuth token provider — that works, and it's the zero-dependency path — but it's HTTP glue, not a processor. What I wanted on the canvas was a processor that takes a catalog service and a table name and emits the rows through a Record Writer, exactly the way `PutIceberg` takes them in.

## The diagnosis: build the read counterpart as a NAR

The Python bridge can't do this — it doesn't do `identifiesControllerService(...)`, and `GetIceberg` has to plug the *same* `RESTCatalogService` the stock bundle already uses. So it's Java. And the fastest way to a correct Java processor here wasn't the empty archetype — it was to **port the one that already exists**. I took the `PutIceberg` source, renamed everything `Put`→`Get`, ripped out the put guts (Kerberos/UGI wrapping, the RecordReader, task writers, commit retries) and dropped in get guts:

```
catalog.loadTable(id)  →  IcebergGenerics.read(table)  →  Iceberg-to-NiFi record conversion  →  Record Writer
```

The result keeps the stock bundle's module layout, its `success`/`failure` relationships, and its controller-service contract — so on the canvas the read side and the write side look like siblings.

## The processor: what makes it native

Three things a Python processor can't do show up immediately.

**It identifies controller services.** The load-bearing property doesn't take a string — it takes a controller service:

```java
static final PropertyDescriptor CATALOG = new PropertyDescriptor.Builder()
        .name("catalog-service")
        .displayName("Catalog Service")
        .identifiesControllerService(IcebergCatalogService.class)   // dropdown of matching CS instances
        .required(true)
        .build();
```

That one line is why the same `RESTCatalogService` instance feeds both `PutIceberg` and `GetIceberg`. The Record Writer is the same idea (`identifiesControllerService(RecordSetWriterFactory.class)`) — so the output format is whatever writer you drop in: JSON, Avro, Parquet, CSV.

**It's a source, and it says so.** Class-level annotations the framework enforces:

```java
@PrimaryNodeOnly
@TriggerSerially
@InputRequirement(InputRequirement.Requirement.INPUT_FORBIDDEN)   // no inbound connection — it pulls from the catalog
@RequiresInstanceClassLoading(cloneAncestorResources = true)
```

`INPUT_FORBIDDEN` makes NiFi reject an inbound connection at design time. `@PrimaryNodeOnly` + `@TriggerSerially` stop a clustered NiFi from running the same full-table read on every node at once. These compile fine if you get them wrong — they just misbehave in a cluster, which is the worst place to find out.

**The read runs through the session.** `onTrigger` creates the FlowFile (a source has none to `get()`), scans the table, writes every row inside one `session.write` callback, stamps `record.count` / `iceberg.catalog.namespace` / `iceberg.table.name`, fires a provenance `RECEIVE` on the table location, and transfers to `success`. The entire body is wrapped in one `try` whose `catch` routes a diagnostic FlowFile to `failure` carrying the namespace, table, and `iceberg.read.error` as attributes — so when a read fails you debug from the flow, not by grepping pod logs.

## Two divergences I earned the hard way

Porting the factory that builds the catalog client (`IcebergCatalogFactory`) is where the real lessons are. It diverges from the stock CFM factory in exactly two places, and both came out of debugging the native path on a live cluster.

**Null-guard the OAuth token.** The stock factory guards the token *service* but never the token *string*. When the Knox OAuth2 provider can't mint a token — a wedged provider, or a per-user JWT quota hit (`403 token limit exceeded`) — the token comes back `null` and Iceberg throws a bare `NullPointerException` deep inside `EnvironmentUtil.resolveAll`. Nothing tells you it's the token. So the factory checks:

```java
if (token == null || token.isBlank()) {
    throw new IllegalStateException("The configured OAuth2 token provider returned no access token; "
            + "check that the provider is enabled and its credentials are valid");
}
```

**Always request vended credentials.** One header unlocks the datashare's S3 read credentials on `loadTable`:

```java
properties.put("header.X-Iceberg-Access-Delegation", "vended-credentials");
```

Without it the catalog resolves the table metadata but can't read the data files.

:hammer_and_wrench: **Pro Tip!** These two are also exactly the notes a reviewer will want if you take this upstream: the null-token guard is a genuine robustness fix worth landing; the always-on vended-credentials header is a CDP-datashare assumption that should be made configurable before it goes into `apache/nifi`.
{: .notice--warning}

## Prove it with TestRunner — no cluster, no credentials

`nifi-mock` is in the POM, so the processor is testable in-process. The trick that makes the test hermetic: it drives a local `HadoopCatalog` over a `@TempDir`, seeds the *same* three airlines the datashare table has (`AA` / `DL` / `UA`) into a real Parquet-backed Iceberg table, then reads them back.

```java
@Test
public void testReadsAllRows() throws Exception {
    seedAirlinesTable(warehouse);          // demo.airlines, 3 rows, real Parquet
    configureRunner(warehouse);            // HadoopCatalogServiceStub + JsonRecordSetWriter
    runner.run(1);

    runner.assertAllFlowFilesTransferred(GetIceberg.REL_SUCCESS, 1);
    final MockFlowFile ff = runner.getFlowFilesForRelationship(GetIceberg.REL_SUCCESS).get(0);
    ff.assertAttributeEquals("record.count", "3");
    ff.assertAttributeEquals("mime.type", "application/json");
    assertTrue(ff.getContent().contains("American Airlines"));
}
```

Three tests cover the paths that matter: the happy read (3 rows, right attributes, JSON), a column projection (`Columns=carrier_code` → `AA` present, `American Airlines` absent), and the failure route (`Table Name=does_not_exist` → one FlowFile on `failure` with `iceberg.read.error` set). `HadoopCatalogServiceStub` is a tiny `AbstractControllerService implements IcebergCatalogService` — it proves the controller-service contract without a running NiFi. This is the Java version of the Python rule "prove the skeleton before you ship it."

## Measure it — a coverage plugin, and a gate

"The tests pass" and "the tests hit the code that matters" are different claims, and a coverage plugin is what separates them: it reports which lines the suite actually runs, so the branch you forgot shows up red instead of hiding behind a green build. Add [JaCoCo](https://www.jacoco.org/jacoco/) to the processors module — `prepare-agent` to instrument, a `report` on the `test` phase (HTML/XML/CSV under `target/site/jacoco/`), and a `check` on `verify` that **fails the build** below a bundle line-coverage floor:

```xml
<execution><id>check</id><phase>verify</phase>
  <goals><goal>check</goal></goals>
  <configuration><rules><rule>
    <element>BUNDLE</element>
    <limits><limit><counter>LINE</counter><value>COVEREDRATIO</value><minimum>0.80</minimum></limit></limits>
  </rule></rules></configuration>
</execution>
```

Now `mvn clean verify` runs the tests *and* the gate — `All coverage checks have been met. → BUILD SUCCESS`. Two things the report taught that the checkmark didn't. **Drive the tests through the real engine, not around it**: the SQL pushdown path got covered by running more `SELECT`s (`IN`, `BETWEEN`, `IS NULL`, `LIKE`, `AND`/`OR`/`NOT`, plus the non-pushable predicates that must fall back to a residual filter) through `TestRunner` and letting Calcite build the trees — never by hand-assembling parse nodes. And **exclude what you honestly can't test, out loud**: the catalog factory's REST branch needs a live endpoint and a real OAuth token, so it's an explicit `<exclude>` on the gate with a comment — a stated decision, not a silent gap. The type converter has no such excuse, so its target is 100%.

## Build the NAR — and the classloader trick that makes it drop-in

```bash
cd nifi-iceberg-read-bundle
mvn clean install -Denforcer.skip=true     # runs the TestRunner tests: 3 rows
```

`-Denforcer.skip=true` sidesteps the parent bundle's dependency-convergence enforcer — not a real problem for a single-processor bundle. The artifact is `nifi-iceberg-read-nar/target/nifi-iceberg-read-nar-1.0.2-SNAPSHOT.nar`.

Two things about *this* NAR are the difference between "loads" and "works," and they're the parts that only bite in the field.

The NAR declares CFM's Iceberg services-api NAR as its **parent**:

```
Nar-Dependency-Group: org.apache.nifi
Nar-Dependency-Id: nifi-iceberg-services-api-nar
Nar-Dependency-Version: 2.6.0.4.3.4.0-234
```

That's what lets the `RESTCatalogService` instance *already running* on the cluster satisfy `GetIceberg`'s `catalog-service` property directly. Everything else — Iceberg 1.7.2, parquet, hadoop-common, jackson — is bundled *inside* the NAR. That bundling is deliberate:

:warning: **Danger!** CFM's stock bundle pairs `iceberg-core 1.5.2` with `jackson-databind 2.20.1`, and `1.5.2` references `com.fasterxml.jackson.databind.PropertyNamingStrategy$KebabCaseStrategy` — a nested class removed after Jackson 2.15. Any catalog call throws `ClassNotFoundException` for it. Bundling my own Iceberg 1.7.2 inside the NAR sidesteps the conflict entirely — no jackson-fix image needed for this processor.
{: .notice--danger}

The one bootstrap step: the CFM services-api jar isn't on any public Maven repo, so extract it from the running pod. The jars under `work/nar/extensions/...` are **symlinks** into `work/nar-lib/`, so stream the real file with `base64` — don't `tar` the directory:

```bash
POD=mynifi-0 NS=cfm-streaming V=2.6.0.4.3.4.0-234
kubectl exec $POD -n $NS -c nifi -- base64 \
  /opt/nifi/nifi-current/work/nar/extensions/nifi-iceberg-services-api-nar-$V.nar-unpacked/NAR-INF/bundled-dependencies/nifi-iceberg-services-api-$V.jar \
  | base64 -d > nifi-iceberg-services-api.jar

mvn install:install-file -Dfile=nifi-iceberg-services-api.jar \
  -DgroupId=org.apache.nifi -DartifactId=nifi-iceberg-services-api -Dversion=$V \
  -Dpackaging=jar -DgeneratePom=true
```

## Deploy — copy the NAR, no restart

This CFM build autoloads NARs from `nifi.nar.library.autoload.directory`, which is `./data/extensions`. Copy it straight in:

```bash
kubectl cp -c nifi nifi-iceberg-read-nar/target/nifi-iceberg-read-nar-1.0.2-SNAPSHOT.nar \
  cfm-streaming/mynifi-0:/opt/nifi/nifi-current/data/extensions/
```

The NAR hot-loads in ~10 seconds. Search `GetIceberg` in the palette and it's there — no pod restart, no CR edit.

:warning: **Watch out.** NiFi will *not* re-register a same-version overwrite. Edit the code and copy the same `1.0.2-SNAPSHOT` NAR back and nothing changes. Bump the bundle version (`1.0.2` → `1.0.3`), rebuild, recopy, then repoint the processor instance to the new version. That version-bump-to-redeploy rule is the Java analogue of the Python "bump `ProcessorDetails.version`" trick — the cost you pay for JVM speed and controller-service access.
{: .notice--warning}

## Read a table — local first, then live

**Local, no CDP credentials.** The bundle ships a `test-rig/`: `tabulario/iceberg-rest` + MinIO in an `iceberg-demo` namespace, a pyiceberg Job that seeds `demo.airlines` with the three rows, and a `build-demo-pg.sh` that stands up the `GetIcebergDemo` process group over the NiFi REST API. The `tabulario` fixture doesn't vend S3 config, so the demo sets `io-impl` / `s3.endpoint` / `s3.path-style-access` / `client.region` as `GetIceberg` **dynamic properties** — the escape hatch those dynamic props exist for. Result: one FlowFile, `record.count=3`, a JSON array of the three airlines, provenance `RECEIVE s3://warehouse/demo/airlines`.

**Live, against a CDP Data Share.** Same process group shape plus the Knox OAuth chain — three components:

1. **`KnoxOAuth2`** — a `StandardOauth2AccessTokenProvider`: authorization server = the Knox token endpoint, grant type `client_credentials`, Client Authentication Strategy `REQUEST_BODY` (Knox's 2-step endpoint won't take Basic). Client id/secret live in a Parameter Context, never a processor property.
2. **`CdpRestCatalog`** — a `RESTCatalogService`: `Catalog URI` = the datashare `iceberg-rest` endpoint, warehouse = the S3 path, OAuth provider = `KnoxOAuth2`.
3. **`GetIceberg`** — `Catalog Service` = `CdpRestCatalog`, `Catalog Namespace` = `poc_uc2`, `Table Name` = `airlines`, `Record Writer` = a `JsonRecordSetWriter` → funnel.

No dynamic S3 properties here — the datashare vends the S3 read credentials in the `loadTable` response, unlocked by that always-on vended-credentials header. `GetIceberg` on `poc_uc2.airlines` returns a single FlowFile whose content is a JSON array of the three airline rows — the same rows a Spark or SSB client sees through that catalog, now through a native NiFi processor with no `InvokeHTTP` glue. Validated on CFM `2.6.0.4.3.4.0-234`.

![GetIceberg reading poc_uc2.airlines live on a CDP Data Share — one FlowFile on the success relationship, running on the com.example nifi-iceberg-read-nar bundle](/assets/images/GetIceberg-flow.png)

## A second processor: `QueryIceberg` — SQL with pushdown

`GetIceberg` reads a whole table. The next thing you want on a real table is to *not* read the whole thing — to run a `WHERE` and have the engine skip the files that can't match. That's `QueryIceberg`, the second processor in the same bundle: same NAR, same `IcebergCatalogService`, same Record Writer, but the `onTrigger` body runs SQL through Apache Calcite with the filter pushed down into the Iceberg scan.

It's shaped like NiFi's stock `QueryRecord`: **each dynamic property is a SQL `SELECT`, and its results route to a relationship of the same name.** Add a property named `delayed` with value `SELECT * FROM flights WHERE dep_delay > 45` and you get a `delayed` relationship carrying exactly those rows. (One wrinkle falls out of the port: `GetIceberg` uses plain dynamic properties for catalog overrides, but here those *are* the queries — so on `QueryIceberg` a catalog override is namespaced `catalog.s3.endpoint`, and everything not prefixed `catalog.` is treated as a query.)

![QueryIceberg on poc_uc2.airlines — three SQL dynamic properties (all, by_dest, filtered) each routed to its own relationship of the same name](/assets/images/QueryIceberg-flow.png)

The pushdown is the whole point. The table is handed to Calcite as a `ProjectableFilterableTable`, whose single `scan(root, filters, projects)` call hands you the projected column ordinals and a **mutable** list of filter conjuncts. A translator turns each conjunct it understands (`=`, `<>`, `<`, `IN`, `IS NULL`, prefix `LIKE`, `AND`/`OR`/`NOT` over string/numeric/boolean/decimal) into a native Iceberg `Expression`, pushes it into the scan, and **removes only what it pushed** from the list — Calcite evaluates whatever's left as a residual filter. So correctness never depends on the translator being complete: an untranslatable predicate like `UPPER(carrier) = 'AA'` simply stays a residual and the rows still come back right. Pushdown only ever changes *how much data is read*, never *which rows come out*.

And you can watch it work, because every FlowFile is stamped with the scan metrics: `iceberg.pushdown.filter` (what actually reached Iceberg — empty means the whole `WHERE` ran as a residual), `iceberg.pushdown.columns` (the projection), and the counters `iceberg.scan.skipped.data.manifests` / `iceberg.scan.result.data.files`. The `test-rig/` seeds a `demo.flights` table of ~120k rows partitioned by month into twelve files; a query with `WHERE flight_month = '2026-03'` comes back with `iceberg.scan.skipped.data.manifests = 11` and `iceberg.scan.result.data.files = 1` — eleven-twelfths of the table never opened, proven on the FlowFile itself, and identical on the local rig and live on the CDP Data Share.

![QueryFlights on the ~120k-row flights table partitioned by flight_month — the pruned / delayed / carrier_stats queries each on their own relationship, WHERE flight_month = '2026-03' reading one data file of twelve](/assets/images/QueryFlights-flow.png)

## What NOT to do

- **Don't skip the SPI file.** `META-INF/services/org.apache.nifi.processor.Processor` must contain `org.apache.nifi.processors.iceberg.GetIceberg`. No entry = the NAR loads but the processor never appears.
- **Don't expect a same-version NAR to reload.** Bump the version.
- **Don't `tar` the pod's `work/nar/extensions` jars** — they're symlinks. `base64` the real file.
- **Don't rely on the framework's Iceberg/jackson.** Classloader isolation makes it fragile and you inherit CFM's version conflict. Bundle your own inside the NAR.
- **Don't put the OAuth client secret in a processor property.** A non-sensitive property can't reference a sensitive param anyway — use a Parameter Context wired into the OAuth2 provider.

## Appendix — reusable commands

#### 1. Build + test the NAR

```bash
cd nifi-iceberg-read-bundle
mvn clean install -Denforcer.skip=true
```

#### 2. Bootstrap the CFM services-api jar (once per dev machine)

```bash
POD=mynifi-0 NS=cfm-streaming V=2.6.0.4.3.4.0-234
kubectl exec $POD -n $NS -c nifi -- base64 \
  /opt/nifi/nifi-current/work/nar/extensions/nifi-iceberg-services-api-nar-$V.nar-unpacked/NAR-INF/bundled-dependencies/nifi-iceberg-services-api-$V.jar \
  | base64 -d > nifi-iceberg-services-api.jar
mvn install:install-file -Dfile=nifi-iceberg-services-api.jar \
  -DgroupId=org.apache.nifi -DartifactId=nifi-iceberg-services-api -Dversion=$V \
  -Dpackaging=jar -DgeneratePom=true
```

#### 3. Deploy (hot-load, ~10s, no restart)

```bash
kubectl cp -c nifi nifi-iceberg-read-nar/target/nifi-iceberg-read-nar-1.0.2-SNAPSHOT.nar \
  cfm-streaming/mynifi-0:/opt/nifi/nifi-current/data/extensions/
kubectl exec mynifi-0 -n cfm-streaming -c nifi -- ls /opt/nifi/nifi-current/data/extensions/
```

#### 4. Redeploy after a code change

```bash
# bump <version> in the bundle + module POMs first, then:
mvn clean install -Denforcer.skip=true
kubectl cp -c nifi nifi-iceberg-read-nar/target/nifi-iceberg-read-nar-<newversion>.nar \
  cfm-streaming/mynifi-0:/opt/nifi/nifi-current/data/extensions/
# then repoint the processor instance to the new bundle version in the UI
```

## Resources

- [`nifi-iceberg-read-bundle`](https://github.com/cldr-steven-matison/NiFi2-Processor-Playground/tree/main/nifi-iceberg-read-bundle) — the full worked bundle: processor, catalog factory, record converter, TestRunner tests, the `test-rig/`, and a README with the field detail.
- [NiFi 2.0 Processor Playground](https://github.com/cldr-steven-matison/NiFi2-Processor-Playground) — Python and Java processors side by side.
- [Custom Processors with Cloudera Streaming Operators](https://cldr-steven-matison.github.io/blog/Custom-Processors-With-Cloudera-Streaming-Operators/) and [How to AI with NiFi and Python](https://cldr-steven-matison.github.io/blog/How-to-AI-with-NiFi-and-Python/) — the Python path.
- [Apache NiFi Contributor Guide](https://cwiki.apache.org/confluence/display/NIFI/Contributor+Guide) — if your processor belongs upstream.

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.
