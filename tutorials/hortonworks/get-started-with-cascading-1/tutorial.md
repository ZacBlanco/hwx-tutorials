This tutorial will enable you, as a Java developer, to learn the following:

*   Introduce you to [Hortonworks Data Platform 2.1](http://hortonworks.com/hdp) on [Hortonworks Sandbox](http://hortonworks.com/products/sandbox), a single-node cluster
*   Introduce you to Java Cascading SDK
*   Examine the WordCount program in Java
*   Build the single unit of execution, the jar file, using the gradle build tool
*   Deploy the jar file onto to the Sandbox
*   Examine the resulting MapReduce Jobs
*   View at the output stored as an HDSF file.

To start this tutorial, you must do two things: First, download the Sandbox and follow the installation instructions. Second, download the Cascading SDK.

The example WordCount is derived from part 2 of the Cascading [Impatient Series](http://docs.cascading.org/impatient/).

#### Downloading and installing the HDP 2.1 Sandbox

1.  [Download and install HDP 2.1 Sandbox](http://hortonworks.com/products/hortonworks-sandbox/#install).
2.  Familiarize yourself with the navigation on the Linux virtual host through a shell window.
3.  Login into your Linux Sandbox and create a user **cascade**. You can do this with the following command:


    useradd cascade


#### Git Clone Cascading example and Build it


First do `su cascade` to login as cascade user


1.  [Download and install gradle-1.1](http://www.gradle.org/downloads) onto the Linux sandbox.

    
    cd ~
    wget https://services.gradle.org/distributions/gradle-1.9-bin.zip
    unzip gradle-1.9-bin.zip
    chmod +x gradle-1.9/bin/gradle
    
    
2.  Next,  `cd ~`
3.  `git clone git://github.com/Cascading/Impatient.git`
4.  `cd /home/cascade/Impatient/part2`
5.  `~/gradle-1.9/bin/gradle clean jar` (this builds the impatient.jar file, which is your wordcount unit of execution)

#### Deploying and running the Cascading Java application

Now you’re ready to run and deploy your impatient.jar file onto the cluster.


    cd /home/cascade/Impatient/part2
    hadoop fs -mkdir -p /user/cascade/data/
    hadoop fs -copyFromLocal data/rain.txt /user/cascade/data/
    hadoop jar ./build/libs/impatient.jar data/rain.txt output/wc


This command will produce the following output:

![Screen Shot 2014-04-20 at 4.27.45 PM](/assets/2-1/cascading/Screen-Shot-2014-04-20-at-4.27.45-PM.png)

### Tracking the MapReduce Jobs on Sandbox

Once the job is submitted (or running) you can actually track its progress from the Sandbox Hue’s Job Browser. By default, it will display all jobs run by the user **hue**; filter by the user **cascade.**

![Screen Shot 2014-04-18 at 4.17.04 PM](/assets/2-1/cascading/Screen-Shot-2014-04-18-at-4.17.04-PM1.png)

Double click on any links to see job details.

![Screen Shot 2014-04-19 at 11.12.09 AM](/assets/2-1/cascading/Screen-Shot-2014-04-19-at-11.12.09-AM.png)

### Viewing the WordCount Output

When the job is finished, the word counts are written as an HDFS file **part-00000**. Use the Sandbox Hue’s File Browser to navigate to the HDFS directory and view its contents.

![Screen Shot 2014-04-19 at 11.02.53 AM](/assets/2-1/cascading/Screen-Shot-2014-04-19-at-11.02.53-AM.png)

### Above and Beyond

For the adventurous, you can try the entire [Impatient Series](http://docs.cascading.org/impatient/), after you have downloaded the sources from the github. Beyond the Impatient series, there’re other [tutorials](http://www.cascading.org/documentation/tutorials/) and case examples to play with.

Have Fun!