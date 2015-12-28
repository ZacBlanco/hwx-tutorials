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
*   Microsoft Excel 2013 Professional Plus 64-bit
*   Windows 7 or later(required to run Microsoft Excel 2013 Professional Plus edition)
    *   Note this tutorial can still be run with any version of Excel, but your visualizaitons will be limited to the built in charts. You may wish to attempt this with another visualization tool that can accept data via an ODBC connection, like Tableau, Lumira, etc.

### Overview

To analyze and visualize website clickstream data, we will:

*   Use Hortonworks to view and refine website clickstream data.
*   Access the clickstream data with Excel.
*   Visualize the clickstream data using Excel Power View.

* * *

## Step 1: View and Refine the Website Clickstream Data in Hortonworks

In the “Loading Data into the Hortonworks Sandbox” tutorial, we loaded website data files into Hortonworks, and then used Hive queries to refine the data. Let’s take a closer look at that data.

Here’s a summary of the data we’re working with:

*   **Omniture logs*** – website log files containing information such as URL, timestamp, IP address, geocoded IP address, and user ID (SWID).
*   **users*** – CRM user data listing SWIDs (Software User IDs) along with date of birth and gender.
*   **products*** – CMS data that maps product categories to website URLs.

Let’s start by looking at the raw Omniture website data. In the Hortonworks Sandbox, click the File Browser icon in the toolbar at the top of the page, then select the `Omniture.0.tsv.gz` file.

![](/assets/2-0/clickstream/tutorial-10/01_file_browser.jpg)

*   The raw data file appears in the File Browser, and you can see that it contains information such as URL, timestamp, IP address, geocoded IP address, and user ID (SWID).

    The Omniture log dataset contains about 4 million rows of data, which represents five days of clickstream data. Often, organizations will process weeks, months, or even years of data.

    ![](/assets/2-0/images/02_omniturelog_raw.jpg)

*   Now let’s look at the users table using HCatalog. Click the HCat icon in the toolbar at the top of the page, then click **Browse Data** in the users row.

    ![](/assets/2-0/images/03_select_users_table.jpg)

*   The users table appears, and you can see the SWID, birth date, and gender columns.

    ![](/assets/2-0/images/04_users_table.jpg)

*   You can also use HCatalog to view the data in the products table, which maps product categories to website URLs.

    ![](/assets/2-0/images/05_products_table.jpg)

*   In the “Loading Data into the Hortonworks Sandbox” tutorial, we used Apache Hive to join the three data sets into one master set. This is easily accomplished in Hadoop, even when working with millions or billions of rows of data.

    First, we used a Hive script to generate an “omniture” view that contained a subset of the data in the Omniture log table.

    ![](/assets/2-0/images/06_omniture_script.jpg)

*   To view the omniture data in Hive, click **Table**, then click **Browse Data**in the omniture row.

    ![](/assets/2-0/images/07_browse_omniture.jpg)

*   The query results will appear, and you can see that the results include the data from the Omniture log table that were specified in the query.

    ![](/assets/2-0/images/08_omniture_query_data.jpg)

*   Next, we created a “webloganalytics” script to join the omniture website log data to the CRM data (registered users) and CMS data (products). This Hive query executed a join to create a unified dataset across our data sources.

    ![](/assets/2-0/images/09_webloganalytics_query.jpg)

*   You can view the data generated by the webloganalytics script in Hive as described in the preceding steps.

    ![](/assets/2-0/images/10_webloganalytics_table.jpg)

Now that we have reviewed the refined website data, we can access the data with Excel.

* * *

## Step 2: Access the Website Clickstream Data with Excel

In this section, we will use Excel Professional Plus 2013 to access the refined clickstream data.

*   In Windows, open a new Excel workbook, then select **Data > From Other Sources > From Microsoft Query**.

    ![](/assets/2-0/images/11_open_query.jpg)

*   On the Choose Data Source pop-up, select the Hortonworks ODBC data source you installed previously, then click **OK**. The Hortonworks ODBC driver enables you to access Hortonworks data with Excel and other Business Intelligence (BI) applications that support ODBC.

    ![](/assets/2-0/images/12_choose_data_source.jpg)

*   After the connection to the sandbox is established, the Query Wizard appears. Select the webloganalytics table in the Available tables and columns box, then click the right arrow button to add the entire webloganalytics table to the query. Click **Next** to continue.

    ![](/assets/2-0/images/13_query_wizard1.jpg)

*   On the Filter Data screen, click **Next** to continue without filtering the data.

    ![](/assets/2-0/images/14_query_wizard2.jpg)

*   On the Sort Order screen, click **Next** to continue without setting a sort order.

    ![](/assets/2-0/images/15_query_wizard3.jpg)

*   Click **Finish** on the Query Wizard Finish screen to retrieve the query data from the sandbox and import it into Excel.

    ![](/assets/2-0/images/16_query_wizard4.jpg)

*   On the Import Data dialog box, click **OK** to accept the default settings and import the data as a table.

    ![](/assets/2-0/images/17_import_data.jpg)

*   The imported query data appears in the Excel workbook.

    ![](/assets/2-0/images/18_data_imported.jpg)

Now that we have successfully imported Hortonworks Sandbox data into Microsoft Excel, we can use the Excel Power View feature to analyze and visualize the data.

* * *

## Step 3: Visualize the Website Clickstream Data Using Excel Power View

Data visualization can help you optimize your website and convert more visits into sales and revenue. In this section we will:

*   Analyze the clickstream data by location
*   Filter the data by product category
*   Graph the website user data by age and gender
*   Pick a target customer segment
*   Identify a few web pages with the highest bounce rates

In the Excel workbook with the imported webloganalytics data, select **Insert > Power View** to open a new Power View report.

![](/assets/2-0/images/19_open_powerview.jpg)

*   The Power View Fields area appears on the right side of the window, with the data table displayed on the left. Drag the handles or click the Pop Out icon to maximize the size of the data table.

    ![](/assets/2-0/images/20_powerview_initial_popout.jpg)

*   Let’s start by taking a look at the countries of origin of our website visitors. In the Power View Fields area, leave the **country** checkbox selected, and clear all of the other checkboxes. The data table will update to reflect the selections.

    ![](/assets/2-0/images/21_country_selected.jpg)

*   On the Design tab in the top menu, click **Map**.

    ![](/assets/2-0/images/22_open_map.jpg)

*   The map view displays a global view of the data. Now let’s take a look at a count of IP address by state. First, drag the **ip** field into the SIZE box.

    ![](/assets/2-0/images/23_add_ip_count.jpg)

*   Drag **country** from the Power View Fields area into the Filters area, then select the **usa** checkbox.

    ![](/assets/2-0/images/24_filter_by_usa.jpg)

*   Next, drag **state** into the LOCATIONS box. Remove the **country** field from the LOCATIONS box by clicking the down-arrow and then **Remove Field**.

    ![](/assets/2-0/images/25_state_to_locations.jpg)

*   Use the map controls to zoom in on the United States. Move the pointer over each state to display the IP count for that state.

    ![](/assets/2-0/images/26_ip_count_by_state.jpg)

*   Our dataset includes product data, so we can display the product categories viewed by website visitors in each state. To display product categories in the map by color, drag the **category** field into the COLOR box.

    ![](/assets/2-0/images/27_category_by_color.jpg)

*   The map displays the product categories by color for each state. Move the pointer over each state to display detailed category information. We can see that the largest number of page hits in Florida were for clothing, followed by shoes.

    ![](/assets/2-0/images/28_category_by_color_florida.jpg)

*   Now let’s look at the clothing data by age and gender so we can optimize our content for these customers. Select **Insert > Power View** to open a new Power View report.

    ![](/assets/2-0/images/29_new_powerview1.jpg)

To set up the data, set the following fields and filters:

*   In the Power View Fields area, select **ip** and **age**. All of the other fields should be unselected.
*   Drag **category** from the Power View Fields area into the Filters area, then select the **clothing** checkbox.
*   Drag **gender** from the Power View Fields area into the Filters area, then select the **M** (male) checkbox.

After setting these fields and filters, select **Column Chart > Clustered Column** in the top menu.

![](/assets/2-0/images/tutorial-10/30_open_clustered_column1.jpg)

*   To finish setting up the chart, drag **age** into the AXIS box. Also, remove **ip** from the AXIS box by clicking the down-arrow and then **Remove Field**. The chart shows that the majority of men shopping for clothing on our website are between the ages of 22 and 30\. With this information, we can optimize our content for this market segment.

    ![](/assets/2-0/images/tutorial-10/31_clothing_by_age.jpg)

*   Let’s assume that our data includes information about website pages (URLs) with high bounce rates. A page is considered to have a high bounce rate if it is the last page a user visited before leaving the website. By filtering this URL data by our target age group, we can find out exactly which website pages we should optimize for this market segment. Select **Insert > Power View** to open a new Power View report.

    ![](/assets/2-0/images/tutorial-10/32_new_powerview2.jpg)

To set up the data, set the following fields and filters:

*   Drag **age** from the Power View Fields area into the Filters area, then drag the sliders to set the age range from 22 to 30.
*   Drag **gender** from the Power View Fields area into the Filters area, then select the **M** (male) checkbox.
*   Drag **country** from the Power View Fields area into the Filters area, then select the **usa** checkbox.
*   In the Power View Fields area, select **url**. All of the other fields should be unselected.
*   In the Power View Fields area, move the pointer over **url**, click the down-arrow, and then select **Add to Table as Count.**

After setting these fields and filters, select **Column Chart > Clustered Column** in the top menu.

![](/assets/2-0/images/tutorial-10/33_open_clustered_column2.jpg)

*   The chart shows that we should focus on optimizing four of our website pages for the market segment of men between the ages of 22 and 30\. Now we can redesign these four pages and test the new designs based on our target demographic, thereby reducing the bounce rate and increasing customer retention and sales.

    ![](/assets/2-0/images/tutorial-10/34_urls_for_age_group.jpg)

*   You can use the controls in the upper left corner of the map to sort by Count of URL in ascending order.

    ![](/assets/2-0/images/tutorial-10/35_urls_for_age_group_sorted.jpg)

Now that you have successfully analyzed and visualized Hortonworks Sandbox data with Microsoft Excel, you can see how Excel and other BI tools can be used with the Hortonworks platform to derive insights about customers from various data sources.

The data in the Hortonworks platform can be refreshed frequently and used for basket analysis, A/B testing, personalized product recommendations, and other sales optimization activities.

**Feedback**

We are eager to hear your feedback on this tutorial. Please let us know what you think. 

[Click here](https://www.surveymonkey.com/s/Clickstream_Tutorial) to take survey