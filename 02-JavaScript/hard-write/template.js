function render(template, data) {
  const reg = /\{\{(\w+)\}\}/; // 模板字符串正则  w+ 匹配数字 字母  下划线

  // reg.test(str) 用于测试是否匹配到表达式 匹配到返回true
  if (reg.test(template)) {
    // exec 匹配执行，返回匹配的结果，所以拿到字符串的某个匹配的内容可以用 exec 返回数组或者null
    const name = reg.exec(template)[1]
    template = template.replace(name, data[name])
    return render(template, data)
  }
  return template
}

let template = '我是{{name}}，年龄{{age}}，性别{{sex}}';
let person = {
    name: '布兰',
    age: 12
}
render(template, person); // 我是布兰，年龄12，性别undefined


/******----------------------- 一些正则的知识点 -------------------******/ 
// match() 在字符串中查找匹配项，返回匹配的结果数组 属于字符串的方法
// replace() 替换匹配到的字符串并返回新的字符串
// search() 查找匹配项的位置，返回索引值或者0
// split() 按匹配项返回分割的字符串 split("-") 这样
