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