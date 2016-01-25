### [](#overview)Overview

Hive is designed to enable easy data summarization and ad-hoc analysis of large volumes of data. It uses a query language called Hive-QL which is similar to SQL.

In this tutorial, we will explore the following:

1.  Load a data file into a Hive table
2.  Create a table using RCFormat
3.  Query tables
4.  Managed tables vs external tables
5.  ORC format
6.  PARTITIONED a Table
7.  Bucketing a Table

### [](#prerequisites)Prerequisites

A working HDP cluster – the easiest way to have a HDP cluster is to download the [Hortonworks Sandbox](http://hortonworks.com/sandbox).

### [](#step-1-lets-load-a-data-file-into-a-hive-table)Step 1\. Let’s load a data file into a Hive table.

First of all, download data file from here [click here](http://hortonassets.s3.amazonaws.com/tutorial/hive/Twitterdata.txt) and name the file as TwitterData.txt .

As the file is small, you can simply open it, copy and create a local file in the sandbox manually as well.

We will use the Ambari UI here.

Open [http://localhost:8080](http://localhost:8080) in your browser.

Now, click on the HDFS Files button from the Off-canvas menu at the top and you will see the following screen.

![](/assetsusing-hive-for-data-analysis/68747470733a2f22f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138616d30314d6d52695a444a714e6b453f7261773d74727565.png?dl=1)

Navigate to the `` folder.

![](/assetsusing-hive-for-data-analysis/68747470733a2f24f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071384d30524957554a5a543168786155303f7261773d74727565.png?dl=1)

Now click on Upload option and select file `` from your computer.

![](/assetsusing-hive-for-data-analysis/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713853454a5a636e453158334e46646a413f7261773d74727565.png?dl=1)

Here is a sample syntax to create a table and load datafile into the table.

Let’s create this table and load data.  
For this we can use ``.

Open the `` by clicking on the Hive button in the views menu.

![](/assetsusing-hive-for-data-analysis/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713853454a5a636e453158334e46646a413f7261773d74727565.png?dl=1)

And type into the composition area the following query:

     ROW FORMAT DELIMITED
        FIELDS TERMINATED BY


To query sample data of your previously created table click the icon next to the table name, it executes a select query.

![](/assetsusing-hive-for-data-analysis/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713858305a56556e68435555524e6447633f7261773d74727565.png?dl=1)

### [](#step-2-lets-create-a-table-using-rcfile-format)Step 2\. Let’s create a table using RCfile format

Record Columnar(RC) format determines how to store relational tables on distributed computer clusters. With this format, you can get the advantages of a columnar format over row format of a record.

Here is a sample Create RC file format table syntax:

     ROW FORMAT DELIMITED
        FIELDS TERMINATED BY

![](/assetsusing-hive-for-data-analysis/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138546b4e4d525864544e446842646b553f7261773d74727565.png?dl=1)

Here is the step on how to Load Data into the RC Table. Please execute and see the results.


![](/assetsusing-hive-for-data-analysis/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713862585a576131394b4d45524a4f44513f7261773d74727565.png?dl=1)

Run the sample select query again.

![](/assetsusing-hive-for-data-analysis/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138635535315a46684e61556731617a413f7261773d74727565.png?dl=1)

### [](#step-3-lets-query-the-table-we-just-created)Step 3\. Let’s query the table we just created.

Let’s find top 10 countries who tweeted most using TwitterExampleRCtable.


Please see the following log and the results:

![](/assetsusing-hive-for-data-analysis/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138536b6452536b737856555a335a7a673f7261773d74727565.png?dl=1)

### [](#step-4-lets-look-at-managed-tables-vs-external-tables)Step 4\. Let’s look at Managed tables vs External tables

Managed tables are created by default with CREATE TABLE statements, whereas External tables are used when you want your tables to point to data files in place, therefore it has to be a folder you point to.

Here is the syntax for creating these tables.

Managed:

     ROW FORMAT DELIMITED
        FIELDS TERMINATED BY

![](/assetsusing-hive-for-data-analysis/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713854466c3564323534516b6c4e5958633f7261773d74727565.png?dl=1)

For the External table we need to create a new directory **/tmp/admin** and Upload Twitterdata.txt.

![](/assetsusing-hive-for-data-analysis/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713859555a6a574331664e6d4e42646d4d3f7261773d74727565.png?dl=1)

Before we create the table and load the data in it, we have to change the permission for the **/tmp/admin** folder.  
Open the HDFS view and navigate to ``.  
Right click on admin and select **Permissions**:

![](/assetsusing-hive-for-data-analysis/68747470733a2f2f77767772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071385331464f5133567a526a52716558633f7261773d74727565.png?dl=1)

Now check the `` and press save.

![](/assetsusing-hive-for-data-analysis/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071384d33557a4e693171636e426a516d633f7261773d74727565.png?dl=1)

Verify that the permissions look now like this:

![](/assetsusing-hive-for-data-analysis/68747470733a2f2f77477772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713854475a716345395252316876596d633f7261773d74727565.png?dl=1)

External:

     ROW FORMAT DELIMITED
        FIELDS TERMINATED BYTEXTFILE
        location

![](/assetsusing-hive-for-data-analysis/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071384d7a466e5a6b5a33516e686e52306b3f7261773d74727565.png?dl=1)

Also, when you drop a Managed table, it deletes the metadata, and it also deletes the data.

When you drop an External table, it only deletes the metadata.

By creating a **managed table** the file you load in is moved to that means that the data is controlled by hive.

Whereas the **external tables** points to the **/tmp/admin** directory in which we put the Twitterdata.txt.  
If we run the sample query you should see the data from this file.

![](/assetsusing-hive-for-data-analysis/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713854545574524652505544457a4d55453f7261773d74727565.png?dl=1)

As a next step, you could describe the above tables as below and compare the output with managed vs. external tables.


![](/assetsusing-hive-for-data-analysis/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713854545574524652505544457a4d55453f7261773d74727565.png?dl=1)


![](/assetsusing-hive-for-data-analysis/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713856554a3263444653593039745231553f7261773d74727565.png?dl=1)

### [](#step-5-hive-orc-file-format)Step 5\. Hive ORC File format.

Optimized Row Columnar (ORC) File format is used as it further compresses data files. It could result in a small performance loss in writing, but there will be huge performance gain in reading.

Let’s try it out. Please see that the table is stored as ORC.

     ROW FORMAT DELIMITED
        FIELDS TERMINATED BY

![](/assetsusing-hive-for-data-analysis/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071384c586c68636e426864554a494e55453f7261773d74727565.png?dl=1)

### [](#step-6-lets-create-a-partitioned-table-and-load-data-into)Step 6\. Let’s create a PARTITIONED Table and load data into

Partitions are horizontal slices of data which allow large sets of data to be segmented into more manageable blocks.  
Here is the sample syntax to create a partitioned table and load data into partitions.

     ROW FORMAT DELIMITED FIELDS 
        TERMINATED BY

![](/assetsusing-hive-for-data-analysis/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071384e6d6c3656486c51526d685164566b3f7261773d74727565.png?dl=1)

![](/assetsusing-hive-for-data-analysis/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713861456c7a4e304e6a566d704751556b3f7261773d74727565.png?dl=1)

Let’s execute the sample query to check if it’s been overwritten correctly.

![](/assetsusing-hive-for-data-analysis/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071386156466a63474e4c576c684f617a673f7261773d74727565.png?dl=1)

### [](#step-7-lets-create-a-table-with-buckets)Step 7\. Let’s create a table with Buckets.

Bucketing is a technique that allows to cluster or segment large sets of data to optimize query performance.

Here is an example for creating a table with buckets and load data into it.



    BUCKETS
    ROW FORMAT DELIMITED
    FIELDS TERMINATED BY



![](/assetsusing-hive-for-data-analysis/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138516a4e466347394664305a325544413f7261773d74727565.png?dl=1)


![](/assetsusing-hive-for-data-analysis/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138613039444f5870554c5745744d6b453f7261773d74727565.png?dl=1)

Here is a reference when you executed a sample query.

![](/assetsusing-hive-for-data-analysis/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713862477866516a5679646c4e4b6457633f7261773d74727565.png?dl=1)

You can go to hdfs folder and see the directory structure behind these Hive tables that you have just created. That could help you to design your tables and file distributions which is very important in designing your warehouse.

Hope, this was helpful and simple enough to give you a glimpse of the Hive world.  

