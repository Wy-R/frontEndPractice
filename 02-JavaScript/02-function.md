# JavaScript 函数、作用域、闭包与 this 核心基础知识点

本文档涵盖 JavaScript 中函数、作用域、闭包和 this 的核心基础知识。

## 目录

- [函数 (Function)](#函数-function)
  - [函数声明](#函数声明)
  - [函数表达式](#函数表达式)
  - [箭头函数 (ES6+)](#箭头函数-es6)
  - [立即执行函数表达式 (IIFE)](#立即执行函数表达式-iife)
  - [函数参数](#函数参数)
  - [函数返回值](#函数返回值)
  - [函数的属性和方法](#函数的属性和方法)
  - [函数作为一等公民](#函数作为一等公民)
- [作用域 (Scope)](#作用域-scope)
  - [词法作用域](#词法作用域)
  - [函数作用域](#函数作用域)
  - [块级作用域 (ES6+)](#块级作用域-es6)
  - [全局作用域](#全局作用域)
  - [作用域链](#作用域链)
  - [变量提升](#变量提升)
- [闭包 (Closure)](#闭包-closure)
  - [闭包的概念](#闭包的概念)
  - [闭包的工作原理](#闭包的工作原理)
  - [闭包的应用场景](#闭包的应用场景)
  - [闭包与内存泄漏](#闭包与内存泄漏)
- [this 关键字](#this-关键字)
  - [this 的绑定规则](#this-的绑定规则)
  - [默认绑定](#默认绑定)
  - [隐式绑定](#隐式绑定)
  - [显式绑定](#显式绑定)
  - [new 绑定](#new-绑定)
  - [箭头函数的 this](#箭头函数的-this)
  - [this 绑定的优先级](#this-绑定的优先级)
  - [改变 this 的指向](#改变-this-指向)
- [实际应用示例](#实际应用示例)
- [最佳实践](#最佳实践)
- [总结](#总结)

## 函数 (Function)

函数是 JavaScript 中的基本构建块，用于封装可重复使用的代码块。

### 函数声明

函数声明使用 `function` 关键字，具有函数提升的特性。

```javascript
function add(a, b) {
  return a + b;
}

console.log(add(1, 2)); // 3
```

### 函数表达式

函数表达式将函数赋值给变量，没有函数提升。

```javascript
const subtract = function(a, b) {
  return a - b;
};

console.log(subtract(5, 3)); // 2
```

### 箭头函数 (ES6+)

箭头函数是 ES6 引入的简洁函数语法，不绑定自己的 `this`。

```javascript
// 基本语法
const multiply = (a, b) => a * b;

// 多行箭头函数
const divide = (a, b) => {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
};

// 单个参数可以省略括号
const square = x => x * x;

// 无参数
const sayHello = () => console.log('Hello!');
```

### 立即执行函数表达式 (IIFE)

IIFE 是定义后立即执行的函数，用于创建独立的作用域。

```javascript
// 传统写法
(function() {
  var privateVariable = 'secret';
  console.log(privateVariable); // 'secret'
})();

// 现代写法（使用箭头函数）
(() => {
  const privateVariable = 'secret';
  console.log(privateVariable); // 'secret'
})();

// 带参数的 IIFE
((name) => {
  console.log(`Hello, ${name}!`); // 'Hello, John!'
})('John');
```

### 函数参数

#### 默认参数 (ES6+)

```javascript
function greet(name = 'World') {
  return `Hello, ${name}!`;
}

console.log(greet()); // 'Hello, World!'
console.log(greet('John')); // 'Hello, John!'
```

#### 剩余参数 (ES6+)

```javascript
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3, 4)); // 10
```

#### 解构参数 (ES6+)

```javascript
function printUser({ name, age, city = 'Unknown' }) {
  console.log(`Name: ${name}, Age: ${age}, City: ${city}`);
}

printUser({ name: 'John', age: 30 }); // 'Name: John, Age: 30, City: Unknown'
```

### 函数返回值

函数可以返回任何类型的值，包括原始类型、对象、数组，甚至是函数。

```javascript
// 返回原始类型
function getNumber() {
  return 42;
}

// 返回对象
function createUser(name) {
  return {
    name,
    createdAt: new Date()
  };
}

// 返回函数
function createMultiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = createMultiplier(2);
console.log(double(5)); // 10
```

### 函数的属性和方法

函数也是对象，具有属性和方法。

```javascript
function greet() {
  console.log('Hello!');
}

// 添加属性
greet.version = '1.0.0';
console.log(greet.version); // '1.0.0'

// 函数方法
const numbers = [1, 2, 3];
const doubled = numbers.map(function(num) {
  return num * 2;
});
console.log(doubled); // [2, 4, 6]
```

### 函数作为一等公民

在 JavaScript 中，函数是一等公民，意味着它们可以：

- 作为参数传递给其他函数
- 作为函数的返回值
- 赋值给变量或存储在数据结构中

```javascript
// 作为参数
function doOperation(a, b, operation) {
  return operation(a, b);
}

const result = doOperation(5, 3, function(a, b) {
  return a + b;
});
console.log(result); // 8

// 作为返回值
function createGreeter(greeting) {
  return function(name) {
    return `${greeting}, ${name}!`;
  };
}

const sayHello = createGreeter('Hello');
console.log(sayHello('John')); // 'Hello, John!'

// 存储在数组中
const operations = [
  function(a, b) { return a + b; },
  function(a, b) { return a - b; },
  function(a, b) { return a * b; }
];

console.log(operations[0](2, 3)); // 5
```

## 作用域 (Scope)

作用域决定了变量和函数的可访问性。

### 词法作用域

词法作用域（也称为静态作用域）是指变量的作用域由其在代码中的位置决定，而不是由运行时的执行上下文决定。

```javascript
function outer() {
  const outerVar = 'outer';
  
  function inner() {
    console.log(outerVar); // 可以访问 outerVar
  }
  
  inner();
}

outer(); // 'outer'
```

### 函数作用域

函数作用域是指变量在函数内部声明，只能在函数内部访问。

```javascript
function myFunction() {
  const functionScoped = 'function scoped';
  console.log(functionScoped); // 可以访问
}

myFunction();
console.log(functionScoped); // 错误：functionScoped is not defined
```

### 块级作用域 (ES6+)

块级作用域是指变量在 `{}` 块内部声明，只能在块内部访问，使用 `let` 和 `const` 声明。

```javascript
if (true) {
  let blockScoped = 'block scoped';
  const anotherBlockScoped = 'another block scoped';
  console.log(blockScoped); // 可以访问
  console.log(anotherBlockScoped); // 可以访问
}

console.log(blockScoped); // 错误：blockScoped is not defined
console.log(anotherBlockScoped); // 错误：anotherBlockScoped is not defined
```

### 全局作用域

全局作用域是指在任何函数或块之外声明的变量，在整个程序中都可以访问。

```javascript
const globalVar = 'global';

function myFunction() {
  console.log(globalVar); // 可以访问全局变量
}

myFunction(); // 'global'
console.log(globalVar); // 'global'
```

### 作用域链

当访问变量时，JavaScript 会沿着作用域链向上查找，直到找到变量或到达全局作用域。

```javascript
const globalVar = 'global';

function outer() {
  const outerVar = 'outer';
  
  function inner() {
    const innerVar = 'inner';
    console.log(innerVar); // 局部变量
    console.log(outerVar); // 来自外部作用域
    console.log(globalVar); // 来自全局作用域
  }
  
  inner();
}

outer();
```

### 变量提升

变量提升是指变量声明会被提升到作用域的顶部，但赋值不会。

```javascript
// var 声明的变量会提升
console.log(hoistedVar); // undefined
var hoistedVar = 'value';

// let 和 const 声明的变量不会提升（存在暂时性死区）
console.log(hoistedLet); // 错误：Cannot access 'hoistedLet' before initialization
let hoistedLet = 'value';

// 函数声明会提升
console.log(hoistedFunction()); // 'Hello'
function hoistedFunction() {
  return 'Hello';
}

// 函数表达式不会提升
console.log(hoistedExpression); // undefined
var hoistedExpression = function() {
  return 'Hello';
};
```

## 闭包 (Closure)

### 闭包的概念

闭包是指函数能够访问其词法作用域之外的变量，即使函数在其原始作用域之外执行。

```javascript
function outer() {
  const outerVar = 'outer';
  
  return function inner() {
    console.log(outerVar);
  };
}

const innerFunction = outer();
innerFunction(); // 'outer' - 即使 outer 函数已执行完毕，inner 仍能访问 outerVar
```

### 闭包的工作原理

当函数被创建时，它会捕获其词法环境，包括所有在其作用域中可访问的变量。当函数在其原始作用域之外执行时，它仍然可以访问这些变量。

```javascript
function createCounter() {
  let count = 0;
  
  return {
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
console.log(counter.getCount()); // 1
```

### 闭包的应用场景

#### 1. 私有变量

```javascript
function createPerson(name) {
  let age = 0;
  
  return {
    getName: function() {
      return name;
    },
    getAge: function() {
      return age;
    },
    setAge: function(newAge) {
      if (newAge > 0) {
        age = newAge;
      }
    }
  };
}

const person = createPerson('John');
console.log(person.getName()); // 'John'
console.log(person.getAge()); // 0
person.setAge(30);
console.log(person.getAge()); // 30
console.log(person.age); // undefined - 私有变量无法直接访问
```

#### 2. 函数工厂

```javascript
function createMultiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

#### 3. 模块化

```javascript
const module = (function() {
  let privateVar = 'secret';
  
  function privateFunction() {
    console.log('Private function');
  }
  
  return {
    publicVar: 'public',
    publicFunction: function() {
      console.log('Public function');
      privateFunction();
      console.log(privateVar);
    }
  };
})();

console.log(module.publicVar); // 'public'
module.publicFunction(); // 'Public function', 'Private function', 'secret'
console.log(module.privateVar); // undefined
module.privateFunction(); // 错误：module.privateFunction is not a function
```

#### 4. 事件处理

```javascript
function setupEventListeners() {
  let count = 0;
  
  document.getElementById('button').addEventListener('click', function() {
    count++;
    console.log(`Button clicked ${count} times`);
  });
}

setupEventListeners();
```

### 闭包与内存泄漏

闭包可能导致内存泄漏，因为它们会保留对外部变量的引用，阻止垃圾回收。

```javascript
// 可能导致内存泄漏的示例
function setupEventListeners() {
  const element = document.getElementById('element');
  
  element.addEventListener('click', function() {
    console.log(element.id); // 闭包引用了 element
  });
  
  // 即使 element 不再使用，闭包仍然引用它
  // 解决方法：使用 WeakRef 或在不需要时移除事件监听器
}

// 更好的做法
function setupEventListeners() {
  const element = document.getElementById('element');
  const handleClick = function() {
    console.log(this.id); // 使用 this 而不是引用 element
  };
  
  element.addEventListener('click', handleClick);
  
  // 当不需要时移除事件监听器
  // element.removeEventListener('click', handleClick);
}
```

## this 关键字

`this` 是一个特殊的关键字，在函数执行时指向调用该函数的对象。

### this 的绑定规则

#### 默认绑定

当函数独立调用时，`this` 指向全局对象（在浏览器中是 `window`，在 Node.js 中是 `global`）。

```javascript
function sayHello() {
  console.log(this); // window (浏览器)
}

sayHello();

// 严格模式下，默认绑定为 undefined
'use strict';
function sayHelloStrict() {
  console.log(this); // undefined
}

sayHelloStrict();
```

#### 隐式绑定

当函数作为对象的方法调用时，`this` 指向该对象。

```javascript
const obj = {
  name: 'John',
  greet: function() {
    console.log(`Hello, ${this.name}!`);
  }
};

obj.greet(); // 'Hello, John!' - this 指向 obj

// 注意：如果方法被赋值给变量，隐式绑定会丢失
const greet = obj.greet;
greet(); // 'Hello, undefined!' - this 指向全局对象
```

#### 显式绑定

使用 `call`、`apply` 或 `bind` 方法显式指定 `this` 的指向。

```javascript
function greet() {
  console.log(`Hello, ${this.name}!`);
}

const obj = { name: 'John' };

// 使用 call
greet.call(obj); // 'Hello, John!'

// 使用 apply
greet.apply(obj); // 'Hello, John!'

// 使用 bind
const boundGreet = greet.bind(obj);
boundGreet(); // 'Hello, John!'
```

#### new 绑定

当使用 `new` 关键字调用函数时，`this` 指向新创建的对象。

```javascript
function Person(name) {
  this.name = name;
  this.greet = function() {
    console.log(`Hello, ${this.name}!`);
  };
}

const person = new Person('John');
person.greet(); // 'Hello, John!' - this 指向 person 对象
```

#### 箭头函数的 this

箭头函数不绑定自己的 `this`，而是继承父作用域的 `this`。

```javascript
const obj = {
  name: 'John',
  greet: function() {
    // 箭头函数继承 greet 方法的 this
    const sayHello = () => {
      console.log(`Hello, ${this.name}!`);
    };
    sayHello();
  }
};

obj.greet(); // 'Hello, John!'

// 对比：普通函数
const obj2 = {
  name: 'John',
  greet: function() {
    // 普通函数有自己的 this（默认绑定）
    const sayHello = function() {
      console.log(`Hello, ${this.name}!`);
    };
    sayHello();
  }
};

obj2.greet(); // 'Hello, undefined!'
```

### this 绑定的优先级

1. **new 绑定** > 2. **显式绑定** > 3. **隐式绑定** > 4. **默认绑定**

### 改变 this 的指向

#### call 方法

```javascript
function introduce(age, city) {
  console.log(`I'm ${this.name}, ${age} years old, from ${city}.`);
}

const person = { name: 'John' };
introduce.call(person, 30, 'New York'); // 'I'm John, 30 years old, from New York.'
```

#### apply 方法

```javascript
function introduce(age, city) {
  console.log(`I'm ${this.name}, ${age} years old, from ${city}.`);
}

const person = { name: 'John' };
introduce.apply(person, [30, 'New York']); // 'I'm John, 30 years old, from New York.'
```

#### bind 方法

```javascript
function introduce(age, city) {
  console.log(`I'm ${this.name}, ${age} years old, from ${city}.`);
}

const person = { name: 'John' };
const boundIntroduce = introduce.bind(person);
boundIntroduce(30, 'New York'); // 'I'm John, 30 years old, from New York.'
```

## 实际应用示例

### 1. 闭包实现计数器

```javascript
function createCounter() {
  let count = 0;
  
  return {
    increment: function() {
      return ++count;
    },
    decrement: function() {
      return --count;
    },
    reset: function() {
      count = 0;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
console.log(counter.reset()); // 0
console.log(counter.getCount()); // 0
```

### 2. this 在事件处理中的应用

```javascript
class ToggleButton {
  constructor(element) {
    this.element = element;
    this.isToggled = false;
    
    // 绑定 this 到实例
    this.toggle = this.toggle.bind(this);
    
    this.element.addEventListener('click', this.toggle);
  }
  
  toggle() {
    this.isToggled = !this.isToggled;
    this.element.textContent = this.isToggled ? 'ON' : 'OFF';
  }
}

// 或者使用箭头函数
class ToggleButton2 {
  constructor(element) {
    this.element = element;
    this.isToggled = false;
    
    // 箭头函数继承父作用域的 this
    this.element.addEventListener('click', () => this.toggle());
  }
  
  toggle() {
    this.isToggled = !this.isToggled;
    this.element.textContent = this.isToggled ? 'ON' : 'OFF';
  }
}

const button = document.getElementById('toggle-button');
new ToggleButton(button);
```

### 3. 模块模式

```javascript
const Calculator = (function() {
  // 私有变量
  let history = [];
  
  // 私有方法
  function addToHistory(operation, result) {
    history.push({ operation, result, timestamp: new Date() });
  }
  
  // 公共 API
  return {
    add: function(a, b) {
      const result = a + b;
      addToHistory(`${a} + ${b}`, result);
      return result;
    },
    subtract: function(a, b) {
      const result = a - b;
      addToHistory(`${a} - ${b}`, result);
      return result;
    },
    multiply: function(a, b) {
      const result = a * b;
      addToHistory(`${a} * ${b}`, result);
      return result;
    },
    divide: function(a, b) {
      if (b === 0) {
        throw new Error('Division by zero');
      }
      const result = a / b;
      addToHistory(`${a} / ${b}`, result);
      return result;
    },
    getHistory: function() {
      return [...history]; // 返回副本，避免外部修改
    },
    clearHistory: function() {
      history = [];
    }
  };
})();

console.log(Calculator.add(1, 2)); // 3
console.log(Calculator.subtract(5, 3)); // 2
console.log(Calculator.getHistory()); // 操作历史
Calculator.clearHistory();
console.log(Calculator.getHistory()); // []
```

## 最佳实践

### 函数最佳实践

1. **使用箭头函数**：对于不需要自己的 `this` 的函数，使用箭头函数简化代码
2. **命名函数表达式**：提高代码可读性和调试体验
3. **避免使用 arguments**：使用剩余参数（`...`）替代
4. **函数参数验证**：在函数开始时验证参数
5. **保持函数简洁**：每个函数只做一件事
6. **使用默认参数**：提高函数的灵活性

### 作用域最佳实践

1. **使用 let 和 const**：优先使用块级作用域变量
2. **最小化变量作用域**：变量应在尽可能小的作用域内声明
3. **避免全局变量**：减少全局变量的使用，防止命名冲突
4. **使用模块化**：将代码组织成模块，减少全局污染

### 闭包最佳实践

1. **合理使用闭包**：只在必要时使用闭包
2. **注意内存泄漏**：避免不必要的闭包引用
3. **使用 WeakRef**：对于可能导致内存泄漏的场景，考虑使用 WeakRef
4. **及时清理**：对于事件监听器等，在不需要时及时移除

### this 最佳实践

1. **理解 this 的绑定规则**：掌握不同场景下 this 的指向
2. **使用箭头函数**：在需要继承父作用域 this 的场景下使用箭头函数
3. **使用 bind**：对于需要固定 this 指向的场景，使用 bind
4. **避免使用 this 在嵌套函数中**：如果嵌套函数需要访问外部 this，使用箭头函数或保存 this 到变量

## 总结

JavaScript 中的函数、作用域、闭包和 this 是核心概念，理解它们对于编写高质量的 JavaScript 代码至关重要：

- **函数**：JavaScript 的基本构建块，可以作为一等公民传递和返回
- **作用域**：决定变量的可访问性，包括词法作用域、函数作用域、块级作用域和全局作用域
- **闭包**：函数能够访问其词法作用域之外的变量，用于创建私有变量、函数工厂和模块化
- **this**：在函数执行时指向调用该函数的对象，有默认绑定、隐式绑定、显式绑定和 new 绑定等规则

掌握这些概念，可以帮助你编写更灵活、更可维护的 JavaScript 代码，避免常见的错误和陷阱。

## 进一步学习资源

- [MDN Web Docs - Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- [MDN Web Docs - Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
- [MDN Web Docs - this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
- [You Don't Know JS: Scope & Closures](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed/scope%20%26%20closures)
- [You Don't Know JS: this & Object Prototypes](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed/this%20%26%20object%20prototypes)
- [JavaScript.info - Functions](https://javascript.info/function-basics)
- [JavaScript.info - Closures](https://javascript.info/closure)
- [JavaScript.info - this](https://javascript.info/object-methods#this-in-methods)
