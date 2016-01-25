# How to Visualize and Analyze Website Clickstream Data

Your home page looks great. But how do you move customers on to bigger things—like submitting a form or completing a purchase? Get more granular with customer segmentation. Hadoop makes it easier to analyze, visualize and ultimately change how visitors behave on your website.

In this demo, we demonstrate how an online retailer can optimize buying paths to reduce bounce rate and improve conversion.

<iframe width="700" height="394" src="https://www.youtube.com/embed/weJI6Lp9Vw0?feature=oembed&amp;enablejsapi=1" frameborder="0" allowfullscreen="" id="player0"></iframe>

### In this tutorial, learn how to:

*   Stream twitter feeds into [HDFS](http://hortonworks.com/hadoop/hdfs) with [Flume](http://hortonworks.com/hadoop/flume)
*   Use [HCatalog](http://hortonworks.com/hadoop/hcatalog) to build a relational view of the data
*   Use [Hive](http://hortonworks.com/hadoop/hive) to query and refine the data
*   Import the data into Microsoft Excel with the [ODBC connector](http://hortonworks.com/hdp/add_ons)
*   Visualize data with Powerview

This demo can be completed with the [Hortonworks Sandbox](http://hortonworks.com/products/sandbox) – a single-node Hadoop cluster running in a virtual machine. Download to run this and other tutorials in the series. The tutorials presented here are for Sandbox v2.0

### Summary

This tutorial describes how to refine website clickstream data using the Hortonworks Data Platform, and how to analyze and visualize this refined data using the Power View feature in Microsoft Excel 2013.

### Clickstream Data

Clickstream data is an information trail a user leaves behind while visiting a website. It is typically captured in semi-structured website log files.

These website log files contain data elements such as a date and time stamp, the visitor’s IP address, the destination URLs of the pages visited, and a user ID that uniquely identifies the website visitor.

### Potential Uses of Clickstream Data

One of the original uses of Hadoop at Yahoo was to store and process their massive volume of clickstream data. Now enterprises of all types can use Hadoop and the Hortonworks Data Platform (HDP) to refine and analyze clickstream data. They can then answer business questions such as:

*   What is the most efficient path for a site visitor to research a product, and then buy it?
*   What products do visitors tend to buy together, and what are they most likely to buy in the future?
*   Where should I spend resources on fixing or enhancing the user experience on my website?

In this tutorial, we will focus on the “path optimization” use case. Specifically: how can we improve our website to reduce bounce rates and improve conversion?

### Prerequisites:

*   Hortonworks ODBC driver (64-bit) installed and configured
*   Hortonworks sample data files uploaded and refined as described in “Loading Data into the Hortonworks Sandbox”
  - If you haven't loaded this data yet, please [download it here](https://s3.amazonaws.com/hw-sandbox/tutorial8/RefineDemoData.zip)  and import it by following this tutorial: [http://hortonworks.com/hadoop-tutorial/loading-data-into-the-hortonworks-sandbox/](http://hortonworks.com/hadoop-tutorial/loading-data-into-the-hortonworks-sandbox/)
*   Microsoft Excel 2013 Professional Plus 64-bit
*   Windows 7 or later(required to run Microsoft Excel 2013 Professional Plus edition)
    *   Note this tutorial can still be run with any version of Excel, but your visualizaitons will be limited to the built in charts. You may wish to attempt this with another visualization tool that can accept data via an ODBC connection, like Tableau, Lumira, etc.

### Overview

To analyze and visualize website clickstream data, we will:

*   Use Hortonworks to view and refine website clickstream data.
*   Access the clickstream data with Excel.
*   Visualize the clickstream data using Excel Power View.

* * *
