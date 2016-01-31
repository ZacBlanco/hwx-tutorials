### Overview

In this tutorial we will walk through the process of

  * cleaning and aggregating 10 years of raw stock ticker data from NYSE
  * enriching the data model by looking up additional attributes from Wikipedia
  * creating an interactive visualization on the model

### Prerequisites:

  * A working HDP cluster
    * The easiest way to have a HDP cluster is to download the Hortonworks Sandbox, or
    * Create a cluster using Azure HDInsight Service, or
    * Create your own HDP for Windows cluster
  * The NYSE stockticker data
  * Microsoft Excel 2013 with PowerPivot and Power View enabled on a Windows system
  * Microsoft Power Query for Excel

### The Data

The Zip file you downloaded above containing the NYSE stock ticker data is comprised of two folders below:

[![](https://camo.githubusercontent.com/12a7e5d15ed69aef5b5f7127e23a3f5f0a934e08/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d33322e6a7067)](https://camo.githubusercontent.com/12a7e5d15ed69aef5b5f7127e23a3f5f0a934e08/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d33322e6a7067)

These folders contain numerous comma separated value files representing end of day stock ticker and dividend data of all stock symbols listed at NYSE for a period of 10 years.

### Staging the data on HDFS

The first step is to stage the data in HDFS. In case you are using HDInsight Service or another cloud provider, you will have to stage the data on the respective cloud storage. For example in the case of Azure HDInsight Service it is Azure Blob Storage.

For the rest of the tutorial we are going to assume we have a local cluster like the Hortonworks Sandbox to work with.

We will use the HDFS Files view of Ambari to stage the data. 

[![](https://camo.githubusercontent.com/aaafc8ea696eb5fef09dd2bfc0c8aea200adc946/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138616d30314d6d52695a444a714e6b453f7261773d74727565)](https://camo.githubusercontent.com/aaafc8ea696eb5fef09dd2bfc0c8aea200adc946/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138616d30314d6d52695a444a714e6b453f7261773d74727565)

Navigate to /user/admin.

[![](https://camo.githubusercontent.com/77e913c5a5cf6b891e943f8beb696b7c5c6cc54a/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138574845314f486c434e31684e556c453f7261773d74727565)](https://camo.githubusercontent.com/77e913c5a5cf6b891e943f8beb696b7c5c6cc54a/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138574845314f486c434e31684e556c453f7261773d74727565)

Create a new directory nyse/nyse_prices and nyse/nyse_dividends.

[![](https://camo.githubusercontent.com/a50e14e15f95bf1190d55283cd802c184e19be04/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713855334e5151564a3265556c5651584d3f7261773d74727565)](https://camo.githubusercontent.com/a50e14e15f95bf1190d55283cd802c184e19be04/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713855334e5151564a3265556c5651584d3f7261773d74727565)

Go to nyse_prices and upload some of the files of the local zip we previously downloaded and repeat this for nyse_dividends. 

[![](https://camo.githubusercontent.com/34dae255674de67d905d0ad0e81ab1af99ef20c3/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138547930785745526f57484a785954413f7261773d74727565)](https://camo.githubusercontent.com/34dae255674de67d905d0ad0e81ab1af99ef20c3/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138547930785745526f57484a785954413f7261773d74727565)

You could also use hdfs command line among other ways to achieve the same. This is probably the less time-compusing opportunity. The following commands load data in hdfs. 

  * Open a terminal:
    * e.g. ssh root@127.0.0.1

It will ask you for your password. The default password is hadoop.

  * To upload the data
    * hadoop fs -put nyse_prices /user/admin/nyse
    * hadoop fs -put nyse_dividends /user/admin/nyse

**Note**: to change any permission

  * log in as superuser for hdfs 
    * su hdfs
  * and change this using these commands
    * hdfs dfs -chmod 777 /user/admin/nyse
  * or changing the user of the folder
    * hadoop fs -chown -R admin /user/admin/nyse

### Creating a Hive schema on the raw data:

We will use the Hive View of Ambari to execute the DDL queries:

[![](https://camo.githubusercontent.com/2c2116098e753ec94b80c266869065e9dc0646c9/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071385a6c4656516a645254476c665a54413f7261773d74727565)](https://camo.githubusercontent.com/2c2116098e753ec94b80c266869065e9dc0646c9/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071385a6c4656516a645254476c665a54413f7261773d74727565)

Use the DDL statement below to create the table ‘price_data’:
    
      create external table price_data (stock_exchange string, symbol string, trade_date string, 
                                          open float, high float, low float, close float, volume int, adj_close float) 
      row format delimited 
      fields terminated by ',' 
      stored as textfile 
      location '/user/admin/nyse/nyse_prices';
    

[![](https://camo.githubusercontent.com/cb8d63aec0f8ebefee095cb1da70b1071258b998/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713856546c76543356536358425764306b3f7261773d74727565)](https://camo.githubusercontent.com/cb8d63aec0f8ebefee095cb1da70b1071258b998/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713856546c76543356536358425764306b3f7261773d74727565)

To test it succeeded run the sample query by clicking on the icon next to the table name at the left.

[![](https://camo.githubusercontent.com/e1a16807d30ceb476b6c95a462344ca21ef2370b/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071385a6c704e596c4e59637a52464e57383f7261773d74727565)](https://camo.githubusercontent.com/e1a16807d30ceb476b6c95a462344ca21ef2370b/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071385a6c704e596c4e59637a52464e57383f7261773d74727565)

Then use the DDL statement below to create the table ‘dividends_data’:
    
      create external table dividends_data (stock_exchange string, symbol string, trade_date string, dividend float) 
      row format delimited 
      fields terminated by ',' 
      stored as textfile 
      location '/user/admin/nyse/nyse_dividends';
    

[![](https://camo.githubusercontent.com/388c2dcdb22a57d44574c7936e6e703b6035ec84/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138636c4d74536e457a56446861656d633f7261773d74727565)](https://camo.githubusercontent.com/388c2dcdb22a57d44574c7936e6e703b6035ec84/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138636c4d74536e457a56446861656d633f7261773d74727565)

To test it succeeded run a query:

[![](https://camo.githubusercontent.com/6be2f193f4f890d4f1cf5eeec5bd6e0770aef53f/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071385a6b6c4a52486c57643070615547633f7261773d74727565)](https://camo.githubusercontent.com/6be2f193f4f890d4f1cf5eeec5bd6e0770aef53f/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071385a6b6c4a52486c57643070615547633f7261773d74727565)

### Aggregating the stocks and dividend data

Notice in the output of the query on the table price_data above that there are many records for a stock symbol for every year.

We want to work with a table which summarizes the high, low, average and the dividend for every year by stock symbol.

Create another directory under /user/admin/nyse with the title "stock_aggregates".

[![](https://camo.githubusercontent.com/6caf5e6249d19025f284f6819552cadc89ef14b2/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138527a683064465a725a466c745548633f7261773d74727565)](https://camo.githubusercontent.com/6caf5e6249d19025f284f6819552cadc89ef14b2/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138527a683064465a725a466c745548633f7261773d74727565)

Here’s the DDL statement to create the table ‘yearly_aggregates’:
    
      create table yearly_aggregates (symbol string, year string, high float, low float, average_close float, total_dividends float) 
      row format delimited 
      fields terminated by ',' 
      stored as textfile 
      location '/user/admin/nyse/stock_aggregates';
    

[![](https://camo.githubusercontent.com/72066ca3daf93cd51a8b0e538a8d975c43d8c840/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071386232524456484a736458424b636c6b3f7261773d74727565)](https://camo.githubusercontent.com/72066ca3daf93cd51a8b0e538a8d975c43d8c840/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071386232524456484a736458424b636c6b3f7261773d74727565)

Now let’s populate the table with data using the following query:
    
      insert overwrite table yearly_aggregates 
      select a.symbol, year(a.trade_date), max(a.high), min(a.low),  avg(a.close), sum(b.dividend) 
      from price_data a 
      left outer join dividends_data b 
      on (a.symbol = b.symbol and a.trade_date = b.trade_date) 
      group by a.symbol, year(a.trade_date);
    

[![](https://camo.githubusercontent.com/a4ed8228fddcdab11cfcdf1a0b2c876bd1a1a76c/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071386558567863315a7352584e756445553f7261773d74727565)](https://camo.githubusercontent.com/a4ed8228fddcdab11cfcdf1a0b2c876bd1a1a76c/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071386558567863315a7352584e756445553f7261773d74727565)

Let’s run a query to test the table and notice in the output below now we have just one record per year per symbol:

[![](https://camo.githubusercontent.com/deb687fa3f82ed144bf4fa96cd7f240f2cb7a85a/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713859564e5663584a434f57687a6454413f7261773d74727565)](https://camo.githubusercontent.com/deb687fa3f82ed144bf4fa96cd7f240f2cb7a85a/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713859564e5663584a434f57687a6454413f7261773d74727565)

### Consuming and Shaping resultset from Hive query using Excel

We will use Excel for this step.

Open Excel with a blank workbook and select the Power Query tab on the ribbon:

[![](https://camo.githubusercontent.com/b5145121686f4b11b24e6dd1ab219f6447a472a1/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d34382e6a7067)](https://camo.githubusercontent.com/b5145121686f4b11b24e6dd1ab219f6447a472a1/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d34382e6a7067)

Click on “From Other Sources” on the ribbon and select “From Hadoop File (HDFS)”:

[![](https://camo.githubusercontent.com/dadfd1db7dd86393c81750d60848c5fbbf2f3df9/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d34392e6a7067)](https://camo.githubusercontent.com/dadfd1db7dd86393c81750d60848c5fbbf2f3df9/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d34392e6a7067)

Here you should enter the IP address or server name of you HDP cluster namenode.

[![](https://camo.githubusercontent.com/9a26522e7f920aebed53567d9a3ff0aa220c31d2/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d35302e6a7067)](https://camo.githubusercontent.com/9a26522e7f920aebed53567d9a3ff0aa220c31d2/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d35302e6a7067)

If your cluster needs authentication, you will also need to enter your credentials. For Sandbox, select the anonymous mode.

You will see a listing of all files on the HDFS, which could be quite overwhelming:

[![](https://camo.githubusercontent.com/f65d8a003e07d23b23788ea812c9806864904e3f/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d35312e6a7067)](https://camo.githubusercontent.com/f65d8a003e07d23b23788ea812c9806864904e3f/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d35312e6a7067)

Thankfully Power Query has a nifty capability to filter the listing by clicking on the little triangle on the column name. In this case I filter the Folder path column with the string ‘aggregate’:

[![](https://camo.githubusercontent.com/53e29e25eff297ed28a77b83a2644335f478c499/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d35332e6a7067)](https://camo.githubusercontent.com/53e29e25eff297ed28a77b83a2644335f478c499/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d35332e6a7067)

Now click on the Binary link on the Content column:

[![](https://camo.githubusercontent.com/b2b4f01ca7b51c38f94da173678720d3ade62e96/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d35392e6a7067)](https://camo.githubusercontent.com/b2b4f01ca7b51c38f94da173678720d3ade62e96/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d35392e6a7067)

Now you should see the comma separated records all in one column since excel does not yet know how to process it:

[![](https://camo.githubusercontent.com/3a91963a39711d0c5ecee3d547e43e509612b42b/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d36312e6a7067)](https://camo.githubusercontent.com/3a91963a39711d0c5ecee3d547e43e509612b42b/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d36312e6a7067)

Right click on the only column and select “Split Column” -> “By Delimiter”:

[![](https://camo.githubusercontent.com/7143b047d8544fe594ec7fbab3e7a0e30e253657/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d36322e6a7067)](https://camo.githubusercontent.com/7143b047d8544fe594ec7fbab3e7a0e30e253657/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d36322e6a7067)

Select “Comma” as the delimiter and hit “OK”:

[![](https://camo.githubusercontent.com/74ae3dbe2c1ce243d4c6505463033cc033f283d5/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d36332e6a7067)](https://camo.githubusercontent.com/74ae3dbe2c1ce243d4c6505463033cc033f283d5/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d36332e6a7067)

Now you should see the data properly structured:

[![](https://camo.githubusercontent.com/771615bcc76c5b4d3e445d089681505053bca7e7/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d36342e6a7067)](https://camo.githubusercontent.com/771615bcc76c5b4d3e445d089681505053bca7e7/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d36342e6a7067)

Let’s rename the column by right clicking the column names and selecting rename with name that make more sense:

[![](https://camo.githubusercontent.com/9aac5d1e661a38d375421aec38b53851ebb3bc6a/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d36362e6a7067)](https://camo.githubusercontent.com/9aac5d1e661a38d375421aec38b53851ebb3bc6a/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d36362e6a7067)

Now scroll down and you will notice that some values in the “Dividend” column are “\N” instead of a number. Let’s fix this by right clicking and selecting “Replace Values”:

[![](https://camo.githubusercontent.com/1d0064ef742d9f164cc14b45e876e4d457417355/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d36392e6a7067)](https://camo.githubusercontent.com/1d0064ef742d9f164cc14b45e876e4d457417355/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d36392e6a7067)

Now the “Dividend” Column should be well-formed:

[![](https://camo.githubusercontent.com/268775bdd8758a8fdab178f7105f643aae91d2c4/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d37302e6a7067)](https://camo.githubusercontent.com/268775bdd8758a8fdab178f7105f643aae91d2c4/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d37302e6a7067)

Let’s change the data type of the columns High, Low, Average, Dividend to Number by right clicking the column and selecting “Change Type”:

[![](https://camo.githubusercontent.com/dab355820e7d03fe30531d4137d37db19872811c/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d37312e6a7067)](https://camo.githubusercontent.com/dab355820e7d03fe30531d4137d37db19872811c/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d37312e6a7067)

Once you are done changing the type, the number fields should show italicized:

[![](https://camo.githubusercontent.com/fd1ac0b339a9f090b0f2b72d401e48189db9e8b5/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d37322e6a7067)](https://camo.githubusercontent.com/fd1ac0b339a9f090b0f2b72d401e48189db9e8b5/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d37322e6a7067)

We are done with shaping this data, lets click “Done”: [![](https://camo.githubusercontent.com/0bd7174bf572203c575fc3f8723f67591a02b8fb/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d37332e6a7067)](https://camo.githubusercontent.com/0bd7174bf572203c575fc3f8723f67591a02b8fb/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d37332e6a7067)

In the query settings on the right hand pane you can disable the download of the data, since we will download the data set only after we enhance it with additional attributes from Wikipedia.

[![](https://camo.githubusercontent.com/33feb4fe6957a1a8a78ad9f2a1a918d235cdd82d/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d37342e6a7067)](https://camo.githubusercontent.com/33feb4fe6957a1a8a78ad9f2a1a918d235cdd82d/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d37342e6a7067)

### Acquiring external data from the Internet using Search

Let’s find out which are the stocks that are in S&P 500. Click on “Online Search” on the Power Query tab of the Excel worksheet:

[![](https://camo.githubusercontent.com/d25066d14221eb9f952015fe5b5b715bdc7fc0b4/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d37362e6a7067)](https://camo.githubusercontent.com/d25066d14221eb9f952015fe5b5b715bdc7fc0b4/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d37362e6a7067)

By hovering over the search result list you can see previews of the datasets:

[![](https://camo.githubusercontent.com/431650f6f4f1c64544f1a772954c7776628dc4fc/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d37372e6a7067)](https://camo.githubusercontent.com/431650f6f4f1c64544f1a772954c7776628dc4fc/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d37372e6a7067)

Click to bring in the dataset titled “S&P 500 Component stocks – list of S&P 500 companies”:

[![](https://camo.githubusercontent.com/7829f5783d05a95ad62aa2602cc5d9897b96b910/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d37382e6a7067)](https://camo.githubusercontent.com/7829f5783d05a95ad62aa2602cc5d9897b96b910/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d37382e6a7067)

We have to shape this data before we use it. Click on “Filter & Shape” button on right hand pane to bring up the filter dialog:

[![](https://camo.githubusercontent.com/49a36e1d98f337aaf52166651fbb74155502ec73/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d37392e6a7067)](https://camo.githubusercontent.com/49a36e1d98f337aaf52166651fbb74155502ec73/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d37392e6a7067)

Remove the uninteresting columns for our analysis like “SEC filings”, “GICS Sub Industry”, “Data first added” and “key” by right-clicking on column names and selecting “Remove Columns”:

[![](https://camo.githubusercontent.com/a906af8fb714e6c06e276769a424d765e88c9c4c/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d38302e6a7067)](https://camo.githubusercontent.com/a906af8fb714e6c06e276769a424d765e88c9c4c/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d38302e6a7067)

Click “Done”

[![](https://camo.githubusercontent.com/fd3a89ed3a73e0da225f0e11e73e0a9e55d82fe6/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d38312e6a7067)](https://camo.githubusercontent.com/fd3a89ed3a73e0da225f0e11e73e0a9e55d82fe6/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d38312e6a7067)

### Enhancing the resultset acquired from Hadoop with additional attributes using data from Wikipedia

In this section we want to limit the data to only the stocks in the S&P 500 and moreover we want additional attributes for the stocks like the Company Name, Industry and location of the Headquarters.

Go to the “Power Query” tab and select “Merge”:

[![](https://camo.githubusercontent.com/29ee1619a77a11b29262a9eb8aec7b7690fd5e61/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d38332e6a7067)](https://camo.githubusercontent.com/29ee1619a77a11b29262a9eb8aec7b7690fd5e61/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d38332e6a7067)

Select the resultset you acquired from Hadoop as the first resultset and select the resultset you acquired from Internet as your second resultset. Also select the “Symbol” and “Stock Symbol” as the columns to do the JOIN on and click OK:

[![](https://camo.githubusercontent.com/9675b6baa409bb05ecc9edab6863086d82357207/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d38342e6a7067)](https://camo.githubusercontent.com/9675b6baa409bb05ecc9edab6863086d82357207/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d38342e6a7067)

Now let’s expand the NewColumn to its component attributes by clicking on the little T shaped icon beside the column name. Deselect “Ticker Symbol” as we have that attribute already from before:

[![](https://camo.githubusercontent.com/507d9cfc655340fdf955736403311569ac44717e/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d38352e6a7067)](https://camo.githubusercontent.com/507d9cfc655340fdf955736403311569ac44717e/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d38352e6a7067)

You should see the new columns like below:

[![](https://camo.githubusercontent.com/e6df4ee8b8a02cd0a77cd9f4579968706de1bc55/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d38362e6a7067)](https://camo.githubusercontent.com/e6df4ee8b8a02cd0a77cd9f4579968706de1bc55/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d38362e6a7067)

Rename the new columns to something like below:

[![](https://camo.githubusercontent.com/f303e173e76e01322e484af0e5ce5c218b1cc4e5/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d38372e6a7067)](https://camo.githubusercontent.com/f303e173e76e01322e484af0e5ce5c218b1cc4e5/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d38372e6a7067)

Scroll down and you will notice that many rows have null values for the new columns.

[![](https://camo.githubusercontent.com/ae262cdad3ba548d8463b77ef00108bd6859dae6/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d38382e6a7067)](https://camo.githubusercontent.com/ae262cdad3ba548d8463b77ef00108bd6859dae6/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d38382e6a7067)

These rows are null because these stock symbols are not part of S&P 500. So, we need to filter these rows out by right clicking one of the null values and selecting “Text Filters”:

[![](https://camo.githubusercontent.com/ddce96f943351c48009fcd3ccec61394bcc9e2e1/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d39302e6a7067)](https://camo.githubusercontent.com/ddce96f943351c48009fcd3ccec61394bcc9e2e1/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d39302e6a7067)

Now the dataset is limited to just the symbols in S&P 500:

[![](https://camo.githubusercontent.com/8b70ece76c6f744843a1050cffe7e90598d3feca/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d39312e6a7067)](https://camo.githubusercontent.com/8b70ece76c6f744843a1050cffe7e90598d3feca/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d39312e6a7067)

Click “Done”:

[![](https://camo.githubusercontent.com/acec7f59f638c1d34cf431980e90652828cbaf2a/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d39322e6a7067)](https://camo.githubusercontent.com/acec7f59f638c1d34cf431980e90652828cbaf2a/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d39322e6a7067)

To load it into the PowerPivot in-memory model, click on the “Load to data Model” link on the right hand pane:

[![](https://camo.githubusercontent.com/9fd5729dbd8411bbfb2d55951134bf322941a3f8/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d39342e6a7067)](https://camo.githubusercontent.com/9fd5729dbd8411bbfb2d55951134bf322941a3f8/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d39342e6a7067)

To confirm that it has been loaded to the PowerPivot model, click on the PowerPivot tab on Excel and select Manage:

[![](https://camo.githubusercontent.com/4929aea2fcdaa96ec0f4ae533bf4c000bab1abd3/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d39352e6a7067)](https://camo.githubusercontent.com/4929aea2fcdaa96ec0f4ae533bf4c000bab1abd3/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d39352e6a7067)

You should see the following:

[![](https://camo.githubusercontent.com/ad496a01a581f0545fa1bf3e534eeeacba931418/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d39362e6a7067)](https://camo.githubusercontent.com/ad496a01a581f0545fa1bf3e534eeeacba931418/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d39362e6a7067)

Close the PowerPivot Model.

### Visualizing the combined model using Power View in Excel

Open the Insert tab of Excel and select PowerView to insert a Power View slide:

[![](https://camo.githubusercontent.com/08ab3a86a9fed3c1f4d3183d33ea2bcd0642a831/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d39372e6a7067)](https://camo.githubusercontent.com/08ab3a86a9fed3c1f4d3183d33ea2bcd0642a831/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d39372e6a7067)

You will see a Power View canvas with the default model:

[![](https://camo.githubusercontent.com/bf5258d4c6dc52af55303b0c9d816f645eabe4a6/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d39382e6a7067)](https://camo.githubusercontent.com/bf5258d4c6dc52af55303b0c9d816f645eabe4a6/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d39382e6a7067)

Deselect all the PowerView fields except Dividend and Headquarters. :

[![](https://camo.githubusercontent.com/406570148d7115bd88e516408bc2835fdd2f0206/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d39392e6a7067)](https://camo.githubusercontent.com/406570148d7115bd88e516408bc2835fdd2f0206/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d39392e6a7067)

Then ensure the dividend is being averaged and not summed by click on the little triangle beside Dividend

[![](https://camo.githubusercontent.com/b2584ffc10ec7b0f49a1d1fc36a531dcf4aee309/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d3130302e6a7067)](https://camo.githubusercontent.com/b2584ffc10ec7b0f49a1d1fc36a531dcf4aee309/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d3130302e6a7067)

Now click on the Map button on the Power View ribbon and BOOM!, you got an interactive map:

[![](https://camo.githubusercontent.com/af0297faf37687d2c65ee0586dfd0b62ed40c97f/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d3130312e6a7067)](https://camo.githubusercontent.com/af0297faf37687d2c65ee0586dfd0b62ed40c97f/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f686f72746f6e6173736574732f6d737475742f6973686f742d3130312e6a7067)

Resize and Zoom the Map control to your taste.

> As we walked through an end-to-end data pipeline where we started with the raw big data, cleaned, transformed and aggregated it in Hortonworks Data Platform or HDP, before consuming it in Excel for modeling and visualization, the integration was so simple that we barely noticed.
> 
> This was your favorite big data community (Apache Hadoop) at work. Hortonworks and others in the Apache community designed and implemented WebHDFS, an open REST API in Apache Hadoop. Microsoft used the API from Power Query for Excel to make the integration to Microsoft Business Intelligence platform seamless.

Happy Hadooping!!!