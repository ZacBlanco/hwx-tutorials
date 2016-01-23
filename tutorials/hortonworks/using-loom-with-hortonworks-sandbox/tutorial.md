Note, this tutorial is validated with the Hortonworks Sandbox 1.3

Data science often calls for the application of a variety of tools: the Hadoop Distributed File System (HDFS) provides a place to store and process data that does not fit in memory; Hive provides a SQL-like interface for processing data in Hadoop; and R gives powerful options for munging, modeling, and visualizing “small” data. Loom provides an integrated workflow from one tool to another, capturing and storing metadata in its extensible registry.

In this tutorial, learn how to install and get started with Loom, register and transform data in HDFS through the Loom Workbench, and import transformed data into R for analysis. The tutorial is based on an analysis of the relationship between flight delays and weather. By the end of the tutorial, we will see what airports saw the most rain during the sample period. Although this tutorial shows how to use the Loom Workbench, the same steps can also be accomplished through the Loom API. For more information, see the complete Loom documentation on the Revelytix website.

### Prerequisites:

*   Hortonworks Sandbox V1.3
*   Loom 1.2.7 or higher
*   RLoom 0.7.8 or higher [optional]
*   R [optional]
*   RStudio [optional]

### Get Started:

1.  Download [Sandbox](http://hortonworks.com/sandbox/)
2.  Download [Loom trial license](http://www.revelytix.com/?q=content/download-loom-trial).
3.  Watch [video](https://www.youtube.com/watch?feature=player_embedded&v=cqpvO-shB1Q) of the demo
4.  View [tutorial](/assets/1-3/loom/UsingLoomHortonworksSandbox_v1.2.pdf)