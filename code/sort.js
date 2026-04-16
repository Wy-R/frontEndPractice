const arr = [1,4,6,7,2,3,8,6,7,8,10]

// 选择排序
function insertSort(arr) {
  
  for(var i=0; i< arr.length-1; i++) {
    let minIndex = i

    for(var j= i+1; j< arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j
      }
    }
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]; // ES6 解构赋值交换
    }
  }

  return arr
}

var insertSort02 = (arr) => {
  for(let i=0; i<arr.length -1; i++) {
    for(var j=i+1; j<arr.length; j++) {
      if(arr[i]> arr[j]) {
        let tmp = arr[i]
        arr[i] = arr[j]
        arr[j] = tmp
      }
    }
  }

  return arr
}


// const insertRes = insertSort(arr)
// console.log('insertRes', insertRes)

// 冒泡排序
const bubbleSort = (arr) => {
  for(let i=0; i<arr.length -1; i++) {
    let swapped = false
    for(let j=0; j<arr.length -1 -i; j++) {
      if(arr[j] > arr[j+1]) {
        [arr[j], arr[j+1]] = [arr[j+1], arr[i]]
        swapped = true
      }
    }
    if (!swapped) break;
  }
}

// const bubbleRes = bubleSort(arr)
// console.log('bubbleRes', bubbleRes)


// 插入排序
function insertionSort(arr) {
  if (arr.length <=1) return arr

  for(let i=1; i<arr.length; i++) {
    const current = arr[i]
    let j = i -1

    while(j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j]
      j--
    }

    arr[j+1] = current
  }
}