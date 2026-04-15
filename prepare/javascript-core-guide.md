# JavaScript 核心知识学习指南

## 1. ES6+ 特性

### 1.1 Promise
Promise 是处理异步操作的对象，有三种状态：pending、fulfilled、rejected

```javascript
// 创建 Promise
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功');
  }, 1000);
});

// Promise 链式调用
promise
  .then(result => console.log(result))
  .catch(error => console.log(error))
  .finally(() => console.log('完成'));

// Promise.all - 所有 Promise 都成功才成功
Promise.all([promise1, promise2]).then(results => {});

// Promise.race - 最先完成的 Promise
Promise.race([promise1, promise2]).then(result => {});

// Promise.allSettled - 等待所有 Promise 完成（成功或失败）
Promise.allSettled([promise1, promise2]);

// Promise.any - 至少有一个成功就成功
Promise.any([promise1, promise2]);
```

### 1.2 async/await
基于 Promise 的语法糖，让异步代码看起来更像同步代码

```javascript
// 声明异步函数
async function fetchData() {
  try {
    const response = await fetch('url');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('错误:', error);
  } finally {
    console.log('请求完成');
  }
}

// 调用异步函数
fetchData().then(data => console.log(data));

// 错误处理的多种方式
async function example() {
  // 方式1：try-catch
  try {
    const result = await promise();
  } catch (e) {
    console.error(e);
  }
  
  // 方式2：catch 链式
  const result = await promise().catch(e => console.error(e));
  
  // 方式3：Promise.all 错误处理
  const [r1, r2] = await Promise.all([p1, p2]).catch(e => [null, null]);
}
```

### 1.3 Generator（生成器）
函数可以暂停执行和恢复执行

```javascript
// 定义 Generator 函数
function* generatorFn() {
  yield 1;
  yield 2;
  yield 3;
}

// 调用 Generator 返回迭代器
const gen = generatorFn();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }

// for...of 遍历
for (const value of generatorFn()) {
  console.log(value);
}

// 发送值给 Generator
function* counter() {
  let count = 0;
  while (true) {
    const increment = yield count;
    count += increment || 1;
  }
}

const gen = counter();
console.log(gen.next()); // { value: 0, done: false }
console.log(gen.next(5)); // { value: 5, done: false }

// Generator 与异步操作
function* fetchAPI() {
  try {
    const data = yield fetch('url');
    console.log(data);
  } catch (e) {
    console.error(e);
  }
}
```

### 1.4 Proxy（代理）
拦截和自定义对象的基本操作

```javascript
// 基本语法
const target = { name: 'Alice' };
const handler = {
  get(target, prop) {
    console.log(`访问 ${prop}`);
    return target[prop];
  },
  set(target, prop, value) {
    console.log(`设置 ${prop} = ${value}`);
    target[prop] = value;
    return true;
  }
};

const proxy = new Proxy(target, handler);

// 常见 handler 方法
const proxy = new Proxy(target, {
  // 读取属性
  get(target, prop, receiver) {
    console.log(`get ${prop}`);
    return Reflect.get(target, prop, receiver);
  },
  
  // 设置属性
  set(target, prop, value, receiver) {
    console.log(`set ${prop} = ${value}`);
    return Reflect.set(target, prop, value, receiver);
  },
  
  // 检查属性是否存在
  has(target, prop) {
    return prop in target;
  },
  
  // 删除属性
  deleteProperty(target, prop) {
    delete target[prop];
    return true;
  },
  
  // 获取属性描述符
  getOwnPropertyDescriptor(target, prop) {
    return Object.getOwnPropertyDescriptor(target, prop);
  },
  
  // 获取原型
  getPrototypeOf(target) {
    return Object.getPrototypeOf(target);
  }
});

// 应用场景：数据校验
const validator = {
  set(target, prop, value) {
    if (prop === 'age' && typeof value !== 'number') {
      throw new TypeError('年龄必须是数字');
    }
    target[prop] = value;
    return true;
  }
};

const person = new Proxy({}, validator);
person.age = 25; // OK
person.age = 'twenty-five'; // TypeError
```

### 1.5 Reflect（反射）
提供拦截 JavaScript 对象操作的方法，与 Proxy 配合使用

```javascript
// Reflect 方法
const target = { name: 'Bob', age: 30 };

// get - 获取属性值
Reflect.get(target, 'name'); // 'Bob'

// set - 设置属性值
Reflect.set(target, 'name', 'Charlie'); // true

// has - 检查属性是否存在
Reflect.has(target, 'name'); // true

// deleteProperty - 删除属性
Reflect.deleteProperty(target, 'age'); // true

// getOwnPropertyDescriptor - 获取属性描述符
Reflect.getOwnPropertyDescriptor(target, 'name');

// getPrototypeOf - 获取原型
Reflect.getPrototypeOf(target);

// setPrototypeOf - 设置原型
Reflect.setPrototypeOf(target, Object.prototype);

// keys - 获取属性键
Reflect.ownKeys(target);

// apply - 调用函数
function sum(a, b) {
  return a + b;
}
Reflect.apply(sum, null, [1, 2]); // 3

// construct - 构造对象
class User {
  constructor(name) {
    this.name = name;
  }
}
const user = Reflect.construct(User, ['Alice']);

// 与 Proxy 结合
const proxy = new Proxy(target, {
  get(target, prop, receiver) {
    console.log(`访问属性 ${prop}`);
    return Reflect.get(target, prop, receiver);
  }
});
```

---

## 2. 闭包、作用域链、this 绑定

### 2.1 闭包（Closure）
函数可以访问它的外部作用域的变量

```javascript
// 基本闭包
function outer() {
  const message = 'Hello';
  
  function inner() {
    console.log(message); // 访问外部作用域的变量
  }
  
  return inner;
}

const fn = outer();
fn(); // 'Hello'

// 闭包应用：计数器
function createCounter() {
  let count = 0;
  
  return {
    increment() {
      return ++count;
    },
    decrement() {
      return --count;
    },
    getCount() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount()); // 2

// 闭包陷阱：循环中的闭包
var funcs = [];
for (var i = 0; i < 3; i++) {
  funcs.push(function() {
    console.log(i); // 都输出 3
  });
}

// 解决方案 1：IIFE
for (var i = 0; i < 3; i++) {
  funcs.push((function(j) {
    return function() {
      console.log(j); // 正确：0, 1, 2
    };
  })(i));
}

// 解决方案 2：使用 let
for (let i = 0; i < 3; i++) {
  funcs.push(function() {
    console.log(i); // 正确：0, 1, 2
  });
}

// 闭包应用：私有变量
class BankAccount {
  constructor(initialBalance) {
    let balance = initialBalance;
    
    this.deposit = function(amount) {
      balance += amount;
      return balance;
    };
    
    this.withdraw = function(amount) {
      if (amount > balance) throw new Error('余额不足');
      balance -= amount;
      return balance;
    };
    
    this.getBalance = function() {
      return balance;
    };
  }
}
```

### 2.2 作用域链（Scope Chain）
变量查找顺序：当前作用域 → 外部作用域 → 全局作用域

```javascript
const global = 'global';

function outer() {
  const outerVar = 'outer';
  
  function middle() {
    const middleVar = 'middle';
    
    function inner() {
      const innerVar = 'inner';
      
      // 访问所有作用域的变量
      console.log(innerVar);    // 'inner' - 当前作用域
      console.log(middleVar);   // 'middle' - 外部作用域
      console.log(outerVar);    // 'outer' - 更外层作用域
      console.log(global);      // 'global' - 全局作用域
    }
    
    inner();
  }
  
  middle();
}

outer();

// 变量遮蔽（shadowing）
const x = 'global x';

function test() {
  const x = 'function x';
  
  {
    const x = 'block x';
    console.log(x); // 'block x'
  }
  
  console.log(x); // 'function x'
}

console.log(x); // 'global x'

// 作用域链的应用：模块模式
const module = (function() {
  // 私有变量
  const privateData = 'secret';
  let counter = 0;
  
  // 私有函数
  function privateMethod() {
    return privateData;
  }
  
  // 公开接口
  return {
    getCounter() {
      return counter;
    },
    increment() {
      return ++counter;
    },
    getData() {
      return privateMethod();
    }
  };
})();
```

### 2.3 this 绑定
this 的值取决于函数如何被调用

```javascript
// 1. 默认绑定（非严格模式指向 window/global，严格模式是 undefined）
function sayName() {
  console.log(this.name);
}

const name = 'Global';
sayName(); // 'Global'（非严格模式）

// 2. 隐式绑定（由调用对象决定）
const obj = {
  name: 'Object',
  sayName: function() {
    console.log(this.name);
  }
};

obj.sayName(); // 'Object'

// 3. 显式绑定（call, apply, bind）
function greet(greeting) {
  console.log(greeting + ', ' + this.name);
}

const person = { name: 'Alice' };

greet.call(person, 'Hello');      // Hello, Alice
greet.apply(person, ['Hello']);   // Hello, Alice

const boundGreet = greet.bind(person, 'Hello');
boundGreet(); // Hello, Alice

// 4. new 绑定（new 关键字）
function User(name) {
  this.name = name;
}

const user = new User('Bob');
console.log(user.name); // 'Bob'

// 5. 箭头函数绑定（继承外部 this）
const obj2 = {
  name: 'Object',
  regular: function() {
    return this.name;
  },
  arrow: () => {
    return this.name; // this 是外部作用域的 this
  }
};

obj2.regular(); // 'Object'
obj2.arrow();   // undefined（取决于外部 this）

// this 绑定优先级
class Example {
  constructor() {
    this.name = 'Instance';
  }
  
  test = () => {
    // 箭头函数作为属性
    console.log(this.name); // 'Instance'
  }
  
  regularMethod() {
    console.log(this.name);
  }
}

// 解决 this 绑定问题
class Component {
  constructor() {
    this.count = 0;
    // 方式 1：在构造函数中绑定
    this.increment = this.increment.bind(this);
    
    // 方式 2：使用箭头函数属性
    // this.decrement = () => { ... };
  }
  
  // 方式 3：使用类字段
  increment = () => {
    this.count++;
  }
  
  // 方式 4：在使用时绑定
  decrement() {
    this.count--;
  }
}
```

---

## 3. 原型链、继承、类

### 3.1 原型（Prototype）
每个对象都有一个原型，用于继承

```javascript
// 原型链访问
const obj = {};
console.log(obj.__proto__);           // Object.prototype
console.log(obj.__proto__.__proto__); // null

// 函数的 prototype 属性
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  console.log(this.name + ' makes a sound');
};

const dog = new Animal('Dog');
dog.speak(); // 'Dog makes a sound'

// 原型链
function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

// 建立原型链
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  console.log(this.name + ' barks');
};

const myDog = new Dog('Buddy', 'Labrador');
myDog.bark();  // 'Buddy barks'
myDog.speak(); // 'Buddy makes a sound'

// instanceof 检查
console.log(myDog instanceof Dog);    // true
console.log(myDog instanceof Animal); // true
console.log(myDog instanceof Object); // true
```

### 3.2 继承模式
实现对象之间的属性和方法继承

```javascript
// 1. 原型链继承
function Parent() {
  this.parentProp = 'parent';
}
Parent.prototype.parentMethod = function() {};

function Child() {}
Child.prototype = new Parent();

const child = new Child();
// 问题：共享引用类型属性

// 2. 盗用构造函数（构造函数继承）
function Parent(name) {
  this.name = name;
  this.colors = ['red', 'blue'];
}

function Child(name, age) {
  Parent.call(this, name); // 盗用父类构造函数
  this.age = age;
}

const child1 = new Child('Alice', 10);
const child2 = new Child('Bob', 12);
child1.colors.push('green');
console.log(child2.colors); // ['red', 'blue'] - 不共享

// 3. 组合继承（原型链 + 构造函数）
function Parent(name) {
  this.name = name;
}
Parent.prototype.getName = function() {
  return this.name;
};

function Child(name, age) {
  Parent.call(this, name); // 继承实例属性
  this.age = age;
}
Child.prototype = new Parent(); // 继承原型方法
Child.prototype.constructor = Child;

const child = new Child('Alice', 10);
child.getName(); // 'Alice'

// 4. 原型式继承（Object.create）
const parent = {
  name: 'Parent',
  greet() {
    console.log('Hello, ' + this.name);
  }
};

const child = Object.create(parent);
child.name = 'Child';
child.greet(); // 'Hello, Child'

// 5. 寄生式继承
function createChild(parent) {
  const child = Object.create(parent);
  child.someMethod = function() {};
  return child;
}

// 6. 寄生组合继承（最优方案）
function inherits(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype);
  Child.prototype.constructor = Child;
}

function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {};

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

inherits(Dog, Animal);
Dog.prototype.bark = function() {};
```

### 3.3 class 类
ES6 引入的类语法糖

```javascript
// 基本类定义
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    console.log(this.name + ' makes a sound');
  }
  
  // 静态方法
  static info() {
    return 'This is Animal class';
  }
  
  // getter
  get description() {
    return `${this.name} is an animal`;
  }
  
  // setter
  set description(value) {
    // validate and set
  }
}

const animal = new Animal('Generic');
animal.speak();
Animal.info();

// 继承
class Dog extends Animal {
  constructor(name, breed) {
    super(name); // 调用父类构造函数
    this.breed = breed;
  }
  
  speak() {
    console.log(this.name + ' barks');
  }
  
  // 新方法
  getBreed() {
    return this.breed;
  }
}

const dog = new Dog('Buddy', 'Labrador');
dog.speak();       // 'Buddy barks'
dog.getBreed();    // 'Labrador'

// 私有字段（类属性）
class BankAccount {
  #balance = 0; // 私有字段
  
  constructor(initialBalance) {
    this.#balance = initialBalance;
  }
  
  deposit(amount) {
    this.#balance += amount;
  }
  
  getBalance() {
    return this.#balance;
  }
}

const account = new BankAccount(1000);
account.deposit(500);
console.log(account.getBalance()); // 1500
// console.log(account.#balance);  // SyntaxError

// 静态属性
class Counter {
  static count = 0;
  
  constructor() {
    Counter.count++;
  }
  
  static getCount() {
    return Counter.count;
  }
}

// instanceof 检查
console.log(dog instanceof Dog);    // true
console.log(dog instanceof Animal); // true
```

---

## 4. 事件循环、微任务/宏任务

### 4.1 事件循环（Event Loop）
JavaScript 的执行模型，处理同步和异步任务

```javascript
// 同步代码执行顺序
console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

console.log('3');

// 输出：1, 3, 2

// 详细的事件循环演示
console.log('script start');

setTimeout(() => {
  console.log('setTimeout');
}, 0);

Promise.resolve()
  .then(() => {
    console.log('promise 1');
  })
  .then(() => {
    console.log('promise 2');
  });

console.log('script end');

/* 输出：
script start
script end
promise 1
promise 2
setTimeout
*/
```

### 4.2 微任务（Microtask）
优先级高，在当前任务执行完毕后立即执行

```javascript
// 常见的微任务
// 1. Promise 的 then/catch/finally
Promise.resolve()
  .then(() => console.log('Microtask: Promise.then'));

// 2. MutationObserver
const observer = new MutationObserver(() => {
  console.log('Microtask: MutationObserver');
});

// 3. process.nextTick (Node.js)
// process.nextTick(() => console.log('Microtask: nextTick'));

// 4. queueMicrotask
queueMicrotask(() => {
  console.log('Microtask: queueMicrotask');
});

// 执行顺序示例
console.log('开始');

setTimeout(() => {
  console.log('宏任务: setTimeout 1');
  Promise.resolve().then(() => console.log('微任务: Promise 在 setTimeout 中'));
}, 0);

Promise.resolve()
  .then(() => {
    console.log('微任务: Promise 1');
    setTimeout(() => {
      console.log('宏任务: setTimeout 在 Promise 中');
    }, 0);
  })
  .then(() => {
    console.log('微任务: Promise 2');
  });

console.log('结束');

/* 输出：
开始
结束
微任务: Promise 1
微任务: Promise 2
宏任务: setTimeout 1
微任务: Promise 在 setTimeout 中
宏任务: setTimeout 在 Promise 中
*/
```

### 4.3 宏任务（Macrotask）
优先级低，在微任务完成后才执行

```javascript
// 常见的宏任务
// 1. setTimeout
setTimeout(() => {
  console.log('Macrotask: setTimeout');
}, 0);

// 2. setInterval
const intervalId = setInterval(() => {
  console.log('Macrotask: setInterval');
}, 1000);

// 3. setImmediate (Node.js)
// setImmediate(() => console.log('Macrotask: setImmediate'));

// 4. requestAnimationFrame
// requestAnimationFrame(() => console.log('Macrotask: rAF'));

// 完整的事件循环示例
console.log('同步: 开始');

setTimeout(() => {
  console.log('宏任务: setTimeout 1');
  
  Promise.resolve().then(() => {
    console.log('微任务: Promise 在第一个 setTimeout 中');
  });
}, 0);

setTimeout(() => {
  console.log('宏任务: setTimeout 2');
}, 0);

Promise.resolve()
  .then(() => {
    console.log('微任务: Promise 1');
    
    setTimeout(() => {
      console.log('宏任务: setTimeout 3（在 Promise 中）');
    }, 0);
  })
  .then(() => {
    console.log('微任务: Promise 2');
  });

console.log('同步: 结束');

/* 输出：
同步: 开始
同步: 结束
微任务: Promise 1
微任务: Promise 2
宏任务: setTimeout 1
微任务: Promise 在第一个 setTimeout 中
宏任务: setTimeout 2
宏任务: setTimeout 3（在 Promise 中）
*/

// 事件循环的几个关键点
// 1. 执行所有同步代码
// 2. 执行所有微任务
// 3. 执行一个宏任务
// 4. 回到第 2 步，直到没有任务为止
```

---

## 5. 内存管理、垃圾回收

### 5.1 内存生命周期

```javascript
// 内存分配 → 使用 → 释放

// 1. 分配内存
const str = 'Hello';        // 为字符串分配内存
const arr = [1, 2, 3];      // 为数组分配内存
const obj = { name: 'John' }; // 为对象分配内存

function createLargeObject() {
  const largeArray = new Array(1000000);
  return largeArray;
}

// 2. 使用内存
console.log(str.length);
arr.forEach(item => console.log(item));
console.log(obj.name);

// 3. 释放内存（现代 JS 由垃圾回收器自动处理）
let reference = { data: 'important' };
reference = null; // 解除引用，便于垃圾回收
```

### 5.2 垃圾回收算法

```javascript
// 标记-清除（Mark and Sweep）- 现代浏览器使用
// 原理：标记所有可达的对象，然后清除不可达的对象

let obj1 = { name: 'obj1' };
let obj2 = { name: 'obj2' };
obj1.reference = obj2; // obj1 -> obj2

obj1 = null; // obj1 不可达，但 obj2 通过 obj1.reference 仍可达

// 引用计数（Reference Counting）- 现在很少使用
// 原理：跟踪每个对象的引用数，引用数为 0 时回收

// 循环引用问题（在引用计数中会造成内存泄漏）
function circularReference() {
  let obj1 = { name: 'obj1' };
  let obj2 = { name: 'obj2' };
  
  obj1.reference = obj2;
  obj2.reference = obj1; // 循环引用
  
  // 在引用计数中，即使函数退出，这两个对象也不会被回收
  // 但现代垃圾回收（标记-清除）可以处理循环引用
}
```

### 5.3 常见的内存泄漏

```javascript
// 1. 全局变量
function createGlobal() {
  globalVar = 'leak'; // 创建全局变量，永不回收
}

// 2. 未清除的计时器和回调
const timerId = setInterval(() => {
  console.log('still running');
}, 1000);

// 清除计时器避免内存泄漏
clearInterval(timerId);

// 3. DOM 引用
let detachedNode = document.getElementById('myElement');
document.body.removeChild(detachedNode);
// 即使 DOM 被移除，JavaScript 中的引用仍然保留对象

detachedNode = null; // 解除引用

// 4. 闭包中的大对象
function createLeak() {
  const largeData = new Array(1000000);
  
  return function() {
    console.log(largeData.length); // 保持对 largeData 的引用
  };
}

// 5. EventListener 未移除
const handler = () => console.log('clicked');
element.addEventListener('click', handler);

// 应该移除监听器
element.removeEventListener('click', handler);

// 6. 缓存不当
const cache = {};
function getData(key) {
  if (cache[key]) return cache[key];
  
  const data = new Array(1000000); // 大数据
  cache[key] = data;
  return data;
}

// 应该实现缓存过期机制
class CacheWithExpiry {
  constructor(ttl = 5000) {
    this.cache = new Map();
    this.ttl = ttl;
  }
  
  set(key, value) {
    if (this.cache.has(key)) {
      clearTimeout(this.cache.get(key).timeout);
    }
    
    const timeout = setTimeout(() => {
      this.cache.delete(key);
    }, this.ttl);
    
    this.cache.set(key, { value, timeout });
  }
  
  get(key) {
    if (!this.cache.has(key)) return null;
    return this.cache.get(key).value;
  }
}
```

### 5.4 内存优化技巧

```javascript
// 1. 及时释放大对象的引用
let largeObject = { data: new Array(10000) };
// 使用完毕后
largeObject = null;

// 2. 使用 WeakMap 和 WeakSet
const weakMap = new WeakMap();
let obj = { name: 'test' };

weakMap.set(obj, 'some data');

obj = null; // obj 可以被垃圾回收，weakMap 中的条目也会被自动移除
// 注意：WeakMap 和 WeakSet 不可遍历

// 3. 避免全局变量
// 不好
function bad() {
  leakyVar = 'leak'; // 全局变量
}

// 好
function good() {
  const localVar = 'no leak'; // 局部变量
}

// 4. 及时移除事件监听
class Component {
  constructor() {
    this.handleClick = this.handleClick.bind(this);
  }
  
  mount() {
    element.addEventListener('click', this.handleClick);
  }
  
  unmount() {
    element.removeEventListener('click', this.handleClick);
  }
  
  handleClick() {
    // handle click
  }
}

// 5. 使用对象池减少 GC 压力
class ObjectPool {
  constructor(factory, size = 10) {
    this.factory = factory;
    this.pool = Array(size).fill(null).map(() => factory());
    this.available = [...this.pool];
  }
  
  acquire() {
    return this.available.pop() || this.factory();
  }
  
  release(obj) {
    this.available.push(obj);
  }
}
```

---

## 6. 模块化

### 6.1 CommonJS（Node.js）
同步加载，主要用于服务端

```javascript
// 导出
// module.js
module.exports = {
  name: 'module',
  greeting: function() {
    return 'Hello';
  }
};

// 或者单个导出
module.exports = function() {
  return 'default export';
};

// 或者使用 exports（是 module.exports 的引用）
exports.name = 'module';
exports.greeting = function() {
  return 'Hello';
};

// 导入
// main.js
const module = require('./module');
const { name, greeting } = require('./module');

// 相对路径导入
const utils = require('./utils');
const helper = require('../helpers/helper');

// 从 node_modules 导入
const express = require('express');
const lodash = require('lodash');

// require 缓存
// 模块在首次 require 时被加载和缓存
// 后续 require 返回相同的实例
const fs = require('fs');
const fs2 = require('fs');
console.log(fs === fs2); // true
```

### 6.2 ES Module（ESM）
异步加载，JavaScript 标准模块系统

```javascript
// 导出
// math.js

// 命名导出
export function add(a, b) {
  return a + b;
}

export const PI = 3.14159;

export class Calculator {
  subtract(a, b) {
    return a - b;
  }
}

// 默认导出
export default function multiply(a, b) {
  return a * b;
}

// 或者
// export default { add, subtract }

// 重新导出
export { add, subtract } from './math';
export * from './utils'; // 导出所有命名导出

// 导入
// main.js

// 导入命名导出
import { add, PI, Calculator } from './math.js';

// 导入默认导出
import multiply from './math.js';

// 导入所有导出
import * as math from './math.js';

// 混合导入
import multiply, { add, PI } from './math.js';

// 导入并重命名
import { add as addition, PI as PI_VALUE } from './math.js';

// 动态导入（异步）
const modulePromise = import('./module.js');

modulePromise.then(module => {
  console.log(module.default);
  console.log(module.namedExport);
});

// 或使用 async/await
async function loadModule() {
  const module = await import('./module.js');
  console.log(module);
}

// 条件导入
if (condition) {
  import('./heavy-module.js').then(module => {
    // 使用模块
  });
}
```

### 6.3 AMD（异步模块定义）
主要用于浏览器

```javascript
// 定义模块
// math.js
define(function() {
  return {
    add: function(a, b) {
      return a + b;
    },
    subtract: function(a, b) {
      return a - b;
    }
  };
});

// 定义依赖于其他模块的模块
// calculator.js
define(['./math'], function(math) {
  return {
    square: function(n) {
      return math.multiply(n, n);
    }
  };
});

// 使用 require 加载模块
require(['./math', './calculator'], function(math, calculator) {
  console.log(math.add(1, 2));
});

// RequireJS 配置
requirejs.config({
  paths: {
    'math': 'lib/math',
    'jquery': 'lib/jquery'
  },
  shim: {
    'jquery.plugin': {
      deps: ['jquery']
    }
  }
});
```

### 6.4 UMD（通用模块定义）
兼容 CommonJS、AMD 和全局变量

```javascript
// umd-module.js
(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    // CommonJS
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else {
    // 全局变量
    root.myModule = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  return {
    name: 'UMD Module',
    version: '1.0.0'
  };
}));

// 可以在以下环境中使用：
// CommonJS: const module = require('./umd-module');
// AMD: define(['./umd-module'], function(module) { ... });
// 全局: window.myModule
```

### 6.5 模块化模式比较

| 特性 | CommonJS | ES Module | AMD |
|------|----------|-----------|-----|
| 加载 | 同步 | 异步（静态） | 异步 |
| 环境 | Node.js | 现代浏览器、Node.js | 浏览器 |
| 语法 | require/exports | import/export | define/require |
| 树摇（Tree Shaking） | 否 | 是 | 否 |
| 静态分析 | 否 | 是 | 否 |

---

## 学习检查清单

### ES6+ 特性
- [ ] Promise（创建、then/catch/finally、Promise.all/race/allSettled/any）
- [ ] async/await（基本用法、错误处理、并发控制）
- [ ] Generator（基本用法、yield、协程）
- [ ] Proxy（get/set/has 等 trap）
- [ ] Reflect（常见方法、与 Proxy 配合）

### 闭包、作用域、this
- [ ] 闭包的定义和应用（计数器、模块模式）
- [ ] 作用域链和变量遮蔽
- [ ] this 的五种绑定方式（默认、隐式、显式、new、箭头）
- [ ] 函数式编程中的 this 问题解决

### 原型链、继承、类
- [ ] 原型和原型链
- [ ] 原型链继承、构造函数继承、组合继承
- [ ] Object.create 和寄生式继承
- [ ] ES6 class 语法和继承
- [ ] 私有字段和静态成员

### 事件循环
- [ ] 同步代码执行
- [ ] 微任务队列（Promise、queueMicrotask）
- [ ] 宏任务队列（setTimeout、setInterval）
- [ ] 执行顺序和优先级
- [ ] 实际应用场景

### 内存管理
- [ ] 标记-清除算法
- [ ] 常见的内存泄漏场景
- [ ] WeakMap 和 WeakSet
- [ ] 内存优化最佳实践

### 模块化
- [ ] CommonJS（require/exports）
- [ ] ES Module（import/export）
- [ ] 动态导入
- [ ] AMD 和 UMD
- [ ] 模块化设计模式

---

## 相关资源和深入阅读

1. MDN Web Docs - JavaScript
2. "JavaScript: The Good Parts" by Douglas Crockford
3. "You Don't Know JS" by Kyle Simpson
4. "Eloquent JavaScript" by Marijn Haverbeke
5. ES6 标准规范
6. V8 引擎文档（关于垃圾回收和性能优化）
