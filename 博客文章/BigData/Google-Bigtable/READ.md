# Google Bigtable

## 1 摘要

分布式 结构化

## 2 介绍

用户可以动态控制数据的分布和格式

bigtable将存储的数据都视为字符串

## 3 数据模型

bigtable是一个稀疏的、分别式的、持久化存储的多维度排序map，

map的索引是行关键字、列关键字以及时间戳，map的每个value都是一个未经解析的byte数组

(row:string, column:string, time:int64) -> string

### 3.1 行

行关键字可以是任意的字符串

行的读写是原子的

通过行关键字的字典顺序来组织数据

表中的每个行都可以动态分区，每个分区叫做一个tablet，tablet十数据分布和负载均衡调整的最小单位

### 3.2 列族

访问控制的基本单位。磁盘和内存的使用统计都是在列祖层面进行的

### 3.3 时间戳

表中的每一个数据项都可以包含同一份数据的不同版本，通过时间戳来索引

## 4 API

## 5

## 6 介绍

一个master服务器和多个tablet服务器。tablet可动态添加删除

客户端读取的数据不经过master，直接与tablet进行

任何时刻，一个tablet之恩能够分配给一个tablet服务器i

tablet的持久化状态信息保存在GFS上

更新操作提交到REDO日志，最近提交存放在培训的缓存中，（memtable）

当memetable不断增加，当达到门限值时，会被冻结，创建一个新的memtable。

冻结的memetable被转换成SSTbale，写入GFS中

## 7 优化

TODO 

## 8 性能评估

XXX

