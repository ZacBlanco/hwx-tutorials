The hosted Hortonworks Sandbox from Bit Refinery provides an easy way to experience and learn Hadoop with ease. All the tutorials available from HDP work just as if you were running a localized version of the Sandbox. Here is how our “flavor” of Hadoop interacts with the Hortonworks platform:

![alt text](http://bitrefinery.com/HDP_Tutorial/BR_HDP_Ecosystem.jpg "HDP Bit Refinery Ecosystem")


Our new tutorial will help you maneuver through to launch our SECURE Hortonworks sandbox. There are many different data systems that you can use to implement a Modern Data Architecture in your organization. The benefit of using the Bit Refinery system is that our trial sandbox and virtual environment is a secure location for your data while you are taking advantage of all the features of the HDP Sandbox. We have made some very significant safe guards to our system to ensure your data is safe. Some of these safeguards are:

1.  Firewall to only allow network ports that are needed for the Sandbox.
2.  Custom passwords for each hosted Sandbox.
3.  Apache Ranger enabled by default

### Prerequisite:

1.  Sign up for a trial through our SECURE sandbox landing page at:  
    http://sandbox.bitrefinery.com/hdp
2.  Click on the “Get it now” button  
    
    ![alt text](http://bitrefinery.com/HDP_Tutorial/sign_up_1.PNG "Sign Up Form")

3.  Fill out the form, Click “Sign Me Up!”. You will be contacted by a Bit Refinery representative for verification.  

![alt text](http://bitrefinery.com/HDP_Tutorial/sign_up_2.PNG "Sign Up Form")

You will receive an email with instructions on how to log into your custom HDP Sandbox with passwords for each application.  
There are a few different applications available in the Sandbox such as Hue, Ambari and Ranger, this tutorial will explore accessing each one.

### Sandbox Applications

* * *

##### Ambari

Ambari is the cornerstone of the HDP Hadoop environment. With this tool, you can administer a Hadoop cluster and now with the new 2.2.4 release we’re introduced to Ambari Views which allows you to perform interaction and programming all within one application.

To Access Ambari:  
1\. In a modern browser, type in the IP of your Sandbox followed by the port number: 8080\. ie. http://:8080  
2\. Use “admin” for the user and the password included in your welcome email.  
3\. Once you are logged in, you will be presented with the Ambari dashboard where you can explore all of the different features.  

![alt text](http://bitrefinery.com/HDP_Tutorial/ambari.png "Ambari")

#### Ambari Cluster Administration

Once you are logged into Ambari, you will be able to manage all of the services of a cluster along with adding new services. The default screen is the “Dashboard”. This supplies you with a quick look at the overall health of your Sandbox. The left column has all the different services and when clicked, additional information about the service will be displayed along with configuration options.

For example, the image below shows the HDFS service details:  

![alt text](http://bitrefinery.com/HDP_Tutorial/ambari_hdfs_service.png "Ambari HDFS")

#### Ambari Views Applications

To access Ambari Views, click in the little icons with 9 little boxes on it. From here, you can launch any of the applications.  

![alt text](http://bitrefinery.com/HDP_Tutorial/ambari_views_1.png "Ambari")

There are many useful tools within Ambari Views and we’ll cover the most useful ones which are Files and Hive.

The Hive View is a graphical interface allowing any user to write common SQL to access the Hadoop cluster.  

![alt text](http://bitrefinery.com/HDP_Tutorial/ambari_views_hive_1.png "Hive View")  

The results appear below the query and can be saved into HDFS or locally to a .csv file.  

![alt text](http://bitrefinery.com/HDP_Tutorial/ambari_views_hive_2.png "Hive View Results")

The next tool is the File Browser View. This application allows the user to navigate, view, upload and download files from the cluster.  

![alt text](http://bitrefinery.com/HDP_Tutorial/ambari_views_files.png "HDFS File Browser")

Although Ambari Views is just a preview for version 2.2.4, they will become the standard for users accessing the cluster. New “Views” will be added over time allowing unlimited possibilities.

#### Secure Shell and Secure File Transfer

Since the HDP Sandbox is built on Linux, it is easy to access the server using free tools such as Putty and Winscp for Windows and Terminal and Cyberduck for Mac. Putty (Windows) and Terminal (Mac) is a terminal client that you can use to access the Sandbox to edit files and execute scripts. Winscp (Windows) and Cyberduck (Mac) are file transfer utilities which enable easy upload and downloading of files to the Sandbox. To access the Sandbox, you can follow these easy steps:

1.  For Windows, visit the WinSCP website at: http://winscp.net/eng/download.php and click on the “Download WinSCP” link. For Mac, visit https://cyberduck.io/?l=en and download the software. Once you have downloaded and installed the software that will work with your system, you are ready to access the Sandbox.
2.  Referring back to your unique Sandbox password, enter “root” for the user and your unique Sandbox password.

Cyberduck:

![alt text](http://bitrefinery.com/HDP_Tutorial/cyberduck.png "HDP Bit Refinery Ecosystem")


WinSCP:

![alt text](http://bitrefinery.com/HDP_Tutorial/winscp_login.png "HDP Bit Refinery Ecosystem")



Once you are logged in, you can upload files from your computer as well as download files. This method should be used to transfer larger files instead of using the File Browser application in Ambari Views.  
![alt text](http://bitrefinery.com/HDP_Tutorial/winscp.png "HDP Bit Refinery Ecosystem")

#### Ranger

Apache Ranger provides a centralized tool to implement and administer security policies within a Hadoop cluster. Ranger access is through a standard web browser and provides an easy to use interface for different repositories, user and group administration as well as full audit reporting capabilities. The Bit Refinery hosted HDP Sandbox includes Ranger and each tutorial on the HDP website can be followed to learn how this powerful product enables you to secure a Hadoop cluster. To access Ranger, follow these steps:  
1\. In a modern browser, use the IP of your Sandbox followed by the port: 6080\. Ie. http://:6080  
2\. Use “admin” for the user and the password included in your welcome email.  
3\. Once you are logged in, you will be presented with the Ranger dashboard where you can explore all of the different features.  
4\. Visit http://hortonworks.com/hadoop/ranger/ for more information on Apache Ranger and to explore the tutorials

![alt text](http://bitrefinery.com/HDP_Tutorial/ranger.png "HDP Bit Refinery Ecosystem")

Now that you have the new secure Bit Refinery Hortonworks Sandbox, start exploring the Hadoop ecosystem as well as integrating with other [Hortonworks partners](http://hortonworks.com/partners/ecosystem/). Check out the available tutorials at [http://hortonworks.com/tutorials](http://hortonworks.com/tutorials). If you have any questions or need assistance please feel free to contact us at:

Bit Refinery

1–855–874–9700

sales@bitrefinery.com

http://bitrefinery.com
