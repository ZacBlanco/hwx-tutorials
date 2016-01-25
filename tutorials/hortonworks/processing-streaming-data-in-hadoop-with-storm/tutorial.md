
In this tutorial we will walk through the process of

*   Reviewing the pre-installed Apache Storm infrastructure
*   Run a sample use case end to end

### What is Apache Storm?

[Apache Storm](http://hortonworks.com/hadoop/storm) is an open source engine which can process data in realtime using its distributed architecture. Storm is simple and flexible. It can be used with any programming language of your choice.

Let’s look at the various components of a Storm Cluster:

1.  **Nimbus node. **The master node (Similar to JobTracker)
2.  **Supervisor nodes.** Starts/stops workers & communicates with Nimbus through Zookeeper
3.  **ZooKeeper nodes.** Coordinates the Storm cluster

Here are a few terminologies and concepts you should get familiar with before we go hands-on:

*   **Tuples.** An ordered list of elements. For example, a “4-tuple” might be (7, 1, 3, 7)
*   **Streams.** An unbounded sequence of tuples.
*   **Spouts.** Sources of streams in a computation (e.g. a Twitter API)
*   **Bolts.** Process input streams and produce output streams. They can:
    *   Run functions;
    *   Filter, aggregate, or join data;
    *   Talk to databases.
*   **Topologies.** The overall calculation, represented visually as a network of spouts and bolts

## Prerequisites:

A working HDP cluster – the easiest way to get a HDP cluster is to download the [HDP Sandbox](http://hortonworks.com/sandbox/)

## Installation and Setup Verification:

### Step 1:

Let’s check if the sandbox has storm processes up and running by login into Ambari and look for Storm in the services listed:

![](http://hortonassets.s3.amazonaws.com/mda/storm2/image25.png)

### Step 2 :

Now let’s look at a Streaming use case using Storm’s Spouts and Bolts processes. For this we will be using a simple use case, however it should give you the real life experience of running and operating on Hadoop Streaming data using this topology.

Let’s get the jar file which is available in the Storm Starter kit. This has other examples as well, but let’s use the WordCount operation and see how to turn it ON. We will also track this in Storm UI.

    wget http://public-repo-1.hortonworks.com/HDP-LABS/Projects/Storm/0.9.0.1/storm-starter-0.0.1-storm-0.9.0.1.jar

![enter image description here](../../../assets/processing-streaming-data-in-hadoop-with-storm/10000%20storm%20example%20download.JPG)


### Step 3 :

In the Storm example Topology, we will be using three main parts or processes:

1.  Sentence Generator Spout
2.  Sentence Split Bolt
3.  WordCount Bolt

You can check the classes available in the jar as follows:

    jar -xvf storm-starter-0.0.1-storm-0.9.0.1.jar | grep Sentence  
    jar -xvf storm-starter-0.0.1-storm-0.9.0.1.jar | grep Split  
    jar -xvf storm-starter-0.0.1-storm-0.9.0.1.jar | grep WordCount

![enter image description here](../../../assets/processing-streaming-data-in-hadoop-with-storm/10000%20jar%20classes.JPG)





### Step 4 :

Let’s run the storm job. It has a Spout job to generate random sentences. There is a split Bolt Process along with the Wordcount Bolt Class.

Let’s run the Storm Jar file.

    /usr/lib/storm/bin/storm jar storm-starter-0.0.1-storm-0.9.0.1.jar storm.starter.WordCountTopology WordCount -c storm.starter.WordCountTopology WordCount -c nimbus.host=sandbox.hortonworks.com

![enter image description here](../../../assets/processing-streaming-data-in-hadoop-with-storm/10000%20jar%20running.JPG)





### Step 5 :

Let’s use Storm UI and look at it graphically:  
![enter image description here](../../../assets/processing-streaming-data-in-hadoop-with-storm/10000%20Storm%20UI.JPG)

You should notice the Storm Topology, WordCount in the Topology summary.

### Step 6 :

Please click on the WordCount Topology. You will see the following:  
![enter image description here](../../../assets/processing-streaming-data-in-hadoop-with-storm/1000%20Storm%20UI%20next%20step.JPG)

### Step 7 :

In this page, please click on count in the Bolt Section.

![enter image description here](../../../assets/processing-streaming-data-in-hadoop-with-storm/10000Click%20on%20Bolt.JPG)





### Step 8 :

Now if click on any port in the executor section and you will be able to view the results.

### Step 9 :

Lastly but most importantly, you can always look at the log files in the following folder. These logs are extremely useful for debugging or status finding.

![enter image description here](../../../assets/processing-streaming-data-in-hadoop-with-storm/1000%20log.JPG)





You just processed streaming data using Apache Storm
