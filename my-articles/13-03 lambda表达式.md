Lambda表达式是Java 8引入的一个非常强大的特性，它允许你以更简洁的方式实现函数式接口（即只有一个抽象方法的接口）。Lambda表达式在遍历集合、排序等操作中非常方便。

## Lambda表达式的基本语法

```java
(参数列表) -> {
    // 方法体
}
```
- **参数列表**：可以有零个或多个参数，参数类型可以省略（类型推断）。
- **箭头符号**：`->`，表示参数和方法体之间的分隔。
- **方法体**：可以是单条语句或代码块。如果方法体只有一条语句，可以省略大括号 `{}` 和 `return` 关键字。

## 例子：

### 示例1：遍历Map

在Java中，可以使用Lambda表达式来遍历`Map`的键、值或键值对。

```java
import java.util.HashMap;
import java.util.Map;

public class Demo {
    public static void main(String[] args) {
        // 创建一个Map
        Map<String, Integer> map = new HashMap<>();
        map.put("Alice", 25);
        map.put("Bob", 30);
        map.put("Charlie", 35);
        
        // 遍历Map的键
        System.out.println("遍历Map的键：");
        for (String key : map.keySet()) {
            System.out.println(key);
        }

        // 遍历Map的值
        System.out.println("遍历Map的值：");
        for (Integer value : map.values()) {
            System.out.println(value);
        }

        // 遍历Map的键值对
        System.out.println("遍历Map的键值对：");
        for (Map.Entry<String, Integer> entry : map.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
        
        // 使用Lambda表达式遍历Map的键
        System.out.println("遍历Map的键：");
        map.keySet().forEach(key -> System.out.println(key));

        // 使用Lambda表达式遍历Map的值
        System.out.println("遍历Map的值：");
        map.values().forEach(value -> System.out.println(value));

        // 使用Lambda表达式遍历Map的键值对
        System.out.println("遍历Map的键值对：");
        map.forEach((key, value) -> System.out.println(key + ": " + value));
    }
}
```

### 示例2：排序
Lambda表达式可以用于对集合进行排序，例如对`List`进行排序。

```java
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

public class Demo {
    public static void main(String[] args) {
        // 创建一个List
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");

        // 使用Lambda表达式对List进行自然排序
        System.out.println("自然排序：");
        names.sort((s1, s2) -> s1.compareTo(s2));
        names.forEach(System.out::println);

        // 使用Lambda表达式对List进行长度排序
        System.out.println("按长度排序：");
        names.sort((s1, s2) -> Integer.compare(s1.length(), s2.length()));
        names.forEach(System.out::println);
    }
}
```

### 示例3：使用方法引用
方法引用是Lambda表达式的一种简化形式，它可以直接引用已有的方法。方法引用可以进一步简化代码。

```java
import java.util.Arrays;
import java.util.List;

public class Demo {
    public static void main(String[] args) {
        // 创建一个List
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");

        // 使用方法引用对List进行自然排序
        System.out.println("自然排序（方法引用）：");
        names.sort(String::compareTo);
        names.forEach(System.out::println);

        // 使用方法引用对List进行长度排序
        System.out.println("按长度排序（方法引用）：");
        names.sort(Comparator.comparingInt(String::length));
        names.forEach(System.out::println);
    }
}
```

### 示例4：过滤和映射
Lambda表达式还可以与流（Stream）API结合使用，进行过滤、映射等操作。

```java
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class Demo {
    public static void main(String[] args) {
        // 创建一个List
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");

        // 使用Lambda表达式过滤长度大于3的字符串
        List<String> filteredNames = names.stream()
                .filter(name -> name.length() > 3)
                .collect(Collectors.toList());
        System.out.println("过滤后的名字：");
        filteredNames.forEach(System.out::println);

        // 使用Lambda表达式将名字映射为大写形式
        List<String> upperCaseNames = names.stream()
                .map(String::toUpperCase)
                .collect(Collectors.toList());
        System.out.println("大写后的名字：");
        upperCaseNames.forEach(System.out::println);
    }
}
```

