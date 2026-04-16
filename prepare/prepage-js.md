# 节流函数（Throttle）

```js
export const throttle = (func, delay) => {
  let timer = null
  let previous = null

  return function(...args) {
    let now = new Date()

    if (previous && now < previous + delay ) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        func.apply(this, args)
      }, delay)
    } else {

    }
  }
}
```
