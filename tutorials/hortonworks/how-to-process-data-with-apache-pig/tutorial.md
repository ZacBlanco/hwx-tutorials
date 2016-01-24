
### [](#what-is-pig)What is Pig?

Pig is a high level scripting language that is used with Apache Hadoop. Pig excels at describing data analysis problems as data flows. Pig is complete in that you can do all the required data manipulations in Apache Hadoop with Pig. In addition through the User Defined Functions(UDF) facility in Pig you can have Pig invoke code in many languages like JRuby, Jython and Java. Conversely you can execute Pig scripts in other languages. The result is that you can use Pig as a component to build larger and more complex applications that tackle real business problems.

A good example of a `Pig application` is the `ETL transaction model` that describes how a process will extract data from a source, transform it according to a rule set and then load it into a datastore. Pig can ingest data from files, streams or other sources using the User Defined Functions(UDF). Once it has the data it can perform select, iteration, and other transforms over the data. Again the UDF feature allows passing the data to more complex algorithms for the transform. Finally Pig can store the results into the Hadoop Data File System.

Pig scripts are translated into a series of `MapReduce jobs` that are run on the `Apache  Hadoop cluster`. As part of the translation the Pig interpreter does perform optimizations to speed execution on Apache Hadoop. We are going to write a Pig script that will do our data analysis task.

### [](#our-data-processing-task)Our data processing task

We are going to read in a baseball statistics file. We are going to compute the highest runs by a player for each year. This file has all the statistics from 1871–2011 and it contains over 90,000 rows. Once we have the highest runs we will extend the script to translate a player id field into the first and last names of the players.

### [](#downloading-the-data)Downloading the data

The data file we are using comes from the site [www.seanlahman.com](http://www.seanlahman.com). You can download the data file in `csv zip` form from:

[http://hortonassets.s3.amazonaws.com/pig/lahman591-csv.zip](http://hortonassets.s3.amazonaws.com/pig/lahman591-csv.zip)

Once you have the file you will need to `unzip` the file into a directory. We will be `uploading` just the `master.csv` and `batting.csv` files.

### [](#uploading-the-data-files)Uploading the data files

We start by selecting the `HDFS Files view` from the Off-canvas menu at the top. The `HDFS Files view` allows us to view the Hortonworks Data Platform(HDP) file store. This is separate from the local file system. For the Hortonworks Sandbox it will be part of the file system in the Hortonworks Sandbox VM.

Navigate to `/user/admin` and click on the Upload button to select the files we want to upload into the Hortonworks Sandbox environment.

![](../../../assets/how-to-process-data-with-apache-pig/68747470733a2f2f7797772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138574845314f486c434e31684e556c453f7261773d74727565.png?dl=1)

When you click on the browse button you will get a dialog box. Navigate to where you stored the `Batting.csv` file on your local disk and select `Batting.csv` and click again upload. Do the same thing for `Master.csv`. When you are done you will see there are two files in your directory.

![](../../../assets/how-to-process-data-with-apache-pig/68747470733a2f2f77754772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138543142565a6d6f775a79303152456b3f7261773d74727565.png?dl=1)

Now that we have our data files we can start writing our `Pig script`. Click on the `Pig button` from the Off-canvas menu.

We see the `Pig user interface` in our browser window. On the left we can choose between our `saved Pig  Scripts,  UDFs  and the Pig  Jobs` executed in the past. To the right of this menu bar we see our `saved Pig  Scripts`.

To get started push the button `"New Script"` at the top right and fill in a name for your script. If you leave the gap “Script HDFS Location” empty, it will be filled automatically.

![](../../../assets/how-to-process-data-with-apache-pig/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138576b4e61524778364d46394d616e633f7261773d74727565.png?dl=1)

After clicking on “create”, a new page opens.  
At the center is the composition area where we will be writing our script. At top right of the composition area are buttons to Execute, `Explain  and perform a Syntax check` of the current script.

![](../../../assets/how-to-process-data-with-apache-pig/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138626e704c5a476c32516b564463584d3f7261773d74727565.png?dl=1)

At the left are buttons to save, copy or delete the script and at the very bottom we can add a argument.

The first thing we need to do is load the data. We use the load statement for this. The `PigStorage` function is what does the loading and we pass it a `comma` as the data `delimiter`. Our code is:

    batting = load 'Batting.csv' using PigStorage(',');

![](../../../assets/how-to-process-data-with-apache-pig/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713853566c4a636a56525644427a616e4d3f7261773d74727565.png?dl=1)

To filter out the first row of the data we have to add this line:

        raw_runs = FILTER batting BY $1>0;

The next thing we want to do is name the fields. We will use a `FOREACH` statement to iterate through the batting data object. We can use `Pig  Helper` that is at the bottom of the composition area to provide us with a template. We will click on `Pig  Helper`, select Data processing functions and then click on the `FOREACH template`. We can then replace each element by hitting the tab key.

![](../../../assets/how-to-process-data-with-apache-pig/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071384f446c5763554a5251307451596b453f7261773d74727565.png?dl=1)

So the `FOREACH` statement will iterate through the batting data object and `GENERATE` pulls out selected fields and assigns them names. The new data object we are creating is then named runs. Our code will now be:

    runs = FOREACH raw_runs GENERATE $0 as playerID, $1 as year, $8 as runs;

![](../../../assets/how-to-process-data-with-apache-pig/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138634752365958467964334a4b526a413f7261773d74727565.png?dl=1)

The next line of code is a `GROUP` statement that groups the elements in runs by the year field. So the grp_data object will then be indexed by year. In the next statement as we iterate through grp_data we will go through year by year. Type in the code:

    grp_data = GROUP runs by (year);

![](../../../assets/how-to-process-data-with-apache-pig/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713861316847535764714c545a506144513f7261773d74727565.png?dl=1)

In the next `FOREACH` statement we are going to find the maximum runs for each year. The code for this is:

    max_runs = FOREACH grp_data GENERATE group as grp,MAX(runs.runs) as max_runs;

![](../../../assets/how-to-process-data-with-apache-pig/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713854334e7154305a6b64475a585958633f7261773d74727565.png?dl=1)

Now that we have the maximum runs we need to join this with the runs data object so we can pick up the player id. The result will be a dataset with `Year,  PlayerID  and  Max  Run`. At the end we `DUMP` the data to the output.

    join_max_run = JOIN max_runs by ($0, max_runs), runs by (year,runs);  
    join_data = FOREACH join_max_run GENERATE $0 as year, $2 as playerID, $1 as runs;  
    DUMP join_data;

![](../../../assets/how-to-process-data-with-apache-pig/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713862564e57546b78344e6c67775454413f7261773d74727565.png?dl=1)

Let’s take a look at our script. The first thing to notice is we never really address single rows of data to the left of the equals sign and on the right we just describe what we want to do for each row. We just assume things are applied to all the rows. We also have powerful operators like `GROUP` and `JOIN` to sort rows by a key and to build new data objects.

At this point we can save our script.

We can execute our code by clicking on the execute button at the top right of the composition area, which opens a new page.

![](../../../assets/how-to-process-data-with-apache-pig/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071384e6e68574c57785756464a36596e4d3f7261773d74727565.png?dl=1)

As the jobs are run we will get status boxes where we will see logs, error message, the output of our script and our code at the bottom.

![](../../../assets/how-to-process-data-with-apache-pig/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713853486854636a6c556548517a576e4d3f7261773d74727565.png?dl=1)

If you scroll down to the “Logs…” and click on the link you can see the log file of your jobs. We should always check the Logs to check if your script was executed correctly.

![](../../../assets/how-to-process-data-with-apache-pig/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713854466c506230314d574735445a6d4d3f7261773d74727565.png?dl=1)

So we have created a simple `Pig script` that **reads in some comma separated data.**  
Once we have that set of records in Pig we **pull out the `playerID, year and runs fields` from each row.**  
We then **sort them by `year`** with one statement, `GROUP`.  
Then we **find the maximum runs for each year.**  
This is finally **mapped to the playerID** and we produce our final dataset.

As mentioned before `Pig` operates on data flows. We consider each group of rows together and we specify how we operate on them as a group. As the datasets get larger and/or add fields our `Pig script` will remain pretty much the same because it is concentrating on how we want to manipulate the data.  