> JPMS：Java Platform Module System

现在JAVA应用主流为基于MAVEN进行系统模块的划分，但MAVEN等工具本质仍然是基于整体JAR文件的模块化，最终生成的镜像文件包含了引用的所有JAR包的完整内容，并没有能力对JAR中的内容进行更精细化的操作。

#### 模块化之前的问题：

* Java运行环境的膨胀和臃肿。每次JVM启动的时候，至少会有30~60MB的内存加载，主要原因是JVM需要加载rt.jar，不管其中的类是否被classloader加载，第一步整个jar都会被JVM加载到内存当中去(而模块化可以根据模块的需要加载程序运行需要的class)
* 当代码库越来越大，创建复杂，盘根错节的“意大利面条式代码”的几率呈指数级的增长。不同版本的类库交叉依赖导致让人头疼的问题，这些都阻碍了Java开发和运行效率的提升
* 很难真正地对代码进行封装, 而系统并没有对不同部分(也就是JAR文件)之间的依赖关系有个明确的概念。每一个公共类都可以被类路径之下任何其它的公共类所访问到，这样就会导致无意中使用了并不想被公开访问的API。
* 类路径本身也存在问题: 你怎么知晓所有需要的JAR都已经有了, 或者是不是会有重复的项呢?

JDK9首次引入JPMS模块化系统，首先对JDK本身做了模块化划分，然后支持对其他第三方JAR的模块化引入。

![JDK8](/static/Java/JDK/JDK9-JDK8.png)

![JDK8](/static/Java/JDK/JDK9-JDK9.png)

#### JDK标准模块：

java.base，java.naming，java.activation和java.logging等。

而java.base是最基础最核心的模块，其中封装了开发者最常用的包，如：java.io，java.lang，java.math，java.net，java.text，java.util等等。

Java9非标准模块以jdk作为前缀。 以下是部分非标准模块名称：

jdk.accessibility,jdk.attach,jdk.charsets,jdk.compiler, jdk.httpserver等等。

![JDK8](/static/Java/JDK/JDK9-LIB.png)

![JDK8](/static/Java/JDK/JDK9-IMAGE.png)

其中java.base模块比较特殊，它是独立的模块，这就意味着它并不依赖于其他任何模块，并且java.base是其他模块的基础，所以在其他模块中并不需要显式引用java.base。

#### 模块化的使用：

通过声明module-info文件等操作，可以方便的将应用程序改变为JPMS模块化系统，例如将基于MAVEN的模块系统改变为JPMS模块系统。

1. 为目录创建module-info.java文件
    1. 可以使用Maven依赖项插件解析目标列出当前在类路径中的所有模块名称，并将它们添加到module-info中：

    > ./mvnw compile org.apache.maven.plugins:maven-dependency-plugin:3.1.1:resolve
                                                                                               
2. 使用requires引入其他模块的路径
3. 使用exports暴露该模块的报名，给其他模块进行引用
4. 使用transitive实现引用的传递，使得依赖A模块也可以读取A所依赖模块的内容
5. 使用static仅仅在编译时引入，在运行时会去除该部分依赖的模块
6. 更多的内容...

#### 模块化的实现原理：

1、 将系统内部类进行模块化

  这样不用在区分太多J2ME, J2SE，J2EE了，大家都是用模块作为沟通语言。这需要整理所有的类和它们调用关系，调用频次等，把系统类模块化，这可能最复杂的一部分，不过结果是完美的。

2、 将ClassLoader分级

  将ClassLoader分为三个级别，Bootstrap Loader具有最高优先级和权限，主要是核心的系统类；Platform Loader用于扩展的一些系统类，例如SQL,XML等；Application Loader主要用于应用程序的Loader。

  在这三个级别的Loader下面有一个统一Module 管理，用于控制和管理模块间的依赖关系，可读性，可访问性等。

  **注意**，ClassLoader在Java 9中的类装载逻辑和之前一样，但是，通过模块管理系统，ClassLoader.FindClass的能力，将被限制在readable&accessible的条件下，而不是之前的简单的Public条件。

![JDK8](/static/Java/JDK/JDK9-LOADER.jpg)

#### 模块化的实际应用价值：

* 云原生
    * 为应用程序创建最小的JRE镜像
    * 减少应用程序内存占用量
    * 优化应用程序启动时间
* 安全性
    * public不再意味着accessible，更好的管理public的可访问性
......