### **Spark 1.3.1 Technical Preview – with HDP 2.2**

This Spark Technical preview lets you evaluate Apache Spark 1.3.1 on YARN with HDP 2.2.

Hortonworks recently announced general availability of Spark 1.2.1 on the HDP platform. Apache Spark is a fast moving community and Hortonworks plans to release technical previews to allow evaluation of the latest Spark technology on HDP for our customers.

With YARN, Hadoop can now support various types of workloads; Spark on YARN becomes yet another workload running against the same set of hardware resources.

This technical preview describes how to:

*   Run Spark on YARN and run the canonical Spark examples: SparkPi and Wordcount.
*   Run Spark 1.3.1 on HDP 2.2.
*   Use Spark DataFrame API
*   Work with a built-in UDF, collect_list, a key feature of Hive 13\. This technical preview provides support for Hive 0.13.1 and instructions on how to call this UDF from Spark shell.
*   Use SparkSQL thrift JDBC/ODBC Server.
*   View history of finished jobs with Spark Job History.
*   Use ORC files with Spark, with examples.

When you are ready to go beyond these tasks, try the machine learning examples at Apache Spark.

#### **HDP Cluster Requirement:**

This technical preview can be installed on any HDP 2.2.x cluster whether it is a multi node cluster or a single node HDP Sandbox.

### **Installing**

The Spark 1.3.1 Technical Preview is provided as an RPM/DEB/MSI packaging. The instructions in this doc assume RPM.

#### **Download the latest RPM repo that has Spark 1.3.1**

    wget -nv http://public-repo-1.hortonworks.com/HDP/centos6/2.x/updates/2.2.4.4/hdp.repo -O /etc/yum.repos.d/HDP-TP.repo

#### **Install Spark Package**

    yum install spark_2_2_4_4_16-master

This will download Spark 1.3.1 RPM and setup on your HDP 2.2 cluster. As part of this RPM install it will also download necessary core Hadoop dependencies.

If you want to use PySpark you also need to run

    yum install spark-python

#### **Use HDP-Select to point to this Spark package**

    hdp-select set spark-historyserver 2.2.4.4-16
    hdp-select set spark-client 2.2.4.4-16

This will set the /usr/hdp/current/spark-client & /usr/hdp/current/spark-historyserver dirs to point to the version selected with hdp-select.

    lrwxrwxrwx. 1 root root 25 May 12 18:11 /usr/hdp/current/spark-client -> /usr/hdp/2.2.4.4-16/spark
    lrwxrwxrwx. 1 root root 25 May 12 18:20 /usr/hdp/current/spark-historyserver -> /usr/hdp/2.2.4.4-16/spark

The rpm installer will create “spark” as OS user and create /user/spark directory in HDFS.

### **Run the Spark Pi Example**

To test compute intensive tasks in Spark, the Pi example calculates pi by “throwing darts” at a circle. The example points in the unit square ((0,0) to (1,1)) and sees how many fall in the unit circle. The fraction should be pi/4, which is used to estimate Pi.

To calculate Pi with Spark:

1.  **Change to your Spark directory and become spark OS user:**

        cd /usr/hdp/current/spark-client
        su spark

2.  **Run the Spark Pi example in yarn-client mode:**

        ./bin/spark-submit --class org.apache.spark.examples.SparkPi --master yarn-client --num-executors 3 --driver-memory 512m --executor-memory 512m --executor-cores 1 lib/spark-examples*.jar 10

    **Note:** The Pi job should complete without any failure messages and produce output similar to below, note the value of Pi in the output message:

        15/05/12 18:54:28 INFO TaskSetManager: Finished task 8.0 in stage 0.0 (TID 8) in 31 ms on green3 (8/10)
        15/05/12 18:54:28 INFO TaskSetManager: Finished task 9.0 in stage 0.0 (TID 9) in 41 ms on green3 (9/10)
        15/05/12 18:54:29 INFO TaskSetManager: Finished task 2.0 in stage 0.0 (TID 2) in 2714 ms on green3 (10/10)
        15/05/12 18:54:29 INFO YarnScheduler: Removed TaskSet 0.0, whose tasks have all completed, from pool
        15/05/12 18:54:29 INFO DAGScheduler: Stage 0 (reduce at SparkPi.scala:41) finished in 2.747 s
        Pi is roughly 3.14054
        15/05/12 18:54:29 INFO DAGScheduler: Job 0 finished: reduce at SparkPi.scala:41, took 3.006781 s

### **Using WordCount with Spark**

#### **Copy input file for Spark WordCount Example**

Upload the input file you want to use in WordCount to HDFS. You can use any text file as input. In the following example, log4j.properties is used as an example:

As user spark:

    hadoop fs -copyFromLocal /etc/hadoop/conf/log4j.properties /tmp/data

### **Run Spark WordCount**

To run WordCount:

1.  **Run the Spark shell:**

        ./bin/spark-shell --master yarn-client --driver-memory 512m --executor-memory 512m

    Output similar to below displays before the Scala REPL prompt, scala>:

        15/05/12 18:57:07 INFO HttpServer: Starting HTTP Server
        15/05/12 18:57:07 INFO Server: jetty-8.y.z-SNAPSHOT
        15/05/12 18:57:07 INFO AbstractConnector: Started SocketConnector@0.0.0.0:39254
        15/05/12 18:57:07 INFO Utils: Successfully started service 'HTTP class server' on port 39254.
        Welcome to
        ____              __
        / __/__  ___ _____/ /__
        _\ \/ _ \/ _ `/ __/  '_/
        /___/ .__/\_,_/_/ /_/\_\   version 1.3.1

        Using Scala version 2.10.4 (Java HotSpot(TM) 64-Bit Server VM, Java 1.7.0_67)
        Type in expressions to have them evaluated.
        Type :help for more information.
        15/05/12 18:57:12 INFO SparkContext: Running Spark version 1.3.1
        15/05/12 18:57:12 INFO SecurityManager: Changing view acls to: spark
        15/05/12 18:57:12 INFO SecurityManager: Changing modify acls to: spark

        …

        15/05/12 18:57:30 INFO SparkILoop: Created spark context..
        Spark context available as sc.
        15/05/12 18:57:31 INFO BlockManagerMasterActor: Registering block manager green3:43924 with 265.4 MB RAM, BlockManagerId(2, green3, 43924)
        15/05/12 18:57:31 INFO BlockManagerMasterActor: Registering block manager green3:46459 with 265.4 MB RAM, BlockManagerId(1, green3, 46459)
        15/05/12 18:57:31 INFO SparkILoop: Created sql context (with Hive support)..
        SQL context available as sqlContext.

        scala>

2.  **At the Scala REPL prompt enter:**

    val file = sc.textFile("/tmp/data") 
    val counts = file.flatMap(line => line.split(" ")).map(word => (word, 1)).reduceByKey(_ + _) 
    counts.saveAsTextFile("/tmp/wordcount")

##### **Viewing the WordCount output with Scala Shell**

To view the output in the scala shell:

    scala > counts.count()

To print the full output of the WordCount job:  
`scala > counts.toArray().foreach(println)`

##### **Viewing the WordCount output with HDFS**

To read the output of WordCount using HDFS command:  
Exit the scala shell.

    scala > exit

View WordCount Results:

    hadoop fs -ls /tmp/wordcount

It should display output similar to:

    /tmp/wordcount/_SUCCESS
    /tmp/wordcount/part-00000
    /tmp/wordcount/part-00001

Use the HDFS cat command to see the WordCount output. For example,

    hadoop fs -cat /tmp/wordcount/part-00000

##### **Using Spark DataFrame API**

With Spark 1.3.1 DataFrame API is a new feature. DataFrame API provide easier access to data since it looks conceptually like a Table and a lot of developers from Python/R/Pandas are familiar with it.

As user spark upload people text file to HDFS

    cd /usr/hdp/current/spark-client

    su spark
    hdfs dfs -copyFromLocal examples/src/main/resources/people.txt people.txt

    hdfs dfs -copyFromLocal examples/src/main/resources/people.json people.json

As user Launch Spark Shell

    cd /usr/hdp/current/spark-client
    su spark
    ./bin/spark-shell --num-executors 2 --executor-memory 512m --master yarn-client

At the Spark Shell type the following:

    scala>val df = sqlContext.jsonFile("people.json")

This will produce and output such as

    15/05/12 19:19:56 INFO TaskSetManager: Finished task 1.0 in stage 1.0 (TID 2) in 1125 ms on green3 (1/2)
    15/05/12 19:19:57 INFO DAGScheduler: Stage 1 (reduce at JsonRDD.scala:54) finished in 2.434 s
    15/05/12 19:19:57 INFO DAGScheduler: Job 1 finished: reduce at JsonRDD.scala:54, took 2.483601 s
    15/05/12 19:19:57 INFO TaskSetManager: Finished task 0.0 in stage 1.0 (TID 1) in 2431 ms on green3 (2/2)
    15/05/12 19:19:57 INFO YarnScheduler: Removed TaskSet 1.0, whose tasks have all completed, from pool
    df: org.apache.spark.sql.DataFrame = [age: bigint, name: string]

**Note:** The output in bold where the schema of the underlying people.json is inferred.

Now print the content of DataFrame with df.show

    scala>df.show

    15/05/19 17:34:37 INFO DAGScheduler: Stage 3 (runJob at SparkPlan.scala:122) finished in 0.048 s
    15/05/19 17:34:37 INFO DAGScheduler: Job 3 finished: runJob at SparkPlan.scala:122, took 0.059820 s
    age name
    null Michael
    30 Andy
    19 Justin

##### **Data Frame API examples**

    scala>import org.apache.spark.sql.functions._
    // Select everybody, but increment the age by 1
    scala>df.select(df("name"), df("age") + 1).show()
    // Select people older than 21
    scala>df.filter(df("age") > 21).show()
    // Count people by age
    df.groupBy("age").count().show()

##### **Programmatically Specifying Schema**

    import org.apache.spark.sql._
    val sqlContext = new org.apache.spark.sql.SQLContext(sc)
    val people = sc.textFile("people.txt")
    val schemaString = "name age"
    import org.apache.spark.sql.types.{StructType,StructField,StringType}
    val schema = StructType(schemaString.split(" ").map(fieldName => StructField(fieldName, StringType, true)))
    val rowRDD = people.map(_.split(",")).map(p => Row(p(0), p(1).trim))
    val peopleDataFrame = sqlContext.createDataFrame(rowRDD, schema)
    peopleDataFrame.registerTempTable("people")
    val results = sqlContext.sql("SELECT name FROM people")
    results.map(t => "Name: " + t(0)).collect().foreach(println)

This will produce an output like

    15/05/12 19:13:34 INFO DAGScheduler: Job 0 finished: collect at :30, took 2.721288 s
    Name: Michael
    Name: Andy
    Name: Justin

### **Running Hive 0.13.1 UDF**

Before running Hive examples run the following steps:

Hive 0.13.1 provides a new built-in UDF collect_list(col) which returns a list of objects with duplicates.  
The below example reads and write to HDFS under Hive directories. In a production environment one needs appropriate HDFS permission. However for evaluation you can run all this section as hdfs user.

#### **Launch Spark Shell on YARN cluster**

su hdfs ./bin/spark-shell --num-executors 2  --executor-memory 512m  --master yarn-client

#### **Create Hive Context**

    scala> val hiveContext = new org.apache.spark.sql.hive.HiveContext(sc)

You should see output similar to the following:

    …
    hiveContext: org.apache.spark.sql.hive.HiveContext = org.apache.spark.sql.hive.HiveContext@7d9b2e8d

#### **Create Hive Table**

    scala> hiveContext.sql("CREATE TABLE IF NOT EXISTS TestTable (key INT, value STRING)")

You should see output similar to the following:

    …from=org.apache.hadoop.hive.ql.Driver>
    15/05/19 17:42:34 INFO PerfLogger: res11: org.apache.spark.sql.DataFrame = [result: string]

#### **Load example KV value data into Table**

    scala> hiveContext.sql("LOAD DATA LOCAL INPATH 'examples/src/main/resources/kv1.txt' INTO TABLE TestTable")

You should see output similar to the following:

    15/05/19 17:54:24 INFO PerfLogger: 15/05/19 17:54:24 INFO PerfLogger: 15/05/19 17:54:24 INFO PerfLogger: res1: org.apache.spark.sql.DataFrame = [result: string]

#### **Invoke Hive collect_list UDF**

    scala> hiveContext.sql("from TestTable SELECT key, collect_list(value) group by key order by key").collect.foreach(println)

You should see output similar to the following:

    …
    [489,ArrayBuffer(val_489, val_489, val_489, val_489)]
    [490,ArrayBuffer(val_490)]
    [491,ArrayBuffer(val_491)]
    [492,ArrayBuffer(val_492, val_492)]
    [493,ArrayBuffer(val_493)]
    [494,ArrayBuffer(val_494)]
    [495,ArrayBuffer(val_495)]
    [496,ArrayBuffer(val_496)]
    [497,ArrayBuffer(val_497)]
    [498,ArrayBuffer(val_498, val_498, val_498)]

### **Read & Write ORC File Example**

In this tech preview, we have implemented full support for ORC files with Spark. We will walk through an example that reads and write ORC file and uses ORC structure to infer a table.

### **ORC File Support**

#### **Create a new Hive Table with ORC format**

    scala>hiveContext.sql("create table orc_table(key INT, value STRING) stored as orc")

#### **Load Data into the ORC table**

    scala>hiveContext.sql("INSERT INTO table orc_table select * from testtable")

#### **Verify that Data is loaded into the ORC table**

    scala>hiveContext.sql("FROM orc_table SELECT *").collect().foreach(println)

#### **Read ORC Table from HDFS as HadoopRDD**

    scala> val inputRead = sc.hadoopFile("/apps/hive/warehouse/orc_table", classOf[org.apache.hadoop.hive.ql.io.orc.OrcInputFormat],classOf[org.apache.hadoop.io.NullWritable],classOf[org.apache.hadoop.hive.ql.io.orc.OrcStruct])

#### **Verify we can manipulate the ORC record through RDD**

    scala> val k = inputRead.map(pair => pair._2.toString)
    scala> val c = k.collect

You should see output similar to the following:

    ...
    14/12/22 18:41:37 INFO scheduler.DAGScheduler: Stage 7 (collect at :16) finished in 0.418 s
    14/12/22 18:41:37 INFO scheduler.DAGScheduler: Job 4 finished: collect at :16, took 0.437672 s
    c: Array[String] = Array({238, val_238}, {86, val_86}, {311, val_311}, {27, val_27}, {165, val_165}, {409, val_409}, {255, val_255}, {278, val_278}, {98, val_98}, {484, val_484}, {265, val_265}, {193, val_193}, {401, val_401}, {150, val_150}, {273, val_273}, {224, val_224}, {369, val_369}, {66, val_66}, {128, val_128}, {213, val_213}, {146, val_146}, {406, val_406}, {429, val_429}, {374, val_374}, {152, val_152}, {469, val_469}, {145, val_145}, {495, val_495}, {37, val_37}, {327, val_327}, {281, val_281}, {277, val_277}, {209, val_209}, {15, val_15}, {82, val_82}, {403, val_403}, {166, val_166}, {417, val_417}, {430, val_430}, {252, val_252}, {292, val_292}, {219, val_219}, {287, val_287}, {153, val_153}, {193, val_193}, {338, val_338}, {446, val_446}, {459, val_459}, {394, val_394}, {2…

#### **Copy example table into HDFS**

    su hdfs
    cd SPARK_HOME
    hadoop dfs -put examples/src/main/resources/people.txt people.txt

#### **Run Spark-Shell**

    ./bin/spark-shell --num-executors 2 --executor-memory 512m --master yarn-client

on Scala prompt type the following, except for the comments

    import org.apache.spark.sql.hive.orc._
    import org.apache.spark.sql._
    # Load and register the spark table
    val hiveContext = new org.apache.spark.sql.hive.HiveContext(sc)
    val people = sc.textFile("people.txt")
    val schemaString = "name age"
    val schema = StructType(schemaString.split(" ").map(fieldName => {if(fieldName == "name") StructField(fieldName, StringType, true) else StructField(fieldName, IntegerType, true)}))
    val rowRDD = people.map(_.split(",")).map(p => Row(p(0), new Integer(p(1).trim)))
    # Infer table schema from RDD
    val peopleSchemaRDD = hiveContext.applySchema(rowRDD, schema)
    # Create a table from schema
    peopleSchemaRDD.registerTempTable("people")
    val results = hiveContext.sql("SELECT * FROM people")
    results.map(t => "Name: " + t.toString).collect().foreach(println)
    # Save Table to ORCFile
    peopleSchemaRDD.saveAsOrcFile("people.orc")
    # Create Table from ORCFile
    val morePeople = hiveContext.orcFile("people.orc")
    morePeople.registerTempTable("morePeople")
    hiveContext.sql("SELECT * from morePeople").collect.foreach(println)

### **SparkSQL Thrift Server for JDBC/ODBC access**

With this Tech Preview SparkSQL’s thrift server provides JDBC access to SparkSQL.

1.  **Start Thrift Server**  
    From SPARK_HOME, start SparkSQL thrift server, Note the port value of the thrift JDBC server

    su spark
    ./sbin/start-thriftserver.sh --master yarn-client --executor-memory 512m --hiveconf hive.server2.thrift.port=10001

*   **Connect to Thrift Server over beeline**  
    Launch beeline from SPARK_HOME

        su spark
        ./bin/beeline

*   **Connect to Thrift Server & Issue SQL commands**  
    On beeline prompt

        beeline>!connect jdbc:hive2://localhost:10001

    Note this is example is without security enabled, so any username password should work.

    Note, the connection may take a few second to be available and try show tables after a wait of 10-15 second in a Sandbox env.

        0: jdbc:hive2://localhost:10001> show tables;
        +------------+--------------+
        | tableName | isTemporary |
        +------------+--------------+
        | orc_table | false |
        | testtable | false |
        +------------+--------------+
        2 rows selected (1.275 seconds)
        0: jdbc:hive2://localhost:10001> exit

*   **Stop Thrift Server**

        ./sbin/stop-thriftserver.sh

### **Spark Job History Server**

Spark Job history server is integrated with YARN’s Application Timeline Server(ATS) and publishes job metrics to ATS. This allows job details to be available after the job finishes. Y

1.  **Start Spark History Server**

        ./sbin/start-history-server.sh

    You can let the history server run, while you run examples in the tech preview and go to YARN resource manager page at http://:8088/cluster/apps and see the logs of finished application with the history server.

2.  **Stop Spark History Server**

        ./sbin/stop-history-server.sh

### **Running the Machine Learning Spark Application**

Make sure all of your nodemanager nodes have gfortran library. If not, you need to install it in all of your nodemanager nodes.

    sudo yum install gcc-gfortran

**Note:** It is usually available in the update repo for CentOS. For example:

    sudo yum install gcc-gfortran --enablerepo=update

MLlib throws a linking error if it cannot detect these libraries automatically. For example, if you try to do Collaborative Filtering without gfortran runtime library installed, you will see the following linking error:

    java.lang.UnsatisfiedLinkError: org.jblas.NativeBlas.dposv(CII[DII[DII)I  
    at org.jblas.NativeBlas.dposv(Native Method)  
    at org.jblas.SimpleBlas.posv(SimpleBlas.java:369)  
    at org.jblas.Solve.solvePositive(Solve.java:68)

Visit [http://spark.apache.org/docs/latest/mllib-guide.html](http://spark.apache.org/docs/latest/mllib-guide.html) for Spark ML examples.

**Issues:**

If you see the following error launching spark-shell, create a file /etc/spark/conf/java-opts & include in it  
**-Dhdp.version=2.2.4.2-2**

    Stack trace: ExitCodeException exitCode=1: /hadoop/yarn/local/usercache/root/appcache/application_1432765915328_0002/container_1432765915328_0002_02_000001/launch_container.sh: line 27: $PWD:$PWD/__spark__.jar:$HADOOP_CONF_DIR:/usr/hdp/current/hadoop-client/*:/usr/hdp/current/hadoop-client/lib/*:/usr/hdp/current/hadoop-hdfs-client/*:/usr/hdp/current/hadoop-hdfs-client/lib/*:/usr/hdp/current/hadoop-yarn-client/*:/usr/hdp/current/hadoop-yarn-client/lib/*:$PWD/mr-framework/hadoop/share/hadoop/mapreduce/*:$PWD/mr-framework/hadoop/share/hadoop/mapreduce/lib/*:$PWD/mr-framework/hadoop/share/hadoop/common/*:$PWD/mr-framework/hadoop/share/hadoop/common/lib/*:$PWD/mr-framework/hadoop/share/hadoop/yarn/*:$PWD/mr-framework/hadoop/share/hadoop/yarn/lib/*:$PWD/mr-framework/hadoop/share/hadoop/hdfs/*:$PWD/mr-framework/hadoop/share/hadoop/hdfs/lib/*:/usr/hdp/${hdp.version}/hadoop/lib/hadoop-lzo-0.6.0.${hdp.version}.jar:/etc/hadoop/conf/secure: bad substitution

    at org.apache.hadoop.util.Shell.runCommand(Shell.java:538)

    at org.apache.hadoop.util.Shell.run(Shell.java:455)

    at org.apache.hadoop.util.Shell$ShellCommandExecutor.execute(Shell.java:715)

    at org.apache.hadoop.yarn.server.nodemanager.DefaultContainerExecutor.launchContainer(DefaultContainerExecutor.java:211)

    at org.apache.hadoop.yarn.server.nodemanager.containermanager.launcher.ContainerLaunch.call(ContainerLaunch.java:302)

    at org.apache.hadoop.yarn.server.nodemanager.containermanager.launcher.ContainerLaunch.call(ContainerLaunch.java:82)

    at java.util.concurrent.FutureTask.run(FutureTask.java:262)

    at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1145)

    at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:615)

    at java.lang.Thread.run(Thread.java:745)

**Additional Information:**

Visit the forum for the latest discussions on issues:

[http://hortonworks.com/community/forums/forum/spark/](http://hortonworks.com/community/forums/forum/spark/)