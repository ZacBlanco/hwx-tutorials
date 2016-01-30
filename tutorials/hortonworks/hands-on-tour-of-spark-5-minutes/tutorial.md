### Introduction

[Apache Spark](http://hortonworks.com/hadoop/spark/) is a fast, in-memory data processing engine with elegant and expressive development APIs in [Scala](https://spark.apache.org/docs/1.2.0/api/scala/index.html#org.apache.spark.package "scala"), [Java](https://spark.apache.org/docs/1.2.0/api/java/index.html), and [Python](https://spark.apache.org/docs/1.2.0/api/java/index.html "python") that allow data workers to efficiently execute machine learning algorithms that require fast iterative access to datasets. Spark on [Apache Hadoop YARN](http://hortonworks.com/hadoop/YARN "Apache Hadoop YARN") enables deep integration with Hadoop and other YARN enabled workloads in the enterprise.

In this blog, we will introduce the basic concepts of Apache Spark and the first few necessary steps to get started with Spark on Hortonworks Sandbox.

### Prerequisite

**Download [Hortonworks Sandbox](http://hortonworks.com/sandbox)**

### Concepts

At the core of Spark is the notion of a **Resilient Distributed Dataset** (RDD), which is an immutable collection of objects that is partitioned and distributed across multiple physical nodes of a YARN cluster and that can be operated in parallel.

Typically, RDDs are instantiated by loading data from a shared filesystem, HDFS, HBase, or any data source offering a Hadoop InputFormat on a YARN cluster.

Once an RDD is instantiated, you can apply a [series of operations](https://spark.apache.org/docs/1.2.0/programming-guide.html#rdd-operations). All operations fall into one of two types: [transformations](https://spark.apache.org/docs/1.2.0/programming-guide.html#transformations) or [actions](https://spark.apache.org/docs/1.2.0/programming-guide.html#actions). **Transformation** operations, as the name suggests, create new datasets from an existing RDD and build out the processing DAG that can then be applied on the partitioned dataset across the YARN cluster. An **Action** operation, on the other hand, executes DAG and returns a value.

Let’s try it out.

### A Hands-On Example

Let’s open a shell to our Sandbox through SSH:

![](/assets/a-tour-of-spark-in-5-minutes/Screenshot_2015-04-13_07_58_43.png?dl=1)

The default password is `hadoop`

Then let’s get some data with the command below in your shell prompt:

    wget http://en.wikipedia.org/wiki/Hortonworks

![](/assets/a-tour-of-spark-in-5-minutes/Screenshot_2015-04-13_08_11_41.png?dl=1)

Copy the data over to HDFS on Sandbox:

    hadoop fs -put ~/Hortonworks /user/guest/Hortonworks

Let’s start the PySpark shell and work through a simple example of counting the lines in a file. The shell allows us to interact with our data using Spark and Python:

    pyspark

![](/assets/a-tour-of-spark-in-5-minutes/Screenshot%202015-04-13%2007.59.59.png?dl=1)

As discussed above, the first step is to instantiate the RDD using the Spark Context `sc` with the file `Hortonworks` on HDFS.

    myLines = sc.textFile('hdfs://sandbox.hortonworks.com/user/guest/Hortonworks')

![](/assets/a-tour-of-spark-in-5-minutes/Screenshot%202015-04-13%2009.10.32.png?dl=1)

Now that we have instantiated the RDD, it’s time to apply some transformation operations on the RDD. In this case, I am going to apply a simple transformation operation using a Python lambda expression to filter out all the empty lines.

    myLines_filtered = myLines.filter( lambda x: len(x) > 0 )

![](/assets/a-tour-of-spark-in-5-minutes/Screenshot%202015-04-13%2009.17.52.png?dl=1)

Note that the previous Python statement returned without any output. This lack of output signifies that the transformation operation did not touch the data in any way but has only modified the processing graph.

Let’s make this transformation real, with an Action operation like ‘count()’, which will execute all the transformation actions before and apply this aggregate function.

    myLines_filtered.count()

![](/assets/a-tour-of-spark-in-5-minutes/Screenshot%202015-04-13%2009.19.07.png?dl=1)

The final result of this little Spark Job is the number you see at the end. In this case it is `341`.

We hope that this little example whets your appetite for more ambitious data science projects on the Hortonworks Data Platform.

For more on Apache Spark, check out the links below:

*   [The Apache Spark Project](http://hortonworks.com/spark)
*   [Announcing Apache Spark, Now GA on Hortonworks Data Platform](http://hortonworks.com/blog/announcing-apache-spark-now-ga-on-hortonworks-data-platform/)