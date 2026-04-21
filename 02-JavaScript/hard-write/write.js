// 判断数据类型的
function myTypeof(value) {
  const result = Object.prototype.toString.call(value)  // ['object  string']
  console.log('Result->', result)
  const res = result.split(' ')[1]
  return res.substring(0, res.length -1).toLowerCase()  // 把最后一个 ] 符号去掉然后转成小写
}

console.log(myTypeof(['name', 'age']))

// 判断一个元素是不是数组
function myIsArray(obj) {
  return Object.prototype.toString.call(obj) === "[object Array]"
}

// 数组去重
var arr = [1,2,3,4,5,5,5,6]
function uniqueArr (arr) {
  const res = arr.filter((item, index) => {
    return arr.indexOf(item) === index
  })
  return res
}
console.log('uniqueArr', uniqueArr(arr))

// 数组去重2 
const uniqueArr2 = function(arr) {
  return [...new Set(arr)]
}


// 数组扁平化
const arr = [[1], [2, 3], [4, 5, [ 6, 7 ]]]
const flatArr1 = (arr) => {
  return arr.flat(3)
}

console.log('flat 1>', flatArr1(arr))

/**
 * 手写数组扁平化
 * 1.for 循环判断每一项是不是数组，是的话，就继续递归调用flat 函数一层层拆
 * 好处就是会自己判断层数的，不会要写拆几层
 */
const arr2 = [[1], [2, 3], [4, 5, [ 6, 7 ]]]
const flatArr = (arr) => {
  let result = []
  for(let i =0; i< arr.length; i++) {
    const isArr = Array.isArray(arr[i])

    if(!isArr) {
      result.push(arr[i])
    } else {
      result = result.concat(flatArr(arr[i]))
    }
  }
  return result
}

console.log('flat 2>', flatArr(arr2))

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



