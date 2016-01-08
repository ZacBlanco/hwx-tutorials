In this tutorial we will walk through the process of

*   Configuring Apache Knox and LDAP services on HDP Sandbox
*   Run a MapReduce Program using Apache Knox Gateway Server

## What is Apache Knox?

The [Apache Knox Gateway](http://hortonworks.com/hadoop/knox) is a system that provides a single point of authentication and access for Apache™ Hadoop® services. It provides the following features:

*   Single REST API Access Point
*   Centralized authentication, authorization and audit for Hadoop REST/HTTP services
*   LDAP/AD Authentication, Service Authorization and Audit
*   Eliminates SSH edge node risks
*   Hides Network Topology

## Prerequisites:

A working HDP cluster – the easiest way to have a HDP cluster is to download the [Sandbox](http://hortonworks.com/products/hortonworks-sandbox/)

### Layers of Defense for a Hadoop Cluster

*   Perimeter Level Security – Network Security, Apache Knox (gateway)
*   Authentication : Kerberos
*   Authorization
*   OS Security : encryption of data in network and hdfs

Apache Knox accesses Hadoop Cluster over HTTP/HTTPs

### Current Features of Apache Knox

1.  Authenticate : by LDAP or Cloud SSO Provider
2.  Provides services for hive, hbase, hdfs, oozie, hcat
3.  HTTP access for Hive over JDBC support is available (ODBC driver Support- In Future)

## Installation and Setup:

### Step 1:

HDP Sandbox 2.1 comes with Apache Knox installed.  
You can run the following to find if knox processes are running:

`ps -ef|grep knox`

You will not see any process is running.

You can check various knox libraries, configuration files etc. by checking in the following directory:  
`ls -ltr /usr/lib/knox`

### Step 2:

Let’s see if LDAP processes are up and running.  
`ps -ef|grep ldap`

### Step 3:

You can check if the LDAP and Gateway servers started as follows: `jps`

![enter image description here](http://hortonassets.s3.amazonaws.com/tutorial/knox/images/jps.JPG "jps.JPG")

### Step 4:

Here is another way of starting LDAP and Gateway servers:

`cd /usr/lib/knox`

`java -jar bin/ldap.jar conf &`

![enter image description here](http://hortonassets.s3.amazonaws.com/tutorial/knox/images/11-knox.JPG "11-knox.JPG")

`java -jar bin/gateway.jar &`

![enter image description here](http://hortonassets.s3.amazonaws.com/tutorial/knox/images/12-knox+-+jar+gateway.jar.JPG "12-knox - jar gateway.jar.JPG")

If you want to stop these services, you could use the following commands:

`sudo -u knox bin/gateway.sh stop`

`sudo -u knox bin/ldap.sh stop`

![enter image description here](http://hortonassets.s3.amazonaws.com/tutorial/knox/images/knoxLDAPStop.JPG "knoxLDAPStop.JPG")

### Step 5:

With installation, a user named `knox` is created and you can see in the `/etc/passwd` file.

### Step 6:

Let’s check if the Hadoop Cluster is accessible via Webhdfs.

`curl -iku guest:guest-password -X GET 'http://sandbox:50070/webhdfs/v1/?op=LISTSTATUS'`

![enter image description here](http://hortonassets.s3.amazonaws.com/tutorial/knox/images/14+connect+to+hadoop+sandbox+.JPG "14 connect to hadoop sandbox .JPG")

### Step 7:

Now let’s check if we can access Hadoop Cluster via Apache Knox services.

`curl -iku guest:guest-password -X GET 'https://localhost:8443/gateway/sandbox/webhdfs/v1/?op=LISTSTATUS'`

### Step 8:

Let’s work on an End to End Implementation use case using Apache Knox Service. Here we will take a simple example of a mapreduce jar that you might be already familiar with, the WordCount mapreduce program. We will first create the needed directories, upload the datafile into hdfs and also upload the mapreduce jar file into hdfs. Once these steps are done, using Apache Knox service, we will run this jar and process data to produce output result.

**NOTE:** If you get error “{“error”:”User: hcat is not allowed to impersonate guest”}”, do usermod -a -G users guest before step 8  
Let’s go!

`cd /usr/lib/knox` (for HDP 2.1) or  
`cd /usr/hdp/current/knox-user` (for HDP 2.2)

You could create the directories(knox-sample, knox-sample/input, and knox-sample/lib as follows:

curl -iku guest:guest-password -X put 'https://localhost:8443/gateway/sandbox/webhdfs/v1/user/guest/knox-sample?op=MKDIRS&permission=777' curl -iku guest:guest-password -X put 'https://localhost:8443/gateway/sandbox/webhdfs/v1/user/guest/knox-sample/input?op=MKDIRS&permission=777' curl -iku guest:guest-password -X put 'https://localhost:8443/gateway/sandbox/webhdfs/v1/user/guest/knox-sample/lib?op=MKDIRS&permission=777'

Let’s upload the data and the mapreduce jar files:

    curl -iku guest:guest-password  -L -T samples/hadoop-examples.jar \
    -X PUT  "https://localhost:8443\
    /gateway/sandbox/webhdfs/v1/user/guest/knox-sample/lib/hadoop-examples.jar?op=CREATE"

    curl -iku guest:guest-password  -L -T README \
    -X PUT  "https://localhost:8443\
    /gateway/sandbox/webhdfs/v1/user/guest/knox-sample/input/README?op=CREATE"

Let’s run the mapreduce program.

    curl -iku guest:guest-password --connect-timeout 60 -X POST \
    -d arg=/user/guest/knox-sample/input -d arg=/user/guest/knox-sample/output \
    -d jar=/user/guest/knox-sample/lib/hadoop-examples.jar \
    -d class=org.apache.hadoop.examples.WordCount \
    https://localhost:8443/gateway/sandbox/templeton/v1/mapreduce/jar

When you run the mapreduce execution step, you will see the following result. Please note down the Job Id. You will use it for checking status for this Job Id in the next step.  
![enter image description here](http://hortonassets.s3.amazonaws.com/tutorial/knox/images/30.5-+map+reduce+job+submission.JPG "30.5- map reduce job submission.JPG")

### Step 9:

You can check the status of your above Job Id as follows:

    curl -iku guest:guest-password 'https://localhost:8443/gateway/sandbox/templeton/v1/jobs/job_1394770200462_004'

![enter image description here](http://hortonassets.s3.amazonaws.com/tutorial/knox/images/30.6-+map+reduce+job+submission+log.JPG "30.6- map reduce job submission log.JPG")

### Step 10:

Let’s look at the list of directories in /knox-sample parent directory in hdfs.

    curl -iku guest:guest-password -X GET 'https://localhost:8443/gateway/sandbox/webhdfs/v1/user/guest/knox-sample?op=LISTSTATUS'

These are the directories which we created earlier.

### Step 11:

Let’s look at the output result file.

    curl -iku guest:guest-password -X GET 'https://localhost:8443/gateway/sandbox/webhdfs/v1/user/guest/knox-sample/output?op=LISTSTATUS'

It should look something like below:

![enter image description here](http://hortonassets.s3.amazonaws.com/tutorial/knox/images/output+resuslt+files.JPG "output resuslt files.JPG")

### Step 12:

Let’s look at the output result.

    curl -iku guest:guest-password -L -X GET 'https://localhost:8443/gateway/sandbox/webhdfs/v1/user/guest/knox-sample/output/part-r-00000?op=OPEN'

![enter image description here](http://hortonassets.s3.amazonaws.com/tutorial/knox/images/results.JPG "results.JPG")

You just ran a mapreduce program on Hadoop over Apache Knox Service.