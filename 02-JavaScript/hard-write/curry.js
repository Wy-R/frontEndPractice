/**
 * 函数柯里化
 * 1. 将一个接受多个参数的函数转化为一个一系列接受单个参数的函数。每次调用只传入一个参数
 * 2. 每次返回一个新的函数，直到所有的参数都收集完毕，然后开始执行原有的方法
 * 优点：
 *  1.支持多种传参方式 分布 一步到位等都支持。
 */
/**
 * 函数柯里化
 * @param {Function} func - 要柯里化的函数
 * @returns {Function} - 柯里化后的函数
 */
function curry(func){
  return function curried(...args) {
    // 如果传入的参数数量 >= 原来函数的参数数量，则直接执行这个函数
    if(args.length === func.length) {
      return func.apply(this, args)
    }

    // 递归叠加参数直到参数够用了。
    return function(...nextArgs) {
      return curried.apply(this, [...args, ...nextArgs])
    }
  }
}

function add(a, b, c) {
  return a+ b + c
}

const curriedAdd = curry(add)

// 使用方式1：分步传参
console.log(curriedAdd(1)(2)(3)); // 输出: 6

// 使用方式2：部分传参
console.log(curriedAdd(1, 2)(3)); // 输出: 6

// 使用方式3：一次性传参
console.log(curriedAdd(1, 2, 3)); // 输出: 6



/**-------------------------拓展一下 - 偏函数-------------------------------**/
// 偏函数也是一种函数转换技术。先预定一部分的参数，生成一个新的函数
// 偏函数可以一次性固定多个参数。
// 下一步的话就是接收所有的参数执行了
// 用于固化相同的参数，减少参数传递

/**
 * 偏函数
 * @param {Function} func - 要转换的函数
 * @param {...any} fixedArgs - 要固定的参数
 * @returns {Function} - 偏函数
 */
function partialFunction(fuc, ...args) {
  return function(...nextArgs) {
    return func.apply(this, [...args, ...nextArgs])
  }
}

// 示例：加法函数
function add(a, b, c) {
  return a + b + c;
}

// 创建偏函数，固定前两个参数
const add5And6 = partial(add, 5, 6);

// 调用偏函数，只需传入剩余参数
console.log(add5And6(7)); // 输出: 18（5+6+7）


// 另一种用法：固定部分参数
const add10 = partial(add, 10);
console.log(add10(2, 3)); // 输出: 15（10+2+3）