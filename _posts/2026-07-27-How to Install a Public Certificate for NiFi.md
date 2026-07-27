---
title:  "How to Install a Public Certificate for NiFi"
excerpt: "Swap out NiFi's default self-signed keystore for a real Let's Encrypt certificate on a host-native Apache NiFi install so the browser padlock goes solid, no more NET::ERR_CERT_AUTHORITY_INVALID."
header:
  teaser: "/assets/images/nifi-logo.png"
categories:
  - blog
tags:
  - nifi
  - apache
  - tls
  - ssl
  - lets-encrypt
  - certbot
  - security
---

Every fresh Apache NiFi install lands you at `https://<host>:8443/nifi/` with a self-signed cert, and the first thing every browser tells you is that the site is unsafe. That's fine for a laptop but not for anything you want to hand a link to. This post walks through swapping that keystore for a real Let's Encrypt(LE) cert on a **host-native** NiFi install — no Kubernetes, no reverse proxy, NiFi keeps serving `:8443` and it just presents a browser-trusted cert.

Validated against **Apache NiFi 2.0.0** (open-source, build `2f13b60`, branch `NIFI-13915-RC2`) on Ubuntu 24.04, with certbot 2.9 driving Let's Encrypt.

---

## Secure NiFi Optional Paths

There are two ways to get a trusted cert in front of NiFi: put a reverse proxy in front and terminate TLS there, or load the real cert straight into NiFi's own keystore. This post takes the second path — no proxy, no ingress, no extra moving parts. NiFi itself serves the trusted cert.

The trade-off worth naming upfront: the cert's DN becomes `CN=<your-nifi-host>`. On a single-node install that's a non-issue — you're not doing mTLS between nodes. On a real cluster, that DN becomes each node's identity too, which gets awkward. Everything below is written for single-node NiFi.

The moving parts:

| Piece | What it does |
|---|---|
| **certbot + DNS-01 or HTTP-01** | Obtains and renews the LE cert |
| **`openssl pkcs12 -export`** | Bundles the LE cert + key into a PKCS12 keystore NiFi understands |
| **`nifi.properties`** | Points NiFi's `nifi.security.keystore*` at the new p12 |
| **`authorizers.xml`** | Gets the new DN if the old self-signed DN was serving as an admin/node identity |
| **`/etc/letsencrypt/renewal-hooks/deploy/nifi-reload.sh`** | Rebuilds the p12 and restarts NiFi automatically every 60 days |

---

## Prerequisites

- A **public DNS name** pointed at the host — LE only signs for names it can validate. For this walkthrough that name is `nifi.sceneserver.net`, an A record at DigitalOcean pointed at a droplet. Substitute your own everywhere below.
- NiFi installed directly on the host (not containerized), with a known `NIFI_HOME`. In my case that's `/root/nifi-2.0.0`, with `NIFI_HOME/conf/nifi.properties` as the source of truth for TLS settings.
- The user NiFi runs as, and how NiFi is started. On my droplet that's `root` via `bin/nifi.sh start` — no systemd unit. If you're on systemd, substitute `systemctl restart nifi` for the manual restart command later.
- Port `80` reachable from the internet **or** API access to your DNS provider. HTTP-01 uses port 80 to prove domain control; DNS-01 uses the provider's API. Either works.

---

## Step 1 — Inventory the current TLS setup

Before touching anything, capture what NiFi is doing today. This is the source of truth for the keystore password, the paths NiFi expects, and the DNs currently baked into `authorizers.xml`.

```bash
NIFI_HOME=/root/nifi-2.0.0
NIFI_CONF=$NIFI_HOME/conf

# What TLS config is NiFi reading?
grep -E "^nifi\.security\.|^nifi\.web\.https|^nifi\.web\.proxy" $NIFI_CONF/nifi.properties

# What does the current (self-signed) cert look like?
ls -l $NIFI_CONF/keystore.* $NIFI_CONF/truststore.*
keytool -list -v -keystore $NIFI_CONF/keystore.p12 -storepass "$(grep '^nifi.security.keystorePasswd=' $NIFI_CONF/nifi.properties | cut -d= -f2-)" 2>/dev/null | grep -E "Alias|Owner|Issuer|Valid"

# What identities is NiFi currently using?
grep -E "^nifi\.security\.user\.(oidc|ldap|login\.identity|authorizer)" $NIFI_CONF/nifi.properties
grep -E "Initial Admin|Node Identity" $NIFI_CONF/authorizers.xml
```

Write down:
- Current keystore path and password (may be plain in `nifi.properties`, or `enc{...}` and decrypted via `bootstrap.conf`'s sensitive key)
- Current cert `Owner:` DN — you'll need this if it appears anywhere in `authorizers.xml`
- Whether user login goes through OIDC/LDAP/single-user (if yes, the DN swap is invisible to browser users — much easier)

**Confirm from outside the host that today's cert is self-signed**, so we have a clear "before" state:

```bash
openssl s_client -connect nifi.sceneserver.net:8443 -servername nifi.sceneserver.net </dev/null 2>&1 \
  | openssl x509 -noout -issuer -subject
# issuer=CN=nifi-cert  ← self-signed
# subject=CN=nifi-cert
```

---

## Step 2 — Take a Snapshot For Backup

The rollback path is a directory copy. Take it before you edit a byte.

```bash
cd $NIFI_HOME
cp -a conf conf.pre-le.$(date -u +%Y%m%d)
mkdir -p /root/backup
cp -a $NIFI_CONF/keystore.* $NIFI_CONF/truststore.* $NIFI_CONF/authorizers.xml /root/backup/ 2>/dev/null
```

If Step 4 or 5 goes sideways, rollback is one line: stop NiFi, `cp -a conf.pre-le.YYYYMMDD/* conf/`, start NiFi.

---

## Step 3 — Issue the Let's Encrypt Cert

Two flavors of certbot challenge work here. Pick based on what's easier for you:

- **HTTP-01** — certbot spins up a temporary listener on port 80 to answer the LE challenge. Requires port 80 reachable from the internet. This is what I used on the droplet because DO's firewall was already open on 80 and there was nothing else answering there.
- **DNS-01** — certbot writes a TXT record via your DNS provider's API. Doesn't require any inbound ports. Best if the host is behind NAT or port 80 is unavailable.

### HTTP-01 (what I ran on the droplet)

```bash
apt update
apt install -y certbot

# One-shot standalone issuance — certbot binds :80 briefly, answers the challenge, exits
certbot certonly \
  --standalone \
  -d nifi.sceneserver.net \
  --agree-tos -m you@example.com --non-interactive
```

If NiFi doesn't already own port 80, that's it. If something else is on :80, use `--webroot` and point certbot at that server's docroot.

### DNS-01 Alternative (Cloudflare Example)

```bash
apt install -y certbot python3-certbot-dns-cloudflare

mkdir -p /root/.secrets
tee /root/.secrets/cloudflare.ini >/dev/null <<'EOF'
dns_cloudflare_api_token = <api-token-scoped-to-your-zone>
EOF
chmod 600 /root/.secrets/cloudflare.ini

certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /root/.secrets/cloudflare.ini \
  -d nifi.sceneserver.net \
  --agree-tos -m you@example.com --non-interactive
```

Substitute the equivalent plugin for your DNS host (`certbot-dns-route53`, `certbot-dns-digitalocean`, `certbot-dns-rfc2136`, etc.).

### LE Rate-limit 

Let's Encrypt caps you at **5 duplicate certs per 168h** per exact set of hostnames. If you expect to iterate — trying different keystore configs, restarting NiFi, re-running — do the first issuance against staging to avoid burning your prod quota:

```bash
certbot certonly --standalone --staging -d nifi.sceneserver.net \
  --agree-tos -m you@example.com --non-interactive
```

Staging certs are untrusted (the chain says "STAGING Let's Encrypt") but the issuance flow is identical, so you can prove the pipeline end-to-end before touching prod.

Either way, cert files land at:

- `/etc/letsencrypt/live/nifi.sceneserver.net/fullchain.pem`
- `/etc/letsencrypt/live/nifi.sceneserver.net/privkey.pem`

---

## Step 4 — Bundle the Cert into a PKCS12 Keystore

NiFi 2.x prefers PKCS12 over JKS. `openssl pkcs12 -export` bundles the LE cert and key into a `.p12` file NiFi loads natively:

```bash
KEYSTORE_PASS='<use the same value from nifi.security.keystorePasswd>'
NIFI_CONF=/root/nifi-2.0.0/conf

openssl pkcs12 -export \
  -in  /etc/letsencrypt/live/nifi.sceneserver.net/fullchain.pem \
  -inkey /etc/letsencrypt/live/nifi.sceneserver.net/privkey.pem \
  -name nifi \
  -out $NIFI_CONF/keystore.p12 \
  -password pass:"$KEYSTORE_PASS"

chown root:root $NIFI_CONF/keystore.p12
chmod 600 $NIFI_CONF/keystore.p12
```

Reuse the existing keystore password. If you change it, you have to update `nifi.properties` too — no upside to breaking that link.

If the current password lives inside `bootstrap.conf` as `enc{...}` (encrypted via a sensitive-props key), you have two options: decrypt it with `nifi-toolkit`'s `encrypt-config` and use the plain value here, or leave the encrypted values and just make sure the p12 uses the same underlying password. PKCS12 uses the same password for both `keystorePasswd` and `keyPasswd`, so pick one and stick with it across all three fields.

Confirm the p12 loads before you touch NiFi:

```bash
keytool -list -keystore $NIFI_CONF/keystore.p12 -storetype PKCS12 -storepass "$KEYSTORE_PASS"
# Expect: Alias name: nifi, Entry type: PrivateKeyEntry
# Certificate chain length: 2 or 3 (leaf + LE intermediate(s))
```

---

## Step 5 — Point `nifi.properties` at New Keystore

Edit `$NIFI_CONF/nifi.properties`:

```
nifi.security.keystore=./conf/keystore.p12
nifi.security.keystoreType=PKCS12
nifi.security.keystorePasswd=<KEYSTORE_PASS>
nifi.security.keyPasswd=<KEYSTORE_PASS>
```

Leave `nifi.security.truststore*` alone — that controls which client CAs NiFi trusts on **inbound** connections. It has nothing to do with the server cert the browser sees.

---

## Step 6 — Update `authorizers.xml` if the old DN was an identity

Skip this step entirely if NiFi's browser login goes through OIDC / LDAP / single-user — the cert DN never touches user auth in that case.

If the old self-signed DN was serving as the Initial Admin Identity or a Node Identity, you need to add the new DN. On a single-node NiFi with OIDC or single-user auth, this is usually a no-op. On a single-node NiFi authenticated by client cert, you're looking at:

```xml
<!-- authorizers.xml, inside file-user-group-provider / file-access-policy-provider -->
<property name="Initial User Identity 1">CN=nifi.sceneserver.net</property>
<property name="Node Identity 1">CN=nifi.sceneserver.net</property>
```

Keep any existing user entries in place — you're adding, not replacing. If `users.xml` already has policies attached to the old self-signed DN, either rename that identity to the new DN inside `users.xml` (safer), or add the new DN as a second Initial User and migrate policies through the UI once NiFi is back up.

---

## Step 7 — Restart NiFi

```bash
# Manual install (my droplet)
sudo -u root /root/nifi-2.0.0/bin/nifi.sh restart
tail -f /root/nifi-2.0.0/logs/nifi-app.log

# Or on systemd:
# systemctl restart nifi
# journalctl -u nifi -f
```

NiFi takes 60–120 seconds to come back. First browser hit right after "Started Server on port 8443" can 502 briefly — that's NiFi still finishing internal boot, not the cert.

---

## Step 8 — Verify the Padlock

External TLS:

```bash
openssl s_client -connect nifi.sceneserver.net:8443 -servername nifi.sceneserver.net </dev/null 2>&1 \
  | openssl x509 -noout -issuer -subject -dates
# issuer=C=US, O=Let's Encrypt, CN=R11    ← real LE intermediate
# subject=CN=nifi.sceneserver.net
# notAfter=~90 days from now

curl -v https://nifi.sceneserver.net:8443/nifi-api/access/config 2>&1 | grep -E "HTTP/|subject|issuer"
# HTTP/2 200 — no -k needed
```

Browser: open a **fresh incognito window** — Chrome and Firefox cache TLS sessions, and the old self-signed cert will linger if you reuse a window that already talked to `:8443`. In incognito the padlock is solid, no "Not secure" chip, and the cert viewer shows `Issued by: Let's Encrypt` / `Subject: nifi.sceneserver.net`.

Log in, load a canvas, poke a flow. Auth still works because the DN change only affects the server cert, not the browser session token.

---

## Step 9 — Auto-Renewal

LE certs are valid for 90 days. certbot's `certbot.timer` (systemd) or `/etc/cron.d/certbot` handles the renewal on its own. What's left is a **deploy hook** that rebuilds the p12 and restarts NiFi every time certbot renews.

Create the hook script:

```bash
tee /etc/letsencrypt/renewal-hooks/deploy/nifi-reload.sh >/dev/null <<'EOF'
#!/bin/bash
set -euo pipefail

DOMAIN="nifi.sceneserver.net"
LIVE="/etc/letsencrypt/live/$DOMAIN"
NIFI_HOME="/root/nifi-2.0.0"
NIFI_CONF="$NIFI_HOME/conf"

# Password from a root-only env file — don't inline it here
source /root/.secrets/nifi-keystore.env    # exports KEYSTORE_PASS=...

# Only act on our cert, not any other cert in this letsencrypt install
[[ "$RENEWED_LINEAGE" == "$LIVE" ]] || exit 0

openssl pkcs12 -export \
  -in  "$LIVE/fullchain.pem" \
  -inkey "$LIVE/privkey.pem" \
  -name nifi \
  -out "$NIFI_CONF/keystore.p12" \
  -password pass:"$KEYSTORE_PASS"

chown root:root "$NIFI_CONF/keystore.p12"
chmod 600 "$NIFI_CONF/keystore.p12"

# Restart — manual install:
"$NIFI_HOME/bin/nifi.sh" restart
# Or systemd: systemctl restart nifi
EOF

chmod +x /etc/letsencrypt/renewal-hooks/deploy/nifi-reload.sh
```

Password file, root-readable only:

```bash
tee /root/.secrets/nifi-keystore.env >/dev/null <<'EOF'
export KEYSTORE_PASS='<same value as nifi.properties>'
EOF
chmod 600 /root/.secrets/nifi-keystore.env
```

Prove the whole chain works **now**, don't wait 60 days to find out it doesn't:

```bash
certbot renew --dry-run
```

certbot runs a full dry-run renewal against LE staging. On success it invokes the deploy hook against your actual cert lineage — meaning your `nifi-reload.sh` will rebuild the p12 and restart NiFi as part of the dry-run. If NiFi comes back healthy and the cert on `:8443` is still valid afterwards, the renewal flow is proven end-to-end.

---

## Troubleshooting

- **Keystore load fails at NiFi startup**: password mismatch between `nifi.properties` and the p12. Run the `keytool -list` from Step 4 against the new p12 before restarting — if it can open, NiFi will too.
- **Cert renews, browser still sees old**: TLS session cache. Fresh incognito window, or restart NiFi a second time to force new sessions.
- **Deploy hook doesn't fire on renewal**: check `$RENEWED_LINEAGE` in the hook — if the guard is wrong for your domain, the hook silently skips. `journalctl -u certbot` will confirm the hook ran.
- **`Could not load module` after restart, in the logs**: unrelated to certs — that's the well-known NiFi Python-extensions symptom fixed by chowning the extensions dir to uid `10001`, not something the TLS swap causes.
- **Login broken after restart**: the old self-signed DN was actually an admin identity in `authorizers.xml`. Restore from the Step 2 snapshot, add the new DN as an additional Initial User Identity, restart.

---

## Summary

This is the fastest path I know to a real cert on a host-native NiFi, with automatic renewal, no reverse proxy, no keystore drift, and no manual work between now and the eventual 5-year-out server retirement. The whole thing is ~40 minutes end-to-end on a fresh droplet, and once the deploy hook is in place there's nothing to do at renewal time.

The same shape works for any Java service that reads a PKCS12 keystore — Schema Registry, Kafka broker TLS, SSB, an internal Spring Boot service. The only thing that changes is the properties file the p12 gets wired into.

---

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.
