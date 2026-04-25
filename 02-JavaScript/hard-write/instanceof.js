
/**
 * instanceof 实现
 * 它是 javascript 中用于检查对象类型的操作符。
 * 1. 核心作用是判断一个对象是否是某个构造函数的实例。更准确的说：检查对象的原型链是否包含某个构造函数的 prototype 属性
 * 2. 使用：object instanceof constructor(Object  Array Function)
 * 3. 原理
 *    1. 获取构造函数的原型： constructor.prototype
 *    2. 遍历对象的原型链。从 Object.getPrototypeOf(object) 开始往上遍历直到为null
 *    3. 如果匹配到了，则返回true
 * @param {*} right 
 * @param {*} left 
 * @returns 
 */
export const myInstanceOf = (right, left) => {
  // 如果 left 不是function 的话，则直接返回
  if(typeof right !== 'function') {
    throw new Error('right should be a function')
  }

  if (typeof left === null || (typeof left !== 'object' && typeof left !=='function')) {
    return false
  }

  const rightProto = right.prototype

  let leftProto = Object.getPrototypeOf(left)

  while(leftProto !== null) {
    if (leftProto === rightProto) {
      return true
    }
    leftProto = Object.getPrototypeOf(leftProto)
  }

  // 到达了原型链的最外层，未匹配到返回false
  return false
}

// 测试示例
function Person() {}
function Animal() {}

const person = new Person();
const animal = new Animal();

// 测试基本功能
console.log(myInstanceof(person, Person)); // 输出: true
console.log(myInstanceof(animal, Animal)); // 输出: true
console.log(myInstanceof(person, Object)); // 输出: true（因为所有对象都是 Object 的实例）