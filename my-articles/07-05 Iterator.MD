在 Java 中，`Iterator` 是一个接口，用于遍历集合中的元素。它提供了一种通用的方式来逐个访问集合中的元素，而无需暴露集合的内部结构。`Iterator` 主要用于集合类（如 `List`、`Set` 等），并且支持在遍历过程中删除元素。

以下是 `Iterator` 的常见用法和示例。



# 1. `Iterator`接口的定义 

```java
package java.util;
public interface Iterator<E> {
	boolean hasNext();
	E next();
    default void remove() {
        throw new UnsupportedOperationException("remove");
    }
...

}
```

主要方法：
    
1. **`hasNext()`**：检查集合中是否还有下一个元素。
2. **`next()`**：返回集合中的下一个元素。
3. **`remove()`**：删除集合中最后一个通过 `next()` 返回的元素。



# 2. Collection接口的定义

```java
public interface Collection<E> extends Iterable<E> {
...}

```

# 3. Iterable接口定义

```
public interface Iterable<T> {
    Iterator<T> iterator();
	...
}
```

# 4. Iterable和Iterator的关系

**实现了Iterable的类能够通过iterator()方法返回一个iterator对象。**




![输入图片说明](att/java_collection.png)

# 5 结论： List/Set 都是支持Iterator的 ( 但是没有Map)

**但是Map.entrySet()/keySet()/values()支持Iterator**

Map 定义如下：

```java 
public interface Map<K,V> {
    ...
    Set<Map.Entry<K, V>> entrySet();
    ...
}       
```



# 6 关于for each

在Java中，`for-each` 循环（也称为增强型 `for` 循环）是一种简化迭代操作的语法。它适用于以下几种结构：

### 1. **数组**
`for-each` 循环可以方便地遍历数组中的每个元素。

#### 示例代码：
```java
int[] numbers = {1, 2, 3, 4, 5};
for (int number : numbers) {
    System.out.println(number);
}

String text = "Hello, World!";
for (char c : text.toCharArray()) {
    System.out.println(c);
}
```

### 2. **实现了 `Iterable` 接口的集合或者自定义对象**
`for-each` 循环可以用来遍历实现了 `Iterable` 接口的集合，例如：
- `List`（如 `ArrayList`、`LinkedList` 等）
- `Set`（如 `HashSet`、`TreeSet` 等）
- `Queue`（如 `LinkedList` 作为队列使用）

#### 示例代码：
```java
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Demo {
	public static void main(String[] args) {
		List names = new ArrayList();
		names.add("a");
		names.add("b");
		for (Object name : names) {
			System.out.println(name);
		}
		Set numbers = new HashSet();
		numbers.add(1);
		numbers.add(8);
		for (Object number : numbers) {
			System.out.println(number);
		}
	}
}
```

### 3. **不适用的结构**
`for-each` 循环不适用于以下情况：
- **普通对象**：没有实现 `Iterable` 接口的普通对象不能直接使用 `for-each` 循环。
- **`Map`**：`Map` 本身不能直接用于 `for-each` 循环，但可以通过 `Map` 的 `entrySet()`、`keySet()` 或 `values()` 方法将其转换为可迭代的集合。

#### 示例代码：
```java
import java.util.HashMap;
import java.util.Map;

public class Demo {
	public static void main(String[] args) {
		Map<Object,Object>  map =new HashMap(); 
		map.put("Alice", 25);
		map.put("Bob", 30);
		for (Map.Entry  entry : map.entrySet()) {
		    System.out.println(entry.getKey() + ": " + entry.getValue());
		}
	}

}
```



# 7 使用 `Iterator`

## 1 使用 `Iterator` 遍历 `ArrayList`

```java
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class Demo {
    public static void main(String[] args) {
        List list = new ArrayList();
        list.add("Apple");
        list.add("Banana");
        list.add("Cherry");

        // 获取 Iterator
        Iterator iterator = list.iterator();
        while (iterator.hasNext()) {
            String fruit = (String)iterator.next();
            System.out.println(fruit);
        }    
    }
}
```

## 2 示例：使用 `Iterator` 遍历 `HashSet`
```java
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

public class Demo {
    public static void main(String[] args) {
        Set set = new HashSet();
        set.add("Alice");
        set.add("Bob");
        set.add("Charlie");
        Iterator iterator = set.iterator();
        while (iterator.hasNext()) {
            String name = (String)iterator.next();
            System.out.println(name);
        }
    }
}
```

## 3 hasNext()和next()

1. **`hasNext()`**：检查集合中是否还有下一个元素。
2. **`next()`**：返回集合中的下一个元素，每次都会消耗掉一个元素。

#### 示例：**`next()`**会消耗掉一个元素,如下代码有什么错误？

```java
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class Demo {
	public static void main(String[] args) {
		Map map=new HashMap();
		map.put("1","a");
		map.put("2","b");
		Iterator it=map.keySet().iterator();
		while(it.hasNext()) {
			System.out.println("key="+it.next()+" value="+map.get(it.next()));
		}
	}
}
```

- 

### 示例：使用 `Iterator` 遍历 `Map`

虽然 `Map` 不直接实现 `Iterable` 接口，但可以通过 `entrySet()`、`keySet()` 或 `values()` 方法获取可迭代的视图，然后使用 `Iterator` 遍历。

```java
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class Demo {
    public static void main(String[] args) {
        Map map = new HashMap();
        map.put("Alice", 25);
        map.put("Bob", 30);
        map.put("Charlie", 35);

        Iterator iterator = map.entrySet().iterator();

        while (iterator.hasNext()) {
            Map.Entry entry = (Map.Entry) iterator.next();
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }
}
```

### 注意事项
1. **线程安全**：`Iterator` 本身不是线程安全的。如果在多线程环境中使用，需要额外的同步措施。**关于线程安全后面章节会专门讲。**
2. **`ConcurrentModificationException`**：在遍历集合时，如果直接修改集合（除了通过 `Iterator` 的 `remove()` 方法），可能会抛出 `ConcurrentModificationException`。
3. **`remove()` 方法的限制**：`Iterator` 的 `remove()` 方法只能删除通过 `next()` 返回的最后一个元素。如果尝试删除其他元素，会抛出 `IllegalStateException`。

# 8 关于集合元素的删除

## 1 示例：在遍历过程中删除元素

`Iterator` 提供了 `remove()` 方法，可以在遍历过程中安全地删除元素。这是在遍历集合时删除元素的推荐方式，因为直接使用集合的 `remove()` 方法可能会导致 `ConcurrentModificationException`。

```java
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class Demo {
    public static void main(String[] args) {
        List list = new ArrayList();
        List list2 = new ArrayList();  
        List list3 = new ArrayList(); 
        list.add("1");
        list.add("2");
        list.add("2");
        list.add("4");
        
        Iterator<String> iterator = list.iterator();
        while (iterator.hasNext()) {
            String fruit = (String)iterator.next();
            if (fruit.equals("2")) {
                iterator.remove(); // 安全删除元素
            }
        }
        System.out.println(list);
        
    }
}
```





## 2 抛出异常的情况

在Java中，遍历集合时直接删除其他元素（而不是通过迭代器的`remove()`方法删除当前元素）通常会抛出`ConcurrentModificationException`异常。这是因为集合的迭代器在遍历过程中会检查集合的结构是否被修改，如果检测到修改，就会抛出异常。

以下是一些常见的会导致`ConcurrentModificationException`异常的情况：

#### 1. 使用`for-each`循环删除元素

`for-each`循环内部使用的是迭代器，但它不提供`remove()`方法。如果在`for-each`循环中直接调用集合的`remove()`方法，会导致异常。

```java
import java.util.ArrayList;
import java.util.List;

public class Demo {
    public static void main(String[] args) {
        List  list = new ArrayList<>();
        list.add("Apple");
        list.add("Banana");
        list.add("Cherry");
        list.add("Grape");

        for (Object fruit : list) {
            if (fruit.equals("Banana")) {
                list.remove(fruit); // 抛出 ConcurrentModificationException
            }
        }
    }
}
```

#### 2. 使用迭代器删除非当前元素

即使使用迭代器，如果尝试删除非当前迭代器访问的元素，也会导致异常。

```java
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class Demo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("Apple");
        list.add("Banana");
        list.add("Banana");
        list.add("Cherry");

        Iterator<String> iterator = list.iterator();
        while (iterator.hasNext()) {
            String fruit = iterator.next();
            if (fruit.equals("Apple")) {
                list.remove("Banana"); // 抛出 ConcurrentModificationException
            }
        }
    }
}
```

#### 3. 使用普通`for`循环删除元素(不会抛出异常，但是可能导致结果错误)

如果在普通`for`循环中直接调用集合的`remove()`方法，也可能会导致异常，尤其是当从集合中删除元素时改变了集合的大小。

```java
import java.util.ArrayList;
import java.util.List;

public class Demo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("a");
        list.add("b");
        list.add("b");
        list.add("c");

        for (int i = 0; i < list.size(); i++) {
            if (list.get(i).equals("b")) {
                list.remove(i); 
            }
        }
        System.out.println(list);
    }
}
```

## 3 不会抛出异常的情况

以下是一些不会抛出`ConcurrentModificationException`异常的情况：

#### 1. 使用迭代器的`remove()`方法删除当前元素

这是安全的方式，只会删除当前迭代器访问的元素。

```java
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("Apple");
        list.add("Banana");
        list.add("Cherry");

        Iterator<String> iterator = list.iterator();
        while (iterator.hasNext()) {
            String fruit = iterator.next();
            if (fruit.equals("Banana")) {
                iterator.remove(); // 安全删除
            }
        }
        System.out.println(list); // 输出: [Apple, Cherry]
    }
}
```

#### 2. 使用`removeIf()`方法  （涉及lambda表达式）

`removeIf()`方法可以在遍历的同时安全地删除满足条件的元素。

```java
import java.util.ArrayList;
import java.util.List;

public class Demo {
    public static void main(String[] args) {
        List list = new ArrayList();
        list.add("Apple");
        list.add("Banana");
        list.add("Cherry");
		//涉及lambda表达式
        list.removeIf(fruit -> fruit.equals("Banana")); // 安全删除
        System.out.println(list); // 输出: [Apple, Cherry]
    }
}
```

#### 3. 使用`for`循环从后向前遍历

从后向前遍历集合时删除元素不会导致索引问题，因此是安全的。

```java
import java.util.ArrayList;
import java.util.List;

public class Demo {
    public static void main(String[] args) {
        List list = new ArrayList();
        list.add("a");
        list.add("b");
        list.add("b");
        list.add("c");

        for (int i = list.size() - 1; i >= 0; i--) {
            if (list.get(i).equals("b")) {
                list.remove(i); // 安全删除
            }
        }
        System.out.println(list); //  
    }
}

```

