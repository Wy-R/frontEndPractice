
/**
 * 这是原型链继承。直接将 prototype 指向 parent 然后可以使用parent 上的方法
 * 但是这样直接调整的话会导致 Child 的prototype.constructor 变成 Parent 会导致以下问题：
 *  1. 直接访问 child1.constructor 会输出[Function: Parent] 而不是 Child
 *  2. new child1.constructor('child2') 这样创建出来的新示例会意外调用父类构造函数，导致 child1 instanceof Child 是false
 *  3. 原型链混乱。增加代码维护调试成本。
 *
 */
function Parent() {
  this.name = 'parent'
}

Parent.prototype.sayName = function() {
  return `hello ${this.name}`
}

function Child(name) {
  this.name = name
}

Child.prototype = new Parent()

const child1 = new Child('child1')
console.log('child1 constructor', Child.prototype.constructor, child1 instanceof Child)
console.log('sayName->', child1.sayName())


/**
 * 
 * @param {} name 
 * 借用构造函数继承
 * 解决了原型链上面参数共享问题以及传参问题
 * 但每次创建实例的话 方法都会被创建一遍
 */
function Animal(name) {
  this.name = name
  this.getName = function() {
    return this.name
  }
}

function Dog(name) {
  // 改变this 的指向为 Dog
  Animal.call(this, name)
}

Dog.prototype = new Animal()

const dog1 = new Dog('WangCai')
console.log(dog1.getName())


/**
 * 
 * @param {*} name 
 * 组合继承 = 原型链继承 + 借用构造函数继承
 * 1. 方法写到原型链上面，然后参数写到构造函数内，通过借用构造函数来实现数据不共享
 */
function Animal(name) {
  this.name = name
}

Animal.prototype.getName = function() {
  return this.name
}

function Dog (name, age) {
  console.log('this---->', this)
  this.age = age
  Animal.call(this, name)
}

Dog.prototype = new Animal()
// 把 constructor 指回来
Dog.prototype.constructor = Dog

const dog2 = new Dog('CaiCai', 2)

console.log('--->', dog2.getName())

/**
 * class 继承: extends
 * 没有显式声明 constructor 的话会自动默认生成一个构造函数 
 * 该函数会自动调用父类的constructor 然后吧接收到的参数都传递给父类
 * 显式声明的话必须在构造函数中调用 super() 确保父类初始化逻辑被执行
 * super() 是class 继承的核心关键字。用于建立 this 绑定在子类中this 的创建依赖于父类构造函数的执行
 * super() 简化了 Parent.call(this, ...args) 这个过程
 */
class Parent{
  constructor(name){
    this.name = name
  }

  getName() {
    return this.name
  }
}

class Child extends Parent {
  // 2020 开始可以在这里直接声明字段
  age = 0;
  // 静态字段外面无法访问到
  static species = 'Homo sapiens'
  // 私有字段。外部访问报错仅限内部方法读取
  #privateId = 'secretIdNumber'

  getSecret() {
    return this.#privateId
  }

  constructor(name, age) {
    super(name) // 调用父类构造函数，初始化name
    this.age = age
  }
}

const cat = new Child('Mimi', 2)
console.log('getName', cat.getName())