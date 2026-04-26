# 原型、原型链与继承核心基础知识

## 一、原型（Prototype）

### 1. 什么是原型？

- **原型**是 JavaScript 中对象的一个特殊属性，用于实现对象间的继承
- 每个对象（除了 `null`）都有一个原型对象
- 原型对象本身也是一个对象，它也有自己的原型（形成原型链）

### 2. 原型的作用

- **属性继承**：对象可以访问其原型链上的属性和方法
- **方法复用**：多个对象可以共享原型上的方法，节省内存
- **实现继承**：通过原型链实现对象间的继承关系

### 3. 原型相关的属性和方法

#### `__proto__` 属性

- 每个对象都有一个 `__proto__` 属性，指向其原型对象
- 非标准属性，但被大多数浏览器支持
- 可用于查看和修改对象的原型

#### `prototype` 属性

- 函数对象特有的属性，指向该函数的原型对象
- 当函数作为构造函数使用时，其 `prototype` 成为实例的原型

#### `Object.getPrototypeOf()`

- ES5 标准方法，用于获取对象的原型
- 推荐使用，替代 `__proto__`

#### `Object.setPrototypeOf()`

- ES6 标准方法，用于设置对象的原型
- 推荐使用，替代直接修改 `__proto__`

### 4. 示例代码

```javascript
// 创建构造函数
function Person(name) {
  this.name = name;
}

// 在原型上添加方法
Person.prototype.sayHello = function() {
  console.log(`Hello, I'm ${this.name}`);
};

// 创建实例
const john = new Person('John');

// 访问实例属性
console.log(john.name); // 输出: John

// 访问原型方法
john.sayHello(); // 输出: Hello, I'm John

// 查看原型
console.log(john.__proto__ === Person.prototype); // 输出: true
console.log(Object.getPrototypeOf(john) === Person.prototype); // 输出: true
```

## 二、原型链（Prototype Chain）

### 1. 什么是原型链？

- **原型链**是由对象的原型组成的链式结构
- 当访问对象的属性或方法时，JavaScript 会沿着原型链向上查找，直到找到对应属性或到达原型链终点（`null`）
- 原型链是 JavaScript 实现继承的核心机制

### 2. 原型链的结构

- 每个对象的原型也是一个对象，因此也有自己的原型
- 原型链的终点是 `null`（`Object.prototype.__proto__ === null`）
- 所有对象最终都继承自 `Object.prototype`

### 3. 原型链的查找机制

1. 当访问对象的属性或方法时，首先在对象自身查找
2. 如果找不到，沿着 `__proto__` 向上查找原型对象
3. 继续向上查找，直到找到对应属性或到达 `null`
4. 如果最终没找到，返回 `undefined`（对于属性）或抛出错误（对于方法）

### 4. 示例代码

```javascript
// 构造函数
function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function() {
  console.log(`Hello, I'm ${this.name}`);
};

// 创建实例
const john = new Person('John');

// 访问自身属性
console.log(john.name); // 输出: John

// 访问原型方法
john.sayHello(); // 输出: Hello, I'm John

// 访问 Object.prototype 上的方法
console.log(john.toString()); // 输出: [object Object]

// 原型链结构
// john -> Person.prototype -> Object.prototype -> null
console.log(john.__proto__ === Person.prototype); // true
console.log(Person.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__ === null); // true
```

## 三、继承

### 1. 原型链继承

- **原理**：通过修改子类构造函数的 `prototype` 为父类的实例
- **优点**：简单直观，实现了方法的复用
- **缺点**：
  - 父类的实例属性会被所有子类实例共享
  - 无法在创建子类实例时向父类构造函数传递参数

```javascript
// 父类
function Parent(name) {
  this.name = name;
  this.hobbies = ['reading', 'coding'];
}

Parent.prototype.sayName = function() {
  console.log(`My name is ${this.name}`);
};

// 子类
function Child(age) {
  this.age = age;
}

// 原型链继承
Child.prototype = new Parent('Parent');
Child.prototype.constructor = Child; // 修复 constructor 指向

// 创建子类实例
const child1 = new Child(10);
const child2 = new Child(12);

// 访问继承的属性和方法
console.log(child1.name); // 输出: Parent
child1.sayName(); // 输出: My name is Parent

// 共享父类实例属性的问题
child1.hobbies.push('swimming');
console.log(child2.hobbies); // 输出: ['reading', 'coding', 'swimming']
```

### 2. 构造函数继承

- **原理**：在子类构造函数中调用父类构造函数（使用 `call` 或 `apply`）
- **优点**：
  - 避免了父类实例属性被共享的问题
  - 可以在创建子类实例时向父类传递参数
- **缺点**：无法继承父类原型上的方法

```javascript
// 父类
function Parent(name) {
  this.name = name;
  this.hobbies = ['reading', 'coding'];
}

Parent.prototype.sayName = function() {
  console.log(`My name is ${this.name}`);
};

// 子类
function Child(name, age) {
  // 调用父类构造函数
  Parent.call(this, name);
  this.age = age;
}

// 创建子类实例
const child1 = new Child('John', 10);
const child2 = new Child('Jane', 12);

// 访问继承的属性
console.log(child1.name); // 输出: John
console.log(child1.age); // 输出: 10

// 避免了属性共享问题
child1.hobbies.push('swimming');
console.log(child2.hobbies); // 输出: ['reading', 'coding']

// 无法访问父类原型方法
// child1.sayName(); // 报错: child1.sayName is not a function
```

### 3. 组合继承

- **原理**：结合原型链继承和构造函数继承的优点
- **优点**：
  - 避免了父类实例属性被共享的问题
  - 可以继承父类原型上的方法
  - 可以在创建子类实例时向父类传递参数
- **缺点**：父类构造函数会被调用两次

```javascript
// 父类
function Parent(name) {
  this.name = name;
  this.hobbies = ['reading', 'coding'];
}

Parent.prototype.sayName = function() {
  console.log(`My name is ${this.name}`);
};

// 子类
function Child(name, age) {
  // 第一次调用父类构造函数
  Parent.call(this, name);
  this.age = age;
}

// 第二次调用父类构造函数
Child.prototype = new Parent();
Child.prototype.constructor = Child; // 修复 constructor 指向

// 创建子类实例
const child1 = new Child('John', 10);

// 访问继承的属性和方法
console.log(child1.name); // 输出: John
console.log(child1.age); // 输出: 10
child1.sayName(); // 输出: My name is John

// 避免了属性共享问题
child1.hobbies.push('swimming');
const child2 = new Child('Jane', 12);
console.log(child2.hobbies); // 输出: ['reading', 'coding']
```

### 4. 原型式继承

- **原理**：使用 `Object.create()` 创建一个以指定对象为原型的新对象
- **优点**：简单易用，适合创建对象的浅拷贝
- **缺点**：与原型链继承类似，父对象的引用类型属性会被共享

```javascript
// 父对象
const parent = {
  name: 'Parent',
  hobbies: ['reading', 'coding'],
  sayName: function() {
    console.log(`My name is ${this.name}`);
  }
};

// 原型式继承
const child1 = Object.create(parent);
child1.name = 'Child1';

// 访问继承的属性和方法
console.log(child1.name); // 输出: Child1
child1.sayName(); // 输出: My name is Child1

// 引用类型属性共享问题
child1.hobbies.push('swimming');
const child2 = Object.create(parent);
console.log(child2.hobbies); // 输出: ['reading', 'coding', 'swimming']
```

### 5. 寄生式继承

- **原理**：在原型式继承的基础上，增强新对象
- **优点**：可以为新对象添加额外的属性和方法
- **缺点**：与原型式继承类似，存在引用类型属性共享问题

```javascript
function createChild(parent) {
  // 使用原型式继承创建新对象
  const child = Object.create(parent);
  // 增强新对象
  child.age = 10;
  child.sayAge = function() {
    console.log(`I'm ${this.age} years old`);
  };
  return child;
}

// 父对象
const parent = {
  name: 'Parent',
  sayName: function() {
    console.log(`My name is ${this.name}`);
  }
};

// 创建子类实例
const child = createChild(parent);
child.name = 'Child';

// 访问属性和方法
console.log(child.name); // 输出: Child
console.log(child.age); // 输出: 10
child.sayName(); // 输出: My name is Child
child.sayAge(); // 输出: I'm 10 years old
```

### 6. 寄生组合式继承

- **原理**：结合组合继承和寄生式继承的优点，避免了父类构造函数被调用两次的问题
- **优点**：
  - 避免了父类构造函数被调用两次
  - 可以继承父类原型上的方法
  - 可以在创建子类实例时向父类传递参数
  - 避免了父类实例属性被共享的问题
- **缺点**：实现相对复杂

```javascript
// 寄生组合式继承的核心函数
function inheritPrototype(child, parent) {
  // 创建父类原型的浅拷贝
  const prototype = Object.create(parent.prototype);
  // 修复 constructor 指向
  prototype.constructor = child;
  // 将子类的 prototype 设置为这个拷贝
  child.prototype = prototype;
}

// 父类
function Parent(name) {
  this.name = name;
  this.hobbies = ['reading', 'coding'];
}

Parent.prototype.sayName = function() {
  console.log(`My name is ${this.name}`);
};

// 子类
function Child(name, age) {
  // 调用父类构造函数
  Parent.call(this, name);
  this.age = age;
}

// 继承父类原型
inheritPrototype(Child, Parent);

// 创建子类实例
const child1 = new Child('John', 10);

// 访问继承的属性和方法
console.log(child1.name); // 输出: John
console.log(child1.age); // 输出: 10
child1.sayName(); // 输出: My name is John

// 避免了属性共享问题
child1.hobbies.push('swimming');
const child2 = new Child('Jane', 12);
console.log(child2.hobbies); // 输出: ['reading', 'coding']
```

### 7. ES6 Class 继承

- **原理**：使用 `class` 和 `extends` 关键字实现继承
- **优点**：
  - 语法简洁清晰
  - 支持 `super` 关键字调用父类构造函数
  - 支持静态方法和属性的继承
  - 与其他面向对象语言的语法类似，易于理解
- **缺点**：本质上仍是基于原型链实现的语法糖

```javascript
// 父类
class Parent {
  constructor(name) {
    this.name = name;
    this.hobbies = ['reading', 'coding'];
  }
  
  sayName() {
    console.log(`My name is ${this.name}`);
  }
}

// 子类
class Child extends Parent {
  constructor(name, age) {
    super(name); // 调用父类构造函数
    this.age = age;
  }
  
  sayAge() {
    console.log(`I'm ${this.age} years old`);
  }
}

// 创建子类实例
const child1 = new Child('John', 10);

// 访问继承的属性和方法
console.log(child1.name); // 输出: John
console.log(child1.age); // 输出: 10
child1.sayName(); // 输出: My name is John
child1.sayAge(); // 输出: I'm 10 years old

// 避免了属性共享问题
child1.hobbies.push('swimming');
const child2 = new Child('Jane', 12);
console.log(child2.hobbies); // 输出: ['reading', 'coding']
```

## 四、核心概念和注意事项

### 1. `constructor` 属性

- 每个对象都有一个 `constructor` 属性，指向创建该对象的构造函数
- 当修改对象的原型时，需要手动修复 `constructor` 指向
- 例如：`Child.prototype.constructor = Child;`

### 2. `instanceof` 操作符

- 用于检查对象是否是某个构造函数的实例
- 原理：检查对象的原型链中是否包含构造函数的 `prototype` 属性
- 例如：`child instanceof Child; // true`

### 3. 原型链的性能

- 原型链查找会影响性能，尤其是当原型链较长时
- 建议将常用的方法和属性定义在对象自身或较近的原型上
- 避免在原型链的末端查找频繁使用的属性和方法

### 4. 避免修改内置对象的原型

- 修改 `Object.prototype`、`Array.prototype` 等内置对象的原型可能会导致意外的行为
- 如果需要扩展内置对象，建议使用组合或继承的方式，而不是直接修改原型

### 5. 理解 `this` 的指向

- 在原型方法中，`this` 指向调用该方法的实例
- 在构造函数中，`this` 指向新创建的实例
- 注意箭头函数没有自己的 `this`，它会继承外层作用域的 `this`

## 五、总结

### 1. 原型和原型链

- 原型是对象的一个特殊属性，用于实现继承
- 原型链是由对象的原型组成的链式结构，用于属性和方法的查找
- 所有对象最终都继承自 `Object.prototype`，原型链的终点是 `null`

### 2. 继承方式

- **原型链继承**：简单但存在属性共享问题
- **构造函数继承**：避免属性共享但无法继承原型方法
- **组合继承**：结合前两者的优点，但父类构造函数会被调用两次
- **原型式继承**：使用 `Object.create()` 创建对象的浅拷贝
- **寄生式继承**：在原型式继承基础上增强新对象
- **寄生组合式继承**：最优的继承方式，避免了前几种方式的缺点
- **ES6 Class 继承**：语法简洁，本质上是原型链继承的语法糖

### 3. 最佳实践

- 优先使用 ES6 的 `class` 和 `extends` 语法，代码更清晰易读
- 对于复杂的继承关系，考虑使用组合而非继承
- 理解原型链的工作原理，避免不必要的性能损耗
- 注意修改原型时修复 `constructor` 指向
- 避免修改内置对象的原型
