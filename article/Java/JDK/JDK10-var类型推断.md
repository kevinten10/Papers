#### var声明的可读性建议

1、使用 var 声明时，可以对齐左侧变量的名称，去除冗余的信息，使得代码变的清爽。

```java
// with explicit types
No no = new No();
AmountIncrease<BigDecimal> more = new BigDecimalAmountIncrease();
HorizontalConnection<LinePosition, LinePosition> jumping =
    new HorizontalLinePositionConnection();
Variable variable = new Constant(5);
List<String> names = List.of("Max", "Maria");
 
// with inferred types
var no = new No();
var more = new BigDecimalAmountIncrease();
var jumping = new HorizontalLinePositionConnection();
var variable = new Constant(5);
var names = List.of("Max", "Maria");
```

> 当我们需要使代码更清晰，更简洁的同时不会丢失掉一些重要信息，那就使用var。

2、考虑构造函数的场景，将两次的类型声明节省到一次，避免重复和样板代码

```java
Map<User, List<String>> userChannels = new HashMap<>();
 
var userChannels = new HashMap<User, List<String>>();
```

3、显式类型不一定可读性就高。在有的时候，冗杂的显式类型声明会妨碍可读性。

但也要注意，如果右侧代码没有办法清晰的说明变量类型 或者 依赖了具体的类型(如特定对象) 时，最好还是使用显式类型。

```java
InternationalCustomerOrderProcessor<AnonymousCustomer, SimpleOrder<Book>> orderProcessor = createInternationalOrderProcessor(customer, order);
```

> 它就像王大娘的裹脚一般，又臭又长，一个很简单的功能要写到吐血，中间还夹叙夹议才能保证语义明确，避免后期维护的时候看不懂写的什么。

#### var的使用原则

不要为了读写代码方便而进行优化，而应该优化可维护性。如果奔着可维护性去优化代码，随着程序的不断迭代，自然会在可读性和代码量上能找到平衡点。

关于var和可读性间的权衡，终极建议是：使用好变量名！由于var省略了变量的类型，读代码的人只能去猜测代码的真实意图，因此作为开发人员更有义务要为局部变量取一个好的名字。理论上来说这也是Java开发人员应该做的。不过在实践中，其实Java代码的很多可读性问题并不是语言特性引起的，更多还是目前大家的做法导致的，比如说变量命名。

#### 编译器原理

编译器在处理 **var** 变量的时候，会去检测右侧代码的声明，并将其类型用于左侧，这一过程发生在初始化阶段。

JIT在编译成字节码的时候使用的是推断后的结果类型，在class文件中只会保存具体的类型声明。

