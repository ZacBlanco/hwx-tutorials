Download the turn-key Waterline Data Sandbox preloaded with HDP, Waterline Data Inventory and sample data with tutorials in one package. Waterline Data Inventory enables users of Hadoop to find, understand, and govern data in their data lake. How do you get the Waterline Data advantage? It’s a combination of automated profiling and metadata discovery, and user actions: administrators run automated jobs to crawl the cluster to profile and discover the data automatically, and users find, inspect and annotate files through a web browser application.

To help you understand the basics of how Waterline Data Inventory works, we’ve created a turn-key tutorial using the Hortonworks Sandbox that comes pre-loaded with Hortonworks Data Platform (HDP), Waterline Data Inventory, and sample data with tutorials. All you have to do is download one package available at: [go.waterlinedata.com/download-sandbox](http://go.waterlinedata.com/download-sandbox "Waterline Data Sandbox").

The tutorials will teach you how to run and manage Waterline Data Inventory. To give you an overview of what you will find when you download the Waterline Data Sandbox, take a look below.

The tutorials are organized in these sections:

*   (Server) First things first: profile your data
*   (UI and Server) Mark landings and run lineage discovery
*   (UI and Server) Tag the data you know
*   (UI) Leverage discovery results in searches
*   (UI) Bookmark files you want to follow
*   (Server) Run jobs to keep up with new data and users’ tags

### First things first: profile your data

For Waterline Data Inventory to give users the rich data-browsing experience they’ll want, an administrator runs “profiling” jobs on the server where Waterline Data Inventory is installed. Typically, installation happens on an edge node in your Hadoop cluster. We’ve done that work for you in the evaluation images; to see how it’s done for an existing cluster, see Waterline Data Inventory Installation and Administration Guide. ![](http://hortonassets.s3.amazonaws.com/tutorial/waterline/image15.png)

Profiling jobs include several separate processes:

*   Crawling HDFS files to determine each file’s format.
*   Reading each HDFS file to extract field-metadata and data-quality metrics.
*   Inserting the metadata and data into Waterline Data Inventory’s repository.

Profiling jobs also include some discover tasks, which you can also run independently from the profiling jobs:

*   Using the repository data to suggest tags on field data, based both on pre-determined reference data (such as country names or zip codes) and data previously tagged by users (such as product codes or sales regions).
*   Using the repository data to find collections of data to treat as “partitions” or “snapshots”. (More about collections later.)
*   Using repository data to find files that contain the same data

When you first install Waterline Data Inventory, you’ll need to run profiling on every file in the cluster. The initial profile run will take some time; we recommend you break up the profiling into sections.

The profiling job takes one or more directories as its argument and profiles their contents recursively. You can start with a smaller amount of data to start, then profile the cluster section-by-section.

For the sandbox sample data, to profile sections of data at a time, an administrator runs these profiling jobs from the installation directory, waterlinedata:

Profile Sherlock directory:

*   bin/waterline profile /user/waterlinedata/Sherlock

Profile only data.gov directory in Landing:

*   bin/waterline profile /user/waterlinedata/Landing/data.gov

Profile only nyc_open directory in Landing:

*   bin/waterline profile /user/waterlinedata/Landing/nyc_open

Profile the rest of Landing:

*   bin/waterline profile /user/waterlinedata/Landing

You can also choose to run the discovery tasks separately from the profiling tasks.

After profiling, Waterline Data Inventory shows the rich metadata and sample data for each field in each file in the cluster.

<figure>![](http://hortonassets.s3.amazonaws.com/tutorial/waterline/image16.png)</figure>

Profiled files show data quality metrics and sample data for each field

### Mark landings and run lineage discovery

A key feature of Waterline Data Inventory is its ability to discover and display relationships among files, such as files that are duplicates of each other or files that contain copies of data from other files. When it discovers such a relationship, Waterline Data Inventory shows the lineage of the files with the older file as the parent of the newer file.![](http://hortonassets.s3.amazonaws.com/tutorial/waterline/image17.png)

These lineage chains are very powerful when combined with the idea of a “landing,” or the original location at which the file arrived in the cluster.  The landing label is propagated through the lineage chain so each file derived from the original file shows the same origin. You’ll know where your data came from, even if you are working on your third iteration of the original file.

To discover lineage relationships and to propagate the landing labels or “origins” along the lineage chain, an administrator runs a lineage job. The lineage discovery process uses data from the Waterline Data Inventory repository to determine relationships among files and the chronology of the file evolution.

For the sandbox sample data (or any cluster), an administrator runs the lineage job once for all files already profiled. From the installation directory, waterlinedata:

*   bin/waterline runLineage

The lineage and origins appear for each file in the cluster. If Waterline Data Inventory suggests a lineage ![](http://hortonassets.s3.amazonaws.com/tutorial/waterline/image18.png)relationship that isn’t accurate or doesn’t capture the path you want to describe, you can reject the suggested relationships and the same lineage won’t be suggested for that file in future lineage runs. In addition, you can manually build relationships by adding a parent to a given file’s lineage picture.

<figure>![](http://hortonassets.s3.amazonaws.com/tutorial/waterline/image19.png)</figure>

Lineage relationships and origins show in the Lineage tab for a file

The tutorial “[Tracing file sources](https://docs.google.com/a/waterlinedata.com/file/d/0B_f8cr2-qSHEQ2FzYkR0S3pmTVU/edit)” walks through examples of lineage display, searching using origins, and running lineage discovery jobs.

### Tag the data you know

Now that users can see the wealth of file and field information, they can begin to annotate the data using “tags.” ![](http://hortonassets.s3.amazonaws.com/tutorial/waterline/image06.png)Tags give users a place to record knowledge about files and fields so other users have the benefit of that knowledge. In addition, Waterline Data Inventory uses the data in tagged fields to identify other data in the cluster that may be similar.

For example, if you add the tag “product ID” to a field called PROD_ID, the next time Waterline Data Inventory tag propagation job runs, it will find other fields in the cluster with a similar field name and data pattern to the PROD_ID field. When it finds similar fields, it suggests the product ID tag to those fields. Now a search returns all the similar fields, not just the originally tagged field.

In Waterline Data Inventory, you can tag folders, files, and fields. Click Add Tag or click the tag count button to open the tagging dialog box; there you can enter a new tag or quickly find an existing tag.

<figure>![](http://hortonassets.s3.amazonaws.com/tutorial/waterline/image05.png)</figure>

Click the tag count to manage tags for this field

If you have data in a field that has a specific pattern or can otherwise be described using a minimum value, a maximum value, and a [regular expression](http://www.google.com/url?q=http%3A%2F%2Fwww.regular-expressions.info%2Findex.html&sa=D&sntz=1&usg=AFQjCNHblc1O45HOR5EjwZCHiqfnTkPupQ), Waterline Data Inventory lets you specify that pattern as a tagging rule that will be applied to profiled data in place of the built-in tag discovery process.

After you have added tags, an administrator can run the tag propagation job on the server to have Waterline Data Inventory identify additional locations in the cluster with data that matches the tagged data.

For the sandbox sample data (or any cluster), an administrator runs the tag propagation job once for all files already profiled. ![](http://hortonassets.s3.amazonaws.com/tutorial/waterline/image11.png)From the installation directory, waterlinedata:

*   bin/waterline tag

The suggested tag associations appear for each field in the cluster. One particularly strong method of using the suggested tags is in searches, which the next section describes.

### Leverage discovery results in searches

Even before users tag files and fields and before tag propagation identifies related data, you have access to ![](http://hortonassets.s3.amazonaws.com/tutorial/waterline/image09.png)search parameters that let you see into the details of files and fields, including field names, the most frequent values in the fields, and data quality metrics such as field value density and cardinality. Add Waterline Data Inventory’s tagging and lineage features and you have tremendous power to identify data across the cluster.

For example, in the sandbox sample data, go to Advanced Search and find the tag “Cuisine”.  Typing a few letters in the Tags filter box brings up that tag, which is nested under “Food Service.” Select the tag and click Search.

<figure>![](http://hortonassets.s3.amazonaws.com/tutorial/waterline/image13.png)</figure>

In Advanced Search, Tags section, type a few letters of the tag name to filter the list of tags

The search results show the files that include fields tagged with the “Food Service.Cuisine” tag. Switch to the Fields view and you’ll see the individual fields tagged with this tag. Add the “Tags” field to the list of columns and you can see the weight Waterline Data Inventory gave each association.![](http://hortonassets.s3.amazonaws.com/tutorial/waterline/image43.png)

<figure>![](http://hortonassets.s3.amazonaws.com/tutorial/waterline/image44.png)</figure>

Field search results configured to show the tags with suggested tags’ weights.

If Waterline Data Inventory suggests a tag association that isn’t accurate, you can reject the suggested tag (click the tag count to open the tagging dialog box) and the same tag won’t be suggested again for that field.

### Bookmark files you want to follow

Find a file you expect to return to? Want to know if this file changes or if a coworker has added tags to it? Bookmarking a file or folder allows you to jump right to the file from the Bookmark menu on the top of the Waterline Data Inventory screen.

<figure>![](http://hortonassets.s3.amazonaws.com/tutorial/waterline/image45.png)</figure>

After you bookmark a file, it appears in the menu on the toolbar.

In addition, Waterline Data Inventory collects notifications on files, folders, and tags you’ve bookmarked. All items in your bookmark list are tracked in your notifications. Notifications are displayed when a new tag is added to a folder, file, or field in a file; when the file is updated; when a file or folder is marked as a landing point; and when users generate a Hive table for the file. Click ![](http://hortonassets.s3.amazonaws.com/tutorial/waterline/image46.png) in the toolbar to open a short list of notifications; click See All in that menu to open a full list of notifications.

<figure>![](http://hortonassets.s3.amazonaws.com/tutorial/waterline/image49.png)</figure>

Notifications show events that happen on items in your Bookmark list

##

### Run jobs to keep up with new data and users’ tags

As new data comes into your cluster, you’ll want to run Waterline Data Inventory profiling jobs to make the rich metadata for the new data available to users. In addition, you’ll want to run tagging jobs to make sure that tags added to fields are propagated to new and to existing data that matches the tagged data.![](http://hortonassets.s3.amazonaws.com/tutorial/waterline/image50.png)

Determine how often to run profiling jobs based on the amount of new data that comes into the cluster. Because you can run the jobs on a section of the cluster (by specifying one directory or one place in the hierarchy of directories), you can balance how much time is devoted to profiling for a given job.

To keep up-to-date with incoming data , run both profiling and lineage jobs. For example, consider running one or more profiling jobs with tagging, then lineage for the cluster. In the sample cluster, you might run profiling on a heavily used landing directory independently, then on the remaining landing directories:

*   bin/waterline profile /user/waterlinedata/Landing/data.gov
*   bin/waterline profile /user/waterlinedata/Landing
*   bin/waterline runLineaage

The Waterline Data Inventory sandbox is pre-populated with data for you to explore. The HDFS files have been profiled and the data has some field and file tags applied and propagated through-out the cluster. The following tutorials walk you through specific exercises that further augment the sample data so you can experience the value that Waterline Data Inventory provides.

*   Leveraging tagging of familiar data
*   Searching across the cluster
*   Tracing file sources

### Get Started

These tutorials are available with the sandbox images at [go.waterlinedata.com/download-sandbox](http://go.waterlinedata.com/download-sandbox).
