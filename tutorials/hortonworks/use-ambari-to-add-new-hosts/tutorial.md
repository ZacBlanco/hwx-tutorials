Apache Hadoop clusters grow and change with use. Maybe you used [Apache Ambari](http://hortonworks.com/hadoop/ambari/ "Apache Ambari") to build your initial cluster with a base set of Hadoop services targeting known use cases and now you want to add other services for new use cases. Or you may just need to expand the storage and processing capacity of the cluster.

Ambari can help in both scenarios. In this blog, we’ll cover a few different ways that Ambari can help you expand your cluster.

### Adding New Hosts to the Cluster

You can add more hosts to the cluster and assign these hosts to run as DataNodes and NodeManagers. This allows you to expand both your HDFS storage capacity and your YARN processing power.

![ambari_1](/assets/adding-hosts-to-ambari/ambari_11.png)

1.  In the Ambari Web interface, browse to the Hosts page and click the Actions button.
2.  Select the option to “Add New Hosts,” which will launch the Add New Hosts wizard that walks you thru the host registration process.
3.  Select which slave components to include on the host (such as DataNode and NodeManager) and configure those components (in case you want a unique configuration for this new set of machines).
4.  Ambari will then deploy the software packages on the hosts, push the configuration to the hosts, and start the components so they join their respective Services.

Learn more about “Adding Hosts to a Cluster” in the [Ambari User’s Guide](http://docs.hortonworks.com/HDPDocuments/Ambari-1.6.1.0/bk_Monitoring_Hadoop_Book/content/monitor-chap2-4b_2x.html "Ambari User's Guide").

### Adding Components to Existing Cluster Hosts

If you already have enough hosts in the cluster but you are not running all components on all the machines, you can expand your cluster by adding components to machines.

![ambari_2](/assets/adding-hosts-to-ambari/ambari_21.png)

For example, if you have hosts that are not running DataNode or NodeManager components, follow these steps in Ambari Web:

1.  Browse to the specific host page and click the “Add” button.
2.  Choose any additional components that are not already installed on that host. For example, if you want to make an existing host also serve as a DataNode, you select DataNode from the dropdown and Ambari will install the software packages.
3.  Ambari pushes any necessary configurations and the DataNode joins the HDFS service as a slave component.

### Replacing Hosts in the Cluster

Suppose you want to expand your cluster capacity by retiring (i.e. “deleting”) hosts from your cluster and adding new hosts with updated hardware for more memory, drives and CPU power. Earlier we talked about adding hosts to the cluster. In this example, we will first remove the older hosts from the cluster.

![ambari_3](/assets/adding-hosts-to-ambari/ambari_31.png)

1.  Delete the hosts from Ambari.
2.  Browse to the Hosts page in Ambari Web, and in the Host Actions menu, select “Delete Host.”
3.  Ambari will initiate the delete operation, which removes slave components on the host and from their respective services (such as removing a DataNode from HDFS).

**Note:** be sure to [decommission](http://docs.hortonworks.com/HDPDocuments/Ambari-1.6.1.0/bk_Monitoring_Hadoop_Book/content/Decommissioning_Master_and_Slave_Nodes.html "Decommission") the components on the host prior to performing the delete.

Learn more about “Deleting a Host from a Cluster” in the [Ambari User’s Guide](http://docs.hortonworks.com/HDPDocuments/Ambari-1.6.1.0/bk_Monitoring_Hadoop_Book/content/Delete_a_Host_From_Cluster.html "Ambari User's Guide").

### Adding Services to the Cluster

![ambari_4](/assets/adding-hosts-to-ambari/ambari_41.png)

Ambari supports installing and managing Services that are logically grouped into a “Stack.” When you perform the initial cluster install, you select the services to include in the cluster. For example, you might initially select HDFS, YARN, MapReduce and Tez. Over time, as your Hadoop needs expand, you might want to add other Services to that cluster, such as Hive or HBase.

Here’s how you would do that:

1.  Using the Add Service wizard, browse to the Services page in Ambari Web.
2.  From the Actions menu, select “Add Service.”
3.  The wizard launches, and then you can select from the list of Services not already installed for that Stack.

Learn more about “Adding a Service” in the [Ambari User’s Guide](http://docs.hortonworks.com/HDPDocuments/Ambari-1.6.1.0/bk_Monitoring_Hadoop_Book/content/monitor-chap2-3-1-2_2x.html "Ambari User's Guide").