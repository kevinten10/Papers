### 前言

ZGC的成绩是，无论你开了多大的堆内存(128G？2T？)，硬是能保证低于10毫秒的JVM停顿。远低于最初的G1 avg:156.806ms。ZGC的目标保守的10ms，也远胜前代的G1 。

> 与标记对象的传统算法相比，ZGC在指针上做标记，在访问指针时加入Load Barrier（读屏障），比如当对象正被GC移动，指针上的颜色就会不对，这个屏障就会先把指针更新为有效地址再返回，也就是，永远只有单个对象读取时有概率被减速，而不存在为了保持应用与GC一致而粗暴整体的Stop The World。

![JDK11-Cat](/static/Java/JDK/JDK11-CAT.png)

下面来说下ZGC的八大特征:

### 1.所有阶段几乎都是并发执行的

这里的并发(Concurrent)，说的是应用线程与GC线程齐头并进，互不添堵。 所有阶段几乎都是并发执行的中的几乎，就是说ZGC还有三个非常短暂的STW的阶段，所以ZGC并不是Zero Pause GC啦。
比如开始的Pause Mark Start阶段，要做根集合（root set）扫描，包括全局变量、线程栈啥的里面的对象指针，但不包括GC堆里的对象指针，所以这个暂停就不会随着GC堆的大小而变化（不过会根据线程的多少啊、线程栈的大小之类的而变化）， 因此ZGC无论堆多大停顿都小于10ms。

### 2.并发执行的保证机制，就是Colored Pointer(着色指针) 和 Load Barrier(读屏障)

Colored Pointer从64位的指针中，借用了几位出来表示Finalizable、Remapped、Marked1、Marked0。 所以它不支持32位指针也不支持压缩指针， 且堆的上限是4TB。首先要明确的是ZGC只使用与64位操作系统。不适合32位操作系统，32位的最多4G内存。

![JDK11-Cat](/static/Java/JDK/JDK11-barrier.jpg)

有Load barrier(读屏障)在，就会在不同阶段，根据指针颜色看看要不要做些特别的事情(Slow Path)。注意下图里只有第一种语句需要读屏障，后面三种都不需要，比如值是原始类型的时候。  

![JDK11-Cat](/static/Java/JDK/JDK11-OBJ.png)

ZGC的Load Value Barrier，与Red Hat的Shenandoah收集器的不同，后者选择了70年代的比较基础的Brooks Pointer,而前者在也是很老的Baker barrier上加入了self healing的特性，比如下面的代码：

```java
Object a = obj.x; 
Object b = obj.x;
```

两行代码都插入了读屏障，但ZGC在第一个读屏障之后，不但a的值是新的，self healing下obj.x的值自身也会修正，第二个读屏障时就直接进入FastPath，没有消耗了； 而Shenandoah则不会修正obj.x的值，第二个读屏障又要SlowPath一次。

### 3.像G1一样划分Region，但更加灵活

ZGC将堆划分为Region作为清理，移动，以及并行GC线程工作分配的单位。 不过G1一开始就把堆划分成固定大小的Region，而ZGC 可以有2MB，32MB，N× 2MB 三种Size Groups，动态地创建和销毁Region，动态地决定Region的大小。
256k以下的对象分配在Small Page， 4M以下对象在Medium Page，以上在Large Page。
所以ZGC能更好的处理大对象的分配。

![JDK11-Cat](/static/Java/JDK/JDK11-region.png)

### 4.和G1一样会做Compacting－压缩

CMS是Mark-Sweep标记过期对象后原地回收，这样就会造成内存碎片，越来越难以找到连续的空间，直到发生Full GC才进行压缩整理。
ZGC是Mark-Compact ，会将活着的对象都移动到另一个Region，整个回收掉原来的Region。
而G1 是 incremental copying collector，一样会做压缩。
下面粗略的了解一波回收流程，其他详细小阶段都被略过了哈：

#### 4.1 Pause Mark Start －初始停顿标记

停顿JVM地标记Root对象，1，2，4三个被标为live。

![JDK11-Cat](/static/Java/JDK/JDK11-refer.jpg)

#### 4.2 Concurrent Mark -并发标记

并发地递归标记其他对象，5和8也被标记为live活对象。

![JDK11-Cat](/static/Java/JDK/JDK11-refer2.png)

#### 4.3 Relocate －移动对象

对比发现3、6、7是过期对象，也就是中间的两个灰色region需要被压缩清理，所以陆续将4、5、8对象移动到最右边的新Region。移动过程中，有个forward table纪录这种转向。

活的对象都移走之后，这个region可以立即释放掉，并且用来当作下一个要扫描的region的to region。所以理论上要收集整个堆，只需要有一个空region就OK了。

![JDK11-Cat](/static/Java/JDK/JDK11-refer3.jpg)

#### 4.4 Remap －修正指针

最后将指针都妥帖地更新指向新地址。上一个阶段的Remap，和下一个阶段的Mark是混搭在一起完成的，这样非常高效，省却了重复遍历对象图的开销。

![JDK11-Cat](/static/Java/JDK/JDK11-refer4.png)

### 5.没有G1占内存的Remember Set，没有Write Barrier的开销

G1 保证“每次GC停顿时间不会过长”的方式，是“每次只清理一部分而不是全部的Region”的增量式清理。
G1在独立清理某个Region时 , 就需要有RememberSet来记录Region之间的对象引用关系， 这样就能依赖它来辅助计算对象的存活性而不用扫描全堆， Remembered Set通常占了整个Heap的20%或更高。 这里G1还使用Write Barrier(写屏障)技术，G1在平时写引用时，GC移动对象时，都要同步去更新RememberSet，跟踪跨代跨Region间的引用，特别的重。而在CMS里只有新老生代间的CardTable，要轻很多。
ZGC几乎没有停顿(10ms)，所以划分Region并不是为了增量回收，每次都会对所有Region进行回收，所以也就不需要这个占内存的RememberSet了，又因为它暂时连分代都还没实现，所以完全没有Write Barrier。

### 6.支持Numa架构

现在多CPU插槽的服务器都是Numa架构(这个要google)了，比如两颗CPU插槽(24核)，64G内存的服务器，那其中一颗CPU上的12个核，访问从属于它的32G本地内存，要比访问另外32G远端内存要快得多。
JDK的 Parallel Scavenger 算法支持Numa架构，在SPEC JBB 2005 基准测试里获得40%的提升。
至于原理，就是申请堆内存时，对每个Numa Node的内存都申请一些，当一条线程分配对象时，根据当前是哪个CPU在运行的，就在靠近这个CPU的内存中分配，这条线程继续往下走，通常会重新访问这个对象，而且如果线程还没被切换出去，就还是这位CPU同志在访问，所以就快了。
但可惜CMS，G1不支持Numa，现在ZGC又重新做了简单支持。

### 7.并行

在ZGC官网上有介绍，前面基准测试中的32核服务器，128G堆的场景下，它的配置是：
20条ParallelGCThreads，在那三个极短的STW阶段并行的干活 － mark roots， weak root processing（StringTable, JNI Weak Handles,etc）和 relocate roots ；
4条ConcGCThreads，在其他阶段与应用并发地干活 － Mark，Process Reference，Relocate。 仅仅四条，高风亮节地尽量不与应用争抢CPU 。
ConcCGCThreads开始时各自忙着自己平均分配下来的Region，如果有线程先忙完了，会尝试“偷”其他线程还没做的Region来干活，非常勤奋。

### 8.单代

没分代，应该是ZGC唯一的弱点了(我为啥一定要用分代了?)。
分代原本是因为most object die young的假设，而让新生代和老生代使用不同的GC算法。
如果对整个堆做一个完整并发收集周期，持续的时间可能很长比如几分钟，而此期间新创建的对象，大致上只能当作活对象来处理，即使它们在这周期里其实早就死掉可以被收集了。如果有分代算法，新生对象都在一个专门的区域创建，专门针对这个区域的收集能更频繁更快，意外留活的对象更也少。