[![HDFSACL](http://hortonworks.com/wp-content/uploads/2014/04/HDFSACL.png)](http://hortonworks.com/wp-content/uploads/2014/04/HDFSACL.png)Securing any system requires you to implement layers of protection.  Access Control Lists (ACLs) are typically applied to data to restrict access to data to approved entities. Application of ACLs at every layer of access for data is critical to secure a system. The layers for hadoop are depicted in this diagram and in this post we will cover the lowest level of access… ACLs for HDFS.

### Background

For several years, HDFS has supported a permission model equivalent to traditional Unix permission bits [5].  For each file or directory, permissions are managed for a set of 3 distinct user classes: owner, group, and others.  There are 3 different permissions controlled for each user class: read, write, and execute.  When a user attempts to access a file system object, HDFS enforces permissions according to the most specific user class applicable to that user.  If the user is the owner, then HDFS checks the owner class permissions.  If the user is not the owner, but is a member of the file system object’s group, then HDFS checks the group class permissions.  Otherwise, HDFS checks the others class permissions.

This model is sufficient to express a large number of security requirements at the block level.  For example, consider a sales department that wants a single user, the department manager, to control all modifications to sales data.  Other members of the department need to view the data, but must not be able to modify it.  Everyone else in the company outside the sales department must not be able to view the data.  This requirement can be implemented by running chmod 640 on the file, with the following outcome:

`-rw-r-----   3 bruce sales          0  2014-03-04  16:31  /sales-data`

Only bruce may modify the file, only members of the sales group may read the file, and no one else may access the file in any way.

Now suppose there are new requirements.  The sales department has grown such that it’s no longer feasible for the manager, bruce, to control all modifications to the file.  Instead, the new requirement is that bruce, diana, and clark are allowed to make modifications.  Unfortunately, there is no way for permission bits to express this requirement, because there can be only one owner and one group, and the group is already used to implement the read-only requirement for the sales team.  A typical workaround is to set the file owner to a synthetic user account, such as salesmgr, and allow bruce, diana, and clark to use the salesmgr account via sudo or similar impersonation mechanisms.

Also suppose that in addition to the sales staff, all executives in the company need to be able to read the sales data.  This is another requirement that cannot be expressed with permission bits, because there is only one group, and it’s already used by sales.  A typical workaround is to set the file’s group to a new synthetic group, such as salesandexecs, and add all users of sales and all users of execs to that group.

Both of these workarounds incur significant drawbacks though.  It forces complexity on to cluster administrators to manage additional users and groups.  It also forces complexity on to end users, because it requires them to use different accounts for different actions.

### ACLs Applied!

In general, plain Unix permissions aren’t sufficient when you have permission requirements that don’t map cleanly to an enterprise’s natural hierarchy of users and groups.  Working in collaboration with the Apache community, we developed the HDFS ACLs feature to address this shortcoming.  HDFS ACLs will be available in Apache Hadoop 2.4.0 and Hortonworks Data Platform 2.1.

HDFS ACLs give you the ability to specify fine-grained file permissions for specific named users or named groups, not just the file’s owner and group.  HDFS ACLs are modeled after POSIX ACLs [5].  If you’ve ever used POSIX ACLs on a Linux file system, then you already know how ACLs work in HDFS.  Best practice is to rely on traditional permission bits to implement most permission requirements, and define a smaller number of ACLs to augment the permission bits with a few exceptional rules.

To use ACLs, first you’ll need to enable ACLs on the NameNode by adding the following configuration property to hdfs-site.xml and restarting the NameNode.

`  
dfs.namenode.acls.enabled  
true  
`

Most users will interact with ACLs using 2 new commands added to the HDFS CLI: setfacl and getfacl.  Let’s look at several examples of how HDFS ACLs can help implement complex security requirements.

#### Example 1: Granting Access to Another Named Group

Going back to our original example, let’s set an ACL that grants read access to sales-data for members of the execs group.

*   Set the ACL.

        > hdfs dfs -setfacl -m group:execs:r--  /sales-data

*   Check results by running getfacl.

    
        > hdfs dfs -getfacl /sales-data  
        # file: /sales-data  
        # owner: bruce  
        # group: sales  
        user::rw-  
        group::r--  
        group:execs:r--  
        mask::r--  
        other::---
    

*   Additionally, the output of ls has been modified to append ‘+’ to the permissions of a file or directory that has an ACL.

        > hdfs dfs -ls /sales-data  
        Found  1 items  
        -rw-r-----+  3 bruce sales          0  2014-03-04  16:31  /sales-data

The new ACL entry is added to the existing permissions defined by the permission bits.  User bruce has full control as the file owner.  Members of either the sales group or the execs group have read access.  All others have no access.

#### Example 2: Using a Default ACL for Automatic Application to New Children

In addition to an ACL enforced during permission checks, there is also a separate concept of a default ACL.  A default ACL may be applied only to a directory, not a file.  Default ACLs have no direct effect on permission checks and instead define the ACL that newly created child files and directories receive automatically.

Suppose we have a monthly-sales-data directory, further sub-divided into separate directories for each month.  Let’s set a default ACL to guarantee that members of the execs group automatically get access to new sub-directories, as they get created for each month.

*   Set default ACL on parent directory.

`> hdfs dfs -setfacl -m default:group:execs:r-x /monthly-sales-data`

*   Make sub-directories.

`> hdfs dfs -mkdir /monthly-sales-data/JAN  
> hdfs dfs -mkdir /monthly-sales-data/FEB`

*   Verify HDFS has automatically applied default ACL to sub-directories.

        > hdfs dfs -getfacl -R /monthly-sales-data  
        # file: /monthly-sales-data  
        # owner: bruce  
        # group: sales  
        user::rwx  
        group::r-x  
        other::---  
        default:user::rwx  
        default:group::r-x  
        default:group:execs:r-x  
        default:mask::r-x  
        default:other::---

        # file: /monthly-sales-data/FEB  
        # owner: bruce  
        # group: sales  
        user::rwx  
        group::r-x  
        group:execs:r-x  
        mask::r-x  
        other::---  
        default:user::rwx  
        default:group::r-x  
        default:group:execs:r-x  
        default:mask::r-x  
        default:other::---

        # file: /monthly-sales-data/JAN  
        # owner: bruce  
        # group: sales  
        user::rwx  
        group::r-x  
        group:execs:r-x  
        mask::r-x  
        other::---  
        default:user::rwx  
        default:group::r-x  
        default:group:execs:r-x  
        default:mask::r-x  
        default:other::---

The default ACL is copied from the parent directory to the child file or child directory at time of creation.  Subsequent changes to the parent directory’s default ACL do not alter the ACLs of existing children.

### Example 3: Blocking Access to a Sub-Tree for a Specific User

Suppose there is an emergency need to block access to an entire sub-tree for a specific user.  Applying a named user ACL entry to the root of that sub-tree is the fastest way to accomplish this without accidentally revoking permissions for other users.

*   Add ACL entry to block all access to monthly-sales-data by user diana.

`> hdfs dfs -setfacl -m user:diana:---  /monthly-sales-data`

*   Check results by running getfacl.

        > hdfs dfs -getfacl /monthly-sales-data  
        # file: /monthly-sales-data  
        # owner: bruce  
        # group: sales  
        user::rwx  
        user:diana:---  
        group::r-x  
        mask::r-x  
        other::---  
        default:user::rwx  
        default:group::r-x  
        default:group:execs:r-x  
        default:mask::r-x  
        default:other::---

It’s important to keep in mind the order of evaluation for ACL entries when a user attempts to access a file system object:

1.  If the user is the file owner, then the owner permission bits are enforced.

2.  Else if the user has a named user ACL entry, then those permissions are enforced.

3.  Else if the user is a member of the file’s group or any named group in an ACL entry, then the union of permissions for all matching entries are enforced.  (The user may be a member of multiple groups.)

4.  If none of the above were applicable, then the other permission bits are enforced.

In this example, the named user ACL entry accomplished our goal, because the user is not the file owner, and the named user entry takes precedence over all other entries.

### References

1.  HDFS-4685\. [Implementation of ACLs in HDFS](https://issues.apache.org/jira/browse/HDFS-4685).
2.  HDFS-5284\. [Flatten INode hierarchy](https://issues.apache.org/jira/browse/HDFS-5284).
3.  HDFS-5698\. [Use protobuf to serialize / deserialize FSImage](https://issues.apache.org/jira/browse/HDFS-5698).
4.  Gruenbacher, A. (2003). [POSIX Access Control Lists on Linux](http://users.suse.com/~agruen/acl/linux-acls/online/).
5.  Wikipedia contributors (2013). [File system permissions – Traditional Unix permissions](http://en.wikipedia.org/wiki/File_system_permissions#Traditional_Unix_permissions).
