# 闭包、作用域链、this 绑定 深入学习

这三个概念是 JavaScript 的基础，也是面试重点。

---

## 1. 作用域链（Scope Chain）

### 作用域基础概念

JavaScript 有三种作用域：

1. 全局作用域 (Global Scope)
2. 函数作用域 (Function Scope)
3. 块级作用域 (Block Scope) - ES6 let/const

```js
// 全局作用域
const globalVar = 'I am global';

function outerFunction() {
  // 函数作用域
  const outerVar = 'I am outer';

  function innerFunction() {
    // 函数作用域（嵌套）
    const innerVar = 'I am inner';

    console.log('在 innerFunction 中访问：');
    console.log('  innerVar:', innerVar);    // 自己的作用域
    console.log('  outerVar:', outerVar);    // 外层作用域
    console.log('  globalVar:', globalVar);  // 全局作用域

    /**
     * 作用域链查找顺序：
     * innerFunction 作用域
     *   → outerFunction 作用域
     *     → 全局作用域
     *       → undefined (找不到)
     */
  }

  innerFunction();
}

outerFunction();
```

### 作用域链的查找过程

```js
const x = 'global x';

function level1() {
  const x = 'level1 x';
  console.log('level1:', x); // level1 x

  function level2() {
    const x = 'level2 x';
    console.log('level2:', x); // level2 x

    function level3() {
      console.log('level3 访问 x:', x); // level2 x（最近的 x）
      // 如果 level2 没定义 x，则找 level1 的
      // 如果都没有，才找全局的
    }

    level3();
  }

  level2();
}

level1();
```

### 块级作用域（let/const）

```js
function blockScope() {
  var varVariable = 'var';   // 函数作用域
  let letVariable = 'let';   // 块级作用域
  const constVariable = 'const'; // 块级作用域

  console.log('在函数顶层：');
  console.log('  varVariable:', varVariable);
  console.log('  letVariable:', letVariable);

  if (true) {
    var varInBlock = 'var in block';     // 仍在函数作用域
    let letInBlock = 'let in block';     // 块级作用域
    const constInBlock = 'const in block'; // 块级作用域

    console.log('\n在 if 块内：');
    console.log('  varInBlock:', varInBlock);
    console.log('  letInBlock:', letInBlock);
  }

  console.log('\n在 if 块外：');
  console.log('  varInBlock:', varInBlock);    // 可以访问！
  try {
    console.log('  letInBlock:', letInBlock); // ReferenceError
  } catch (e) {
    console.log('  letInBlock: ❌ ReferenceError -', e.message);
  }
}

blockScope();
```

### 作用域遮蔽（Shadowing）

```js
const outer = 'outer';

function shadowingDemo() {
  const outer = 'function outer'; // 遮蔽外层的 outer
  console.log('函数内 outer:', outer); // 'function outer'

  if (true) {
    const outer = 'block outer'; // 再次遮蔽
    console.log('块内 outer:', outer); // 'block outer'
  }

  console.log('块外 outer:', outer); // 'function outer'
}

shadowingDemo();
console.log('全局 outer:', outer); // 'outer'
```

---

## 2. 闭包（Closure）

### 闭包基础概念

闭包 = 函数 + 这个函数可以访问的外部变量

闭包特点：
1. 返回的函数可以访问外层变量
2. 外层变量不会被垃圾回收
3. 多个闭包可以共享同一个外层变量

```js
function createGreeter(greeting) {
  // greeting 是外层变量，会被闭包保存

  return function(name) {
    // 这个函数形成了闭包，可以访问 greeting
    console.log(greeting + ', ' + name);
  };
}

const sayHello = createGreeter('Hello');
const sayHi = createGreeter('Hi');

sayHello('Alice'); // Hello, Alice
sayHi('Bob');      // Hi, Bob
```

> 重点：sayHello 和 sayHi 都访问了外层的 greeting，但它们的 greeting 值不同，这就是闭包的强大之处。

### 闭包应用：计数器

```js
function createCounter() {
  let count = 0; // 私有变量，外部无法直接访问

  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    }
  };
}

const counter = createCounter();

console.log('increment:', counter.increment()); // 1
console.log('increment:', counter.increment()); // 2
console.log('decrement:', counter.decrement()); // 1
console.log('getCount:', counter.getCount());   // 1

// 无法直接访问 count
console.log('counter.count:', counter.count); // undefined
```

### 闭包应用：函数工厂

```js
// 类似 React 中的 Hook 工厂
function makeAdder(x) {
  return function(y) {
    return x + y; // 闭包访问 x
  };
}

const add5 = makeAdder(5);
const add10 = makeAdder(10);

console.log('add5(3):', add5(3));   // 8
console.log('add10(3):', add10(3)); // 13
```

### 闭包陷阱：循环中的闭包

```js
// ❌ 问题示例（使用 var）：
var funcs = [];
for (var i = 0; i < 3; i++) {
  funcs.push(function() {
    return i; // 闭包保存的是 i 的引用
  });
}

console.log('funcs[0]():', funcs[0]()); // 3（不是 0！）
console.log('funcs[1]():', funcs[1]()); // 3
console.log('funcs[2]():', funcs[2]()); // 3
```

> 为什么都是 3？因为 `var i` 是函数作用域，循环结束后 `i = 3`，所有闭包都引用同一个 `i`。

**解决方案 1：使用 IIFE（立即执行函数）**

```js
var funcs2 = [];
for (var i = 0; i < 3; i++) {
  funcs2.push(
    (function(j) { // IIFE 创建新作用域，j 捕获当前 i 值
      return function() {
        return j;
      };
    })(i)
  );
}

console.log('funcs2[0]():', funcs2[0]()); // 0
console.log('funcs2[1]():', funcs2[1]()); // 1
console.log('funcs2[2]():', funcs2[2]()); // 2
```

**解决方案 2：使用 let（推荐）**

```js
var funcs3 = [];
for (let i = 0; i < 3; i++) { // let 创建块级作用域
  funcs3.push(function() {
    return i;
  });
}

console.log('funcs3[0]():', funcs3[0]()); // 0
console.log('funcs3[1]():', funcs3[1]()); // 1
console.log('funcs3[2]():', funcs3[2]()); // 2
```

### 闭包应用：模块模式

```js
const userModule = (function() {
  // 私有变量
  const users = [];

  // 私有函数
  function findUser(id) {
    return users.find(u => u.id === id);
  }

  // 公开 API
  return {
    addUser(id, name) {
      users.push({ id, name });
      console.log(`用户 ${name} 已添加`);
    },

    getUser(id) {
      return findUser(id);
    },

    getAllUsers() {
      return [...users]; // 返回副本，防止外部修改
    }
  };
})();

userModule.addUser(1, 'Alice');
userModule.addUser(2, 'Bob');

console.log('获取用户 1:', userModule.getUser(1));
console.log('所有用户:', userModule.getAllUsers());

// 无法访问私有变量 users
console.log('userModule.users:', userModule.users); // undefined
```

### 闭包应用：React Hook（简化版）

React Hook 的原理也是基于闭包，每次渲染时，Hook 都会捕获当前的 state。

```js
let componentState = null;

function useState(initialValue) {
  const state = componentState ?? initialValue;

  const setState = (newValue) => {
    componentState = typeof newValue === 'function'
      ? newValue(componentState)
      : newValue;
    console.log('状态更新为:', componentState);
  };

  return [state, setState];
}

// 使用
const [count, setCount] = useState(0);
console.log('初始 count:', count);

setCount(count + 1); // 状态更新为: 1
setCount(prev => prev + 1); // 状态更新为: 2
```

### 闭包内存影响

闭包会保持对外层变量的引用，这可能导致内存无法释放。

```js
function createBigArray() {
  const bigArray = new Array(1000000).fill('data'); // 大数组

  return function() {
    return bigArray.length; // 闭包保持对 bigArray 的引用
  };
}

const getBigArrayLength = createBigArray();
console.log('大数组长度:', getBigArrayLength()); // 1000000
```

> 即使我们不再需要 bigArray，由于闭包的引用，它也不会被垃圾回收。这是常见的内存泄漏来源。

---

## 3. this 绑定

### this 的五种绑定方式

this 绑定优先级（从高到低）：
1. new 绑定
2. 显式绑定（call, apply, bind）
3. 隐式绑定
4. 默认绑定
5. 箭头函数（继承外层 this）

#### 1️⃣ 默认绑定

```js
function sayThis() {
  console.log('  this:', this);
}

sayThis(); // 全局对象（浏览器中是 window，Node 中是 global）

// 严格模式下 this 是 undefined
function sayThisStrict() {
  'use strict';
  console.log('  this:', this);
}

sayThisStrict(); // undefined
```

#### 2️⃣ 隐式绑定（由调用对象决定）

```js
const obj = {
  name: 'Object',
  greet() {
    console.log('  this.name:', this.name);
  }
};

obj.greet(); // this = obj，输出 'Object'

const greetFunc = obj.greet;
greetFunc(); // this = 全局对象（丢失了 this）
```

#### 3️⃣ 显式绑定 - call

```js
function introduce(greeting) {
  console.log(`  ${greeting}, I'm ${this.name}`);
}

const person1 = { name: 'Alice' };
const person2 = { name: 'Bob' };

introduce.call(person1, 'Hello');  // Hello, I'm Alice
introduce.call(person2, 'Hi');     // Hi, I'm Bob
```

#### 4️⃣ 显式绑定 - apply

```js
const numbers = [5, 6, 2, 3, 7];
const max = Math.max.apply(null, numbers);
console.log('  数组最大值:', max); // 7

function sum(a, b, c) {
  return a + b + c;
}

const result = sum.apply(person1, [1, 2, 3]);
console.log('  sum 结果:', result); // 6
```

#### 5️⃣ 显式绑定 - bind

```js
const boundIntroduce = introduce.bind(person1, 'Hey');
boundIntroduce();           // Hey, I'm Alice
boundIntroduce();           // Hey, I'm Alice（多次调用结果相同）

// bind 在 React 中的应用
class Button {
  constructor(label) {
    this.label = label;
    this.clicked = 0;

    // 方式 1：在构造函数中 bind
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.clicked++;
    console.log(`  按钮 "${this.label}" 被点击了 ${this.clicked} 次`);
  }
}

const button = new Button('Submit');
button.handleClick(); // 按钮 "Submit" 被点击了 1 次
button.handleClick(); // 按钮 "Submit" 被点击了 2 次
```

#### 6️⃣ new 绑定（构造函数）

```js
function User(name, age) {
  this.name = name;
  this.age = age;
  console.log(`  创建用户: ${name}, 年龄: ${age}`);
}

const user1 = new User('Charlie', 25);
const user2 = new User('Diana', 30);

console.log('  user1.name:', user1.name);
console.log('  user2.name:', user2.name);
```

> new 的过程：1. 创建新对象 → 2. 将构造函数的 this 绑定到新对象 → 3. 执行构造函数代码 → 4. 返回新对象

#### 7️⃣ 箭头函数（继承外层 this）

```js
const arrowObj = {
  name: 'Arrow Object',

  regular() {
    console.log('  regular this.name:', this.name); // 'Arrow Object'

    const arrow = () => {
      console.log('  arrow this.name:', this.name);   // 'Arrow Object'（继承）
    };

    arrow();
  },

  arrowMethod: function() {
    const arrow = () => {
      console.log('  箭头函数的 this:', this.name); // 'Arrow Object'
    };
    arrow();
  }
};

arrowObj.regular();
arrowObj.arrowMethod();
```

> 箭头函数的 this：不是由调用方式决定，而是由定义时的外层 this 决定，无法通过 call/apply/bind 改变。

### this 绑定优先级演示

```js
function priority() {
  console.log('  this:', this);
}

const binding = {
  name: 'binding object'
};

// 隐式绑定 vs 显式绑定（显式优先）
const boundPriority = priority.bind(binding);
const implicitObj = {
  priority: boundPriority
};

implicitObj.priority(); // this = binding（显式 > 隐式）

// new vs bind
class MyClass {
  constructor() {
    this.name = 'new object';
    console.log('  this:', this);
  }
}

const boundClass = MyClass.bind({ name: 'bound object' });
new boundClass(); // this = 新对象（new > bind）
```

---

## 4. React Fiber 中的应用

在 React 代码中：

```jsx
onClick={() => setQuery(q => q + 1)}
```

为什么使用箭头函数？因为箭头函数可以正确保存 this（React 组件实例）。

```jsx
class ReactComponent {
  constructor() {
    this.state = { query: 0 };

    // 方式 1：在构造函数中 bind（类组件）
    this.handleClickBound = this.handleClickBound.bind(this);
  }

  handleClickBound() {
    this.setState({ query: this.state.query + 1 });
  }

  // 方式 2：使用箭头函数（类字段）
  handleClickArrow = () => {
    this.setState({ query: this.state.query + 1 });
  }

  // 方式 3：使用箭头函数（事件处理器）
  render() {
    return (
      <div>
        {/* 箭头函数保存正确的 this */}
        <button onClick={() => this.handleClickArrow()}>
          Click
        </button>
      </div>
    );
  }
}
```

React 中的最佳实践：
1. 使用箭头函数属性（类字段）
2. 在 render 中使用箭头函数回调
3. 或在构造函数中 bind 方法

### useMemo 中的闭包

```js
// 你的代码中：
// const filtered = useMemo(() => expensiveFilter(base, query), [base, query]);
//
// useMemo 返回的函数形成了闭包
// 闭包访问 base 和 query
// 当依赖变化时，会重新计算

function useMemoDEMO(computeFn, deps) {
  let lastDeps = null;
  let lastResult = null;

  return function() {
    // 检查依赖是否变化
    const depsChanged = !lastDeps || !deps.every((dep, i) => dep === lastDeps[i]);

    if (depsChanged) {
      // 重新计算（闭包访问 computeFn）
      lastResult = computeFn();
      lastDeps = deps;
      console.log('[useMemo] 重新计算');
    } else {
      console.log('[useMemo] 使用缓存');
    }

    return lastResult;
  };
}

let count = 0;
const getMemoValue = useMemoDEMO(
  () => {
    count++;
    return count;
  },
  [count]
);

console.log('第一次:', getMemoValue()); // [useMemo] 重新计算 → 1
console.log('第二次:', getMemoValue()); // [useMemo] 使用缓存 → 1
count = 1;
console.log('第三次:', getMemoValue()); // [useMemo] 重新计算 → 2
```
