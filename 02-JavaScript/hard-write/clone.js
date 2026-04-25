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
  
}
