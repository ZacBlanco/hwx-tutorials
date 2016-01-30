In this tutorial, we will explore how to quickly and easily deploy Apache Hadoop with [Apache Ambari](http://hortonworks.com/hadoop/ambari). We will spin up our own VM with [Vagrant](http://www.vagrantup.com/) and [Apache Ambari](http://hortonworks.com/hadoop/ambari). Vagrant is very popular with developers as it lets one mirror the production environment in a VM while staying with all the IDEs and tools in the comfort of the host OS.

If you’re just looking to get started with Hadoop in a VM, then you can simply download the [Hortonworks Sandbox](http://hortonworks.com/sandbox).

### Prerequisites

*   [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
*   [Vagrant](http://vagrantup.com/)

### Spin up a VM with Vagrant

Create a folder for this VM: `mkdir hdp_vm`

![<Display Name>](/assets/introducing-apache-ambari/vagrant_01.jpg)

If you have Virtual Box and Vagrant installed on your system, change directory to it and issue the following command:

`vagrant box add hdp_vm https://github.com/2creatives/vagrant-centos/releases/download/v6.5.1/centos65-x86_64-20131205.box`

![<Display Name>](/assets/introducing-apache-ambari/vagrant_03.jpg)

Once it has completed the download and added to your library of VMs with the name hdp_vm, issue the command:

`vagrant init hdp_vm`

This will create a file ‘Vagrantfile’ in the folder. Open it in a text editor like ‘vi’:

![<Display Name>](/assets/introducing-apache-ambari/vagrant_05.jpg)

Edit the ‘Vagrantfile’, so that port 8080 on the VM is forwarded to port 8080 on the host:

![<Display Name>](/assets/introducing-apache-ambari/vagrant_06.jpg)

Let’s also modify the settings so that the VM is assigned adequate Memory once it is launched:

![<Display Name>](/assets/introducing-apache-ambari/vagrant_07.jpg)

We are ready to launch the VM. Once the VM is launched, SSH in and login as root and change to the home directory of the ‘root’:

![<Display Name>](/assets/introducing-apache-ambari/vagrant_09.jpg)

### Configure the VM

Find out the default hostname of the VM and note it down:

![<Display Name>](/assets/introducing-apache-ambari/vagrant_10.jpg)

Then we need to edit the ‘/etc/hosts’ file so that we have an entry of this hostname. Open ‘/etc/hosts’ in ‘vi’ and it might look like this:

![<Display Name>](/assets/introducing-apache-ambari/vagrant_11.jpg)

It needs to looks like this:

![<Display Name>](/assets/introducing-apache-ambari/vagrant_12.jpg)

Now we will install the NTP service with the following commands:

`yum install ntp`

Next we will install the wget utility with the following commands:

`yum install wget`

Once these are installed turn on the ntp service with the commands:

`chkconfig ntpd on  
service ntpd start`

![<Display Name>](/assets/introducing-apache-ambari/vagrant_16.jpg)

### Setting up passwordless SSH

Get a pair of keys: `ssh-keygen`

![<Display Name>](/assets/introducing-apache-ambari/vagrant_17.jpg)

The keys will be placed in the folder .ssh.

*   Copy the id_rsa file to /vagrant folder so that you can access the private key from the host machine as /vagrant is automatically the shared folder between host and guest OSs.
*   Also append id_rsa.pub, the public key to the authorized_keys keys file.

![<Display Name>](/assets/introducing-apache-ambari/vagrant_18.jpg)

### Setup Ambari

Download and copy the Ambari repository bits to /etc/yum.repos.d:

`wget [http://public-repo-1.hortonworks.com/ambari/centos6/1.x/updates/1.4.3.38/ambari.repo](http://public-repo-1.hortonworks.com/ambari/centos6/1.x/updates/1.4.3.38/ambari.repo)  
cp ambari.repo /etc/yum.repos.d`

Double check that the repo has been configured correctly:  
`yum repolist`

![<Display Name>](/assets/introducing-apache-ambari/vagrant_19.jpg)

Now we are ready to install the bits from the repo:  
`yum install ambari-server`

![<Display Name>](/assets/introducing-apache-ambari/vagrant_20.jpg)

Now we can configure the bits. I just go with the defaults during the configuration:  
`ambari-server setup`

![<Display Name>](/assets/introducing-apache-ambari/vagrant_21.jpg)

Let’s spin up Ambari:  
`ambari-server start`

![<Display Name>](/assets/introducing-apache-ambari/vagrant_23.jpg)

### Setting up the pseudo-cluster with Ambari:

Now you can access Ambari from your host machine at the url [http://localhost:8080](http://localhost:8080/). The username and password is admin and admin respectively:

![<Display Name>](/assets/introducing-apache-ambari/vagrant_24.jpg)

Name your cluster:

![<Display Name>](/assets/introducing-apache-ambari/vagrant_25.jpg)

Select HDP 2.0:

![<Display Name>](/assets/introducing-apache-ambari/vagrant_26.jpg)

Input the hostname of your VM and click on the Choose File button:

![<Display Name>](/assets/introducing-apache-ambari/vagrant_27.jpg)

Select the private key file you can find in the folder you created at the beginning of this post:

![<Display Name>](/assets/introducing-apache-ambari/vagrant_28.jpg)

Select the default options for the rest of the steps till you get to Customize Services. In this step, configure your preferred credentials especially for the components marked with a white number against the red background:

![<Display Name>](/assets/introducing-apache-ambari/vagrant_33.jpg)

Finish up the wizard.

![<Display Name>](/assets/introducing-apache-ambari/vagrant_38.jpg)

Voila!!! We have our very own Hadoop VM.

Happy Hadooping!