Scala is relatively new language based on the JVM. The main difference between other “Object Oriented Languages” and Scala is that everything in Scala is an object. The primitive types that are defined in Java, such as int or boolean, are objects in Scala. Functions are treated as objects, too. As objects, they can be passed as arguments, allowing a functional programming approach to writing applications for Apache Spark.

If you have programmed in Java or C#, you should feel right at home with Scala with very little effort.

You can also run or compile Scala programs from commandline or from IDEs such as Eclipse.

##### Prerequisite  
**Note: While this tour is written with Spark 1.2.0, it also works with HDP 2.3 with Spark 1.3.1**

[Download Hortonworks Sandbox](http://hortonworks.com/products/hortonworks-sandbox/#install)

##### Run Sandbox and connect to it from SSH

Let’s open a shell to our Sandbox through SSH:

![](/assets/a-short-primer-on-scala/Screenshot_2015-04-13_07_58_43.png)

The default password is `hadoop`

##### Launch Spark-Shell

To learn and experiment with data, I prefer the interactivity of the Scala shell. Let’s launch the Spark shell as it is a fully capable Scala shell.

spark-shell --master yarn-client --driver-memory 512m --executor-memory 512m

![](/assets/a-short-primer-on-scala/Screenshot%202015-06-08%2013.20.55.png)

### Values

Values can be either mutable or immutable. Mutable values are expressed by the `var` keyword.

    var a: Int = 5
    a = a + 1

println(a)

![](/assets/a-short-primer-on-scala/Screenshot%202015-06-08%2012.26.39.png)

Immutable values are expressed by the `val` keyword.

    val b: Int = 7

    b = b + 1 //Error

    println(b)

![](/assets/a-short-primer-on-scala/Screenshot%202015-06-08%2012.29.13.png)

### Type Inference

Scala like Java is a strongly typed language. But, it is very smart in type inference, which alleviates the onus of specifying types from the programmers.

    var c = 9

    println(c.getClass)

    val d = 9.9

    println(d.getClass)

    val e = “Hello“

    println(e.getClass)

![](/assets/a-short-primer-on-scala/Screenshot%202015-06-08%2012.52.36.png)

### Functions

Functions are defined with the `def` keyword. In Scala, the last expression in the function body is returned without the need of the `return` keyword.

    def cube(x: Int): Int = {

      val x2 = x * x * x

      x2

    }
    cube(3)

![](/assets/a-short-primer-on-scala/Screenshot%202015-06-08%2013.24.04.png)

You can write the function more succinctly by leaving out the braces and the return type as return type can be easily inferred.

    def cube(x: Int) = x*x*x

![](/assets/a-short-primer-on-scala/Screenshot%202015-06-08%2013.27.58.png)

### Anonymous Functions

Anonymous functions can be assigned as a `var` or `val` value. It can also be passed to and returned from other functions.

    val sqr: Int => Int = x => x * x

    sqr(2)

![](/assets/a-short-primer-on-scala/Screenshot%202015-06-08%2013.50.40.png)

Or, anonymous functions can be further shortened to

    val thrice: Int => Int = _ * 3

    thrice(15)

![](/assets/a-short-primer-on-scala/Screenshot%202015-06-08%2013.58.41.png)

where `_` is a the shorthand for whatever the input was.

### Collections

Scala has very convenient set of collections including Lists, Sets, Tuples, Iterators and Options. When you combine these data structures with anonymous fucntions and closures it is very expressive.

    val strs = Array(“This”, “is”, “happening”)
    strs.map(_.reverse)

![](/assets/a-short-primer-on-scala/Screenshot%202015-06-08%2014.38.48.png)

    strs.reduce(_+” “+_)

![](/assets/a-short-primer-on-scala/Screenshot%202015-06-08%2014.28.31.png)

This is far from comprehensive. To learn more visit [http://scala-lang.org](http://scala-lang.org)
