This is the second tutorial to enable you as a Java developer to learn about Cascading and Hortonworks Data Platform (HDP). Other tutorials are:

*   [WordCount with Cascading on HDP 2.3 Sandbox](http://hortonworks.com/hadoop-tutorial/cascading-hortonworks-data-platform-2-1/ "Cascading Word Count")
*   [LogParsing with Cascading on HDP 2.3 Sandbox](http://hortonworks.com/hadoop-tutorial/cascading-log-parsing "Cascading Log Parsing")

In this tutorial, you will do the following:

*   Install [Hortonworks Sandbox](http://hortonworks.com/products/sandbox), a single-node cluster
*   Code a simple Java log parsing application using Cascading SDK
*   Build the single unit of execution, the jar file, using the gradle build tool
*   Deploy the jar file onto to the Sandbox
*   Examine the resulting MapReduce Jobs
*   View the output stored as an HDSF file.

This example code is derived from Concurrent Inc.’s [training class](http://cascading.io/services/training/ "Cascading Training") by Alexis Roos (@alexisroos). It demonstrates the simplicity of using Cascading Java Framework to write MapReduce Jobs, without using the actual MapReduce API, to parse a large file for analysis. Even though the example merely sorts the top ten IP’s visited, its efficacy and usage is far more powerful. Nonetheless, it introduces its potential and its simplicity.

### Step 1: Downloading and installing HDP 2.1 Sandbox

*   Download and install [HDP 2.1 Sandbox](http://hortonworks.com/hdp/downloads/ "Download HDP 2.1 Sandbox")
*   Familiarize yourself with the navigation on the Linux virtual host through a shell window
*   Login into your Linux Sandbox as root (password is hadoop)
    *   `ssh -p 2222 root@127.0.0.1`
    *   `su guest`

### Step 2: Downloading and installing Gradle

    cd ~
    wget https://services.gradle.org/distributions/gradle-1.9-bin.zip
    unzip gradle-1.9-bin.zip
    chmod +x gradle-1.9/bin/gradle

### Step 3: Downloading sources and log data file

*   `git clone git://github.com/dmatrix/examples.git`
*   `cd /home/guest/examples/dataprocessing`
*   `wget http://files.concurrentinc.com/training/NASA_access_log_Aug95.txt`

### Step 4: Building the single unit of execution

*   `cd /home/guest/examples/dataprocessing`
*   `~/gradle-1.9/bin/gradle clean jar`

### Step 5: Running the jar on Sandbox

*   create a logs directory in HDFS
    *   `hdfs dfs -mkdir /user/guest/logs`
*   create an output directory in HDFS
    *   `hdfs dfs –mkdir /user/guest/output`
*   copy the log file from the local filesystem to the HDFS logs directory
    *   `hdfs dfs -copyFromLocal ./NASA_access_log_Aug95.txt /user/guest/logs`
*   Finally, run the Cascading application on the Sandbox, the single-node HDP cluster
    *   `hadoop jar ./build/libs/dataprocessing.jar /user/guest/logs /user/guest/output/logs`

This run should create the following output:

![Screen Shot 2014-05-12 at 11.51.40 AM](/assets/2-3/cascading-2/Screen-Shot-2014-05-12-at-11.51.40-AM.png)

### Tracking the MapReduce Jobs on the Sandbox

Once the job is submitted (or running), you can visually track its progress from the MapReduce Job Browser. Login to Ambari and click **MapReduce 2**. Then Use **Quick Links** to get to the **JobHistory UI**.

![Screen Shot 2014-05-12 at 11.53.52 AM](/assets/2-3/cascading-2/02_ambari_mapreduce.png)

You can drill down on any links to explore further details about the Map Reduce jobs running in their respective YARN containers. For example, clicking on one of the job ids will show all the maps and reduces tasks created.

### Viewing the Log Parsing Output

When the job is finished, the 10 IP addresses are written as an HDFS file part-00000\. Use the Ambari **HDFS Files** view to navigate to the HDFS directory, `/user/guest/output/logs`, and view its contents.

![Screen Shot 2014-05-12 at 6.33.13 PM](/assets/2-3/cascading-2/04_job_results.png)

Voila! You have written a Cascading log processing application, executed it on the Hortonworks HDP Sandbox, and perused the respective MapReduce jobs and the output generated.

In the next tutorial, we will examine how you to use [Cascading Driven](http://docs.cascading.io/driven/1.1/getting-started) to discover in-depth information on the Flow (including logical, physical, and performance views).
