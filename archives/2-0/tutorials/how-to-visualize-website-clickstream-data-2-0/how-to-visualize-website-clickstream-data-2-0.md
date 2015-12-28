<div class="maincontent">
								<p class="page_summary">Your home page looks great. But how do you move customers on to bigger things—like submitting a form or completing a purchase? Get more granular with customer segmentation. Hadoop makes it easier to analyze, visualize and ultimately change how visitors behave on your website.</p>
<p>In this demo, we demonstrate how an online retailer can optimize buying paths to reduce bounce rate and improve conversion.</p>
<p style="text-align:center;"><iframe width="700" height="394" src="https://www.youtube.com/embed/weJI6Lp9Vw0?feature=oembed&amp;enablejsapi=1" frameborder="0" allowfullscreen="" id="player0"></iframe></p>
<h3>In this tutorial, learn how to:</h3>
<ul>
<li>Stream twitter feeds into <a href="http://hortonworks.com/hadoop/hdfs">HDFS</a> with <a href="http://hortonworks.com/hadoop/flume">Flume</a></li>
<li>Use <a href="http://hortonworks.com/hadoop/hcatalog">HCatalog</a> to build a relational view of the data</li>
<li>Use <a href="http://hortonworks.com/hadoop/hive">Hive</a> to query and refine the data</li>
<li>Import the data into Microsoft Excel with the <a href="http://hortonworks.com/hdp/add_ons">ODBC connector</a></li>
<li>Visualize data with Powerview</li>
</ul>
<p class="versioning_note">This demo can be completed with the <a href="http://hortonworks.com/products/sandbox">Hortonworks Sandbox</a> – a single-node Hadoop cluster running in a virtual machine. Download to run this and other tutorials in the series. The tutorials presented here are for Sandbox v2.0</p>
<h3>Summary</h3>
<p>This tutorial describes how to refine website clickstream data using the Hortonworks Data Platform, and how to analyze and visualize this refined data using the Power View feature in Microsoft Excel 2013.</p>
<h3>Clickstream Data</h3>
<p>Clickstream data is an information trail a user leaves behind while visiting a website. It is typically captured in semi-structured website log files.</p>
<p>These website log files contain data elements such as a date and time stamp, the visitor’s IP address, the destination URLs of the pages visited, and a user ID that uniquely identifies the website visitor.</p>
<h3>Potential Uses of Clickstream Data</h3>
<p>One of the original uses of Hadoop at Yahoo was to store and process their massive volume of clickstream data. Now enterprises of all types can use Hadoop and the Hortonworks Data Platform (HDP) to refine and analyze clickstream data. They can then answer business questions such as:</p>
<ul>
<li>What is the most efficient path for a site visitor to research a product, and then buy it?</li>
<li>What products do visitors tend to buy together, and what are they most likely to buy in the future?</li>
<li>Where should I spend resources on fixing or enhancing the user experience on my website?</li>
</ul>
<p>In this tutorial, we will focus on the “path optimization” use case. Specifically: how can we improve our website to reduce bounce rates and improve conversion?</p>
<h3>Prerequisites:</h3>
<ul>
<li>Hortonworks ODBC driver (64-bit) installed and configured</li>
<li>Hortonworks sample data files uploaded and refined as described in “Loading Data into the Hortonworks Sandbox”</li>
<li>Microsoft Excel 2013 Professional Plus 64-bit</li>
<li>Windows 7 or later(required to run Microsoft Excel 2013 Professional Plus edition)
<ul>
<li>Note this tutorial can still be run with any version of Excel, but your visualizaitons will be limited to the built in charts. You may wish to attempt this with another visualization tool that can accept data via an ODBC connection, like Tableau, Lumira, etc.</li>
</ul>
</li>
</ul>
<h3>Overview</h3>
<p>To analyze and visualize website clickstream data, we will:</p>
<ul>
<li>Use Hortonworks to view and refine website clickstream data.</li>
<li>Access the clickstream data with Excel.</li>
<li>Visualize the clickstream data using Excel Power View.</li>
</ul>
<hr>
<h2>Step 1: View and Refine the Website Clickstream Data in Hortonworks</h2>
<p>In the “Loading Data into the Hortonworks Sandbox” tutorial, we loaded website data files into Hortonworks, and then used Hive queries to refine the data. Let’s take a closer look at that data.</p>
<p>Here’s a summary of the data we’re working with:</p>
<ul>
<li><strong>Omniture logs</strong>* – website log files containing information such as URL, timestamp, IP address, geocoded IP address, and user ID (SWID).</li>
<li><strong>users</strong>* – CRM user data listing SWIDs (Software User IDs) along with date of birth and gender.</li>
<li><strong>products</strong>* – CMS data that maps product categories to website URLs.</li>
</ul>
<p>Let’s start by looking at the raw Omniture website data. In the Hortonworks Sandbox, click the File Browser icon in the toolbar at the top of the page, then select the <code class=" prettyprinted"><span class="typ">Omniture</span><span class="pun">.</span><span class="lit">0.tsv</span><span class="pun">.</span><span class="pln">gz</span></code> file.</p>
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/01_file_browser.jpg?raw=true" border="0"></p>
<ul>
<li>The raw data file appears in the File Browser, and you can see that it contains information such as URL, timestamp, IP address, geocoded IP address, and user ID (SWID).
<p>The Omniture log dataset contains about 4 million rows of data, which represents five days of clickstream data. Often, organizations will process weeks, months, or even years of data.</p>
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/02_omniturelog_raw.jpg?raw=true" border="0"></p></li>
<li>Now let’s look at the users table using HCatalog. Click the HCat icon in the toolbar at the top of the page, then click <strong>Browse Data</strong> in the users row.
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/03_select_users_table.jpg?raw=true" border="0"></p></li>
<li>The users table appears, and you can see the SWID, birth date, and gender columns.
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/04_users_table.jpg?raw=true" border="0"></p></li>
<li>You can also use HCatalog to view the data in the products table, which maps product categories to website URLs.
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/05_products_table.jpg?raw=true" border="0"></p></li>
<li>In the “Loading Data into the Hortonworks Sandbox” tutorial, we used Apache Hive to join the three data sets into one master set. This is easily accomplished in Hadoop, even when working with millions or billions of rows of data.
<p>First, we used a Hive script to generate an “omniture” view that contained a subset of the data in the Omniture log table.</p>
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/06_omniture_script.jpg?raw=true" border="0"></p></li>
<li>To view the omniture data in Hive, click <strong>Table</strong>, then click <strong>Browse Data</strong>in the omniture row.
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/07_browse_omniture.jpg?raw=true" border="0"></p></li>
<li>The query results will appear, and you can see that the results include the data from the Omniture log table that were specified in the query.
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/08_omniture_query_data.jpg?raw=true" border="0"></p></li>
<li>Next, we created a “webloganalytics” script to join the omniture website log data to the CRM data (registered users) and CMS data (products). This Hive query executed a join to create a unified dataset across our data sources.
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/09_webloganalytics_query.jpg?raw=true" border="0"></p></li>
<li>You can view the data generated by the webloganalytics script in Hive as described in the preceding steps.
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/10_webloganalytics_table.jpg?raw=true" border="0"></p></li>
</ul>
<p>Now that we have reviewed the refined website data, we can access the data with Excel.</p>
<hr>
<h2>Step 2: Access the Website Clickstream Data with Excel</h2>
<p>In this section, we will use Excel Professional Plus 2013 to access the refined clickstream data.</p>
<ul>
<li>In Windows, open a new Excel workbook, then select <strong>Data &gt; From Other Sources &gt; From Microsoft Query</strong>.
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/11_open_query.jpg?raw=true" border="0"></p></li>
<li>On the Choose Data Source pop-up, select the Hortonworks ODBC data source you installed previously, then click <strong>OK</strong>. The Hortonworks ODBC driver enables you to access Hortonworks data with Excel and other Business Intelligence (BI) applications that support ODBC.
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/12_choose_data_source.jpg?raw=true" border="0"></p></li>
<li>After the connection to the sandbox is established, the Query Wizard appears. Select the webloganalytics table in the Available tables and columns box, then click the right arrow button to add the entire webloganalytics table to the query. Click <strong>Next</strong> to continue.
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/13_query_wizard1.jpg?raw=true" border="0"></p></li>
<li>On the Filter Data screen, click <strong>Next</strong> to continue without filtering the data.
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/14_query_wizard2.jpg?raw=true" border="0"></p></li>
<li>On the Sort Order screen, click <strong>Next</strong> to continue without setting a sort order.
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/15_query_wizard3.jpg?raw=true" border="0"></p></li>
<li>Click <strong>Finish</strong> on the Query Wizard Finish screen to retrieve the query data from the sandbox and import it into Excel.
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/16_query_wizard4.jpg?raw=true" border="0"></p></li>
<li>On the Import Data dialog box, click <strong>OK</strong> to accept the default settings and import the data as a table.
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/17_import_data.jpg?raw=true" border="0"></p></li>
<li>The imported query data appears in the Excel workbook.
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/18_data_imported.jpg?raw=true" border="0"></p></li>
</ul>
<p>Now that we have successfully imported Hortonworks Sandbox data into Microsoft Excel, we can use the Excel Power View feature to analyze and visualize the data.</p>
<hr>
<h2>Step 3: Visualize the Website Clickstream Data Using Excel Power View</h2>
<p>Data visualization can help you optimize your website and convert more visits into sales and revenue. In this section we will:</p>
<ul>
<li>Analyze the clickstream data by location</li>
<li>Filter the data by product category</li>
<li>Graph the website user data by age and gender</li>
<li>Pick a target customer segment</li>
<li>Identify a few web pages with the highest bounce rates</li>
</ul>
<p>In the Excel workbook with the imported webloganalytics data, select <strong>Insert &gt; Power View</strong> to open a new Power View report.</p>
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/19_open_powerview.jpg?raw=true" border="0"></p>
<ul>
<li>The Power View Fields area appears on the right side of the window, with the data table displayed on the left. Drag the handles or click the Pop Out icon to maximize the size of the data table.
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/20_powerview_initial_popout.jpg?raw=true" border="0"></p></li>
<li>Let’s start by taking a look at the countries of origin of our website visitors. In the Power View Fields area, leave the <strong>country</strong> checkbox selected, and clear all of the other checkboxes. The data table will update to reflect the selections.
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/21_country_selected.jpg?raw=true" border="0"></p></li>
<li>On the Design tab in the top menu, click <strong>Map</strong>.
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/22_open_map.jpg?raw=true" border="0"></p></li>
<li>The map view displays a global view of the data. Now let’s take a look at a count of IP address by state. First, drag the <strong>ip</strong> field into the SIZE box.
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/23_add_ip_count.jpg?raw=true" border="0"></p></li>
<li>Drag <strong>country</strong> from the Power View Fields area into the Filters area, then select the <strong>usa</strong> checkbox.
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/24_filter_by_usa.jpg?raw=true" border="0"></p></li>
<li>Next, drag <strong>state</strong> into the LOCATIONS box. Remove the <strong>country</strong> field from the LOCATIONS box by clicking the down-arrow and then <strong>Remove Field</strong>.
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/25_state_to_locations.jpg?raw=true" border="0"></p></li>
<li>Use the map controls to zoom in on the United States. Move the pointer over each state to display the IP count for that state.
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/26_ip_count_by_state.jpg?raw=true" border="0"></p></li>
<li>Our dataset includes product data, so we can display the product categories viewed by website visitors in each state. To display product categories in the map by color, drag the <strong>category</strong> field into the COLOR box.
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/27_category_by_color.jpg?raw=true" border="0"></p></li>
<li>The map displays the product categories by color for each state. Move the pointer over each state to display detailed category information. We can see that the largest number of page hits in Florida were for clothing, followed by shoes.
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/28_category_by_color_florida.jpg?raw=true" border="0"></p></li>
<li>Now let’s look at the clothing data by age and gender so we can optimize our content for these customers. Select <strong>Insert &gt; Power View</strong> to open a new Power View report.
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/29_new_powerview1.jpg?raw=true" border="0"></p></li>
</ul>
<p>To set up the data, set the following fields and filters:</p>
<ul>
<li>In the Power View Fields area, select <strong>ip</strong> and <strong>age</strong>. All of the other fields should be unselected.</li>
<li>Drag <strong>category</strong> from the Power View Fields area into the Filters area, then select the <strong>clothing</strong> checkbox.</li>
<li>Drag <strong>gender</strong> from the Power View Fields area into the Filters area, then select the <strong>M</strong> (male) checkbox.</li>
</ul>
<p>After setting these fields and filters, select <strong>Column Chart &gt; Clustered Column</strong> in the top menu.</p>
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/30_open_clustered_column1.jpg?raw=true" border="0"></p>
<ul>
<li>To finish setting up the chart, drag <strong>age</strong> into the AXIS box. Also, remove <strong>ip</strong> from the AXIS box by clicking the down-arrow and then <strong>Remove Field</strong>. The chart shows that the majority of men shopping for clothing on our website are between the ages of 22 and 30. With this information, we can optimize our content for this market segment.
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/31_clothing_by_age.jpg?raw=true" border="0"></p></li>
<li>Let’s assume that our data includes information about website pages (URLs) with high bounce rates. A page is considered to have a high bounce rate if it is the last page a user visited before leaving the website. By filtering this URL data by our target age group, we can find out exactly which website pages we should optimize for this market segment. Select <strong>Insert &gt; Power View</strong> to open a new Power View report.
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/32_new_powerview2.jpg?raw=true" border="0"></p></li>
</ul>
<p>To set up the data, set the following fields and filters:</p>
<ul>
<li>Drag <strong>age</strong> from the Power View Fields area into the Filters area, then drag the sliders to set the age range from 22 to 30.</li>
<li>Drag <strong>gender</strong> from the Power View Fields area into the Filters area, then select the <strong>M</strong> (male) checkbox.</li>
<li>Drag <strong>country</strong> from the Power View Fields area into the Filters area, then select the <strong>usa</strong> checkbox.</li>
<li>In the Power View Fields area, select <strong>url</strong>. All of the other fields should be unselected.</li>
<li>In the Power View Fields area, move the pointer over <strong>url</strong>, click the down-arrow, and then select <strong>Add to Table as Count.</strong></li>
</ul>
<p>After setting these fields and filters, select <strong>Column Chart &gt; Clustered Column</strong> in the top menu.</p>
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/33_open_clustered_column2.jpg?raw=true" border="0"></p>
<ul>
<li>The chart shows that we should focus on optimizing four of our website pages for the market segment of men between the ages of 22 and 30. Now we can redesign these four pages and test the new designs based on our target demographic, thereby reducing the bounce rate and increasing customer retention and sales.
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/34_urls_for_age_group.jpg?raw=true" border="0"></p></li>
<li>You can use the controls in the upper left corner of the map to sort by Count of URL in ascending order.
<p><img title="" alt="" src="http://raw.github.com/hortonworks/hadoop-tutorials/master/Sandbox/images/tutorial-10/35_urls_for_age_group_sorted.jpg?raw=true" border="0"></p></li>
</ul>
<p>Now that you have successfully analyzed and visualized Hortonworks Sandbox data with Microsoft Excel, you can see how Excel and other BI tools can be used with the Hortonworks platform to derive insights about customers from various data sources.</p>
<p>The data in the Hortonworks platform can be refreshed frequently and used for basket analysis, A/B testing, personalized product recommendations, and other sales optimization activities.</p>
<p><strong>Feedback</strong></p>
<p>We are eager to hear your feedback on this tutorial. Please let us know what you think. <a href="https://www.surveymonkey.com/s/Clickstream_Tutorial" class="ext-link" target="_blank">Click here</a> to take survey</p>
							</div>