# 0 和字符 相关的 类

程序中需要用到的字符串可以分为两大类，一类是创建之后不会再做修改和变动的字符串常量；

另一类是创建之后允许再做更改和变化的字符串。前者是String类，后者是StringBuffer/StringBuilder类。

Java API提供了四个处理字符数据的类：

Character：这个类的实例可以容纳单一的字符数值。该类还定义了一些简洁的方法来操作或者检查单一字符数据。 

String：这个类用于处理由多个字符组成的不可变数据。 

StringBuffer：这个类用于存储和操作由多个字符组成的可变数据。

StringBuilder:类似StringBuffer

# 1 Character



在 Java 中，`Character` 类是 `char` 基本类型的包装类，提供了许多静态方法用于操作和检查单个字符。以下是 **`Character` 类的常用方法和重要知识点**：

---

## **一、核心方法**

#### **1. 类型检查（静态方法）**
```java
Character.isLetter(char ch);       // 是否是字母（包括 Unicode 字母）
Character.isDigit(char ch);        // 是否是数字（0-9）
Character.isWhitespace(char ch);   // 是否是空白字符（空格、\t、\n 等）
Character.isUpperCase(char ch);    // 是否是大写字母
Character.isLowerCase(char ch);    // 是否是小写字母
Character.isLetterOrDigit(char ch);// 是否是字母或数字
Character.isDefined(char ch);      // 是否在 Unicode 中定义
```

#### 2. 大小写转换
```java
Character.toUpperCase(char ch);    // 转换为大写
Character.toLowerCase(char ch);    // 转换为小写
```

####  3. 字符比较
```java
Character.compare(char a, char b); // 比较两个字符（返回 int）
```

####  4. 字符转字符串
```java
Character.toString(char ch);      // 字符转字符串（String）
```

##  二、装箱与拆箱
`Character` 是 `char` 的包装类，支持自动装箱和拆箱：
```java
char c = 'A';
Character boxed = c;              // 自动装箱（char → Character）
char unboxed = boxed;             // 自动拆箱（Character → char）
```

---

## **三、常量字段**
```java
Character.MIN_VALUE;   // char 的最小值（\u0000）
Character.MAX_VALUE;   // char 的最大值（\uffff）
```

---

## **四、特殊字符处理**
#### **1. 转义字符**
Java 中的 `char` 可以表示转义字符：
```java
char ch = '\0';      // 制表符
char tab = '\t';      // 制表符
char newline = '\n';   // 换行符
char returnline='r';  //回车符
char unicode = '\u0041'; // Unicode 字符（'A'）
```

- 在 **Unix/Linux/macOS** 系统中，`\n` 是标准的换行符。
- 在 **Windows** 系统中，虽然标准的换行符是 `\r\n`，但大多数程序（如文本编辑器）也会正确处理 `\n`
- 在网络通信中，HTTP 协议等也使用 `\r\n` 作为行结束符
- 如果你的程序需要在不同操作系统上运行，建议使用 `System.lineSeparator()` 来获取当前系统的换行符

例如：

```
public class Demo {
    public static void main(String[] args) {
       String sep=System.lineSeparator();
       char[] chars=sep.toCharArray();
       for(char c:chars) {
    	   System.out.println((int)c);//这个地方去掉(int) 会出现什么现象？
       }
    }
}
```

输出：

```
13
10
```


---

## **六、示例代码**

例子1 

```java
public class Demo {
    public static void main(String[] args) {
        char ch = '7';
        System.out.println(Character.isDigit(ch));   // true
        System.out.println(Character.toUpperCase('a')); // 'A'
        System.out.println(Character.getNumericValue('F')); // 15（16进制）
        
        // Unicode 示例
        System.out.println(Character.isLetter('β')); // true（希腊字母）
    }
}
```

例子2 

```java
public class Demo {
	public static void main(String[] args) {
		for (int i = Character.MIN_VALUE; i <= Character.MAX_VALUE; i++) {
			if (Character.isDefined((char) i)) {//是否在 Unicode 标准中有定义
				System.out.print((char) i);
				if (i % 50 == 0) {
					System.out.println();
				}
			}
		}
	}
}
```

---

## **七、注意事项**
1. 不可变性：Character 对象一旦创建，其值不可变。
2. 性能：静态方法优于对象方法（如 Character.isLetter() 比 charValue() 更高效）。
3. Unicode 支持：Java 的 char 是 UTF-16 编码，可能需用 int 处理增补字符。
   
   Java 的 char 是 16 位无符号整数（范围 \u0000 到 \uffff）。 UTF-16 是一种变长编码：大部分常用字符用 1 个 char 表示，但增补字符（如 emoji、某些罕见汉字）需要 2 个 char（称为代理对，Surrogate Pair），例如：

```
public class Demo {
    public static void main(String[] args) {
        String emoji = "😀";  //   emoji
        
        System.out.println("字符串: " + emoji);
        System.out.println("字符串长度 (length()): " + emoji.length());           // 输出 2
        System.out.println("实际字符数 (codePointCount): " + emoji.codePointCount(0, emoji.length()));  // 输出 1
        System.out.println("charAt(0): " + Integer.toHexString(emoji.charAt(0)));   
        System.out.println("charAt(1): " + Integer.toHexString(emoji.charAt(1)));  
         
    }
}
```



生僻字

```
public class Demo {
    public static void main(String[] args) {
        // 这些汉字都在 BMP 之外，需要代理对
        // 𪚥 (U+2A6A5) - 四个"龍"组成的字
        testChar("𪚥", "四龙字");
        // 𰻝 (U+30EDD) - 陕西 biángbiáng 面的 biáng 字
        testChar("𰻝", "biáng字");
        // 对比：普通汉字在 BMP 内，只需 1 个 char
        testChar("中", "普通汉字");
        testChar("龍", "普通繁体");
    }
    
    static void testChar(String ch, String desc) {
        System.out.println("===== " + desc + " =====");
        System.out.println("字符: " + ch);
        System.out.println("Unicode: U+" + Integer.toHexString(ch.codePointAt(0)).toUpperCase());
        System.out.println("length(): " + ch.length() + " (char数量)");
        System.out.println("codePointCount: " + ch.codePointCount(0, ch.length()) + " (实际字符数)");
        
        if (ch.length() == 2) {
            System.out.println("高位代理: 0x" + Integer.toHexString(ch.charAt(0)).toUpperCase());
            System.out.println("低位代理: 0x" + Integer.toHexString(ch.charAt(1)).toUpperCase());
        }
        System.out.println();
    }

}
```




# 2 String –不变类

使用字符串常量时，需要创建String对象，和其它对象不同，String对象可以通过简单赋值语句创建：

## 关于String的构造函数

在Java中，`String`类提供了多种构造函数，用于创建字符串对象。以下是`String`类的所有构造函数：

### 1. **`String()`**
   - 创建一个空字符串对象。
   - 示例：
     ```java
     public class Demo {
     	public static void main(String[] args) {
     		//str是空串
     		String str = new String();
     		System.out.println(str); 
     		//str2是null
     		String str2=null;
     		System.out.println(str2);  
     	}
     }
     ```

### 2. **`String(byte[] bytes)`**
   - 使用指定的字节数组创建字符串对象。使用平台默认的字符集将字节解码为字符。
   - 示例：
     ```java
     public class Demo {
     	public static void main(String[] args) {
     		byte[] bytes = {72, 101, 108, 108, 111};
     		String str = new String(bytes);
     		System.out.println(str); // 输出：Hello
     	}
     }
     ```



输出：

```
Hello
```



### 3. **`String(byte[] bytes, int offset, int length)`**

   - 使用指定的字节数组的一部分创建字符串对象。从`offset`位置开始，长度为`length`的字节子数组被解码为字符串。
   - 示例：
     ```java
     byte[] bytes = {72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100};
     String str = new String(bytes, 6, 5);
     System.out.println(str); // 输出：World
     ```

### 4. **`String(byte[] bytes, String charsetName)`**
   - 使用指定的字节数组和字符集名称创建字符串对象。指定的字符集用于解码字节。
   - 关于String 中 charsetName 用法，以后会单独讲。
   - 示例：
     ```java
     import java.io.UnsupportedEncodingException;
     
     public class Demo {
     	public static void main(String[] args) {		
     		try {
     			String str;
     			byte[] bytes = {72, 101, 108, 108, 111};
     			str = new String(bytes, "UTF-8");
     			System.out.println(str);  
     			str = new String(bytes,"GBK" );
     			System.out.println(str);  
     			byte[] bytes2  = {-28,-67,-96,-27,-91,-67};
     			str = new String(bytes2, "UTF-8");
     			System.out.println(str);  
     			str = new String(bytes2,"GBK" );
     			System.out.println(str);  
     			str = new String(bytes2);
     			System.out.println(str); 
     		} catch (UnsupportedEncodingException e) {
     			// TODO Auto-generated catch block
     			e.printStackTrace();
     		}
     		
     
     	}
     }
     ```





### 5. **`String(byte[] bytes, int offset, int length, String charsetName)`**

   - 使用指定的字节数组的一部分和字符集名称创建字符串对象。从`offset`位置开始，长度为`length`的字节子数组被解码为字符串。
   - 示例：
     ```java
     byte[] bytes = {72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100};
     String str = new String(bytes, 6, 5, "UTF-8");
     System.out.println(str); // 输出：World
     ```

### 6. **`String(byte[] bytes, Charset charset)`**
   - 使用指定的字节数组和字符集对象创建字符串对象。
   - 示例：
     ```java
     byte[] bytes = {72, 101, 108, 108, 111};
     String str = new String(bytes, StandardCharsets.UTF_8);
     System.out.println(str); // 输出：Hello
     ```


### 8. **`String(char[] value)`**
   - 使用指定的字符数组创建字符串对象。
   - 示例：
     ```java
     char[] chars = {'H', 'e', 'l', 'l', 'o'};
     String str = new String(chars);
     System.out.println(str); // 输出：Hello
     ```


### 11. **`String(StringBuilder sb)`**
- 使用`StringBuilder`对象的内容创建字符串对象。
- 示例：
  ```java
  StringBuilder sb = new StringBuilder("Hello");
  String str = new String(sb);
  System.out.println(str); // 输出：Hello
  ```

### 12. **`String(StringBuffer sb)`**
- 使用`StringBuffer`对象的内容创建字符串对象。
- 示例：
  ```java
  StringBuffer sb = new StringBuffer("Hello");
  String str = new String(sb);
  System.out.println(str); // 输出：Hello
  ```

## 关于String.valueOf(Object obj); 

`String.valueOf` 是 Java 中一个非常实用的静态方法，用于将各种类型的对象或数据转换为字符串。以下是 `String.valueOf` 的各种用法：

### 1. **`String.valueOf(Object obj)`**
   - 如果 `obj` 是 `null`，返回字符串 `"null"`。
   - 如果 `obj` 不是 `null`，则调用 `obj.toString()` 方法。
   - 示例：
     ```java
     public class Demo {
         public static void main(String[] args) {
         	Object obj = new Object();
         	String str = String.valueOf(obj);
        	System.out.println(str); // 输出对象的字符串表示形式
         	
         	obj = null;
         	str = String.valueOf(obj);
         	System.out.println(str); // 输出：null
         }
     }
     ```


### 2. **`String.valueOf(char[] data)`**
   - 将字符数组转换为字符串。
   - 示例：
     ```java
     char[] chars = {'H', 'e', 'l', 'l', 'o'};
     String str = String.valueOf(chars);
     System.out.println(str); // 输出：Hello
     ```

### 3. **`String.valueOf(char[] data, int offset, int count)`**
   - 将字符数组的一部分转换为字符串，从 `offset` 开始，长度为 `count`。
   - 示例：
     ```java
     char[] chars = {'H', 'e', 'l', 'l', 'o', ' ', 'W', 'o', 'r', 'l', 'd'};
     String str = String.valueOf(chars, 6, 5);
     System.out.println(str); // 输出：World
     ```

### 4. **`String.valueOf(boolean b)`**
   - 将布尔值转换为字符串，`true` 转换为 `"true"`，`false` 转换为 `"false"`。
   - 示例：
     ```java
     boolean b = true;
     String str = String.valueOf(b);
     System.out.println(str); // 输出：true
     ```

### 5. **`String.valueOf(char c)`**
   - 将单个字符转换为字符串。
   - 示例：
     ```java
     char c = 'A';
     String str = String.valueOf(c);
     System.out.println(str); // 输出：A
     ```

### 6. **`String.valueOf(int i)`**
   - 将整数转换为字符串。
   - 示例：
     ```java
     int i = 123;
     String str = String.valueOf(i);
     System.out.println(str); // 输出：123
     ```

### 7. **`String.valueOf(long l)`**
   - 将长整数转换为字符串。
   - 示例：
     ```java
     long l = 1234567890L;
     String str = String.valueOf(l);
     System.out.println(str); // 输出：1234567890
     ```

### 8. **`String.valueOf(float f)`**
   - 将浮点数转换为字符串。
   - 示例：
     ```java
     float f = 3.14f;
     String str = String.valueOf(f);
     System.out.println(str); // 输出：3.14
     ```

### 9. **`String.valueOf(double d)`**
   - 将双精度浮点数转换为字符串。
   - 示例：
     ```java
     double d = 3.14159;
     String str = String.valueOf(d);
     System.out.println(str); // 输出：3.14159
     ```



`String.valueOf` 是一个非常灵活的方法，可以处理各种类型的对象和数据，将其转换为字符串。它在处理 `null` 值时特别方便，避免了直接调用 `toString()` 方法可能导致的 `NullPointerException`。

```
public class Demo {
	public static void main(String[] args) {
		Object obj=null;
		System.out.println(String.valueOf(obj)); // 这句话输出 null
		System.out.println(obj.toString()); // 这句话抛异常,Exception in thread "main" java.lang.NullPointerException
	}

}
```




## String 常用的函数用法

### 1. **`length()`**
   - **用途**：返回字符串的长度（字符数）。
   - **示例**：
     ```java
     String str = "Hello, World!";
     int length = str.length();
     System.out.println("Length of the string: " + length); // 输出：Length of the string: 13
     ```

### 2. **`charAt(int index)`**
   - **用途**：返回指定索引处的字符。
   - **示例**：
     ```java
     String str = "Hello";
     char c = str.charAt(1); // 索引从0开始
     System.out.println("Character at index 1: " + c); // 输出：Character at index 1: e
     ```

### 3. **`substring(int beginIndex)`**
   - **用途**：返回从指定索引到字符串末尾的子字符串。
   - **示例**：
     ```java
     String str = "Hello, World!";
     String subStr = str.substring(7);
     System.out.println("Substring from index 7: " + subStr); // 输出：Substring from index 7: World!
     ```

### 4. **`substring(int beginIndex, int endIndex)`**
   - **用途**：返回从 `beginIndex` 到 `endIndex - 1` 的子字符串。
   - **示例**：
     ```java
     String str = "Hello, World!";
     String subStr = str.substring(0, 5);
     System.out.println("Substring from index 0 to 5: " + subStr); // 输出：Substring from index 0 to 5: Hello
     ```

### 5. **`toLowerCase()`**
   - **用途**：将字符串中的所有字符转换为小写。
   - **示例**：
     ```java
     String str = "Hello, World!";
     String lowerCase = str.toLowerCase();
     System.out.println("Lowercase string: " + lowerCase); // 输出：Lowercase string: hello, world!
     ```

### 6. **`toUpperCase()`**
   - **用途**：将字符串中的所有字符转换为大写。
   - **示例**：
     ```java
     String str = "Hello, World!";
     String upperCase = str.toUpperCase();
     System.out.println("Uppercase string: " + upperCase); // 输出：Uppercase string: HELLO, WORLD!
     ```

### 7. **`trim()`**
   - **用途**：去除字符串首尾的空白字符。
   - **示例**：
     ```java
     String str = "   Hello, World!   ";
     String trimmed = str.trim();
     System.out.println("Trimmed string: [" + trimmed + "]"); // 输出：Trimmed string: [Hello, World!]
     ```

### 8. **`replace(CharSequence target, CharSequence replacement)`**
   - 注意CharSequence是一个接口，String,StringBuffer,StringBuilder都实现了这个接口

   - **用途**：将字符串中所有匹配的子字符串替换为指定的字符串。

   - **示例**：
     
     ```java
     String str = "Hello, World!";
     String replaced = str.replace("World", "Java");
     System.out.println("Replaced string: " + replaced); // 输出：Replaced string: Hello, Java!
     ```



```java
	String str = "Hello, World!";
	StringBuffer b1=new StringBuffer("World");
	StringBuffer b2=new StringBuffer("Java");
	String replaced = str.replace(b1, b2);
	System.out.println("Replaced string: " + replaced); // 输出：Replaced string: Hello, Java!
```
### 9. **`contains(CharSequence s)`**

   - **用途**：检查字符串是否包含指定的子字符串。
   - **示例**：
     ```java
     String str = "Hello, World!";
     boolean contains = str.contains("Hello");
     System.out.println("Contains 'Hello': " + contains); // 输出：Contains 'Hello': true
     ```

### 10. **`startsWith(String prefix)`**
- **用途**：检查字符串是否以指定的前缀开头。
- **示例**：
  ```java
  String str = "Hello, World!";
  boolean startsWithHello = str.startsWith("Hello");
  System.out.println("Starts with 'Hello': " + startsWithHello); // 输出：Starts with 'Hello': true
  ```

### 11. **`endsWith(String suffix)`**
- **用途**：检查字符串是否以指定的后缀结尾。
- **示例**：
  
  ```java
  String str = "Hello, World!";
  boolean endsWithWorld = str.endsWith("World!");
  System.out.println("Ends with 'World!': " + endsWithWorld); // 输出：Ends with 'World!': true
  ```

### 12. **`equals(Object anObject)`**
- **用途**：比较两个字符串是否相等（区分大小写）。
- **示例**：
  ```java
  String str1 = "Hello";
  String str2 = "hello";
  boolean isEqual = str1.equals(str2);
  System.out.println("Strings are equal: " + isEqual); // 输出：Strings are equal: false
  ```

### 13. **`equalsIgnoreCase(String anotherString)`**
- **用途**：比较两个字符串是否相等（不区分大小写）。
- **示例**：
  ```java
  String str1 = "Hello";
  String str2 = "hello";
  boolean isEqualIgnoreCase = str1.equalsIgnoreCase(str2);
  System.out.println("Strings are equal ignoring case: " + isEqualIgnoreCase); // 输出：Strings are equal ignoring case: true
  ```

### 14. **`indexOf(int ch)`**
- **用途**：返回指定字符在字符串中第一次出现的索引。
- **示例**：
  ```java
  String str = "Hello, World!";
  int index = str.indexOf('o');
  System.out.println("Index of 'o': " + index); // 输出：Index of 'o': 4
  ```

### 15. **`indexOf(String str)`**
- **用途**：返回指定子字符串在字符串中第一次出现的索引。
- **示例**：
  ```java
  String str = "Hello, World!";
  int index = str.indexOf("World");
  System.out.println("Index of 'World': " + index); // 输出：Index of 'World': 7
  ```

### 16. **`lastIndexOf(int ch)`**
- **用途**：返回指定字符在字符串中最后一次出现的索引。
- **示例**：
  ```java
  String str = "Hello, World!";
  int index = str.lastIndexOf('o');
  System.out.println("Last index of 'o': " + index); // 输出：Last index of 'o': 8
  ```

### 17. **`lastIndexOf(String str)`**
- **用途**：返回指定子字符串在字符串中最后一次出现的索引。
- **示例**：
  ```java
  String str = "Hello, World!";
  int index = str.lastIndexOf("Hello");
  System.out.println("Last index of 'Hello': " + index); // 输出：Last index of 'Hello': 0
  ```

### 18. **`concat(String str)`**
- **用途**：将指定的字符串连接到当前字符串的末尾。
- **示例**：
  ```java
  String str1 = "Hello";
  String str2 = "World";
  String concatenated = str1.concat(" ").concat(str2);
  System.out.println("Concatenated string: " + concatenated); // 输出：Concatenated string: Hello World
  ```

### 19. **`isEmpty()`**
- **用途**：检查字符串是否为空（长度为0）。
- **示例**：
  ```java
  String str1 = "";
  String str2 = "Hello";
  boolean isEmpty1 = str1.isEmpty();
  boolean isEmpty2 = str2.isEmpty();
  System.out.println("String 1 is empty: " + isEmpty1); // 输出：String 1 is empty: true
  System.out.println("String 2 is empty: " + isEmpty2); // 输出：String 2 is empty: false
  System.out.println("String 2 is empty: " + str3.isEmpty();); 
  ```

下列代码的运行结果是什么？

```
	String str3=null;
	System.out.println("String 2 is empty: " + str3.isEmpty()); 
```

**注意如果一个对象obj=null,那么大部分情况下obj.xxx()方法都会抛出空指针异常。**

例如：

```
public class Demo {
    public static void main(String[] args) {
        Object obj = null;
        obj.toString(); // 这里会抛出NullPointerException
    }
}
```

运行结果如下：

```
Exception in thread "main" java.lang.NullPointerException
	at Demo.main(Demo.java:7)
```

但是把这个obj作为参数不一定会抛出异常，例如:

```
public class Demo {
    public static void main(String[] args) {
        Object obj = null;
        System.out.println(obj);        
    }
}
```



运行结果如下：

```
null
```



这个情况下 运行结果会怎样？

```
class MyClass {
    public static void myMethod() {
        System.out.println("This is a static method");
    }
}

public class Demo{
    public static void main(String[] args) {
        MyClass obj = null;
        obj.myMethod(); 
    }
}
```



### 20. **`matches(String regex)`**

- **用途**：检查字符串是否匹配指定的正则表达式。
- **示例**：
  ```java
  String str = "Hello123";
  boolean matches = str.matches(".*\\d+.*"); // 匹配包含数字的字符串
  System.out.println("Matches regex: " + matches); // 输出：Matches regex: true
  ```
### 21. **`split(String regex)`**
- **用途**：用于根据给定的正则表达式将字符串拆分为子字符串数组。
- **正则表达式：**更多内容后面会简单介绍，现在需要的时候问AI
- **示例**：
  

	```
  String str = "Java Python C++ JavaScript";
  String[] languages = str.split(" "); // 按空格分割
  for (String lang : languages) {
    System.out.println(lang);
  }
  ```
  输出：
  ```
  Java
  Python
  C++
  JavaScript
  ```
  
  再比如：
  ```
	public static void main(String[] args) {
		String content="第一回 甄士隐梦幻识通灵 贾雨村风尘怀闺秀\r\n 这里是正文一万字" + 
				"\r\n" + 
				"第二回 贾夫人仙逝扬州城 冷子兴演说荣国府\r\n 这里是正文一万字" + 
				"\r\n" + 
				"第三回 托内兄如海荐西宾 接外孙贾母惜孤女\r\n 这里是正文一万字" + 
				"\r\n" + 
				"第四回 薄命女偏逢薄命郎 葫芦僧判断葫芦案\r\n 这里是正文一万字" + 
				"\r\n" + 
				"第五回 游幻境指迷十二钗 饮仙醪曲演红楼梦\r\n 这里是正文一万字" + 
				"\r\n" ; 				
		String chapts[] = content.split("第[一,二,三,四,五,六,七,八,九,十,零]{1,5}回 ");	//正则表达式拆分
	
		for (int i=0;i<chapts.length;i++) {
			System.out.println("第"+i+"回="+chapts[i]);
		}
	}
	```

 ```


输出：

 ```
第0回=
第1回=甄士隐梦幻识通灵 贾雨村风尘怀闺秀
 这里是正文一万字

第2回=贾夫人仙逝扬州城 冷子兴演说荣国府
 这里是正文一万字

第3回=托内兄如海荐西宾 接外孙贾母惜孤女
 这里是正文一万字

第4回=薄命女偏逢薄命郎 葫芦僧判断葫芦案
 这里是正文一万字

第5回=游幻境指迷十二钗 饮仙醪曲演红楼梦
 这里是正文一万字

# 3 StringBuffer

```

## StringBuffer

### 1. **构造方法**
- **`StringBuffer()`**
  - 创建一个空的 `StringBuffer` 对象。
  - 示例：
​```java
    StringBuffer sb = new StringBuffer();
    System.out.println("Initial StringBuffer: " + sb); // 输出：Initial StringBuffer:
```

### **`2. StringBuffer(String str)`**

- 使用指定的字符串初始化 `StringBuffer`。
- 示例：

```java
    StringBuffer sb = new StringBuffer("Hello");
    System.out.println("StringBuffer with initial string: " + sb); // 输出：StringBuffer with initial string: Hello
```

```

### 2. **`append()`**
- **用途**：将指定的内容追加到 `StringBuffer` 的末尾。
- 示例：
​```java
  StringBuffer sb = new StringBuffer("Hello");
  sb.append(", ");
  sb.append("World!");
  System.out.println("Appended StringBuffer: " + sb); // 输出：Appended StringBuffer: Hello, World!
```

### 3. **`insert(int offset, String str)`**
- **用途**：在指定位置插入字符串。
- 示例：
```java
  StringBuffer sb = new StringBuffer("HelloWorld");
  sb.insert(5, ", ");
  System.out.println("Inserted StringBuffer: " + sb); // 输出：Inserted StringBuffer: Hello, World
```

### 4. **`delete(int start, int end)`**
- **用途**：删除从 `start` 到 `end - 1` 的子字符串。
- 示例：
  ```java
  StringBuffer sb = new StringBuffer("Hello, World!");
  sb.delete(7, 12);
  System.out.println("Deleted StringBuffer: " + sb); // 输出：Deleted StringBuffer: Hello,
  ```

### 5. **`replace(int start, int end, String str)`**
- **用途**：用指定的字符串替换从 `start` 到 `end - 1` 的子字符串。
- 示例：
  ```java
  StringBuffer sb = new StringBuffer("Hello, World!");
  sb.replace(7, 12, "Java");
  System.out.println("Replaced StringBuffer: " + sb); // 输出：Replaced StringBuffer: Hello, Java!
  ```

### 6. **`reverse()`**
- **用途**：反转 `StringBuffer` 中的字符。
- 示例：
  ```java
  StringBuffer sb = new StringBuffer("Hello");
  sb.reverse();
  System.out.println("Reversed StringBuffer: " + sb); // 输出：Reversed StringBuffer: olleH
  ```

### 7. **`toString()`**
- **用途**：将 `StringBuffer` 转换为字符串。
- 示例：
  ```java
  StringBuffer sb = new StringBuffer("Hello");
  String str = sb.toString();
  System.out.println("String from StringBuffer: " + str); // 输出：String from StringBuffer: Hello
  ```

### 8. **`length()`**
- **用途**：返回 `StringBuffer` 的长度（字符数）。
- 示例：
  ```java
  StringBuffer sb = new StringBuffer("Hello");
  int length = sb.length();
  System.out.println("Length of StringBuffer: " + length); // 输出：Length of StringBuffer: 5
  ```


### 10. **`charAt(int index)`**
- **用途**：返回指定索引处的字符。
- 示例：
  ```java
  StringBuffer sb = new StringBuffer("Hello");
  char c = sb.charAt(1);
  System.out.println("Character at index 1: " + c); // 输出：Character at index 1: e
  ```

### 11. **`setCharAt(int index, char ch)`**
- **用途**：设置指定索引处的字符。
- 示例：
  ```java
  StringBuffer sb = new StringBuffer("Hello");
  sb.setCharAt(1, 'a');
  System.out.println("Modified StringBuffer: " + sb); // 输出：Modified StringBuffer:Hallo
  ```

### 12. **`substring(int start)`**
- **用途**：返回从指定索引开始到末尾的子字符串。
- 示例：
  ```java
  StringBuffer sb = new StringBuffer("Hello, World!");
  String subStr = sb.substring(7);
  System.out.println("Substring from index 7: " + subStr); // 输出：Substring from index 7: World!
  ```

### 13. **`substring(int start, int end)`**
- **用途**：返回从 `start` 到 `end - 1` 的子字符串。
- 示例：
  ```java
  StringBuffer sb = new StringBuffer("Hello, World!");
  String subStr = sb.substring(0, 5);
  System.out.println("Substring from index 0 to 5: " + subStr); // 输出：Substring from index 0 to 5: Hello
  ```

### 14. **`indexOf(String str)`**
- **用途**：返回指定子字符串第一次出现的索引。
- 示例：
  ```java
  StringBuffer sb = new StringBuffer("Hello, World!");
  int index = sb.indexOf("World");
  System.out.println("Index of 'World': " + index); // 输出：Index of 'World': 7
  ```

### 15. **`lastIndexOf(String str)`**
- **用途**：返回指定子字符串最后一次出现的索引。
- 示例：
  ```java
  StringBuffer sb = new StringBuffer("Hello, World! World!");
  int index = sb.lastIndexOf("World");
  System.out.println("Last index of 'World': " + index); // 输出：Last index of 'World': 13
  ```

# 4. StringBuiler

用法同StringBuiler。区别仅仅StringBuilder：**线程非安全**的   StringBuffer：**线程安全**的   不理解线程安全、非安全没关系 后面章节会讲

# 5. CharSequence接口

```java
public interface CharSequence {

 int length();

char charAt(int index);

...

}
```

String和StringBuffer StringBuilder 都实现了CharSequence接口

#  6. String和StringBuffer StringBuilder 关系和区别：

- 速度方面：StringBuilder>StringBuffer>>String   
- StringBuffer与StringBuilder是可变对象，String是不变对象。
- StringBuilder：**线程非安全**的   StringBuffer：**线程安全**的   不理解线程安全、非安全没关系 后面章节会讲

例子：ch07.StrBufStrBuilder

理解三者之间速度区别
```
public class Demo {
	public StrBufStrBuilder() {
	}

	public static void main(String[] args) {
		/*
		 * 比较String StringBuffer StringBuilder的区别
		 */
		String str="";
		StringBuffer sbf=new StringBuffer();
		StringBuilder sbd=new StringBuilder();
		
		int times=50000;
		long l=System.currentTimeMillis();
		
		for(int i=0;i<times;i++) {
			str=str+"abc";			 
		}
		System.out.println("String :"+(System.currentTimeMillis()-l)+" ms cost!");
		
		l=System.currentTimeMillis();
		for(int i=0;i<times;i++) {
			sbf.append("abc");
		}
		System.out.println("StringBuffer :"+(System.currentTimeMillis()-l)+" ms cost!");
		
		l=System.currentTimeMillis();
		for(int i=0;i<times;i++) {
			sbd.append("abc");
		}
		System.out.println("StringBuilder :"+(System.currentTimeMillis()-l)+" ms cost!");
	}

}

```

运行结果：

```
String :28766 ms cost!
StringBuffer :6 ms cost!
StringBuilder :3 ms cost!
```

# 7.理解 String的不变性和 StringBuffer StringBuilder的可变性

在Java中，`String`是不可变的字符串类，而`StringBuffer`是可变的字符串类。以下是通过具体例子来说明它们的特性：

## 1\. String的不变性

例如：

```java
public class Demo {
  public static void main(String[] args) {
		String str1 = "Hello";		
		String str2 = str1;
		System.out.println("str1的初始值：" + str1+" str2="+str2);
		System.out.println("修改前str1的内存地址：" + System.identityHashCode(str1));
		System.out.println("修改前str2的内存地址：" + System.identityHashCode(str2));
		// 尝试修改str1的值
		str1 = str1 + " World";
		System.out.println("修改后的str1：" + str1+" str2="+str2);
		System.out.println("修改后str1的内存地址：" + System.identityHashCode(str1));
		System.out.println("修改前str2的内存地址：" + System.identityHashCode(str2));
  }
}
```

System.identityHashCode(Object x) 返回的是基于对象在 JVM 堆内存中的**物理地址**计算出的哈希码，而不是对象内容。

运行结果：

```
str1的初始值：Hello str2=Hello
修改前str1的内存地址：366712642
修改前str2的内存地址：366712642
修改后的str1：Hello World str2=Hello
修改后str1的内存地址：1829164700
修改前str2的内存地址：366712642

```

**说明：**

- 当我们对`str1`进行修改（如`str1 = str1 + " World"`）时，`str1`的值从`"Hello"`变成了`"Hello World"`，但这并不是在原字符串的基础上修改，而是创建了一个新的字符串对象，并将引用指向了新的对象。
- 从内存地址的变化也可以看出，每次修改字符串后，`str1`的内存地址都发生了变化，说明每次操作都会生成一个新的字符串对象，而原来的字符串对象仍然存在，只是没有被引用了。这就是`String`的不可变性。

## 2\. StringBuffer的可变性（StringBuilder同StringBuffer 区别仅仅在线程是否安全）

例如：

```java
public class  Demo {
    public static void main(String[] args) {
        StringBuffer sb = new StringBuffer("Hello");
        StringBuffer sb2=sb;
        System.out.println("sb的初始值：" + sb+" sb2="+sb2);
        System.out.println("修改前sb的内存地址：" + System.identityHashCode(sb));
        System.out.println("修改前sb2的内存地址：" + System.identityHashCode(sb2));
        // 修改sb的值
        sb.append(" World");
        System.out.println("修改后的sb：" + sb+" sb2="+sb2);
        System.out.println("修改后sb的内存地址：" + System.identityHashCode(sb));
        System.out.println("修改后sb2的内存地址：" + System.identityHashCode(sb2));
    }
}
```

运行结果：

```
sb的初始值：Hello sb2=Hello
修改前sb的内存地址：366712642
修改前sb2的内存地址：366712642
修改后的sb：Hello World sb2=Hello World
修改后sb的内存地址：366712642
修改后sb2的内存地址：366712642
```

## 3. 通过函数参数修改String和StringBuffer的结果

例如：

```
public class Demo {
    public static void main(String[] args) {
        // 测试 String
        String originalString = "Hello";
        modifyString(originalString);
        System.out.println("String after modification: " + originalString); // 输出：Hello

        // 测试 StringBuffer
        StringBuffer originalStringBuffer = new StringBuffer("Hello");
        modifyStringBuffer(originalStringBuffer);
        System.out.println("StringBuffer after modification: " + originalStringBuffer.toString()); // 输出：HelloWorld
    }
    
    // 修改 String 参数的函数
    public static void modifyString(String str) {
        str = str + "World"; // 修改 str，但这不会影响调用方的 originalString
    }
    
    // 修改 StringBuffer 参数的函数
    public static void modifyStringBuffer(StringBuffer sb) {
        sb.append("World"); // 直接修改 sb 的内容
    }

}
```

运行结果：

```
String after modification: Hello
StringBuffer after modification: HelloWorld
```



**说明：**

- `StringBuffer`对象可以通过`append()`等方法直接修改其内容。在上面的例子中，`sb.append(" World")`操作直接在原来的`StringBuffer`对象上追加了内容，而不是创建一个新的对象。
- 从内存地址可以看出，无论我们对`StringBuffer`对象进行多少次修改，它的内存地址始终不变，说明它是在同一个对象上进行内容的修改，这就是`StringBuffer`的可变性。

总结

- `String`是不可变的，一旦创建，其内容不能被修改。每次对字符串进行操作时，都会创建一个新的字符串对象。
- `StringBuffer`是可变的，可以在同一个对象上直接修改内容，不会创建新的对象。



## 4. 不变性和可变性另外的一个例子

```java
class Person{
	 String name;
	public Person(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	@Override
	public String toString() {
		return "Person{name='" + name + "'}";
		
	}
	/*
	@Override
	protected Object clone() throws CloneNotSupportedException {
		// TODO Auto-generated method stub
		return new Person(this.name);
	}
	*/
	@Override
	protected Person clone()  {
		// TODO Auto-generated method stub
		
		return new Person(this.name);
	}
	

}

public class Demo {
	public static void main(String[] args) {
		String s1="123" ;
		String s2=s1;
		s2="456";
		System.out.println("s1= " + s1);
		System.out.println("s2= " + s2); 		

		Person p1 = new Person("li");
		Person p2 = p1;
		p2.setName("zhang");
		System.out.println("p1:" + p1);
		System.out.println("p2:" + p2);	
		
		p1 = new Person("li");
		p2 = p1.clone();
		p2.setName("zhang");
		System.out.println("p1:" + p1);
		System.out.println("p2:" + p2);				
		
	}
}
```

```


```