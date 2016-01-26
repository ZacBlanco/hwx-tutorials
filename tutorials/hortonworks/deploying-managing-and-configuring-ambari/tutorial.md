### Overview

Apache Ambari is a completely open operational framework for provisioning, managing and monitoring Apache Hadoop clusters. Ambari includes an intuitive collection of operator tools and a set of APIs that mask the complexity of Hadoop, simplifying the operation of clusters.

In this tutorial, we will walk through the some of the key aspects of deploying, managing and configuring a HDP 2.2 cluster with Ambari.

### Prerequisites

*   [Hortonworks Sandbox](/assetsdeploying-managing-and-configuring-ambari/sandbox)

### Deployment

Deploying various components like HDFS, Mapreduce, YARN, Tez, Nagios, Ganglia, Hive, HBase, Pig, Sqoop, Oozie, ZooKeeper, Falcon, Slider, Storm and Flume in a distributed topology can be made much simpler with Ambari.

![](/assetsdeploying-managing-and-configuring-ambari/vagrant_25.jpg)

We have a complete walkthrough of deploying a cluster with Ambari in another tutorial titled [Introducing Apache Ambari for deploying and managing Apache Hadoop](/assetsdeploying-managing-and-configuring-ambari/).

### Configuring the Capacity Scheduler

For rest of the tutorial we will use the Ambari hosted on the [Hortonworks Sandbox](/assetsdeploying-managing-and-configuring-ambari/sandbox).

After you spin up the Hortonworks Sandbox, login to Ambari. The default username and password is ``.  
![](/assetsdeploying-managing-and-configuring-ambari/ambari001.png)

After you Login, you will see the Dashboard. This is an unified view of the state of your cluster.

![](/assetsdeploying-managing-and-configuring-ambari/ambari002.png)

You can drill into specify service dashboard and configuration.

![](/assetsdeploying-managing-and-configuring-ambari/ambari003.png)

Let’s dive into YARN dashboard by selecting Yarn from the left-side bar or the drop down menu.

![](/assetsdeploying-managing-and-configuring-ambari/ambari004.png)

We will start updating the configuration for Yarn Capacity Scheduling policies.

![](/assetsdeploying-managing-and-configuring-ambari/ambari005.png)

Scroll down to the `` section of the page. The default capacity scheduling policy just has one queue.

![](/assetsdeploying-managing-and-configuring-ambari/ambari006.png)

Let check out the scheduling policy visually. Scroll up to the top of the page and click on quick links. Then select ResourceManager UI from the dropdown.

![](/assetsdeploying-managing-and-configuring-ambari/ambari007.png)

As you can see below we just have the default policy.

![](/assetsdeploying-managing-and-configuring-ambari/ambari008.png)

Let’s change the capacity scheduling policy to where we have seperate queues and policies for Engineering, Marketing and Support departments:

    yarn.scheduler.capacity.maximum-am-resource-percent=0.2
    yarn.scheduler.capacity.maximum-applications=10000
    yarn.scheduler.capacity.node-locality-delay=40
    yarn.scheduler.capacity.root.Engineering.Development.acl_administer_jobs=*
    yarn.scheduler.capacity.root.Engineering.Development.acl_administer_queue=*
    yarn.scheduler.capacity.root.Engineering.Development.acl_submit_applications=*
    yarn.scheduler.capacity.root.Engineering.Development.capacity=20
    yarn.scheduler.capacity.root.Engineering.Development.minimumaximum-capacity=100
    yarn.scheduler.capacity.root.Engineering.Development.state=RUNNING
    yarn.scheduler.capacity.root.Engineering.Development.user-limit-factor=1
    yarn.scheduler.capacity.root.Engineering.QE.acl_administer_jobs=*
    yarn.scheduler.capacity.root.Engineering.QE.acl_administer_queue=*
    yarn.scheduler.capacity.root.Engineering.QE.acl_submit_applications=*
    yarn.scheduler.capacity.root.Engineering.QE.capacity=80
    yarn.scheduler.capacity.root.Engineering.QE.maximum-capacity=90
    yarn.scheduler.capacity.root.Engineering.QE.state=RUNNING
    yarn.scheduler.capacity.root.Engineering.QE.user-limit-factor=1
    yarn.scheduler.capacity.root.Engineering.acl_administer_jobs=*
    yarn.scheduler.capacity.root.Engineering.acl_administer_queue=*
    yarn.scheduler.capacity.root.Engineering.acl_submit_applications=*
    yarn.scheduler.capacity.root.Engineering.capacity=60
    yarn.scheduler.capacity.root.Engineering.maximum-capacity=100
    yarn.scheduler.capacity.root.Engineering.queues=Development,QE
    yarn.scheduler.capacity.root.Engineering.state=RUNNING
    yarn.scheduler.capacity.root.Engineering.user-limit-factor=1
    yarn.scheduler.capacity.root.Marketing.Advertising.acl_administer_jobs=*
    yarn.scheduler.capacity.root.Marketing.Advertising.acl_administer_queue=*
    yarn.scheduler.capacity.root.Marketing.Advertising.acl_submit_applications=*
    yarn.scheduler.capacity.root.Marketing.Advertising.capacity=30
    yarn.scheduler.capacity.root.Marketing.Advertising.maximum-capacity=40
    yarn.scheduler.capacity.root.Marketing.Advertising.state=STOPPED
    yarn.scheduler.capacity.root.Marketing.Advertising.user-limit-factor=1
    yarn.scheduler.capacity.root.Marketing.Sales.acl_administer_jobs=*
    yarn.scheduler.capacity.root.Marketing.Sales.acl_administer_queue=*
    yarn.scheduler.capacity.root.Marketing.Sales.acl_submit_applications=*
    yarn.scheduler.capacity.root.Marketing.Sales.capacity=70
    yarn.scheduler.capacity.root.Marketing.Sales.maximum-capacity=80
    yarn.scheduler.capacity.root.Marketing.Sales.minimum-user-limit-percent=20
    yarn.scheduler.capacity.root.Marketing.Sales.state=RUNNING
    yarn.scheduler.capacity.root.Marketing.Sales.user-limit-factor=1
    yarn.scheduler.capacity.root.Marketing.acl_administer_jobs=*
    yarn.scheduler.capacity.root.Marketing.acl_submit_applications=*
    yarn.scheduler.capacity.root.Marketing.capacity=10
    yarn.scheduler.capacity.root.Marketing.maximum-capacity=40
    yarn.scheduler.capacity.root.Marketing.queues=Sales,Advertising
    yarn.scheduler.capacity.root.Marketing.state=RUNNING
    yarn.scheduler.capacity.root.Marketing.user-limit-factor=1
    yarn.scheduler.capacity.root.Support.Services.acl_administer_jobs=*
    yarn.scheduler.capacity.root.Support.Services.acl_administer_queue=*
    yarn.scheduler.capacity.root.Support.Services.acl_submit_applications=*
    yarn.scheduler.capacity.root.Support.Services.capacity=80
    yarn.scheduler.capacity.root.Support.Services.maximum-capacity=100
    yarn.scheduler.capacity.root.Support.Services.minimum-user-limit-percent=20
    yarn.scheduler.capacity.root.Support.Services.state=RUNNING
    yarn.scheduler.capacity.root.Support.Services.user-limit-factor=1
    yarn.scheduler.capacity.root.Support.Training.acl_administer_jobs=*
    yarn.scheduler.capacity.root.Support.Training.acl_administer_queue=*
    yarn.scheduler.capacity.root.Support.Training.acl_submit_applications=*
    yarn.scheduler.capacity.root.Support.Training.capacity=20
    yarn.scheduler.capacity.root.Support.Training.maximum-capacity=60
    yarn.scheduler.capacity.root.Support.Training.state=RUNNING
    yarn.scheduler.capacity.root.Support.Training.user-limit-factor=1
    yarn.scheduler.capacity.root.Support.acl_administer_jobs=*
    yarn.scheduler.capacity.root.Support.acl_administer_queue=*
    yarn.scheduler.capacity.root.Support.acl_submit_applications=*
    yarn.scheduler.capacity.root.Support.capacity=30
    yarn.scheduler.capacity.root.Support.maximum-capacity=100
    yarn.scheduler.capacity.root.Support.queues=Training,Services
    yarn.scheduler.capacity.root.Support.state=RUNNING
    yarn.scheduler.capacity.root.Support.user-limit-factor=1
    yarn.scheduler.capacity.root.acl_administer_queue=*
    yarn.scheduler.capacity.root.capacity=100
    yarn.scheduler.capacity.root.queues=Support,Marketing,Engineering
    yarn.scheduler.capacity.root.unfunded.capacity=50

Copy and paste the above policy in the `` textbox:

![](/assetsdeploying-managing-and-configuring-ambari/ambari006.png)

Click `` and confirm on the dialog box:

![](/assetsdeploying-managing-and-configuring-ambari/ambari009.png)

At this point the, the configuration is saved but we still need to restart the affected components by the configuration change as indicated in the orange band below:

![](/assetsdeploying-managing-and-configuring-ambari/ambari010.png)

Also note that there is now a new version of the configuration as indicated by the green ``.

![](/assetsdeploying-managing-and-configuring-ambari/ambari011.png)

Wait for the restart to complete:

![](/assetsdeploying-managing-and-configuring-ambari/ambari013.png)

and then goto the browser tab with the Capacity Scheduler policy and refresh the page. Voila! There’s our new policy:

![](/assetsdeploying-managing-and-configuring-ambari/ambari015.png)

### Versioning Configuration

Now if we want to revert to ``:

![](/assetsdeploying-managing-and-configuring-ambari/ambari010.png)

On the confirmation dialog, enter why you are trying to revert back in the notes section before confirming:

![](/assetsdeploying-managing-and-configuring-ambari/ambari016.png)

Now you will notice, we have new configuration version ``:

![](/assetsdeploying-managing-and-configuring-ambari/ambari017.png)

We will need to restart as before to ensure this version takes effect:

![](/assetsdeploying-managing-and-configuring-ambari/ambari018.png)

Let’s recheck to see if our configuration has indeed reverted back:

![](/assetsdeploying-managing-and-configuring-ambari/ambari019.png)

### Comparing versions of the configuration:

Now there are often situations, where it is difficult to figure out the difference between two versions of the configuration.

Let’s change the `` property at the top of the Yarn settings page:  
![](/assetsdeploying-managing-and-configuring-ambari/ambari020.png)

to ``:

![](/assetsdeploying-managing-and-configuring-ambari/ambari023.png)

Once we save the changes we will have to restart the services:

![](/assetsdeploying-managing-and-configuring-ambari/ambari024.png)

Now select the versioning icon from the corner and select the version you want to compare with. In our case we will compare with the previous version:  
![](/assetsdeploying-managing-and-configuring-ambari/ambari025.png)

Here we can see exactly which properties of the configuration has changed:

![](/assetsdeploying-managing-and-configuring-ambari/ambari026.png)

### Extracting configuration for edge nodes

In this section we will extract the configuration required to use Hive client on an edge node from Ambari.

Select Hive from the side-bar. Switch to the config tab and select ``. you will notice that you can either select Hive Client configuration or HCat Client configuration

![](/assetsdeploying-managing-and-configuring-ambari/ambari028.png)

Once you select the particular configuration you want to download you will get a tar.gz file. Below is the extracted file with the Hive client configuration that you can use:  
![](/assetsdeploying-managing-and-configuring-ambari/ambari029.png)

Hope you got a taste of deploying, configuring and managing a Data Lake infrastructure with HDP 2.2.