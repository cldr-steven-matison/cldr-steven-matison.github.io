---
title:  "Impala ODBC Driver 2.10.1"
header:
  teaser: "/assets/images/Cloudera-Data-Platform.png"
categories:
  - release
tags:
  - cloudera
  - impala
  - odbc
---

The latest Impala ODBC Driver (version 2.10.1) is now live on our downloads page. This release introduces several enhancements including PowerShell support, improved logging configurations, and updated third-party libraries.

## Release Highlights

1. **Connector-wide configurations UI enhancement:** On Windows, a warning message appears when users without the administrator permissions click Logging Options button or Use Only SSPI for DSN-less connections checkbox in the DSN Setup dialog. For more information, see the sections "Configuring Logging Options in Windows" and "Configuring Advanced Options in Windows" in the Installation and Configuration Guide.
2. **PowerShell OdbcDsn cmdlets support:** The connector now supports the following PowerShell OdbcDsn cmdlets: Add-OdbcDsn, Set-OdbcDsn, and Remove-OdbcDsn. For more information, see the Microsoft PowerShell Wdac Cmdlets at: https://learn.microsoft.com/en-us/powershell/module/wdac
3. **Increased REMARKS metadata field length:** The connector now supports REMARKS metadata values up to 1024 bytes, increased from the previous limit of 512 bytes.
4. **User DSN logging options support:** On Windows, non-administrator users can now configure logging options for User DSNs in the DSN Setup dialog. The Logging Options tab now includes an "Apply Only To This DSN" checkbox, which allows logging settings to be applied only to the selected User DSN. For more information, see the section "Configuring Logging Options in Windows" in the Installation and Configuration Guide.
5. **Updated third-party libraries:** The connector now uses the following third-party libraries: Expat 2.8.2 (previously 2.7.3), libcURL 8.21.0 (previously 8.18.0), OpenSSL 3.5.7 (previously 3.0.19), Apache Thrift 0.23.0 (previously 0.17.0), and zlib 1.3.2 (previously 1.3.1).

## Links

https://www.cloudera.com/downloads/connectors/impala/odbc/2-10-1.html

---

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.
