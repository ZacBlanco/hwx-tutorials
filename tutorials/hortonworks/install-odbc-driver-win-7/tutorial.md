## Summary

This tutorial describes how to install and configure the Hortonworks ODBC driver on Windows 7.

The Hortonworks ODBC driver enables you to access data in the Hortonworks Data Platform from Business Intelligence (BI) applications such as Microsoft Excel, Tableau, Qlik, Micro Strategy, Cognos, and Business Objects.

## Prerequisites:

*   Windows 7
*   Hortonworks Sandbox

## Overview

The Hortonworks ODBC driver installation consists of the following steps:

*   Download and install the Hortonworks ODBC driver.
*   Configure the ODBC connection in Windows 7.

Boot your VM. Once the Sandbox screen shows on the console hit Alt-F5 to get a login and login as root/hadoop. Type `ifconfig` and look for eth0\. The IP address of Eth0 is the address you will use as the IP address when you configure the ODBC connection.

### Step 1: Download and Install the Hortonworks ODBC Driver

*   In Windows 7, open a web browser and navigate to [http://hortonworks.com/download/](http://hortonworks.com/download/). Click the **Add-Ons** link at the bottom of the Hortonworks Data Platform box.

![](/assets/odbc-win-7/01_download_page.jpg)





*   On the Add-Ons page, scroll down to Hortonworks Hive ODBC Driver (Windows + Mac) and select the driver that matches the version of Excel installed on your system (32-bit or 64-bit). For this tutorial, we will configure for Excel 2013 64-bit, so we’ll select **Windows 64-bit (msi)**.

![](/assets/odbc-win-7/02_addons_page.jpg)





*   Review the Hortonworks license, then click **Accept Agreement**.

![](/assets/odbc-win-7/03_license_agreement.jpg)





*   To start the download, click **Save File** on the pop-up message.

![](/assets/odbc-win-7/04_save_file.jpg)





*   After the download is complete, double-click to open the downloaded HortonworksHiveODBC64.msi file, then click **Run** on the pop-up security message to open the setup wizard.

![](/assets/odbc-win-7/05_run_install.jpg)





*   To start the installation, click **Next** on the Hortonworks Hive ODBC Driver Setup Wizard Welcome screen.

![](/assets/odbc-win-7/06_install_wizard1.jpg)





*   Review the license agreement, then select the checkbox to accept the license terms. Click **Next** to continue.

![](/assets/odbc-win-7/07_install_wizard2.jpg)





*   Click **Next** to accept the default installation folder.You can also type in a different location, or click **Change** to select a different installation folder using a file browser.

![](/assets/odbc-win-7/08_install_wizard3.jpg)





*   To begin the installation, click **Install**.

![](/assets/odbc-win-7/09_install_wizard4.jpg)





*   If a reboot is required, a pop-up message will appear. Click **OK** to continue.

![](/assets/odbc-win-7/10_install_wizard5.jpg)





*   When the installation is complete, the setup wizard displays a confirmation message. Click **Finish** to close the setup wizard.

![](/assets/odbc-win-7/11_install_wizard6.jpg)





*   A pop-up message will appear. Close any open applications, then click **Yes** to restart your system.

![](/assets/odbc-win-7/12_confirm_reboot.jpg)





Now that you have successfully installed the Hortonworks ODBC driver, the next step is to configure the driver.

### Step 2: Configure the Hortonworks ODBC Driver

*   In the Windows Control Panel, select **Administrative Tools**, then double-click **Data Sources (ODBC)** to open the ODBC Data Source Administrator.

![](/assets/odbc-win-7/14_system_dsn.jpg)





*   Select the **System DSN** tab. The Sample Hortonworks Hive DSN should be selected by default; if not, select it. Click **Configure** to continue.

![](/assets/odbc-win-7/13_data_source_admin.jpg)





*   On the Hortonworks Hive ODBC Driver DSN Setup window, type in the settings as shown in the image below. Type the IP address of the Hortonworks sandbox in the Host box. The Authentication mechanism should be set to User Name, and the sandbox user name should be entered in the User Name box (in this case the default user name, “hue”).

**Notes**

*   The sandbox IP address is displayed in the command prompt window after the sandbox VM (Virtual Machine) starts, and also appears in the browser address box when you open the sandbox.

*   If you are running more than one VM, the last number of the IP address may vary depending on the order in which the sandbox VM was started relative to the other VMs. In this example, the sandbox VM was started first, and its IP address is 198.168.56.101\. If the sandbox VM had been started second (after another VM), its IP address would then be 198.168.56.102.

*   The IP address provided in this tutorial is an example – your IP address may be different. Be sure to check the sandbox command prompt window after starting the VM for the IP address used for your sandbox installation.

![](/assets/odbc-win-7/15_driver_setup.jpg)





*   Click **Test** to test the configuration settings. If the test is successful, a confirmation message appears. Click **OK** to close the message box.

![](/assets/odbc-win-7/16_driver_test.jpg)





*   On the Hortonworks Hive ODBC Driver DSN Setup window, click **OK** to save the driver configuration settings.

![](/assets/odbc-win-7/17_close_setup.jpg)





*   Click **OK** to close the ODBC Data Source Administrator window.

![](/assets/odbc-win-7/18_close_dsn.jpg)





Now that you have configured the Hortonworks ODBC driver, you can enable ODBC connections in BI tools such as Microsoft Excel, then use those applications to access data in the Hortonworks Platform.

