# 主要是数据类型、运算符、基础语法

# JavaScript 基础

本文档涵盖 JavaScript 的核心基础知识，包括数据类型、运算符和基础语法。

## 目录

- [数据类型](#数据类型)
  - [原始类型](#原始类型)
  - [引用类型](#引用类型)
  - [类型转换](#类型转换)
  - [类型检查](#类型检查)
- [运算符](#运算符)
  - [算术运算符](#算术运算符)
  - [比较运算符](#比较运算符)
  - [逻辑运算符](#逻辑运算符)
  - [赋值运算符](#赋值运算符)
  - [一元运算符](#一元运算符)
  - [三元运算符](#三元运算符)
  - [其他运算符](#其他运算符)
- [基础语法](#基础语法)
  - [变量声明](#变量声明)
  - [控制流](#控制流)
  - [函数](#函数)
  - [对象和数组](#对象和数组)
  - [错误处理](#错误处理)

## 数据类型

JavaScript 有两种主要的数据类型：原始类型和引用类型。

### 原始类型

原始类型是不可变的值，直接存储在栈内存中。

#### 1. Number

表示数字，包括整数和浮点数。

```javascript
let integer = 42;
let float = 3.14;
let negative = -10;
let infinity = Infinity;
let nan = NaN; // Not a Number
```

#### 2. String

表示文本，由零个或多个字符组成。

```javascript
let emptyString = "";
let singleQuote = 'Hello';
let doubleQuote = "World";
let templateLiteral = `Hello ${name}`; // ES6 模板字符串
```

#### 3. Boolean

表示真或假，只有两个值：`true` 和 `false`。

```javascript
let isTrue = true;
let isFalse = false;
```

#### 4. Null

表示空值，是一个特殊的关键字。

```javascript
let nullValue = null;
```

#### 5. Undefined

表示未定义的值，变量声明但未赋值时的默认值。

```javascript
let undefinedValue;
console.log(undefinedValue); // undefined
```

#### 6. Symbol (ES6+)

表示唯一的、不可变的值，常用于对象属性的键。

```javascript
let sym1 = Symbol('description');
let sym2 = Symbol('description');
console.log(sym1 === sym2); // false
```

#### 7. BigInt (ES2020+)

表示任意精度的整数，用于处理大数字。

```javascript
let bigNumber = 9007199254740991n;
let anotherBigNumber = BigInt(9007199254740991);
```

### 引用类型

引用类型的值存储在堆内存中，栈内存中存储的是指向堆内存的引用地址。

#### 1. Object

JavaScript 中除了原始类型外的所有值都是对象。

```javascript
let obj = {
  name: "John",
  age: 30,
  greet: function() {
    console.log(`Hello, ${this.name}!`);
  }
};
```

#### 2. Array

有序的集合，可以存储不同类型的值。

```javascript
let arr = [1, "two", true, null, undefined];
let emptyArray = [];
let nestedArray = [[1, 2], [3, 4]];
```

#### 3. Function

可执行的代码块。

```javascript
function add(a, b) {
  return a + b;
}

const multiply = function(a, b) {
  return a * b;
};

const divide = (a, b) => a / b; // 箭头函数
```

#### 4. Date

表示日期和时间。

```javascript
let now = new Date();
let specificDate = new Date(2023, 0, 1); // 2023年1月1日
```

#### 5. RegExp

表示正则表达式，用于模式匹配。

```javascript
let regex = /\d+/g; // 匹配一个或多个数字
let anotherRegex = new RegExp('\\d+', 'g');
```

### 类型转换

JavaScript 是一种动态类型语言，会在需要时自动进行类型转换。

#### 1. 隐式类型转换

```javascript
// 字符串拼接
let result1 = "The answer is " + 42; // "The answer is 42"

// 数字运算
let result2 = "10" - 5; // 5
let result3 = "10" * 2; // 20

// 布尔转换
if ("hello") { /* 执行，因为非空字符串为 true */ }
if (0) { /* 不执行，因为 0 为 false */ }
```

#### 2. 显式类型转换

```javascript
// 转为字符串
let str1 = String(42); // "42"
let str2 = 42.toString(); // "42"

// 转为数字
let num1 = Number("42"); // 42
let num2 = parseInt("42px"); // 42
let num3 = parseFloat("3.14"); // 3.14

// 转为布尔值
let bool1 = Boolean("hello"); // true
let bool2 = Boolean(""); // false
let bool3 = Boolean(0); // false
let bool4 = Boolean(42); // true
```

### 类型检查

#### 1. typeof 操作符

```javascript
typeof 42; // "number"
typeof "hello"; // "string"
typeof true; // "boolean"
typeof null; // "object" (历史遗留问题)
typeof undefined; // "undefined"
typeof Symbol(); // "symbol"
typeof 123n; // "bigint"
typeof {}; // "object"
typeof []; // "object"
typeof function() {}; // "function"
```

#### 2. instanceof 操作符

检查对象是否是某个构造函数的实例。

```javascript
[] instanceof Array; // true
{} instanceof Object; // true
new Date() instanceof Date; // true
```

#### 3. Object.prototype.toString.call()

更准确的类型检查方法。

```javascript
Object.prototype.toString.call(42); // "[object Number]"
Object.prototype.toString.call("hello"); // "[object String]"
Object.prototype.toString.call([]); // "[object Array]"
Object.prototype.toString.call({}); // "[object Object]"
```

## 运算符

### 算术运算符

| 运算符 | 描述 | 示例 |
|--------|------|------|
| `+` | 加法 | `1 + 2` // 3 |
| `-` | 减法 | `5 - 3` // 2 |
| `*` | 乘法 | `2 * 3` // 6 |
| `/` | 除法 | `10 / 2` // 5 |
| `%` | 取模 | `10 % 3` // 1 |
| `**` | 幂运算 (ES6+) | `2 ** 3` // 8 |

### 比较运算符

| 运算符 | 描述 | 示例 |
|--------|------|------|
| `==` | 相等（类型转换） | `1 == "1"` // true |
| `===` | 严格相等（无类型转换） | `1 === "1"` // false |
| `!=` | 不相等（类型转换） | `1 != "1"` // false |
| `!==` | 严格不相等（无类型转换） | `1 !== "1"` // true |
| `<` | 小于 | `2 < 3` // true |
| `>` | 大于 | `2 > 3` // false |
| `<=` | 小于等于 | `2 <= 2` // true |
| `>=` | 大于等于 | `3 >= 2` // true |

### 逻辑运算符

| 运算符 | 描述 | 示例 |
|--------|------|------|
| `&&` | 逻辑与 | `true && false` // false |
| `||` | 逻辑或 | `true || false` // true |
| `!` | 逻辑非 | `!true` // false |

### 赋值运算符

| 运算符 | 描述 | 示例 |
|--------|------|------|
| `=` | 赋值 | `let a = 1` |
| `+=` | 加赋值 | `a += 2` // 等同于 a = a + 2 |
| `-=` | 减赋值 | `a -= 2` // 等同于 a = a - 2 |
| `*=` | 乘赋值 | `a *= 2` // 等同于 a = a * 2 |
| `/=` | 除赋值 | `a /= 2` // 等同于 a = a / 2 |
| `%=` | 取模赋值 | `a %= 2` // 等同于 a = a % 2 |
| `**=` | 幂赋值 | `a **= 2` // 等同于 a = a ** 2 |

### 一元运算符

| 运算符 | 描述 | 示例 |
|--------|------|------|
| `+` | 一元加 | `+"1"` // 1 |
| `-` | 一元减 | `-1` // -1 |
| `++` | 自增 | `a++` 或 `++a` |
| `--` | 自减 | `a--` 或 `--a` |
| `typeof` | 类型检查 | `typeof 42` // "number" |
| `delete` | 删除对象属性 | `delete obj.prop` |
| `void` | 执行表达式并返回 undefined | `void 0` // undefined |

### 三元运算符

```javascript
condition ? expression1 : expression2
```

如果条件为真，返回 expression1，否则返回 expression2。

```javascript
let age = 18;
let status = age >= 18 ? "成年" : "未成年";
console.log(status); // "成年"
```

### 其他运算符

#### 1. 逗号运算符

```javascript
let a = (1, 2, 3); // a = 3
```

#### 2. 可选链运算符 (ES2020+)

```javascript
let obj = { a: { b: 1 } };
console.log(obj?.a?.b); // 1
console.log(obj?.c?.d); // undefined
```

#### 3. 空值合并运算符 (ES2020+)

```javascript
let a = null ?? "默认值"; // "默认值"
let b = undefined ?? "默认值"; // "默认值"
let c = 0 ?? "默认值"; // 0
```

#### 4. 扩展运算符 (ES6+)

```javascript
// 数组扩展
let arr1 = [1, 2, 3];
let arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

// 对象扩展
let obj1 = { a: 1 };
let obj2 = { ...obj1, b: 2 }; // { a: 1, b: 2 }
```

## 基础语法

### 变量声明

#### 1. var

- 函数作用域
- 可以重复声明
- 存在变量提升

```javascript
var a = 1;
var a = 2; // 允许重复声明
console.log(a); // 2

function test() {
  var b = 3;
}
console.log(b); // ReferenceError: b is not defined
```

#### 2. let (ES6+)

- 块级作用域
- 不允许重复声明
- 不存在变量提升

```javascript
let a = 1;
// let a = 2; // 错误：标识符已声明

if (true) {
  let b = 3;
}
console.log(b); // ReferenceError: b is not defined
```

#### 3. const (ES6+)

- 块级作用域
- 不允许重复声明
- 声明时必须初始化
- 不能重新赋值（但对象和数组的内容可以修改）

```javascript
const a = 1;
// const a = 2; // 错误：标识符已声明
// a = 2; // 错误：不能重新赋值

const obj = { a: 1 };
obj.b = 2; // 允许修改对象内容
console.log(obj); // { a: 1, b: 2 }
```

### 控制流

#### 1. if-else 语句

```javascript
if (condition) {
  // 条件为真时执行
} else if (anotherCondition) {
  // 另一个条件为真时执行
} else {
  // 所有条件都为假时执行
}
```

#### 2. switch 语句

```javascript
switch (expression) {
  case value1:
    // 表达式等于 value1 时执行
    break;
  case value2:
    // 表达式等于 value2 时执行
    break;
  default:
    // 表达式不等于任何 case 时执行
}
```

#### 3. 循环语句

##### for 循环

```javascript
for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
}
```

##### for-in 循环（遍历对象属性）

```javascript
let obj = { a: 1, b: 2, c: 3 };
for (let key in obj) {
  console.log(key, obj[key]); // a 1, b 2, c 3
}
```

##### for-of 循环（遍历可迭代对象）

```javascript
let arr = [1, 2, 3];
for (let value of arr) {
  console.log(value); // 1, 2, 3
}
```

##### while 循环

```javascript
let i = 0;
while (i < 5) {
  console.log(i); // 0, 1, 2, 3, 4
  i++;
}
```

##### do-while 循环

```javascript
let i = 0;
do {
  console.log(i); // 0, 1, 2, 3, 4
  i++;
} while (i < 5);
```

### 函数

#### 1. 函数声明

```javascript
function add(a, b) {
  return a + b;
}

console.log(add(1, 2)); // 3
```

#### 2. 函数表达式

```javascript
const add = function(a, b) {
  return a + b;
};

console.log(add(1, 2)); // 3
```

#### 3. 箭头函数 (ES6+)

```javascript
const add = (a, b) => a + b;

console.log(add(1, 2)); // 3

// 多行箭头函数
const multiply = (a, b) => {
  const result = a * b;
  return result;
};
```

#### 4. 函数参数

```javascript
// 默认参数 (ES6+)
function greet(name = "World") {
  console.log(`Hello, ${name}!`);
}

greet(); // Hello, World!
greet("John"); // Hello, John!

// 剩余参数 (ES6+)
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3, 4)); // 10

// 解构参数 (ES6+)
function printUser({ name, age }) {
  console.log(`Name: ${name}, Age: ${age}`);
}

printUser({ name: "John", age: 30 }); // Name: John, Age: 30
```

### 对象和数组

#### 1. 对象

```javascript
// 对象字面量
let person = {
  name: "John",
  age: 30,
  greet: function() {
    console.log(`Hello, ${this.name}!`);
  },
  // 简洁方法语法 (ES6+)
  sayAge() {
    console.log(`I am ${this.age} years old.`);
  }
};

// 访问对象属性
console.log(person.name); // "John"
console.log(person["age"]); // 30

// 修改对象属性
person.age = 31;

// 添加新属性
person.email = "john@example.com";

// 删除属性
delete person.email;
```

#### 2. 数组

```javascript
// 数组字面量
let numbers = [1, 2, 3, 4, 5];

// 访问数组元素
console.log(numbers[0]); // 1

// 修改数组元素
numbers[0] = 10;

// 数组方法
numbers.push(6); // 添加元素到末尾
numbers.pop(); // 移除末尾元素
numbers.unshift(0); // 添加元素到开头
numbers.shift(); // 移除开头元素
numbers.splice(2, 1); // 从索引 2 开始移除 1 个元素

// 数组遍历
numbers.forEach(num => console.log(num));

// 数组映射
let doubled = numbers.map(num => num * 2);

// 数组过滤
let evenNumbers = numbers.filter(num => num % 2 === 0);

// 数组归约
let sum = numbers.reduce((total, num) => total + num, 0);
```

### 错误处理

#### try-catch 语句

```javascript
try {
  // 可能会抛出错误的代码
  const result = riskyOperation();
  console.log(result);
} catch (error) {
  // 处理错误
  console.error("An error occurred:", error.message);
} finally {
  // 无论是否发生错误都会执行的代码
  console.log("Operation completed.");
}
```

#### 抛出错误

```javascript
function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a / b;
}

try {
  console.log(divide(10, 0));
} catch (error) {
  console.error(error.message); // "Division by zero"
}
```

## 总结

本文档涵盖了 JavaScript 的核心基础知识，包括：

- **数据类型**：原始类型和引用类型，以及它们的特点和使用方法
- **运算符**：算术、比较、逻辑、赋值等各种运算符的使用
- **基础语法**：变量声明、控制流、函数、对象和数组的基本操作，以及错误处理

这些基础知识是学习 JavaScript 的基础，掌握它们对于理解更高级的 JavaScript 特性和框架至关重要。

## 进一步学习

- [JavaScript 高级特性](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [ES6+ 新特性](https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript)
- [JavaScript 设计模式](https://addyosmani.com/resources/essentialjsdesignpatterns/book/)
- [JavaScript 性能优化](https://developers.google.com/web/fundamentals/performance)