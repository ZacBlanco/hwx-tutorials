

## Overview

This use case describes using a data firewall with multiple Hadoop instances.  The data virtualization unified view uses roles to display all data, data for a specific region and/or mask data.

*   **Objective:** Secure data according to Role for low level security and column masking
*   **Problem:** Cannot hide region data from region specific users
*   **Solution:** Leverage JBoss Data Virtualization to provide low level security and masking of columns

## Prerequisites

*   A working HDP cluster
    *   The easiest way to have a HDP cluster is to download the Hortonworks [Sandbox](http://hortonworks.com/products/hortonworks-sandbox/)
*   Tutorial Supporting Files and Source hosted on [GitHub](https://github.com/DataVirtualizationByExample/HortonworksUseCase1/tree/master/SupportingFiles)
*   Watch the recorded video: [Part 1](http://youtu.be/6WRD9jK-eGM) & [Part 2](http://youtu.be/RxIj-1LTVJQ)

## Getting started

**Watch the tutorials**

Part 1: Federated Hadoop with Security using HDP and Red Hat JBoss Data Virtualization Tutorial



Part 2: Federated Hadoop with Security using HDP and Red Hat JBoss Data Virtualization Tutorial



**Install Hortonworks Data Platform with EU and US Data**

Note: Tables should have hdfs access

**Step 1:** Unzip the customerandcustomeraddress.zip (look for it in the [supporting files on Github](https://github.com/DataVirtualizationByExample/HortonworksUseCase2/tree/master/SupportingFiles))

**Step 2:** Import the customeraddresseu.csv and customereu.csv into a HDP sandbox which will serve as the EU region server

**Step 3:** Import the customeraddressus.csv and customeraddress.csv in another HDP sandbox which will serve as the US region server

**Step 4:** Verify that the data can be accessed through SquirreL similar to [Use Case 1](http://hortonworks.com/hadoop-tutorial/evolving-data-stratagic-asset-using-hdp-red-hat-jboss-data-virtualization/)

**Install the data sources in the Data Virtualization Server**

Note: The Hive Documentation is at [https://community.jboss.org/wiki/ConnectToAHadoopSourceUsingHive2](https://community.jboss.org/wiki/ConnectToAHadoopSourceUsingHive2)

**Step 1:** Setup the US Datasource through the Management Console Similar to UC1



jdbc:hive2://hdp-vm-us:10000/default

hive



hdfs

admin





**Step 2:** Setup the EU Datasource through the Management Console Similar to UC1



jdbc:hive2://hdp-vm-eu:10000/default

hive



hdfs

admin





**Install the Users in the Data Virtualization Server**

**Step 1:** Install the users by modifying the users properties file, _teiid-security-users.properties,_ by adding the following users

admin=redhat1!

ususer=redhat1!

euuser=redhat1!

**Step 2:** Add the roles for the users by modifying the role properties file, _teiid-security-roles.properties,_ by adding the following roles

admin=admin,odata

ususer=usaccess

euuser=euaccess

**Deploy the VDB to the Data Virtualization Server**

**Run the Test Cases **

Note: This can be done through SquirreL or with the Data Virtualization Dashboard

**Step 1:** Test Case 1 – admin

Use the Admin user which should have the admin roles so the Admin can see all data and nothing is masked

**Step 2:** Test Case 2 – ususer

Use the ususer which the Birth Date is masked from customer table and the country from the customer address table compared against user roles determines displaying

**Step 3:** Test Case 3 – euuser

Use the euuser which the Birth Date is Masked from customer table and the country from customer address table compared against user roles determines displaying
