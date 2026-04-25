const myNew = function(constructor, ...args) {
  // 创建一个新对象
  let newObj = {}
  //将新对象的原型指向构造函数的 prototype
  Object.setPrototypeOf(newObj, constructor.prototype)
  // 将构造函数的this 指向新对象，并执行构造函数
  const result = constructor.apply(newObj, args)
  return typeof result ==='object' && result !== null ? result : newObj
}

function Person(name, age) {
  this.name = name
  this.age = age

  this.sayHello = function() {
    console.log(`Hello I am ${this.name}, ${this.age}years old`)
  }
}

const john = myNew(Person, 'John', 30)
console.log('john name', john.name)