**Java继承体系中的类型赋值规则与向上/向下转型**

```
// ============================================
// 继承体系：Person（父类）← Man/Woman（子类）
// 展示Java引用类型的赋值规则
// ============================================

class Person {
}
class Man extends Person {
}
class Woman extends Person {
}

public class Demo {
    public static void main(String[] args) {    	
        Person p = new Person();
        Man m = new Man();    
        Woman w = new Woman();

        //尝试一下如下代码哪些编译报错，哪些运行报错
        
        m=(Man)p;
        w=(Woman)p;
        
        Person p1 = m;      
        Person p2 = w;              
        
        Person p3 = new Man();      
        Man m1 = (Man) p3;          
        Woman w1 = (Woman) p3;    
    
        Man m2 = new Woman();     
        Woman w2 = new Man();
        
        m=(Man)w;
    }

}
```



总结：

| 左边（引用类型） | 右边（实际对象）    |    是否合法     |
| :--------------- | :------------------ | :-------------: |
| Person           | new Person()        |        ✓        |
| Person           | new Man()           |        ✓        |
| Person           | new Woman()         |        ✓        |
| Man              | new Man()           |        ✓        |
| Man              | new Person()        |      编译✗      |
| Man              | (Man)new Person()   | 编译✓ 运行可能✗ |
| Woman            | new Woman()         |        ✓        |
| Woman            | new Person()        |      编译✗      |
| Woman            | (Woman)new Person() |  编译✓ 运行必✗  |
| Woman            | new Man()           |      编译✗      |
| Woman            | (Woman)new Man()    |  编译✓ 运行必✗  |
| Man              | new Woman()         |      编译✗      |
| Man              | (Man)new Woman()    |  编译✓ 运行必✗  |