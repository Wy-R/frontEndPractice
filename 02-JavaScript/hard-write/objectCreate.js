function myObjectCreate(proto, propertiesObject) {
  if ( proto !== null && typeof proto !== 'object') {
     throw new Error('proto must be a Object')
  }

  // 创建一个临时的构造函数
  function F() {}

  // 然后把构造函数的proto指向 proto
  F.prototype = proto

  const newObj = new F()

  // 如果提供了新的 propertiesObject，则为新对象添加属性
  if (propertiesObject !== undefined) {
    // Object.defineProperties可以一次性给实例添加多个属性
    Object.defineProperties(newObj, propertiesObject)
  }

  return newObj
}

// 测试示例
console.log('测试基本功能：');
const person = {
  sayHello() {
    console.log(`Hello, ${this.name}!`);
  }
};

const john = myObjectCreate(person);
john.name = 'John';
john.sayHello(); // 输出: Hello, John!


const jane = myObjectCreate(person, {
  name: {
    value: 'Jane',
    writable: true,
    enumerable: true
  },
  age: {
    value: 30,
    writable: false
  }
});
jane.sayHello(); // 输出: Hello, Jane!
console.log(jane.age); // 输出: 30

console.log('\n测试原型链：');
console.log(Object.getPrototypeOf(john) === person); // 输出: true
console.log(Object.getPrototypeOf(jane) === person); // 输出: true

console.log('\n测试 null 原型：');
const objWithNullProto = myObjectCreate(null);
console.log(Object.getPrototypeOf(objWithNullProto)); // 输出: null
