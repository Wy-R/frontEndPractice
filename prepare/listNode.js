class Node {
  constructor(value) {
    this.val = value
    this.next = null
  }
}

class List {
  constructor() {
    super()
    this.head = null
    this.tail = null
    this.length = 0
  }

  append (value) {
    const newNode = new Node(value)
    if (!this.head) {
      this.head = newNode
      this.tail = newNode
    } else {
      this.tail.next = newNode
      this.tail = newNode
    }
    this.length++
    return this
  }

  // 添加元素到链表头部
  prepend(value) {
    const newNode = new Node(value)

    if (!this.head){
      this.head = newNode
      this.tail = newNode
    } else {
      newNode.next = this.head
      this.head = newNode
    }

    this.length++
    return this
  }

  // 遍历链表
  traverseToIndex(index) {
    let i = 0;
    let currentNode = this.head
    while(i !== index) {
      currentNode = currentNode.next
      i++
    }

    return currentNode
  }

  insert(index, value) {
    if(index ===0) {
      this.prepend(value)
      return this
    }

    if(index > this.length) {
      this.append(value)
    }

    const newNode = new Node(value)
    const currentNode = this.traverseToIndex(index -1)
    const currentNext = currentNode.next
    currentNode.next = newNode
    newNode.next = currentNext
    this.length++
    return this
  }

  remove(index) {
    if (index === 0) {
      this.head = this.head.next
      this.length--
      return this
    }

    const currentNode = this.traverseToIndex(index -1)
    const currentNext = currentNode.next
    currentNode.next = currentNext.next
    this.length--
    return this
  }

  printList() {
    const array = []
    let currentNode = this.head
    while(currentNode) {
      array.push(currentNode.value)
      currentNode = currentNode.next
    }

    return array
  }

  reverse() {

    if (!this.head || !this.head.next) {
      return this
    }

    let prev = null
    let current = this.head
    let next = null
    this.tail = this.head

    while(next) {
      next = current.next
      current.next = prev
      prev = current
      current = next
    }

    this.head = prev
    return this

  }

  isCircleList() {
    let slow = this.head
    let fast = this.head.next

    if (!this.head || !this.head.next) {
      return false
    }

    while(slow !== fast) {
      if (!fast || !fast.next) {
        return false
      }
      slow = slow.next
      fast = fast.next.next
    }

    return true
  }

  findCircleEntry () {
    let slow = this.head
    let fast = this.head.next
    let hasCycle = false

    while(fast && fast.next) {
      slow = slow.next
      fast = fast.next.next

      if(slow === fast) {
        hasCycle = true
        break
      }
    }

    if (!hasCycle) {
      return null
    }

    slow = this.head
    while(slow !== fast) {
      slow = slow.next
      fast = fast.next
    }

    return slow // 相遇点即为环的入口
  }

  /**
   * 
   * @param {*} l1 
   * @param {*} l2 
   * @returns 
   * 1.创建虚拟头节点。也就是一个新的链表
   * 2. 同时遍历两个链表，然后比较链表的大小
   */
  mergeTwoLists(l1, l2) {
    const dummy = new Node(0)
    let current = dummy

    while(l1 && l2) {
      if (l1.value < l2.value) {
        current.next = l1
        l1 = l1.next
      } else {
        current.next = l2
        l2 = l2.next
      }

      current = current.next
    }

    current.next = l1 || l2

    return dummy.next
  }
  removeDuplicate(head) {

    if(!head || !head.next) {
      return head
    }

    let current = head

    while(current && current.next) {
      if (current.value === current.next.value) {
        current.next = current.next.next
      } else {
        current = current.next
      }
    }

    return head
  }
  // 翻转链表 区间
  reverseBetween(head, left, right) {
    if (!head || left === right) {
      return head
    }

    const dummy = new Node(0)
    dummy.next = head

    let prev = dummy

    // 找到翻转起始位置的前一个节点
    for(let i=0; i<left; i++) {
      prev = prev.next
    }

    let current = prev.next
    let next = null
    let start = current

    for(let i=0; i<right-left + 1; i++) {
      next = current.next
      current.next = prev.next
      prev.next = current
      current = next
    }

    start.next = current

    return dummy.next

  }
}