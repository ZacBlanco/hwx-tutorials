## Lab 2: Visualizing Clickstream Logs with Excel

In this section, we will use Excel Professional Plus 2013 to access the refined clickstream data.

### Step 1: Connecting Microsoft Excel

*   In Windows, open a new Excel workbook, then select **Data > From Other Sources > From Microsoft Query**.

![](/assets/clickstream/11_open_query.jpg)

*   On the Choose Data Source pop-up, select the Hortonworks ODBC data source you installed previously, then click **OK**. The Hortonworks ODBC driver enables you to access Hortonworks data with Excel and other Business Intelligence (BI) applications that support ODBC.

![](/assets/clickstream/12_choose_data_source.jpg)

*   After the connection to the sandbox is established, the Query Wizard appears. Select the webloganalytics table in the Available tables and columns box, then click the right arrow button to add the entire webloganalytics table to the query. Click **Next** to continue.

![](/assets/clickstream/13_query_wizard1.jpg)

*   On the Filter Data screen, click **Next** to continue without filtering the data.

![](/assets/clickstream/14_query_wizard2.jpg)

*   On the Sort Order screen, click **Next** to continue without setting a sort order.

![](/assets/clickstream/15_query_wizard3.jpg)

*   Click **Finish** on the Query Wizard Finish screen to retrieve the query data from the sandbox and import it into Excel.

![](/assets/clickstream/16_query_wizard4.jpg)

*   On the Import Data dialog box, click **OK** to accept the default settings and import the data as a table.

![](/assets/clickstream/17_import_data.jpg)

*   The imported query data appears in the Excel workbook.

![](/assets/clickstream/18_data_imported.jpg)

Now that we have successfully imported Hortonworks Sandbox data into Microsoft Excel, we can use the Excel Power View feature to analyze and visualize the data.

* * *

## Step 2: Visualize the Website Clickstream Data Using Excel Power View

Data visualization can help you optimize your website and convert more visits into sales and revenue. In this section we will:

*   Analyze the clickstream data by location
*   Filter the data by product category
*   Graph the website user data by age and gender
*   Pick a target customer segment
*   Identify a few web pages with the highest bounce rates

In the Excel workbook with the imported webloganalytics data, select **Insert > Power View** to open a new Power View report.

![](/assets/clickstream/19_open_powerview.jpg)

*   The Power View Fields area appears on the right side of the window, with the data table displayed on the left. Drag the handles or click the Pop Out icon to maximize the size of the data table.

![](/assets/clickstream/20_powerview_initial_popout.jpg)

*   Let’s start by taking a look at the countries of origin of our website visitors. In the Power View Fields area, leave the **country** checkbox selected, and clear all of the other checkboxes. The data table will update to reflect the selections.

![](/assets/clickstream/21_country_selected.jpg)

*   On the Design tab in the top menu, click **Map**.

![](/assets/clickstream/22_open_map.jpg)

*   The map view displays a global view of the data. Now let’s take a look at a count of IP address by state. First, drag the **ip** field into the SIZE box.

![](/assets/clickstream/23_add_ip_count.jpg)

*   Drag **country** from the Power View Fields area into the Filters area, then select the **usa** checkbox.

![](/assets/clickstream/24_filter_by_usa.jpg)

*   Next, drag **state** into the LOCATIONS box. Remove the **country** field from the LOCATIONS box by clicking the down-arrow and then **Remove Field**.

![](/assets/clickstream/25_state_to_locations.jpg)

*   Use the map controls to zoom in on the United States. Move the pointer over each state to display the IP count for that state.

![](/assets/clickstream/26_ip_count_by_state.jpg)

*   Our dataset includes product data, so we can display the product categories viewed by website visitors in each state. To display product categories in the map by color, drag the **category** field into the COLOR box.

![](/assets/clickstream/27_category_by_color.jpg)

*   The map displays the product categories by color for each state. Move the pointer over each state to display detailed category information. We can see that the largest number of page hits in Florida were for clothing, followed by shoes.

![](/assets/clickstream/28_category_by_color_florida.jpg)

*   Now let’s look at the clothing data by age and gender so we can optimize our content for these customers. Select **Insert > Power View** to open a new Power View report.

![](/assets/clickstream/29_new_powerview1.jpg)

To set up the data, set the following fields and filters:

*   In the Power View Fields area, select **ip** and **age**. All of the other fields should be unselected.
*   Drag **category** from the Power View Fields area into the Filters area, then select the **clothing** checkbox.
*   Drag **gender** from the Power View Fields area into the Filters area, then select the **M** (male) checkbox.

After setting these fields and filters, select **Column Chart > Clustered Column** in the top menu.

![](/assets/clickstream/30_open_clustered_column1.jpg)

*   To finish setting up the chart, drag **age** into the AXIS box. Also, remove **ip** from the AXIS box by clicking the down-arrow and then **Remove Field**. The chart shows that the majority of men shopping for clothing on our website are between the ages of 22 and 30\. With this information, we can optimize our content for this market segment.

![](/assets/clickstream/31_clothing_by_age.jpg)

*   Let’s assume that our data includes information about website pages (URLs) with high bounce rates. A page is considered to have a high bounce rate if it is the last page a user visited before leaving the website. By filtering this URL data by our target age group, we can find out exactly which website pages we should optimize for this market segment. Select **Insert > Power View** to open a new Power View report.

![](/assets/clickstream/32_new_powerview2.jpg)

To set up the data, set the following fields and filters:

*   Drag **age** from the Power View Fields area into the Filters area, then drag the sliders to set the age range from 22 to 30.
*   Drag **gender** from the Power View Fields area into the Filters area, then select the **M** (male) checkbox.
*   Drag **country** from the Power View Fields area into the Filters area, then select the **usa** checkbox.
*   In the Power View Fields area, select **url**. All of the other fields should be unselected.
*   In the Power View Fields area, move the pointer over **url**, click the down-arrow, and then select **Add to Table as Count.**

After setting these fields and filters, select **Column Chart > Clustered Column** in the top menu.

![](/assets/clickstream/33_open_clustered_column2.jpg)

*   The chart shows that we should focus on optimizing four of our website pages for the market segment of men between the ages of 22 and 30\. Now we can redesign these four pages and test the new designs based on our target demographic, thereby reducing the bounce rate and increasing customer retention and sales.

![](/assets/clickstream/34_urls_for_age_group.jpg)

*   You can use the controls in the upper left corner of the map to sort by Count of URL in ascending order.

![](/assets/clickstream/35_urls_for_age_group_sorted.jpg)

Now that you have successfully analyzed and visualized Hortonworks Sandbox data with Microsoft Excel, you can see how Excel and other BI tools can be used with the Hortonworks platform to derive insights about customers from various data sources.

The data in the Hortonworks platform can be refreshed frequently and used for basket analysis, A/B testing, personalized product recommendations, and other sales optimization activities.

**Feedback**

We are eager to hear your feedback on this tutorial. Please let us know what you think. 

[Click here](https://www.surveymonkey.com/s/Clickstream_Tutorial) to take survey