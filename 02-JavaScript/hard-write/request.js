const API_URL = 'https://jsonplaceholder.typicode.com'

async function getRequest(path, params) {
  try {
    const response =fetch(`${API_URL}${path}`, {
      method: "GET",
      params: params
    })

    // 检查状态
    if(!response.ok) {
      throw new Error(`HTTP ERROR! STATUS', ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    throw error
  }
}

async function postRequest({path, data}) {
  try {
    const response = await fetch(`${API_URL}/${path}`, {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok){
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json()
    return responseData
  } catch (error) {
    throw new Error()
  }
}


const axios = function(config) {
  const mergedConfig = {...defaultConfig, ...config}

  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined') {
      // 浏览器里面
      const xhr = new XMLHttpRequest()
      xhr.open(mergedConfig.method, mergedConfig.url)

      // 把参数都set 进去
      Object.keys(mergedConfig.headers).forEach(key => {
        xhr.setRequestHeaders(key, mergedConfig.headers[key])
      })

      // 设置超时
      xhr.timeout = mergedConfig.timeout

      // 允许携带凭证
      xhr.withCredentials = mergedConfig.withCredentials ?? true

      // 处理响应
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = {
            data: JSON.parse(xhr.responseText),
            status: xhr.status,
            statusText: xhr.statusText
          }
          resolve(response)
        } else {
          reject(new Error(`HTTP error! status: ${xhr.status}`))
        }
      }

      xhr.onerror = function() {
        reject(new Error(`Network error`))
      }

      xhr.send(JSON.stringify(mergedConfig.data))

    } else {
      // nodejs 里面
      const http = require('http')
      const options = {
        method: mergedConfig.method,
        hostname: new URL(mergedConfig.url).hostname,
        path: new URL(mergedConfig.url).pathname,
        headers: mergedConfig.headers
      }

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          const response = {
            data: JSON.parse(data),
            status: res.statusCode,
            statusText: res.statusMessage
          };
          resolve(response);
        });

        req.on('error', (error) => {
          reject(error);
        });
        req.write(JSON.stringify(mergedConfig.data));
        req.end();
      })
    }
  })
}