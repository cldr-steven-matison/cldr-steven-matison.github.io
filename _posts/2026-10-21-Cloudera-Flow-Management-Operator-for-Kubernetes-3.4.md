---
title:  "Cloudera Flow Management Operator for Kubernetes 3.4"
header:
  teaser: "/assets/images/nifi-logo.png"
categories:
  - release
tags:
  - cloudera
  - cfm-operator
  - kubernetes
  - nifi
---

The Data In Motion Team is pleased to announce the release of Cloudera Flow Management Operator for Kubernetes version 3.4. This release focuses on maturing our custom resources, adding support for NiFi 2.11, and expanding security and operational controls through install-time namespace and role-based access control configurations.

## Release Highlights

1. **Stable v1 API for NiFi Deployments:** The NiFi custom resource has been officially promoted to v1. This signals that the API is stable and mature enough to be the default for your new production deployments. Note: While your existing v1alpha1 clusters are still supported, all new spec fields will be added only to v1 going forward.
2. **Support for NiFi 2.11:** You can now deploy NiFi 2.11 clusters, allowing your teams to take advantage of the newest NiFi capabilities and security updates.
3. **Targeted Namespace Monitoring:** Instead of forcing the operator to monitor your entire cluster by default, you can now restrict monitoring to specific namespaces. This reduces unnecessary resource usage and is ideal for multi-tenant clusters that require strict isolation.
4. **Better Role-Based Access Controls (RBAC):** If your organization has strict compliance requirements, you can now disable the automatic creation of operator RBAC resources at install time. This gives you the flexibility to supply your own custom roles and service accounts to strictly enforce least-privilege access.
5. **Unique Cluster Identities:** You can now assign a unique operator user identity to each individual NiFi cluster. This keeps permissions tightly scoped and makes audit tracking much clearer, since API management actions are tied to a specific cluster rather than a global operator account.
6. **Strict Cross-Namespace Security:** To preserve permission boundaries set by admins, custom resources (such as User, UserGroup, and ProcessGroup) can no longer target a NiFi cluster in another namespace.

## Links

- [Release notes](https://docs.cloudera.com/cfm-operator/3.4/release-notes/topics/cfm-op-whats-new.html)
- [Documentation](https://docs.cloudera.com/cfm-operator/3.3.0/index.html)

---

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.
