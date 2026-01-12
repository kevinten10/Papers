#### 之前Java的模式匹配

* JavaSwitch仅支持单值匹配，只能在switch匹配语句中匹配单一值
* JavaSwitch仅支持int类型匹配，只能基于整型进行相等性判断
    * byte/short/char，可以向上转为int类型而不损失精度，所以这三种基本类型可以使用switch进行匹配
        * char 取 unicode 整型码值
    * String/Enum，作为JDK的内置类型，编译器会分别调用 hashCode()/ordinal()方法产生int结果，从而进行匹配
        * 计算并比较 hashcode，如果 hashcode 相同，则进一步使用 equals 确定字符串内容相同，处理两个字符串 hashcode 相同的情况
* break 在字节码层面上会生成一条 goto 语句，case 下不带 break 时直接进入下一个 case 逻辑

#### JDK12更丰富的模式匹配

* 支持多值匹配
* 支持表达式赋值
* 抽象语法表述

```java
public void jdk12switch() {
    Weekday day = Weekday.MON;
    // 1. JDK12中扩展了switch可以作为表达式
    System.out.println(switch (day) {
        case MON, TUE, WEN -> "上半周";
        case THU, FRI -> "下半周";
        case SAT, SUN ->
                """
                <html>
                    <p>周末</p>
                </html>
                """;
    });
    // 2. 将表达式的值赋值给一个变量 => to old
    String text = switch (day) {
        case MON, TUE, WEN -> "上半周";
        case THU, FRI -> "下半周";
        case SAT, SUN -> "周末";
    };
    System.out.println(text);
    // 3. 通过yield产生一个新的值
    day = Weekday.SAT;
    int x = switch (day) {
        case MON, TUE, WEN -> 1;
        case THU, FRI -> {
            System.out.println();
            yield 2;
        }
        case SAT, SUN -> {
            int rnd = (int) (Math.random() * 10);
            System.out.println("rnd = " + rnd);
            yield rnd;
        }
    };
    System.out.println(x);
}
```

> 将开发者从复杂繁琐的低层次抽象中逐渐解放出来，以更高层次更优雅的抽象，既降低代码量，又避免意外编程错误的出现，进而提高代码质量和开发效率。

#### Scala现代化的模式匹配

* 计算表达式的匹配（值绑定）
* 区间表达式匹配
* ......