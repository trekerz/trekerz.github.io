---
title: Redux异步方案总结
subtitle: "循序渐进的方案思路"
date: 2020-04-02 15:17:19
tags: 
	- 笔记
	- 读书笔记
layout: post
author: "Trekerz"
header-img: "/bing/OldTownTallinn_ZH-CN4833535739_1920x1080.jpg"
---





> Redux本身只能处理同步的Action，但可以通过中间件来拦截处理其它类型的action，比如函数(Thunk)，再用回调触发普通Action，从而实现异步处理，**在这点上所有Redux的异步方案都是类似的**。

## 一、redux-thunk

1. ##### Github

   https://github.com/gaearon/redux-thunk

2. ##### 原理

   判断action如果是个函数，则执行了函数之后再dipatch一个action去reducer。

   ```js
   //action types
   const GET_DATA = 'GET_DATA',
       GET_DATA_SUCCESS = 'GET_DATA_SUCCESS',
       GET_DATA_FAILED = 'GET_DATA_FAILED';
       
   //action creator
   const getDataAction = function(id) {
       return function(dispatch, getState) {
           dispatch({
               type: GET_DATA, 
               payload: id
           })
           api.getData(id)
               .then(response => {
                   dispatch({
                       type: GET_DATA_SUCCESS,
                       payload: response
                   })
               })
               .catch(error => {
                   dispatch({
                       type: GET_DATA_FAILED,
                       payload: error
                   })
               }) 
       }
   }
   
   //reducer
   const reducer = function(oldState, action) {
       switch(action.type) {
       case GET_DATA : 
           return oldState;
       case GET_DATA_SUCCESS : 
           return successState;
       case GET_DATA_FAILED : 
           return errorState;
       }
   }
   ```

3. ##### 缺点

   - 写起来代码很多很复杂；
   - 像`GET_DATA_SUCCESS`、`GET_DATA_FAILED`这样的字符串声明也非常无趣且易错；
   - `GET_DATA`这个action并不是多数场景需要的，它涉及我们将会提到的`乐观更新`。

## 二、redux-promise

1. ##### Github

   https://github.com/redux-utilities/redux-promise

2. ##### 原理

   看action或者payload是不是一个Promise，是则执行Promise，将执行结果放进此action的拷贝的payload里，重新出发一个相同type的action。

   ```js
   //action types
   const GET_DATA = 'GET_DATA';
   
   //action creator
   const getData = function(id) {
       return {
           type: GET_DATA,
           payload: api.getData(id) //payload为promise对象
       }
   }
   
   //reducer
   function reducer(oldState, action) {
       switch(action.type) {
       case GET_DATA: 
           if (action.status === 'success') {
               return successState
           } else {
                  return errorState
           }
       }
   }
   ```

3. ##### 缺点

   [无法处理乐观更新](https://github.com/acdlite/flux-standard-action/issues/7)

   **乐观更新**的具体解释：https://segmentfault.com/a/1190000007248878#item-1-2

## 三、redux-promise-middleware

1. ##### Github

   https://github.com/pburtchaell/redux-promise-middleware

2. ##### 原理

   相比redux-promise，采取了更为温和和渐进式的思路，保留了和redux-thunk类似的三个action；

   redux-promise-middleware自己在处理Promise之前，发了一个`_PENDING`的action，保证了乐观更新。

   ```js
   //action types
   const GET_DATA = 'GET_DATA',
       GET_DATA_PENDING = 'GET_DATA_PENDING',
       GET_DATA_FULFILLED = 'GET_DATA_FULFILLED',
       GET_DATA_REJECTED = 'GET_DATA_REJECTED';
       
   //action creator
   const getData = function(id) {
       return {
           type: GET_DATA,
           payload: {
               promise: api.getData(id),
               data: id
           }
       }
   }
   
   //reducer
   const reducer = function(oldState, action) {
       switch(action.type) {
       case GET_DATA_PENDING :
           return oldState; // 可通过action.payload.data获取id
       case GET_DATA_FULFILLED : 
           return successState;
       case GET_DATA_REJECTED : 
           return errorState;
       }
   }
   ```

   如果不需要乐观更新，action creator可以使用和redux-promise完全一样的，更简洁的写法，即：

   ```js
   const getData = function(id) {
       return {
           type: GET_DATA,
           payload: api.getData(id) //等价于 {promise: api.getData(id)}
       }
   }
   ```

3. ##### 缺点

   只是简化了action层，并没有简化reducer层。

## 四、redux-action-tools

1. ##### Github

   https://github.com/kpaxqin/redux-action-tools

2. ##### 原理

   相比redux-promise-middleware，既保持了乐观更新，又精简了reducer层。

   ```js
   const GET_DATA = 'GET_DATA';
   
   //action creator
   const getData = createAsyncAction(GET_DATA, function(id) {
       return api.getData(id)
   })
   
   //reducer
   const reducer = createReducer()
       .when(getData, (oldState, action) => oldState)
       .done((oldState, action) => successState)
       .failed((oldState, action) => errorState)
       .build()
   ```

   action层：

   做的事情与前面几个库大同小异：同样是派发了三个action：`GET_DATA`/`GET_DATA_SUCCESS`/`GET_DATA_FAILED`。这三个action的描述见下表：

   | type                    | When       | payload           | meta.asyncPhase |
   | ----------------------- | ---------- | ----------------- | --------------- |
   | ${actionName}           | 异步开始前 | 同步调用参数      | 'START'         |
   | ${actionName}_COMPLETED | 异步成功   | value of Promise  | 'COMPLETED'     |
   | ${actionName}_FAILED    | 异步失败   | reason of Promise | 'FAILED'        |

   reducer层：

   `XX_SUCCESS`/`XX_FAILED`相关的代码都被封装了起来。

3. ##### meta.asyncPhase的作用

   https://segmentfault.com/a/1190000007248878#item-1-4

   检测`meta.asyncStep`字段，触发新的action去调用通用处理逻辑，做到**面向action、不侵入业务**。

   - 失败处理
   - loading

## 五、redux-loop

1. ##### 原理

   众所周知，Redux是借鉴自[Elm](http://elm-lang.org/)的，然而在Elm中，异步的处理却并不是在action creator层，而是在reducer(Elm中称update)层；

   而redux-loop，则是在这方面的一个尝试，它更彻底的模仿了Elm的模式：引入Effects的概念并将其置入reducer，官方示例如下：

   ```js
   import { Effects, loop } from 'redux-loop';
   import { loadingStart, loadingSuccess, loadingFailure } from './actions';
   
   export function fetchDetails(id) {
     return fetch(`/api/details/${id}`)
       .then((r) => r.json())
       .then(loadingSuccess)
       .catch(loadingFailure);
   }
   
   export default function reducer(state, action) {
     switch (action.type) {
       case 'LOADING_START':
         return loop(
           { ...state, loading: true },
           Effects.promise(fetchDetails, action.payload.id)
         ); // 同时返回状态与副作用
   
       case 'LOADING_SUCCESS':
         return {
           ...state,
           loading: false,
           details: action.payload
         };
   
       case 'LOADING_FAILURE':
         return {
           ...state,
           loading: false,
           error: action.payload.message
         };
   
       default:
         return state;
     }
   }
   ```

   注意在reducer中，当处理`LOADING_START`时，并没有直接返回state对象，而是用`loop`函数将state和Effect"打包"返回(实际上这个返回值是数组`[State, Effect]`，和Elm的方式非常接近)。

2. ##### 缺点

   修改reducer的返回类型显然是比较暴力的做法，除非Redux官方出面，否则很难获得社区的广泛认同。

## 六、redux-sage

1. ##### Github

   https://github.com/redux-saga/redux-saga

2. ##### 原理

   让异步行为成为架构中独立的一层(称为saga)，既不在action creator中，也不和reducer沾边；

   它的出发点是把副作用 (Side effect，异步行为就是典型的副作用) 看成"线程"，可以通过普通的action去触发它，当副作用完成时也会触发action作为输出。

   ```js
   import { takeEvery } from 'redux-saga'
   import { call, put } from 'redux-saga/effects'
   import Api from '...'
   
   function* getData(action) {
      try {
         const response = yield call(api.getData, action.payload.id);
         yield put({type: "GET_DATA_SUCCEEDED", payload: response});
      } catch (e) {
         yield put({type: "GET_DATA_FAILED", payload: error});
      }
   }
   
   function* mySaga() {
     yield* takeEvery("GET_DATA", getData);
   }
   
   export default mySaga;
   ```

3. ##### 优点

   - **可测试性**；

   - 强大的异步**流程控制**；

   - **处理竞态**（takeLatest）；

     详见https://segmentfault.com/a/1190000007248878#item-2-6







参考资料：https://segmentfault.com/a/1190000007248878



<br/>



<center>--end--</center>



<br/>