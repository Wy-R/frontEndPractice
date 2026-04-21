# DOM 与 BOM 核心基础知识

本文档涵盖浏览器环境中的 DOM (Document Object Model) 和 BOM (Browser Object Model) 的核心基础知识。

## 目录

- [DOM (Document Object Model)](#dom-document-object-model)
  - [DOM 概念](#dom-概念)
  - [DOM 节点类型](#dom-节点类型)
  - [DOM 操作](#dom-操作)
  - [DOM 事件](#dom-事件)
  - [DOM 遍历](#dom-遍历)
  - [DOM 性能优化](#dom-性能优化)
- [BOM (Browser Object Model)](#bom-browser-object-model)
  - [BOM 概念](#bom-概念)
  - [window 对象](#window-对象)
  - [location 对象](#location-对象)
  - [navigator 对象](#navigator-对象)
  - [screen 对象](#screen-对象)
  - [history 对象](#history-对象)
  - [document 对象](#document-对象)
- [DOM 与 BOM 的关系](#dom-与-bom-的关系)
- [实际应用示例](#实际应用示例)
- [最佳实践](#最佳实践)

## DOM (Document Object Model)

### DOM 概念

DOM 是浏览器将 HTML 或 XML 文档解析为的树状结构，它允许 JavaScript 访问和操作文档的内容、结构和样式。

### DOM 节点类型

DOM 树由不同类型的节点组成，主要包括：

| 节点类型 | 描述 | 示例 |
|---------|------|------|
| 文档节点 (Document) | 整个文档的根节点 | `document` 对象 |
| 元素节点 (Element) | HTML 标签 | `<div>`, `<p>`, `<a>` 等 |
| 文本节点 (Text) | 元素内的文本内容 | `Hello World` |
| 属性节点 (Attribute) | 元素的属性 | `id="example"`, `class="container"` |
| 注释节点 (Comment) | HTML 注释 | `<!-- 这是注释 -->` |

### DOM 操作

#### 1. 选择元素

```javascript
// 通过 ID 选择
const elementById = document.getElementById('example');

// 通过类名选择
const elementsByClass = document.getElementsByClassName('container');

// 通过标签名选择
const elementsByTag = document.getElementsByTagName('div');

// 通过 CSS 选择器选择单个元素
const elementBySelector = document.querySelector('.container > p');

// 通过 CSS 选择器选择多个元素
const elementsBySelectorAll = document.querySelectorAll('li.item');
```

#### 2. 创建和插入元素

```javascript
// 创建元素
const newDiv = document.createElement('div');
const newText = document.createTextNode('Hello, World!');

// 设置属性
newDiv.id = 'new-div';
newDiv.className = 'container';
newDiv.setAttribute('data-value', '123');

// 添加子元素
newDiv.appendChild(newText);

// 插入元素
const parent = document.getElementById('parent');
const beforeElement = document.getElementById('before');

// 在父元素末尾添加
parent.appendChild(newDiv);

// 在指定元素前插入
parent.insertBefore(newDiv, beforeElement);

// 替换元素
const oldElement = document.getElementById('old');
parent.replaceChild(newDiv, oldElement);
```

#### 3. 删除和修改元素

```javascript
// 删除元素
const elementToRemove = document.getElementById('remove');
elementToRemove.parentNode.removeChild(elementToRemove);

// 或使用现代方法 (IE 不支持)
elementToRemove.remove();

// 修改元素内容
const elementToUpdate = document.getElementById('update');
elementToUpdate.innerHTML = '<p>New content</p>'; // 会解析 HTML
elementToUpdate.textContent = 'New text content'; // 纯文本

// 修改元素样式
elementToUpdate.style.color = 'red';
elementToUpdate.style.fontSize = '18px';

// 添加/移除类
const element = document.getElementById('element');
element.classList.add('new-class');
element.classList.remove('old-class');
element.classList.toggle('toggle-class'); // 存在则移除，不存在则添加
element.classList.contains('some-class'); // 检查是否包含类
```

### DOM 事件

#### 1. 事件监听

```javascript
const button = document.getElementById('button');

// 传统方式
button.onclick = function(event) {
  console.log('Button clicked!', event);
};

// 现代方式 (推荐)
button.addEventListener('click', function(event) {
  console.log('Button clicked!', event);
});

// 事件委托
const list = document.getElementById('list');
list.addEventListener('click', function(event) {
  if (event.target.tagName === 'LI') {
    console.log('List item clicked:', event.target.textContent);
  }
});
```

#### 2. 事件类型

常见的 DOM 事件类型：

- **鼠标事件**：click, dblclick, mouseover, mouseout, mousedown, mouseup, mousemove
- **键盘事件**：keydown, keyup, keypress
- **表单事件**：submit, change, input, focus, blur
- **窗口事件**：load, resize, scroll, unload, beforeunload
- **触摸事件**：touchstart, touchmove, touchend, touchcancel

#### 3. 事件对象

事件处理函数接收一个事件对象，包含事件相关的信息：

```javascript
element.addEventListener('click', function(event) {
  event.target; // 事件触发的元素
  event.currentTarget; // 事件监听器附加的元素
  event.type; // 事件类型
  event.clientX, event.clientY; // 鼠标在视口中的位置
  event.pageX, event.pageY; // 鼠标在页面中的位置
  event.preventDefault(); // 阻止默认行为
  event.stopPropagation(); // 阻止事件冒泡
  event.stopImmediatePropagation(); // 阻止事件冒泡并阻止同一元素上的其他监听器
});
```

#### 4. 事件冒泡和捕获

- **冒泡**：事件从目标元素向上传播到根元素
- **捕获**：事件从根元素向下传播到目标元素

```javascript
// 捕获阶段监听
element.addEventListener('click', function() {
  console.log('Capture phase');
}, true);

// 冒泡阶段监听 (默认)
element.addEventListener('click', function() {
  console.log('Bubble phase');
}, false);
```

### DOM 遍历

```javascript
const parent = document.getElementById('parent');

// 子节点
const children = parent.childNodes; // 包括文本节点
const elements = parent.children; // 只包括元素节点

// 第一个和最后一个子元素
const firstChild = parent.firstElementChild;
const lastChild = parent.lastElementChild;

// 兄弟节点
const nextSibling = element.nextElementSibling;
const previousSibling = element.previousElementSibling;

// 父节点
const parentElement = element.parentElement;
const parentNode = element.parentNode;
```

### DOM 性能优化

1. **减少 DOM 操作**：批量操作 DOM，减少重排和重绘

```javascript
// 不好的做法
for (let i = 0; i < 1000; i++) {
  document.getElementById('list').innerHTML += `<li>Item ${i}</li>`;
}

// 好的做法
const list = document.getElementById('list');
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  fragment.appendChild(li);
}
list.appendChild(fragment);
```

2. **使用事件委托**：减少事件监听器数量

3. **缓存 DOM 元素**：避免重复查询

```javascript
// 不好的做法
for (let i = 0; i < 10; i++) {
  document.getElementById('counter').textContent = i;
}

// 好的做法
const counter = document.getElementById('counter');
for (let i = 0; i < 10; i++) {
  counter.textContent = i;
}
```

4. **避免使用 innerHTML**：innerHTML 会解析 HTML，性能较差

5. **使用 requestAnimationFrame**：优化动画和重绘

## BOM (Browser Object Model)

### BOM 概念

BOM 是浏览器对象模型，提供了与浏览器窗口交互的方法和属性，它使 JavaScript 能够与浏览器本身进行交互。

### window 对象

window 对象是 BOM 的核心，表示浏览器窗口，也是全局对象。

#### 1. 窗口尺寸

```javascript
// 视口尺寸（不包括滚动条）
const viewportWidth = window.innerWidth;
const viewportHeight = window.innerHeight;

// 窗口尺寸（包括滚动条）
const windowWidth = window.outerWidth;
const windowHeight = window.outerHeight;

// 滚动位置
const scrollX = window.scrollX || window.pageXOffset;
const scrollY = window.scrollY || window.pageYOffset;

// 滚动到指定位置
window.scrollTo(0, 0); // 滚动到顶部
window.scrollTo({ top: 100, left: 0, behavior: 'smooth' }); // 平滑滚动
```

#### 2. 定时器

```javascript
// 一次性定时器
const timeoutId = setTimeout(function() {
  console.log('Delayed message');
}, 1000); // 1秒后执行

// 清除定时器
clearTimeout(timeoutId);

// 重复性定时器
const intervalId = setInterval(function() {
  console.log('Repeated message');
}, 1000); // 每1秒执行一次

// 清除定时器
clearInterval(intervalId);

// 微任务
Promise.resolve().then(function() {
  console.log('Microtask executed');
});

// requestAnimationFrame (用于动画)
function animate() {
  // 动画代码
  requestAnimationFrame(animate);
}
animate();
```

#### 3. 对话框

```javascript
// 警告框
alert('This is an alert');

// 确认框
const confirmed = confirm('Are you sure?');
if (confirmed) {
  console.log('User confirmed');
}

// 提示框
const input = prompt('Enter your name:', 'John');
if (input !== null) {
  console.log('User entered:', input);
}
```

### location 对象

location 对象包含当前 URL 的信息，并提供导航功能。

```javascript
// URL 组成部分
console.log(location.href); // 完整 URL
console.log(location.protocol); // 协议 (http:, https:)
console.log(location.host); // 主机名和端口
console.log(location.hostname); // 主机名
console.log(location.port); // 端口
console.log(location.pathname); // 路径
console.log(location.search); // 查询字符串
console.log(location.hash); // 哈希值

// 导航方法
location.assign('https://www.example.com'); // 导航到新 URL，保留历史记录
location.replace('https://www.example.com'); // 导航到新 URL，不保留历史记录
location.reload(); // 刷新页面
location.reload(true); // 强制从服务器刷新
```

### navigator 对象

navigator 对象包含浏览器的信息。

```javascript
// 浏览器信息
console.log(navigator.userAgent); // 用户代理字符串
console.log(navigator.appName); // 浏览器名称
console.log(navigator.appVersion); // 浏览器版本
console.log(navigator.platform); // 操作系统平台

// 浏览器功能检测
console.log(navigator.cookieEnabled); // 是否启用 Cookie
console.log('geolocation' in navigator); // 是否支持地理定位
console.log('serviceWorker' in navigator); // 是否支持 Service Worker

// 语言
console.log(navigator.language); // 当前语言
console.log(navigator.languages); // 支持的语言数组
```

### screen 对象

screen 对象包含屏幕的信息。

```javascript
// 屏幕尺寸
console.log(screen.width); // 屏幕宽度
console.log(screen.height); // 屏幕高度
console.log(screen.availWidth); // 可用屏幕宽度
console.log(screen.availHeight); // 可用屏幕高度

// 颜色深度
console.log(screen.colorDepth); // 颜色深度
console.log(screen.pixelDepth); // 像素深度
```

### history 对象

history 对象包含浏览器的历史记录。

```javascript
// 历史记录长度
console.log(history.length);

// 导航方法
history.back(); // 后退一页
history.forward(); // 前进一页
history.go(-2); // 后退两页
history.go(1); // 前进一页

// 推送状态 (HTML5)
history.pushState({ page: 1 }, 'Page 1', '/page1');

// 替换状态
history.replaceState({ page: 2 }, 'Page 2', '/page2');

// 监听历史状态变化
window.addEventListener('popstate', function(event) {
  console.log('State changed:', event.state);
});
```

### document 对象

document 对象既是 DOM 的一部分，也是 BOM 的一部分，表示当前文档。

```javascript
// 文档信息
console.log(document.title); // 文档标题
document.title = 'New Title'; // 修改标题

console.log(document.URL); // 文档 URL
console.log(document.domain); // 文档域名

// 文档写入
document.write('<p>Hello, World!</p>'); // 写入文档
document.writeln('<p>Hello, World!</p>'); // 写入文档并换行

// 文档加载状态
document.readyState; // 'loading', 'interactive', 'complete'

// DOM 加载完成事件
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM content loaded');
});

// 文档完全加载事件
window.addEventListener('load', function() {
  console.log('Page fully loaded');
});
```

## DOM 与 BOM 的关系

- **DOM** 是文档对象模型，处理文档内容和结构
- **BOM** 是浏览器对象模型，处理浏览器窗口和与浏览器的交互
- **document** 对象是两者的交叉点，既是 DOM 的根节点，也是 BOM 的一部分

DOM 结构：
```
document
├── html
│   ├── head
│   │   ├── title
│   │   └── meta
│   └── body
│       ├── div
│       ├── p
│       └── script
└── ...
```

BOM 结构：
```
window
├── document
├── location
├── navigator
├── screen
├── history
└── ...
```

## 实际应用示例

### 1. 表单验证

```javascript
const form = document.getElementById('form');
const email = document.getElementById('email');
const password = document.getElementById('password');

form.addEventListener('submit', function(event) {
  event.preventDefault(); // 阻止默认提交
  
  let isValid = true;
  
  // 验证邮箱
  if (!email.value.includes('@')) {
    email.classList.add('error');
    isValid = false;
  } else {
    email.classList.remove('error');
  }
  
  // 验证密码
  if (password.value.length < 6) {
    password.classList.add('error');
    isValid = false;
  } else {
    password.classList.remove('error');
  }
  
  if (isValid) {
    // 提交表单
    console.log('Form submitted successfully');
  }
});
```

### 2. 动态创建内容

```javascript
const container = document.getElementById('container');
const data = [
  { id: 1, name: 'Item 1', price: '$10' },
  { id: 2, name: 'Item 2', price: '$20' },
  { id: 3, name: 'Item 3', price: '$30' }
];

// 创建产品列表
const ul = document.createElement('ul');
ul.className = 'product-list';

data.forEach(item => {
  const li = document.createElement('li');
  li.className = 'product-item';
  li.innerHTML = `
    <h3>${item.name}</h3>
    <p>${item.price}</p>
    <button data-id="${item.id}">Add to Cart</button>
  `;
  ul.appendChild(li);
});

container.appendChild(ul);

// 添加事件监听器
ul.addEventListener('click', function(event) {
  if (event.target.tagName === 'BUTTON') {
    const productId = event.target.getAttribute('data-id');
    console.log('Add to cart:', productId);
  }
});
```

### 3. 响应式导航菜单

```javascript
const menuButton = document.getElementById('menu-button');
const navMenu = document.getElementById('nav-menu');

menuButton.addEventListener('click', function() {
  navMenu.classList.toggle('show');
});

// 响应式调整
window.addEventListener('resize', function() {
  if (window.innerWidth > 768) {
    navMenu.classList.remove('show');
  }
});
```

## 最佳实践

### DOM 操作最佳实践

1. **使用现代选择器**：优先使用 `querySelector` 和 `querySelectorAll`
2. **缓存 DOM 元素**：避免重复查询
3. **批量操作**：使用 `DocumentFragment` 进行批量 DOM 操作
4. **事件委托**：减少事件监听器数量
5. **避免频繁重排**：合并样式更改，使用 `transform` 和 `opacity` 进行动画
6. **使用 CSS 类**：通过添加/移除类来修改样式，而不是直接操作 `style` 属性
7. **使用 `data-*` 属性**：存储自定义数据

### BOM 使用最佳实践

1. **功能检测**：使用特性检测而不是浏览器检测
2. **避免使用 `alert`**：使用更友好的自定义对话框
3. **谨慎使用 `document.write`**：可能会覆盖文档内容
4. **合理使用定时器**：及时清除定时器，避免内存泄漏
5. **使用 `localStorage`/`sessionStorage`**：替代 cookie 存储数据
6. **响应式设计**：使用 `window.innerWidth` 和媒体查询
7. **安全导航**：验证 URL 安全性，避免 XSS 攻击

### 性能优化

1. **减少 DOM 操作**：最小化重排和重绘
2. **使用事件委托**：减少事件监听器
3. **优化选择器**：使用更具体的选择器
4. **延迟加载**：对非关键资源使用延迟加载
5. **使用 `requestAnimationFrame`**：优化动画性能
6. **避免同步操作**：使用异步 API
7. **压缩和合并脚本**：减少 HTTP 请求

## 总结

DOM 和 BOM 是前端开发中不可或缺的核心技术：

- **DOM** 提供了操作文档结构、内容和样式的能力
- **BOM** 提供了与浏览器窗口交互的能力

掌握这些基础知识，对于构建交互式、响应式的现代网页应用至关重要。通过合理使用 DOM 和 BOM API，可以创建出功能丰富、性能优秀的前端应用。

## 进一步学习资源

- [MDN Web Docs - DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
- [MDN Web Docs - BOM](https://developer.mozilla.org/en-US/docs/Web/API/Window)
- [DOM  Enlightenment](https://domenlightenment.com/)
- [You Don't Know JS: this & Object Prototypes](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed/this%20%26%20object%20prototypes)
- [Performance Optimization with the Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance)