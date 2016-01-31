## Introduction

Welcome to the QlikView (Business Discovery Tools) tutorial developed by Qlik™. The tutorial is designed to help you get connected with QlikView within minutes, to access data from the Hortonworks Sandbox or Hortonworks Data Platform (HDP). QlikView will allow you to immediately gain personalized analytics and discover insights into data residing in the Sandbox or HDP. As with most BI tools, QlikView can use Apache Hive (via ODBC connection) as the SQL access to data in Hadoop.

QlikView has two modes of ingesting data

*   Data loaded to QlikView In-Memory Associative Data Store
    *   Pros – Sub Second Response Time, Data Compression, only accesses Data from HDP at time of load (Less Load on HDP)
    *   Con – Data Size Limitation, Data Duplication
*   QlikView Hybrid Solution – QlikView Direct Discovery on top of Hadoop
    *   Pro – Ability to analyze Big Data. Data is left in HDP, workload is pushed down to HDP
    *   Con – Response time is higher. May have to use Tez to dramatically improve response time on large datasets

This Tutorial will cover loading data into Qlikview In-Memory Associative Data Store; with simple modifications to the load script, the application can be configured to run the Qlikview Hybrid Solution where data resides inside HDP.

### Prerequisites

Prerequisite 1: [Download QlikView Desktop Personal Edition](http://www.qlik.com/us/explore/experience/free-download?ga-link=navbtn)

Prerequisite 2: Working HDP Cluster (Please choose one of the below. This tutorial uses Sandbox)

*   [Download HDP 2.0 for Ubuntu, RHEL, CentOS & SLES](http://hortonworks.com/products/hdp-2/)
*   [Download HDP 2.0 for Windows](http://hortonworks.com/products/hdp-windows/)
*   [Download HDP Sandbox](http://hortonworks.com/products/hortonworks-sandbox/#install)

Prerequisite 3: [Download HDP Hive ODBC Driver](http://hortonworks.com/products/hdp-2/#add_ons)

### Overview

Step 1:  Install QlikView Desktop Personal Edition. (QlikView is Windows Only Application) The current version of QlikView of this writing is QlikView 11 SR5.  
Step 2:  Install HDP Hive ODBC driver and Connect QlikView to HDP.

*   Execute file HortonworksHiveODBC64.msi downloaded from [HDP Hive ODBC Driver](http://hortonworks.com/products/hdp-2/#add_ons)
*   Click Next on the Hortonworks Hive ODBC Driver Setup Wizard Welcome screen, and complete the wizard setup. Reboot as requested.
*   Open ODBC Manager to set up ODBC Connection with HDP. Click “Add” and New Data Source Window will show up.
*   Select Hortonworks Hive ODBC Driver
*   Enter credentials for HDP Sandbox. Use Hive Server Type 2 to support Kerberos Authentication.
*   Enter Credentials and test.

Step 3: QlikView Integration with HDP Hive – [See the associated tutorial with step by step screen shots](http://hortonworks.com/wp-content/uploads/2014/03/Qlik_HDP_Tutorial_March2014.pdf "QlikView HDP Tutorial")

In this section, we will explore how QlikView can explore data in HDP. The tutorial will walk through steps to setup QlikView to Load Data from Hive. _Please review HDP Tutorial and load sample data sets into Hortonworks Hive before starting this section._

1\. Start QlikView Desktop Personal Edition

[![Description: HDP ODBC TEST](http://raw.githubusercontent.com/Parkman328/Hortonworks/master/Images/Qlik_HDP_Tutorial_%20%2818%29.png)](http://raw.githubusercontent.com/Parkman328/Hortonworks/master/Images/Qlik_HDP_Tutorial_%20%2818%29.png)

[](https://github.com/Parkman328/Hortonworks/blob/master/qlik.md#2-----file--new--click-cancel-when-the-wizard-comes-up)2\. File –> New **_Click Cancel when the Wizard Comes up_**

[![Description: HDP ODBC TEST](http://raw.githubusercontent.com/Parkman328/Hortonworks/master/Images/Qlik_HDP_Tutorial_%20%2819%29.png)](http://raw.githubusercontent.com/Parkman328/Hortonworks/master/Images/Qlik_HDP_Tutorial_%20%2819%29.png)

[](https://github.com/Parkman328/Hortonworks/blob/master/qlik.md#3-----click-on-the-script-icon-to-open-qlikview-script)3\. Click on the Script Icon to Open QlikView Script

[![Description: HDP ODBC TEST](http://raw.githubusercontent.com/Parkman328/Hortonworks/master/Images/Qlik_HDP_Tutorial_%20%2820%29.png)](http://raw.githubusercontent.com/Parkman328/Hortonworks/master/Images/Qlik_HDP_Tutorial_%20%2820%29.png)

[](https://github.com/Parkman328/Hortonworks/blob/master/qlik.md#4-----click-connect-and-qlikview-odbc-manager-will-come-up)4\. Click Connect and QlikView ODBC Manager will come up.

[![Description: HDP ODBC TEST](http://raw.githubusercontent.com/Parkman328/Hortonworks/master/Images/Qlik_HDP_Tutorial_%20%2821%29.png)](http://raw.githubusercontent.com/Parkman328/Hortonworks/master/Images/Qlik_HDP_Tutorial_%20%2821%29.png)

5\. Select your HIVE ODBC Connection enter your credentials and test your connection

![Description: HDP ODBC TEST](https://raw.githubusercontent.com/Parkman328/Hortonworks/master/Images/Qlik_HDP_Tutorial_%20(22).png)

6\. Click OK to clear connection test and OK on the QlikView ODBC Manager and a connection string will appear on Script Editor

[![Description: HDP ODBC TEST](http://raw.githubusercontent.com/Parkman328/Hortonworks/master/Images/Qlik_HDP_Tutorial_%20%2823%29.png)](http://raw.githubusercontent.com/Parkman328/Hortonworks/master/Images/Qlik_HDP_Tutorial_%20%2823%29.png)

[](https://github.com/Parkman328/Hortonworks/blob/master/qlik.md#7-----click-select-and-qlikview-selection-window-will-appear-with-all-of-your-tables)7\. Click Select and QlikView Selection Window will Appear with all of your Tables

[![Description: HDP ODBC TEST](http://raw.githubusercontent.com/Parkman328/Hortonworks/master/Images/Qlik_HDP_Tutorial_%20%2824%29.png)](http://raw.githubusercontent.com/Parkman328/Hortonworks/master/Images/Qlik_HDP_Tutorial_%20%2824%29.png)[![Description: HDP ODBC TEST](http://raw.githubusercontent.com/Parkman328/Hortonworks/master/Images/Qlik_HDP_Tutorial_%20%2825%29.png)](http://raw.githubusercontent.com/Parkman328/Hortonworks/master/Images/Qlik_HDP_Tutorial_%20%2825%29.png)

8\. Choose your sample table and select okay to add to HIVE table load script for selected sample table.

![Description: HDP ODBC TEST](https://raw.githubusercontent.com/Parkman328/Hortonworks/master/Images/Qlik_HDP_Tutorial_%20(26).png)

9\. Click Okay to exit Script Editor or Reload to Load Data immediately into QlikView

**_Reload will force user to save the QlikView document with a new name._**  
![Description: HDP ODBC TEST](https://raw.githubusercontent.com/Parkman328/Hortonworks/master/Images/Qlik_HDP_Tutorial_%20(27).png)

10\. Click Reload

11\. The QlikView Document will pull in HDP Table into QlikView in Memory Associative Data Store. In this example we will pull in **_sample_07 _**table. **_Please note 823 lines were extracted from HDP Hive and inserted into QlikView In-Memory Associative Data Store._** [![Description: HDP ODBC TEST](http://raw.githubusercontent.com/Parkman328/Hortonworks/master/Images/Qlik_HDP_Tutorial_%20%2830%29.png)](http://raw.githubusercontent.com/Parkman328/Hortonworks/master/Images/Qlik_HDP_Tutorial_%20%2830%29.png)

12\. Right click and choose “select fields”

#### [](https://github.com/Parkman328/Hortonworks/blob/master/qlik.md#12------right-click-and-choose-select-fields)

[![Description: HDP ODBC TEST](http://raw.githubusercontent.com/Parkman328/Hortonworks/master/Images/Qlik_HDP_Tutorial_%20%2831%29.png)](http://raw.githubusercontent.com/Parkman328/Hortonworks/master/Images/Qlik_HDP_Tutorial_%20%2831%29.png)

#### [](https://github.com/Parkman328/Hortonworks/blob/master/qlik.md#13---click-add-all-to-add-all-fields-to-current-qlikview-sheet)

13\. Click Add All to add all fields to current QlikView Sheet.

![Description: HDP ODBC TEST](https://raw.githubusercontent.com/Parkman328/Hortonworks/master/Images/Qlik_HDP_Tutorial_%20(32).png)

14\. Verify all fields were successfully loaded by inspecting the data in QlikView. **Select Items inside QlikView to see the Associative nature of QlikView.**

[![Description: HDP ODBC TEST](http://raw.githubusercontent.com/Parkman328/Hortonworks/master/Images/Qlik_HDP_Tutorial_%20%2833%29.png)](http://raw.githubusercontent.com/Parkman328/Hortonworks/master/Images/Qlik_HDP_Tutorial_%20%2833%29.png)

Once the data is imported you are ready to go. Now you can use QlikView to create insightful data visualization applications with data from Hadoop, Hortonworks Sandbox and Hortonworks Data Platform.

You can Download QlikView Files for this Tutorial in this Link: [Download Qlik HDP Sample QVW](https://qlikview-pe.box.com/s/jdg80xogux8vgj8mfvhb)

## More Information

To help you learn more about QlikView view these videos:

*   6 minute Video on High Level Product Demonstration on QlikView – [QlikView Product Tour](https://www.youtube.com/watch?v=sqILcEwlHSI)

[New To QlikView Videos](https://www.youtube.com/playlist?list=PL7C0765A3701765DD) – Series of 1 to 3 minutes video on QlikView Topics from loading data to designing charts to creating buttons.

*   [New to QlikView: Introduction to QlikView](https://www.youtube.com/watch?v=JaSXfLCJmIE&list=PL7C0765A3701765DD&index=2)
*   [New to QlikView: OLAP vs. New Rules](https://www.youtube.com/watch?v=fJKK_bkAYmg&list=PL7C0765A3701765DD&index=3)
*   [New to QlikView: Multiple Dimensions–The Power of QlikView](https://www.youtube.com/watch?v=a0eWmNg2bGc&list=PL7C0765A3701765DD&index=4)
*   [New to QlikView: Load Data from ODBC](https://www.youtube.com/watch?v=Kx4v7TEgbkY&list=PL7C0765A3701765DD&index=6)
*   [New to QlikView: Creating your First Chart in QlikView](https://www.youtube.com/watch?v=g8S0o0VRCHk&list=PL7C0765A3701765DD&index=7)
*   [New to QlikView: Chart Properties](https://www.youtube.com/watch?v=Ed3CcQi3Nfw&list=PL7C0765A3701765DD&index=8)
*   [New to QlikView: Create a Text Object](https://www.youtube.com/watch?v=MlljpBLSo-4&list=PL7C0765A3701765DD&index=9)
*   [New to QlikView: Create a Button Object](https://www.youtube.com/watch?v=QvueR808BVc&list=PL7C0765A3701765DD&index=10)
*   [Drag and Drop to Create Your First QlikView](https://www.youtube.com/watch?v=IEZ0Rm7mdI8&list=PL7C0765A3701765DD&index=11)
*   [Ways to Ask Questions with QlikView](https://www.youtube.com/watch?v=wQ5-EMSBS5w&list=PL7C0765A3701765DD&index=12)
*   [QlikView and the Data Pool](https://www.youtube.com/watch?v=DeDFDW87a3w&list=PL7C0765A3701765DD&index=13)