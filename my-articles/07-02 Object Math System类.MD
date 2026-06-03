##  JAVA 中常见的一些类

##  1 java.lang.Object类

Object类是Java程序中所有类的直接或间接父类

###  equals( ) 方法

用来比较两个对象是否相同，如果相同，则返回true，否则返回false，它比较的是两个对象状态和功能上的相同，而不是引用上的相同。
**怎样查看这些方法的源代码见 02章.pptx 中间的 2.4 如何查看到JDK源代码 部分**
java.lang.Object.equals() 方法的实现代码

```

    public boolean equals(Object obj) {
        return (this == obj);
    }
```

Integer.equals() 方法的实现代码
```

    public boolean equals(Object obj) {
        if (obj instanceof Integer) {
            return value == ((Integer)obj).intValue();
        }
        return false;
    }
```
java.lang.String.equals() 方法的实现代码

```
   public boolean equals(Object anObject) {
        if (this == anObject) {
            return true;
        }
        if (anObject instanceof String) {
            String anotherString = (String)anObject;
            int n = value.length;
            if (n == anotherString.value.length) {
                char v1[] = value;
                char v2[] = anotherString.value;
                int i = 0;
                while (n-- != 0) {
                    if (v1[i] != v2[i])
                        return false;
                    i++;
                }
                return true;
            }
        }
        return false;
    }
```

代码见：ch07. eq.TestEqualsInteger
```
//ch07. eq.TestEqualsInteger
public class TestEqualsInteger {
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		testEq(127,127);
		testEq(128,128); 
	
	}
	public static void testEq(Integer i1,Integer i2) {
		System.out.println("i="+i1+"\t i1==i2:"+(i1==i2));
		System.out.println("i="+i1+"\t i1.equals(i2):"+(i1.equals(i2)));
	}

}
```

运行结果如下：
```
i=127	 i1==i2:true
i=127	 i1.equals(i2):true  
i=128	 i1==i2:false  #为什么？
i=128	 i1.equals(i2):true
```

运行如下代码

代码见：ch07. eq.TestEqualsString

```
//ch07. eq.TestEqualsString
package ch07.eq;
public class TestEqualsString {
 	public static void main(String[] args) {
	   String s1 = new String("1234");
	   String s2 = new String("1234");
	   System.out.println( s1==s2 );   
	   System.out.println( s1.equals(s2) );  
	   
	   String s3 = "12";
	   String s4 = "1"+"2";
	   System.out.println( s3==s4 );   
	   System.out.println( s3.equals(s4) );  
	   for(int i=1;i<2;i++) {
		   String s5=String.valueOf(i)+String.valueOf(i+1);
		   String s6=String.valueOf(i)+String.valueOf(i+1);
		   System.out.println( s5==s6  );  
	   }
	}
}
```
看一下运行结果，想一想为什么？



使用 课程网盘/相关软件/jd-gui-5.exe 对 TestEqualsString.class 进行反编译，结果如下：
```
package ch07.eq;

import java.io.PrintStream;

public class TestEqualsString
{
  public static void main(String[] args)
  {
    String s1 = new String("1234");
    String s2 = new String("1234");
    System.out.println(s1 == s2);
    System.out.println(s1.equals(s2));

    String s3 = "12";
    String s4 = "12";
    System.out.println(s3 == s4);
    System.out.println(s3.equals(s4));
    for (int i = 1; i < 2; ++i) {
      String s5 = String.valueOf(i) + String.valueOf(i + 1);
      String s6 = String.valueOf(i) + String.valueOf(i + 1);
      System.out.println(s5 == s6);
    }
  }
}
```


代码见: ch07. eq.TestEqualsObject

```
//ch07. eq.TestEqualsObject 
package ch07.eq;

class MyDate {
	int day, month, year;
	public MyDate(int i, int j, int k) {
		day = i;
		month = j;
		year = k;
	}
}
class MyOkDate extends MyDate {
	public MyOkDate(int i, int j, int k) {
		super(i, j, k);
	}
    
	public boolean equals(Object obj) {
		if (obj instanceof MyOkDate) {
			MyOkDate m = (MyOkDate) obj;
			if (m.day == day && m.month == month && m.year == year)
				return true;
		}
		return false;
	}
}

public class TestEqualsObject {
	public static void main(String[] args) {
		Object o = "";
		MyDate m1 = new MyDate(24, 3, 2001);
		MyDate m2 = new MyDate(24, 3, 2001);
		System.out.println(m1.equals(m2)); // 不相等,显示false
		m1 = new MyOkDate(24, 3, 2001);
		m2 = new MyOkDate(24, 3, 2001);
		System.out.println(m1.equals(m2)); // 相等,显示true
	}
}
```

运行结果：
```
false
true
true
true
false

```
**结论：**

-  **==的情况太复杂**

-  **需要判断相等的时候 使用 equals 最保险** 

-  **自定义类，如果需要有相等比较的时候，一定要实现 equals  方法**

-   思考：public boolean equals(Object obj) 为什么参数不是 public boolean equals(MyOkDate obj)  ? 


###  getClass( ) 方法

getClass ( )方法是final方法，它不能被重载。它返回一个对象在运行时所对应的类的表示，从而可以得到相应的信息。

代码见: ch07.clazz.ClazzDemo

```
package ch07.clazz;

public class ClazzDemo {
	public static void main(String[] args) {
		String str="123";
		Object obj=new Object();
		System.out.println(str.getClass());
		System.out.println(obj.getClass());		
		System.out.println(obj instanceof String);	
		System.out.println(str instanceof Object);
		obj=str;
		System.out.println(obj instanceof String);
		System.out.println(obj.getClass());
	}
}
```

运行结果：
```
class java.lang.String
class java.lang.Object
false
true
true
class java.lang.String
```

注意：

- **在需要判断 a  是否是A 的实例，或者子类实例的时候，应该用 instanceof A 判断，而不能用 getClass()之后比较字符串来判断。**
- **记住面向对象的原型，父类能做到的，子类也能做到 青出于蓝而胜于蓝！**

###  toString( )

toString( )方法用来返回对象的字符串表示，可以用来显示一个对象。

通过重载toString ( )方法可以适当地显示对象的信息以进行调试。



```

class MyDate {
	int day, month, year;
	public MyDate(int i, int j, int k) {
		day = i;
		month = j;
		year = k;
	}
}

class MyOkDate extends MyDate {
	public MyOkDate(int i, int j, int k) {
		super(i, j, k);
	}
	//override了父类的toString()方法
	public String toString() {
		return year + "-" + month + "-" + day;
	}
}

public class Demo {
	public static void main(String[] args) {
		MyDate m1 = new MyDate(24, 3, 2001);
		Object o;
		
		MyDate m2 = new MyOkDate(24, 3, 2001);
		System.out.println(m1); // 显示MyDate@132f0db
		System.out.println(m2); // 显示2001-3-24
		
		int[] a= {1,2,3};
		System.out.println(a); 
	}
}

```

###  finalize( )

运行如下代码，看发生什么？为什么？

```
import java.util.*;

class MyObject {
	protected void finalize() throws Throwable {
		System.out.println("MyObject finalize");
		super.finalize(); // 注意这行话的位置
	}
}

public class Demo {
	public static void main(String[] args) {
		// 调用 finalize 的示例
		MyObject myobj = new MyObject();
		System.out.println("gc() 1");
		System.gc();
		myobj = null;
		System.out.println("gc() 2");
		System.gc();
		test();
		System.out.println("gc() 3");
		System.gc();
		myobj = new MyObject();
		List list = new ArrayList();
		list.add(myobj);
		myobj = null;
		System.gc();
	}

	public static void test() {
		MyObject myobj = new MyObject();
	}

}


```

运行如下代码，看发生什么？为什么？

```
import java.util.*;
class MyObject {
	static long id=0;
	private long myId=id++;
	protected void finalize() throws Throwable {
		System.out.println("MyObject finalize,id="+myId);
		super.finalize(); // 注意这行话的位置
	}
}

public class Demo {
	public static void main(String[] args) {
		// 调用 finalize 的示例
		while(true) {
		MyObject myobj = new MyObject();
		}		
	}

}
```


**结论：**

**虽然没有手工的调用System.gc()，但是因为内存可能不够用，java虚拟机还是自动的执行了System.gc()，导致很多对象销毁。**



运行如下代码，看发生什么？为什么？

```

import java.util.*;

class MyObject {
	static long id=0;
	private long myId=id++;
	protected void finalize() throws Throwable {
		System.out.println("MyObject finalize,id="+myId);
		super.finalize(); // 注意这行话的位置
	}
}

public class Demo {
	public static void main(String[] args) {
		// 调用 finalize 的示例
		List list = new LinkedList();
		while (true) {
			MyObject myobj = new MyObject();
			list.add(myobj);
			if(list.size()%1000000==0) {
				System.out.println("list size="+list.size());
			}
			myobj=null;
		}
	}
}
```

**结论：**

- **最后导致内存溢出。**
- **如果一个对象存在引用（放到List中），对象是不会被释放 ，最后导致内存溢出。**
- **Java虚拟机能使用多少内存是一个可配置参数，默认并不是使用所有的内存,在大型项目中需要对内存参数进行调整。例如：**

```
java -Xms256m -Xmx1g -Xss256k MyApp
注意  -Xms256m -Xmx1g -Xss256k  部分是参数 java 每次不变，MyApp是你类的名字
```



# 2 基本数据类型封装包

Java的基本数据类型用于定义简单的变量和属性将十分方便，但为了与面向对象的环境一致，Java中提供了基本数据类型的包装类（wrapper），它们是这些基本类型的面向对象的代表。与8种基本数据类型相对应，基本数据类型的包装类也有8种，分别是：Character->char; Byte->byte;Short->short;Integer->int; Long->long;Float->float;Double->double;Boolean->boolean

这几个类有以下共同特点。

（1）这些类都提供了一些常数，以方便使用，如Integer.MAX_VALUE（整数最大值）， Double.NaN(非数字)，Double. POSITIVE_INFINITY（正无穷）等。

（2）提供了valueOf(String)，toString()，用于从字符串转换及或转换成字符串。

（3）通过xxxxValue()方法可以得到所包装的值，Integer对象的intValue()方法。

（4）对象中所包装的值是不可改变的（immutable）。要改变对象中的值只有重新生成新的对象。

（5）toString(), equals()等方法进行了覆盖。

除了以上特点外，有的类还提供了一些实用的方法以方便操作。例如，Double类就提供了更多的方法来与字符串进行转换。

```
class demo {
	public static void main(String[] args) {
		double d;
		String s;

		// double转成string的几种方法
		d = 3.14159;
		s = "" + d;
		s = Double.toString(d);
		s = new Double(d).toString();
		s = String.valueOf(d);

		// String转成double的几种方法
		s = "3.14159";
		try {
			d = Double.parseDouble(s);
			d = new Double(s).doubleValue();
			d = Double.valueOf(s).doubleValue();
		} catch (NumberFormatException e) {
			e.printStackTrace();
		}
	}
}
```



关于Double.NaN例子：

```
public class Demo {
	public static void main(String[] args) {
		System.out.println(0/0.0); 
		System.out.println(1/0.0);  
		System.out.println( Math.sqrt(-1.0));		
	}

}
```

运行结果如下：

```
NaN
Infinity
NaN
```

运行如下代码：

```
public class Demo {
	public static void main(String[] args) {
		System.out.println(1/0);  	
	}

}
```

上面的代码为什么能编译过去？运行结果如下（为什么？）：

```
Exception in thread "main" java.lang.ArithmeticException: / by zero
	at Demo.main(Demo.java:16)
```



# 3 Math类

## 1.  **常量**：

   - `Math.PI`：圆周率，π 的近似值，约等于 3.141592653589793。
   - `Math.E`：自然对数的底数，e 的近似值，约等于 2.718281828459045。

## 2.   **基本算术函数**：

   - `Math.abs(x)`：返回 x 的绝对值。
   - `Math.max(x, y)`：返回 x 和 y 中的较大值。
   - `Math.min(x, y)`：返回 x 和 y 中的较小值。
   - `Math.sqrt(x)`：返回 x 的平方根。
   - `Math.pow(x, y)`：返回 x 的 y 次幂。
   - `Math.cbrt(x)`：返回 x 的立方根。

##  **3. 三角函数**：

   - `Math.sin(x)`：返回 x（弧度）的正弦值。
   - `Math.cos(x)`：返回 x（弧度）的余弦值。
   - `Math.tan(x)`：返回 x（弧度）的正切值。
   - `Math.asin(x)`：返回 x 的反正弦值（弧度）。
   - `Math.acos(x)`：返回 x 的反余弦值（弧度）。
   - `Math.atan(x)`：返回 x 的反正切值（弧度）。
   - `Math.atan2(y, x)`：返回从原点到点 (x, y) 的角度（弧度）。

##  4. 指数和对数函数：

   - `Math.exp(x)`：返回 e 的 x 次幂。
   - `Math.log(x)`：返回 x 的自然对数（以 e 为底）。
   - `Math.log10(x)`：返回 x 的常用对数（以 10 为底）。

##  5.  舍入函数：

   - `Math.round(x)`：将 x 四舍五入到最接近的整数。
   - `Math.floor(x)`：返回小于或等于 x 的最大整数。
   - `Math.ceil(x)`：返回大于或等于 x 的最小整数。
   - `Math.rint(x)`：返回最接近 x 的整数，如果 x 位于两个整数之间，则返回偶数。

##  6.随机数生成：

   - `Math.random()`：返回一个随机的双精度浮点数，范围在 0.0 到 1.0 之间。


# 4 System类



`java.lang.System` 类是提供了与系统相关的一些属性和方法，用于执行与系统相关操作。

### 1. **系统属性**
`System` 类提供了访问系统属性的方法，这些属性是关于运行环境的信息，例如操作系统、Java 版本等。

- **获取系统属性**：
  ```java
  String osName = System.getProperty("os.name"); // 获取操作系统名称
  String javaVersion = System.getProperty("java.version"); // 获取 Java 版本
  String userHome = System.getProperty("user.home"); // 获取用户主目录
  ```

- **常用系统属性**：
  - `os.name`：操作系统的名称。
  - `os.version`：操作系统的版本。
  - `os.arch`：操作系统的架构（如 x86、amd64）。
  - `java.version`：Java 运行时环境的版本。
  - `java.home`：Java 安装目录。
  - `user.name`：当前用户的账户名称。
  - `user.home`：当前用户的主目录。
  - `user.dir`：用户当前的工作目录。

运行如下代码：

```
import java.util.Properties;

public class Demo {
    public static void main(String[] args) {
        // 获取所有系统属性
        Properties properties = System.getProperties();

        // 遍历并打印所有系统属性
        properties.forEach((key, value) -> {
            System.out.println(key + ": " + value);
        });
    }

}
```

结果如下：

```
sun.cpu.isalist: amd64
sun.desktop: windows
sun.io.unicode.encoding: UnicodeLittle
sun.cpu.endian: little
java.vendor.url.bug: http://bugreport.sun.com/bugreport/
file.separator: \
java.vendor: Oracle Corporation
sun.boot.class.path: C:\Java\jre1.8.0_102\lib\resources.jar;C:\Java\jre1.8.0_102\lib\rt.jar;C:\Java\jre1.8.0_102\lib\sunrsasign.jar;C:\Java\jre1.8.0_102\lib\jsse.jar;C:\Java\jre1.8.0_102\lib\jce.jar;C:\Java\jre1.8.0_102\lib\charsets.jar;C:\Java\jre1.8.0_102\lib\jfr.jar;C:\Java\jre1.8.0_102\classes
java.ext.dirs: C:\Java\jre1.8.0_102\lib\ext;C:\Windows\Sun\Java\lib\ext
java.version: 1.8.0_102
java.vm.info: mixed mode
awt.toolkit: sun.awt.windows.WToolkit
user.language: zh    #####和默认日期格式 相关
java.specification.vendor: Oracle Corporation
sun.java.command: Demo
java.home: C:\Java\jre1.8.0_102
sun.arch.data.model: 64
java.vm.specification.version: 1.8
java.class.path: C:\temp\code_demo\bin
user.name: Administrator
file.encoding: UTF-8     #####和文件读取乱码相关
java.specification.version: 1.8
java.awt.printerjob: sun.awt.windows.WPrinterJob
user.timezone: 
user.home: C:\xxx\xxx
os.version: 10.0
sun.management.compiler: HotSpot 64-Bit Tiered Compilers
java.specification.name: Java Platform API Specification
java.class.version: 52.0
java.library.path: C:\Java\jre1.8.0_102\bin;C:\Windows\Sun\Java\bin;C:\Windows\system32
sun.jnu.encoding: GBK  #####乱码 相关
os.name: Windows 10
user.variant: 
java.vm.specification.vendor: Oracle Corporation
java.io.tmpdir: C:\Users\Local\Temp\
line.separator: 

java.endorsed.dirs: C:\Java\jre1.8.0_102\lib\endorsed
os.arch: amd64
java.awt.graphicsenv: sun.awt.Win32GraphicsEnvironment
java.runtime.version: 1.8.0_102-b14
java.vm.specification.name: Java Virtual Machine Specification
user.dir: C:\temp\code_demo
user.country: CN  #####和默认日期格式 相关
user.script: 
sun.java.launcher: SUN_STANDARD
sun.os.patch.level: 
java.vm.name: Java HotSpot(TM) 64-Bit Server VM
file.encoding.pkg: sun.io
path.separator: ;
java.vm.vendor: Oracle Corporation
java.vendor.url: http://java.oracle.com/
sun.boot.library.path: C:\Java\jre1.8.0_102\bin
java.vm.version: 25.102-b14
java.runtime.name: Java(TM) SE Runtime Environment
```



### 2. **系统时间**

`System` 类提供了获取当前时间的方法，这些方法返回的时间单位是毫秒。

- **获取当前时间（毫秒）**：
  ```java
  long currentTimeMillis = System.currentTimeMillis();//返回1970年1月1日以来的毫秒数
  long startTimeNano = System.nanoTime();//这个纳秒只能用来做减法计算时间差，不承诺从什么时间开始
  
  ```
  
- **用途**：
  
  - 常用于计算时间间隔、日志记录、时间戳生成等。

例如：

```
public class Demo {
    public static void main(String[] args) {
        long startTimeMillis = System.currentTimeMillis();//返回1970年1月1日以来的毫秒数
        long startTimeNano = System.nanoTime();//这个纳秒只能用来做减法计算时间差，不承诺从什么时间开始
        long sum = 0;
        for (int i = 1; i <= 10000000; i++) {
            sum += i;
        }
        long endTimeMillis = System.currentTimeMillis();
        long timeTakenMillis = endTimeMillis - startTimeMillis;
        long endTimeNano = System.nanoTime();
        long timeTakenNano = endTimeNano - startTimeNano;
        System.out.println("使用 System.currentTimeMillis() 统计：从 1 加到 10,000,000 所需的时间是: " + timeTakenMillis + " 毫秒");
        System.out.println("使用 System.nanoTime() 统计：从 1 加到 10,000,000 所需的时间是: " + timeTakenNano + " 纳秒");
    }
}
```

输出结果如下：

```
使用 System.currentTimeMillis() 统计：从 1 加到 10,000,000 所需的时间是: 5 毫秒
使用 System.nanoTime() 统计：从 1 加到 10,000,000 所需的时间是: 5125500 纳秒
```



### 3. **系统输入输出**

`System` 类提供了标准输入输出流，这些流是程序与外部交互的重要方式。

- **标准输入流**：
  ```java
  InputStream in = System.in; // 标准输入流，通常对应键盘输入
  ```

- **标准输出流**：
  ```java
  PrintStream out = System.out; // 标准输出流，通常对应屏幕输出
  PrintStream err = System.err; // 标准错误流，通常用于输出错误信息
  ```

- **重定向输出流**：
  ```java
  System.setOut(new PrintStream(new FileOutputStream("output.txt"))); // 将标准输出重定向到文件
  System.setErr(new PrintStream(new FileOutputStream("error.txt"))); // 将标准错误输出重定向到文件
  ```

### 4. **系统运行时**
`System` 类提供了与运行时环境交互的方法，例如加载类库、退出程序等。

- **退出程序**：
  
  ```java
  System.exit(0); // 正常退出程序
  System.exit(1); // 异常退出程序
  ```
  

### 5. **垃圾回收**
虽然垃圾回收主要由 JVM 管理，但 `System` 类提供了一个方法来建议 JVM 进行垃圾回收。

- **建议垃圾回收**：
  ```java
  System.gc(); // 建议 JVM 进行垃圾回收
  ```

### 6. **数组拷贝**
`System` 类提供了一个高效的方法来拷贝数组内容。

- **数组拷贝**：
  ```java
  int[] src = {1, 2, 3, 4, 5};
  int[] dest = new int[5];
  System.arraycopy(src, 0, dest, 0, src.length); // 拷贝数组
  ```

**数组也是对象**

```
public class Demo {
	public static void main(String[] args) {
		int[] a = {1,2,3};
		int[] b = {1,2,3};
		System.out.println(a instanceof Object);
		System.out.println(a.hashCode());
		System.out.println("数组的类信息: " + a.getClass());
		System.out.println("数组是否相等: " + a.equals(b));		 
	}
}
```



### 7. **环境变量**

`System` 类提供了获取环境变量的方法。

- **获取环境变量**：
  ```java
  String path = System.getenv("PATH"); // 获取 PATH 环境变量
  ```

