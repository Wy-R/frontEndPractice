class EventEmitter {
  constructor() {
    this.events = {}  // 存储事件及其订阅者
  }

  // 订阅事件
  on(name, callback) {
    if (!this.events[name]) {
      this.events[name] = []
    }
    this.events[name].push(callback)
  }

  // 发布事件 -就是接收一个事件之后把接收
  emit(name, data, once=false) {
    
    if (this.events[name]) {
      // 先创建副本。防止在调用的过程中有添加进来的事件
      const callbacks = this.events[name].slice()
      callbacks.forEach(callback =>callback(data));
    }

    // 如果是一次性的话,那么运行完就删掉吧
    if (once) {
      delete this.events[name]
    }

  }
  // 取消订阅
  off(name, callback) {
    if (this.events[name]) {
      this.events[name] = this.events[name].filter((func) => func !== callback)
    }
  }
}

// 使用的话就是：
const bus = new EventEmitter()

bus.on('update', (data) => {console.log('订阅者1收到啦', data)})
bus.on('update2', ()=> {console.log('订阅者2收到啦')})
bus.emit('update', {message: 'hello world'})