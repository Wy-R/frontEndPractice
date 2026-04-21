class Promise {
  constructor(executor) {
    // 初始化状态
    this.status = 'pending'
    // 初始化存储的值
    this.value = undefined
    // 初始化reject 原因
    this.reason = undefined

    //存储成功回调函数队列
    this.onResolvedCallbacks = []

    // 存储失败回调函数队列
    this.onRejectedCallbacks = []

    const resolve = (value) => {
      if(this.status === 'pending') {
        this.status = 'fulfilled'
        this.value = value
        this.onResolvedCallbacks.forEach((callback) => callback(value))
      }
    }

    const reject = (reason) => {
      if (this.status === 'pending') {
        this.status = 'rejected'
        this.reason = reason
        this.onRejectedCallbacks.forEach(callback => callback(reason))
      }
    }

    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onResolved, onRejected) {
    // 处理 onResolved 和 onRejected 是非函数的情况
    onResolved = typeof onResolved === 'function' ? onResolved : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason}

    // 返回一个新的promise 以备链式调用
    const promise2 = new Promise((resolve, reject) => {
      // 如果成功
      if (this.status === 'fulfilled') {
        setTimeout(() => {
          try {
            const x = onResolved(this.value)

            // 处理返回值x
            this.resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0);
      }

      // 如果失败
      if (this.status === 'rejected') {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason)
            this.resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      }

      // 如果还在pending 中
      if (this.status === 'pending') {
        this.onResolvedCallbacks.push(value => {
          setTimeout(() => {
            try {
              const x= onResolved(value)
              this.resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0)
        })

        this.onRejectedCallbacks.push((reason) => {
          setTimeout(() => {
            try {
              const x = onRejected(reason);
              this.resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
    })

    return promise2
  }

  catch(onRejected){
    return this.then(undefined, onRejected)
  }

  finally(callback) {
    return this.then(
      value => Promise.resolve(callback()).then(() => value),
      reason => Promise.resolve(callback()).then(() => { throw reason})
    )
  }

  resolvePromise(promise2, x, resolve, reject) {
   
    if (promise2 === x) {
      return reject(new TypeError('Chaining cycle detected for promise'))
    }

    
    // 处理 x 是promise的情况
    if (x instanceof Promise) {
      x.then((value) => this.resolvePromise(promise2, value, resolve, reject), (reason)=> reject(reason))
    } 
    // 处理 x 是对象或者函数的情况
    else if (x !== null && (typeof x=== 'object' || typeof x ==='function')) {
      let called = false

      try {
        const then = x.then
        if (typeof then === 'function') {
          then.call(
            x, 
            value=> {
            if (called)  return
            called = true
            this.resolvePromise(promise2, value, resolve, reject)
          },
          reason => {
              if (called) return;
              called = true;
              reject(reason);
            })
        } else {
          if (called) return;
          called = true;
          resolve(x);
        }
      } catch (error) {
        if (called) return;
        called = true;
        reject(error);
      }
    } else {
      resolve(x)
    }
  }
}


Promise.resolve = function(value) {
  if (value instanceof Promise){
    return value
  }

  return new Promise(resolve => resolve(value))
}

Promise.reject = function (value) {
  return new Promise((resolve, reject) => reject(value))
}

// race 就是
Promise.race = function (promiseArr) {
  return new Promise((resolve, reject) => {
    promiseArr.forEach(p => {
      Promise.resolve(p).then((value) => {
        resolve(p)
      })
    }, err=> {
      reject(err)
    });
  })
}


Promise.all = function(promiseArr) {
  return new Promise((resolve, reject) => {
    let result = []
    let index = 0
    promiseArr.forEach((p, i) => {
      Promise.resolve(p).then((value) => {
        result[i] = value
        index++

        if(index === promiseArr.length) {
          resolve(result)
        }
      })
    }, err=> {
      reject(err)
    })

  })
}


Promise.allSettled = function(promiseArr) {
  let result = []
  let index = 0
  const length = promiseArr.length

  return new Promise((resolve, reject) => {
    promiseArr.forEach((p, i) => {
      Promise.resolve(p).then((value)=> {
        index++
        result.push({
          status: 'fulfilled',
          value: value
        })

        if (index ===length) {
          resolve(result)
        }

      }, err=> {
        result.push({
          status: 'rejected',
          reason: err
        })

        if (index === length) {
          resolve(result)
        }
      })
    })
  })
}


Promise.any = function(promiseArr) {

  let index = 0

  return new Promise((resolve, reject) => {

    promiseArr.forEach((p, i) => {

      Promise.resolve(p).then((value) => {
        resolve(value)
      }, err => {
        index++
        if (index === promiseArr.length) {
          reject(new AggregateError('all promise were rejected'))
        }
      })
    })
  })
}