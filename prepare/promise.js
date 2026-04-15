Promise.resolve = function(value) {
  // 如果是 promise 的话直接输出
  if(value instanceof Promise) {
    return value
  }

  return new Promise(resolve => resolve(value))
}

Promise.reject = function(value) {
  return new Promise((resolve, reject) => this.reject(value))
}


/**
 * 
 * @param {} promiseArr 
 * @returns 
 * 都成功才是 resolve 
 * 但凡有一个都是 reject 了
 * 
 */
Promise.all = function(promiseArr) {
  let index = 1;
  let result = []

  return new Promise((resolve, reject) => {
    promiseArr.forEach((p, i) => {
      Promise.resolve(p).then((value) => {
        index++;
        result[i] = value
        if (index === promiseArr.length) {
          resolve(result)
        }
      }, err => {
        reject(err)
      })
    });
  })
}

/**
 * 
 * @param {*} promiseArr 
 * promise race 谁跑得快就返回谁
 */
Promise.race = function(promiseArr) {
  return new Promise((resolve, reject) => {
    promiseArr.forEach((p, i) => {
      Promise.resolve(p).then((value) => {
        resolve(value)
      }, err => reject(err))
    })
  })
}