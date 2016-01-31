### [](#introduction-1)Introduction

H2O is the open source in memory solution from 0xdata for predictive analytics on big data. It is a math and machine learning engine that brings distribution and parallelism to powerful algorithms that enable you to make better predictions and more accurate models faster. With familiar APIs like R and JSON, as well as common storage method of using HDFS, H2O can bring the ability to do advance analyses to a broader audience of users. With an almost nonexistent learning curve for current Hadoop users, the following tutorial serves as a way to streamline the initial setup of H2O on Hortonworks Sandbox.

This video shows each step in a quick video. Follow the details below for the step by step instructions.

<iframe src="//www.youtube.com/embed/07S8E3uW43M" height="315" width="560" allowfullscreen="" frameborder="0" id="player0"></iframe>

### [](#prerequisites)Prerequisites:

*   [Hortonworks Sandbox](http://hortonworks.com/sandbox)

### [](#overview)Overview

List the main steps needed to perform the procedure:

1.  Download the current release of [H2O](http://0xdata.com/downloadtable/)
2.  Launch H2O
3.  Run Analyses

Boot Hortonworks Sandbox from VM. After which log in by hitting or use a terminal and ssh to root@127.0.0.1 -p 2222  
[![Hortonworks VM](http://github.com/amywang718/testRepo/raw/master/01StartHW.png)](http://github.com/amywang718/testRepo/blob/master/01StartHW.png)

Copy H2O zip file to Hadoop node, wherever you intend to run Hadoop commands :

    $ scp -P 2222 h2o-[version].zip root@127.0.0.1:
    root@127.0.0.1's password: hadoop

[![Copy downloaded zip file](http://github.com/amywang718/testRepo/raw/master/02CopyH2O.png)](http://github.com/amywang718/testRepo/blob/master/02CopyH2O.png)

Or

Securely tunnel into the VM and run the command wget

    ssh root@127.0.0.1 -p 2222
    root@127.0.0.1's password: hadoop
    Last login: Tue Jun 24 15:48:05 2014 from 10.0.2.2
    [root@sandbox ~]# wget http://s3.amazonaws.com/h2o-release/h2o/rel-kolmogorov/3/h2o-2.4.4.3.zip 

[![Download zip file](http://github.com/amywang718/testRepo/raw/master/02DownloadH2O.png)](http://github.com/amywang718/testRepo/blob/master/02DownloadH2O.png)

The next step is to launch H2O in the Hadoop node.

Unzip the H2O file, cd to h2o-[version]/hadoop/ and run the following command (that’ll launch one Hadoop node of size 1gb each as mapper tasks in Hadoop) :

    $ hadoop jar h2odriver_hdp2.1.jar water.hadoop.h2odriver -libjars ../h2o.jar -mapperXmx 1g -nodes 1 -output hdfsOutputDirName

Access the H2O embedded browser by going to any of the H2O nodes launched. Find the callback IP address H2O instance launched on and depending on the network settings pick the appropriate one to navigate to to find H2O’s web interface. For example, if the VM is launched with Virtualbox Host-Only Ethernet Adapter H2O’s web GUI is available at 192.168.56.102 and port 54321.  

[![Networking](http://github.com/amywang718/testRepo/raw/master/03Network.png)](http://github.com/amywang718/testRepo/blob/master/03Network.png)

[![H2O Home Page](http://github.com/amywang718/testRepo/raw/master/03Page.png)](http://github.com/amywang718/testRepo/blob/master/03Page.png)

H2O is launched as a JVM on the Hadoop cluster, and the job is tracked in Hortonworks Sandbox Job Browser: 127.0.0.1:8000/jobbrowser  

[![Job Tracker](http://github.com/amywang718/testRepo/raw/master/04JobTracker.png)](http://github.com/amywang718/testRepo/blob/master/04JobTracker.png)

Locate the data file you want to run regressions on in Hortonworks Sandbox after uploading the file from disk or after having played around with the dataset in hive or pig.  

[![HDFS Catalog](http://github.com/amywang718/testRepo/raw/master/05HDFS.png)](http://github.com/amywang718/testRepo/blob/master/05HDFS.png)

Import dataset in H2O browser from HDFS and start creating models with H2O’s available features including GLM, K-Means, and Random Forest to start with.  

[![Navigate to data](http://github.com/amywang718/testRepo/raw/master/06DataTab.png)](http://github.com/amywang718/testRepo/blob/master/06DataTab.png)

[![Import Page](http://github.com/amywang718/testRepo/raw/master/06ImportPage.png)](http://github.com/amywang718/testRepo/blob/master/06ImportPage.png)

More H2O related tutorials and information are available at H2O current releases’ accompanying [documentation](http://h2o-release.s3.amazonaws.com/h2o/rel-jordan/3/index.html). Specifically there is more H2O on Hadoop documentation as well as walk through tutorials for most of the features available (GLM, K-Means, Random Forest, PCA, and GBM).