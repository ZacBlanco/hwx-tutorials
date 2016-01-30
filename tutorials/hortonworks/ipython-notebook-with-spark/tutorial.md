In this tutorial we are going to configure IPython notebook with Apache Spark on YARN in a few steps.

IPython notebook is an interactive Python shell which lets you interact with your data one step at a time and also perform simple visualizations.

IPython notebook supports tab autocompletion on class names, functions, methods, variables. It also offers more explicit and colour-highlighted error messages than the command line python shell. It provides integration with basic UNIX shell allowing you can run simple shell commands such as cp, ls, rm, cp, etc. directly from the IPython. IPython integrates with many common GUI modules like PyQt, PyGTK, tkinter as well wide variety of data science Python packages.

### Prerequisites

The only prerequiste for this tutorial is the latest [Hortonworks Sandbox](http://hortonworks.com/sandbox) installed on your computer or on the [cloud](http://hortonworks.com/blog/hortonworks-sandbox-azure/). In case you are running an Hortonworks Sandbox with an earlier version of Apache Spark, for the instruction in this tutorial, you need to install the Apache Spark 1.3.1.

### Installing and configuring IPython

To begin, login in to Hortonworks Sandbox through SSH:The default password is `hadoop`.

![saptek](/assets/ipython-with-spark/saptek.png)

Now let’s configure the dependencies by typing in the following command:

    yum install nano centos-release-SCL zlib-devel \

    bzip2-devel openssl-devel ncurses-devel \

    sqlite-devel readline-devel tk-devel \

    gdbm-devel db4-devel libpcap-devel xz-devel \

    libpng-devel libjpg-devel atlas-devel

![saptek2](/assets/ipython-with-spark/saptek2.png)

IPython has a requirement for Python 2.7 or higher. So, let’s install the “Development tools” dependency for Python 2.7

    yum groupinstall “Development tools“

![saptek3](/assets/ipython-with-spark/saptek3.png)

Now we are ready to install Python 2.7.

    yum install python27

![saptek4](/assets/ipython-with-spark/saptek4.png)

Now the Sandbox has multiple versions of Python, so we have to select which version of Python we want to use in this session. We will choose to use Python 2.7 in this session.

    source /opt/rh/python27/enable

Then we will download `easy_install` which we will use to configure `pip`, a Python package installer.

    wget https://bitbucket.org/pypa/setuptools\

/raw/bootstrap/ez_setup.py

Now let’s configure `easy_install` with the following command:

    python ez_setup.py

Now we can install `pip` with `easy_install` using the following command:

    easy_install-2.7 pip

![saptek5](/assets/ipython-with-spark/saptek5.png)

`pip` makes it really easy to install the Python packages. We will use `pip` to install the data science packages we might need using the following command:

    pip install numpy scipy pandas \

    scikit-learn tornado pyzmq \

    pygments matplotlib jinja2 jsonschema

![saptek6](/assets/ipython-with-spark/saptek6.png)

Finally, we are ready to install IPython notebook using `pip` using the following command:

    pip install “ipython[notebook]“

![saptek8](/assets/ipython-with-spark/saptek8.png)

### Configuring IPython

Since we want to use IPython with Apache Spark we have to use the Python interpreter which is built with Apache Spark, `pyspark`, instead of the default Python interpreter.

As a first step of configuring that, let’s create a IPython profile for `pyspark`

    ipython profile create pyspark

![saptek9](/assets/ipython-with-spark/saptek9.png)

Within the this newly minted IPython profile for `pyspark` found at `~/.ipython/profile_pyspark/`, edit the file `ipython_notebook_config.py` with text editor like `nano` and change the values in the file to resemble values below:

    c.NotebookApp.ip = ‘*’

    c.NotebookApp.open_browser = False

    c.NotebookApp.port = 8889

    c.NotebookApp.notebook_dir = u’/usr/hdp/current/spark-client/’

Note the port we are using for IPython. Ensure this port is not already being used. The default port for IPython notebook is `8888`, which is also being used by Sandbox as it’s welcome page. So we are changing it to `8889`. We are going to forward this port in the next section to ensure we can access IPython notebook from the host machine.

![saptek10](/assets/ipython-with-spark/saptek10.png)

Next we are going to create a shell script to set the appropriate values everytime we want to start IPython.

Create a shell script with the following command:

    nano ~/start_ipython_notebook.sh

Then copy the following lines into the file:

    #!/bin/bash

    source /opt/rh/python27/enable

    IPYTHON_OPTS=”notebook –profile pyspark” pyspark

![saptek11](/assets/ipython-with-spark/saptek11.png)

Finally we need to make the shell script we just created executable:

    chmod +x start_ipython_notebook.sh

![python](/assets/ipython-with-spark/python.png)

### Port Forwarding

We need to forward the port `8889` from the guest VM, Sandbox to the host machine, your desktop for IPython notebook to be accessible from a browser on your host machine.

Open the VirtualBox App and open the settings page of the Sandbox VM by right clicking on the Sandbox VM and selecting settings.

Then select the networking tab from the top:

![saptek13](/assets/ipython-with-spark/saptek13.png)

Then click on the port forwarding button to configure the port. Add a new port configuration by clicking the `+` icon on the top right of the page.

Input a name for application, IP and the guest and host ports as per the screenshot below:

![saptek14](/assets/ipython-with-spark/saptek14.png)

Then press `OK` to confirm the change in configuration.

Now we are ready to test IPython notebook.

### Running IPython notebook

Execute the shell script we created before from the sandbox command prompt using the command below:

    ./start_ipython_notebook.sh

![saptek15](/assets/ipython-with-spark/saptek15.png)

Now, open a browser on your host machine and navigate to the URl [http://127.0.0.1:8889](http://127.0.0.1:8889) and you should see the screen below:

![](https://www.dropbox.com/s/2ga17v2a8klpdz9/Screenshot%202015-07-20%2011.22.06.png?dl=1)

Voila! you have just configured IPython notebook with Apache Spark on you Sandbox.

In the next few tutorials we are going to explore how we can use IPython notebook to analyze and visualize data.
