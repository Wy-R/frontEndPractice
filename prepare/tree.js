class TreeNode {
  constructor(value, left, right) {
    this.value = value ?? null
    this.left = left ?? null
    this.right = right ?? null
  }
}

const n1 = new TreeNode(1)
const n2 = new TreeNode(2)
const n3 = new TreeNode(3)
const n4 = new TreeNode(4)
const n5 = new TreeNode(5)
const n6 = new TreeNode(6)
const n7 = new TreeNode(7)

n1.left = n2
n1.right = n3
n2.left = n4
n2.right = n5
n3.left = n6
n3.right = n7


// 层序遍历
function levelOrder(root) {
  const queue = [root]
  const list = []
  while(queue.length) {
    let node = queue.shift()
    list.push(node.value)
    if(node.left) {
      queue.push(node.left)
    }

    if (node.right) {
      queue.push(node.right)
    }
  }
  return list
}

// const list  =  levelOrder(n1)
// console.log('list--->', list)


// 按照层级划分list
const levelOrderbyLevel = (root) => {
  if (!root) return []

  const queue = [root]
  const list = []

  while(queue.length) {
    const currentLevel = []
    const levelSize = queue.length
    console.log('levelSize', levelSize)

    for(var i=0; i<levelSize; i++) {
      const node = queue.shift()
      currentLevel.push(node.value)

      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }

    list.push(currentLevel)
  }
  return list
}

// const list2 = levelOrderbyLevel(n1)
// console.log('list2:', list2)


// 前序遍历  中间-> 左边 -> 右边
function preOrder(root) {
  const result = []

  function traverse(node) {
    if (!node) return 
    result.push(node.value)
    console.log('node----', node)
    traverse(node.left)
    traverse(node.right)
  }

  traverse(root)
  return result 
}

// 中序遍历 左 -> 中 -> 右
function inOrderTraversal(root) {
  const result = []

  function traverse(node) {
    if(!node) return
    inOrderTraversal(node.left)
    result.push(node.value)
    inOrderTraversal(node.right)
  }

  traverse(root)
  return result
}

// 后序遍历  左子树 -> 右子树 -> 根节点
function postOrderTraversal(root) {
  const result = []

  function traverse(node) {
    if(!node) return
    inOrderTraversal(node.left)
    inOrderTraversal(node.right)
    result.push(node.value)
  }

  traverse(root)
  return result
}

const result = preOrder(n1)
console.log('result', result)
