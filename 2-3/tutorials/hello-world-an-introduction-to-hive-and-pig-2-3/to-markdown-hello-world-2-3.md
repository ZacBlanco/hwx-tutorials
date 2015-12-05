## Introduction

This tutorial describes how to refine data for a Trucking IoT  [Data Discovery](http://hortonworks.com/solutions/advanced-analytic-apps/#data-discovery) (aka IoT Discovery) use case using the Hortonworks Data Platform. The IoT Discovery use cases involves vehicles, devices and people moving across a map or similar surface. Your analysis is interested in tying together location information with your analytic data.

Hello World is often used by developers to familiarize themselves with new concepts by building a simple program. This tutorial aims to achieve a similar purpose by getting practitioners started with Hadoop and HDP. We will use an Internet of Things (IoT) use case to build your first HDP application.

For our tutorial we are looking at a use case where we have a truck fleet. Each truck has been equipped to log location and event data. These events are streamed back to a datacenter where we will be processing the data.  The company wants to use this data to better understand risk.

Here is the video of [Analyzing Geolocation Data](http://youtu.be/n8fdYHoEEAM) to show you what you’ll be doing in this tutorial.

**Prerequisites:**

*   Hortonworks Sandbox 2.3 (installed and running)

[Download Hortonworks Sandbox](http://hortonworks.com/products/hortonworks-sandbox/#install)

*   Data Set Used: [**Geolocation.zip**](https://app.box.com/HadoopCrashCourseData)
*   _Optional_: Hortonworks ODBC driver installed and configured – see the tutorial on installing the ODBC driver for Windows or OS X. Refer to
    *   [Installing and Configuring the Hortonworks ODBC driver on Windows 7](http://hortonworks.com/hadoop-tutorial/how-to-install-and-configure-the-hortonworks-odbc-driver-on-windows-7/)
    *   [Installing and Configuring the Hortonworks ODBC driver on Mac OS X](http://hortonworks.com/hadoop-tutorial/how-to-install-and-configure-the-hortonworks-odbc-driver-on-mac-os-x/)
    *   Microsoft Excel 2013 Professional Plus is required for the Windows 7 or later installation to be able to construct the maps.


- In this tutorial, the Hortonworks Sandbox is installed on an Oracle VirtualBox virtual machine (VM) – your screens may be different.

- Install the ODBC driver that matches the version of Excel you are using (32-bit or 64-bit).

- We will use the Power View feature in Microsoft Excel 2013 to visualize the sensor data. Power View is currently only available in Microsoft Office Professional Plus and Microsoft Office 365 Professional Plus.

- Note, other versions of Excel will work, but the visualizations will be limited to charts or graphs. You can also use other visualization tool.

**Tutorial Overview**

In this tutorial we will be providing the collected geolocation and truck data.   We will import this data into HDFS and build derived tables in Hive. Then we will process the data using Pig, Hive and Spark. The processed data is then imported into Microsoft Excel where it can be visualized.

To refine and analyze Geolocation data, we will:

*   Review some Hadoop Fundamentals
*   Download and extract the Geolocation data files.
*   Load the captured data into the Hortonworks Sandbox.
*   Run Hive,Pig and Spark scripts that compute truck mileage and driver risk factor.
*   Access the refined sensor data with Microsoft Excel.
*   Visualize the sensor data using Excel Power View.

**Goals of the Tutorial**

The goal of this tutorial is that you get familiar with the basics of following:

*   Hadoop and HDP
*   Ambari File User Views and HDFS
*   Ambari Hive User Views and Apache Hive
*   Ambari Pig User Views and Apache Pig
*   Apache Spark
*   Data Visualization with Excel (Optional)

#### Outline

1.  Introduction
2.  Prerequisites
    1.  Data Set Used: [**Geolocation.zip**](https://app.box.com/HadoopCrashCourseData)
    2.  HDP version: 2.3
3.  Tutorial Overview
4.  Goals of the Tutorial (outcomes)
5.  Hadoop Data Platform Concepts (New to Hadoop or HDP- Refer following)
    1.  [Apache Hadoop and HDP](http://hortonworks.com/hadoop-tutorial/hello-world-an-introduction-to-hadoop-hcatalog-hive-and-pig#section_2)(5 Pillars)
    2.  [Apache Hadoop Distributed File System(HDFS)](http://hortonworks.com/hadoop-tutorial/hello-world-an-introduction-to-hadoop-hcatalog-hive-and-pig#section_3)
    3.  [Apache MapReduce and Apache YARN](http://hortonworks.com/hadoop-tutorial/hello-world-an-introduction-to-hadoop-hcatalog-hive-and-pig#section_4)
    4.  [Apache Hive and Apache Pig](http://hortonworks.com/hadoop-tutorial/hello-world-an-introduction-to-hadoop-hcatalog-hive-and-pig#section_5)
6.  Get Started with HDP Labs
    1.  [Step 0: Start Sandbox VM and Open Ambari](http://hortonworks.com/hadoop-tutorial/hello-world-an-introduction-to-hadoop-hcatalog-hive-and-pig#section_6)
    2.  [Lab 1: Loading Sensor Data into HDFS](http://hortonworks.com/hadoop-tutorial/hello-world-an-introduction-to-hadoop-hcatalog-hive-and-pig#section_7)
    3.  [Lab 2: Data Manipulation with Hive](http://hortonworks.com/hadoop-tutorial/hello-world-an-introduction-to-hadoop-hcatalog-hive-and-pig#section_8) (AMBARI HIVE USER VIEWS)
    4.  [Lab 3: Use Pig to compute Driver Risk Factor](http://hortonworks.com/hadoop-tutorial/hello-world-an-introduction-to-hadoop-hcatalog-hive-and-pig#section_9)
    5.  [Lab 4: Use Apache Spark to compute Driver Risk Factor](http://hortonworks.com/hadoop-tutorial/hello-world-an-introduction-to-hadoop-hcatalog-hive-and-pig#section_10)
    6.  Lab 5: Optional Visualization and Reporting
        1.  [Configuring ODBC driver](http://hortonworks.com/hadoop-tutorial/how-to-install-and-configure-the-hortonworks-odbc-driver-on-mac-os-x/)  (Mac and Windows)
        2.  [Using Microsoft Excel](http://hortonworks.com/hadoop-tutorial/hello-world-an-introduction-to-hadoop-hcatalog-hive-and-pig#section_11)
        3.  Using Zeppelin (Coming Soon…)
7.  Next Step/Try These
    1.  Practitioner Journey-  As a Hadoop Practitioner you can adopt following learning paths
        *   Hadoop Developer- [Click Here!](http://hortonworks.com/products/hortonworks-sandbox/#tuts-developers)
        *   Hadoop Administrator-[Click Here!](http://hortonworks.com/products/hortonworks-sandbox/#tuts-admins)
        *   Data Scientist- [Click Here!](http://hortonworks.com/products/hortonworks-sandbox/#tuts-analysts)
    2.  [Case Studies](http://hortonworks.com/industry/)– Learn how Hadoop is being used by various industries.
8.  References and Resources
    1.  Hadoop -The Definitive Guide by O`Reilly
    2.  Hadoop for Dummies
    3.  [Hadoop Crash Course slides-Hadoop Summit 2015](http://www.slideshare.net/Hadoop_Summit/hadoop-crash-course-workshop-at-hadoop-summit)
    4.  [Hadoop Crash Course Workshop- Hadoop Summit 2015](https://www.youtube.com/watch?v=R-va7pZg7HM)

## Concepts: Hadoop & HDP

### **Introduction**

In this module you will learn about Apache Hadoop and what makes it scale to large data sets. We will also talk about various components of Hadoop ecosystem that make Apache Hadoop enterprise ready in form of Hortonworks Data Platform(HDP) distribution. The module discusses Apache Hadoop, its capabilities as a data platform and how the core of Hadoop and its surrounding ecosystem solution vendors provides the enterprise requirements to integrate alongside the Data Warehouse and other enterprise data systems as part of a modern data architecture, and as a step on the journey toward delivering an enterprise ‘Data Lake’

#### **Goals of this module**

*   Understanding Hadoop.
*   Understanding five pillars of HDP
*   Understanding HDP components and their purpose.

**Apache Hadoop:**

Apache Hadoop® is an open source framework for distributed storage and processing of large sets of data on commodity hardware. Hadoop enables businesses to quickly gain insight from massive amounts of structured and unstructured data. Numerous Apache Software Foundation projects make up the services required by an enterprise to deploy, integrate and work with Hadoop.

- Hortonworks Blog : [Understanding Hadoop 2.0](http://hortonworks.com/blog/understanding-hadoop-2-0/)



The base Apache Hadoop framework is composed of the following modules:

*   **Hadoop Common** – contains libraries and utilities needed by other Hadoop modules.
*   **Hadoop Distributed File System (HDFS)** – a distributed file-system that stores data on commodity machines, providing very high aggregate bandwidth across the cluster.
*   **Hadoop YARN** – a resource-management platform responsible for managing computing resources in clusters and using them for scheduling of users’ applications.
*   **Hadoop MapReduce** – a programming model for large scale data processing.

Each project has been developed to deliver an explicit function and each has its own community of developers and individual release cycles. There are five pillars to Hadoop that make it enterprise ready:

1.  **Data Management**– Store and process vast quantities of data in a storage layer that scales linearly. Hadoop Distributed File System (HDFS) is the core technology for the efficient scale out storage layer, and is designed to run across low-cost commodity hardware. Apache Hadoop YARN is the pre-requisite for Enterprise Hadoop as it provides the resource management and pluggable architecture for enabling a wide variety of data access methods to operate on data stored in Hadoop with predictable performance and service levels.
    1.  **[Apache Hadoop YARN](http://hortonworks.com/hadoop/yarn)– **Part of the core Hadoop project, YARN is a next-generation framework for  Hadoop data processing extending MapReduce capabilities by supporting non-MapReduce workloads associated with other programming models.
    2.  **[HDFS](http://hortonworks.com/hadoop/hdfs/)– **Hadoop Distributed File System (HDFS) is a Java-based file system that provides scalable and reliable data storage that is designed to span large clusters of commodity servers.
2.  **Data Access**– Interact with your data in a wide variety of ways – from batch to real-time. Apache       Hive is the most widely adopted data access technology, though there are many specialized engines. For instance, Apache Pig provides scripting capabilities, Apache Storm offers real-time processing,     Apache HBase offers columnar NoSQL storage and Apache Accumulo offers cell-level access           control. All of these engines can work across one set of data and resources thanks to YARN and       intermediate engines such as Apache Tez for interactive access and Apache Slider for long-running   applications. YARN also provides flexibility for new and emerging data access methods, such as         Apache Solr for search and programming frameworks such as Cascading.
    1.  **[Apache Hive](http://hortonworks.com/hadoop/hive)– **Built on the MapReduce framework, Hive is a data warehouse that enables easy data summarization and ad-hoc queries via an SQL-like interface for large datasets stored in HDFS.
    2.  **[Apache Pig](http://hortonworks.com/hadoop/pig)– **A platform for processing and analyzing large data sets. Pig consists of a high-level language (Pig Latin) for expressing data analysis programs paired with the MapReduce framework for processing these programs.
    3.  **[MapReduce](http://hortonworks.com/hadoop/mapreduce/)– **MapReduce is a framework for writing applications that process large amounts of structured and unstructured data in parallel across a cluster of thousands of machines, in a reliable and fault-tolerant manner.
    4.  **[Apache Spark](http://hortonworks.com/hadoop/spark)– **Spark is ideal for in-memory data processing. It allows data scientists to implement fast, iterative algorithms for advanced analytics such as clustering and classification of datasets.
    5.  **[Apache Storm](http://hortonworks.com/hadoop/storm)– **Storm is a distributed real-time computation system for processing fast, large streams of data adding reliable real-time data processing capabilities to Apache Hadoop® 2.x
    6.  **[Apache HBase](http://hortonworks.com/hadoop/hbase)– **A column-oriented NoSQL data storage system that provides random real-time read/write access to big data for user applications.
    7.  **[Apache Tez](http://hortonworks.com/hadoop/tez)– **Tez generalizes the MapReduce paradigm to a more powerful framework for executing a complex DAG (directed acyclic graph) of tasks for near real-time big data processing.
    8.  **[Apache Kafka](http://hortonworks.com/hadoop/kafka)– **Kafka is a fast and scalable publish-subscribe messaging system that is often used in place of traditional message brokers because of its higher throughput, replication, and fault tolerance.
    9.  **[Apache HCatalog](http://hortonworks.com/hadoop/hcatalog)– **A table and metadata management service that provides a centralized way for data processing systems to understand the structure and location of the data stored within Apache Hadoop.
    10.  **[Apache Slider](http://hortonworks.com/hadoop/slider)– **A framework for deployment of long-running data access applications in Hadoop. Slider leverages YARN’s resource management capabilities to deploy those applications, to manage their lifecycles and scale them up or down.
    11.  **[Apache Solr](http://hortonworks.com/hadoop/solr)– **Solr is the open source platform for searches of data stored in Hadoop. Solr enables powerful full-text search and near real-time indexing on many of the world’s largest Internet sites.
    12.  **[Apache Mahout](http://hortonworks.com/hadoop/mahout)– **Mahout provides scalable machine learning algorithms for Hadoop which aids with data science for clustering, classification and batch based collaborative filtering.
    13.  **[Apache Accumulo](http://hortonworks.com/hadoop/accumulo)– **Accumulo is a high performance data storage and retrieval system with cell-level access control. It is a scalable implementation of Google’s Big Table design that works on top of Apache Hadoop and Apache ZooKeeper.
3.  **Data Governance and Integration**– Quickly and easily load data, and manage   according to           policy.Apache Falcon provides policy-based workflows for data governance, while Apache Flume and Sqoop enable easy data ingestion, as do the NFS and WebHDFS interfaces to HDFS.
    1.  **[Apache Falcon](http://hortonworks.com/hadoop/falcon)– **Falcon is a data management framework for simplifying data lifecycle management and processing pipelines on Apache Hadoop®. It enables users to orchestrate data motion, pipeline processing,disaster recovery, and data retention workflows.
    2.  **[Apache Flume](http://hortonworks.com/hadoop/flume)– **Flume allows you to efficiently aggregate and move large amounts of log data from many different sources to Hadoop.
    3.  **[Apache Sqoop](http://hortonworks.com/hadoop/sqoop)– **Sqoop is a tool that speeds and eases movement of data in and out of Hadoop. It provides a reliable parallel load for various, popular enterprise data sources.

1.  **Security**– Address requirements of Authentication, Authorization, Accounting and Data Protection. Security is provided at every layer of the Hadoop stack from HDFS and YARN to Hive and the other Data Access components on up through the entire perimeter of the cluster via Apache Knox.
    1.  **[Apache Knox](http://hortonworks.com/hadoop/knox)– **The Knox Gateway (“Knox”) provides a single point of authentication and access for Apache Hadoop services in a cluster. The goal of the project is to simplify Hadoop security for users who access the cluster data and execute jobs, and for operators who control access to the cluster.
    2.  **[Apache Ranger](http://hortonworks.com/hadoop/ranger)– **Apache Ranger delivers a comprehensive approach to security for a Hadoop cluster. It provides central security policy administration across the core enterprise security requirements of authorization, accounting and data protection.

1.  **Operations**–  Provision, manage, monitor and operate Hadoop clusters at scale.
    1.  **[Apache Ambari](http://hortonworks.com/hadoop/ambari)– **An open source installation lifecycle management, administration and monitoring system for Apache Hadoop clusters.
    2.  **[Apache Oozie](http://hortonworks.com/hadoop/oozie)– **Oozie Java Web application used to schedule Apache Hadoop jobs. Oozie combines multiple jobs sequentially into one logical unit of work.
    3.  **[Apache ZooKeeper](http://hortonworks.com/hadoop/zookeeper)– **A highly available system for coordinating distributed processes. Distributed applications use ZooKeeper to store and mediate updates to important configuration information.

Apache Hadoop can be useful across a range of use cases spanning virtually every vertical industry. It is becoming popular anywhere that you need to store, process, and analyze large volumes of data. Examples include digital marketing automation, fraud detection and prevention, social network and relationship analysis, predictive modeling for new drugs, retail in-store behavior analysis, and mobile device location-based marketing.  To learn more about Apache Hadoop, watch the following introduction:

<iframe width="500" height="375" src="https://www.youtube.com/embed/6UtD53BzDNk?feature=oembed&amp;enablejsapi=1" frameborder="0" allowfullscreen="" id="player0"></iframe>

### **Hortonworks Data Platform (HDP)**

Hortonworks Data Platform is a packaged software hadoop distribution that aim to ease deployment and management of Hadoop clusters compared with simply downloading the various Apache code bases and trying to run them together a system. Architected, developed, and built completely in the open, Hortonworks Data Platform (HDP) provides an enterprise ready data platform that enables organizations to adopt a Modern Data Architecture.

With YARN as its architectural center it provides a data platform for multi-workload data processing across an array of processing methods – from batch through interactive to real-time, supported by key capabilities required of an enterprise data platform — spanning Governance, Security and Operations.

The Hortonworks **Sandbox** is a single node implementation of the Hortonworks Data Platform (HDP). It is packaged as a virtual machine to make evaluation and experimentation with HDP fast and easy. The tutorials and features in the Sandbox are oriented towards exploring how HDP can help you solve your business big data problems. The Sandbox tutorials will walk you through bringing some sample data into HDP and manipulating it using the tools built into HDP. The idea is to show you how you can get started and show you how to accomplish tasks in HDP. HDP is free to download and use in your enterprise and you can download it here: [Hortonworks Data Platform](http://hortonworks.com/download/)

[Download](http://hortonworks.com/download/)

**Suggested Readings**


- HDFS is one of the 4 components of [Apache Hadoop](http://hadoop.apache.org/) the other 3 are Hadoop Common, [Hadoop YARN](http://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-site/YARN.html) and [Hadoop MapReduce](http://hortonworks.com/hadoop/mapreduce/).
- To learn more about HDFS watch the following [HDFS introduction video](https://www.youtube.com/watch?v=1_ly9dZnmWc).
- To learn more about YARN watch the following [YARN introduction video](https://www.youtube.com/watch?v=ZYXVNxmMchc&list=PL2y_WpKCCNQc-7RJNoYym4_g7EZb3yzJW).  


**Hadoop 2.0 Blogs:**

- [Hadoop 2.7.0 Blog](http://hortonworks.com/blog/apache-hadoop-2-7-0-released/)
- [Understanding Hadoop 2.0](http://hortonworks.com/blog/understanding-hadoop-2-0/)


## Concepts: HDFS

### **Introduction**

A single physical machine gets saturated with its storage capacity as the data grows. Thereby comes impending need to partition your data across separate machines. This type of File system that manages storage of data across a network of machines is called Distributed File Systems. [HDFS](http://hortonworks.com/blog/thinking-about-the-hdfs-vs-other-storage-technologies/) is a core component of Apache Hadoop and is designed to store large files with streaming data access patterns, running on clusters of commodity hardware. With Hortonworks Data Platform HDP 2.2, HDFS is now expanded to support [heterogeneous storage](http://hortonworks.com/blog/heterogeneous-storage-policies-hdp-2-2/)  media within the HDFS cluster.

**Goals of this module**

*   Understanding HDFS architecture
*   Understanding Hortonworks Sandbox Amabri File User View

**Hadoop Distributed File System**

HDFS is a distributed file system that is designed for storing large data files. HDFS is a Java-based file system that provides scalable and reliable data storage, and it was designed to span large clusters of commodity servers. HDFS has demonstrated production scalability of up to 200 PB of storage and a single cluster of 4500 servers, supporting close to a billion files and blocks. HDFS is a scalable, fault-tolerant, distributed storage system that works closely with a wide variety of concurrent data access applications, coordinated by YARN. HDFS will “just work” under a variety of physical and systemic circumstances. By distributing storage and computation across many servers, the combined storage resource can grow linearly with demand while remaining economical at every amount of storage.

![HDSF_1](http://hortonworks.com/wp-content/uploads/2015/07/HDSF_1.png)

An HDFS cluster is comprised of a NameNode, which manages the cluster metadata, and DataNodes that store the data. Files and directories are represented on the NameNode by inodes. Inodes record attributes like permissions, modification and access times, or namespace and disk space quotas.

The file content is split into large blocks (typically 128 megabytes), and each block of the file is independently replicated at multiple DataNodes. The blocks are stored on the local file system on the DataNodes.

The Namenode actively monitors the number of replicas of a block. When a replica of a block is lost due to a DataNode failure or disk failure, the NameNode creates another replica of the block. The NameNode maintains the namespace tree and the mapping of blocks to DataNodes, holding the entire namespace image in RAM.

The NameNode does not directly send requests to DataNodes. It sends instructions to the DataNodes by replying to heartbeats sent by those DataNodes. The instructions include commands to:

*   replicate blocks to other nodes,
*   remove local block replicas,
*   re-register and send an immediate block report, or
*   shut down the node.

![HDFS_2](http://hortonworks.com/wp-content/uploads/2015/07/HDFS_2.png)

- For more details on HDFS: [http://hortonworks.com/hadoop/hdfs/](http://hortonworks.com/hadoop/hdfs/)

With [next generation HDFS data architecture](http://hortonworks.com/blog/hdfs-2-0-next-generation-architecture/) that comes with HDP 2.0, HDFS has evolved to provide [automated failure](http://hortonworks.com/blog/namenode-high-availability-in-hdp-2-0/) with a hot standby, with full stack resiliency. Please spare some time to go through this video for more clarity on HDFS.

<iframe width="500" height="281" src="https://www.youtube.com/embed/1_ly9dZnmWc?feature=oembed&amp;enablejsapi=1" frameborder="0" allowfullscreen="" id="player1"></iframe>

**Ambari Files User View on Hortonworks Sandbox**

Ambari Files User View

![HDFS_3](http://hortonworks.com/wp-content/uploads/2015/07/HDFS_3.png)

Ambari Files User View provides a user friendly interface to upload, store and move data. Underlying all components in Hadoop is the Hadoop Distributed File System([HDFS](http://hortonworks.com/hadoop/hdfs/)™).  This is the foundation of the Hadoop cluster. The HDFS file system manages how the datasets are stored in the Hadoop cluster. It is responsible for distributing the data across the datanodes, managing replication for redundancy and administrative tasks like adding, removing and recovery of data nodes.

#### **Suggested Readings**

- HDFS is one of the 4 components of [Apache Hadoop](http://hadoop.apache.org/) the other 3 are Hadoop Common, [Hadoop YARN](http://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-site/YARN.html) and [Hadoop MapReduce](http://hortonworks.com/hadoop/mapreduce/).
- To learn more about HDFS watch the following [HDFS introduction video](https://www.youtube.com/watch?v=1_ly9dZnmWc).
- To learn more about YARN watch the following [YARN introduction video](https://www.youtube.com/watch?v=ZYXVNxmMchc&list=PL2y_WpKCCNQc-7RJNoYym4_g7EZb3yzJW).

**Hadoop 2.0 Blogs:**  

- [Hadoop 2.7.0 Blog](http://hortonworks.com/blog/apache-hadoop-2-7-0-released/)  
- [Understanding Hadoop 2.0](http://hortonworks.com/blog/understanding-hadoop-2-0/)

**HDFS Blogs:**  

- [Heterogeneous Storage Policies in HDP 2.2](http://hortonworks.com/blog/heterogeneous-storage-policies-hdp-2-2/)  
- [HDFS Metadata Directories Explained](http://hortonworks.com/blog/hdfs-metadata-directories-explained/)  
- [Heterogeneous Storages in HDFS](http://hortonworks.com/blog/heterogeneous-storages-hdfs/)  
- [HDFS 2.0 Next Generation Architecture](http://hortonworks.com/blog/hdfs-2-0-next-generation-architecture/)  
- [NameNode High Availability in HDP 2.0](http://hortonworks.com/blog/namenode-high-availability-in-hdp-2-0/)  
- [Introducing… Tez: Accelerating processing of data stored in HDFS](http://hortonworks.com/blog/introducing-tez-faster-hadoop-processing/)

## Concepts: MapReduce & YARN

### **Introduction**

Cluster computing faces several challenges such as how to store data persistently and keep it available if nodes fail or how to deal with node failures during a long running computation. Then there is network bottleneck which delays the time of processing data. MapReduce offers a solution by bring computation close to data thereby minimizing data movement. It is a simple programming model designed for process large volumes of data in parallel by dividing the job into a set of independent tasks.

The biggest limitation with MapReduce programming is that map and reduce jobs are not stateless. This means that Reduce jobs have to wait for map jobs to be completed first. This limits maximum parallelism and therefore [YARN](http://hortonworks.com/blog/philosophy-behind-yarn-resource-management/) was born as a generic resource management and distributed application framework.

**Goals of the Module**

*   Understanding Map and Reduce jobs.
*   Understanding YARN

[**Apache MapReduce**](http://hortonworks.com/hadoop/mapreduce/)

MapReduce is the key algorithm that the Hadoop data processing engine uses to distribute work around a cluster. A MapReduce job splits a large data set into independent chunks and organizes them into key, value pairs for parallel processing. This parallel processing improves the speed and reliability of the cluster, returning solutions more quickly and with greater reliability.

The **Map** function divides the input into ranges by the InputFormat and creates a map task for each range in the input. The JobTracker distributes those tasks to the worker nodes. The output of each map task is partitioned into a group of key-value pairs for each reduce.

*   `map(key1,value) -> list<key2,value2>`

The **Reduce** function then collects the various results and combines them to answer the larger problem that the master node needs to solve. Each reduce pulls the relevant partition from the machines where the maps executed, then writes its output back into HDFS. Thus, the reduce is able to collect the data from all of the maps for the keys and combine them to solve the problem.

*   `reduce(key2, list<value2>) -> list<value3>`

The current Apache Hadoop MapReduce System is composed of the JobTracker, which is the master, and the per-node slaves called TaskTrackers. The JobTracker is responsible for _resource management_ (managing the worker nodes i.e. TaskTrackers), _tracking resource consumption/availability_ and also _job life-cycle management_ (scheduling individual tasks of the job, tracking progress, providing fault-tolerance for tasks etc).

The TaskTracker has simple responsibilities – launch/teardown tasks on orders from the JobTracker and provide task-status information to the JobTracker periodically.

![MapR_1](http://hortonworks.com/wp-content/uploads/2015/07/MapR_1.png)

The Apache Hadoop projects provide a series of tools designed to solve big data problems. The Hadoop cluster implements a parallel computing cluster using inexpensive commodity hardware. The cluster is partitioned across many servers to provide a near linear scalability. The philosophy of the cluster design is to bring the computing to the data. So each datanode will hold part of the overall data and be able to process the data that it holds. The overall framework for the processing software is called MapReduce. Here’s a short video introduction to MapReduce:

<iframe width="500" height="281" src="https://www.youtube.com/embed/ht3dNvdNDzI?feature=oembed&amp;enablejsapi=1" frameborder="0" allowfullscreen="" id="player2"></iframe>

![MapR_2](http://hortonworks.com/wp-content/uploads/2015/07/MapR_2.png)

### [Apache YARN](http://hortonworks.com/blog/apache-hadoop-yarn-background-and-an-overview/) **(Yet Another Resource Negotiator):**

Hadoop HDFS is the data storage layer for Hadoop and MapReduce was the data-processing layer in Hadoop 1x. However, the MapReduce algorithm, by itself, isn’t sufficient for the very wide variety of use-cases we see Hadoop being employed to solve. Hadoop 2.0 presents YARN, as a generic resource-management and distributed application framework, whereby, one can implement multiple data processing applications customized for the task at hand. The fundamental idea of YARN is to split up the two major responsibilities of the JobTracker i.e. resource management and job scheduling/monitoring, into separate daemons: a global **ResourceManager** and per-application **ApplicationMaster** (AM).

The ResourceManager and per-node slave, the NodeManager (NM), form the new, and generic, **system** for managing applications in a distributed manner.

The ResourceManager is the ultimate authority that arbitrates resources among all the applications in the system. The per-application ApplicationMaster is, in effect, a _framework specific_ entity and is tasked with negotiating resources from the ResourceManager and working with the NodeManager(s) to execute and monitor the component tasks.

[ResourceManager](http://hortonworks.com/blog/apache-hadoop-yarn-resourcemanager/) has a pluggable **Scheduler**, which is responsible for allocating resources to the various running applications subject to familiar constraints of capacities, queues etc. The Scheduler is a _pure scheduler_ in the sense that it performs no monitoring or tracking of status for the application, offering no guarantees on restarting failed tasks either due to application failure or hardware failures. The Scheduler performs its scheduling function based on the _resource requirements_ of the applications; it does so based on the abstract notion of a **_Resource Container_ **which incorporates resource elements such as memory, cpu, disk, network etc.

[NodeManager](http://hortonworks.com/blog/apache-hadoop-yarn-nodemanager/) is the per-machine slave, which is responsible for launching the applications’ containers, monitoring their resource usage (cpu, memory, disk, network) and reporting the same to the ResourceManager.

The per-application ApplicationMaster has the responsibility of negotiating appropriate resource containers from the Scheduler, tracking their status and monitoring for progress. From the system perspective, the ApplicationMaster itself runs as a normal _container_.

Here is an architectural view of YARN:

![MapR_3](http://hortonworks.com/wp-content/uploads/2015/07/MapR_3.png)

One of the crucial implementation details for MapReduce within the new YARN **system** that I’d like to point out is that we have reused the existing MapReduce **framework** without any major surgery. This was very important to ensure **compatibility** for existing MapReduce applications and users. Here is a short video introduction for YARN

<iframe width="500" height="281" src="https://www.youtube.com/embed/wlouNFscZS0?start=147&amp;feature=oembed&amp;enablejsapi=1" frameborder="0" allowfullscreen="" id="player3"></iframe>

#### Suggested Readings

- HDFS is one of the 4 components of [Apache Hadoop](http://hadoop.apache.org/) the other 3 are Hadoop Common, [Hadoop YARN](http://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-site/YARN.html) and [Hadoop MapReduce](http://hortonworks.com/hadoop/mapreduce/).  To learn more about HDFS watch the following [HDFS introduction video](https://www.youtube.com/watch?v=1_ly9dZnmWc).  To learn more about YARN watch the following [YARN introduction video](https://www.youtube.com/watch?v=ZYXVNxmMchc&list=PL2y_WpKCCNQc-7RJNoYym4_g7EZb3yzJW).

**Hadoop 2.0 Blogs:**  
[Hadoop 2.7.0 Blog](http://hortonworks.com/blog/apache-hadoop-2-7-0-released/)  
[Understanding Hadoop 2.0](http://hortonworks.com/blog/understanding-hadoop-2-0/)

**YARN Blogs:**  
[YARN series-1](http://hortonworks.com/blog/resource-localization-in-yarn-deep-dive/)  
[YARN series-2](http://hortonworks.com/blog/apache-hadoop-yarn-hdp-2-2-substantial-step-forward-enterprise-hadoop/)

**Slider Blogs:**  
[Announcing Apache Slider 0.60.0](http://hortonworks.com/blog/announcing-apache-slider-0-60-0/)  
[Onboarding Long Running Services to Apache Hadoop YARN Using Apache Slider](http://hortonworks.com/blog/onboarding-long-running-services-apache-hadoop-yarn-using-apache-slider/)  
[Build YARN Apps on Hadoop with Apache Slider: Technical Preview Now Available](http://hortonworks.com/blog/apache-slider-technical-preview-now-available/)

**Capacity Scheduler Blogs:**  
[Understanding Apache Hadoop’s Capacity Scheduler](http://hortonworks.com/blog/understanding-apache-hadoops-capacity-scheduler/)  
[Configuring YARN Capacity Scheduler with Ambari](http://hortonworks.com/hadoop-tutorial/configuring-yarn-capacity-scheduler-ambari/)  
[Multi-Tenancy in HDP 2.0: Capacity Scheduler and YARN](http://hortonworks.com/blog/multi-tenancy-in-hdp-2-0-capacity-scheduler-and-yarn/)  
[Better SLAs via Resource-preemption in YARN’s Capacity Scheduler](http://hortonworks.com/blog/better-slas-via-resource-preemption-in-yarns-capacityscheduler/)


## Concepts: Hive and Pig

### **Introduction: Apache Hive**

Hive is a SQL like query language that enables analysts familiar with SQL to run queries on large volumes of data.  Hive has three main functions: data summarization, query and analysis. Hive provides tools that enable easy data extraction, transformation and loading (ETL).

**Goals of the module**

*   Understanding Apache Hive
*   Understanding Apache Tez
*   Understanding Ambari Hiver User Views on Hortonworks Sandbox

[**Apache Hive**](https://hive.apache.org/)**™:**

Data analysts use Hive to explore, structure and analyze that data, then turn it into business insight. Hive implements a dialect of SQL (Hive QL) that focuses on analytics and presents a rich set of SQL semantics including OLAP functions, sub-queries, common table expressions and more. Hive allows SQL  
developers or users with SQL tools to easily query, analyze and process data stored in Hadoop.Hive also allows programmers familiar with the MapReduce framework to plug in their custom mappers and reducers to perform more sophisticated analysis that may not be supported by the built-in capabilities of the language.

Hive users have a choice of 3 runtimes when [executing SQL queries](http://hortonworks.com/blog/5-ways-make-hive-queries-run-faster/). Users can choose between Apache Hadoop MapReduce, Apache Tez or  
Apache Spark frameworks as their execution backend

Here are some advantageous characteristics of Hive for enterprise SQL in Hadoop:

| Feature | Description |
|---------|-------------|
| Familiar| Query data with a SQL-based language |
| Fast    | Interactive response times, even over huge datasets |
| Scalable and Extensible| As data variety and volume grows, more commodity machines can be added, without a corresponding reduction in performance|

**How Hive Works**

The tables in Hive are similar to tables in a relational database, and data units are organized in a taxonomy from larger to more granular units. Databases are comprised of tables, which are made up of partitions. Data can be accessed via a simple query language and Hive supports overwriting or appending data.

Within a particular database, data in the tables is serialized and each table has a corresponding Hadoop Distributed File System (HDFS) directory. Each table can be sub-divided into partitions that determine how data is distributed within sub-directories of the table directory. Data within partitions can be further broken down into buckets.

**Components of Hive**

*   [**HCatalog**](https://cwiki.apache.org/confluence/display/Hive/HCatalog) is a component of Hive. It is a table and storage management layer for Hadoop that enables users with different data processing tools — including Pig and MapReduce — to more easily read and write data on the grid. HCatalog holds a set of files paths and metadata about data in a Hadoop cluster. This allows scripts, MapReduce and Tez, jobs to be decoupled from data location and metadata like the schema. Additionally, since HCatalog also supports tools like Hive and Pig, the location and metadata can be shared between tools. Using the open APIs of HCatalog external tools that want to integrate, such as Teradata Aster, can also use leverage file path location and metadata in HCatalog.

> At one point HCatalog was its own Apache project. However, in March, 2013, [HCatalog’s project merged](https://hive.apache.org/hcatalog_downloads.html) with Hive.  HCatalog is currently released as part of Hive.

*   [**WebHCat**](https://cwiki.apache.org/confluence/display/Hive/WebHCat) provides a service that you can use to run Hadoop MapReduce (or YARN), Pig, Hive jobs or perform Hive metadata operations using an HTTP (REST style) interface.

Here is a short video introduction on Hive:

<iframe width="500" height="281" src="https://www.youtube.com/embed/Pn7Sp2-hUXE?feature=oembed&amp;enablejsapi=1" frameborder="0" allowfullscreen="" id="player4"></iframe>

[**Apache Tez**](https://tez.apache.org/)**:**

Apache™ Tez is an extensible framework for building high performance batch and interactive data processing applications, coordinated by YARN in Apache Hadoop. Tez improves the MapReduce paradigm by dramatically improving its speed, while maintaining MapReduce’s ability to scale to petabytes of data. Important Hadoop ecosystem projects like Apache Hive and Apache Pig use Apache Tez, as do a growing number of third party data access applications developed for the broader Hadoop ecosystem.

Apache Tez provides a developer API and framework to write native [YARN](http://hortonworks.com/hadoop/yarn/) applications that bridge the spectrum of interactive and batch workloads. It allows those data access applications to work with petabytes of data over thousands nodes. The Apache Tez component library allows developers to create Hadoop applications that integrate natively with Apache Hadoop YARN and perform well within mixed workload clusters.

Since Tez is extensible and embeddable, it provides the fit-to-purpose freedom to express highly optimized data processing applications, giving them an advantage over end-user-facing engines such as [MapReduce](http://hortonworks.com/hadoop/mapreduce/) and [Apache Spark](http://hortonworks.com/hadoop/spark/). Tez also offers a customizable execution architecture that allows users to express complex computations as dataflow graphs, permitting dynamic performance optimizations based on real information about the data and the resources required to process it.

![Hive_1](http://hortonworks.com/wp-content/uploads/2015/07/Hive_1.png)

![Hive_2](http://hortonworks.com/wp-content/uploads/2015/07/Hive_2.png)

![Hive_3](http://hortonworks.com/wp-content/uploads/2015/07/Hive_3.png)

Here is a short video introduction on Tez.

<iframe width="500" height="281" src="https://www.youtube.com/embed/cPSfA1bhgVA?feature=oembed&amp;start=50&amp;enablejsapi=1" frameborder="0" allowfullscreen="" id="player5"></iframe>

### **Stinger and Stinger.next**

The Stinger Initiative was started to enable Hive to support an even broader range of use cases at truly Big Data scale: bringing it beyond its Batch roots to support interactive queries – all with a common SQL access layer.

Stinger.next is a continuation of this initiative focused on even further enhancing the [speed](http://hortonworks.com/blog/benchmarking-apache-hive-13-enterprise-hadoop/), scale and breadth of SQL support to enable truly real-time access in Hive while also bringing support for transactional capabilities.  And just as the original Stinger initiative did, this will be addressed through a familiar three-phase delivery schedule and developed completely in the open Apache Hive community.

![Hive_4](http://hortonworks.com/wp-content/uploads/2015/07/Hive_4.png)

**Ambari Hive User Views on Hortonworks Sandbox**

To make it easy to interact with Hive we use a tool in the Hortonworks Sandbox called the Ambari Hive User View.   Ambari Hive User View provides an interactive interface to Hive.   We can create, edit, save and run queries, and have Hive evaluate them for us using a series of MapReduce jobs or Tez jobs.

Let’s now open the Ambari Hive User View and get introduced to the environment, go to the Ambari User VIew icon and select Hive :

![Screen Shot 2015-07-21 at 10.10.18 AM](http://hortonworks.com/wp-content/uploads/2015/07/Screen-Shot-2015-07-21-at-10.10.18-AM.png)

Ambari Hive User View

![Hive_6](http://hortonworks.com/wp-content/uploads/2015/07/Hive_6.png)

Now let’s take a closer look at the SQL editing capabilities in the User View:

1.  There are four tabs to interact with SQL:
    1.  **Query**: This is the interface shown above and the primary interface to write, edit and execute new SQL statements
    2.  **Saved Queries**: You can save your favorite queries and quickly have access to them to rerun or edit.
    3.  **History**: This allows you to look at past queries or currently running queries to view, edit and rerun.  It also allows you to see all SQL queries you have authority to view.  For example, if you are an operator and an analyst needs help with a query, then the Hadoop operator can use the History feature to see the query that was sent from the reporting tool.
    4.  **UDF**s:  Allows you to define UDF interfaces and associated classes so you can access them from the SQL editor.
2.  **Database Explorer:**  The Database Explorer helps you navigate your database objects.  You can either search for a database object in the Search tables dialog box, or you can navigate through Database -> Table -> Columns in the navigation pane.
3.  The principle pane to write and edit SQL statements. This editor includes content assist via **CTRL + Space** to help you build queries. Content assist helps you with SQL syntax and table objects.
4.  Once you have created your SQL statement you have 3 options:
    1.  **Execute**: This runs the SQL statement.
    2.  **Explain**: This provides you a visual plan, from the Hive optimizer, of how the SQL statement will be executed.
    3.  **Save as**:  Allows you to persist your queries into your list of saved queries.
5.  When the query is executed you can see the Logs or the actual query results.
    1.  **Logs:** When the query is executed you can see the logs associated with the query execution.  If your query fails this is a good place to get additional information for troubleshooting.
    2.  **Results**: You can view results in sets of 50 by default.
6.  There are four sliding views on the right hand side with the following capabilities, which are in context of the tab you are in:
    1.  **Query**: This is the default operation,which allows you to write and edit SQL.
    2.  **Settings**:  This allows you to set properties globally or associated with an individual query.
    3.  **Visual Explain**: This will generate an explain for the query.  This will also show the progress of the query.
    4.  **TEZ**: If you use TEZ as the query execution engine then you can view the DAG associated with the query.  This integrates the TEZ User View so you can check for correctness and helps with performance tuning by visualizing the TEZ jobs associated with a SQL query.
    5.  **Notifications**: This is how to get feedback on query execution.

The Apache Hive project provides a data warehouse view of the data in HDFS. Using a SQL dialect, [HiveQL](https://cwiki.apache.org/confluence/display/Hive/LanguageManual) (HQL), Hive lets you create summarizations of your data and perform ad-hoc queries and analysis of large datasets in the Hadoop cluster. The overall approach with Hive is to project a table structure on the dataset and then manipulate it with SQL.   The notion of projecting a table structure on a file is often referred to as [Schema-On-Read](http://hortonworks.com/blog/hivehcatalog-data-geeks-big-data-glue/).   Since you are using data in HDFS, your operations can be scaled across all the datanodes and you can manipulate huge datasets.

### **Introduction: Apache Pig**

MapReduce allows allows you to specify map and reduce functions, but working out how to fit your data processing into this pattern may sometimes require you to write multiple MapReduce stages. With Pig, data structures are much richer and the transformations you can apply to data are much more powerful.

**Goals of this Module**

*   Understanding Apache Pig
*   Understanding Apache Pig on Tez
*   Understanding Ambari Pig User Views on Hortonworks Sandbox

[**Apache Pig**](https://pig.apache.org/)**™**

Apache Pig allows Apache Hadoop users to write complex MapReduce transformations using a simple scripting language called Pig Latin. Pig translates the Pig Latin script into MapReduce so that it can be executed within YARN for access to a single dataset stored in the Hadoop Distributed File System (HDFS).

Pig was designed for performing a long series of data operations, making it ideal for three categories of Big Data jobs:

*   **Extract-transform-load (ETL)** data pipelines,
*   **Research** on raw data, and
*   **Iterative data processing.**

Whatever the use case, Pig will be:

| Characteristic | Benefit |
|----------------|---------|
| Extensible | Pig users can create custom functions to meet their particular processing requirements
| Easily Programmed | Complex tasks involving interrelated data transformations can be simplified and encoded as data flow sequences. Pig programs accomplish huge tasks, but they are easy to write and maintain.
| Self-Optimizing | Because the system automatically optimizes execution of Pig jobs, the user can focus on semantics.

Please refer the following video on Pig for more clarity:

<iframe width="500" height="281" src="https://www.youtube.com/embed/PQb9I-8986s?feature=oembed&amp;enablejsapi=1" frameborder="0" allowfullscreen="" id="player6"></iframe>

**How Pig Works**

Pig runs on Apache Hadoop YARN and makes use of MapReduce and the Hadoop Distributed File System (HDFS). The language for the platform is called Pig Latin, which abstracts from the Java MapReduce idiom into a form similar to SQL. While SQL is designed to query the data, Pig Latin allows you to write a data flow that describes how your data will be transformed (such as aggregate, join and sort).

Since Pig Latin scripts can be graphs (instead of requiring a single output) it is possible to build complex data flows involving multiple inputs, transforms, and outputs. Users can extend Pig Latin by writing their own functions, using Java, Python, Ruby, or other scripting languages. Pig Latin is sometimes extended using UDFs (User Defined Functions), which the user can write in any of those languages and then call directly from the Pig Latin.

The user can run Pig in two modes, using either the “pig” command or the “java” command:

*   **MapReduce Mode.** This is the default mode, which requires access to a Hadoop cluster. The cluster may be a pseudo- or fully distributed one.
*   **Local Mode.** With access to a single machine, all files are installed and run using a local host and file system

**Ambari Pig User Views on Hortonworks Sandbox**:

To get to the Ambari Pig User View on Sandbox, click on the User Views icon at top right and select **Pig**:

![Screen Shot 2015-07-21 at 10.12.41 AM](http://hortonworks.com/wp-content/uploads/2015/07/Screen-Shot-2015-07-21-at-10.12.41-AM.png)

This will bring up the Ambari Pig User View interface. Your Pig View does not have any scripts to display, so it will look like the following:

![Pig_2](http://hortonworks.com/wp-content/uploads/2015/07/Pig_2.png)

On the left is a list of your scripts, and on the right is a composition box for writing scripts. A special feature of the interface is the Pig helper at the bottom. The Pig helper will provide us with templates for the statements, functions, I/O statements, HCatLoader() and Python user defined functions. At the very bottom are status areas that will show the results of our script and log files.

The following screenshot shows and describes the various components and features of the Pig User View:

![Pig_3](http://hortonworks.com/wp-content/uploads/2015/07/Pig_3.png)

**Suggested Readings**


- [Apache Ambari](https://ambari.apache.org/) is an open source and open community based web based tool for Hadoop operations which has been extended via [Ambari User Views](https://cwiki.apache.org/confluence/display/AMBARI/Views) to provide a growing list of developer tools as User Views.
- Follow this link to learn more about the [Ambari User VIews included in HDP](http://hortonworks.com/hadoop/ambari/).

**Hive Blogs**: 

- [Cost-Based Optimizer Makes Apache Hive 0.14 More Than 2.5X Faster](http://hortonworks.com/blog/cost-based-optimizer-makes-apache-hive-0-14-more-than-2-5x-faster/)  
- [Discover HDP 2.2: Even Faster SQL Queries with Apache Hive and Stinger.next](http://www.slideshare.net/hortonworks/discoverhdp22faster-sql-queries-with-hive)  
- [Announcing Apache Hive 1.2](http://hortonworks.com/blog/announcing-apache-hive-1-2/)  
- [HIVE 0.14 Cost Based Optimizer (CBO) Technical Overview](http://hortonworks.com/blog/hive-0-14-cost-based-optimizer-cbo-technical-overview/)  
- [5 Ways to Make Your Hive Queries Run Faster](http://hortonworks.com/blog/5-ways-make-hive-queries-run-faster/)  
- [Secure JDBC and ODBC Clients’ Access to HiveServer2](http://hortonworks.com/blog/secure-jdbc-odbc-clients-access-hiveserver2/)  
- [Speed, Scale and SQL: The Stinger Initiative, Apache Hive 12 & Apache Tez](http://hortonworks.com/blog/speed-scale-sql-stinger-initiative-apache-hive-12-apache-tez/)  
- [Hive/HCatalog – Data Geeks & Big Data Glue](http://hortonworks.com/blog/hivehcatalog-data-geeks-big-data-glue/)

**Tez Blogs**:  
- [Apache Tez: A New Chapter in Hadoop Data Processing](http://hortonworks.com/blog/apache-tez-a-new-chapter-in-hadoop-data-processing/)  
- [Data Processing API in Apache Tez](http://hortonworks.com/blog/expressing-data-processing-in-apache-tez)**ORC Blogs:**  
- [Apache ORC Launches as a Top-Level Project](http://hortonworks.com/blog/apache-orc-launches-as-a-top-level-project/)  
- [ORCFile in HDP 2: Better Compression, Better Performance](http://hortonworks.com/blog/orcfile-in-hdp-2-better-compression-better-performance/)


## Lab 0: Set-up

### **Start the Sandbox VM and Open Ambari**

Start the HDP Sandbox following the [Sandbox Install Guide](http://hortonworks.com/products/hortonworks-sandbox/#install) to start the VM:

![Lab0_1](http://hortonworks.com/wp-content/uploads/2015/07/Lab0_1.png)

Once you have installed the Sandbox VM, it resolves to the host on your environment, the address of which varies depending upon the Virtual Machine you are using(Vmware, VirtualBox etc). As, a general thumb rule, wait for the installation to complete and confirmation screen will tell you the host your sandbox resolves to. For example:

In case of VirtualBox: host would be 127.0.0.1

![Lab0_2](http://hortonworks.com/wp-content/uploads/2015/07/Lab0_2.png)

If you are using a private cluster or a cloud to run sandbox. Please find the host your sandbox resolves to.

Append the port number :8888 to your host address, open your browser, and access Sandbox Welcome page at http://_host_:8888/.

![Screen Shot 2015-07-20 at 6.11.32 PM](http://hortonworks.com/wp-content/uploads/2015/07/Screen-Shot-2015-07-20-at-6.11.32-PM.png)

Navigate to Ambari welcome page using the url given on Sandbox welcome page.

**Both the username and password to login are admin.**

If you want to search for the host address your sandbox is running on, ssh into the sandbox terminal upon successful installation and follow subsequent steps:

1.  login using username as “root” and password as “hadoop”.
2.  Type ifconfig and look for inet address under eth.
3.  Use the inet address, append :8080 and open it into a browser. It shall direct you to Ambari login page.
4.  This inet address is randomly generated for every session and therefore differs from session to session.


| Service | URL | 
|---------|-----|
| Sandbox Welcome Page | [http://_host_:8888]()|
| Ambari Dashboard | [http://_host_:8080]()|
| Ambari Welcome | [http://_host_:8080/views/ADMIN_VIEW/2.1.0/INSTANCE/#/]()|
| Hive User View | [http://_host_:8080/#/main/views/HIVE/1.0.0/Hive]()|
| Pig User View | [http://_host_:8080/#/main/views/PIG/0.1.0/MyPig]()|
| File User View | [http://_host_:8080/#/main/views/FILES/0.2.0/MyFiles]()|
| SSH Web Client | [http://_host_:4200]()|
| Hadoop Configuration | [http://_host_:50070/dfshealth.html http://_host_:50070/explorer.html]() |


The following table has some useful URLs as well:


| Service | User | Password |
|---------|------|----------|
| Ambari | admin | admin |
| Linux OS | root | hadoop |


Enter the Ambari Welcome URL and then you should see a similar screen:

There are 5 key capabilities to explore in the Ambari Welcome screen:

![Lab0_3](http://hortonworks.com/wp-content/uploads/2015/07/Lab0_3.png)

1.  “**Operate Your Cluster**” will take you to the Ambari Dashboard which is the primary UI for Hadoop Operators
2.  “**Manage Users + Groups**” allows you to add & remove Ambari users and groups
3.  “**Clusters**” allows you to grant permission to Ambari users and groups
4.  “**Ambari User Views**” list the set of Ambari Users views that are part of the cluster
5.  “**Deploy Views**” provides administration for adding and removing Ambari User Views

Take a few minutes to quickly explore these 5 capabilities and to become familiar their features.

Enter the Ambari Dashboard URL and you should see a similar screen:

##### ![Lab0_4](http://hortonworks.com/wp-content/uploads/2015/07/Lab0_4.png)

Briefly skim through the Ambari Dashboard links (circled above) by clicking on

1.  **Metrics**, **Heatmap** and **Configuration**

and then the

1.  **Dashboard**, **Services**, **Hosts**, **Alerts**, **Admin** and User Views icon (represented by 3×3 matrix ) to become familiar with the Ambari resources available to you.

- To learn more about Hadoop please explore the [HDP Getting Started documentation](http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.2.4/bk_getting-started-guide/content/ch_about-hortonworks-data-platform.html).  
- If you have questions, feedback or need help getting your environment ready visit  [developer.hortonworks.com](http://hortonworks.com/developer/).
- Please also explore the [HDP documentation](http://docs.hortonworks.com/).
- To ask a question check out the [Hortonworks Forums](http://hortonworks.com/community/forums/).

## Lab 1: HDFS - Loading Data

### **Loading Sensor Data into HDFS**

**Introduction:**

In this section you will download the sensor data and load that into HDFS using Ambari User Views. You will get introduced to the Ambari Files User View to manage files. You can perform tasks like create directories, navigate file systems and upload files to HDFS.  In addition you’ll perform a few other file-related tasks as well.  Once you get the basics, you will create two directories and then load two files into HDFS using the Ambari Files User View.

**Prerequisites:**

The tutorial is a part of series of hands on tutorial to get you started on HDP using Hortonworks sandbox. Please ensure you complete the prerequisites before proceeding with this tutorial.

*   Step 0 (Hortonworks sandbox set up)
*   Allow yourself around half an hour to complete this tutorial.

**Outline:**

*   HDFS backdrop
*   Step 1.1: Download data – [**Geolocation.zip**](https://app.box.com/HadoopCrashCourseData)
*   Step 1.2: Load Data into HDFS
*   Suggested readings

**HDFS backdrop:**

A single physical machine gets saturated with its storage capacity as the data grows. Thereby comes impending need to partition your data across separate machines. This type of File system that manages storage of data across a network of machines is called Distributed File Systems. [HDFS](http://hortonworks.com/blog/thinking-about-the-hdfs-vs-other-storage-technologies/) is a core component of Apache Hadoop and is designed to store large files with streaming data access patterns, running on clusters of commodity hardware. With Hortonworks Data Platform HDP 2.2, HDFS is now expanded to support [heterogeneous storage](http://hortonworks.com/blog/heterogeneous-storage-policies-hdp-2-2/)  media within the HDFS cluster.

**Step 1.1: Download and Extract the Sensor Data Files**

*   You can download the sample sensor data contained in a compressed (.zip) folder here:  [**Geolocation.zip**](https://app.box.com/HadoopCrashCourseData)
*   Save the Geolocation.zip file to your computer, then extract the files. You should see a Geolocation folder that contains the following files:
    *   geolocation.csv – This is the collected geolocation data from the trucks. it contains records showing truck location, date, time, type of event, speed, etc.
    *   trucks.csv – This is data was exported from a relational database and it shows info on truck model, driverid, truckid, and aggregated mileage info.

**Step 1.2: Load the Sensor Data into HDFS**

*   Go to the Ambari Dashboard and open the HDFS User View by click on the User Views icon and selecting the HDFS Files menu item.

![Screen Shot 2015-07-21 at 10.17.21 AM](http://hortonworks.com/wp-content/uploads/2015/07/Screen-Shot-2015-07-21-at-10.17.21-AM.png)

*   Starting from the top root of the HDFS file system, you will see all the files the logged in user (admin in this case) has access to see:

![Lab2_2](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_2.png)

*   Click tmp. Then click  ![Lab2_3](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_3.png) button to create the /tmp/admin directory and then create the /tmp/admin/data directory.

![Screen Shot 2015-07-27 at 9.42.07 PM](http://hortonworks.com/wp-content/uploads/2015/07/Screen-Shot-2015-07-27-at-9.42.07-PM.png)

*   Now traverse to the /tmp/admin/data directory and upload the corresponding geolocation.csv and trucks.csv files into it.

![Screen Shot 2015-07-27 at 9.43.28 PM](http://hortonworks.com/wp-content/uploads/2015/07/Screen-Shot-2015-07-27-at-9.43.28-PM.png)

You can also perform the following operations on a file by right clicking on the file: **Download**, **Move**, **Permissions**, **Rename** and **Delete**.

** IMPORTANT **

- Right click on the file `trucks.csv`. Click **Permissions**. Make sure that the background of all the **write** boxes are checked (blue).

![Lab2_5](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_5.png)


## Lab 2: Hive - Data ETL

### **Data manipulation with Hive**

**Introduction:**

In this section of tutorial you will be introduced to Apache Hive. In the earlier section we covered how to load data into HDFS. So now you have ‘geolocation’ and ‘trucks’ files stored in HDFS as csv files. In order to use this data in Hive we will tell you how to create a table and how to move data into Hive warehouse, from where it can be queried upon. We will analyze this data using SQL queries in Hive User Views and store it as ORC. We will also walk through Apache Tez and how a DAG is created when you specify Tez as execution engine for Hive. Lets start..!!

**Prerequisites:**

The tutorial is a part of series of hands on tutorial to get you started on HDP using Hortonworks sandbox. Please ensure you complete the prerequisites before proceeding with this tutorial.

*   Step 0 (Hortonworks sandbox set up)
*   Lab 1: Loading sensor data into HDFS
*   Allow yourself around one hour to complete this tutorial.

**Outline:**

*   Hive basics
*   Step 2.1: Use Ambari Hive User Views
*   Step 2.2: Define a Hive Table
*   Step 2.3: Load Data into Hive Table
*   Step 2.4: Define an ORC table in Hive
*   Step 2.5: Review Hive Settings
*   Step 2.6: Analyze Truck Data
*   Suggested readings

### Hive

Hive is a SQL like query language that enables analysts familiar with SQL to run queries on large volumes of data.  Hive has three main functions: data summarization, query and analysis. Hive provides tools that enable easy data extraction, transformation and loading (ETL).

#### **Step 2.1: Become Familiar with Ambari Hive User View**

Apache Hive™ presents a relational view of data in HDFS and ensures that users need not worry about where or in what format their data is stored.  Hive can display data from RCFile format, text files, ORC, JSON, parquet,  sequence files and many of other formats in a tabular view.   Through the use of SQL you can view your data as a table and create queries like you would in an RDBMS.

To make it easy to interact with Hive we use a tool in the Hortonworks Sandbox called the Ambari Hive User View.   Ambari Hive User View provides an interactive interface to Hive.   We can create, edit, save and run queries, and have Hive evaluate them for us using a series of MapReduce jobs or Tez jobs.

Let’s now open the Ambari Hive User View and get introduced to the environment, go to the Ambari User VIew icon and select Hive :

![Screen Shot 2015-07-21 at 10.10.18 AM](http://hortonworks.com/wp-content/uploads/2015/07/Screen-Shot-2015-07-21-at-10.10.18-AM-300x208.png)

The Ambari Hive User View looks like the following:

![Lab2_2](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_21.png)

Now let’s take a closer look at the SQL editing capabilities in the User View:

1.  There are four tabs to interact with SQL:
    1.  **Query**: This is the interface shown above and the primary interface to write, edit and execute new SQL statements
    2.  **Saved Queries**: You can save your favorite queries and quickly have access to them to rerun or edit.
    3.  **History**: This allows you to look at past queries or currently running queries to view, edit and rerun.  It also allows you to see all SQL queries you have authority to view.  For example, if you are an operator and an analyst needs help with a query, then the Hadoop operator can use the History feature to see the query that was sent from the reporting tool.
    4.  **UDF**s:  Allows you to define UDF interfaces and associated classes so you can access them from the SQL editor.
2.  **Database Explorer:**  The Database Explorer helps you navigate your database objects.  You can either search for a database object in the Search tables dialog box, or you can navigate through Database -> Table -> Columns in the navigation pane.
3.  The principle pane to write and edit SQL statements. This editor includes content assist via **CTRL + Space** to help you build queries. Content assist helps you with SQL syntax and table objects.
4.  Once you have created your SQL statement you have 3 options:
    1.  **Execute**: This runs the SQL statement.
    2.  **Explain**: This provides you a visual plan, from the Hive optimizer, of how the SQL statement will be executed.
    3.  **Save as**:  Allows you to persist your queries into your list of saved queries.
5.  When the query is executed you can see the Logs or the actual query results.
    1.  **Logs:** When the query is executed you can see the logs associated with the query execution.  If your query fails this is a good place to get additional information for troubleshooting.
    2.  **Results**: You can view results in sets of 50 by default.
6.  There are four sliding views on the right hand side with the following capabilities, which are in context of the tab you are in:
    1.  **Query**: This is the default operation,which allows you to write and edit SQL.
    2.  **Settings**:  This allows you to set properties globally or associated with an individual query.
    3.  **Visual Explain**: This will generate an explain for the query.  This will also show the progress of the query.
    4.  **TEZ**: If you use TEZ as the query execution engine then you can view the DAG associated with the query.  This integrates the TEZ User View so you can check for correctness and helps with performance tuning by visualizing the TEZ jobs associated with a SQL query.
    5.  **Notifications**: This is how to get feedback on query execution.

Take a few minutes to explore the various Hive User View features.

**Step 2.2: Define a Hive Table**

Now that you are familiar with the Hive User View, let’s create the initial staging tables for the geolocation and trucks data. In this section we will learn how to use the Ambari Hive User View to create four tables: geolocaiton_stage, trucking_stage, geolocation, trucking.  First we are going to create 2 tables to stage the data in their original csv text format and then will create two more tables where we will optimize the storage with ORC. Here is a visual representation of the Data Flow:

![Lab2_3](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_31.png)

1.  Copy-and-paste the the following table DDL into the empty **Worksheet** of the **Query Editor** to define a new table named geolocation_staging:

**Create table geolocation for staging initial load**

~~~
CREATE TABLE geolocation_stage (truckid string, driverid string, event string, latitude DOUBLE, longitude DOUBLE, city string, state string, velocity BIGINT, event_ind BIGINT, idling_ind BIGINT) 
ROW FORMAT DELIMITED 
FIELDS TERMINATED BY ',' 
STORED AS TEXTFILE
TBLPROPERTIES ("skip.header.line.count"="1");
~~~

2.  Click the green **Execute** button to run the command. If successful, you should see the **Succeeded** status in the **Query Process Results** section:

![Lab2_4](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_41.png)

3.  Create a new Worksheet by clicking the blue **New Worksheet** button:

![Lab2_5](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_51.png)

4.  Notice the tab of your new Worksheet is labeled “Worksheet (1)”. Double-click on this tab to rename the label to “trucks_stage”:

![Lab2_6](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_6.png)

5.  Copy-and-paste the following table DDL into your **trucks_stage** worksheet to define a new table named trucks_stage:

**Create table trucks for staging initial load**

~~~
CREATE TABLE trucks_stage(driverid string, truckid string, model string, jun13_miles bigint, jun13_gas bigint, may13_miles bigint, may13_gas bigint, apr13_miles bigint, apr13_gas bigint, mar13_miles bigint, mar13_gas bigint, feb13_miles bigint, feb13_gas bigint, jan13_miles bigint, jan13_gas bigint, dec12_miles bigint, dec12_gas bigint, nov12_miles bigint, nov12_gas bigint, oct12_miles bigint, oct12_gas bigint, sep12_miles bigint, sep12_gas bigint, aug12_miles bigint, aug12_gas bigint, jul12_miles bigint, jul12_gas bigint, jun12_miles bigint, jun12_gas bigint,may12_miles bigint, may12_gas bigint, apr12_miles bigint, apr12_gas bigint, mar12_miles bigint, mar12_gas bigint, feb12_miles bigint, feb12_gas bigint, jan12_miles bigint, jan12_gas bigint, dec11_miles bigint, dec11_gas bigint, nov11_miles bigint, nov11_gas bigint, oct11_miles bigint, oct11_gas bigint, sep11_miles bigint, sep11_gas bigint, aug11_miles bigint, aug11_gas bigint, jul11_miles bigint, jul11_gas bigint, jun11_miles bigint, jun11_gas bigint, may11_miles bigint, may11_gas bigint, apr11_miles bigint, apr11_gas bigint, mar11_miles bigint, mar11_gas bigint, feb11_miles bigint, feb11_gas bigint, jan11_miles bigint, jan11_gas bigint, dec10_miles bigint, dec10_gas bigint, nov10_miles bigint, nov10_gas bigint, oct10_miles bigint, oct10_gas bigint, sep10_miles bigint, sep10_gas bigint, aug10_miles bigint, aug10_gas bigint, jul10_miles bigint, jul10_gas bigint, jun10_miles bigint, jun10_gas bigint, may10_miles bigint, may10_gas bigint, apr10_miles bigint, apr10_gas bigint, mar10_miles bigint, mar10_gas bigint, feb10_miles bigint, feb10_gas bigint, jan10_miles bigint, jan10_gas bigint, dec09_miles bigint, dec09_gas bigint, nov09_miles bigint, nov09_gas bigint, oct09_miles bigint, oct09_gas bigint, sep09_miles bigint, sep09_gas bigint, aug09_miles bigint, aug09_gas bigint, jul09_miles bigint, jul09_gas bigint, jun09_miles bigint, jun09_gas bigint, may09_miles bigint, may09_gas bigint, apr09_miles bigint, apr09_gas bigint, mar09_miles bigint, mar09_gas bigint, feb09_miles bigint, feb09_gas bigint, jan09_miles bigint, jan09_gas bigint)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
STORED AS TEXTFILE
TBLPROPERTIES ("skip.header.line.count"="1");
~~~

6.  Execute the query and make sure it runs successfully.

Let’s review some aspects of the CREATE TABLE statements issued above.  If you have a SQL background this statement should seem very familiar except for the last 3 lines after the columns definition:

*   The ROW FORMAT clause specifies each row is terminated by the new line character.
*   The FIELDS TERMINATED BY clause specifies that the fields associated with the table (in our case, the two csv files) are to be delimited by a comma.
*   The STORED AS clause specifies that the table will be stored in the TEXTFILE format.

For details on these clauses consult the [Apache Hive Language Manual](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL).

7.  To verify the tables were defined successfully, click the “refresh” icon in the Database Explorer. Under Databases, click default database to expand the list of table and the new tables should appear:

![Lab2_7](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_7.png)

8.  Click on the trucks_stage table name to view its schema.

9.  Click on the **Load sample data** icon to generate and execute a select SQL statement to query the table for a 100 rows. Notice your two new tables are currently empty.

- You can have multiple SQL statements within each editor worksheet, but each statement needs to be separated by a semicolon “;”.

- If you have multiple statements within a worksheet but you only want to run one of them just highlight the statement you want ran and then click the Execute button.

**A few additional commands to explore tables:**

- `show tables;` List the tables created in the database by looking up the list of tables from the metadata stored in HCatalogdescribe _
-`{table_name}`;Provides a list of columns for a particular table (ie `describe geolocation_stage;`)
- `show create {table_name};`Provides the DDL to recreate a table (ie `show create table geolocation_stage;`)

10.  By default, when you create a table in Hive, a directory with the same name gets created in the /apps/hive/warehouse folder in HDFS.  Using the Ambari Files User View, navigate to the /apps/hive/warehouse folder. You should see both a geolocation_stage and trucks_stage directory:

![Lab2_8](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_8.png)

- The definition of a Hive table and its associated metadata (i.e., the directory the data is stored in, the file format, what Hive properties are set, etc.) are stored in the Hive metastore, which on the Sandbox is a MySQL database.

**Step 2.3: Load Data into a Hive table**

1.  Let’s load some data into your two Hive tables. Populating a Hive table can be done in various ways. A simple way to populate a table is to put a file into the directory associated with the table. Using the Ambari Files User View, click on the **Move** icon next to the file /tmp/admin/data/geolocation.csv. (Clicking on **Move** is similar to “cut” in cut-and-paste.)

![Screen Shot 2015-07-27 at 9.45.11 PM](http://hortonworks.com/wp-content/uploads/2015/07/Screen-Shot-2015-07-27-at-9.45.11-PM.png)

2.  After clicking on the **Move** arrow your screen should look like the following:

![Lab2_10](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_10.png)

Notice two things have changed:

1.  The file name geolocation.csv has grayed out some
2.  The icons associated with the operations on the files are removed. This is to indicate that this file is in a special state that is ready to be moved.
3.  Now navigate to the destination path /apps/hive/warehouse/geolocation_stage.  You might notice that as you navigate through the directories that the file is pinned at the top.  Once you get to the appropriate directory click on the **Paste** icon to move the file:

![Lab2_11](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_111.png)

4.  Go back to the Ambari Hive View and click on the **Load sample data** icon next to the geolocation_stage table. Notice the table is no longer empty, and you should see the first 100 rows of the table:

![Lab2_12](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_12.png)

5.  Enter the following SQL command into an empty Worksheet in the Ambari Hive User View:

~~~
LOAD DATA INPATH '/tmp/admin/data/trucks.csv' OVERWRITE INTO TABLE trucks_stage;
~~~

6.  You should now see data in the trucks_stage table:

![Lab2_13](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_13.png)

7.  From the Files view, navigate to the /temp/admin/data folder. Notice the folder is empty! The LOAD DATA INPATH command moved the trucks.csv file from the /user/admin/data folder to the /apps/hive/warehouse/trucks_stage folder.

**Step 2.4: Define an ORC Table in Hive**

#### **Introducing** [**Apache ORC**](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+ORC)

The Optimized Row Columnar ([new Apache ORC project](http://hortonworks.com/blog/apache-orc-launches-as-a-top-level-project/)) file format provides a highly efficient way to store Hive data. It was designed to overcome limitations of the other Hive file formats. Using ORC files improves performance when Hive is reading, writing, and processing data.

To use the ORC format, specify ORC as the file format when creating the table:

`CREATE TABLE … **STORED AS ORC**`

In this step, you will create two ORC tables (geolocation and trucks) that are created from the text data in your geolocation_stage and trucks_stage tables.

1.  From the Ambari Hive User View, execute the following table DDL to define a new table named geolocation:

**Create table geolocation as ORC from geolocation_stage table**

~~~
CREATE TABLE geolocation STORED AS ORC AS SELECT * FROM geolocation_stage;
~~~

2.  Refresh the **Database Explorer** and verify you have a table named geolocation in the default database:

![Lab2_14](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_14.png)

3.  View the contents of the geolocation table. Notice it contains the same rows as geolocation_stage.

4.  To verify geolocation is an ORC table, execute the following query:

describe formatted geolocation;

5.  Scroll down to the bottom of the **Results** tab and you will see a section labeled **Storage Information**. The output should look like:

![Lab2_15](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_15.png)

6.  Execute the following query to define a new ORC table named trucks that contains the data from trucks_stage:

**Create table trucks as ORC from trucks_stage table**

~~~
CREATE TABLE trucks STORED AS ORC TBLPROPERTIES ("orc.compress.size"="1024") AS SELECT * FROM trucks_stage;
~~~

7.  Verify that the table has been properly created by refreshing the **Database Explorer** and viewing the contents of trucks:

![Lab2_16](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_16.png)


- If you want to try running some of these commands from the Hive Shell follow the following steps from your terminal shell (or putty if using Windows):

1.  `ssh root@127.0.0.1 -p 2222`
    Root pwd is hadoop
2.  `su hive`
3.  `hive`

Starts Hive shell and now you can enter commands and SQL

1.  `quit;`

Exits out of the Hive shell.


#### **Step 2.5: Review Hive Settings**

1.  Open the Ambari Dashboard in another tab by right clicking on the Ambari icon

![Lab2_17](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_17.png)

2.  Go to the **Hive page** then select the **Configs tab** then click on **Settings tab**:

![Lab2_18](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_18.png)

Once you click on the Hive page you should see a page similar to above:

1.  Hive Page
2.  Hive Configs Tab
3.  Hive Settings Tab
4.  Version History of Configuration

Scroll down to the Optimization Settings:

![Lab2_19](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_19.png)  
In the above screenshot we can see:

1.  Tez is set as the optimization engine
2.  Cost Based Optimizer (CBO) is turned on

This shows the new HDP 2.3 Ambari Smart Configurations, which simplifies setting configurations

- Hadoop is configured by a collection of XML files.
- In early versions of Hadoop operators would need to do XML editing to change settings.  There was no default versioning.
- Early Ambari interfaces made it easier to change values by showing the settings page with dialog boxes for the various settings and allowing you to edit them.  However, you needed to know what needed to go into the field and understand the range of values.
- Now with Smart Configurations you can toggle binary features and use the slider bars with settings that have ranges.

By default the key configurations are displayed on the first page.  If the setting you are looking for is not on this page you can find additional settings in the **Advanced** tab:

![Lab2_20](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_20.png)

For example, what if we wanted to improve SQL performance by using the new Hive vectorization features, where would we find the setting and how would we turn it on.   You would need to do the following steps:

1.  Click on the **Advanced** tab and scroll to find the property
2.  Or, start typing in the property into the property search field and then this would filter the setting you scroll for.

As you can see from the green circle above the hive.vectorized.execution.enabled is turned on already.

**Some key resources to learn more about vectorization and some of the key settings in Hive tuning:**

* Apache Hive docs on [Vectorized Query Execution](https://cwiki.apache.org/confluence/display/Hive/Vectorized+Query+Execution)
* [HDP Docs Vectorization docs](http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.0.9.0/bk_dataintegration/content/ch_using-hive-1a.html)
* [Hive Blogs](http://hortonworks.com/blog/category/hive/)
* [5 Ways to Make Your Hive Queries Run Faster](http://hortonworks.com/blog/5-ways-make-hive-queries-run-faster/)
* [Interactive Query for Hadoop with Apache Hive on Apache Tez](http://hortonworks.com/hadoop-tutorial/supercharging-interactive-queries-hive-tez/)
* [Evaluating Hive with Tez as a Fast Query Engine](http://hortonworks.com/blog/evaluating-hive-with-tez-as-a-fast-query-engine/)

#### **Step 2.6: Analyze the Trucks Data**

Next we will be using Hive, Pig and Excel to analyze derived data from the geolocation and trucks tables.  The business objective is to better understand the risk the company is under from fatigue of drivers, over-used trucks, and the impact of various trucking events on risk.   In order to accomplish this we are going to apply a series of transformations to the source data, mostly though SQL, and use Pig to calculate risk.   In Step 10 we will be using Microsoft Excel to generate a series of charts to better understand risk.  
![Lab2_21](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_211.png)

Let’s get started with the first transformation.   We want to calculate the miles per gallon for each truck. We will start with our truck data table.  We need to sum up all the miles and gas columns on a per truck basis. Hive has a series of functions that can be used to reformat a table. The keyword [LATERAL VIEW](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+LateralView) is how we invoke things. The stack function allows us to restructure the data into 3 columns labeled rdate, gas and mile with 54 rows. We pick truckid, driverid, rdate, miles, gas from our original table and add a calculated column for mpg (miles/gas).  And then we will calculate average mileage.

1.  Using the Ambari Hive User View, execute the following query:

**Create table truck_mileage from existing trucking data**

~~~
CREATE TABLE truck_mileage STORED AS ORC AS SELECT truckid, driverid, rdate, miles, gas, miles / gas mpg FROM trucks LATERAL VIEW stack(54, 'jun13',jun13_miles,jun13_gas,'may13',may13_miles,may13_gas,'apr13',apr13_miles,apr13_gas,'mar13',mar13_miles,mar13_gas,'feb13',feb13_miles,feb13_gas,'jan13',jan13_miles,jan13_gas,'dec12',dec12_miles,dec12_gas,'nov12',nov12_miles,nov12_gas,'oct12',oct12_miles,oct12_gas,'sep12',sep12_miles,sep12_gas,'aug12',aug12_miles,aug12_gas,'jul12',jul12_miles,jul12_gas,'jun12',jun12_miles,jun12_gas,'may12',may12_miles,may12_gas,'apr12',apr12_miles,apr12_gas,'mar12',mar12_miles,mar12_gas,'feb12',feb12_miles,feb12_gas,'jan12',jan12_miles,jan12_gas,'dec11',dec11_miles,dec11_gas,'nov11',nov11_miles,nov11_gas,'oct11',oct11_miles,oct11_gas,'sep11',sep11_miles,sep11_gas,'aug11',aug11_miles,aug11_gas,'jul11',jul11_miles,jul11_gas,'jun11',jun11_miles,jun11_gas,'may11',may11_miles,may11_gas,'apr11',apr11_miles,apr11_gas,'mar11',mar11_miles,mar11_gas,'feb11',feb11_miles,feb11_gas,'jan11',jan11_miles,jan11_gas,'dec10',dec10_miles,dec10_gas,'nov10',nov10_miles,nov10_gas,'oct10',oct10_miles,oct10_gas,'sep10',sep10_miles,sep10_gas,'aug10',aug10_miles,aug10_gas,'jul10',jul10_miles,jul10_gas,'jun10',jun10_miles,jun10_gas,'may10',may10_miles,may10_gas,'apr10',apr10_miles,apr10_gas,'mar10',mar10_miles,mar10_gas,'feb10',feb10_miles,feb10_gas,'jan10',jan10_miles,jan10_gas,'dec09',dec09_miles,dec09_gas,'nov09',nov09_miles,nov09_gas,'oct09',oct09_miles,oct09_gas,'sep09',sep09_miles,sep09_gas,'aug09',aug09_miles,aug09_gas,'jul09',jul09_miles,jul09_gas,'jun09',jun09_miles,jun09_gas,'may09',may09_miles,may09_gas,'apr09',apr09_miles,apr09_gas,'mar09',mar09_miles,mar09_gas,'feb09',feb09_miles,feb09_gas,'jan09',jan09_miles,jan09_gas ) dummyalias AS rdate, miles, gas;
~~~

![Lab2_22](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_22.png)  

2.  To view the data generated by the script, click **Load Sample Data** icon in the Database Explorer next to truck_mileage. After clicking the next button once, you should see a table that list each trip made by a truck and driver:

![Lab2_23](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_23.png)

#### **Use the Content Assist to build a query**

3.  Create a new SQL Worksheet.

4.  Start typing in the SELECT SQL command, but only enter the first two letters:

~~~
SE
~~~

5.  Press **Ctrl+space** to view the following content assist pop-up dialog window:

![Lab2_24](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_24.png)

Notice content assist shows you some options that start with an “SE”.

6.  Type in the following query, using **Ctrl+space** throughout your typing so that you can get an idea of what content assist can do and how it works:

~~~
SELECT truckid, avg(mpg) avgmpg FROM truck_mileage GROUP BY truckid;
~~~

![Lab2_28](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_28.png)  

7.  Click the “**Save as …**” button to save the query as “**average mpg**”:  

![Lab2_26](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_26.png)

8.  Notice your query now shows up in the list of “Saved Queries”, which is one of the tabs at the top of the Hive User View.

9.  Execute the “**average mpg**” query and view its results.

10. Now lets explore the various explain features to better understand the execution of a query: Text Explain, Visual Explain and Tez Explain. Click on the **Explain** button:

![Lab2_27](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_27.png)

11. Verify this added the `EXPLAIN` command at the beginning of the query:

![Lab2_25](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_25.png)

12. Execute the query. The results should look like the following:

![Lab2_29](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_29.png)

13. Click on **STAGE PLANS:** to view its output, which displays the flow of the resulting Tez job:

![Lab2_30](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_30.png)

14. To see the Visual Explain click on the Visual Explain icon on the right tabs. This is a much more readable summary of the explain plan:

![Lab2_31](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_311.png)

15. If you click on the **TEZ** tab on the right-hand column, you can see DAG details associated with the query.

![Lab2_32](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_32.png)

16. However, you can also view the DAG by going to the Ambari Tez User View. Select the “Tez View: Cluster Instance” User View from the list of User Views.

![Screen Shot 2015-07-21 at 10.22.56 AM](http://hortonworks.com/wp-content/uploads/2015/07/Screen-Shot-2015-07-21-at-10.22.56-AM.png)  
Select the first DAG as it represents the last job that was executed.

![Lab2_34](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_34.png)

17. There are six tabs at the top right please take a few minutes to explore the various tabs and then click on the Graphical View tab and hover over one of the nodes with your cursor to get more details on the processing in that node.  
![Lab2_35](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_35.png)

18. Go back to the Hive UV and save the query by

19.  To persist these results into a table, This is a fairly common pattern in Hive and it is called [Create Table As Select](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL#LanguageManualDDL-CreateTableAsSelect(CTAS)) (CTAS ).  Paste the following script into a new Worksheet, then click the **Execute** button:

**Create table truck avg_mileage from existing trucks_mileage data**

~~~
CREATE TABLE avg_mileage
STORED AS ORC
AS
SELECT truckid, avg(mpg) avgmpg
FROM truck_mileage
GROUP BY truckid;
~~~

20.  To view the data generated by the script, click **Load sample data** icon in the Database Explorer next to avg_mileage. You see our table is now a list of each trip made by a truck.

![Lab2_36](http://hortonworks.com/wp-content/uploads/2015/07/Lab2_36.png)


## Lab 3: Pig - Risk Factor

### **Use Pig to compute Driver Risk Factor**

#### **Introduction:**

In this tutorial you will be introduced to Apache Pig. In the earlier section of lab you learned how to load data into HDFS and then manipulate it using Hive. We are using the Truck sensor data to better understand  risk associated with every driver. This section will teach you to compute risk using Apache Pig.

**Prerequisites:**

The tutorial is a part of series of hands on tutorial to get you started on HDP using Hortonworks sandbox. Please ensure you complete the prerequisites before proceeding with this tutorial.

*   Step 0 (Hortonworks sandbox set up)
*   Lab 1: Loading sensor data into HDFS
*   Lab 2: Data Manipulation with Apache Hive
*   Allow yourself around one hour to complete this tutorial.

**Outline:**

*   Pig basics
*   Step 3.1: Define Table schema
*   Step 3.2: Create Pig Script
*   Step 3.3: Quick Recap
*   Step 3.4: Execute Pig Script on Tez
*   Suggested readings

**Pig Basics:**

Pig is a high level scripting language that is used with Apache Hadoop. Pig enables data workers to write complex data transformations without knowing Java. Pig’s simple SQL-like scripting language is called Pig Latin, and appeals to developers already familiar with scripting languages and SQL.

Pig is complete, so you can do all required data manipulations in Apache Hadoop with Pig. Through the User Defined Functions(UDF) facility in Pig, Pig can invoke code in many languages like JRuby, Jython and Java. You can also embed Pig scripts in other languages. The result is that you can use Pig as a component to build larger and more complex applications that tackle real business problems.

Pig works with data from many sources, including structured and unstructured data, and store the results into the Hadoop Data File System.

Pig scripts are translated into a series of MapReduce jobs that are run on the Apache Hadoop cluster.

**Step 3.1: Define table schema**

Now we have refined the truck data to get the average mpg  for each truck. The next task is to compute the risk factor for each driver which is the total miles driven/abnormal events. We can get the event information from the geolocation table.

![Lab3_1](http://hortonworks.com/wp-content/uploads/2015/07/Lab3_1.png)

If we look at the truck_mileage table, we we have the driverid and the number of miles for each trip. To get the total miles for each driver, we can group those records by driverid and then sum the miles.

1.  We will start by creating a table named driver_mileage that is created from a query of the columns we want from truck_mileage. The following query groups the records by driverid and sums the miles in the select statement. Execute this query in a new Worksheet:

**Create table DriverMileage from existing truck_mileage data**

~~~
CREATE TABLE DriverMileage
STORED AS ORC
AS
SELECT driverid, sum(miles) totmiles
FROM truck_mileage
GROUP BY driverid;
~~~

2. View the data generated by the script by clicking the **Load sample data** icon in the Database Explorer next to drivermileage. The results should look like:

![Lab3_2](http://hortonworks.com/wp-content/uploads/2015/07/Lab3_2.png)

3. Next, you will use Pig to compute the risk factor of each driver. Before we can run the Pig code, one of the requirements for the HCatStorer() class is that the table must already exist in Hive. The Pig code expects the following structure for a table named riskfactor. Execute the following DDL command:

**Create table avg_mileage from existing trucks_mileage data**

~~~
CREATE TABLE riskfactor (driverid string,events bigint,totmiles bigint,riskfactor float)
STORED AS ORC;
~~~

4. Verify the riskfactor table was created successfully. It will be empty now, but you will populate it from a Pig script. You are now ready to compute the risk factor using Pig. Let’s take a look at Pig and how to execute Pig scripts from within Ambari.

**Step 3.2: Create Pig Script**

In this tutorial we create and run a Pig script. We will use the Ambari Pig User View. Let’s get started…

#### 1. Log in to Ambari Pig User Views

To get to the Ambari Pig User View, click on the User Views icon at top right and select **Pig**:

![Screen Shot 2015-07-21 at 10.12.41 AM](http://hortonworks.com/wp-content/uploads/2015/07/Screen-Shot-2015-07-21-at-10.12.41-AM.png)  
This will bring up the Ambari Pig User View interface. Your Pig View does not have any scripts to display, so it will look like the following:

![Lab3_4](http://hortonworks.com/wp-content/uploads/2015/07/Lab3_4.png)

On the left is a list of your scripts, and on the right is a composition box for writing scripts. A special feature of the interface is the Pig helper at the bottom. The Pig helper will provide us with templates for the statements, functions, I/O statements, HCatLoader() and Python user defined functions. At the very bottom are status areas that will show the results of our script and log files.

The following screenshot shows and describes the various components and features of the Pig User View:

![Lab3_5](http://hortonworks.com/wp-content/uploads/2015/07/Lab3_5.png)

#### 2. Create a New Script

Let’s enter a Pig script. Click the **New Script** button in the upper-right corner of the view:

![Lab3_6](http://hortonworks.com/wp-content/uploads/2015/07/Lab3_6.png)

Name the script **riskfactor.pig**, then click the **Create** button:

![Lab3_7](http://hortonworks.com/wp-content/uploads/2015/07/Lab3_7.png)

#### 3. Load Data in Pig using Hcatalog

We are going to use HCatalog to load data into Pig. HCatalog allows us to share schema across tools and users within our Hadoop environment. It also allows us to factor out schema and location information from our queries and scripts and centralize them in a common repository. Since it is in HCatalog we can use the HCatLoader() function. Pig makes it easy by allowing us to give the table a name or alias and not have to worry about allocating space and defining the structure. We just have to worry about how we are processing the table.

* We can use the Pig helper at the bottom of the screen to give us a template for the line. Click on **Pig helper -> HCatalog->load template**
* The entry **%TABLE%** is highlighted in red for us. Type the name of the table which is geolocation.
* Remember to add the **a =** before the template. This saves the results into a. Note the **‘=’** has to have a space before and after it.
* Our completed line of code will look like:

~~~
a = LOAD 'geolocation' using org.apache.hive.hcatalog.pig.HCatLoader();
~~~

Copy-and-paste the above Pig code into the riskfactor.pig window.

#### 4. Filter your data set

The next step is to select a subset of the records so that we just have the records of drivers for which the event is not normal. To do this in Pig we use the Filter operator. We tell Pig to Filter our table and keep all records where event !=“normal” and store this in b. With this one simple statement Pig will look at each record in the table and filter out all the ones that do not meet our criteria.

* We can use Pig Help again by clicking on **Pig helper->Relational Operators->FILTER template**
* We can replace **%VAR%** with **“a”** (hint: tab jumps you to the next field)
* Our **%COND%** is “**event !=’normal’;** ” (note: single quotes are needed around normal and don’t forget the trailing semi-colon)
* Complete line of code will look like:

~~~
b = filter a by event != 'normal';
~~~

Copy-and-paste the above Pig code into the riskfactor.pig window.

#### 5. Iterate your data set

Now that we have the right set of records we can iterate through them. We use the “foreach” operator on the grouped data to iterate through all the records. We would also like to know how many times a driver has a non normal event associated with him. to achieve this we add ‘1’ to every row in the data set.

* Pig helper ->Relational Operators->FOREACH template will get us the code
* Our **%DATA%** is **b** and the second **%NEW_DATA%** is “**driverid,event,(int) ‘1’ as occurance;**”
* Complete line of code will look like:

~~~
c = foreach b generate driverid, event, (int) '1' as occurance;
~~~

Copy-and-paste the above Pig code into the riskfactor.pig window:

#### 6. Calculate the total non normal events for each driver

The group statement is important because it groups the records by one or more relations. In this case we would like to group by driver id and iterate over each row again to sum the non normal events.

* **Pig helper ->Relational Operators->GROUP %VAR% BY %VAR%** template will get us the code
* First **%VAR%** takes **“c”** and second **%VAR%** takes “**driverid;**”
* Complete line of code will look like:

~~~
d = group c by driverid;
~~~

Copy-and-paste the above Pig code into the riskfactor.pig window.

* Next use Foreach statement again to add the occurance.

~~~
e = foreach d generate group as driverid, SUM(c.occurance) as t_occ;
~~~


#### 7. Load drivermileage table and perform a join operation

In this section we will load drivermileage table into Pig using Hcatlog and perform a join operation on driverid. The resulting data set will give us total miles and total non normal events for a particular driver.

* Load drivermileage using HcatLoader()

~~~
g = LOAD 'drivermileage' using org.apache.hive.hcatalog.pig.HCatLoader();
~~~

* **Pig helper ->Relational Operators->JOIN %VAR% BY** template will get us the code
* Replace **%VAR%** by ‘**e**’ and after **BY** put ‘**driverid, g by driverid;**’
* Complete line of code will look like:

~~~
h = join e by driverid, g by driverid;
~~~

Copy-and-paste the above two Pig codes into the riskfactor.pig window.

#### 8. Compute Driver Risk factor

In this section we will associate a driver risk factor with every driver. Driver risk factor will be calculated by dividing total miles travelled by non normal event occurrences.

* We will use Foreach statement again to compute driver risk factor for each driver.
* Use the following code and paste it into your Pig script.

~~~
final_data = foreach h generate $0 as driverid, $1 as events, $3 as totmiles, (float) $3/$1 as riskfactor;
~~~

* As a final step store the data into a table using Hcatalog.

store final_data into ‘riskfactor’ using

Here is the final code and what it will look like once you paste it into the editor.

**Geolocation has data stored in ORC format**

~~~~
a = LOAD 'geolocation' using org.apache.hive.hcatalog.pig.HCatLoader();
b = filter a by event != 'normal';
c = foreach b generate driverid, event, (int) '1' as occurance;
d = group c by driverid;
e = foreach d generate group as driverid, SUM(c.occurance) as t_occ;
g = LOAD 'drivermileage' using org.apache.hive.hcatalog.pig.HCatLoader();
h = join e by driverid, g by driverid;
final_data = foreach h generate $0 as driverid, $1 as events, $3 as totmiles, (float) $3/$1 as riskfactor;
store final_data into 'riskfactor' using org.apache.hive.hcatalog.pig.HCatStorer();
~~~

![Lab3_8](http://hortonworks.com/wp-content/uploads/2015/07/Lab3_8.png)

Save the file riskfactor.pig by clicking the **Save** button in the left-hand column.

**Step 3.3: Quick Recap**

Before we execute the code, let’s review the code again:

* The line `a=` loads the geolocation table from HCatalog.
* The line `b=` filters out all the rows where the event is not ‘Normal’.
* Then we add a column called occurrence and assign it a value of 1.
* We then group the records by driverid and sum up the occurrences for each driver.
* At this point we need the miles driven by each driver, so we load the table we created using Hive.
* To get our final result, we join by the driverid the count of events in e with the mileage data in g.
* Now it is real simple to calculate the risk factor by dividing the miles driven by the number of events

You need to configure the Pig Editor to use HCatalog so that the Pig script can load the proper libraries. In the Pig arguments text box, enter –**useHCatalog**   and click the **Add** button:

**Note** that this argument is **case sensistive**. It should be typed exactly "-useHCatalog".

![Lab3_9](http://hortonworks.com/wp-content/uploads/2015/07/Lab3_9.png)

The **Arguments** section of the Pig View should now look like the following:  
![Lab3_10](http://hortonworks.com/wp-content/uploads/2015/07/Lab3_10.png)

**Step 3.4: Execute Pig Script on Tez**

1.  You are now ready to execute the script. Click Execute on Tez checkbox and finally hit the blue **Execute** button to submit the job. Pig job will be submitted to the cluster. This will generate a new tab with a status of the running of the Pig job and at the top you will find a progress bar that shows the job status.

![Lab3_11](http://hortonworks.com/wp-content/uploads/2015/07/Lab3_11.png)

1.  Wait for the job to complete. The output of the job is displayed in the **Results** section. Your script does not output any result – it stores the result into a Hive table – so your Results section will be empty.

![Lab3_12](http://hortonworks.com/wp-content/uploads/2015/07/Lab3_12.png)

![Lab3_13](http://hortonworks.com/wp-content/uploads/2015/07/Lab3_13.png)

Click on the **Logs** twisty to see what happened when your script ran. This is where you will see any error messages. The log may scroll below the edge of your window so you may have to scroll down.

1.  Go back to the Ambari Hive User View and browse the data in the riskfactor table to verify that your Pig job successfully populated this table. Here is what is should look like:

![Lab3_14](http://hortonworks.com/wp-content/uploads/2015/07/Lab3_14.png)

At this point we now have our truck miles per gallon table and our risk factor table. The next step is to pull this data into Excel to create the charts for the visualization step.

## Lab 4: Spark - Risk Factor

### **Use Apache Spark to compute Driver Risk Factor**

**Note** that this step is optional and produces the same result as in Lab 3. You may continue on to the next lab if you wish.

**Introduction:**

In this tutorial you will be introduced to Apache Spark. In the earlier section of lab you learned how to load data into HDFS and then manipulate it using Hive. We are using the Truck sensor data to better understand  risk associated with every driver. This section will teach you to compute risk using Apache spark.

**Prerequisites:**

The tutorial is a part of series of hands on tutorial to get you started on HDP using Hortonworks sandbox. Please ensure you complete the prerequisites before proceeding with this tutorial.

* Step 0 (Hortonworks sandbox set up)
* Lab 1: Loading sensor data into HDFS
* Lab 2: Data Manipulation with Apache Hive
* Allow yourself around one hour to complete this tutorial.

#### **Outline:**

*   Apache Spark backdrop
*   Apache Spark basics
*   Step 4.1: Configure Apache Spark services using Ambari
*   Step 4.2: Create a Hive Context
*   Step 4.3: Create RDD from Hive Context
*   Step 4.4: RDD transformations and actions
*   Step 4.5: Load and save data into Hive as ORC
*   Suggested readings

#### Background in Apache Spark

MapReduce has been useful, but the amount of time it takes for the jobs to run can at times be exhaustive. Also, MapReduce jobs only work for a specific set of use cases. There is a need for computing framework that works for a wider set of use cases.

Therefore Apache Spark was designed as a computing platform to be fast, general-purpose, and easy to use. It extends the MapReduce model and takes it to a whole other level. The speed comes from the in-memory computations. Applications running in memory allows for a much faster processing and response.

#### Apache Spark

[Apache Spark](http://hortonworks.com/hadoop/spark/) is a fast, in-memory data processing engine with elegant and expressive development APIs in [Scala](https://spark.apache.org/docs/1.2.0/api/scala/index.html#org.apache.spark.package),[Java](https://spark.apache.org/docs/1.2.0/api/java/index.html), and [Python](https://spark.apache.org/docs/1.2.0/api/java/index.html) that allow data workers to efficiently execute machine learning algorithms that require fast iterative access to datasets. Spark on [Apache Hadoop YARN](http://hortonworks.com/hadoop/YARN) enables deep integration with Hadoop and other YARN enabled workloads in the enterprise.

You can run batch application such as MapReduce types jobs or iterative algorithms that builds upon each other. You can also run interactive queries and process streaming data with your application. Spark also provides number of libraries which you can easily use to expand beyond the basic Spark capabilities such as Machine Learning algorithms, SQL, streaming, and graph processing. Spark runs on Hadoop clusters such as Hadoop YARN or Apache Mesos, or even as a standalone with its own scheduler.

![Lab4_1](http://hortonworks.com/wp-content/uploads/2015/07/Lab4_1.png)  
Lets get started…!!

**Step 4.1: Configuring Spark services using Ambari**

1.  Log on to Ambari Dashboard and click on Actions tab at the bottom left corner. Hit Start All to ensure Spark is running. Ambari will take some time to start all services and you can monitor the progress of it.

![Lab4_2](http://hortonworks.com/wp-content/uploads/2015/07/Lab4_2.png)

![Lab4_3](http://hortonworks.com/wp-content/uploads/2015/07/Lab4_3.png)

2.  Close the Ambari browser and we will get running with some codes on Spark. ssh into the sandbox using root as login and hadoop as password.

~~~
login: root
password: hadoop
~~~

Optionally, if you don’t have an SSH client installed and configured you can use the built-in web client which can be accessed from here: **http://_host_:4200** (use the same username and password provided above)

3.  Type the command spark-shell

This will load the default Spark Scala API.

![Lab4_4](http://hortonworks.com/wp-content/uploads/2015/07/Lab4_4.png)

Notice it is already starting with Hive integration as we have preconfigured it on the Hortonworks Sandbox.

**Step 4.2: Create a HiveContext**

For improved Hive integration, HDP 2.3 offers [ORC file](http://hortonworks.com/blog/orcfile-in-hdp-2-better-compression-better-performance/) support for Spark. This allows Spark to read data stored in ORC files. Spark can leverage ORC file’s more efficient columnar storage and predicate pushdown capability for even faster in-memory processing. HiveContext is an instance of the Spark SQL execution engine that integrates with data stored in Hive. The more basic SQLContext provides a subset of the Spark SQL support that does not depend on Hive. It reads the configuration for Hive from hive-site.xml on the classpath.

**Import these sql libraries:**

~~~
import org.apache.spark.sql.hive.orc._
import org.apache.spark.sql._
~~~


![Lab4_5](http://hortonworks.com/wp-content/uploads/2015/07/Lab4_5.png)

**Instantiate HiveContext**

~~~
val hiveContext = new org.apache.spark.sql.hive.HiveContext(sc)
~~~

![Lab4_6](http://hortonworks.com/wp-content/uploads/2015/07/Lab4_6.png)


- `sc` stands for **Spark Context**. SparkContext is the main entry point to everything Spark. It can be used to create RDDs and shared variables on the cluster. When you start up the Spark Shell, the SparkContext is automatically initialized for you with the variable `sc`.

**Step 4.3: Creating a RDD from HiveContext**

**What is RDD?**

Spark’s primary core abstraction is called Resilient Distributed Dataset or RDD. Essentially it is just a distributed collection of elements that is parallelized across the cluster. What this means is which is that RDD is an immutable collection of objects that is partitioned and distributed across multiple physical nodes of a YARN cluster and that can be operated in parallel.

There are three methods for creating a RDD:

*   You can parallelize an existing collection. This means that the data already resides within Spark and can now be operated on in parallel.
*   The second method to create a RDD, is to reference a dataset. This dataset can come from any storage source supported by Hadoop such as HDFS, Cassandra, HBase etc.
*   The third method to create a RDD is from transforming an existing RDD to create a new RDD. We will be using the later two methods in our tutorial.

#### 1. Use a simple show command to see the list of tables in Hive warehouse.

~~~
hiveContext.sql("show tables").collect.foreach(println)
~~~

![Lab4_7](http://hortonworks.com/wp-content/uploads/2015/07/Lab4_7.png)

You will notice that geolocation table and driver mileage table that we created in earlier tutorial are already listed in Hive metastore and can be directly queried upon.

#### 2. Query tables to build Spark RDD

We will do a simple select query to fetch data from geolocation and drivermileage tables to a spark variable. Getting data into Spark this way also allows to copy table schema to RDD.

~~~
val geolocation_temp1 = hiveContext.sql("select * from geolocation")
~~~

![Lab4_8](http://hortonworks.com/wp-content/uploads/2015/07/Lab4_8.png)

~~~
val drivermileage_temp1 = hiveContext.sql("select * from drivermileage")
~~~

![Lab4_9](http://hortonworks.com/wp-content/uploads/2015/07/Lab4_9.png)  

Make sure that the RDD`s carry the exact data. You can verify through following   command

~~~
geolocation_temp1.take(10) 
drivermileage_temp1.take(10)
~~~

Both these commands will return 10 rows from respective RDD`s.

#### 3. Registering a Temporary table

Now let’s give this RDD a name, so that we can use it in Spark SQL statements

~~~
geolocation_temp1.registerTempTable("geolocation_temp1")
drivermileage_temp1.registerTempTable("drivermileage_temp1")
~~~

**Step 4.4: RDD transformations and Actions**

Typically, RDDs are instantiated by loading data from a shared filesystem, HDFS, HBase, or any data source offering a Hadoop InputFormat on a YARN cluster.

Once an RDD is instantiated, you can apply a [series of operations](https://spark.apache.org/docs/1.2.0/programming-guide.html#rdd-operations). All operations fall into one of two types:[transformations](https://spark.apache.org/docs/1.2.0/programming-guide.html#transformations) or [actions](https://spark.apache.org/docs/1.2.0/programming-guide.html#actions).

*   **Transformation** operations, as the name suggests, create new datasets from an existing RDD and build out the processing DAG that can then be applied on the partitioned dataset across the YARN cluster. Transformations do not return a value. In fact, nothing is evaluated during the definition of these transformation statements. Spark just creates these Direct Acyclic Graphs or DAG, which will only be evaluated at runtime. We call this lazy evaluation.
*   An **Action** operation, on the other hand, executes DAG and returns a value.

#### 1.  Querying against the table

Now that our schema’s RDD with data has a name, we can use Spark SQL commands to query it. Remember the table below is not a Hive table, it is just a RDD we are querying with SQL.

*   Here we will try to perform iteration and filter operation. First, we need to filter drivers that have non- normal events associated to them and then count the number for non- normal events for each driver.

~~~
val geolocation_temp2= hiveContext.sql("SELECT driverid, count(driverid) occurance from             geolocation_temp1  where event!='normal' group by driverid")
~~~

- As stated earlier about RDD transformations, select operation is a RDD transformation and therefore does not return anything.

*   The resulting table will have count of total non normal events associated to each driver. Register this filtered table as a temporary table so that subsequent SQL queries can be applied on it.


~~~
geolocation_temp2.registerTempTable("geolocation_temp2")
~~~

*   You can view the result by doing an action operation on RDD.

~~~
geolocation_temp2.collect.foreach(println)
~~~

![Lab4_11](http://hortonworks.com/wp-content/uploads/2015/07/Lab4_11.png)

1.  **Perform join operation**

In this section we will perform a join operation geolocation_temp2 table has details of drivers and count of their respective non-normal events. drivermileage_temp1 table has details of total miles travelled by each driver.

*   We will join two tables on common column, which in our case is driverid.

~~~
val joined= hiveContext.sql("select a.driverid,a.occurance,b.totmiles from geolocation_temp2 a,drivermileage_temp1 b where a.driverid=b.driverid")
~~~


![Lab4_12](http://hortonworks.com/wp-content/uploads/2015/07/Lab4_12.png)

*   The resulting data set will give us total miles and total non normal events for a particular driver. Register this filtered table as a temporary table so that subsequent SQL queries can be applied on it.

~~~
joined.registerTempTable("joined")
~~~

*   You can view the result by doing an action operation on RDD.

~~~
joined.collect.foreach(println)
~~~

![Lab4_13](http://hortonworks.com/wp-content/uploads/2015/07/Lab4_13.png)

1.  **Compute Driver Risk Factor**

In this section we will associate a driver risk factor with every driver. Driver risk factor will be calculated by dividing total miles travelled by non normal event occurrences.

~~~
val risk_factor_spark=hiveContext.sql("select driverid, totmiles,occurance, totmiles/occurance riskfactor from joined")
~~~

![Lab4_14](http://hortonworks.com/wp-content/uploads/2015/07/Lab4_14.png)

*   The resulting data set will give us total miles and total non normal events and what is a risk for a particular driver. Register this filtered table as a temporary table so that subsequent SQL queries can be applied on it.

~~~
risk_factor_spark.registerTempTable("risk_factor_spark")
~~~

*   View the results

~~~
risk_factor_spark.collect.foreach(println)
~~~

![Lab4_15](http://hortonworks.com/wp-content/uploads/2015/07/Lab4_15.png)

**Step 4.5: Load and Save Data into Hive as ORC**

In this section we will try to store data in orc format in Hive from Spark.ORC is a self-describing type-aware columnar file format designed for Hadoop workloads. It is optimized for large streaming reads and with integrated support for finding required rows fast. Storing data in a columnar format lets the reader read, decompress, and process only the values required for the current query. Because ORC files are type aware, the writer chooses the most appropriate encoding for the type and builds an internal index as the file is persisted.

Predicate pushdown uses those indexes to determine which stripes in a file need to be read for a particular query and the row indexes can narrow the search to a particular set of 10,000 rows. ORC supports the complete set of types in Hive, including the complex types: structs, lists, maps, and unions.

#### Create an ORC table

Create a table and store it as ORC. Specifying as orc at the end of the SQL statement below ensures that the Hive table is stored in the ORC format.

~~~
hiveContext.sql("create table finalresults( driverid String, occurance bigint,totmiles bigint,riskfactor double) stored as orc").toDF()
~~~

*   ** Load data into ORC table**

Before we load the data into hive table that we created above, we will have to convert our data file into orc format too.

~~~
risk_factor_spark.saveAsOrcFile("risk_factor_spark")
~~~

**Load the data into Hive table using load data command.**

~~~
hiveContext.sql("load data inpath 'risk_factor_spark' into table finalresults")
~~~

*   Execute a select query to verify your table has been successfully stored.You can go to Ambari Hive user view to check whether the Hive table you created has the data populated in it.

~~~
hiveContext.sql("select * from finalresults")
~~~

## Lab 5: Reporting

### **Data Visualization using Microsoft Excel**

**Introduction:**

This step is optional as it requires you to have Excel and Power View, however feel free to connect from any reporting tool to do a similar exercise.   In this section, we will use Microsoft Excel Professional Plus 2013 to access the refined data. We will be using the ODBC connection.

**Prerequisites:**

The tutorial is a part of series of hands on tutorial to get you started on HDP using Hortonworks sandbox. Please ensure you complete the prerequisites before proceeding with this tutorial.

*   Step 0 (Hortonworks sandbox set up)
*   Lab 1: Loading sensor data into HDFS
*   Lab 2: Data Manipulation with Apache Hive
*   Lab 3: Use Pig to compute Driver Risk Factor/ Lab4: Use Spark to compute Driver Risk Factor
*   Please configure ODBC drivers on your system with the help of following tutorial:
    *   [Installing and Configuring the Hortonworks ODBC driver on Windows 7](http://hortonworks.com/hadoop-tutorial/how-to-install-and-configure-the-hortonworks-odbc-driver-on-windows-7/)
    *   [Installing and Configuring the Hortonworks ODBC driver on Mac OS X](http://hortonworks.com/hadoop-tutorial/how-to-install-and-configure-the-hortonworks-odbc-driver-on-mac-os-x/)

*   Allow yourself around half an hour to complete this tutorial.

**Outline:**

*   Step 5.b.1: Access Data in Microsoft Excel
*   Step 5.b.2: Visualize data with Excel
*   Suggested readings

**Step 5.b.1: Access the Refined Data with Microsoft Excel**

The [Hive ODBC driver](http://hortonworks.com/hdp/addons/) can be found at the Hortonworks Add-on page.  For [Windows ODBC driver setup](http://hortonworks.com/hadoop-tutorial/how-to-install-and-configure-the-hortonworks-odbc-driver-on-windows-7/) follow these instructions and these are the [Mac ODBC driver setup](http://hortonworks.com/hadoop-tutorial/how-to-install-and-configure-the-hortonworks-odbc-driver-on-mac-os-x/) instructions.   Open the ODBC connection manager and open the connection you setup up. It should look like this. Click on the test button and it should report success. If the test fails you will need to troubleshoot the connection before you can go on.

**For Mac Users**:-

1.  Open a new blank workbook. Select Data tab at the top then select “Get External Data” and then select “New Database query”.
2.  Chose Sample Hortonworks Hive DSN and hit Ok.

![Lab5_1](http://hortonworks.com/wp-content/uploads/2015/07/Lab5_1.png)

3.  Next prompt shall ask you to enter login and password. Type “sandbox” in login and the leave the password empty. Hit Ok.

![Lab5_2](http://hortonworks.com/wp-content/uploads/2015/07/Lab5_2.png)

4.   Choose the data table avg_mileage table from the table chart on the right and hit      Add Table. avg_mileage should now appear under Query View tab on the left. Choose avg_mileage.* in the Field column. You are set to import data from your Hive table. As a final step, Hit Test!

![Lab5_3](http://hortonworks.com/wp-content/uploads/2015/07/Lab5_3.png)

5.  Click on Return Data to import your table into an excel. Submit OK to populate your excel.

![Lab5_4](http://hortonworks.com/wp-content/uploads/2015/07/Lab5_4.png)

6.  Once the data is placed you will see the avg_mileage table imported into your spreadsheet.

**For Windows users**:-

1.  Open a new blank workbook. Select Data tab at the top then select “Get External Data” and then select “From Other Data Sources”. Then at the bottom select “From Microsoft Query”. Choose your data source and ours is called Hadoop and you will then see the Query Wizard. We will import the avg_mileage table.

![Lab5_6](http://hortonworks.com/wp-content/uploads/2015/07/Lab5_6.png)

2.  Accept the defaults for everything and click through till you hit the Finish button. After you click on Finish, Excel will send the data request over to Hadoop. It will take awhile for this to happen. When the data is returned it will ask you to place the data in the workbook. We want to be in cell \$A\$1 like this.

![Lab5_6](http://hortonworks.com/wp-content/uploads/2015/07/Lab5_61.png)

3.  The data is placed you will see the avg_mileage table imported into your spreadsheet.

![Lab5_7](http://hortonworks.com/wp-content/uploads/2015/07/Lab5_7.jpg)

**Step 5.b.2: Visualize Data with Microsoft Excel**

1.  So now we are going to insert a Power View report. We do this by selecting the “Insert” tab at the top and select “Power View Reports” button in the middle. This will create a new tab in your workbook with the data inserted in the Power View page.”

![Lab5_14](http://hortonworks.com/wp-content/uploads/2015/07/Lab5_14.jpg)

2.  Select the design tab at the top and then select a column chart and use the stacked column version in the drop down menu. This will give you a bar chart. Grab the lower right of the chart and stretch it out to the full pane. Close the filter tab and the chart will expand and look like this.

![Lab5_9](http://hortonworks.com/wp-content/uploads/2015/07/Lab5_9.jpg)

3.  So to finish off the tutorial I am going to create a map of the events reported in the geolocation table. I will show you how you can build up the queries and create a map of the data on an ad hoc basis.

4.  For a map we need location information and a data point. Looking at the geolocation table I will simply plot the location of each of the events. I will need the driverid, city and state columns from this table. We know that the select statement will let me extract these columns. So to start off I can just create the select query in the Query Editor.

5. Query subset of geolocation columns

~~~
select driverid, city, state from geolocation;
~~~

![Lab5_10](http://hortonworks.com/wp-content/uploads/2015/07/Lab5_10.png)

6.  After I execute the query I see what results are returned. In a more complex query you can easily make changes to the query at this point till you get the right results. So the results I get back look like this.

![Lab5_11](http://hortonworks.com/wp-content/uploads/2015/07/Lab5_11.png)

7.  Since my results look fine I now need to capture the result in a table. So I will use the select statement as part of my CTAS (create table select as) pattern. I will call the table events and the query now looks like this. 

**Create table avg_mileage from existing trucks_mileage data**

~~~
CREATE TABLE events
STORED AS ORC
AS
SELECT driverid, city, state FROM geolocation;
~~~

![Lab5_12](http://hortonworks.com/wp-content/uploads/2015/07/Lab5_12.png)

8.  I can execute the query and the table events gets created. As we saw earlier I can go to Excel and import the table into a blank worksheet. The imported data will look like this.

![Lab5_13](http://hortonworks.com/wp-content/uploads/2015/07/Lab5_13.jpg)

9.  Now I can insert the PowerView tab in the Excel workbook. To get a map I just select the Design tab at the top and select the Map button in the menu bar.

![Lab5_8](http://hortonworks.com/wp-content/uploads/2015/07/Lab5_8.jpg)

10.  Make sure you have a network connection because Power View using Bing to do the geocoding which translates the city and state columns into map coordinates. If we just want to see where events took place we can uncheck the driverid. The finished map looks like this.

![Lab5_15](http://hortonworks.com/wp-content/uploads/2015/07/Lab5_15.jpg)

We’ve shown how the Hortonworks Data Platform (HDP) can store and analyze geolocation data. In addition I have shown you a few techniques on building your own queries. You can easily plot risk factor and miles per gallon as bar charts. I showed you the basics of creating maps. A good next step is to only plot certain types of events. Using the pattern I gave you it is pretty straight forward to extract the data and visualize it in Excel.

## Next Steps: Try These

Congratulations on finishing a comprehensive series on Hadoop and HDP. By now you should have a good understanding on fundamentals of Hadoop and its related ecosystem such as Map Reduce, YARN, HDFS, Hive, Pig and Spark. As a Hadoop practitioner you can choose three basic personas to build upon your skill:

*   Hadoop Developer- [Click Here!](http://hortonworks.com/products/hortonworks-sandbox/#tuts-developers)
*   Hadoop Administrator-[Click Here!](http://hortonworks.com/products/hortonworks-sandbox/#tuts-admins)
*   Data Scientist- [Click Here!](http://hortonworks.com/products/hortonworks-sandbox/#tuts-analysts)

#### Case Studies:

Learn more about Hadoop through these case studies:

*   Analytics- [New types of data and new opportunities](http://hortonworks.com/solutions/advanced-analytic-apps/)
*   Data Architecture Optimization: [Reduce cost by moving data and processing to Hadoop](http://hortonworks.com/solutions/data-architecture-optimization/)
*   Industry specific: [Examples of Hadoop across Industries](http://hortonworks.com/industry/)

#### References:

*   [The Definitive Guide by O`Reilly](http://hadoopbook.com/)
*   [Hadoop for Dummies](http://www.wiley.com/WileyCDA/WileyTitle/productCd-1118607554.html)