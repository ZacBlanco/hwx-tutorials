Hadoop is fast emerging as a mainstay in enterprise data architectures. To meet the increasing demands of business owners and resource constraints, IT teams are challenged to provide an enterprise grade cluster that can be consistently and reliably deployed. The complexities of the varied Hadoop services and their requirements make it more onerous and time consuming for IT teams. This results in more time spent on infrastructure than on projects that help generate the valuable business insights from Big Data.

UCS has pioneered a policy driven approach that integrates all elements of the infrastructure required for Hadoop clusters. The policy-based approach is further extended into the Hadoop application domain through UCS Director Express for Big Data. Delivering a high performance and end-end validated solution were the driving factors that led to the industry leading Big Data architecture – known as UCS integrated architecture for Big Data. With the addition of UCSD Express for Big Data, UCS now enables users to setup an optimized Hadoop cluster right out of the box. In this tutorial, we will highlight how users can leverage this management paradigm to accelerate their time to market with HDP deployments on UCS.

![Untitled0](http://hortonworks.com/wp-content/uploads/2015/06/Untitled0.png)

UCSD Express for Big Data provides a turnkey solution that radically simplifies both the deployment and management of Hadoop clusters. It integrates with HDP Ambari API to provide a seamless experience for customers to expedite the deployment of Hadoop and manage both the physical and software services from a single management pane.

**Setup**

UCSD Express for Big Data can be operationalized very quickly through a short OVF installation on a VMware vSphere client. To create a Hadoop cluster with UCS Director Express for Big Data, the following steps are required

1.  Creation of a UCSM account
2.  Setting up of IP Pools
3.  Scheduling the Hadoop Cluster creation

**Step 1: Creation of a UCSM account**

A UCSM account is created to establish the association with the underlying physical infrastructure. This association will then enable server discovery for all UCS servers attached to the UCS Fabric interconnect. The Cisco UCS FI provide high bandwidth, low latency lossless 10Gbps connectivity and unified management for all the connected Hadoop nodes. On the console, navigate to _Administration->Physical Accounts_ and click the _Add_ button. Select _Default Pod_, Account Type as UCSM and click submit. Provide the IP address and access info for the UCS Fabric Interconnect to be used for this account.

![Untitled1](http://hortonworks.com/wp-content/uploads/2015/06/Untitled1.png)

**Step 2: Creation of IP Pools**

To segregate the management, HDFS and data ingest traffic; create 3 different IP address pools that can be used to dynamically assign IP address as the Hadoop nodes are added to the cluster. The network separation allows for distinct QoS to be configured based on the traffic characteristics. On the console, navigate to _Solutions->Big Data Containers->Big Data IP Pools_ and click the _Add_ button. Provide _IP Pool Name_ and _IP address_ range to be used for each of the IP pools

![Untitled2](http://hortonworks.com/wp-content/uploads/2015/06/Untitled2.png)

![Untitled4](http://hortonworks.com/wp-content/uploads/2015/06/Untitled4.png)

**Step 3: Schedule the Cluster Creation Process**

There are two modes to create a Hadoop cluster within this framework – Instant Cluster and Custom Cluster. The instant cluster creation approach takes the best practices with from the Cisco Validated Design (CVD) developed after extensive testing and benchmarking with Hortonworks. This takes away the guesswork and provides a pre-validate cluster configuration. Custom cluster allows further customization based on initial defaults from the Cisco Validate Design to fine-tune the configuration based on specific customer requirements. This provides the flexibility to pick specific Hadoop services and also choose the nodes on which those services are run. A new cluster deployment template is created with the tuned configuration, which can then be used for all subsequent cluster deployments.

To kick off the cluster creation process, navigate to _Solutions->Big Data Containers->Hadoop Cluster Deploy Templates_ and click the _Instant Hadoop Cluster_ button. Provide basic inputs to select the desired cluster size, HDP version (HDP 2.1, 2.2), RHEL OS version, server/UUID Pool, network interface configuration (associated to the IP pools), UCSM and Big Data account information. Click the submit button and you are on your way to stand up the Hadoop cluster

![Untitled5](http://hortonworks.com/wp-content/uploads/2015/06/Untitled5.png)

Monitor the progress of the cluster creation process by navigating to “Organizations->Service Requests” and viewing the Master and Child Workflows corresponding to the service request.

![Untitled6](http://hortonworks.com/wp-content/uploads/2015/06/Untitled6.png)

![Untitled7](http://hortonworks.com/wp-content/uploads/2015/06/Untitled7.png)

**Monitoring**

Post Hadoop cluster creation, the newly created cluster is available as a Big Data Account from the Solutions Tab->Big Data Accounts. Users can browse the host information and Hadoop services configured on the individual nodes. Both HDP services and the associated hardware infrastructure can now be managed directly through a common console.

![Untitled8](http://hortonworks.com/wp-content/uploads/2015/06/Untitled8.png)

Administration tasks such as starting and stopping services, fault diagnosis and addition/deletion of new HDP nodes are handled seamlessly. IT teams have complete control on the complete physical infrastructure and ability to monitor all element of the entire Hadoop stack. This provides the ability to not only detect any disk failures, DIMM failures but also monitor network, CPU and disk utilization

![Untitled9](http://hortonworks.com/wp-content/uploads/2015/06/Untitled9.png)

![Untitled10](http://hortonworks.com/wp-content/uploads/2015/06/Untitled10.png)

**Cluster Expansion**

Adding new nodes to the HDP cluster is straightforward and is achieved by clicking on the “Add BareMetal Node” and selecting the number of new nodes to be added to the cluster. Selections are pre-populated based on the original cluster selection. Deployments with pre-existing Hadoop cluster nodes can also avail of the management capabilities by adding pre-existing nodes into the management umbrella.

![Untitled11](http://hortonworks.com/wp-content/uploads/2015/06/Untitled11.png)

**Dashboard**

Another convenient feature is the Dashboard feature that simplifies the job for administrators to identify and monitor operational metrics for rapid correlation and quick diagnosis of various system and Hadoop metrics. Proactive alerts can be set to alert administrator on impending issues and take remedial action.

![Untitled12](http://hortonworks.com/wp-content/uploads/2015/06/Untitled12.png)

UCSD Express for Big Data on HDP delivers a validated, repeatable and reliable mechanism to deploy and manage HDP clusters. It provides complete visibility, optimized configuration and total control of your Hadoop clusters enabling Big Data teams to focus less on hardware and more on business goals, accelerating time to value from Big Data investments.
