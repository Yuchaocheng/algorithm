<!--
 * @Descripttion: 记录js基础的通用性问题
 * @Author: ycc
 * @Date: 2022-02-12 11:19:29
 * @LastEditTime: 2022-04-25 22:45:40
-->

## Number 类型精度问题

进制转换和对阶运算（先不提，对阶运算不是很好整）会带来精度问题

我们平常见到的 x=0.1，实际是取了 toPrecision(位数)，根据 js 的 53 次方精度进行了忽略，所以 x 为 0.1

110.1010
11.1010

1. 进制转换：计算机底层进行运算肯定是转成二进制进行运算的。所以说比如把 0.1 转成二进制

- 小数十进制转二进制规则：乘 2 取整，小数部分继续乘 2 取整。直到小数部分为 0
- 但是不一定能够完全转化，也就是说可能无限循环下去，这个时候进制转换就存在精度问题
- js 对于 Number 类型的存储使用的是 64 位浮点数的方式。
  - 第 1 位为符号位：代表 zhe 正负
  - 第 2 位到第 12 位（共 11 位）：指数部分（这里有 11 位，范围是-1023 ~ 1023 ），但是实际存储时其实是使用 basis + 当前值的形式，比如-4 次，存储的是-4 + 1023，这样做指数部分的表示全部都是正数了
  - 第 13 位到第 64 位（共 52 位）：有效数字部分

所以说因为 0.1 转化成二进制时时无效循环下去的，但是浮点数的精度只能到 52 位，所以说最终保存数据时精度已经丢失了，最终的结果不相等也就是正常的(除了进制转化，在运算时也可能丢失精度)

### 浮点数的运算

一般由以下五个步骤完成：对阶、尾数运算、规格化、舍入处理、溢出判断

1. 对阶：
   - 0.1 的二进制表示：1.1001100110011 \* 2^-4 阶码是-4
   - 0.2 的二进制表示：1.10011001100110 \* 2^-3 阶码是-3
   - 两个阶码不同的数完成计算时首先要转换成阶码相同的，转换原则是小阶向大阶转换，这样损失的精度更小
   - 0.2 对阶后变为：0.11001100110011 \* 2^-3
2. 尾数计算，即对应位置相加，结果为 10.0110011001100110011001100110011001100110011001100111 \* 2^-3
3. 规格化：1.0011001100110011001100110011001100110011001100110011(1) \* 2^-2
   括号里的 1 意思是说计算后这个 1 超出了范围，所以要被舍弃了
4. 舍入：超出返回的数进行舍入操作（二进制中是 0 舍 1 入），所以最后 1 位 1，应该进 1
   结果：1.0011001100110011001100110011001100110011001100110100 \* 2^-2

所以可以看到进制转换后的精度丢失，以及运算时存在的对阶和舍入都会造成精度丢失，最终造成 0.1+0.2 !== 0.3

## JS 数据类型

基本类型：Number、String、Boolean、undefined、null、Symbol、bigInit
引用类型：function、Array、Object

bigInit 主要是用来解决超大整数的计算问题。Number 类型只能保证 2^53 - 1 内的整数计算精度，而 bigInit 则可以解决这个问题，并且进行任意大数字的计算

## JS 整数如何表示

通过 Number 类型表示，在 js 底层，所有数字都是通过 64 位浮点数来表示，所以整数也一样。

## Number() 的存储空间是多大？如果后台发送了一个超过最大可表示的数字怎么办

2 的 53 次方，即 9007199254740992，如果超过这个值，返回的结果可能会出现截断。
解决办法：可以传回字符串。如果还要进行计算，可以转为 bigInit 类型进行计算，计算完成后再通过 toString()转成字符串

## 实现函数能够深度克隆基本类型

## 事件流

三个阶段

1. 事件捕获阶段：从 window 对象传导到目标节点（上层传到底层）
2. 处于目标阶段：在目标节点上触发
3. 事件冒泡阶段：从目标节点传导回 window 对象（从底层传回上层）

- 注意：浏览器总是假定 click 事件的目标节点，就是点击位置嵌套最深的那个节点
  所以 event.target 就是最深的那个节点，而 event.currentTarget 则是设置监听的那个节点

- 可以通过设置 addEventListener 的第三个参数，设置事件是在捕获阶段触发还是冒泡阶段触发

## 事件的实现原理

- 事件实现的基本原理是发布订阅模式，首先我们预先定义事件，比如通过 addeventListen 监听某个 click 事件，这其实就是向浏览器订阅了该 click 事件，浏览器在捕捉到用户点击后，会去 emit 就是发布这个事件，内部的回调函数就会执行

web 端 Dom 事件分为几类：

1. dom 节点通过 onclick 绑定事件，这种方式的局限性就是无法给一个节点绑定多个同类型事件，绑定多个后面覆盖前面的。 并且也无法设置触发阶段
2. 通过 addEventListener 注册事件和移除事件，可以绑定多个同类型事件，并且可以设置触发阶段，即捕获阶段触发还是冒泡阶段触发
3. CSS 中的事件，比如 hover、focus 等等

## new 一个函数发生了什么

流程（结合代码理解）：

1. 创建一个以构造函数的 prototype 属性为原型的对象，比方说叫 instance `let obj=Object.create(fn.prototype)`
2. 执行构造函数，传入参数，并且构造函数内部的 this 要指向刚刚构建的对象。可以使用 call 或者 apply 改变函数内部 this 的指向
3. 判断构造函数返回值，如果构造函数返回的是一个对象，new 命令返回 return 语句指定的对象，否则，就忽视 return 语句，返回 instance 对象

## symbol 有什么用处

- Symbol 类型的创建
  ` const symbol1 = Symbol(description)`

  - 创建 symbol 变量最简单的方法是用 Symbol()，Symbol 函数并不是一个构造函数，不能使用 new 关键字调用
  - Symbol()函数只有一个参数，字符串 description，这个字符串的唯一作用是辅助调试的，当我们对一个 symbol 类型 toString 的时候，输出的就是描述信息的值，注意，即使你使用 Symbol 函数创建了两个相同描述信息的 symbol，这两个 symbool 也是不相等的

- symbol 类型的特点

  1. 可以作为对象属性名，在 symbol 类型出现之前，只有字符串可以作为对象属性名
  2. symbol 的值是独一无二的，没有两个 symbol 的值会相等

- symbol 的应用

  1. 作为对象属性名可以防止重复
     这是基于以上两个特点很容易推断出来的作用，它既然可以当做对象属性名，又独一无二，自然可以作为对象属性防重名

  2. 作为类内部的私有属性

     - 其实这点也是比较容易想到的，在 class 语法中，我们比较困难在类内部创建私有变量或者说内部变量，只是用来处理类的内部逻辑而不是用来供类外部访问的
     - symbol 就可以用来处理这个问题，只要在 class 所在的 js 文件中定义一个 symbol 常量，然后定义某个属性的属性名为该 Symbol 常量，类的内部可以通过变量访问读写该属性，外部则没有办法读写
     - 当然也不是绝对没有办法，使用 Object.getOwnProperySymbols()还是可以拿到，但总体来说已经安全很多了

     - 顺便说一下，有一些提案中建议把 calss 内部#开头的变量作为私有属性，但是基本上浏览器和 Node 端都还没有兼容这种规定。那么为什么我要提一下，因为在 webpack 配置的项目中，大部分情况下可以这么写了，babel 在转化时帮助你事先了私有属性

- 内置 symbol
  JS 内部内置了一个 symbol，即 Symbol.iterator。它的值期望是一个函数，拥有 Symbol.iterator 属性的对象称为可迭代对象，即可以使用 for/fo 循环
  这里的对象是广义的对象。像数组、Map、Set 等等，都是有 iterator 属性的，而狭义的 Object 类型就不存在 iterator 属性
  当然你可以给给自己创建的对象手动添加 iterator 属性，让他支持 for of 循环，并且循环中的变量由你自己决定

## Iterator 接口 (迭代器)

Iterator 的作用：

1. 为各种数据结构，提供一个统一的、简便的访问接口
2. 使得数据结构的成员能够按某种次序排列
3. ES6 创造了一种新的遍历命令 for...of 循环，Iterator 接口主要供 for…of 使用

Iterator 的遍历过程：

1. 创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象
2. 第一次调用指针对象的 next 方法，可以将指针指向数据结构的第一个成员
3. 第二次调用指针对象的 next 方法，指针就指向数据结构的第二个成员
4. 不断调用指针对象的 next 方法，直到它指向数据结构的结束位置

每一次调用 next 方法，都会返回数据结构的当前成员的信息。具体来说，就是返回一个包含 value 和 done 两个属性的对象
value 属性是当前成员的值，done 属性是一个布尔值，表示遍历是否结束

### 默认 Iterator 接口

- 一种数据结构只要部署了 Iterator 接口，我们就称这种数据结构是“可遍历的”（iterable）
- ES6 规定，默认的 Iterator 接口部署在数据结构的 Symbol.iterator 属性。即一个数据结构只要具有 Symbol.iterator 属性，就可以认为是“可遍历的”（iterable）
- Symbol.iterator 属性本身是一个函数，这个函数是当前数据结构默认的遍历器生成函数。执行这个函数，就会返回一个遍历器

- 可以自定义 Symbol.iterator 函数，使得它可遍历。
  但是如果我们定义的 Symbol.iterator 不是遍历器生成函数（即会返回一个遍历器对象），forof 时浏览器报错。遍历器对象的特征就是需要具有 next 方法，每次调用 next 方法，返回 value 和 done 两个属性。for of 循环中的变量即 value 值

- 总结下，如何让一个本来不可遍历（forof）的数据结构变为可遍历的
  1. 在该结构上添加 Symbol.iterator 方法
  2. 该方法返回一个对象（遍历器对象）
  3. 这个对象上应该有 next 方法
  4. next 方法返回一个对象，对象的 value 属性值，即是 forof 中的参数值
  5. next 方法返回的 done 属性，为 ture 时代表循环结束

## 闭包是什么？

讲闭包之前要明确的概念：

### 闭包前置知识 - 作用域

概念：在 js 中，作用域即使一套规则，这套规则用来管理引擎如何在当前作用域以及嵌套的子作用域中

- 编译阶段
  编译阶段由编译器完成，将代码翻译成可执行代码，这个阶段作用域规则会确定

- 执行阶段
  执行阶段由引擎完成，主要任务是执行可执行代码，执行上下文在这个阶段创建

# 内存空间详解

## 堆(heap)，栈(stack)与队列(queue)数据结构

- js 没有严格意义上区分栈内存与堆内存
- 一般情况是基础数据类型，在栈内存中维护，引用数据类型，在堆内存中维护

栈和队列的数据结构我已经了解，堆数据结构

- 堆数据结构是一种树状结构。它的存取数据的方式是 key-value（很像哈希表）

- 引用数据类型的值是保存在堆内存中的对象，JS 不允许直接访问堆内存中的数据，因此我们不能直接操作对象的堆内存空间。我们对对象的操作都是在操作对象的引用

## JavaScript 的内存生命周期

1. 分配你所需要的内存
2. 使用分配到的内存（读、写）
3. 不需要时将其释放、归还

- JS 有垃圾自动回收机制，那么这个机制的原理是什么呢？

- 其实很简单，就是找出那些不再继续使用的值，然后释放其占用的内存。垃圾收集器会每隔固定的时间段就执行一次释放操作

- 最常见的回收方式是通过标记清除的算法来找到哪些对象是不再继续使用的，比方说你讲一个对象赋值为 null，那么该对象指向的堆内存空间，如果没有其他变量再指向它，在下一次垃圾收集器执行时就会被释放

- 在局部作用域中，局部作用域的代码执行完毕，该变量也就没有继续存在的必要了，因为垃圾收集器很容易做出判断并回收。但是全局变量或者闭包的产生，就会让这个判断变得困难

# 执行上下文详解

- 执行上下文可以理解为函数执行的环境，每一个函数执行时，都会给对应的函数创建这样一个执行环境。所以说 js 代码执行的过程中会产生过个执行上下文，js 因为会以栈的方式来处理他们，即调用栈

- 栈底肯定是全局上下文，栈顶就是当前正在执行的执行上下文

- 执行代码时，首先将全局上下文压入执行栈，然后执行函数 X 时，将函数 X 压入执行栈，如果函数 X 中又执行函数 Y，则将 Y 压入执行栈中。当 Y 执行完毕，就将 Y 出栈，继续执行 X，X 也执行完毕，也出栈，但是全局上下只有到浏览器关闭时才会出栈

# 变量对象详解（变量提升）

- 问题核心：在 JS 声明的变量和函数，JS 编译器是如何找到他们的？

当一个函数被调用，一个新的执行上下文就会被创建，一个执行上下文的生命周期可以分为几个阶段

1. 创建阶段
   在这个阶段创建变量对象，确定 this 指向，以及其他需要的状态。

2. 代码执行阶段
   创建完成之后，就会开始执行代码，会完成变量赋值，以及执行其他代码

3. 销毁阶段
   可执行代码执行完毕后，执行上下文出栈，对应的内存空间失去应用，等待被回收

所以可以看出，变量对象是在执行上下文创建阶段被创建，那么变量对象的创建，又包含 3 部分：

1. 建立 arguments 对象
2. 检查当前上下文的函数声明，也就是使用 function 关键字声明的函数
   在变量对象中以函数名建立一个属性，属性值为指向该函数所在内存地址的引用
3. 检查当前上下文中的变量声明
   每找到一个变量，就在变量对象中以变量名建立一个属性，属性值为 undefined（const/let 声明的变量没有赋值，不能提前使用）

- 如果 var 变量与函数同名，则在变量对象的创建阶段（注意，该阶段还没有开始执行代码），以函数值为准，在执行阶段，函数值就会被变量值覆盖。不管变量和函数定义的先后顺序如何，最后都只保留变量值

- 进入执行阶段之前，变量对象中的属性都不能访问！ 但是进入执行阶段后，变量对象就转变为了活动对象，里面的属性都能被访问了，然后开始进行执行阶段的操作

变量对象和活动对象的区别？

- 他们其实都是同一个对象，只是处于执行上下文的不同生命周期。
- 不过只有处于函数调用栈栈顶的执行上下文中的变量对象，才会变成活动对象

- 全局上下文的变量对象
  全局上下文比较特殊，它的变量对象，就是 window 对象。this 指向也同样如此，this 指向 window
  全局上下文的声明周期，与程序的生命周期一致，只要程序运行不结束，全局上下文就会一致存在

- let const

  - 如果未定义一个变量直接调用，报错 x is not defined
  - 如果 let 定义一个变量，在这之前调用，报错 Cannot access 'x' before initialization
    这是因为第一个报错是活动对象中没有该属性，第二个报错是有该属性但是该属性完全没赋值。连 undefined 值都没有赋。即使变量提升了，也不能调用它。 这就是暂时性死区

- 总结

1.  变量对象的收集顺序， 函数形参，生成 arguments 对象 -> 函数（function 定义的） -> 变量
2.  函数和变量同名时，在上下文创建阶段以函数为准，在执行阶段以变量为准（如果在函数第一行打印同名函数和变量，值为函数，如果在函数和变量声明后的执行位置打印，则不管谁定义在前，谁定义再后，值都为变量）
3.  变量对象在进入执行阶段后，变为活动对象
4.  let 和 const 也存在变量提升，只不过没有对其进行赋值，所以不能访问

# 怎么理解作用域与作用域链

## 作用域

- 作用域我的理解就是一块独立封闭的区域，它决定了本区域内变量或者函数的可见性
- 比方说我定义了一个函数，函数内部就行成了一个独立、封闭的函数作用域，它内部的变量无法被外部访问
- 但是一个作用域可以访问它的上级作用域。刚刚定义的函数作用域就可以访问全局作用域
- 作用域的确定是在编译阶段就确定的，换句话说，代码写完就确定了，而不是在执行时候确定
- 作用域最大的用处就是隔离变量，不同作用域下同名变量不会有冲突

所以说作用域就像一个大的集合包含了一个小的集合，一层一层的进行包裹。在外层作用域的变量无法知道小集合内部的情况，反过来小集合内部却可以把大集合看的一清二楚

## 作用域链

- 在解释作用域的时候提到了，内部作用域可以访问外部作用域。所以这就引出了 js 变量的查找过程了
- 首先肯定是在自己的作用域下寻找变量
- 如果没找到呢，不会直接报错，因为有可能上一级作用域有
- 这里要注意，所谓的上一级作用域，是定义该函数的作用域，而不是执行该函数的作用域
- 如果还没找到，继续向上，直到找到全局作用域为止，还未找到才会报错

# 闭包是什么？

1. 闭包包含一个外部函数和一个内部函数
2. 内部函数中使用了外部函数定义的变量
3. 内部函数在外部函数以外的区域被调用了（比如把内部函数 return，或者内部函数定义为对象的属性，对象被 return 等等）

满足这三个条件，我觉得就形成了闭包

## 闭包的特点

- 最大的特点，就是内部函数使用的外部函数变量无法被释放了。对于大多数局部作用域来说，垃圾回收机制是比较容易判断出变量是否需要释放的，无非是执行时压入执行栈，执行完后出栈，函数内部变量释放。一般流程
- 但是呢外部函数因为变量被内部函数使用了，并且它有可能继续被外部调用。这就使得被使用的变量不得不一致存在内存当中，因为如果一旦释放，内部函数被调用时，无法沿着作用域链查找到外部函数定义的变量

## 闭包的应用场景

1. 需要长时间记录一个变量的场景。
   比如节流函数，我必须要知道上一次被调用的时间，这样我才能和这一次被调用的时间相比较，从而做出不同的反应。 所以就需要有一个变量记录上一次被调用的时间，而这个变量一定不能放在节流的回调里，即内部函数中，内部函数中的时间就是触发事件的时间，即当前时间，所以这个时间就在外部函数中定义了，但是在内部函数中比较，就形成了闭包
2. 模块化

# this

最重要的理解：this 的指向，是在函数被调用的时候确定的。也就是执行上下文被创建时确定的

- this 是不可赋值的，赋值就会报错

下面分四种情况，确定 this 指向

1. 全局对象中的 this - 指向 window
2. 函数中的 this
   又分两种情况：

   1. 函数独立调用，在严格模式下，内部的 this 指向 undefined，非严格模式下指向 window
   2. 函数非独立调用，即被某个对象调用，this 指向该对象

3. 构造函数中的 this 指向实例对象
   new 绑定的优先级高于 bind 显示绑定
4. DOM 监听事件中的 this 指向 DOM 本身

## JS 隐式转换，显示转换

当两个不同类型的数据进行计算时，会先转为相同类型在进行计算，这个过程是 js 自动进行的，所以称为隐式转换
所以同种类型运算是不进行隐式转换的，比如{}=={}，为 false，如果进行隐式转换，应该相等

隐式转换一般就是调用数据结构的 valueOf 方法和 toString 方法
这两个方法总的来说：

- valueOf 的作用是返回它相应的原始值
- toString 返回一个反映这个对象的字符串

Js 常见类型的 valueOf 和 toString 方法如下图所示
[!](./images//valueOf%E5%92%8CtoString.png)

隐式转换常见运算

1. ==
2. \+

### 隐式转换 —— “==”

0. 除了以下三种情况，其他都是先转为数字再做比较

1. 对象（广义对象，比如数组、Date 都可以） == 字符串 对象 -> 字符串
2. null == undefined // true
3. NaN == NaN // false

### 隐式转换 —— “+”

1. {} + 其它：不用考虑{}，Number(其他)
2. [] + 其他：+前后都转成字符串
   1、2 是特殊情况
3. 两侧有一个为字符串，则相加后的结果为字符串
4. 其他情况转为数字运算（不算对象类型）
5. 有对象类型统一转为字符运算（参考 Number）

其他运算符一律转为数字运算

### 隐式转换 Number

1. 字符串 -> 可解析就转为数字，否则为 NaN
2. BOOlean -> true 为 1，false 为 0
3. undefined -> NaN
4. null -> 0
5. 广义对象 => 优先调用 valueOf，如果不是原始类型，在调用 toString，如果还不是则报错
   这个规则解释了为什么 Object + Array 最终都会转成字符串，因为调用 valueOf 后还是对象

## bind，call，apply 具体指什么

相同点：
bind，call，apply 都是函数的方法，他们的作用是改变函数内部 this 的指向。函数内部 this 默认有它自己一套指向的规则，使用 call、apply 或者 bind 则可以强行改变

不同点：

- call 和 apply 几乎是一样的，这两个函数的唯一区别是，call 第一个参数是希望函数内部 this 指向的对象，第二个到第 n 个参数为传入函数的参数，这个区别在 ES6 出现...运算符后几乎可以忽略不计了，所以他们两者的使用场景是完全一样的

- apply 第一个参数和 call 相同，第二个参数为数组，数组元素的元素也会按顺序传入函数内部作为参数

- bind 第一个参数也是希望函数内部 this 指向的对象，第二到第 n 个参数为需要传入函数的参数。但是 bind 和 call、apply 不同的地方在于它不是立即执行的，call 和 apply 在调用时就会立即执行函数。而 bind 是生成了一个改变了函数内部 this 指向的新的函数。这在你不希望立即执行函数但又想要改变函数内部 this 指向的时候非常有用

我举一个例子，在 class 里，如果你想要增加监听事件，使用 addeventListen，对于你要传入的函数，你希望函数内部的 this 指向实例对象，但是监听事件由浏览器内部调用，里面的 this 默认指向 DOM 元素。这个时候你就可以使用 bind 强行改变内部 this，call 或 apply 则不行

但是这种方式实际上不是最佳实践，为啥呢，代码是这样的，this.x = this.x.bind(this)，这样强绑定 this 会存在一个问题，用 this 显示定义一个方法，该方法就会绑定在实例对象上而不是原型对象上，换句话说每个被构造的实例对会有独立的该方法的内存空间，造成浪费
这个问题困扰了我一段时间，也和一些比较厉害的人讨论过，没有什么结果。
直到最近手写了 Promise 后，发现了一种完美解决方案，之前也是一直没有想到的，就是累内部定义的方法，使用箭头函数定义，该方法的上层作用域，就是类，类的 this 指向实例对象。根据我个人推断，我是觉得在构造函数 prototype 属性上绑定这些方法，这些代码是定义在构造函数之中的。这样 this 肯定指向实例对象
所以结论在 class 的内部使用箭头函数定义一个方法，这个方法首先会绑定在原型对象上，其次无论该方法被谁执行，this 指向实例对象

### 手写 bind、apply、call

查看 this.html

- bind（确定参数和返回值）

  1. 参数： 传入 context（上下文）、fn（绑定的函数、如果定义在 Function 的 prototype 上则是函数内部的 this）、param（bind 时可以传入部分参数）
  2. 返回值： 返回一个匿名函数，作用是在其内部执行传入的 fn，但不能直接返回 fn，直接返回无法绑定 this
  3. 实现绑定：利用函数内部的 this，如果不是独立调用，那么谁调用它 this 指向谁的特点
     在传入的 context 上添加一个属性，其值就是传入的 fn 函数，这样的话我们通过调用 context 上的属性执行 fn 函数，this 就会指向 context 了

  - 注意点：防止属性名称相同，覆盖掉已有属性，所以可以使用 ES6 的 symbol 作为属性名。在调用后将属性删除

  5. 在返回函数内部调用 context 的属性 symbol 执行 fn 函数，将 bind 传入的部分参数和返回函数的参数合并，一齐传入到 fn 函数中，记录执行结果，删除 symbol 属性，返回 fn 执行结果

- call/apply 实现相比 bind 就简单不少
  1. 参数（和 bind 类似）：context、fn、param（全部的参数，bind 中是部分的参数）
  2. 返回值：因为 call/apply 是立即执行的，所以应该返回执行结果
  3. 绑定逻辑：利用函数内部的 this，如果不是独立调用，那么谁调用它 this 指向谁的特点。定义 symbol 变量作为 context 的属性，属性值为 fn，执行 context 的 symbol 方法，记录执行结果，删除 symbol 属性，返回执行结果

## Promise

Promise 的链式调用

## 事件循环

所有的任务分为同步任务和异步任务

- 代码执行过程中遇到同步任务，直接放到主程序的执行栈栈顶执行
- 遇到异步任务（典型的有 ajax 请求、settimeout 等）放到任务队列中
- 当主程序的同步任务全部执行完毕后，会去任务队列中读取已经完成的异步任务，将这些任务推入到执行栈执行
- 这个过程不断重复就是我们说的 Event Loop 事件循环了

上面是同步任务和异步任务的角度说明事件循环，一次事件循环为一个 tick，我们还可以从宏任务和微任务的角度去分析

- 首先，宏任务（Task）包含：script(整体代码)、setTimeout、setInterval、postMessage 等，这是浏览器端，如果是 Node 环境，还包括 I/O 操作、setImmediate
- 微任务（Jobs）包含：Promise.then、MutationObserver（这是 H5 新增的一个监听 DOM 属性及后代节点的 API）、Node 环境下的 process.nextTick 等
- 宏任务是由宿主（浏览器、Node）发起的，而微任务由 JS 自身发起

知道了宏任务和微任务包含哪些东西后，就可以大致分析下一次事件循环了

1. 一次 tick 起始于宏任务，所以最早开始执行的宏任务，就是 script 标签中的代码
2. 执行过程中如果是同步任务，则直接放到执行栈执行，如果遇到微任务，就把它添加到微任务的任务队列中
3. 宏任务的同步任务执行完毕后，立即执行当前微任务队列中的所有微任务（当然是已完成的）
4. 微任务执行完毕后，本次任务执行完毕，在下一个宏任务执行之前，进行 UI 渲染
5. 渲染完毕后，继续执行下一个宏任务，从宏任务的任务队列中取
   如此循环

- 图解：
  [!](./images/js/eventLoop.png)

### 怎么理解 script（整体代码块）是个宏任务

如果同时存在两个 script 代码块，会首先在执行第一个 script 代码块中的同步代码，如果这个过程中创建了微任务，将其添加到微任务队列中。当第一个 script 代码块执行完毕，会先去清空微任务队列。清空一轮后，才会去执行下一个宏任务，即第二个 script 代码块的执行。 所以很明显，script 代码块解释一个宏任务

### Promise 在哪个阶段被推入微任务当中

一句话：Promise 是在执行回调的时候被推入微任务队列的
但是执行回调的时间其实由两种情况：

- 第一： resolve 在 Promise.then 之前执行，即先 resolve 了，然后再调用 then，这种情况下 resolve 时我们的 fulfilled 队列是空的，所以不会执行回调函数。同步过程。而是等到调用 then 方法，判断状态已经为 fulfilled 了，直接调用 then 传入的函数，此时创建微任务
- 第二： resolve 在 Promise.then 之后执行，那么 then 方法执行的时候，状态还是 pending，此时不会立即执行回调，而是将回调函数压入到 fulfilled 队列中，等到 resolve 执行时，再从队列中取出回调执行。执行回调时创建微任务

## onload 事件

onload 事件在资源被加载完成后会被触发

对于 script 标签，在外部 js 文件被加载后代码会被立即执行，
那么，外部 js 文件中的代码和该 script 标签的 onload 回调函数，它们的执行顺序是怎样的呢

实践证明，是在外部 js 文件被加载并执行完成后，才会触发 onload 事件

## 说一下原型和原型链

1. 关键角色（构造函数、实力对象、原型对象），他们的作用以及互相的关系
2. getPrototypeOf
3. create

4. 引出原型链（通过构造函数生成的实例对象，可以访问原型对象的所有属性和方法）

### 原型

- 关键角色

1. 构造函数
2. 实例对象
3. 原型对象

- 互相之间的关系

1. 构造函数的 prototype 属性，指向原型对象，原型对象的 constructor 属性，又反指回构造函数
2. 通过 new 关键字，调用构造函数可以生成一个实例对象，原型对象上的所有属性和方法，实例对象均可以直接访问
3. Object 对象存在方法可以让实例对象直接获取到它的原型对象（getPrototypeOf），当然**proto**也可以，但是 getPrototypeOf 是 ES6 出的标准，建议还是跟着标准来。所以说可以根据当前对象，创造一个同一个原型对象的对象
4. Object.create(null)新建的对象上是没有**proto**属性的

- 在说一点原型关于自己的理解
  先抛开原型链，之前我自己活着平时和朋友交流的时候，考虑一个问题原型比我直接给你赋值好在哪里，因为直接赋值也可以共享属性和方法
  很简单，直接赋值的方式两者完全相等，两个对象独立的个性没有办法体现。原型是把需要共享的内容放到原型对象，而你的个性又保持在实例对象上。原型对象是内存中的一块空间，实例对象又是单独分配的一块空间

### 原型链

- 因为刚刚也说了,实例对象的原型，就是构造函数创建出来的实例对象
- 那么实例对象可以去获取原型对象的属性和方法，那么这个原型对象，它既然是个对象，那么它也会有自己的原型。它的原型是什么？我们看下它是被谁创建的，因为被谁创建，原型就指向创建它的函数的 prototype 属性
- 这个原型对象 A 显然不是程序员认为创建的，那么就是 js 内部创建的，js 内部创建的对象，都是使用 Object 构造函数创建。所以原型对象 A 的原型，是 Object 函数的 prototype 属性，我们先叫他原型对象 B
- 这个原型对象 B 我们平时写的大部分对象的原型
- 这个原型对象 B，它的原型又是什么呢，它已经到顶点了，总要有个顶点的，它的原型是 null
- 所以我们看下整条链路，最顶层的 null -> Object.prototype ->你所创建的 class 的 prototype 再到 class 的实例对象，这整条链路就是原型链

原型链有什么作用？

- 原型链最大的作用，就是共享属性和方法，原型对象的属性和方法可以共享给实例对象
- 当我们再一个对象里查找一个属性的时候，首先肯定是在自身查找，找不到时再去它的原型对象查找，还没找到再去原型对象的原型对象查找，一直到 Object 的 prototype 属性上还没有找到时，认为没有该属性
- 实际应用：Vue2 中的数组类型数据变化的监听，就巧妙利用了原型链机制，重写了数组 Array 那些能够改变数组的方法，如 push、pop、shift、unshfit、reverse 等等。让在 data 中定义的数组，调用这些方法时，能够被监听到

### 原型继承

- 一个对象可以使用另外一个对象的属性或者方法，就称之为继承。所以 call 和 apply 也是继承
- 具体是通过将这个对象的原型设置为另外一个对象，这样根据原型链的规则，如果查找一个对象属性且在自身不存在时，就会查找另外一个对象，相当于一个对象可以使用另外一个对象的属性和方法了

## 说说你对 JS 的了解

JS 是一种动态类型、弱类型、基于原型的语言。

- 动态类型：执行时，变量被复制后才能确定变量的类型。相对的静态语言，编译时已经确定变量的类型了
- 弱类型：变量被定义或者说赋初始值后，在后续程序中依然可以赋一个其他类型的值，这就是弱类型

JS 严格意义上来说分为两部分：语言标准部分（ECMAScript） + 宿主环境部分

- 所谓语言标准，就是我们平时说的 ES5、ES6 等等，它里面包含了 JS 的核心语法
- 宿主环境，就是 js 能够执行的环境，在 Node 出现之前，js 只能够在浏览器中运行
- 浏览器下运行的 js，除了 ECMA 语法部分，还包括 BOM 和 DOM 部分，BOM 就是浏览器自身的一些 API，比如关于存储方面的 localStorage、sessionStorage、cookie 等；DOM 则是 DOM 操作部分
- Node 中，除了 ECMA，则是 Node 自身内置的 API，常见的文件操作、网络部分、与操作系统的交互等等

## 类数组有哪些？类数组转数组的方式

类数组：

1. nodeList
2. arguments

转数组：

1. ES6： ...运算符、Array.from
2. ES5: Array.prototype.slice.apply(arguments)，arguments 本质是一个对象，对象不存在 apply 方法，所以使用数组原型对象上的 slice 方法，利用 call 或者 apply 应用到 argumens 中

## PWA 和 serviceWorker

Webpack 学习曾经使用过，可以去回顾下，不重点复习

## 箭头函数和普通函数有啥区别？箭头函数能当构造函数吗？

主要区别：

1. 没有 this
   箭头函数自身是没有 this 的，通过查找作用域链来确定 this 的值
   注意是作用域链，而不是执行上下文。
2. 没有 arguments
   如果箭头函数的上一层还是一个函数，则会访问上一层的 arguments，如果上一层词法作用域是全局作用域，则报错，找不到 arguments
   如果想要在箭头函数中拿到参数，可以使用...扩展运算法
3. 不能通过 new 关键字调用
   - JS 函数有两个内部方法：[[Call]] 和 [[Construct]]
   - 当通过 new 调用函数时，执行 Construct 方法
   - 直接调用执行 call 方法
   - 箭头函数没有 constuctor，所以不能使用 new 调用，一旦调用就会报错
4. 没有 new.target
   new.target 返回 new 命令作用于的那个构造函数
5. 没有 prototype 属性，因为箭头函数不能使用 new，意味着它不能作为构造函数，也就没有必要保留 prototype 属性了
6. 没有 super
7. 箭头函数一行时可以省略 return

## 谈谈对 class 的理解，staic 关键有了解嘛？

为这个类的函数对象直接添加方法，而不是加在这个函数对象的原型对象上

## ES6 新增的 flat 方法，手写？

- 对于纯数组而言，扩展运算符一般可以使用 concat 替换
- concat 是不改变原生组的，需要重新赋值下
- flat 方法不改变原数组，生活一个新数组

## 实现函数柯里化

实现了 bind 函数后，函数柯里化其实就比较简单了，同理所有函数确定入参和返回值

1. 入参：fn，要柯里化的函数；params：前一部分参数
2. 返回值：返回一个函数，其作用是去执行 fn
3. 完善返回函数逻辑：
   1. 参数组装，返回函数的参数是由外部也就是柯里化函数执行时传入的部分参数和返回函数自身的部分参数组装而成。
   2. 判断当前参数个数和 fn 的形参个数，形参个数可以由 fn.length 获得。如果当前参数综合还小于 fn 的形参个数，则继续返回柯里化函数。若已经等于或者大于 fn 的参数个数，则返回 fn 的执行结果

- 函数柯里化有什么用？
  1. 参数复用
  2. 提前返回 和 延迟执行，传入的参数没有到达参数个数要求时，就是提前执行，所有参数传递完成了，不就是分阶段延迟执行

## 数组去重

1. Set 快速去重
2. 不使用 Set，无序去重，新建一个对象，使用 hasOwnProperty 判断是否要添加到结果数组中即可
3. 若是有序数组去重，还可以使用快慢指针

## instanceof 原理，手写 instance

1. instanceof 左边是需要判断的变量（也是对象），右边传入的是 class（构造函数），比较的是变量的原型和构造函数的 prototype 属性
2. 第一次比较：将左边变量的原型对象和 构造函数的 prototype 相比较，如果不相等，则左边赋值为变量原型对象的原型
3. 就这样沿着原型链一直对比，相等则为 true，找不到则为 false

从这里可以看出来，instanceof 只能判断引用类型，基本类型是没有原型的

- 一句话总结： instanceof 就是判断：右边构造函数的的 prototype 是否在左边变量的原型链上

- 题外话：js 底层如何存储数据类型？
  底层存储变量时，在变量的机器码的低位 1-3 位存储变量类型

  1. 000：对象
  2. 001：整数
  3. 010：浮点数
  4. 100：字符串
  5. 110：布尔

  - null：所有机器码均为 0。所有机器码均为零，那么存储变量类型的那几位当然也是 0，所以 typeof null 会是 object

## 说一下 js 的继承

1. 原型链继承

主要就是说明下 js 有哪些继承方式，各方式的优缺点是啥

1. 原型链继承

- 实现：将子类构造函数的 prototype 属性指向父类的实例对象，即继承了父类的属性和方法。修复 constructor 指向
- 解析：子实例对象的上一层，是父类的实例对象，父类的实例对象上一层，是父类的原型对象。
  所以原型链继承继承了父类实例对象特有的属性、方法和父类原型对象公共的属性和方法
- ES6 class 的 prototype 属性作用和 function 的 prototype 属性相似，但是它是不可写的，写入操作无效，无法赋值。ES6 的原型链集成可以通过它提供的 extends 关键字
- extends 关键字继承了父类的原型属性和方法，实例属性和方法变为了自身的实例属性和方法，而不是在子类的原型链上。这种情况是最合理的，一般来说，我们只希望集成父类原型的属性和方法，对于父类实例对象的个性属性和方法，在子类中也能保持个性化

- 问题：
  1. 引用类型的属性被所有实例共享（父类实例对象的属性，被子类所共享了，如果是引用类型，1 个子实例修改，影响其他子实例）
  2. 在创建 Child 实例时，不能向 Parent 传参

2. 借用 Parent 的构造函数(call/apply)

- 实现：在 Child 构造函数中，使用 call 调用父类构造函数
- 优点：
  1.  避免引用类型被所有实例共享（即父类的实例对象属性，也是子类的实例对象属性，而不是像子类的原型对象属性，同 ES6 的 extends）
  2.  可以在 Child 中向 Parent 传参（call 或 apply 可以传递参数）
  3.  可以实现多继承，即 call 多个父类
- 缺点：
  1. 只能继承父类的实例对象和属性，无法继承父类的原型对象和属性
  2. 父类的实例方法无法在子类中复用，每个子类实例都会单独保存父类的实例方法。这一点我个人理解，没有第 1 点问题严重，因为实际场景下我们并不怎么为每个类定义它的实例方法，方法绝大部分场景都希望是复用的，都是定义的原型方法。如果真的定义了，既然父类的实例对象都已经独立了该实例方法，子类独立也是有一定道理的
     所以我觉得借用构造函数实现继承最大的问题，还是无法集成父类原型对象上的属性和方法

3.  组合继承（原型链+借用构造函数）

- 实现：

  1. Child 构造函数的 Prototype 属性指向 Parent 的实例对象，修复 constructor 指向
  2. 在 Child 构造函数中，使用 call 借用 Parent 的构造函数

- 缺点：
  Parent 构造函数中的代码被执行了两遍。第一次是创造 Parent 实例对象的时候，第二次是创造子类的实例对象的时候，子类构造函数内部借用了父类的构造函数，又执行了一遍构造函数内部的代码

- 优点：融合了原型继承和借用构造函数继承的优点，是 JavaScript 中最常用的继承模式

  1. 可以继承父类实例对象上的属性和方法以及原型上的属性和方法
  2. 父类实例对象的属性独立，不存在属性共享问题
  3. 可以传参
  4. 父类原型上的方法可复用。实例对象的方法依然会独立创建

- 个人理解：这种方式，中间那一层的原型是没有用的。捋一捋，子类实例对象的上一层原型，指向父类的实例对象，这一层是完全没有必要的，因为父类的实例对象属性或方法，已经通过借用父类构造函数实现了继承，并且是保持个性的继承。父类的实例对象的原型对象上的属性和方法，是子类实例对象的上一层的上一层。这一层是有必要的，如果能跨过中间层，就是比较完美的继承了

4. 原型式继承（实现类似 create 的功能）

   - 实现：将某一个对象作为子类的原型对象，即赋值给构造函数的 prototype
   - 缺点：该对象上的引用类型属性，被子类共享。和原型链继承类似。 本质是创建实例时，无法创建实例属性。
   - 优点：比较简单

5. 寄生式继承
   - 实现：创建一个仅用于封装继承过程的函数，函数内部已某种形式增强对象，说白了就是添加自身额外的属性和方法
   - 缺点：跟借用构造函数模式一样，每次创建对象都会创建一遍方法
6. 寄生组合式继承（最终方案）
   个人理解，讲完组合式继承后，可以直接讲寄生组合式继承

   - 前面讲了组合式继承执行了两遍父类的构造函数，组合式继承，子类实例对象的上一层原型是有点多余或者说重复的。重复定义了父类实例对象的属性和方法。
   - 所以寄生组合式继承就是优化了这一点。有一点要注意，不能直接把子类的原型指向父类的原型，因为这样做的话如果我们再子类原型扩展属性和方法时，会影响父类的原型，以及后续的实例对象，这肯定不行。 所以最好的做法还是在中间有一个过度的原型。 所以最后演变成 子类实例对象 ->（上一层原型） 指向以父类实例对象为原型构造的对象，这个对象本身没有任何的属性或者方法，它的属性和方法都是通过原型链向上查找获得 -> 它的原型又指向父类的原型对象，所以子类同样可以继承父类的原型属性和方法

   - 总结下：

   1. 子类通过借用构造函数，集成了父类的实例对象和实例属性，并且是保持独立不共享的
   2. 通过将子类的原型对象指向，以父类原型对象为原型创建的空对象（object 方法实现，也可）。实现了父类原型对象和属性的继承。并且这个继承是共享性质的
   3. 同时这个空对象又可以添加扩展子类本身的原型对象或方法，完美解决

## 垃圾回收机制

- 简单过程：

  1. V8 引擎逐行执行 JS 代码
  2. 遇到函数，为其创建一个函数执行上下文（content），添加到调用栈的栈顶
  3. 函数的作用域中包含了该函数声明的所有变量，当函数执行完毕后，对应的执行上下文从栈顶弹出，函数的作用域也会随之销毁，其包含的所有变量也会统一释放并自动回收

- 回收过程，大致分为两个部分

  1. 第一部分在新生代内存区域回收，此区域相对较小但回收频繁，使用 Scavenge 算法。
     Scavenge 算法：分配- 复制 - 清除 - 交换
     Scavenge 算法的垃圾回收过程主要就是将存活对象在 From 空间和 To 空间之间进行复制，同时完成两个空间之间的角色互换，因此该算法的缺点也比较明显，浪费了一半的内存用于复制
  2. 老生代内存区： 新生代中长时间未被回收的变量会被移动到老生代区域
     - 特点：回收频率较低，使用标记清除（Mark-Sweep）和标记整理（Mark-compact）算法来进行垃圾回收
     - 标记清除算法：遍历内存中的所有对象，标记活着的对象，清除死去的对象。如何直到一个对象是活着还是死去呢？ 就是根据该对象是否可以被访问到。
     - 回收期内部会创建一个根列表，列表中存放的根节点可以使全局对象活着函数内部定义的对象参数等等。从根节点出发可以被访问到的对象即为活对象，否则为死对象。这就是标记清除的大概过程
     - 那么标记整理又有什么作用呢？
       标记带来一个问题就是内存碎片，将死去的对象清除后留下不连续的内存随便，标记整理就是将活着的对象往内存的一端进行移动

- V8 的内存限制

  - 大小限制：64 位系统最大约 1.4G、32 位系统约 0.7G
  - 原因：
    1. 垃圾回收机制，垃圾回收本身也是一件非常耗时的操作，并且堆内存占用过多，耗时就越长。加入堆内存占满了大概是 1.5G 左右，那么 V8 做一次 50 小的垃圾回收需要 50ms，而做一次全量回收（非增量）甚至需要 1s 以上
    2. JS 单线程机制，不仅仅是代码的执行，垃圾回收也是一样。当进行垃圾回收时，程序的其他执行逻辑都要暂停，等待一次垃圾回收完成。又结合第一点说的，垃圾回收机制的耗时性，所以 V8 干脆限制死内存的使用大小，来缓解该问题
    3. 最初的设计是为了浏览器端，相对来说大内存的使用场景很少

- V8 的内存结构

  - 新生代(new_space)
    大多数对象一开始被分配的区域，特点是

    1. 相对较小但回收频繁
    2. 区域被分为两半，一半用来分配内存，一半用于回收时复制需要暂时保留的对象
    3. 内存最大值在 64 和 32 位系统中分别为 32MB 和 16MB
    4. 新生代的垃圾回收主要采用了 Scavenge 算法

  - 老生代(old_space)
    新生代中的对象存活一段时间后如果未被回收，就会转移到老生代内存区，特点：
    1. 相对新生代回收频率较低
    2. 又分为老生代指针区和老生代数据区
    3. 老生代区使用标记清除（Mark-Sweep）和标记整理（Mark-compact）算法来进行管理，很早之前使用引用计数，即看对象是否还有其他引用指向它，如果没有则会回收。这种算法因为循环引用问题已经被弃用很久了（循环应用 a 对象有属性指向 b 对象，b 对象又存在属性指向 a 对象）
  - 大对象区
    存放体积超越其他区域大小的对象，垃圾回收不会移动大对象区
  - 代码区
    代码对象，会被分配到这里，唯一拥有执行权限的内存区域
  - map 区，存放 Cell 和 Map，每个区域都是存放相同大小的元素，结构简单

- 新生代区回收算法 - Scavenge 算法的大致流程：

  1. 将内存空间划分为 From 空间和 To 空间
  2. 程序执行过程中都是由 From 空间分配内存
  3. 当主程序任务第一次执行完毕，进入垃圾回收阶段时，查看 From 空间对象引用情况，如果还存在引用，就将对象复制到 TO 空间中，然后将 From 空间清空
  4. From 和 TO 空间进行角色互换，即保留有引用对象空间的 TO 空间，转换为 From 空间，在下一次程序执行时分配内存，清空的 From 空间变为 TO 空间。
  5. 重复上述步骤

  - 总结： Scavenge 算法的垃圾回收过程主要就是将存活对象在 From 空间和 To 空间之间进行复制，同时完成两个空间之间的角色互换，因此该算法的缺点也比较明显，浪费了一半的内存用于复制

- 老生代区回收算法 - 标记清除和标记整理算法

  1. 标记清除分为两个阶段，即标记和清除
  2. 在标记阶段会遍历堆中的所有对象，然后标记活着的对象
  3. 在清除阶段，对死亡的对象进行清除

  那么如何判断对象是活着的还是死亡的，主要是通过判断某个对象是否可以被访问到，访问过程如下：

  1. 回收器内部创建一个根列表，用于从根节点出发，寻找那些可以被访问到的变量。根节点主要包括全局对象、函数的局部变量和参数等
  2. 然后垃圾回收器从所有根节点出发，遍历其可以访问到的子节点，标记为活的，不能访问到的标记为死亡
  3. 最后回收机制回收所有死亡的内存对象

  - 标记清除存在的问题：清除后，内存空间可能出现不连续的状态，即出现内存碎片。
  - 优化：
    1. 利用标记整理解决碎片化问题，即标记清除过程结束后，将活动对象往堆内存的一端进行移动
    2. 增量标记（Incremental Marking）：即将原本需要一次性遍历堆内存的操作改为增量标记的方式
       即先标记堆内存中的一部分对象，然后暂停，将执行权重新交给 JS 主程序，主程序任务执行完后，从暂停的地方继续开始标记。 有点类似于浏览器空闲时才去进行标记
    3. 并行标记和并行清理，利用了多核 CPU 的性能优势，进一步地减少垃圾回收对主线程的影响

- 对象晋升
  当一个对象在经过多次复制之后依旧存活，那么在下一次进行垃圾回收时，会将对象转移到老生代中。将对象从新生代转移到老生代的过程称为晋升。晋升的主要条件（满足一项即可）

  1.  对象是否经过一次 Scavenge 算法
  2.  To 空间的内存占比是否已经超过 25%

- 如何避免内存泄露

1. 尽可能少地创建全局变量
   创建全局变量的几种方式

   1. 在全局作用域下使用 var 声明的变量
   2. 全局作用域下使用 function 关键字定义函数时
   3. 在函数作用中不加任何声明创建一个变量时
      这几种方式都会创建全局变量，这些变量其实都被绑定在了 window 上，当进行垃圾回收时，在标记阶段因为 window 对象可以作为根节点，在 window 对象上挂载到属性均可以被访问到，所以这些这些属性都会被标记为活动的，从而永远不会被回收，除非整个程序退出。如果一定要绑定在全局对象上，也要在使用完毕后手动赋为 null 值，触发垃圾回收机制

2. 手动清除定时器
   这个很明显，setInteval 不手动清除就会一直执行下去

3. 减少闭包使用

4. 清除 DOM 引用
   为了方便问有时候会将 DOM 元素存储在一个对象中，然后我们又 renmove 掉了这个 DOM 元素，但是此时垃圾回收机制依旧无法回收这个 DOM 元素，因为对象中还存在对该 DOM 的引用，所以需要手动清除引用
   这个问题可以使用 ES6 的 WeakMap 和 WeakSet 优化，这两种结构都是弱引用，弱引用是指垃圾回收过程中不会将存储的数据结构本身对该对象的引用考虑进去，只考虑它是否在其他地方被引用了，非常适合这个应用场景

## Promise

### Promise 基础

- then 和 catch 均会返回一个新的 Promise
- then 和 catch 可以有 return 值 ，分两种情况，如果手动 return 的不是 Promise 对象，则会在下一个.then 中，将 return 的值作为 resolve 的值传入。如果手动 return 的就是一个 Promise，则将该 Promise resolve 时候的值作为.then 回调的参数传入

- then 方法在一个 Promise 实例对象上是可以多次调用的，每次调用传入回调函数的参数总是 resolve 的值,catch 方法同理

- 在 then 链式调用过程中，一旦出错，即到达了 rejected 状态，就会向下寻找错误捕获，跳过中间的.then 回调处理。注意这是.catch 的错误处理逻辑，如果是采用.then 传入两个回调参数，以第二个回调参数处理错误的形式，那么第二个错误处理回调和第一个是类似的，返回值会被包装成为一个 promise，可以返回 resolve 状态，也可以返回 reject 状态。只是它捕获上一个的 reject 状态而已

- 执行 resolve()或者 reject()后，后续的代码是可以执行的，虽然不推荐再执行后续代码了，但是因为此时状态已经改变。比如 resolve 了，此时后续代码再报错，也无法逆转状态了，甚至这个错误都不会被 js 捕获了

- then 方法的第二个参数也可以用来捕获错误，但是一般总是推荐使用.catch 捕获
  因为.catch 可以捕获它之前所有 then 中的错误，Promise 中的错误具有冒泡性质，会一直向后传递直到被捕获为止。但是如果使用 then 的第二个参数，则只捕获它自己的错误
  另外一点就是 then 和 catch 更接近同步的写法

- Promise 中的错误，如果没有被捕获，即没有定义错误处理，虽然浏览器会报错，但是不会终止程序的运行，这个跟其他报错是不同的。通俗的说就是“Promise 会吃掉错误”

- Promised.resolve：将现有对象转为 Promise 对象。new Promise 的一种简写模式。注意：Promise.resolve 不仅仅只能产生 fullfilled 状态，也可以是 rejected 状态，非常像 then 自动返回的 Promise 模式，Promise.resolve 中的参数就类比.then 回调的返回值
  `Promise.resolve('foo')` 等价于 `new Promise(resolve => resolve('foo'))`
  Promise.resolve 方法的参数分为 3 种情况：

  1. 参数是一个 Promise 对象，不做任何处理，原封不动的返回该对象
  2. 参数是一个 thenable 对象，即对象上有 then 方法，那么会将这个对象转为 Promise 对象，然后立即执行 then 方法
  3. 参数不是一个对象，或者对象上没有 then 方法。会返回一个 Promise 并且立即是 resolved 状态，同时传给 Promise.resolve 的参数也会传递给回调函数

- Promis.reject：返回一个新的 Promise 实例，该实例的状态为 rejected
  Promise.reject()方法的参数，会原封不动地作为 reject 的原因，变成后续方法的参数，即使参数是 Promise 对象也一样，这点和 Promise.resolve 不同

### Promise this 指向问题

Promise 传入构造函数和 then 的函数，this 都是指向 window 的，所以是独立调用的，Promise 内部没有将函数的 this 强绑给谁

### Promise 规范

Promise 有多种规范，目前使用最广泛的是 Promise A+规范。手写 Promise 代码时，最好是可以通过 PromiseA+规范，可以借助 promises-aplus-tests 库来检测我们的代码是否符合 PromiseA+规范

### 手写 Promise

- 如何创建一个微任务
  - 很多手写版本使用 setTimeout 去做异步处理，但是 setTimeout 属于宏任务，这与 Promise 是微任务相矛盾。
  - 也可以使用 Promise A+推荐的 MutationObserver（ 浏览器端 ）或者 process.nextTick（ Node 端 ），但是这两种方式需要做环境判断
  - 最后选择 queueMicrotask，专门为创建一个微任务而诞生的 API

1. 定义 class，搭建好基本骨架，
   即 constructor、resolve、reject、then 方法，并且 constructor 里执行传入的函数，利用 tryctach 考虑 reject 情况
2. 定义使用变量，完成 resolve、reject 中的逻辑
   变量：state、value、reason、fulFilledQueue、rejectedQueue ，
   resolve: 改变状态，记录 value，执行 fulFilledQueue 队列中的函数

3. 完成 then 方法逻辑

   1. 判断 onFulfilled 和 onRejected 是否为函数，如果不是则赋值为默认函数，方便后续逻辑处理
   2. then 方法返回一个新的 Promise，支持链式调用
   3. Promise 内部代码分为 Promise 的三个状态
   4. 以 resolve 状态为例，创建微任务，使用 trycatch 执行 onFulfilled 代码，如果 ok 则 resolve 结果，如果失败则 reject 结果。
      注意如果 onFulfilled 执行结果本身就是 Promise，则应该在该 Promise 状态改变时，去同步改变 return 的 Promise 的状态
   5. reject 状态同 resolve，pengding 状态将 resolve 和 rejected 状态的处理逻辑压入存储队列，等待实例方法 resolve 被执行时再去执行

4. 完成 catch 方法
   catch 方法无非是调用 then 方法，then 方法第一个参数传 null，第二个参数传错误回调

5. 完成 Promise.resolve 和 Promise.reject
   比较简单，返回一个新的 Promise，分别 resolve(参数)和 rejectd(参数)。但是 Promise.resolve 参数如果是一个 Promise 实例，则直接返回该实例

6. 完成 all 方法
   1. 判断传入的 promise 列表是否为空，如果为空的话直接返回 resolve([])
   2. 返回一个新的 Promise
   3. 遍历 promise 列表，执行 Promise（这里注意下用 Promise.resolve 执行，因为如果数组中不是 Promise 实例，则要包装为 Promise），执行 then 方法，，用一个 all 的局部变量计数，记录完成的 Promise（不能直接用 index，完成顺序和执行顺序不一定相同），将结果赋值到结果数组中，不能使用 push，因为要保证 result 的顺序和传入的 promise 数组顺序一致
   4. 如果所有 promise 都执行完毕，即外部索引等于 len，则 all resolve 结果数组
   5. 如果中间任意一个出错了，则直接 reject 错误

## generator 原理

### generator 基础

generator 函数和普通的函数有何不同？

1. 在关键字 function 后面跟着一个\*号，内部使用 yield 定义不同的内部状态
2. g()并不执行 g 函数：执行函数并不会立即执行内部代码，一句代码都不会执行，而是返回一个遍历器对象，也可看做是 generator 函数的内部指针。
3. 分段执行：每一次执行这个遍历器对象的 next 方法，指针就会移动到 generator 函数的下一个 yield 出，代码也执行到此，next 函数返回一个对象，里面有 value 属性和 done 属性。value 代表 yield 的输出值，done 代表是否遍历结束
4. next 方法可以传参，这样 yeild 执行完毕后的返回值就是 next 方法传递的参数。即下一次恢复执行时的参数。
   这里要注意，对第一个 next 传参是无用的，第一个 next 起始位置是在代码开头，并不是 yield 返回，代码开头的参数应该由 generator 函数传入

5. forof 循环可以循环 generator 函数,并且不需要手动调用 next 函数，因为 forof 就是执行遍历器对象的 next 方法

- 特点：

  1. 分段执行，可以暂停
  2. 可以控制每个阶段的返回值
  3. 可以在每个阶段继续向 generator 函数传参，传入到 next 中，控制函数行为
  4. 可以知道是否执行到结尾

- 原理：
  1. 首先执行 generator 函数返回一个对象，该对象上提供 next 方法，next 方法返回 value 和 done
  2. 最关键的分段执行：定义一个函数 genMain，该函数内部使用 switch case 结构，词法分析新建的 generator 函数，以 yield 为分割位置，将 generator 各个部分按顺序放入到 case 中。
  3. 每次执行 next 方法，就调用 genMain 函数，执行相应部分的 case 代码，内部定义一个指针，执行完当下的 case 后，将指针移动到下一个 case
  4. 传入 next 函数 的参数，再传入我们定义好 genMain 函数，相应的 case 就可以取到
  5. case 返回执行的结果，作为 value 由 next 函数返回出去
  6. 执行最后一个 case 时，将 done 置为 true

## async/await

async 和 await 之所以能够一步一步往下执行，很大程度上只是对 generator 做了封装而已。简单理解一下，

- async 定义的函数本质是一个 generator 函数，调用 async 函数时，通过 generator 生成迭代器，并自动调用第一个 next 方法
- 执行到 await 关键字时，暂停执行，直到 Promise 完成时，再调用 generator 函数的 next 执行下一部分代码
- 如此反复执行

- 说明：词法分析是以 await 为分隔符分割代码，放到 generator 函数的各个部分中

## Map 和 weakMap

- Map 的特点：Map 大部分的情况下可以使用 object 代替，它和 object 的差异在于
  1. Map 的键可以是任意类型，object 的键只能是对象或者 symbol
  2. Map 的键值对个数可以直接通过 size 属性获取，object 没有直接的属性或者方法获取，可以通过调用 Object.keys 获取到键的数组
  3. Map 在频繁增删键值对的场景下，性能要比 Object 好

## weakMap 和 map 的差异

1. WeakMap 只能将对象作为键名，其他类型作为键名报错
2. WeakMap 的键名引用的对象是弱引用，即该对象如果只被 weakMap 引用，没有在其他地方被引用，就有可能随时被回收
3. 不可遍历：因为 weakMap 中的数据随时可能被回收，所以说前后遍历的结果可能不一致，具有不可预测性，所以说无法遍历

## 防抖函数

- 防抖：函数触发后，延迟一段后再执行，在这段事件内如果又有新的触发，那么重新计时

- 节流：限制一个函数在一定时间内只能执行一次，如果这段时间内又触发了，视为无效
