const isValid = (str) => {
  if (!str.length) return true
  if (str.length %2 !== 0) return false
  const map = {
    ")": "(",
    "}": "{",
    "]": "[",
  }

  const stack = []

  for(let char of str) {
    if (char === '(' || char ===  '{' || char === '[') {
      stack.push(char)
    } else {
      if (stack.length === 0)  {
        return false
      }
      const top = stack.pop()
      if (map[char] !== top) return false
    }
  }

  return stack.length === 0
}


