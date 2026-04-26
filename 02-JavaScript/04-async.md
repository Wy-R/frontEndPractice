# 异步编程核心基础知识

## 一、Promise

### 1. 什么是 Promise？

- **Promise** 是 JavaScript 中用于处理异步操作的对象
- 它表示一个可能在未来完成或失败的操作，并返回其结果
- Promise 有三种状态：`pending`（进行中）、`fulfilled`（已成功）、`rejected`（已失败）
- 状态一旦改变，就不会再变（状态凝固）

### 2. Promise 的基本用法

```javascript
// 创建 Promise
const promise = new Promise((resolve, reject) => {
  // 异步操作
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve('操作成功'); // 成功时调用 resolve
    } else {
      reject('操作失败'); // 失败时调用 reject
    }
  }, 1000);
});

// 处理 Promise
promise
  .then(value => {
    console.log('成功:', value);
  })
  .catch(error => {
    console.log('失败:', error);
  })
  .finally(() => {
    console.log('无论成功失败都会执行');
  });
```

### 3. Promise 的方法

#### `Promise.resolve(value)`

- 返回一个已解决的 Promise
- 如果 value 是 Promise，直接返回该 Promise
- 如果 value 有 then 方法，会立即执行该方法

```javascript
const promise = Promise.resolve('成功');
promise.then(value => console.log(value)); // 输出: 成功
```

#### `Promise.reject(reason)`

- 返回一个已拒绝的 Promise
- reason 是拒绝的原因

```javascript
const promise = Promise.reject('失败');
promise.catch(error => console.log(error)); // 输出: 失败
```

#### `Promise.all(iterable)`

- 接收一个可迭代对象（如数组），包含多个 Promise
- 当所有 Promise 都解决时，返回一个包含所有结果的数组
- 当任何一个 Promise 拒绝时，立即拒绝并返回该错误

```javascript
const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(2);
const promise3 = Promise.resolve(3);

Promise.all([promise1, promise2, promise3])
  .then(values => console.log(values)) // 输出: [1, 2, 3]
  .catch(error => console.log(error));
```

#### `Promise.race(iterable)`

- 接收一个可迭代对象，包含多个 Promise
- 当任何一个 Promise 解决或拒绝时，立即返回该结果

```javascript
const promise1 = new Promise(resolve => setTimeout(() => resolve('第一个'), 1000));
const promise2 = new Promise(resolve => setTimeout(() => resolve('第二个'), 500));

Promise.race([promise1, promise2])
  .then(value => console.log(value)); // 输出: 第二个
```

#### `Promise.allSettled(iterable)`

- 接收一个可迭代对象，包含多个 Promise
- 当所有 Promise 都完成（无论成功或失败）时，返回一个包含所有结果的数组
- 每个结果对象包含 `status`（'fulfilled' 或 'rejected'）和对应的 `value` 或 `reason`

```javascript
const promise1 = Promise.resolve(1);
const promise2 = Promise.reject('错误');

Promise.allSettled([promise1, promise2])
  .then(results => console.log(results));
// 输出: [{status: 'fulfilled', value: 1}, {status: 'rejected', reason: '错误'}]
```

#### `Promise.any(iterable)`

- 接收一个可迭代对象，包含多个 Promise
- 当任何一个 Promise 解决时，立即返回该结果
- 当所有 Promise 都拒绝时，返回一个 AggregateError

```javascript
const promise1 = Promise.reject('错误1');
const promise2 = Promise.resolve('成功');
const promise3 = Promise.reject('错误2');

Promise.any([promise1, promise2, promise3])
  .then(value => console.log(value)) // 输出: 成功
  .catch(error => console.log(error));
```

### 4. Promise 链式调用

- Promise 的 then 方法返回一个新的 Promise，因此可以链式调用
- 可以在 then 中返回值或另一个 Promise
- 错误会沿着链传递，直到被 catch 捕获

```javascript
new Promise(resolve => resolve(1))
  .then(value => value * 2)
  .then(value => value + 3)
  .then(value => console.log(value)) // 输出: 5
  .catch(error => console.log(error));
```

### 5. Promise 实现原理

- Promise 是一个类，包含状态、值、回调队列等属性
- 当状态改变时，会执行相应的回调函数
- then 方法会返回一个新的 Promise，实现链式调用

```javascript
class MyPromise {
  constructor(executor) {
    this.status = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = value => {
      if (this.status === 'pending') {
        this.status = 'fulfilled';
        this.value = value;
        this.onResolvedCallbacks.forEach(callback => callback(value));
      }
    };

    const reject = reason => {
      if (this.status === 'pending') {
        this.status = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(callback => callback(reason));
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onResolved, onRejected) {
    onResolved = typeof onResolved === 'function' ? onResolved : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };

    const promise2 = new MyPromise((resolve, reject) => {
      if (this.status === 'fulfilled') {
        setTimeout(() => {
          try {
            const x = onResolved(this.value);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }

      if (this.status === 'rejected') {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }

      if (this.status === 'pending') {
        this.onResolvedCallbacks.push(value => {
          setTimeout(() => {
            try {
              const x = onResolved(value);
              this.resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });

        this.onRejectedCallbacks.push(reason => {
          setTimeout(() => {
            try {
              const x = onRejected(reason);
              this.resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
    });

    return promise2;
  }

  resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
      return reject(new TypeError('Chaining cycle detected for promise'));
    }

    if (x instanceof MyPromise) {
      x.then(
        value => this.resolvePromise(promise2, value, resolve, reject),
        reason => reject(reason)
      );
    } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
      let called = false;
      try {
        const then = x.then;
        if (typeof then === 'function') {
          then.call(
            x,
            value => {
              if (called) return;
              called = true;
              this.resolvePromise(promise2, value, resolve, reject);
            },
            reason => {
              if (called) return;
              called = true;
              reject(reason);
            }
          );
        } else {
          if (called) return;
          called = true;
          resolve(x);
        }
      } catch (error) {
        if (called) return;
        called = true;
        reject(error);
      }
    } else {
      resolve(x);
    }
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  finally(callback) {
    return this.then(
      value => MyPromise.resolve(callback()).then(() => value),
      reason => MyPromise.resolve(callback()).then(() => { throw reason })
    );
  }
}
```

## 二、async/await

### 1. 什么是 async/await？

- **async/await** 是 ES2017 引入的语法糖，基于 Promise 构建
- 使异步代码看起来更像同步代码，提高可读性和可维护性
- `async` 关键字用于声明一个函数为异步函数
- `await` 关键字用于等待一个 Promise 解决或拒绝

### 2. 基本用法

```javascript
// 异步函数
async function getData() {
  try {
    // 等待 Promise 解决
    const result = await new Promise(resolve => {
      setTimeout(() => resolve('数据'), 1000);
    });
    console.log(result); // 输出: 数据
    return result;
  } catch (error) {
    // 捕获错误
    console.log('错误:', error);
  }
}

// 调用异步函数
getData().then(value => console.log('返回值:', value));
```

### 3. async 函数的特点

- **返回值**：async 函数总是返回一个 Promise
  - 如果函数返回一个值，Promise 会以该值解决
  - 如果函数抛出错误，Promise 会以该错误拒绝
- **await 表达式**：只能在 async 函数中使用
  - 等待 Promise 解决或拒绝
  - 暂停函数执行，直到 Promise 完成
  - 如果 Promise 解决，返回解决值
  - 如果 Promise 拒绝，抛出拒绝原因（需要用 try/catch 捕获）

### 4. 并发执行

- 使用 `Promise.all` 结合 async/await 实现并发执行
- 避免使用多个 await 导致的串行执行

```javascript
async function fetchData() {
  // 并发执行多个异步操作
  const [data1, data2, data3] = await Promise.all([
    fetch('api1').then(res => res.json()),
    fetch('api2').then(res => res.json()),
    fetch('api3').then(res => res.json())
  ]);
  
  console.log(data1, data2, data3);
}
```

### 5. 错误处理

- 使用 try/catch 捕获 await 表达式的错误
- 可以捕获异步操作中的错误，与同步代码的错误处理方式一致

```javascript
async function fetchData() {
  try {
    const response = await fetch('api');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log('错误:', error);
  }
}
```

### 6. async/await 的实现原理

- async/await 是基于 Promise 和 Generator 函数实现的语法糖
- async 函数返回一个 Promise
- await 表达式会暂停函数执行，直到 Promise 完成
- 底层使用 Generator 函数的 yield 机制和 Promise 的 then 方法

```javascript
// 简化的 async/await 实现原理
function asyncToGenerator(generatorFunc) {
  return function() {
    const generator = generatorFunc.apply(this, arguments);
    
    return new Promise((resolve, reject) => {
      function step(key, arg) {
        let generatorResult;
        try {
          generatorResult = generator[key](arg);
        } catch (error) {
          return reject(error);
        }
        
        const { value, done } = generatorResult;
        
        if (done) {
          return resolve(value);
        } else {
          return Promise.resolve(value).then(
            val => step('next', val),
            err => step('throw', err)
          );
        }
      }
      
      step('next');
    });
  };
}
```

## 三、EventLoop

### 1. 什么是 EventLoop？

- **EventLoop** 是 JavaScript 处理异步操作的机制
- 负责协调事件、用户交互、脚本执行、渲染等
- 确保 JavaScript 单线程执行的同时，能够处理异步操作

### 2. 执行栈与任务队列

- **执行栈**：存储正在执行的函数调用，遵循后进先出（LIFO）原则
- **任务队列**：存储待执行的异步任务，遵循先进先出（FIFO）原则
  - **宏任务（Macro Task）**：包括 script、setTimeout、setInterval、setImmediate、I/O 操作、UI 渲染等
  - **微任务（Micro Task）**：包括 Promise、process.nextTick、MutationObserver 等

### 3. EventLoop 的执行流程

1. 执行同步代码，将函数压入执行栈
2. 遇到异步操作，将回调函数放入相应的任务队列
3. 执行栈为空时，检查微任务队列
4. 执行所有微任务
5. 检查宏任务队列，取出一个宏任务执行
6. 重复步骤 3-5

### 4. 示例代码

```javascript
console.log('1'); // 同步代码

setTimeout(() => {
  console.log('2'); // 宏任务
}, 0);

Promise.resolve().then(() => {
  console.log('3'); // 微任务
});

console.log('4'); // 同步代码

// 输出顺序: 1 -> 4 -> 3 -> 2
```

### 5. 微任务与宏任务的区别

- **微任务**：优先级高于宏任务，在每个宏任务执行后立即执行
- **宏任务**：优先级低于微任务，需要等待所有微任务执行完毕后才执行
- **执行时机**：
  - 微任务：在当前宏任务执行完毕后，下一个宏任务开始前执行
  - 宏任务：在所有微任务执行完毕后执行

### 6. 常见的微任务和宏任务

- **微任务**：
  - Promise.then()、Promise.catch()、Promise.finally()
  - process.nextTick()（Node.js）
  - MutationObserver
- **宏任务**：
  - setTimeout
  - setInterval
  - setImmediate（Node.js）
  - I/O 操作
  - UI 渲染
  - script（整体代码）

### 7. EventLoop 在浏览器和 Node.js 中的差异

- **浏览器**：
  - 微任务：Promise、MutationObserver
  - 宏任务：setTimeout、setInterval、I/O、UI 渲染
- **Node.js**：
  - 微任务：process.nextTick、Promise
  - 宏任务：setTimeout、setInterval、setImmediate、I/O
  - Node.js 的 EventLoop 有多个阶段，包括 timers、I/O callbacks、idle/prepare、poll、check、close callbacks

### 8. 复杂示例

```javascript
console.log('1'); // 同步代码

setTimeout(() => {
  console.log('2'); // 宏任务
  Promise.resolve().then(() => {
    console.log('3'); // 微任务
  });
}, 0);

Promise.resolve().then(() => {
  console.log('4'); // 微任务
  setTimeout(() => {
    console.log('5'); // 宏任务
  }, 0);
});

console.log('6'); // 同步代码

// 输出顺序: 1 -> 6 -> 4 -> 2 -> 3 -> 5
```

## 四、异步编程最佳实践

### 1. 使用 Promise 替代回调函数

- 避免回调地狱（Callback Hell）
- 提高代码可读性和可维护性
- 支持链式调用和错误处理

### 2. 使用 async/await 简化异步代码

- 使异步代码看起来更像同步代码
- 简化错误处理（使用 try/catch）
- 提高代码可读性

### 3. 合理使用并发

- 使用 `Promise.all` 并发执行多个异步操作
- 避免不必要的串行执行，提高性能

### 4. 错误处理

- 始终处理 Promise 的拒绝状态
- 使用 try/catch 捕获 async/await 中的错误
- 合理使用 Promise 的 catch 方法

### 5. 避免阻塞主线程

- 对于耗时操作，考虑使用 Web Worker 或其他方式
- 避免在主线程中执行大量计算

### 6. 理解 EventLoop

- 了解微任务和宏任务的执行顺序
- 避免在微任务中执行耗时操作
- 合理安排异步任务的执行顺序

### 7. 使用工具库

- 考虑使用 async.js、bluebird 等工具库
- 对于复杂的异步流程，使用 async/await 或 Generator 函数

### 8. 性能优化

- 减少不必要的 Promise 创建
- 合理使用缓存
- 避免在循环中创建 Promise

## 五、总结

### 1. Promise

- 用于处理异步操作的对象，有 pending、fulfilled、rejected 三种状态
- 提供了 then、catch、finally 等方法，支持链式调用
- 提供了 Promise.all、Promise.race 等静态方法，用于处理多个 Promise

### 2. async/await

- 基于 Promise 的语法糖，使异步代码更像同步代码
- async 函数返回一个 Promise
- await 关键字用于等待 Promise 解决或拒绝
- 支持 try/catch 错误处理

### 3. EventLoop

- JavaScript 处理异步操作的机制
- 包括执行栈、微任务队列和宏任务队列
- 执行顺序：同步代码 → 微任务 → 宏任务
- 浏览器和 Node.js 中的实现有所不同

### 4. 最佳实践

- 使用 Promise 替代回调函数
- 使用 async/await 简化异步代码
- 合理使用并发
- 重视错误处理
- 理解 EventLoop 的工作原理

通过掌握这些异步编程的核心知识，可以编写更高效、更可维护的 JavaScript 代码，特别是在处理网络请求、文件操作等异步场景时。
