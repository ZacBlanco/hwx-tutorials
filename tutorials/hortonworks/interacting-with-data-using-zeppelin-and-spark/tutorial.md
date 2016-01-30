In this section we are going to walk through the process of using Apache Zeppelin and Apache Spark to interactively analyze data on a Apache Hadoop Cluster.

By the end of this tutorial, you will have learned:

1.  How to interact with Apache Spark from Apache Zeppelin
2.  How to read a text file from HDFS and create a RDD
3.  How to interactively analyze a data set through a rich set of Spark API operations

### [](#getting-started)Getting started

First we have to ensure that **spark** and **zeppelin** are running.

![](/assets/interacting-with-data-using-zeppelin-and-spark/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713864304a50596931345456524c536c553f7261773d74727565.png)

**Zeppelin** runs on port 9995: [http://localhost:9995](http://localhost:9995)

![](/assets/interacting-with-data-using-zeppelin-and-spark/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138566b3556614731434f5756694e56553f7261773d74727565.png)

Click on Notebook and create a new note.

![](/assets/interacting-with-data-using-zeppelin-and-spark/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138595578794e6b633061336b3061306b3f7261773d74727565.png)  
![](/assets/interacting-with-data-using-zeppelin-and-spark/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138527a4935516b52464f465a535657383f7261773d74727565.png)

You can use the Shell Interpreter by adding `%sh` at the beginning.

Next, let’s save `littlelog.csv` in our local sandbox `/tmp` directory and upload it to the HFDS `/tmp` directory



%sh #Save csv file in /tmp directory wget --no-check-certificate 'https://docs.google.com/uc?export=download&id=0BzhlOywnOpq8OWFzQjJObUtlck0'  -O /tmp/littlelog.csv # CLEANUP HDFS directory hadoop fs -rm /tmp/littlelog.csv #Copy to HDFS directory /tmp hadoop fs -put /tmp/littlelog.csv /tmp/



![](/assets/interacting-with-data-using-zeppelin-and-spark/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138596c5a6f613039705a306c56626a673f7261773d74727565.png)

Open the HDFS Files view and navigate to `/tmp` to verify that `littlelog.csv` has been uploaded correctly.

![](/assets/interacting-with-data-using-zeppelin-and-spark/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713855306c6164455268527a644d6155453f7261773d74727565.png)

In Spark, datasets are represented as a list of entries, where the list is broken up into many different partitions that are each stored on a different machine. Each partition holds a unique subset of the entries in the list. Spark calls datasets that it stores **Resilient Distributed Datasets** (RDDs).

So let’s create a RDD from our littlelog.csv:



val  file  = sc.textFile("hdfs://sandbox.hortonworks.com:8020/tmp/littlelog.csv")



![](/assets/interacting-with-data-using-zeppelin-and-spark/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138513142794e5652336254524851556b3f7261773d74727565.png)

Now we have a freshly created RDD. We have to use an action operation like collect() to gather up the data into the drivers memory and then to print out the contents of the file:



file.collect().foreach(println)



![](/assets/interacting-with-data-using-zeppelin-and-spark/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071385a32354c4c546c4f59305131616c453f7261773d74727565.png)

Remember doing a `collect()` action operation on a very large distributed RDD can cause your driver program to run out of memory and crash. So, **do not use collect()** except for when you are prototyping your Spark program on a small dataset.

Another way to print the content of the RDD is



file.toArray.foreach(println)



![](/assets/interacting-with-data-using-zeppelin-and-spark/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071385a3170754d48466b4d546c4c55306b3f7261773d74727565.png)

In fact you can easily discover other methods that apply to this RDD by auto-completion.

Type the name of the RDD followed by a `.`, in our case it’s `file`. and then press the `crtl` + `-` + `.`

![](/assets/interacting-with-data-using-zeppelin-and-spark/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071384e6c644a63484a5a563159785654413f7261773d74727565.png)

Now let’s extract some information from this data.

Let’s create a map where the **state** is the key and the **number of visitors** is the value.

Since state is the 6th element in each row of our text in littlelog.csv _(index 5)_, we need to use a map operator to pass in the lines of text to a function that will parse out the 6th element and store it in a new RDD containing two elements as the key, then count the number of times it appears in the set and provide that number as the value in the second element of this new RDD.

By using the Spark API operator `map`, we have created or transformed our original RDD into a newer one.

So let’s do it step by step. First let’s filter out the blank lines.



val  fltr  = file.filter(_.length >  0)



![](/assets/interacting-with-data-using-zeppelin-and-spark/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071385a32354c4c546c4f59305131616c453f7261773d74727565.png)

WAIT!* What is that doing there? *

`_` is a shortcut or wildcard in Scala that essentially means ‘whatever happens to be passed to me’.

You can also write:



val  fltr  = file.filter(x => x.length >  0)



So, in the above code the `_` or the `x` stands **for each row of our file** RDD: if the row length > 0 is, hence not empty, then assign it to fltr which is a new RDD.

So, we are invoking the method length on an unknown **whatever** and trusting that Scala will figure out that the thing in each row of the file RDD is actually a **String that supports the length** operator.

In other words within the parenthesis of our filter method we are defining the argument: ‘whatever’, and the logic to be applied to it.

This pattern of constructing a function within the argument to a method is one of the **fundamental characteristics** of Scala and once you get used to it, it will make sense and speed up your programming a lot.

Then let’s split the line into individual columns seperated by `,` and then let’s grab the 6th columns, which means the column with index 5.



val  keys  = fltr.map(_.split(",")).map(a => a(5))



##### [](#lets-illustrate-the-query-above-with-an-example)Let’s illustrate the query above with an example:

This is a row of the littlelog.csv file:

    20120315 01:17:06,99.122.210.248,[http://www.acme.com/SH55126545/VD55170364,{7AAB8415-E803-3C5D-7100-E362D7F67CA7},homestead,fl,usa](http://www.acme.com/SH55126545/VD55170364,{7AAB8415-E803-3C5D-7100-E362D7F67CA7},homestead,fl,usa)

if we execute the query, first, **each row** of the fltr RDD is having the `split(“,”)` method called on it.  
It will seperate all columns with a `,` between them.

    [ 
      20120315 01:17:06,
      99.122.210.248,
      [http://www.acme.com/SH55126545/VD55170364,
      {7AAB8415-E803-3C5D-7100-E362D7F67CA7},
      homestead,
      fl,
      usa](http://www.acme.com/SH55126545/VD55170364,
      {7AAB8415-E803-3C5D-7100-E362D7F67CA7},
      homestead,
      fl,
      usa)
    ]

This split function results in an anonymous RDD consisting of arrays like the one above.

The anonymous RDD is passed to the map function.

In this case, each array in the anonymous RDD is assigned to the variable ‘a’.

Then we extract the 6th element from it, which ends up being added to the named RDD called **‘keys’** we declared at the start of the line of code.

![](/assets/interacting-with-data-using-zeppelin-and-spark/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138566c42694e3342594d5642505454513f7261773d74727565.png)

Then let’s print out the values of the key.



keys.collect().foreach(println)



![](/assets/interacting-with-data-using-zeppelin-and-spark/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f7071384f565a505a5331306344566a4f474d3f7261773d74727565.png)

Notice that some of the states are not unique and repeat. We need to count how many times each key (state) appears in the log.



val  stateCnt  = keys.map(key =>  (key,1))  //print stateCnt stateCnt.toArray.foreach(println)



![](/assets/interacting-with-data-using-zeppelin-and-spark/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138626c4253536a6469654655794c566b3f7261773d74727565.png)

You can see, how our new RDD stateCnt looks like.`RDD[(String,  Int)]`.  
The String is our key and the Integer is 1\.

Next, we will iterate through each row of the stateCnt RDD and pass their contents to a utility method available to our RDD that counts the distinct number of rows containing each key



val  lastMap  = stateCnt.countByKey



![](/assets/interacting-with-data-using-zeppelin-and-spark/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713856556c594d306431656e684d4c574d3f7261773d74727565.png)

Now, let’s print out the result.



lastMap.foreach(println)



Result: a listing of state abbreviations and the count of how many times visitors from that state hit our website.

![](/assets/interacting-with-data-using-zeppelin-and-spark/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f70713862484e305a445656626b3545516a513f7261773d74727565.png)

Note that at this point you still have access to all the RDDs you have created during this session. You can reprocess any one of them, for instance, again printing out the values contained in the keys RDD:



keys.collect().foreach(println)



![](/assets/interacting-with-data-using-zeppelin-and-spark/68747470733a2f2f7777772e676f6f676c6564726976652e636f6d2f686f73742f30427a686c4f79776e4f707138626d6456566e4e754d5559334e484d3f7261773d74727565.png)

I hope this has proved informative and that you have enjoyed this simple example of how you can interact with Data on HDP using Scala and Apache Spark.  