---
title: 讲讲Axois
subtitle: "使用说明"
date: 2020-02-26 21:47:29
tags: 
	- 笔记
	- 读书笔记
layout: post
author: "Trekerz"
header-img: "/bing/OldTownTallinn_ZH-CN4833535739_1920x1080.jpg"
---





### 一、Http相关

1. ##### Rest Api

   - 发送请求进行CRUD哪个操作由请求方式来决定
   - 同一个请求路径可以进行多个操作
   - 请求方式会用到GET/POST/PUT/DELETE

2. ##### 非Rest Api

   - 请求方式不决定请求的CRUD操作
   - 一个请求路径只对应一个操作
   - 一般只有GET/POST

### 二、ajax与一般http请求的区别

1. ajax请求时一种特别的http请求

2. 对服务器端来说没有任何区别，区别在浏览器端

3. 浏览器端发请求：只有XHR和fetch发出的才是ajax请求，其它所有的都是非ajax请求

4. 浏览器端接收到响应：

   (1) 一般请求：浏览器一般会直接显示响应体数据，也就是刷新 / 跳转

   (2) ajax请求：浏览器不会对界面进行任何更新操作

### 三、XHR的api

1. XMLHttpRequest()
2. status：相应状态码，比如200、404
3. statusText
4. readyState
5. onreadystateChange
6. responseType：指定响应数据类型，如果是'json'，得到响应后自动解析响应体数据
7. response
8. **timeout：超时**
9. **ontimeout：超时处理**
10. onerror
11. open(method, url[, async])
12. send(data)
13. **abort()：取消请求**
14. getResponseHeader(name)
15. getAllResponseHeaders()
16. setRequestHeader(name, value)

### 四、封装一个ajax

```js
// 简易版ajax
// 未处理的部分细节：header参数、query参数、其它method处理（包括大小写兼容）
function ajax({
  url,
  method = 'GET',
  params = {},
  data = {}
}) {
  // 返回一个Promise对象
  return new Promise((resoove, reject) => {
    
    // 1. 创建
    const xhr = new XMLHttpRequest()
    
    // 2. 连接
    xhr.open(method, url, true) // 第三个参数标志是否异步
    
    // 3. 发送
    // send参数必须是一个字符串
    if (method === 'GET') {
      xhr.send()
    } else if (method === 'POST') {
      xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8')
    	xhr.send(JSON.stringify(data))
    }
    
    // 4. 
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) {
        return
      }
      const { status, statusText } = xhr
      if (status >= 200 && status <= 299) {
        const res = {
          data: JSON.parse(xhr.response),
          status,
          statusText
        }
        resolve(res)
      } else {
        reject(new Error('err status is: ' + status))
      }
    }
  })
}
```

### 五、Axios二次封装要点

1. ##### axios.create()

   创建不同配置的请求

2. ##### axios.cancelToken

   取消请求配置

3. ##### 美至Adbot中的Axios封装：

   (1) `instance.interceptors.request.use(onResolved, onRejected)`

   - 做一些业务上的配置（cancel、token、tenantCode）

   (2) `instance.interceptors.response.use(onResolved, onRejected)`

   - 做一些错误处理（删除cancel、状态处理（白名单）、错误处理）

### 六、Axios源码解析

1. ##### 项目结构

   - xhr.js
   - Axios.js
   - dispatchRequest.js
   - interceptorManager.js
   - axios.js
   - defaults.js

2. ##### axios和Axios的关系

   - 语法上axios不是Axios的实例
   - 功能上axios是Axios的实例
   - axios是`Axios.prototype.request`函数bind()返回的函数（即axios函数里面是去执行`Axios.prototype.request`）
   - axios作为对象有Axios原型对象上的所有方法，有Axios对象上的所有属性

   **axios本身是一个构造函数，但它也有Axios原型对象上的属性和Axios实例对象上的属性（extend过去的），这样做是为了灵活调用方便。（例：axios和axios.create()都是axios构造函数）**

3. ##### Axios流程图

   (1) `request(config)`

   将请求拦截器 / dispatchRequest() / 响应拦截器 通过Promise串联起来，返回Promise

   (2) `dispatchRequest(config)`

   转换请求数据 ==> 调用xhrAdapter()发请求 ==> 请求返回后转换响应的数据

   (3) `xhrAdapter(config)`

   创建XHR对象，根据config进行相应设置，发送请求，接收响应，返回Promise

   ###### 整体流程代码：

   ```js
   /**
    *Axios.js
    */
   // 1. 数组左边放request拦截器，右边放response拦截器
   var chain = [dispatchRequest, undefined]
   var promise = Promise.resolve(config)
   
   // 2.1 request拦截器：后添加的先执行（unshift）
   this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
     chain.unshift(interceptor.fulfilled, interceptor.rejected)
   })
   
   // 2.2 response拦截器：先添加的先执行（push）
   this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
     chain.push(interceptor.fulfilled, interceptor.rejected)
   })
   
   // 3. 通过promise的then()串联起所有的请求拦截器 + 请求方法 + 响应拦截器
   while (chain.length) {
     // 把fulfilled和rejected传入promise链节
     promise = promise.then(chain.shift(), chain.shift())
   }
   
   // 4. 返回promise
   return promise
   ```

4. ##### cancelToken

   (1) 当配置了cancelToken对象时，保存`cancel()`函数

   - 创建一个用于将来中断请求的cancelPromise
   - 把cancelPromise的resolve传出来
   - `cancel()`函数就是这个resolve

   (2) 调用`cancel()`取消请求

   - 执行`cancel()`函数
   - cancelPromise变为成功
   - xhrAdapter里面会处理cancelPromise的then，then里面回去调xhr的abort()方法



<br/>



<center>--end--</center>



<br/>