In this tutorial, we’ll focus on taking advantage of improvements to [Apache Hive](http://hortonworks.com/hadoop/hive) and [Apache Tez](http://hortonworks.com/hadoop/tez) through the work completed by the community as part of the [Stinger initiative](http://hortonworks.com/labs/stinger). 

In this tutorial, we are going to look at some of the new features that Hive on Tez brings to HDP 2.3:

*   Performance improvements of Hive on Tez
*   Performance improvements of Vectorized Query
*   Cost-based Optimization Plans
*   Multi-tenancy with HiveServer2
*   SQL Compliance Improvements

## Prerequisites

A working HDP cluster – the easiest way to have a HDP cluster is to download the [HDP Sandbox](http://hortonworks.com/sandbox) 

### Download data

The dataset that we will need for this tutorial is [here](http://s3.amazonaws.com/hw-sandbox/tutorial14/SensorFiles.zip). Please download and save the file in a folder on your local machine.

Once you unzip the zip file – SensorFiles.zip, you will see the following files inside. We will be using these datafiles for the following tutorial.

![](../../../assets/2-3/realtime-queries-hive-on-tez/dataset%20on%20local%20folder.JPG)

Let’s use the above two csv files (HVAC.csv & building.csv) to create two new tables using the following step. Navigate to [http://sandbox.hortonworks.com:8080](http://sandbox.hortonworks.com:8080) using your browser. Click the **HDFS Files** view from the dropdown menu.

~~~HDFS FILES VIEW~~~![](../../../assets/2-3/realtime-queries-hive-on-tez/create%20table%20screen.JPG)

Go to the `/tmp` folder and if it is not already present, create a new directory called `data` using the controls toward the top of the screen. Then right click on the folder and click **Permissions**. Make sure to check (blue) all of the permissions boxes.

~~~PERMISSIONS PIC~~

Now, let’s upload the above datafiles into HDFS and create two hive tables using the following steps.

Upload the two files under `/tmp/data` using **Upload** at the top of the screen

~~PIC of Uploaded files~~~

Now head on over to the Hive view

~~~PIC OF HIVE VIEW~~~

We will now use hive and create the two tables. They will be named per the csv file names : “hvac” and “building”.

Use the following two queries to create the tables a then load the data

~~~
create table building
(BuildingID int,
 BuildingMgr string,
 BuildingAge string,
 HVACproduct string,
 Country string) 
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
STORED AS TEXTFILE
TBLPROPERTIES("skip.header.line.count"="1");
~~~

~~~
create table hvac (
recorddate string,
Time string,
TargetTemp int,
ActualTemp int,
System int,
SystemAge int,
BuildingID int) 
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
STORED AS TEXTFILE
TBLPROPERTIES("skip.header.line.count"="1");
~~~

~~~PIC OF tables IN DB EXPLORER~~~ ![](../../../assets/2-3/realtime-queries-hive-on-tez/hvac%20table%20naming.JPG)

We're are now going to load the data into the two tables using the `LOAD DATA INPATH` Hive command


~~~
LOAD DATA INPATH '/tmp/data/HVAC.csv' OVERWRITE INTO TABLE hvac;
~~~

~~~
LOAD DATA INPATH '/tmp/data/building.csv' OVERWRITE INTO TABLE building;
~~~

You should now be able to obtain results when selecting small amounts of data from either table

~~~SELECT * LIMIT~~~![](../../../assets/2-3/realtime-queries-hive-on-tez/data%20mapping.JPG)

## Speed Improvements

To take a look at the speed improvements of Hive on Tez, we can run some sample queries. For this we will use the above two tables – hvac and building.

By default, the Hive view runs with Tez as it's execution engine. That's because Tez has great speed improvements over the original MapReduce execution engine. But by how much exactly are these improvements? Well let's find out!

### Step 1 :

First you'll we're going to need to click on the Hive view **Settings** tab. Then we're going to need to add a new setting.

~~~PIC OF SETTINGS TAB WITH BLANK EDITOR~~~

Then we're going to need to find the property which is `hive.execution.engine`. Select this property and then for it's value select, `mr` (short for MapReduce).

~~~IMG OF PROPERTY SET~~~![Image hive](../../../assets/2-3/realtime-queries-hive-on-tez/run%20Hive.JPG)

### Step 2:

We are now going to test a query using MapReduce as our execution engine. Execute the following query and wait for the results.

~~~
select h.*, b.country, b.hvacproduct, b.buildingage, b.buildingmgr 
from building b join hvac h 
on b.buildingid = h.buildingid;
~~~

~~~IMG OF QUERY~~~![enter image description here](../../../assets/2-3/realtime-queries-hive-on-tez/map%20reduce%20job%20without%20tez.JPG)

This query was run using the MapReduce framework.

### Step 3 :

Now we can enable Hive on Tez execution and take advantage of Directed Acyclic Graph (DAG) execution representing the query instead of multiple stages of MapReduce program which involved a lot of synchronization, barriers and IO overheads. This is improved in Tez, by writing intermediate data set into memory instead of hard disk.

Head back to the **Settings** in the Hive view and now change the `hive.execution.engine` to `tez`.

### Step 4 :

Run the same query as we had run earlier in Step 2, to see the speed improvements with Tez.

~~~
select h.*, b.country, b.hvacproduct, b.buildingage, b.buildingmgr 
from building b join hvac h 
on b.buildingid = h.buildingid;
~~~

~~~same image as above~~~![enter image description here](../../../assets/2-3/realtime-queries-hive-on-tez/Hive%20on%20Tez.JPG)

Check the output of this job. It shows the usage of the containers.  
Here is the rest of the output log:

~~TEZ LOGS~~~![enter image description here](../../../assets/2-3/realtime-queries-hive-on-tez/hive%20on%20tez%20time%20taken.JPG)

You should notice that the results will have appeared much quicker while having the execution engine set to Tez. This is currently the default for all Hive queries.

Congratulations! You have successfully run your Hive on Tez Job.

### Step 5:

Now let’s try a new query to work with

~~~
select a.buildingid, b.buildingmgr, max(a.targettemp-a.actualtemp)
from hvac a join building b
on a.buildingid = b.buildingid
group by a.buildingid, b.buildingmgr;
~~~

Try executing the query first on MapReduce execution engine, then on Tez. You should notice a considerable gap in execution time

Here is the result.

![](../../../assets/2-3/realtime-queries-hive-on-tez/rerun%20tez%20query.JPG)

To experience this further, you could use your own dataset, upload to your HDP Sandbox using steps above and execute with and without Tez to compare the difference.

### Step 6:

You can track your Hive on Tez jobs in HDP Sandbox Web UI as well. Please go to : [http://127.0.0.1:8088/cluster](http://127.0.0.1:8088/cluster) and track your jobs while running or post to see the details.

~~~KEEP THIS ONE~~~ ![enter image description here](../../../assets/2-3/realtime-queries-hive-on-tez/UI%20Tracking.JPG)

You can click on your job and see further details.

## Stats & Cost Based Optimization (CBO)

Cost Based Optimization(CBO) engine uses statistics within Hive tables to produce optimal query plans.

### Benefits of CBO:

1.  Reduces need of a specialists to tune queries
2.  More efficient query plans lead to better cluster utilization

### Types of Stats

There are two types of stats which could be collected so that the optimizer could use it in the decision making process :

1.  Table Stats
2.  Column Stats

The ‘explain’ plan feature can be used to see if the correct stats are being used.

    Note : CBO requires column stats. 

### Phases in which stats could be collected

1.  While data is inserted:`hive.stats.autographer =  [true,  **false**]`
2.  On existing data : table level`ANALYZE TABLE table [partion(key)] COMPUTE STATISTICS;`
3.  On existing data : column level`ANALYZE TABLE table [partion(key)] COMPUTE STATISTICS FOR COLUMNS col1,col2,...;`

### Configuration to make CBO effective for your query

1.  `hive.compute.query.using.stats =  [true,  **false**];`
2.  `hive.stats.fetch.column.stats =  [true,  **false**];`
3.  `hive.stats.fetch.partition.stats =  [true,  **false**];`
4.  `hive.cbo.enable =  [true,  **false**];`

### Step 1:

Let’s do a simple exercise. Let’s run the following query and see how long it takes.

~~~
select buildingid, max(targettemp-actualtemp) from hvac_orc group by buildingid;
~~~

Please note down the time taken.

### Step 2:

Now, let’s explain the above query in Step 1.

![enter image description here](../../../assets/2-3/realtime-queries-hive-on-tez/hive%20without%20CBO.JPG)

Please note the the CBO feature is not used. You will see that Basic stats is None in the ‘explain’ plan.

### Step 3:

Now, we will tune the same query so that it uses Cost Based Optimization (CBO). Let’s collect statistics on the table hvac.

~~~
analyze table hvac_orc compute statistics;
~~~

![enter image description here](../../../assets/2-3/realtime-queries-hive-on-tez/compute%20stats%20cbo.JPG)

You are using Tez execution engine.

### Step 4:

Let’s collect statistics of a few columns in this table hvac. To use CBO, column level statistics are required.

~~~
analyze table hvac_orc compute statistics for columns targettemp, actualtemp, buildingid;
~~~

![enter image description here](../../../assets/2-3/realtime-queries-hive-on-tez/analyze%20column.JPG)

### Step 5:

Now let’s set the 4 settings in hive as follows and run explain on the query.

![enter image description here](../../../assets/2-3/realtime-queries-hive-on-tez/hive%20with%20cbo.JPG)

Note that the Plan says that it is using stats now.

### Step 6:

Let’s rerun the query now and observe if it runs faster. You will see better gain with a good volume of dataset than the one we are working with.

~~~
select buildingid, max(targettemp-actualtemp) from hvac_orc group by buildingid;
~~~

Please note down total time taken and compare to Step 1.

## Multi-tenancy with HiveServer2

There could be contentions when multiple users run large queries simultaneously. Processing queries with many containers could lead to lower latency. For this, 3 controls could be put in place:

*   Container re-use timeout
*   Tez split wave tuning
*   Round Robin Queuing setup

### Diagnose: Job Viewer

Hive Job Viewer available in Ambari is a simple exploration and troubleshooting Graphical tool for Hive jobs.

The purposes of this Job Viewer are as follows:

*   Visualize execution DAG
*   Drill Down into individual stages for:
    *   Execution status
    *   Duration
    *   Number of bytes read and written, No of containers, etc.  
        DAG Viewer is releasing soon, which will be available in Ambari.

To see the job executions visually, you can follow these steps:

### Step 1:

Please go to your Web UI using [http://127.0.0.1:8000/about/](http://127.0.0.1:8000/about/) and turn on Ambari. If needed, you might have to add more memory to your VM. Once Ambari is turned on, you will see the following screen.

![Image](../../../assets/2-3/realtime-queries-hive-on-tez/Ambari.JPG)

### Step 2:

Now, go to hive terminal and execute any simple query.

~~~
select count(*)  from hvac;`
~~~

### Step 3:

Please go to the following Ambari URL to view the job execution visually.

~~~
http://127.0.0.1:8080/#/login
~~~

Enter username as “admin” and password as “admin”.  
![enter image description here](../../../assets/2-3/realtime-queries-hive-on-tez/Ambari.JPG)

### Step 4:

In the following screen, please go to the Jobs tab:  
![enter image description here](../../../assets/2-3/realtime-queries-hive-on-tez/ambari%20screen.JPG)

### Step 5:

You will see your jobs that you have run in Step 2 or earlier. Please click on any of your jobs.  
![enter image description here](../../../assets/2-3/realtime-queries-hive-on-tez/Ambari%20Jobs.JPG)

### Step 6:

You will see here the job execution visually. You can click on various datapoints and get further details.

![enter image description here](../../../assets/2-3/realtime-queries-hive-on-tez/Ambari%20DAG.JPG)

## SQL Compliance

There are several SQL query enhancements in this version of Hive.

### Query Enhancements Support extensions:

*   Expanded Join Semantics – Supports from table1, table2 where table1.col1=table2.col2
*   IN, NOT IN subqueries in WHERE Clause
*   EXISTS and NOT EXISTS
*   Correlated Subqueries with equality operation only
*   Common Table Expressions (CTE)
*   The CHAR datatype – trailing White Space

### Authorization System enhancements:

*   SQL Authorizations : Actions
    *   Grant/Revoke
        *   Create
        *   Insert
        *   Select
        *   Drop
        *   Delete
        *   All
            *   Create Roles & Grant with admin option
            *   Using views to restrict data visibility

We will go into these in much more details in a later tutorial.

