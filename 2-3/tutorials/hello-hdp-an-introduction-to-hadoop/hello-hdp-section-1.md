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
*   Run Hive, Pig and Spark scripts that compute truck mileage and driver risk factor.
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
    1.  [Apache Hadoop and HDP](http://hortonworks.com/hadoop-tutorial/hello-world-an-introduction-to-hadoop-hcatalog-hive-and-pig#section_2) (5 Pillars)
    2.  [Apache Hadoop Distributed File System (HDFS)](http://hortonworks.com/hadoop-tutorial/hello-world-an-introduction-to-hadoop-hcatalog-hive-and-pig#section_3)
    3.  [Apache MapReduce and Apache YARN](http://hortonworks.com/hadoop-tutorial/hello-world-an-introduction-to-hadoop-hcatalog-hive-and-pig#section_4)
    4.  [Apache Hive and Apache Pig](http://hortonworks.com/hadoop-tutorial/hello-world-an-introduction-to-hadoop-hcatalog-hive-and-pig#section_5)
6.  Get Started with HDP Labs
    1.  [Lab 0: Start Sandbox VM and Open Ambari](http://hortonworks.com/hadoop-tutorial/hello-world-an-introduction-to-hadoop-hcatalog-hive-and-pig#section_6)
    2.  [Lab 1: Loading Sensor Data into HDFS](http://hortonworks.com/hadoop-tutorial/hello-world-an-introduction-to-hadoop-hcatalog-hive-and-pig#section_7)
    3.  [Lab 2: Data Manipulation with Hive](http://hortonworks.com/hadoop-tutorial/hello-world-an-introduction-to-hadoop-hcatalog-hive-and-pig#section_8) (Ambari User Views)
    4.  [Lab 3: Use Pig to compute Driver Risk Factor](http://hortonworks.com/hadoop-tutorial/hello-world-an-introduction-to-hadoop-hcatalog-hive-and-pig#section_9)
    5.  [Lab 4: Use Apache Spark to compute Driver Risk Factor](http://hortonworks.com/hadoop-tutorial/hello-world-an-introduction-to-hadoop-hcatalog-hive-and-pig#section_10)
    6.  [Lab 5: Optional Visualization and Reporting](http://hortonworks.com/hadoop-tutorial/hello-world-an-introduction-to-hadoop-hcatalog-hive-and-pig#section_11)
        1.  [Configuring ODBC driver](http://hortonworks.com/hadoop-tutorial/how-to-install-and-configure-the-hortonworks-odbc-driver-on-mac-os-x/)  (Mac and Windows)
        2.  [Using Microsoft Excel](http://hortonworks.com/hadoop-tutorial/hello-world-an-introduction-to-hadoop-hcatalog-hive-and-pig#section_11)
        3.  Using Zeppelin (Coming Soon…)
7.  Next Steps/Try These
    1.  Practitioner Journey-  As a Hadoop Practitioner you can adopt following learning paths
        *   Hadoop Developer - [Click Here!](http://hortonworks.com/products/hortonworks-sandbox/#tuts-developers)
        *   Hadoop Administrator -[Click Here!](http://hortonworks.com/products/hortonworks-sandbox/#tuts-admins)
        *   Data Scientist - [Click Here!](http://hortonworks.com/products/hortonworks-sandbox/#tuts-analysts)
    2.  [Case Studies](http://hortonworks.com/industry/) – Learn how Hadoop is being used by various industries.
8.  References and Resources
    1.  Hadoop - The Definitive Guide by O`Reilly
    2.  Hadoop for Dummies
    3.  [Hadoop Crash Course slides-Hadoop Summit 2015](http://www.slideshare.net/Hadoop_Summit/hadoop-crash-course-workshop-at-hadoop-summit)
    4.  [Hadoop Crash Course Workshop- Hadoop Summit 2015](https://www.youtube.com/watch?v=R-va7pZg7HM)