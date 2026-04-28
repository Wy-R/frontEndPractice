# XMLHttpRequest 面试核心知识点

## 一、基础概念

### 1. 什么是 XMLHttpRequest？

- **定义**：浏览器提供的用于发送 HTTP 请求的 API
- **作用**：实现异步通信，无需刷新页面即可获取数据
- **历史**：最早由 Microsoft 引入，后被 W3C 标准化

### 2. 核心特性

- **异步请求**：不阻塞主线程
- **支持多种数据格式**：XML、JSON、HTML、文本等
- **支持跨域**：通过 CORS 实现
- **支持进度追踪**：可监控上传/下载进度

### 3. 与 Fetch、Axios 的关系

- **Fetch**：现代浏览器原生 API，基于 Promise
- **Axios**：第三方库，底层在浏览器端使用 XMLHttpRequest
- **XMLHttpRequest**：传统 API，功能基础但强大

## 二、基本使用

### 1. 创建对象

```javascript
const xhr = new XMLHttpRequest();
```

### 2. 初始化请求

```javascript
xhr.open(method, url, async);
// method: GET、POST、PUT、DELETE 等
// url: 请求地址
// async: 是否异步（true/false），默认 true
```

### 3. 设置请求头

```javascript
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.setRequestHeader('Authorization', 'Bearer token');
```

### 4. 发送请求

```javascript
// GET 请求
xhr.send();

// POST 请求
xhr.send(JSON.stringify({ key: 'value' }));
```

### 5. 完整示例

```javascript
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.example.com/data', true);
xhr.setRequestHeader('Content-Type', 'application/json');

xhr.onreadystatechange = function() {
  if (xhr.readyState === 4 && xhr.status === 200) {
    const data = JSON.parse(xhr.responseText);
    console.log(data);
  }
};

xhr.send();
```

## 三、核心属性

### 1. readyState

- **0**：未初始化（UNSENT）
- **1**：已打开（OPENED）
- **2**：已发送（HEADERS_RECEIVED）
- **3**：正在接收（LOADING）
- **4**：完成（DONE）

### 2. status

- **2xx**：成功（如 200 OK）
- **3xx**：重定向（如 301 Moved Permanently）
- **4xx**：客户端错误（如 404 Not Found）
- **5xx**：服务器错误（如 500 Internal Server Error）

### 3. responseText

- 响应的文本内容（适用于文本、JSON 等）

### 4. responseXML

- 响应的 XML 内容（适用于 XML 格式）

### 5. statusText

- 响应状态的描述文本（如 "OK"、"Not Found"）

## 四、事件处理

### 1. onreadystatechange

- **触发时机**：readyState 改变时
- **用途**：检测请求状态并处理响应

```javascript
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      // 成功处理
    } else {
      // 错误处理
    }
  }
};
```

### 2. onload

- **触发时机**：请求成功完成时
- **用途**：简化成功响应的处理

```javascript
xhr.onload = function() {
  if (xhr.status === 200) {
    console.log(xhr.responseText);
  }
};
```

### 3. onerror

- **触发时机**：网络错误时
- **用途**：处理网络异常

```javascript
xhr.onerror = function() {
  console.error('Network error');
};
```

### 4. ontimeout

- **触发时机**：请求超时时
- **用途**：处理超时情况

```javascript
xhr.timeout = 5000; // 5 秒
xhr.ontimeout = function() {
  console.error('Request timeout');
};
```

### 5. onprogress

- **触发时机**：上传/下载进度变化时
- **用途**：显示进度条

```javascript
// 下载进度
xhr.onprogress = function(e) {
  if (e.lengthComputable) {
    const percent = (e.loaded / e.total) * 100;
    console.log(`下载进度: ${percent}%`);
  }
};

// 上传进度
xhr.upload.onprogress = function(e) {
  if (e.lengthComputable) {
    const percent = (e.loaded / e.total) * 100;
    console.log(`上传进度: ${percent}%`);
  }
};
```

## 五、请求取消

### 1. abort() 方法

- **作用**：取消正在进行的请求
- **使用场景**：用户主动取消或页面卸载时

```javascript
xhr.abort();
```

### 2. 示例

```javascript
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.example.com/data', true);

xhr.onload = function() {
  console.log('请求成功');
};

xhr.onabort = function() {
  console.log('请求被取消');
};

xhr.send();

// 5 秒后取消请求
setTimeout(() => {
  xhr.abort();
}, 5000);
```

## 六、跨域处理

### 1. CORS（跨域资源共享）

- **原理**：通过 HTTP 响应头控制跨域访问
- **关键响应头**：
  - `Access-Control-Allow-Origin`：允许的源
  - `Access-Control-Allow-Methods`：允许的方法
  - `Access-Control-Allow-Headers`：允许的请求头
  - `Access-Control-Allow-Credentials`：是否允许携带凭证

### 2. 简单请求 vs 预检请求

- **简单请求**：直接发送，无需预检
  - 方法：GET、POST、HEAD
  - 内容类型：application/x-www-form-urlencoded、multipart/form-data、text/plain
- **预检请求**：先发送 OPTIONS 请求，通过后再发送实际请求
  - 方法：PUT、DELETE 等
  - 自定义请求头

### 3. 示例：带凭证的跨域请求

```javascript
const xhr = new XMLHttpRequest();
xhr.open('POST', 'https://api.example.com/data', true);
xhr.withCredentials = true; // 允许携带凭证
xhr.setRequestHeader('Content-Type', 'application/json');

xhr.onload = function() {
  console.log(xhr.responseText);
};

xhr.send(JSON.stringify({ key: 'value' }));
```

## 七、高级用法

### 1. 同步请求

- **不推荐**：会阻塞主线程
- **使用场景**：极少数需要同步的情况

```javascript
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.example.com/data', false); // 同步
xhr.send();
console.log(xhr.responseText);
```

### 2. 上传文件

```javascript
const xhr = new XMLHttpRequest();
xhr.open('POST', 'https://api.example.com/upload', true);

// 设置表单数据
const formData = new FormData();
formData.append('file', fileInput.files[0]);

xhr.upload.onprogress = function(e) {
  const percent = (e.loaded / e.total) * 100;
  console.log(`上传进度: ${percent}%`);
};

xhr.onload = function() {
  console.log('上传成功');
};

xhr.send(formData);
```

### 3. 超时设置

```javascript
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.example.com/data', true);
xhr.timeout = 10000; // 10 秒

xhr.ontimeout = function() {
  console.error('请求超时');
};

xhr.send();
```

## 八、面试常见问题

### 1. 如何取消 XMLHttpRequest 请求？

```javascript
xhr.abort();
```

### 2. 如何处理跨域请求？

- 使用 CORS 响应头
- 配置 withCredentials
- 处理预检请求

### 3. 如何实现进度条？

- 使用 onprogress 事件
- 计算 loaded/total 的百分比

### 4. readyState 有哪些值？分别代表什么？

- 0: UNSENT（未初始化）
- 1: OPENED（已打开）
- 2: HEADERS_RECEIVED（已接收响应头）
- 3: LOADING（正在接收响应体）
- 4: DONE（完成）

### 5. 如何处理错误？

- 检查 status 状态码
- 监听 onerror 事件
- 设置超时处理

### 6. XMLHttpRequest 和 Fetch 的区别？

- Fetch 是现代 API，基于 Promise
- XMLHttpRequest 是传统 API，功能基础
- Fetch 需要手动处理 HTTP 错误状态

### 7. 如何发送 JSON 数据？

```javascript
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.send(JSON.stringify(data));
```

### 8. 如何发送表单数据？

```javascript
const formData = new FormData();
formData.append('key', 'value');
xhr.send(formData);
```

## 九、总结

### 核心知识点

1. **基本用法**：创建、初始化、发送、处理响应
2. **状态管理**：readyState、status 的含义
3. **事件处理**：onload、onerror、ontimeout、onprogress
4. **跨域处理**：CORS、预检请求、withCredentials
5. **高级功能**：取消请求、上传文件、进度追踪
6. **对比分析**：与 Fetch、Axios 的区别

### 面试技巧

1. **理解原理**：不仅要会用，还要理解底层机制
2. **代码示例**：准备几个常用场景的代码片段
3. **对比分析**：清楚与其他技术的优缺点
4. **实战经验**：分享实际项目中的使用场景

通过掌握这些知识点，你可以在面试中自信地回答关于 XMLHttpRequest 的问题。
