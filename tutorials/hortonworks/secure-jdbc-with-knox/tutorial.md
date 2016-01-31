### Introduction

[HDP 2.1](http://hortonworks.com/hdp/whats-new/ "HDP 2.1") ships with [Apache Knox 0.4.0](http://hortonworks.com/blog/announcing-apache-knox-gateway-0-4-0-hadoop-security/ "Apache Knox"). This release of Apache Knox supports WebHDFS, WebHCAT, Oozie, Hive, and HBase REST APIs.

Hive is a popular component used for SQL access to Hadoop, and the Hive Server 2 with Thrift supports JDBC access over HTTP. The following steps show the configuration to enable a JDBC client to talk to Hive Server 2 via Knox (**Beeline > JDBC over HTTPS > Knox > HTTP > Hive Server2**). The picture describes the scenario that the blog covers.  
[![jdbc_knox](http://hortonworks.com/wp-content/uploads/2014/08/jdbc_knox.png)](http://hortonworks.com/wp-content/uploads/2014/08/jdbc_knox.png)

This blog focuses on Beeline as the JDBC client; however, a screenshot of Simba ODBC Client configuration for ODBC access is attached at the bottom of the blog.

### Step 1

Using Ambari, navigate to **Hive > Config**. In custom hive-site section set the the following:

*   hive.server2.thrift.http.path to cliservice
*   hive.server2.thrift.http.port
*   hive.server2.transport.mode to http

Here is an example:

[![knox_1](http://hortonworks.com/wp-content/uploads/2014/08/knox_1.png)](http://hortonworks.com/wp-content/uploads/2014/08/knox_1.png)

### Step 2

Save these Hive settings and restart HiveServer with Ambari.

### Step 3

Ensure that the values you specified match the value for HIVE service. For example, here is my HIVE service values in _/etc/knox/conf/topology/sandbox.xml_ that works against the values I specified in steps 1-3.

[code language=”javaScript”]  
&lt;service&gt;  
&lt;role&gt;HIVE&lt;/role&gt;  
&lt;url&gt;http://sandbox:10001/cliservice&lt;/url&gt;  
&lt;/service&gt;  
[/code]

### Step 4

Run beeline client.

In the example here, I am connecting to Knox on [HDP 2.1 Sandbox](http://hortonworks.com/products/hortonworks-sandbox/ "HDP Sandbox 2.1") which uses a self-signed certificate for SSL. I have exported this certificate to a file in _/root/truststore.jks_ and set a password to this file. Note that the truststore (and its password) is needed only when Knox is not configured to use a well-known SSL certificate. For example, in an out-of-band access, Knox Gateway uses a Self-Signed certificate for SSL, and that certificate needs to be exported and put into a file that the client can use.

`/usr/bin/beeline`

Use the connection string specified in step 5\. Note the **BOLD** values need to be customized for your environment. The values below work in the HDP 2.1 Sandbox and match what I specified in steps 1-3

### Step 5

Connect to the Hive Server 2

    beeline>  !connect jdbc:hive2://sandbox:8443/;ssl=true;sslTrustStore=/var/lib/knox/data/security/keystores/gateway.jks;trustStorePassword=knox?hive.server2.transport.mode=http;hive.server2.thrift.http.path=gateway/sandbox/hive

Enter username and password that Beeline will send to Knox over HTTPS to authenticate the user. The Knox included with HDP 2.1 Sandbox has the account with the username **“guest”** and the password **“guest-password.”** Knox also supports using LDAP/AD for authentication, and once you configure Knox against LDAP, you can use any LDAP user to authenticate instead of guest account used in this example.

**Enter username for**  

    jdbc:hive2://sandbox:8443/;ssl=true;sslTrustStore=/var/lib/knox/data/security/keystores/gateway.jks;trustStorePassword=knox?hive.server2.transport.mode=http;hive.server2.thrift.http.path=gateway/sandbox/hive: guest

**Enter password for**  

      jdbc:hive2://sandbox:8443/;ssl=true;sslTrustStore=/var/lib/knox/data/security/keystores/gateway.jks;trustStorePassword=knox?hive.server2.transport.mode=http;hive.server2.thrift.http.path=gateway/sandbox/hive: 
      **************

      Connected to: Apache Hive (version 0.13.0.2.1.1.0-237)

In the Beeline connection string, a trust store for HTTPS connection to Knox is specified. This truststore (and its password) is needed only when Knox is not configured to use a well-known SSL certificate. For example, in an out-of-band access, Knox Gateway uses a Self-Signed certificate for SSL, and that certificate needs to be exported and put into a file that the client can use.

However, in a production environment, Knox should be configured to use a CA authorized SSL certificate, and on the JDBC client, you need not configure a truststore and truststore password.

### Step 6

Then issue any SQL query, and the request will follow the path from **Beeline > JDBC over HTTPS to Knox > over HTTP to Hive Server 2**

For example, the **show tables** query results in the following output in HDP 2.1 Sandbox.

[![knox_2](http://hortonworks.com/wp-content/uploads/2014/08/knox_2.png)](http://hortonworks.com/wp-content/uploads/2014/08/knox_2.png)

### Simba ODBC Client Configuration

The following screenshot illustrates the ODBC client side configuration needed to get **Simba ODBC > HTTP > Knox > HTTP > Hive Server 2** setup working.

[![knox3](http://hortonworks.com/wp-content/uploads/2014/08/knox3.png)](http://hortonworks.com/wp-content/uploads/2014/08/knox3.png)

### Conclusion

[Apache Knox](http://hortonworks.com/hadoop/knox-gateway/ "Apache Knox") provides the ability to secure Hadoop’s REST API centrally. With Apache Knox, the REST/HTTP access to Hadoop benefits from centralized authentication, authorization, audit, identity management integration and SSO. In this blog we covered the configuration and steps needed for JDBC & ODBC clients to connect via Knox to Hive Server2.