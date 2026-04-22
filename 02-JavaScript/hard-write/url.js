/**
 * 解析 URL 查询参数
 * @param {string} url - 完整的 URL 字符串
 * @returns {Object} - 解析后的查询参数对象
 */
const parseParams = (url) => {
  if (!url) return url

  const params = {}

  const queryStart = url.indexOf('?')
  if (queryStart === -1 ) {
    return params  // 没有查到对应的数据
  }

  const queryString = url.slice(queryStart + 1)

  const pairs = queryString.split('&')

  pairs.forEach(pair => {
    const [key, value] = pair.split('=')

    const decodeKey = decodeURIComponent(key)
    const decodeValue = value ? decodeURIComponent(value) : ''

    // 处理重复键的问题
    if(params[decodeKey] !== undefined) {
      // 如果重复了的话，那么变成数组然后再push 新的值进去
      if (!Array.isArray(params[decodeKey])) {
        params[decodeKey] = [params[decodeKey]]
      }
      params[decodeKey].push(decodeValue)
    } else {
      params[decodeKey] = decodeValue
    }
  })

  return params
}
const url = 'https://example.com/api?name=John&age=30&tags=js&tags=node';
const result = parseParams(url);
console.log('result:', result)