## A Lap Around Spark with HDP

This Apache Spark 1.3.1 with HDP 2.3 guide walks you through many of the newer features of Apache Spark 1.3.1 on YARN.

Hortonworks recently announced general availability of Spark 1.3.1 on the HDP platform. Apache Spark is a fast moving community and Hortonworks plans frequent releases to allow evaluation and production use of the latest capabilities of Apache Spark on HDP for our customers.

With YARN, Hadoop can now support many types of data and application workloads; Spark on YARN becomes yet another workload running against the same set of hardware resources.

This guide describes how to:

*   Run Spark on YARN and run the canonical Spark examples: SparkPi and Wordcount.
*   Run Spark 1.3.1 on HDP 2.3.
*   Use Spark DataFrame API
*   Work with a built-in UDF, collect_list, a key feature of Hive 13\. This release provides support for Hive 0.13.1 and instructions on how to call this UDF from Spark shell.
*   Use SparkSQL thrift JDBC/ODBC Server.
*   View history of finished jobs with Spark Job History.
*   Use ORC files with Spark, with examples.

When you are ready to go beyond these tasks, try the machine learning examples at Apache Spark.

### HDP Cluster Requirement

Spark 1.3.1 can be configured on any HDP 2.3 cluster whether it is a multi node cluster or a single node HDP Sandbox.

The instructions in this guide assumes you are using the latest Hortonworks Sandbox

### Run the Spark Pi Example

To test compute intensive tasks in Spark, the Pi example calculates pi by “throwing darts” at a circle. The example points in the unit square ((0,0) to (1,1)) and sees how many fall in the unit circle. The fraction should be pi/4, which is used to estimate Pi.

To calculate Pi with Spark:

1.  **Change to your Spark directory and become spark OS user:**



          cd /usr/hdp/current/spark-client  

          su spark



1.  **Run the Spark Pi example in yarn-client mode:**



./bin/spark-submit --class org.apache.spark.examples.SparkPi --master yarn-client --num-executors 3 --driver-memory 512m --executor-memory 512m --executor-cores 1 lib/spark-examples*.jar 10



**Note:** The Pi job should complete without any failure messages and produce output similar to below, note the value of Pi in the output message:  
![](/assetsa-lap-around-spark/Screenshot%202015-07-20%2014.48.48.png?dl=1)

### Using WordCount with Spark

#### Copy input file for Spark WordCount Example

Upload the input file you want to use in WordCount to HDFS. You can use any text file as input. In the following example, log4j.properties is used as an example:

As user spark:



    hadoop fs -copyFromLocal /etc/hadoop/conf/log4j.properties /tmp/data



### Run Spark WordCount

To run WordCount:

#### Run the Spark shell:



    ./bin/spark-shell --master yarn-client --driver-memory 512m --executor-memory 512m



Output similar to below displays before the Scala REPL prompt, scala>:  
![](/assetsa-lap-around-spark/Screenshot%202015-07-20%2014.50.31.png?dl=1)

#### At the Scala REPL prompt enter:



    val file = sc.textFile("/tmp/data")

    val counts = file.flatMap(line => line.split(" ")).map(word => (word, 1)).reduceByKey(_ + _)

    counts.saveAsTextFile("/tmp/wordcount")



##### Viewing the WordCount output with Scala Shell

To view the output in the scala shell:



    counts.count()



![](/assetsa-lap-around-spark/Screenshot%202015-07-20%2014.55.13.png?dl=1)

To print the full output of the WordCount job:



    counts.toArray().foreach(println)



![](/assetsa-lap-around-spark/Screenshot%202015-07-20%2014.57.10.png?dl=1)

##### Viewing the WordCount output with HDFS

To read the output of WordCount using HDFS command:  
Exit the scala shell.



    exit



    View WordCount Results:



    hadoop fs -ls /tmp/wordcount



It should display output similar to:

![](/assetsa-lap-around-spark/Screenshot%202015-07-20%2014.58.22.png?dl=1)

Use the HDFS cat command to see the WordCount output. For example,



    hadoop fs -cat /tmp/wordcount/part-00000



![](/assetsa-lap-around-spark/Screenshot%202015-07-20%2014.59.10.png?dl=1)

##### Using Spark DataFrame API

With Spark 1.3.1, DataFrame API is a new feature. DataFrame API provide easier access to data since it looks conceptually like a Table and a lot of developers from Python/R/Pandas are familiar with it.

Let's upload people text file to HDFS



    cd /usr/hdp/current/spark-client



    su spark

    hdfs dfs -copyFromLocal examples/src/main/resources/people.txt people.txt



    hdfs dfs -copyFromLocal examples/src/main/resources/people.json people.json



![](/assetsa-lap-around-spark/Screenshot%202015-07-20%2015.01.49.png?dl=1)

Then let's launch the Spark Shell



    cd /usr/hdp/current/spark-client

    su spark

    ./bin/spark-shell --num-executors 2 --executor-memory 512m --master yarn-client



    At the Spark Shell type the following:



    val df = sqlContext.jsonFile("people.json")



This will produce and output such as

![](/assetsa-lap-around-spark/Screenshot%202015-07-20%2015.04.33.png?dl=1)

**Note:** The highlighted output shows the inferred schema of the underlying people.json.

Now print the content of DataFrame with df.show



    df.show



![](/assetsa-lap-around-spark/Screenshot%202015-07-20%2015.06.29.png?dl=1)

##### Data Frame API examples



    import org.apache.spark.sql.functions._ 

    // Select everybody, but increment the age by 1

    df.select(df("name"), df("age") + 1).show()



![](/assetsa-lap-around-spark/Screenshot%202015-07-20%2015.13.59.png?dl=1)



    // Select people older than 21

    df.filter(df("age") > 21).show()



![](/assetsa-lap-around-spark/Screenshot%202015-07-20%2015.14.47.png?dl=1)



    // Count people by age

    df.groupBy("age").count().show()



![](/assetsa-lap-around-spark/Screenshot%202015-07-20%2015.15.41.png?dl=1)

##### Programmatically Specifying Schema



    import org.apache.spark.sql._ 

    val sqlContext = new org.apache.spark.sql.SQLContext(sc)

    val people = sc.textFile("people.txt")

    val schemaString = "name age"

    import org.apache.spark.sql.types.{StructType,StructField,StringType} 

    val schema = StructType(schemaString.split(" ").map(fieldName => StructField(fieldName, StringType, true)))



![](/assetsa-lap-around-spark/Screenshot%202015-07-20%2015.18.02.png?dl=1)



    val rowRDD = people.map(_.split(",")).map(p => Row(p(0), p(1).trim))

    val peopleDataFrame = sqlContext.createDataFrame(rowRDD, schema)

    peopleDataFrame.registerTempTable("people")

    val results = sqlContext.sql("SELECT name FROM people")

    results.map(t => "Name: " + t(0)).collect().foreach(println)



This will produce an output like

![](/assetsa-lap-around-spark/Screenshot%202015-07-20%2015.19.49.png?dl=1)

### Running Hive 0.13.1 UDF

Hive 0.13.1 provides a new built-in UDF collect_list(col) which returns a list of objects with duplicates.  
The below example reads and write to HDFS under Hive directories. In a production environment one needs appropriate HDFS permission. However for evaluation you can run all this section as hdfs user.

Before running Hive examples run the following steps:

#### Launch Spark Shell on YARN cluster



    su hdfs
    
    //If not already in spark-client directory, change to that directory to run spark shell
    cd /usr/hdp/current/spark-client

    ./bin/spark-shell --num-executors 2 --executor-memory 512m --master yarn-client



#### Create Hive Context



    val hiveContext = new org.apache.spark.sql.hive.HiveContext(sc)



You should see output similar to the following:

![](/assetsa-lap-around-spark/Screenshot%202015-07-20%2015.24.12.png?dl=1)

#### Create Hive Table



    hiveContext.sql("CREATE TABLE IF NOT EXISTS TestTable (key INT, value STRING)")



You should see output similar to the following:

![](/assetsa-lap-around-spark/Screenshot%202015-07-20%2015.25.34.png?dl=1)

#### Load example KV value data into Table



    scala> hiveContext.sql("LOAD DATA LOCAL INPATH 'examples/src/main/resources/kv1.txt' INTO TABLE TestTable")



You should see output similar to the following:

![](/assetsa-lap-around-spark/Screenshot%202015-07-20%2015.26.53.png?dl=1)

#### Invoke Hive collect_list UDF



    hiveContext.sql("from TestTable SELECT key, collect_list(value) group by key order by key").collect.foreach(println)



You should see output similar to the following:

![](/assetsa-lap-around-spark/Screenshot%202015-07-21%2010.40.04.png?dl=1)

### Read & Write ORC File Example

In this tech preview, we have implemented full support for ORC files with Spark. We will walk through an example that reads and write ORC file and uses ORC structure to infer a table.

### ORC File Support

#### Create a new Hive Table with ORC format



    hiveContext.sql("create table orc_table(key INT, value STRING) stored as orc")



#### Load Data into the ORC table



    hiveContext.sql("INSERT INTO table orc_table select * from testtable")



#### Verify that Data is loaded into the ORC table



    hiveContext.sql("FROM orc_table SELECT *").collect().foreach(println)



![](/assetsa-lap-around-spark/Screenshot%202015-07-21%2010.42.11.png?dl=1)

#### Read ORC Table from HDFS as HadoopRDD**



    val inputRead = sc.hadoopFile("/apps/hive/warehouse/orc_table", classOf[org.apache.hadoop.hive.ql.io.orc.OrcInputFormat],classOf[org.apache.hadoop.io.NullWritable],classOf[org.apache.hadoop.hive.ql.io.orc.OrcStruct])



![](/assetsa-lap-around-spark/Screenshot%202015-07-21%2010.45.03.png?dl=1)

#### Verify we can manipulate the ORC record through RDD



    val k = inputRead.map(pair => pair._2.toString)

    val c = k.collect



You should see output similar to the following:

![](/assetsa-lap-around-spark/Screenshot%202015-07-21%2010.46.20.png?dl=1)

#### **Copy example table into HDFS**



    cd /usr/hdp/current/spark-client

    su spark

    hadoop dfs -put examples/src/main/resources/people.txt people.txt



#### Run Spark-Shell



    ./bin/spark-shell --num-executors 2 --executor-memory 512m --master yarn-client



on Scala prompt type the following, except for the comments



    import org.apache.spark.sql.hive.orc._ 

    import org.apache.spark.sql._ 

    import org.apache.spark.sql.types.{StructType,StructField,StringType} 

    val hiveContext = new org.apache.spark.sql.hive.HiveContext(sc)



![](/assetsa-lap-around-spark/Screenshot%202015-07-21%2010.54.29.png?dl=1)

Load and register the spark table



    val people = sc.textFile("people.txt")

    val schemaString = "name age"

    val schema = StructType(schemaString.split(" ").map(fieldName => StructField(fieldName, StringType, true)))

    val rowRDD = people.map(_.split(",")).map(p => Row(p(0), new Integer(p(1).trim)))



![](/assetsa-lap-around-spark/Screenshot%202015-07-21%2013.35.47.png?dl=1)

Infer table schema from RDD



    val peopleSchemaRDD = hiveContext.applySchema(rowRDD, schema)



![](/assetsa-lap-around-spark/Screenshot%202015-07-21%2013.37.06.png?dl=1)

Create a table from schema



    peopleSchemaRDD.registerTempTable("people")

    val results = hiveContext.sql("SELECT * FROM people")

    results.map(t => "Name: " + t.toString).collect().foreach(println)



![](/assetsa-lap-around-spark/Screenshot%202015-07-21%2013.43.49.png?dl=1)

Save Table to ORCFile



    //For Spark 1.3.1, use
    peopleSchemaRDD.saveAsOrcFile("people.orc")
    
    //For Spark 1.4.1, use
    peopleSchemaRDD.write.format("orc").save("peopleSchemaRDD")



Create Table from ORCFile



    //For Spark 1.3.1, use
    val morePeople = hiveContext.orcFile("people.orc")
    
    //For Spark 1.4.1, use
    val morePeople = hiveContext.read.format("orc").load("morePeople")
    
    morePeople.registerTempTable("morePeople")



![](/assetsa-lap-around-spark/Screenshot%202015-07-21%2013.46.51.png?dl=1)

Query from the table



    hiveContext.sql("SELECT * from morePeople").collect.foreach(println)



![](/assetsa-lap-around-spark/Screenshot%202015-07-21%2013.47.58.png?dl=1)

### SparkSQL Thrift Server for JDBC/ODBC access

With this release SparkSQL’s thrift server provides JDBC access to SparkSQL.

1.  **Start Thrift Server**  
    From SPARK_HOME, start SparkSQL thrift server, Note the port value of the thrift JDBC server



        su spark

        ./sbin/start-thriftserver.sh --master yarn-client --executor-memory 512m --hiveconf hive.server2.thrift.port=10001



*   **Connect to Thrift Server over beeline**  
    Launch beeline from SPARK_HOME



        su spark

        ./bin/beeline



*   **Connect to Thrift Server & Issue SQL commands**  
    On beeline prompt



        !connect jdbc:hive2://localhost:10001



Note this is example is without security enabled, so any username password should work.

Note, the connection may take a few second to be available and try show tables after a wait of 10-15 second in a Sandbox env.



      show tables;



![](/assetsa-lap-around-spark/Screenshot%202015-07-21%2013.53.04.png?dl=1)

type `Ctrl+C` to exit beeline.

*   **Stop Thrift Server**



        ./sbin/stop-thriftserver.sh



![](/assetsa-lap-around-spark/Screenshot%202015-07-21%2013.55.40.png?dl=1)

### Spark Job History Server

Spark Job history server is integrated with YARN’s Application Timeline Server(ATS) and publishes job metrics to ATS. This allows job details to be available after the job finishes.

1.  **Start Spark History Server**



        ./sbin/start-history-server.sh



You can let the history server run, while you run examples and go to YARN resource manager page at [http://127.0.0.1:8088/cluster/apps](http://127.0.0.1:8088/cluster/apps) and see the logs of finished application with the history server.

1.  **Stop Spark History Server**



        ./sbin/stop-history-server.sh



![](/assetsa-lap-around-spark/Screenshot%202015-07-21%2014.00.10.png?dl=1)

Visit [http://hortonworks.com/tutorials](http://hortonworks.com/tutorials) for more tutorials on Apache Spark.

