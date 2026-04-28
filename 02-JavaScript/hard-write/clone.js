/**
 * 浅 copy
 * @param {} obj 
 * @returns 
 * 只考虑当前第一层的属性
 * Object.assign({}, obj) 或者是 {...obj} 都属于浅copy
 */
const shallowCopy = function(obj) {
  if (typeof obj !== 'object') return;
  const result = Array.isArray(obj) ? []: {}

  for(let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key]
    }
  }

  return result
}

/**
 * 深拷贝
 * @param {} obj 
 * @returns 
 * 每一层都要照顾到！
 * JSON.parse(JSON.stringify(obj)) 也可以进行深copy
 * 缺点是 Function Date  RegExp 等特殊类型无法实现会报错
 */
const deepCopy = function(obj) {
  if (typeof obj !=='object') return;
  const result = []
  for(let key in obj){
    if (obj.hasOwnProperty(key)) {
      result[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]): obj[key]
    }
  }

  return result
}

const deepClone =function(target, map = new Map()) {
  // 不处理基本类型以及 null
  if(target === null || typeof target !== 'object') return target

  // 处理循环引用：如果已经拷贝过该对象了，直接返回之前的结果
  if(map.has(target)) {
    return map.get(target)
  }

  // 处理 Date 类型
  if(target instanceof Date) {
    return new Date(target.getTime())
  }

  // 处理正则 RegExp 类型
  if(target instanceof RegExp) {
    return new RegExp(target.source, target.flags)
  }

  // 处理数组
  if(Array.isArray(target)) {
    const cloneArr = []
    map.set(target, cloneArr)
    for(let item in target) {
      cloneArr.push(deepClone(item, map))
    }

    return cloneArr
  }

  // 处理对象
  if(typeof target === 'object') {
    const cloneObj = {}
    map.set(target, cloneObj)
    for(let key in target) {
      if(target.hasOwnProperty(key)) {
        cloneObj[key] = deepClone(target[key], map)
      }
    }

    return cloneObj
  }
}


// 测试示例
console.log('测试基本类型：');
console.log(deepClone(123)); // 输出: 123
console.log(deepClone('hello')); // 输出: hello
console.log(deepClone(null)); // 输出: null
console.log(deepClone(undefined)); // 输出: undefined

console.log('\n测试对象和数组：');
const obj = {
  name: 'John',
  age: 30,
  hobbies: ['reading', 'coding'],
  address: {
    city: 'Beijing',
    district: 'Haidian'
  }
};
const clonedObj = deepClone(obj);
console.log(clonedObj); // 输出: 拷贝后的对象
console.log(clonedObj === obj); // 输出: false（引用不同）
console.log(clonedObj.hobbies === obj.hobbies);


console.log('\n测试循环引用：');
const obj1 = { name: 'obj1' };
const obj2 = { name: 'obj2' };
obj1.ref = obj2;
obj2.ref = obj1; // 创建循环引用
const clonedObj1 = deepClone(obj1);
console.log(clonedObj1); // 输出: 拷贝后的对象，不会因循环引用而死循环
console.log(clonedObj1.ref.name); // 输出: obj2
console.log(clonedObj1.ref.ref.name); // 输出: obj1（循环引用正确处理）

console.log('\n测试特殊类型：');
const date = new Date();
const clonedDate = deepClone(date);
console.log(clonedDate); // 输出: 拷贝后的 Date 对象
console.log(clonedDate === date); // 输出: false

const regex = /test/g;
const clonedRegex = deepClone(regex);
console.log(clonedRegex); // 输出: 拷贝后的 RegExp 对象
console.log(clonedRegex === regex); // 输出: false