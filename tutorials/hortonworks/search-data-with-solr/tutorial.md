In this tutorial, we will learn to:

*   Configure Solr to store indexes in HDFS
*   Create a solr cluster of 2 solr instances running on port 8983 and 8984
*   Index documents in HDFS using the Hadoop connectors
*   Use Solr to search documents

### [](#pre-requisite)Pre-Requisite

*   [Hortonworks Sandbox](http://hortonworks.com/sandbox)

### [](#step-1---log-into-sandbox)Step 1 – Log into Sandbox

*   After it boots up, find the IP address of the VM and add an entry into your machines hosts file e.g.

    192.168.191.241 sandbox.hortonworks.com sandbox    

*   Connect to the VM via SSH (root/hadoop), correct the /etc/hosts entry

    ssh root@sandbox.hortonworks.com

*   If running on an Ambari installed HDP 2.3 cluster (instead of sandbox), run the below to install HDPsearch

    yum install -y lucidworks-hdpsearch
    sudo -u hdfs hadoop fs -mkdir /user/solr
    sudo -u hdfs hadoop fs -chown solr /user/solr

*   If running on HDP 2.3 sandbox, run below

    chown -R solr:solr /opt/lucidworks-hdpsearch

*   **Run remaining steps as solr**

    su solr

### [](#step-2---configure-solr-to-store-index-files-in-hdfs)Step 2 – Configure Solr to store index files in HDFS

*   For the lab, we will use schemaless configuration that ships with Solr
    *   Schemaless configuration is a set of SOLR features that allow one to index documents without pre-specifying the schema of indexed documents
    *   Sample schemaless configruation can be found in the directory /opt/lucidworks-hdpsearch/solr/server/solr/configsets/data_driven_schema_configs
*   Let’s create a copy of the sample schemaless configuration and modify it to store indexes in HDFS

        cp -R /opt/lucidworks-hdpsearch/solr/server/solr/configsets/data_driven_schema_configs  /opt/lucidworks-hdpsearch/solr/server/solr/configsets/data_driven_schema_configs_hdfs 

*   Open `/opt/lucidworks-hdpsearch/solr/server/solr/configsets/data_driven_schema_configs_hdfs/conf/solrconfig.xml` in your favorite editor and make the following changes:

1- Replace the section:

                    <directoryFactory name="DirectoryFactory"
                    class="${solr.directoryFactory:solr.NRTCachingDirectoryFactory}">
                    </directoryFactory>

**with**

                <directoryFactory name="DirectoryFactory" class="solr.HdfsDirectoryFactory">
                    <str name="solr.hdfs.home">hdfs://sandbox.hortonworks.com/user/solr</str>
                    <bool name="solr.hdfs.blockcache.enabled">true</bool>
                    <int name="solr.hdfs.blockcache.slab.count">1</int>
                    <bool name="solr.hdfs.blockcache.direct.memory.allocation">false</bool>
                    <int name="solr.hdfs.blockcache.blocksperbank">16384</int>
                    <bool name="solr.hdfs.blockcache.read.enabled">true</bool>
                    <bool name="solr.hdfs.blockcache.write.enabled">false</bool>
                    <bool name="solr.hdfs.nrtcachingdirectory.enable">true</bool>
                    <int name="solr.hdfs.nrtcachingdirectory.maxmergesizemb">16</int>
                    <int name="solr.hdfs.nrtcachingdirectory.maxcachedmb">192</int>
                </directoryFactory>

2- set locktype to

    <lockType>hdfs</lockType>

3- Save and exit the file

### [](#step-3---start-2-solr-instances-in-solrcloud-mode)Step 3 – Start 2 Solr instances in solrcloud mode

    mkdir -p ~/solr-cores/core1
    mkdir -p ~/solr-cores/core2
    cp /opt/lucidworks-hdpsearch/solr/server/solr/solr.xml ~/solr-cores/core1
    cp /opt/lucidworks-hdpsearch/solr/server/solr/solr.xml ~/solr-cores/core2
    /opt/lucidworks-hdpsearch/solr/bin/solr  start -cloud -p 8983 -z sandbox.hortonworks.com:2181 -s ~/solr-cores/core1
    /opt/lucidworks-hdpsearch/solr/bin/solr  restart -cloud -p 8984 -z sandbox.hortonworks.com:2181 -s ~/solr-cores/core2

### [](#step-4---create-a-solr-collection-named-labs-with-2-shards-and-a-replication-factor-of-2)Step 4 – Create a Solr Collection named “labs” with 2 shards and a replication factor of 2

    /opt/lucidworks-hdpsearch/solr/bin/solr create -c labs \
    -d /opt/lucidworks-hdpsearch/solr/server/solr/configsets/data_driven_schema_configs_hdfs/conf -n labs -s 2 -rf 2

### [](#step-5---validate-that-the-labs-collection-got-created)Step 5 – Validate that the labs collection got created

*   Using the browser, visit [http://sandbox.hortonworks.com:8983/solr/#/~cloud](http://sandbox.hortonworks.com:8983/solr/#/%7Ecloud). You should see the labs collection with 2 shards, each with a replication factor of 2.

![Image](/assets/search-with-solr/solrui.png)

### [](#step-6---load-documents-to-hdfs)Step 6 – Load documents to HDFS

*   Upload sample csv file to hdfs. We will index the file with Solr using the Solr Hadoop connectors

    hadoop fs -mkdir -p csv
    hadoop fs -put /opt/lucidworks-hdpsearch/solr/example/exampledocs/books.csv csv/

### [](#step-7---index-documents-with-solr-using-solr-hadoop-connector)Step 7 – Index documents with Solr using Solr Hadoop Connector

    hadoop jar /opt/lucidworks-hdpsearch/job/lucidworks-hadoop-job-2.0.3.jar com.lucidworks.hadoop.ingest.IngestJob -DcsvFieldMapping=0=id,1=cat,2=name,3=price,4=instock,5=author -DcsvFirstLineComment -DidField=id -DcsvDelimiter="," -Dlww.commit.on.close=true -cls com.lucidworks.hadoop.ingest.CSVIngestMapper -c labs -i csv/* -of com.lucidworks.hadoop.io.LWMapRedOutputFormat -zk localhost:2181

### [](#step-8---search-indexed-documents)Step 8 – Search indexed documents

*   Search the indexed documents. Using the browser, visit the url [http://sandbox.hortonworks.com:8984/solr/labs/select?q=*:*](http://sandbox.hortonworks.com:8984/solr/labs/select?q=*:*)
*   You will see search results like below

![Image](/assets/search-with-solr/solr-query.png)

### [](#summary)Summary

In this tutorial we have explored how to:

*   Store Solr indexes in HDFS
*   Create a Solr Cluster
*   Index documents in HDFS using Solr Hadoop connectors
