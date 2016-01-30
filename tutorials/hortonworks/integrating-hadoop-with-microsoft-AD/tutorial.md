Hadoop is a business-critical data platform at many of the world’s largest enterprises. These corporations require a layered security model focusing on four aspects of security: authentication, authorization, auditing, and data protection. Hortonworks continues to innovate in each of these areas, along with other members of the Apache open source community. In this blog, we will look at the authentication layer and how we can enforce strong authentication in HDP via Kerberos.

We assume you’re familiar with:

*   Active Directory Domain Controller with Server 2012
*   HDP 2.1 Cluster installed on CentOS or RedHat
*   Windows machine added to the DC/AD

For illustration, our cluster will consist of 2 nodes (node1.hadoop.com , node2.hadoop.com), and I will use AD.COM as my Active Directory realm and HADOOP.COM as my HDP  Cluster realm.

### How to Kerberize an HDP Cluster

To enable Kerberos on HDP, install KDC plus all the required software. As part of the package, HDP comes with a prebuilt script that will setup all of our service principals and keytabs as well as redistribute keytabs across the cluster nodes. Before you run the packaged script, you must install and customize a few things.

First, choose your KDC server and run this command on any node in the cluster. In our case, we ran the script on the NameNode, but it could be run it on any node (internally or externally).  
`yum -y install krb5-server krb5-libs krb5-auth-dialog krb5-workstation`

Second, install the Kerberos client and utilities on all other nodes in the cluster.  
`yum -y install krb5-libs krb5-auth-dialog krb5-workstation`

Third, edit KDC configuration with your HDP and AD realm information:

*   HDP Cluster realm = HADOOP.COM
*   Windows Domain = AD.COM

The _krb5.conf_ file contains Kerberos configuration information, including the locations of KDCs and admin servers for the Kerberos realms we outlined above, defaults for the current realm and for Kerberos applications, and mappings of hostnames onto Kerberos realms. By default _krb5.conf_ is located at _/etc/krb5.conf_:  


    [logging]  
    default = FILE:/var/log/krb5libs.log  
    kdc = FILE:/var/log/krb5kdc.log  
    admin_server = FILE:/var/log/kadmind.log

    [libdefaults]  
    default_realm = HADOOP.COM  
    dns_lookup_realm = false  
    dns_lookup_kdc = false  
    ticket_lifetime = 24h  
    renew_lifetime = 7d  
    forwardable = true

    [realms]  
    HADOOP.COM = {  
    kdc = node1.hadoop.com  
    admin_server = node1.hadoop.com  
    }

    AD.COM = {  
    kdc = windc.ad.com  
    admin_server = windc.ad.com  
    }

    [domain_realm]  
    .hadoop.com = HADOOP.COM  
    hadoop.com = HADOOP.COM  
    .ad.com = AD.COM  
    ad.com = AD.COM

    [capaths]  
    AD.COM = {  
    HADOOP.COM = .  
    }  


Use the above configuration as a template and replace HADOOP.COM and AD.COM with your own respective realm and Domain Controller (DC) on all cluster hosts.

Below, you can review additional information or each section in _krb5.conf_

#### realms

information on the realms we are working with. The kdc and admin_server value for HADOOP.COM is the host where we installed our KDC server, and for Active Directory, it is the host of the Domain Controller.

#### domain_realm

provides a translation from a domain name or hostname to a Kerberos realm name. The tag name can be a host name, or a domain name, where domain names are indicated by a prefix of a period (.). Host names and domain names should be in lower case.

#### capaths

for cross-realm authentication, a database is needed to construct the authentication paths between the realms. This section defines the store.

Finally, edit _kdc.conf_, which by default is located in _/var/Kerberos/krb5kdc/kdc.conf_. It contains KDC configuration information, including defaults used when issuing Kerberos tickets.

    [realms]  
    HADOOP.COM = {  
    #master_key_type = aes256-cts  
    acl_file = /var/kerberos/krb5kdc/kadm5.acl  
    dict_file = /usr/share/dict/words  
    admin_keytab = /var/kerberos/krb5kdc/kadm5.keytab  
    supported_enctypes = aes256-cts:normal aes128-cts:normal des3-hmac-sha1:normal arcfour-hmac:normal des-hmac-sha1:normal des-cbc-md5:normal des-cbc-crc:normal  
    }  


Once you have completed all the above steps, you can now Kerberize the cluster using an Ambari script packaged with HDP. To that end, you must generate all Hadoop service principals and their respective keytabs using Apache Ambari.

In the Ambari, navigate to the Admin tab —> Security and click on Enable Security:

![ambari_1](/assets/hadoop-with-ms-ad/ambari_1-1024x327.png)

When prompted with Ambari Security Wizard, click Next to navigate to the Configure Services page in which you can edit your cluster realm name, in our case, it is HADOOP.COM

![ambari_2](/assets/hadoop-with-ms-ad/ambari_2-1024x468.png)

Click next to Create Principals and Keytabs page, which at the bottom has an option to Download CSV containing all the required information of principals and keytabs you’ll need in order to run the Kerberos script.

![ambari_3](/assets/hadoop-with-ms-ad/ambari_3-1024x456.png)

After downloading the CSV file, copy the CSV onto the Ambari server, and execute the Ambari script _/var/lib/ambari-server/resources/scripts/kerberos-setup.sh_ on the Ambari server.

You will also need to use the private key with permissions to all the nodes in the cluster in order to generate principals and create appropriate keytabs. Run the script with the command syntax below:

`Usage:  Kerberos-setup.sh HOST_PRINCIPAL_KEYTABLE.csv SSH_LOGIN_KEY_PATH`

For Example:  
`./kerberos-setup.sh /host-principal-keytab-list.csv ~/.ssh/id_rsa`

The script will generate all the required principals, keytabs, and accordingly, redistribute them around the cluster depending on where the appropriate Hadoop services are installed. When the script finishes, ensure that _/etc/security/keytabs/_ contains keytabs for the Hadoop services installed on that host.  
![keytabs](/assets/hadoop-with-ms-ad/keytabs-1024x498.png)

To finalize Kerberizing the cluster, go back to Ambari Security Wizard. Click next on the section where we Downloaded the Principals CSV and wait for Ambari to restart the cluster services, map principals to appropriate HDP services, and start everything in Kerberos mode.

Once completed, you should see a screen shown below with all services running.

![ambari_4](/assets/hadoop-with-ms-ad/ambari_4-1024x647.png)

Next step is to create an administrator. Run the command below and provide a strong password.

`/usr/sbin/kadmin.local  -q "addprinc root/admin"`

Now edit _/var/kerberos/krb5kdc/kadm5.acl_ with your correct realm

`*/admin@HADOOP.COM *`

Then, run the command to obtain a Kerberos ticker with admin user

`kinit root/admin@HADOOP.COM`

When you execute _klist_, you’ll see a ticket granted for admin.

![krbc](/assets/hadoop-with-ms-ad/krbc.png)

Now enter admin console by running command below:  
`kadmin.local`

Here we need to add the Kerberos key distribution center account called **krbtgt**. Run the command in **kadmin.local** console to add the principal and available encryption:

`addprinc -e "aes256-cts:normal aes128-cts:normal des3-hmac-sha1:normal arcfour-hmac:normal des-hmac-sha1:normal des-cbc-md5:normal des-cbc-crc:normal" krbtgt/HADOOP.COM@AD.COM`

### How to enable Domain and Trust in Active Directory

We managed to Kerberize our HDP cluster. Now let’s walk through enabling our domain and trust in Active Directory. This requires few steps.

First, we need to configure network security and enable network encryption for Kerberos in the active or default local domain policy. Secure connections from Windows through HiveServer that use BI tools and ODBC require this domain policy.

In the Active Directory console, go to:  
**Server Manager > Group Policy Management > Domain > Group Policy Objects > Default or Active Domain Policy and Edit**  
![ad_1](/assets/hadoop-with-ms-ad/ad_1-1024x717.png)

Then Navigate to **Computer Configuration > Policies > Windows Settings > Security Settings > Local Policies > Security Options and configure Network security: Configure Encryption types allowed for Kerberos.**

![ad_2](/assets/hadoop-with-ms-ad/ad_2-1024x632.png)

In this case I have chosen every encryption, but you can limit to what you want to enable.

Second, run these commands in PowerShell to configure Windows Kerberos with realms in Linux.

`ksetup /addkdc HADOOP.COM node1.hadoop.com  
netdom trust HADOOP.COM /Domain: AD.COM /add /realm /passwordt:HortonworkS4554  
ksetup /SetEncTypeAttr HADOOP.COM DES-CBC-CRC DES-CBC-MD5 RC4-HMAC-MD5 AES128-CTS-HMAC-SHA1-96 AES256-CTS-HMAC-SHA1-96`

The password used for netdom trust needs to be the same password as the password used for krbtgt/HADOOP.COM@AD.COM

Third, restart Kerberos services:  
`/sbin/service krb5kdc restart  
/sbin/service kadmin restart`

Fourth, go back to Ambari and map users from AD domain to have access in HDP Cluster by adding the line shown below into hadoop.security.auth_to_local text field in Ambari under HDFS service in Advanced section:

![ambari_5](/assets/hadoop-with-ms-ad/ambari_5-1024x379.png)

**RULE:[1:$1@$0](.*@AD.COM)s/@.*//**

Now restart the outdated components for the configuration changes to take effect.

![ambarI_6](/assets/hadoop-with-ms-ad/ambarI_6-1024x142.png)

Finally, after all the above steps, we can authenticate users from the AD and get tickets. I have created a user called adis in AD that I will initialize by running the command below and assign the AD user password:

`kinit adis@AD.COM`

![krb2](/assets/hadoop-with-ms-ad/krb2.png)

### How To Enable Kerberos Security in Hue

So far we have Kerberized the Cluster and configured one-way domain trust between Active Directory AD and HDP Cluster HADOOP.COM. In the final step, we will configure one of the access patterns for querying data from the HDP cluster.

In this case, we will use Hue as one of these access patterns, but in the next blog, we will discuss about BI Tools like Tableau and other ODBC compliant applications and access pattern.

If you do not have Hue installed, follow the detailed Hortonworks documentation found [here](http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.1-latest/bk_installing_manually_book/content/rpm-chap-hue.html "here").

Once Hue is installed, configure it to support security with Kerberos by creating the Hue principal and its keytab.

In kadmin console run the command below to create hue principal (node1 is the host where we installed hue):

`kadmin: addprinc -randkey hue/node1.hadoop.com@HADOOP.COM`

Next, generate the keytab for hue principal:

`kadmin: xst -k /etc/security/keytabs/hue.service.keytab hue/node1.hadoop.com@HADOOP.COM`

Make sure _hue.service.keytab_ file is accessible by the hue user; otherwise the service will not start properly. Initialize hue principal using the keytab file:

`kinit -k -t /etc/security/keytabs/hue.service.keytab hue/node1.hadoop.com@HADOOP.COM`

![kinit](/assets/hadoop-with-ms-ad/kinit-1024x184.png)

Then configure _hue.ini_ for Kerberos Security. Below are the Kerberos specific settings that you must change (the _hue.ini_ can be found in _/etc/hue/conf/hue.ini_.)


    # Authentication backend. Common settings  
    backend=desktop.auth.backend.LdapBackend

    # The search base for finding users and groups  
    base_dn=&amp;quot;DC=ad,DC=com&amp;quot;

    # The NT domain to connect to (only for use with Active Directory)  
    nt_domain=ad.com

    # URL of the LDAP server  
    ldap_url=ldap://windc.ad.com:389

    # Distinguished name of the user to bind as — not necessary if the LDAP server  
    # supports anonymous searches  
    # hadoopservice account needs to exist in Active Directory so create one.  
    bind_dn=&amp;quot;cn=hadoopservice,cn=Users,dc=ad,dc=com&amp;quot;

    # Password of the bind user — not necessary if the LDAP server supports  
    # anonymous searches  
    #this is the hadoopservice password  
    bind_password=HortonworkS4554

    # Pattern for searching for usernames — Use &amp;lt;username&amp;gt; for the parameter  
    #if you are adding your Hadoop users as part of an OU make sure to include it here during searches as ou=HadoopUsers  
    # For use when using LdapBackend for Hue authentication ldap_username_pattern=&amp;quot;cn=&amp;lt;username&amp;gt;,cn=Users,dc=ad,dc=com&amp;quot;  
    # Ignore the case of usernames when searching for existing users in Hue.  
    ignore_username_case=true

    # Force usernames to lowercase when creating new users from LDAP.  
    force_username_lowercase=true

    # Path to Hue’s Kerberos keytab file  
    hue_keytab=/etc/security/keytabs/hue.service.keytab

    # Kerberos principal name for Hue  
    hue_principal=hue/node1.hadoop.com

    # Path to kinit  
    kinit_path=/usr/bin/kinit

    # Path to keep Kerberos credentials cached.  
    ccache_path=/tmp/hue_krb5_ccache

Go through the entire _hue.ini_ file and change every occurrence of  
`security_enabled=true`

If this is running on VMs you might experience hang times at the login, so make sure to edit the _resolv.conf_ and add the Domain Controller IP. On a production cluster this should be done with NSCD and caching.

Bring up Hue and login with your AD username/password

![Screen Shot 2014-07-11 at 3.07.09 PM](/assets/hadoop-with-ms-ad/Screen-Shot-2014-07-11-at-3.07.09-PM-1024x761.png)

If you look at Hue access log, located at _/var/log/hue/access.log_, you will see the AD username being authenticated:

![Screen Shot 2014-07-11 at 3.08.33 PM](/assets/hadoop-with-ms-ad/Screen-Shot-2014-07-11-at-3.08.33-PM-1024x104.png)

Furthermore, you can check out Active Directories Event Viewer and notice the username **AD\adis** being authenticated there as well:

![ad4](/assets/hadoop-with-ms-ad/ad4-1024x510.png)

### Conclusion

We went through three detailed component configuration steps:

1.  Kerberizing the HDP Cluster
2.  Enabling Domain and Trust in Active Directory
3.  Enabling Kerberos Security in Hue

With these three major components successfully configured, you will have a fully functional Keberized HDP cluster, integrated with Active Directory, and accessible via Hue.

### What’s Next

To learn more about Kerberos and how to setup Kerberos with LDAP, read Leonid Fedotov’s in-depth [Kerberos Implementation](https://itunes.apple.com/us/book/on-origin-three-headed-dog/id872720862?mt=11 "Kerberos").