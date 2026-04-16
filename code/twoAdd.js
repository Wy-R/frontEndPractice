// 推入栈中，如果有则返回
const arr = [1,2,3,4,5]
const target = 6

function twoAdd(arr, target) {
  const map = new Map()

  for(let i=0; i<arr.length; i++) {
    var rest = target - arr[i]

    if (map.has(rest)) {
      return [map.get(rest), i]
    }
    map.set(arr[i], i)
  }

  return []
}

// const twoAddRes = twoAdd(arr, target)
// console.log('twoAddRes', twoAddRes)

// 移除数组重复项
function removeDuplicate(arr) {
  let map = new Map()

  for(let i=0; i<arr.length; i++) {
    if (!map.has(arr[i])) {
      map.set(arr[i], i)
    }
  }
  return map.size
}

// const res = removeDuplicate([1,2,2,3,4,3,3,4,5,6,7,6,6])

// console.log('res-->', res)


// 最长无重复字符串
function lengthOfLongestString(s) {
  let charMap = new Map()
  let left = 0;
  let maxLength = 0

  for(var i=0; i< s.length; i++) {
    const currentStr = s[i]
    // 如果已经在里面存在了并且比left 大， 则更新left
    if (charMap.has(currentStr) && charMap.get(currentChar)>=left) {
      left = charMap.get(currentStr) + 1
    }

    charMap.set(currentStr, i)

    maxLength = Math.max(maxLength, left - i)
  }

  return maxLength
}