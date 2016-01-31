In this tutorial we are going to walk through loading and analyzing graph data with Sqrrl and HDP.

Sqrrl just announced the availability of the latest Sqrrl Test Drive VM in partnership with the Hortonworks Sandbox, running HDP 2.1! This gives users a frictionless way to try out the features of Sqrrl without needing to set up a whole Hadoop cluster.

## Getting Started

1.  Register for and download the [Sqrrl Test Drive VM](http://info.sqrrl.com/trial-software-vm-1)
2.  Join the [Test Drive VM forum](https://groups.google.com/forum/#!forum/sqrrl-testdrive)
3.  Follow the tutorial below

## Notes on using the Test Drive VM

Please keep the following notes in mind as you work through the exercises in this document.

*   The Rails reference application works best with Chrome or Firefox. It is known to not work with Safari.

*   Login credentials for the VM are

    *   Username: root, Password: hadoop
    *   Username: sqrrl, Password: sqrrl (the sqrrl user has full sudo access)
*   The Sqrrl Enterprise v1.5.0 VM is built on top of the HortonWorks 2.1 Sandbox VM. The easiest way to perform copy/paste for subsequent exercises is to SSH into the virtual machine from a terminal window on your host operating system.

*   If the VM goes to sleep, Accumulo will lose its connectivity with Zookeeper and terminate itself. You will need to restart Accumulo and Sqrrl (the easiest way to do this is to issue the command "sudo reboot now" to restart the VM).

*   When working through the exercises, your results may be shown in a different order than the results in this document. This is because most of the example queries in this document do not specify ordered return results (using the "ORDER BY" clause).

*   If while working through the exercises, you see more results than you believe you should have received, verify that you are working within the correct dataset. If your Sqrrl shell prompt is "sqrrl:test@localhost>" then you may have forgotten to enter the appropriate "dataset" command specified in the exercise and you are querying all datasets in the system. In most cases, your Sqrrl shell prompt should have a dataset name after "localhost" (e.g., "sqrrl:test@localhost simpsons>" to indicate that you are only querying the "simpsons" dataset).

## Exercise 0: Importing and Launching the VM

#### Goal: Get your VM started up and ready for subsequent exercises

**Summary:** Import and start the Sqrrl Enterprise VM image.

Import the Sqrrl Enterprise v1.5.0 VM into VirtualBox. After import, start the VM. It should start up with no errors. If you have any problems, try the following:

1.  Make sure you have 4 GB of RAM free on your laptop before starting the VM. (Alternatively you may decrease the amount of allocated RAM to 2 GB, but it may slow VM operation.)
2.  Either disable USB 2.0 support for the VM in VirtualBox, or make sure you have the VirtualBox Extension Pack installed on your host
3.  Configure the VM for "Host-only Adapter" on the VM's Network configuration settings (you may have to create a "Host-only Network" in your global VirtualBox settings)

Using SSH from your host operations system, log into the VM as the sqrrl user. Within host O/S terminal:

    host$ ssh –p 2222 sqrrl@localhost

    sqrrl@localhost's password: sqrrl

    vm$

(you are now logged in to the appliance VM)

## Exercise 1: Start and stop the Sqrrl Enterprise Server

#### Goal: Learn the commands for starting and stopping Sqrrl

**Summary:** Connect to Sqrrl while up, then stop the server and experience a connection failure.

1.  Launch the Sqrrl shell and see that it successfully connects since the server is running (it automatically starts at VM launch).

        $ sqrrl shell –u test –p test –s localhost

        sqrrl:test@localhost> exit

        $

2.  Stop the Sqrrl Enterprise server.

        $ sqrrl stop

        Stopping Sqrrl Server

        Sqrrl Server has been stopped

        $

3.  Try to launch the Sqrrl shell and see that it fails to connect because Sqrrl is not running.

        $ sqrrl shell –u test –p test –s localhost

        org.apache.thrift.TTransportException: java.net.ConnectException: Connection refused

        ...

        $

4.  Re-start the Sqrrl Enterprise server for the remaining exercises.

        $ sqrrl start

        Sqrrl server (SQRRL) is now started as process 8584

        $

5.  Launch the Sqrrl shell again to verify that the server is once again running.

        $ sqrrl shell –u test –p test –s localhost

        sqrrl:test@localhost> exit

        $

## Exercise 2: Create and populate a dataset

#### Goal: Learn to use the Sqrrl shell, and introduce the Sqrrl data model

**Summary:** Insert records into a new dataset using only the command line shell.

1.  Use 'help' to review shell commands. Typing 'help' will list all commands. Typing 'help' plus a command name will explain the usage of that command (e.g. 'help insert').

        $ sqrrl shell –u test –p test –s localhost

        sqrrl:test@localhost> help

        ... help content displayed here

        sqrrl:test@localhost>

2.  Create a dataset with the 'create' command. Give the dataset a name of your choosing. The `-i +TERMS` in the command below is required to support searching for values across all document fields – i.e., `where lucene('marge')` instead of `where lucene('name:marge')`. See Exercise 3 for more details about searching.

        sqrrl:test@localhost> create simpsons -i +TERMS

        Created dataset simpsons

        sqrrl:test@localhost simpsons>

3.  Insert the following records into Sqrrl one at a time with the `insert` command. (Use copy/paste to assist).

        sqrrl:test@localhost simpsons> insert {"adult":false, "age":1, "name":"Maggie", "sex":"F"}

        inserted new document: B-1

        sqrrl:test@localhost simpsons> insert {"adult":false, "age":8, "name":"Lisa", "sex":"F"}

        inserted new document: B-2

        sqrrl:test@localhost simpsons> insert {"adult":true, "age":36, "name":"Marge", "sex":"F", "children" : ["Bart", "Lisa", "Maggie"]}

        inserted new document: B-3

        sqrrl:test@localhost simpsons> insert {"adult":false, "age":10, "name":"Bart", "sex":"M"}

        inserted new document: B-4

        sqrrl:test@localhost simpsons> insert {"adult":true, "age":40, "name":"Homer", "sex":"M", "children" : ["Bart", "Lisa", "Maggie"]}

        inserted new document: B-5

        sqrrl:test@localhost simpsons>

4.  Find the UUID of a specific record by using the query language.

        sqrrl:test@localhost simpsons> SELECT uuid(), name WHERE lucene('name:marge')

        +------------+

        |uuid() name |

        +------------+

        |B-3  |Marge|

        +------------+

        [1 row returned in 18 ms]

        (no more results)

        sqrrl:test@localhost simpsons>

5.  Making sure to use the UUID returned in the step above, use the `update` command to add a new value to the record.

        sqrrl:test@localhost simpsons> update B-3 { "hair": "blue" }

        Updated document B-3

        sqrrl:test@localhost simpsons>

6.  Again making sure to use the UUID returned in step 4, use the `get` command to confirm your change.

        sqrrl:test@localhost simpsons> get B-3

        +- adult: true

        +- age: 36

        +- children[]

        |  +- "Bart"

        |  +- "Lisa"

        |  +- "Maggie"

        +- hair: "blue"

        +- name: "Marge"

        +- sex: "F"

        sqrrl:test@localhost simpsons>

## Exercise 3: Search and aggregation

#### Goal: Learn the syntax and features of the Sqrrl query language.

**Summary:** Using the dataset created in Exercise 2, experiment with a variety of queries that leverage different Sqrrl features.

1.  Experiment with searches using the following examples

_Fielded search_

        sqrrl:test@localhost simpsons> select name where lucene('name:bart')

        +-----+

        |name |

        +-----+

        |Bart |

        +-----+

        [1 row returned in 19 ms]

        (no more results)

        sqrrl:test@localhost simpsons> select name where lucene('sex:m')

        +-----+

        |name |

        +-----+

        |Bart |

        +-----+

        |Homer|

        +-----+

        [2 rows returned in 32 ms]

        (no more results)

        sqrrl:test@localhost simpsons>

_Search all fields_

In this example, notice that the records for Homer and Marge are also returned due to the fact that the search of all fields located "Bart" within the children field for both parents.

        sqrrl:test@localhost simpsons> select name, json() where lucene('bart')

        +-----------------------+

        |name json()      |

        +-----+-----------------+

        |Homer| +- adult: true |

        |   | +- age: 40   |

        |   | +- children[]  |

        |   |   +- "Bart"  |

        |   |   +- "Lisa"  |

        |   |   +- "Maggie" |

        |   | +- name: "Homer"|

        |   | +- sex: "M"   |

        +-----+-----------------+

        |Marge| +- adult: true |

        |   | +- age: 36   |

        |   | +- children[]  |

        |   |   +- "Bart"  |

        |   |   +- "Lisa"  |

        |   |   +- "Maggie" |

        |   | +- hair: "blue" |

        |   | +- name: "Marge"|

        |   | +- sex: "F"   |

        +-----+-----------------+

        |Bart | +- adult: false |

        |   | +- age: 10   |

        |   | +- name: "Bart" |

        |   | +- sex: "M"   |

        +-----+-----------------+

        [3 rows returned in 26 ms]

        (no more results)

        sqrrl:test@localhost simpsons>

_Boolean searches_

Note that the `AND` and `OR` keywords inside the `lucene()` functions below must be capitalized

        sqrrl:test@localhost simpsons> select name where lucene('sex:m AND adult:true')

        +-----+

        |name |

        +-----+

        |Homer|

        +-----+

        [1 rows returned in 22 ms]

        (no more results)

        sqrrl:test@localhost simpsons> select name where lucene('sex:m OR adult:true')

        +-----+

        |name |

        +-----+

        |Bart |

        +-----+

        |Homer|

        +-----+

        |Marge|

        +-----+

        [3 rows returned in 39 ms]

        (no more results)

        sqrrl:test@localhost simpsons> select name where lucene('(sex:m AND adult:true) OR name:marge')

        +-----+

        |name |

        +-----+

        |Marge|

        +-----+

        |Homer|

        +-----+

        [2 rows returned in 31 ms]

        (no more results)

        sqrrl:test@localhost simpsons>

_Numeric range searches_

Note that the `TO` keyword inside the `lucene()` functions below must be capitalized

        sqrrl:test@localhost simpsons> select name where lucene('age:[30 TO 60]')

        +-----+

        |name |

        +-----+

        |Marge|

        +-----+

        |Homer|

        +-----+

        [2 rows returned in 34 ms]

        (no more results)

        sqrrl:test@localhost simpsons>

_String range search_

        sqrrl:test@localhost simpsons> select name where lucene('name:[a TO m]')

        +-----+

        |name |

        +-----+

        |Bart |

        +-----+

        |Lisa |

        +-----+

        |Homer|

        +-----+

        [3 rows returned in 42 ms]

        (no more results)

        sqrrl:test@localhost simpsons>

_Trailing wildcards_

        sqrrl:test@localhost simpsons> select name where lucene('name:h*')

        +-----+

        |name |

        +-----+

        |Homer|

        +-----+

        [1 row returned in 17 ms]

        (no more results)

        sqrrl:test@localhost simpsons>

_Search all entries of a string array_

        sqrrl:test@localhost simpsons> select name where lucene('children:bart')

        +-----+

        |name |

        +-----+

        |Marge|

        +-----+

        |Homer|

        +-----+

        [2 rows returned in 36 ms]

        (no more results)

        sqrrl:test@localhost simpsons>

1.  Use the `JSON` function to display entire documents in the query results.

        sqrrl:test@localhost simpsons> select uuid(), json() where lucene('marge')

        +------------------------+

        |uuid() json()      |

        +------+-----------------+

        |B-3  | +- adult: true |

        |   | +- age: 36   |

        |   | +- children[]  |

        |   | |  +- "Bart"  |

        |   | |  +- "Lisa"  |

        |   | |  +- "Maggie" |

        |   | +- hair: "blue" |

        |   | +- name: "Marge"|

        |   | +- sex: "F"   |

        +------+-----------------+

        [1 rows returned in 51 ms]

        (no more results)

        sqrrl:test@localhost simpsons>

2.  Experiment with aggregations using the following examples.

_Query-time Aggregates_

Sqrrl currently supports these aggregation functions: `SUM`, `COUNT`, `AVG`, `MIN`, `MAX`

        sqrrl:test@localhost simpsons> select avg(age) where lucene('age:[0 TO 10]')

        +-----------------+

        |AVG(age)     |

        +-----------------+

        |6.333333333333333|

        +-----------------+

        [1 rows returned in 46 ms]

        (no more results)

        sqrrl:test@localhost simpsons>

_Group by_

        sqrrl:test@localhost simpsons> SELECT sex, COUNT(uuid()) GROUP BY sex

        +-----------------+

        |sex COUNT(uuid())|

        +---+-------------+

        |F |3      |

        +---+-------------+

        |M |2      |

        +---+-------------+

        [2 rows returned in 62 ms]

        (no more results)

        sqrrl:test@localhost simpsons>

_Multiple aggregations, groups_

        sqrrl:test@localhost simpsons> SELECT sex, adult, COUNT(uuid()), AVG(age) GROUP BY sex, adult

        +--------------------------------+

        |sex adult COUNT(uuid()) AVG(age)|

        +---+-----+-------------+--------+

        |F |false|2      |4.5   |

        +---+-----+-------------+--------+

        |F |true |1      |36   |

        +---+-----+-------------+--------+

        |M |false|1      |10   |

        +---+-----+-------------+--------+

        |M |true |1      |40   |

        +---+-----+-------------+--------+

        [4 rows returned in 68 ms]

        (no more results)

        sqrrl:test@localhost simpsons>

_Scalar functions_

        sqrrl:test@localhost simpsons> SELECT age*365, name WHERE lucene('homer')

        +-----------------+

        |(age * 365) name |

        +-----------+-----+

        |14600   |Homer|

        +-----------+-----+

        [1 row returned in 23 ms]

        (no more results)

        sqrrl:test@localhost simpsons> SELECT name + ' is a ' + sex WHERE lucene('homer')

        +-------------------------+

        |((name + ' is a ') + sex)|

        +-------------------------+

        |Homer is a M       |

        +-------------------------+

        [1 row returned in 33 ms]

        (no more results)

        sqrrl:test@localhost simpsons> SELECT age > 10, count(uuid()) group by (age > 10)

        +------------------------+

        |(age > 10) COUNT(uuid())|

        +----------+-------------+

        |false   |3      |

        +----------+-------------+

        |true   |2      |

        +----------+-------------+

        [2 rows returned in 40 ms]

        (no more results)

        sqrrl:test@localhost simpsons>

## Exercise 4: Load JSON data

#### Goal: Learn about loading data into Sqrrl with external tools and schema summarization tools.

**Summary:** Use a sample data loader to load many JSON objects into Sqrrl. Inspect the schema of the data and make some queries.

1.  Inspect the Enron email JSON data with a text viewer.

        $ gunzip ~/training_data/enron.mbox.json.gz

        $ less ~/training_data/enron.mbox.json

2.  Review the command line usage for the Sqrrl sample JSON data loader.

        $ cd ~/sqrrl-client-1.5.0/java/bin

        $ ./client-utils json --help

3.  Load the file of Enron email into a new 'enron' dataset in Sqrrl with the following command.

        $ cd ~/sqrrl-client-1.5.0/java/bin

        $ ./client-utils json -d enron -f ~/training_data/enron.mbox.json -u test -p test -s localhost

The data load should take a few minutes. The tool will print out its progress along the way. If the load takes longer than you want to wait on your particular VM, you can safely control-c the data loader command to interrupt it and keep the data that has been loaded so far.

1.  Confirm that the Enron emails have been ingested with the Sqrrl shell. Start the shell, if it is not still open.

        $ sqrrl shell -u test -p test -s localhost

        sqrrl:test@localhost>

2.  Begin using the 'enron' dataset.

        sqrrl:test@localhost> dataset enron

        sqrrl:test@localhost enron>

3.  Use the `schematree` shell command to display the schema of the data that was loaded.

        sqrrl:test@localhost enron> schematree

        +- Bcc[]

        +- Cc[]

        +- Content-Transfer-Encoding

        +- Content-Type

        +- Date

        |  +- $date

        +- From

        +- Message-ID

        +- Mime-Version

        +- Subject

        +- To[]

        +- X-FileName

        +- X-Folder

        +- X-From

        +- X-Origin

        +- X-To

        +- X-bcc

        +- X-cc

        +- parts[]

          +- content

          +- contentType

        sqrrl:test@localhost enron>

4.  The `schemacounts` shell command can confirm the number of records loaded. Use this command, and then check that the "" element is 41,299\. (This represents the total size of the sample data set – if you interrupted the sample load before it completed, your schemacount numbers will be different from those shown below.)

sqrrl:test@localhost enron> schemacounts

        :           41,299

        Bcc:            10,252

        Bcc[0]:           46,337

        Cc:             10,252

        Cc[0]:           46,337

        Content-Transfer-Encoding: 41,297

        Content-Type:        41,297

        Date:            41,299

        Date/$date:         41,299

        From:            41,299

        Message-ID:         41,299

        Mime-Version:        41,297

        Subject:          41,299

        To:             36,794

        To[0]:           390,429

        X-FileName:         41,297

        X-Folder:          41,297

        X-From:           41,297

        X-Origin:          41,297

        X-To:            41,297

        X-bcc:           41,297

        X-cc:            41,297

        parts:           41,299

        parts[0]:          41,299

        parts[0]/content:      41,299

        parts[0]/contentType:    41,299

        sqrrl:test@localhost enron>

1.  Do a sample query to search your data. The `PATH` function selects a field that is nested below the root level of the document.

        sqrrl:test@localhost enron> select path('Subject') where path('From')='kenneth.lay@enron.com'

        +------------------------------------------------+

        |path('Subject')                 |

        +------------------------------------------------+

        |FW: AFL-CIO Press Release            |

        +------------------------------------------------+

        |FW: Salary                   |

        +------------------------------------------------+

        |Executive Committee               |

        +------------------------------------------------+

        |Associate/Analyst Program            |

        +------------------------------------------------+

        |Re: Gerald Smith                |

        +------------------------------------------------+

        |FW: dynergy planned for merger to fail all along|

        +------------------------------------------------+

## Exercise 5: Reference application

#### Goal: See an example of Sqrrl query results visualized through an interactive web application.

**Summary:** Start up the Sqrrl Ruby on Rails reference application and use it to query the sample data that you loaded in Exercise 4\.

1.  Using a browser on your host operating system, confirm that the Sqrrl reference application is available at `http://localhost:3000`

2.  Click on the "Analytics" tab at the top right of the screen.

3.  Select your enron dataset in the dataset selection box at the top middle of the screen.

4.  Click the 'gear' icon next to the 'graph it' button, and click the 'Tabular view?' checkbox to enable tabular view instead of chart view for your first queries.

5.  Experiment with queries in tabular view using the following examples:

        select path('Subject'), json('To') where path('From')='kenneth.lay@enron.com'
        select path('From'), path('Subject') where path('To[*]')='kenneth.lay@enron.com'

6.  Uncheck tabular view, and experiment with charting single column group-by queries

        select path('From'), count(1) where lucene('From:ke*') group by path('From')
        select substring(path('From'),1,1) as firstLetter, count(*) group by firstLetter

7.  Experiment with a group-by over two columns

        select substring(path('From'),1,1) as firstLetter, round(length(path('parts[0]/content')) / 10000, 0) as msgSize , count(*) group by firstLetter, msgSize

This somewhat artificial query counts the number of messages (in 10K size bands) sent based on the first letter of the sender's email address. You can clearly see (as expected) that the majority of messages are less than 10K in size. The orange and red blocks represent higher counts of messages and you can hover over a block to see how many messages that block represents.

## Exercise 6: Visibility Labels

#### Goal: Introduce the concepts of per-cell visibility labels and user authorizations.

**Summary:** Load a different copy of the Enron email JSON data that has been annotated with visibility labels restricting access to certain cells. Query Sqrrl as different users, and with different visibilities, to see the effects of the access control.

1.  Inspect the Enron 'restricted' dataset, where certain cells are only visible by users with specific authorizations.

        $ gunzip ~/training_data/enron.mbox.restricted.json.gz

        $ less ~/training_data/enron.mbox.restricted.json

Visibility labels are applied to the first 6 documents (the entire set of emails from Kenneth Lay) to prevent a user without either `ADMIN` or `exec` visibility privilege from seeing many of the fields. (Notice the `@[ADMIN|exec]` concatenated to some of the JSON keys.)

        {

         "Content-Transfer-Encoding": "7bit",

         "From@[ADMIN|exec]": "kenneth.lay@enron.com",

         "Cc@[ADMIN|exec]": ["jeff.skilling@enron.com", "andrew.fastow@enron.com"],

         "X-bcc@[ADMIN|exec]": "",

         "Bcc@[ADMIN|exec]": ["jeff.skilling@enron.com", "andrew.fastow@enron.com"],

         "X-cc@[ADMIN|exec]": "Jeff Skilling ,\n Andrew S Fastow ",

         "To@[ADMIN|exec]": ["tim.despain@enron.com"],

         "parts":

          [

           {

            "content@[ADMIN|exec]": "Ken said \"Tim - I hope this works ...",

            "contentType": "text/plain"

           }

          ],

         "Mime-Version": "1.0",

         "X-From@[ADMIN|exec]": "Kenneth Lay",

         "Date": {"$date": 988649940000},

         "X-To@[ADMIN|exec]": "Tim DeSpain ",

         "Message-ID": "",

         "Content-Type": "text/plain; charset=us-ascii",

         "Subject@[ADMIN|exec]": "Re: Gerald Smith"

        }

1.  Load the tagged data into Sqrrl with the same tool used in the previous exercise.

        $ cd ~/sqrrl-client-1.5.0/java/bin

        $ ./client-utils json -d enron_restricted -u test -p test -s localhost -f ~/training_data/enron.mbox.restricted.json

2.  Start the Sqrrl shell as the same user you've been using all along (username: test, password: test). Everything should look the same as when using the unrestricted dataset. This is because the 'test' user has the `ADMIN` visibility.

        $ sqrrl shell -u test -p test -s localhost

        sqrrl:test@localhost> dataset enron_restricted

        sqrrl:test@localhost enron_restricted>

3.  Validate that you have the `ADMIN` visibility with the `visibilities` shell command.

        sqrrl:test@localhost enron_restricted> visibilities

        No visibilities set; user has full server-configured visibility: [ADMIN]

        sqrrl:test@localhost enron_restricted>

4.  Query a restricted email record while possessing the `ADMIN` visibility.

        sqrrl:test@localhost enron_restricted> select json() where path('Message-ID')=''

        +------------------------------------------------------------------------------+

        |json()                                    |

        +------------------------------------------------------------------------------+

        | +- Bcc@[ADMIN|exec][]                            |

        | |  +- "jeff.skilling@enron.com"                       |

        | |  +- "andrew.fastow@enron.com"                       |

        | +- Cc@[ADMIN|exec][]                             |

        | |  +- "jeff.skilling@enron.com"                       |

        | |  +- "andrew.fastow@enron.com"                       |

        | +- Content-Transfer-Encoding: "7bit"                     |

        | +- Content-Type: "text/plain; charset=us-ascii"               |

        | +- Date                                   |

        | |  +- $date: 988649940000                          |

        | +- From@[ADMIN|exec]: "kenneth.lay@enron.com"                |

        | +- Message-ID: ""         |

        | +- Mime-Version: "1.0"                            |

        | +- Subject@[ADMIN|exec]: "Re: Gerald Smith"                 |

        | +- To@[ADMIN|exec][]                             |

        | |  +- "tim.despain@enron.com"                        |

        | +- X-From@[ADMIN|exec]: "Kenneth Lay"                    |

        | +- X-To@[ADMIN|exec]: "Tim DeSpain "        |

        | +- X-bcc@[ADMIN|exec]: ""                          |

        | +- X-cc@[ADMIN|exec]: "Jeff Skilling ,\n Andr|

        |ew S Fastow "                 |

        | +- parts[]                                  |

        |   +- [0]                                  |

        |     +- content@[ADMIN|exec]: "Ken said \"Tim – I hope this works out\".\n|

        |       ...                               |

        |     +- contentType: "text/plain"                     |

        +------------------------------------------------------------------------------+

5.  Use this query to get another view of the same effect. (The "–strip-visibilities" at the end of the command causes Sqrrl to not treat the visibility label as part of the cell's path when selecting and displaying results. This makes the query syntax simpler in this case.)

        sqrrl:test@localhost enron_restricted> select json('From'), json('To'), json('Bcc') where path('Message-ID')='' --strip-visibilities

        +----------------------------------------------------------------------------+

        |json('From')       json('To')        json('Bcc')       |

        +-------------------------+------------------------+-------------------------+

        | +- From: "kenneth.lay@en| +- To[]        | +- Bcc[]        |

        |ron.com"         |   +- "tim.despain@enr|   +- "jeff.skilling@en|

        |             |on.com"         |ron.com"         |

        |             |            |   +- "andrew.fastow@en|

        |             |            |ron.com"         |

        +-------------------------+------------------------+-------------------------+

        sqrrl:test@localhost enron_restricted>

6.  Query a restricted email record without using the `ADMIN` visibility by using the `visibilities` shell command to temporarily not include the 'admin' visibilities in queries. Note that the command ends with two single-quotes in a row, not a double-quote!

        sqrrl:test@localhost enron_restricted> visibilities ''

        Set visibilities to [None].

        sqrrl:test@localhost enron_restricted> select json() where path('Message-ID')=''

        +------------------------------------------------------------------------------+

        |json()                                    |

        +------------------------------------------------------------------------------+

        | +- Content-Transfer-Encoding: "7bit"                     |

        | +- Content-Type: "text/plain; charset=us-ascii"               |

        | +- Date                                   |

        | |  +- $date: 988649940000                          |

        | +- Message-ID: ""         |

        | +- Mime-Version: "1.0"                            |

        | +- parts[]                                  |

        |   +- [0]                                  |

        |     +- contentType: "text/plain"                     |

        +------------------------------------------------------------------------------+

7.  Exit the shell and then try logging in as the users 'exec' (password 'exec') and 'staff' (password 'staff'), checking or removing their visibility labels, and verifying that you receive the expected results when querying email messages sent by Kenneth Lay.

## Exercise 7: Graph Construction

#### Goal: Introduce the concepts of graph data models and the Transformer interface.

**Summary:** Load another copy of the Enron email JSON data, this time via the Sqrrl shell, and utilizing Sqrrl's Graph features (i.e. nodes and edges). Run a Breadth-First Search using Enron CEO Kenneth Lay as the root, and visualize the results.

1.  First, enter the Sqrrl shell as before:

        $ sqrrl shell -u test -p test -s localhost

        sqrrl:test@localhost>

2.  Create a new 'enronGraph' dataset with 2 partitions and term indexing on:

        sqrrl:test@localhost> create enronGraph -n 2 -i +TERMS

        Created dataset enronGraph

        sqrrl:test@localhost enronGraph>

3.  Exit the Sqrrl shell. Go to the 'training_data' directory. Sudo to the HDFS user. Create a staging directory within Hadoop HDFS to use for bulk loading. As the Sqrrl user, upload the Enron email file to HDFS.

        sqrrl$ sudo su – hdfs

        [sudo] password for sqrrl: sqrrl

        hdfs$ hadoop fs -mkdir -p /tmp/load

        hdfs$ hadoop fs -chown sqrrl:sqrrl /tmp/load

        hdfs$ exit

        sqrrl$ cd ~/training_data/

        sqrrl$ hadoop fs -put enron.mbox.json /tmp/load

4.  Enter the Sqrrl shell. Load the file of Enron email into the 'enronGraph' dataset in Sqrrl with the following commands:

        $ sqrrl shell -u test -p test -s localhost

        sqrrl:test@localhost> dataset enronGraph

        sqrrl:test@localhost enronGraph> startload --json /tmp/load/enron.mbox.json --transformer com.sqrrl.samples.transformers.EnronJsonTransformer -lp /var/lib/sqrrl/lib/sqrrl-samples-transformers-1.0.0.jar -w --do-updates

        Started load: job_1404323478660_0001

        [Press any key to return to prompt.]

        job_1404323478660_0001 : LOAD_SUCCEEDED : 100.0%

        Load 'job_1404323478660_0001' is complete.

        job_1404323478660_0001 : {

         user:   test

         state:   LOAD_SUCCEEDED

         start:   2014-07-02T17:58:04.494+0000

         progress: 100.0%

         finish:  2014-07-02T18:03:57.428+0000

         successes: 41299

         failures: 0

         options:  {

          dataset:   enronGraph

          input:    /tmp/load/enron.mbox.json

          MIME type:  application/json

          transformer: com.sqrrl.samples.transformers.EnronJsonTransformer

         }

        }

        sqrrl:test@localhost enronGraph>

Data loaded via the Sqrrl shell must be present in an HDFS staging directory. Here, we have invoked the `startload` command to initiate a bulk ingest job using JSON and a custom Transformer class that we have provided for you. We ensure that this class is on Sqrrl's classpath by using the `‑lp` option. This class emits both emails and people as Nodes within the graph, as well as Edges indicating sender/receiver relationships. This command will take a few minutes. You can visit the Hadoop YARN Web UI to track its progress at `http://localhost:8088/cluster`.

1.  Using a browser on your host operating system, visit the Sqrrl reference application at http://localhost:3000, and click on the "Gather" tab at the top right of the screen.

2.  Click on "Document" to the left of the search box to change the app to "Link" mode. Click the blue gear icon to the right of the search box and enter the 'enronGraph' dataset. Click "Gather" to bring in a random set of emails, senders, and recipients. You can right click on any node representing an email message (named "email-XXXXX") and select "Info" to see the data for that email message.

3.  Conduct a search for emails related to the JEDI project at Enron. Select "Document" mode to the left of the search box. In the search box, enter the query `lucene('JEDI')`, and hit "Gather". Right click any of the resulting nodes and select "Info" to view more detail.

4.  Use Sqrrl's breadth-first search capability to analyze the Enron email data and record each person's distance from the `chairman.ken@enron.com` email address.

        sqrrl:test@localhost enronGraph> bfs --results-dataset enronGraph -md 10 -s chairman.ken@enron.com -l to,cc,bcc

        Started BFS: BfsJob_127.0.0.1_e413a2c1-0ebf-482d-bdbc-12edf70c7583

        sqrrl:test@localhost enronGraph>

5.  Use the `checkbfs` command to inspect the status of the bfs job. When complete, validate the data elements using `edgeschemacounts`.

        sqrrl:test@localhost enronGraph > checkbfs BfsJob_127.0.0.1_e413a2c1-0ebf-482d-bdbc-12edf70c7583

        Checking on bfs: BfsJob_127.0.0.1_e413a2c1-0ebf-482d-bdbc-12edf70c7583

        BfsJob_127.0.0.1_e413a2c1-0ebf-482d-bdbc-12edf70c7583 : BFS_RUNNING : Depth : 2

        sqrrl:test@localhost enronGraph > checkbfs BfsJob_127.0.0.1_e413a2c1-0ebf-482d-bdbc-12edf70c7583

        Checking on bfs: BfsJob_127.0.0.1_e413a2c1-0ebf-482d-bdbc-12edf70c7583 BfsJob_127.0.0.1_e413a2c1-0ebf-482d-bdbc-12edf70c7583 : BFS_SUCCEEDED : Depth : 6

        sqrrl:test@localhost enronGraph > edgeschemacounts

        bcc:    46,181

        cc:    46,181

        composed: 41,299

        received: 432,852

        to:    387,628

6.  Using a browser on your host operating system, visit the Sqrrl reference application at `http://localhost:3000`, and click on the "Gather" tab at the top right of the screen.

7.  Click the blue gear icon to the right of the search box and enter the 'enronGraph' dataset.

8.  Enter `path('bfs/chairman.ken@enron.com/dist') between 1  and  3` into the text box and hit Enter. The UI displays all email addresses that are 3 hops or less away from chairman.ken@enron.com. You can right-click on an email address and choose "Expand all neighbors" to add nodes representing the emails sent and received by an email address and the other email addresses directly connected to the email address you right clicked on.

## Other Information About the VM

*   The VM has the following software installed

    *   Sqrrl Enterprise 1.5.0
    *   Accumulo 1.6.0-sqrrl7
    *   ZooKeeper 3.4.5
    *   Hadoop 2.4.0
    *   Java Development Kit 1.7.0 update 45
*   `/usr/lib/hadoop/bin`, `/usr/lib/accumulo/bin`, and `/usr/lib/sqrrl/bin` are on the shell path for the sqrrl user

*   The following directory locations may be useful to you if you wish to explore the contents of the VM further:

    *   `HADOOP_HOME` -> `/usr/lib/hadoop`
    *   `HADOOP_CONF` -> `/etc/hadoop/conf`
    *   `ZOOKEEPER_HOME` -> `/usr/lib/zookeeper`
    *   `ACCUMULO_HOME` -> `/usr/lib/accumulo`
    *   `SQRRL_HOME` -> `/usr/lib/sqrrl`
*   The Sqrrl Thrift API is available for review at `/var/lib/sqrrl/sqrrl-client-1.5.0/thrift/SqrrlServer.thrift`
