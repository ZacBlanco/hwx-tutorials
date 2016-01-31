Sometime back, we introduced the ability to create snapshots to protect important enterprise data sets from user or application errors.

[HDFS Snapshots](http://docs.hortonworks.com/HDPDocuments/HDP1/HDP-1.3.2/bk_user-guide/content/user-guide-hdfs-snapshots.html) are read-only point-in-time copies of the file system. Snapshots can be taken on a subtree of the file system or the entire file system and are:

*   **Performant and Reliable:** Snapshot creation is atomic and instantaneous, no matter the size or depth of the directory subtree
*   **Scalable:** Snapshots do not create extra copies of blocks on the file system. Snapshots are highly optimized in memory and stored along with the NameNode’s file system namespace

In this blog post we’ll walk through how to administer and use HDFS snapshots.

## Enable snapshots

In an example scenario, Web Server logs are being loaded into HDFS on a daily basis for processing and long term storage. The logs are loaded in a few times a day, and the dataset is organized into directories that hold log files per day in HDFS. Since the Web Server logs are stored only in HDFS, it’s imperative that they are protected from deletion.

`/data/weblogs  
/data/weblogs/20130901  
/data/weblogs/20130902  
/data/weblogs/20130903  
`

In order to provide data protection and recovery for the Web Server log data, snapshots are enabled for the parent directory:

`hdfs dfsadmin -allowSnapshot /data/weblogs`

Snapshots need to be explicitly enabled for directories. This provides system administrators with the level of granular control they need to manage data in HDP.

## Take point in time snapshots

The following command creates a point in time snapshot of the `/data/weblogs/` directory and its subtree:

`hdfs dfs -createSnapshot /data/weblogs`

This will create a snapshot, and give it a default name which matches the timestamp at which the snapshot was created. Users can provide an optional snapshot name instead of the default. With the default name, the created snapshot path will be: `/data/weblogs/.snapshot/s20130903-000941.091`. Users can schedule a CRON job to create snapshots at regular intervals.

To view the state of the directory at the recently created snapshot:

`hdfs dfs -ls /data/weblogs/.snapshot/s20130903-000941.091`

    Found  3 items  
    drwxr-xr-x   - web hadoop           0  2013-09-01  23:59  /data/weblogs/.snapshot/s20130903-000941.091/20130901  
    drwxr-xr-x   - web hadoop           0  2013-09-02  00:55  /data/weblogs/.snapshot/s20130903-000941.091/20130902  
    drwxr-xr-x   - web hadoop           0  2013-09-03  23:57  /data/weblogs/.snapshot/s20130903-000941.091/20130903  

## Recover lost data

As new data is loaded into the web logs dataset, there could be an erroneous deletion of a file or directory. For example, an application could delete the set of logs pertaining to Sept 2nd, 2013 stored in the `/data/weblogs/20130902` directory.

Since `/data/weblogs` has a snapshot, the snapshot will protect from the file blocks being removed from the file system. A deletion will only modify the metadata to remove `/data/weblogs/20130902` from the working directory.

To recover from this deletion, data is restored by copying the needed data from the snapshot path:

`hdfs dfs -cp /data/weblogs/.snapshot/s20130903-000941.091/20130902  /data/weblogs/`

This will restore the lost set of files to the working data set:

`hdfs dfs -ls /data/weblogs`

    
    Found  3 items  
    drwxr-xr-x   - web hadoop           0  2013-09-01  23:59  /data/weblogs/20130901  
    drwxr-xr-x   - web hadoop           0  2013-09-04  12:10  **/data/weblogs/20130902**  
    drwxr-xr-x   - web hadoop           0  2013-09-03  23:57  /data/weblogs/20130903  
    

Since snapshots are read-only, HDFS will also protect against user or application deletion of the snapshot data itself. The following operation will fail:

`hdfs dfs -rmdir /data/weblogs/.snapshot/s20130903-000941.091/20130902`

## Next Steps

With [HDP 2.1](http://hortonworks.com/products/hdp/), you can use snapshots to protect your enterprise data from accidental deletion, corruption and errors. [Download HDP to get started](http://hortonworks.com/products/hdp-2/#install).
