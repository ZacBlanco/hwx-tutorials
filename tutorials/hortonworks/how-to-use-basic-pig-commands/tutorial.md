### [](#tutorial-overview)Introduction

In this tutorial you will gain a working knowledge of Pig through the hands-on experience of creating Pig scripts to carry out essential data operations and tasks.

We will first read in two data files that contain New York Stock Exchange dividend prices and stock prices, and then use these files to perform a number of Pig operations including:

*   Define a relation with and without `schema`
*   Define a new relation from an `existing relation`
*   `Select` specific columns from within a relation
*   `Join` two relations
*   Sort the data using `‘ORDER BY’`
*   FILTER and Group the data using `‘GROUP BY’`

### [](#what-is-pig)What is Pig?

`Pig` is a high level scripting language that is used with Apache Hadoop. Pig enables data workers to write complex data transformations without knowing Java. Pig’s simple SQL-like scripting language is called Pig Latin, and appeals to developers already familiar with scripting languages and SQL.

Pig is complete, so you can do all required data manipulations in Apache Hadoop with Pig. Through the User Defined Functions(UDF) facility in Pig, Pig can invoke code in many languages like JRuby, Jython and Java. You can also embed Pig scripts in other languages. The result is that you can use Pig as a component to build larger and more complex applications that tackle real business problems.

Pig works with data from many sources, including structured and unstructured data, and store the results into the Hadoop Data File System.

Pig scripts are translated into a series of MapReduce jobs that are run on the Apache Hadoop cluster.

### [](#download-the-data)Download the Data

You’ll need sample data for this tutorial. The data set you will be using is stock ticker data from the `New York Stock Exchange` from the years 2000-2001\. Download this sample data from the following location:

[https://s3.amazonaws.com/hw-sandbox/tutorial1/infochimps_dataset_4778_download_16677-csv.zip](https://s3.amazonaws.com/hw-sandbox/tutorial1/infochimps_dataset_4778_download_16677-csv.zip)

The file is about 11 megabytes, and might take a few minutes to download.

Open the folder infochimps_dataset_4778_download_16677 > NYSE and locate the two data files that you will be using for this tutorial:

*   `NYSE_daily_prices_A.csv`
*   `NYSE_dividends_A.csv`

### [](#step-1-upload-the-data-files)Step 1: Upload the data files

Select the `HDFS Files view` from the Off-canvas menu at the top. That is the `views menu`. The HDFS Files view allows you to view the Hortonworks Data Platform(HDP) file store. The HDP file system is separate from the local file system.

![](/assetshow-to-use-basic-pig-commands/68747470733a23f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138616d30314d6d52695a444a714e6b453f7261773d74727565.png?dl=1)

Navigate to `/user/admin`, click Upload and Browse, which brings up a dialog box where you can select the `NYSE_daily_prices_A.csv` file from you computer. Upload the `NYSE_dividends_A.csv` file in the same way. When finished, notice that both files are now in HDFS.

![](/assetshow-to-use-basic-pig-commands/68747470733a2f2f77757772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713862336f315932745a645464465955453f7261773d74727565.png?dl=1)

### [](#step-2-create-your-script)Step 2: Create Your Script

Open the Pig interface by clicking the `Pig Button` in the `views menu`.

![](/assetshow-to-use-basic-pig-commands/687474707333a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071384f576835596d704d58324a616145303f7261773d74727565.png?dl=1)

On the left we can choose between our saved `Pig Scripts`, `UDFs` and the `Pig Jobs` executed in the past. To the right of this menu bar we see our saved Pig Scripts.

![](/assetshow-to-use-basic-pig-commands/687474707333a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713855586870546e4a4a6133704963466b3f7261773d74727565.png?dl=1)

Click on the button `"New Script"`, enter “Pig-Dividend” for the title of your script and leave the location path empty:

![](/assetshow-to-use-basic-pig-commands/68747470733a2f32f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138566b394655475a686147706865584d3f7261773d74727565.png?dl=1)

Below you can find an overview about which functionalities the pig interface makes available. A special feature of the interface is the PIG helper at the top left of the composition area, which provides templates for Pig statements, functions, I/O statements, HCatLoader() and Python user defined functions.

![](/assetshow-to-use-basic-pig-commands/68747470733a2f2f7777772e6756f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138564856515553316c64554d335955553f7261773d74727565.png?dl=1)

### [](#step-3-define-a-relation)Step 3: Define a relation

In this step, you will create a script to load the data and define a relation.

*   On line 1 `define` a relation named STOCK_A that represents the `NYSE stocks` that start with the letter “A”
*   On line 2 use the `DESCRIBE` command to view the STOCK_A relation

The completed code will look like:

    STOCK_A = LOAD 'nyse/NYSE_daily_prices_A.csv' using PigStorage(','); 
    DESCRIBE STOCK_A; 

![](/assetshow-to-use-basic-pig-commands/68747470733a2f25f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071386130787858306c4852446c7464316b3f7261773d74727565.png?dl=1)

### [](#step-4-save-and-execute-the-script)Step 4: Save and Execute the Script

Click the Save button to save your changes to the script. Click Execute to run the script. This action creates one or more MapReduce jobs. After a moment, the script starts and the page changes. Now, you have the opportunity to Kill the job in case you want to stop the job.

Next to the `Kill job button` is a `progress bar` with a text field above that shows the `job’s status`.

When the job completes, check the results in the green box. You can also download results to your system by clicking the download icon. Notice STOCK_A does not have a schema because we did not define one when loading the data into relation STOCK_A.

![](/assetshow-to-use-basic-pig-commands/68747470733a2f2f77777742e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071385357464f61576870557a5246646c453f7261773d74727565.png?dl=1)

### [](#step-5-define-a-relation-with-a-schema)Step 5: Define a Relation with a Schema

Let’s use the above code but this time with a schema. Modify line 1 of your script and add the following **AS** clause to `define a schema` for the daily stock price data. The complete code will be:

        STOCK_A = LOAD 'NYSE_daily_prices_A.csv' using PigStorage(',') 
        AS (exchange:chararray, symbol:chararray, date:chararray,                 
        open:float, high:float, low:float, close:float, volume:int, adj_close:float); 
        DESCRIBE STOCK_A; 

![](/assetshow-to-use-basic-pig-commands/68747470733a2f2f37777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713864546c714d33644e5a5641305557383f7261773d74727565.png?dl=1)

Save and execute the script again. This time you should see the schema for the STOCK_A relation:

![](/assetshow-to-use-basic-pig-commands/687474707333a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138596d684765466c464e6a68335454513f7261773d74727565.png?dl=1)

### [](#step-6-define-a-new-relation-from-an-existing-relation)Step 6: Define a new relation from an existing relation

You can define a new relation based on an existing one. For example, define the following B relation, which is a collection of 100 entries (arbitrarily selected) from the STOCK_A relation.

Add the following line to the end of your code:

        B = LIMIT STOCK_A 100; 
        DESCRIBE B; 

![](/assetshow-to-use-basic-pig-commands/68747470733a2f2f73777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138535564584d6a6879544846525446553f7261773d74727565.png?dl=1)

Save and execute the code. Notice B has the same schema as STOCK_A, because B is a `subset of A` relation.

![](/assetshow-to-use-basic-pig-commands/68747470733a2f2f77577772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071384d5846734d336f7757587042576e633f7261773d74727565.png?dl=1)

### [](#step-7-view-the-data)Step 7: View the Data

To view the data of a relation, use the `DUMP` command.

Add the following `DUMP` command to your Pig script, then save and execute it again:

        Dump B;

![](/assetshow-to-use-basic-pig-commands/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071385157784254544a72655734344d466b3f7261773d74727565.png?dl=1)

The command requires a MapReduce job to execute, so you will need to wait a minute or two for the job to complete. The output should be 100 entries from the contents of `NYSE_daily_prices_A.csv` (and not necessarily the ones shown below, because again, entries are arbitrarily chosen):

![](/assetshow-to-use-basic-pig-commands/68747470733a62f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071385a31463453484e6c4e53317956484d3f7261773d74727565.png?dl=1)

### [](#step-8-select-specific-columns-from-a-relation)Step 8: Select specific columns from a relation

Delete the `DESCRIBE A`, `DESCRIBE B` and `DUMP B` commands from your Pig script; you will no longer need those.

One of the key uses of Pig is data transformation. You can define a new relation based on the fields of an existing relation using the `FOREACH` command. Define a new relation `C`, which will contain only the `symbol, date and close fields` from relation B.

Now the complete code is:

        STOCK_A = LOAD 'NYSE_daily_prices_A.csv' using PigStorage(',') 
        AS (exchange:chararray, symbol:chararray, date:chararray, open:float, 
        high:float, low:float, close:float, volume:int, adj_close:float); 

        B = LIMIT STOCK_A 100; 
        C = FOREACH B GENERATE symbol, date, close; 
        DESCRIBE C; 

Save and execute the script and your output will look like the following:

![](/assetshow-to-use-basic-pig-commands/68747470733a2f2f77777729e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713857454e4b4e464a425a566c494f56453f7261773d74727565.png?dl=1)

### [](#step-9-store-relationship-data-into-a-hdfs-file)Step 9: Store relationship data into a HDFS File

In this step, you will use the `STORE` command to output a relation into a new file in `HDFS`. Enter the following command to output the C relation to a folder named `output/C` (then save and execute):

        STORE C INTO 'output/C'; 

![](/assetshow-to-use-basic-pig-commands/68747470733a23f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713864585a3654563968625646586154673f7261773d74727565.png?dl=1)

Again, this requires a MapReduce job (just like the `DUMP` command), so you will need to wait a minute for the job to complete.

Once the job is finished, go to `HDFS Files view` and look for a newly created folder called “output” under `/user/admin`:

![](/assetshow-to-use-basic-pig-commands/68747470733a23f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713864585a3654563968625646586154673f7261773d74727565.png?dl=1)

Click on “output” folder. You will find a subfolder named “C”.

![](/assetshow-to-use-basic-pig-commands/68747470733a2f2f7777772e7676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713864585a3654563968625646586154673f7261773d74727565.png?dl=1)

Click on “C” folder. You will see an output file called “part-r-00000”:

![](/assetshow-to-use-basic-pig-commands/687474707338a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138556b464653544e4d576b3571547a513f7261773d74727565.png?dl=1)

Click on the file “part-r-00000”. It will download the file:

![](/assetshow-to-use-basic-pig-commands/68747470733a92f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713865456470534446784d4756315545303f7261773d74727565.png?dl=1)

### [](#step-10-perform-a-join-between-2-relations)Step 10: Perform a join between 2 relations

In this step, you will perform a `join` on two NYSE data sets: the daily prices and the dividend prices. Dividends prices are shown for the quarter, while stock prices are represented on a daily basis.

You have already defined a relation for the stocks named STOCK_A. Create a new Pig script named “Pig-Join”. Then define a new relation named DIV_A that represents the dividends for stocks that start with an “A”, then `join A and B` by both the `symbol and date` and describe the schema of the new relation C.

The complete code will be:

        STOCK_A = LOAD 'NYSE_daily_prices_A.csv' using PigStorage(',') 
            AS (exchange:chararray, symbol:chararray, date:chararray,
            open:float, high:float, low:float, close:float, volume:int, adj_close:float); 
        DIV_A = LOAD 'NYSE_dividends_A.csv' using PigStorage(',') 
            AS (exchange:chararray, symbol:chararray, date:chararray, dividend:float); 
        C = JOIN STOCK_A BY (symbol, date), DIV_A BY (symbol, date); 
        DESCRIBE C; 

![](/assetshow-to-use-basic-pig-commands/687474709733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138536d566c656b7830566c70705932633f7261773d74727565.png?dl=1)

Save the script and execute it. Notice C contains all the fields of both STOCK_A and DIV_A. You can use the `DUMP` command to see the data stored in the relation C:

![](/assetshow-to-use-basic-pig-commands/68747470733a29f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713862455a7a4d6e426f5a6b6c46517a673f7261773d74727565.png?dl=1)

### [](#step-11-sort-the-data-using-order-by)Step 11: Sort the data using “ORDER BY”

Use the `ORDER BY` command to sort a relation by one or more of its fields. Create a new Pig script named “Pig-sort” and enter the following commands to sort the dividends by symbol then date in ascending order:

        DIV_A = LOAD 'NYSE_dividends_A.csv' using PigStorage(',')
            AS (exchange:chararray, symbol:chararray, date:chararray, dividend:float); 
        B = ORDER DIV_A BY symbol, date asc; 
        DUMP B; 

![](/assetshow-to-use-basic-pig-commands/68747470733a2f2f77377772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713852485a4d63305633636a4e4b557a673f7261773d74727565.png?dl=1)

Save and execute the script. Your output should be sorted as shown here:

![](/assetshow-to-use-basic-pig-commands/68747470733a23f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713863455a6652323977593268595a57633f7261773d74727565.png?dl=1)

### [](#step-12-filter-and-group-the-data-using-group-by)Step 12: Filter and Group the data using “GROUP BY”

The `GROUP` command allows you to group a relation by one of its fields. Create a new Pig script named “Pig-group”. Then, enter the following commands, which group the DIV_A relation by the dividend price for the “AZZ” stock.

        DIV_A = LOAD 'NYSE_dividends_A.csv' using PigStorage(',') 
            AS (exchange:chararray, symbol:chararray, date:chararray, dividend:float); 
        B = FILTER DIV_A BY symbol=='AZZ'; 
        C = GROUP B BY dividend; 
        DESCRIBE C; 
        DUMP C; 

![](/assetshow-to-use-basic-pig-commands/687474707353a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071386469314a6455565a563170765832383f7261773d74727565.png?dl=1)

Save and execute. Notice that the data for stock symbol “AZZ” is grouped together for each dividend.

![](/assetshow-to-use-basic-pig-commands/68747470733a28f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071384f454e4a627a4e5552555a4e546c6b3f7261773d74727565.png?dl=1)

Congratulations! You have successfully completed the tutorial and well on your way to pigging on Big Data.