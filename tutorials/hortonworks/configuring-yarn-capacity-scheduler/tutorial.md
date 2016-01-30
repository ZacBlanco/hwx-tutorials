In this tutorial we are going to explore how we can configure YARN CapacityScheduler from Ambari.

### What is the YARN's CapacityScheduler?

YARN's CapacityScheduler is designed to run Hadoop applications in a shared, multi-tenant cluster while maximizing the throughput and the utilization of the cluster.

Traditionally each organization has it own private set of compute resources that have sufficient capacity to meet the organization's SLA. This generally leads to poor average utilization. Also there is heavy overhead of managing multiple independent clusters.

Sharing clusters between organizations allows economies of scale . However, organizations are concerned about sharing a cluster in the fear of not getting enaough available resources that are critical to meet their SLAs.

The CapacityScheduler is designed to allow sharing a large cluster while giving each organization capacity guarantees. There is an added benefit that an organization can access any excess capacity not being used by others. This provides elasticity for the organizations in a cost-effective manner.

Sharing clusters across organizations necessitates strong support for multi-tenancy since each organization must be guaranteed capacity and safe-guards to ensure the shared cluster is impervious to single rogue application or user or sets thereof. The CapacityScheduler provides a stringent set of limits to ensure that a single application or user or queue cannot consume disproportionate amount of resources in the cluster. Also, the CapacityScheduler provides limits on initialized/pending applications from a single user and queue to ensure fairness and stability of the cluster.

The primary abstraction provided by the CapacityScheduler is the concept of queues. These queues are typically setup by administrators to reflect the economics of the shared cluster.

To provide further control and predictability on sharing of resources, the CapacityScheduler supports hierarchical queues to ensure resources are shared among the sub-queues of an organization before other queues are allowed to use free resources, there-by providing affinity for sharing free resources among applications of a given organization.

### Configuring the Capacity Scheduler

For rest of the tutorial we will use the Ambari hosted on the [Hortonworks Sandbox](http://hortonworks.com/sandbox).

After you spin up the Hortonworks Sandbox, login to Ambari. The default username and password is `admin` /`admin`.  
![](/assets/configuring-yarn-capacity-scheduler/ambari001.png)

After you Login, you will see the Dashboard. This is an unified view of the state of your cluster.

![](/assets/configuring-yarn-capacity-scheduler/ambari002.png)

You can drill into specify service dashboard and configuration.

![](/assets/configuring-yarn-capacity-scheduler/ambari003.png)

Let’s dive into YARN dashboard by selecting Yarn from the left-side bar or the drop down menu.

![](/assets/configuring-yarn-capacity-scheduler/ambari004.png)

We will start updating the configuration for Yarn Capacity Scheduling policies.

![](/assets/configuring-yarn-capacity-scheduler/ambari005.png)

Scroll down to the `Scheduler` section of the page. The default capacity scheduling policy just has one queue.

![](/assets/configuring-yarn-capacity-scheduler/ambari006.png)

Let check out the scheduling policy visually. Scroll up to the top of the page and click on quick links. Then select ResourceManager UI from the dropdown.

![](/assets/configuring-yarn-capacity-scheduler/ambari007.png)

As you can see below we just have the default policy.

![](/assets/configuring-yarn-capacity-scheduler/ambari008.png)

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

Copy and paste the above policy in the `Capacity  Scheduler` textbox:

![](/assets/configuring-yarn-capacity-scheduler/ambari006.png)

Click `Save` and confirm on the dialog box:

![](/assets/configuring-yarn-capacity-scheduler/ambari009.png)

At this point the, the configuration is saved but we still need to restart the affected components by the configuration change as indicated in the orange band below:

![](/assets/configuring-yarn-capacity-scheduler/ambari010.png)

Also note that there is now a new version of the configuration as indicated by the green `Current` label. Let’s restart the daemons by clicking `Restart  All`.

![](/assets/configuring-yarn-capacity-scheduler/ambari011.png)

Wait for the restart to complete:

![](/assets/configuring-yarn-capacity-scheduler/ambari013.png)

and then goto the browser tab with the Capacity Scheduler policy and refresh the page. Voila! There’s our new policy:

![](/assets/configuring-yarn-capacity-scheduler/ambari015.png)

Hope this brief tour of using YARN's CapacityScheduler gave you some ideas on howto achieve better utilization of Hadoop clusters.