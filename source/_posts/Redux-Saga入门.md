---
title: Redux-Saga入门
subtitle: "基础知识"
date: 2019-10-22 22:00:31
tags: 
	- 笔记
	- 读书笔记
layout: post
author: "Trekerz"
header-img: "/bing/ChilehausHH_ZH-CN3895221092_1920x1080.jpg"
---







## 一、Saga

saga的提出最初是为了解决分布式系统中的`LLT（Long Lived Transaction）`，也就是长时运行事务的数据一致性问题的。

> 所谓“事务(Transaction)”，指的是一个**原子操作**，要么全部执行，要么全部回滚。那么问题来了，为了保证数据的一致性，我们是不是应该等待刚才那个LLT执行完成呢？
>
> 以订票系统为例，我们可以把这个`LLT`拆成两个子事务嘛，T1表示“预定”事务，T2表示“出票”事务。先执行T1，然后就可以把数据库释放出来了，其他人也可以正常订票了。如果用户在30分钟内完成了付款，那么再执行T2完成出票，这样整个事务就执行完毕了。假如超过了30分钟用户还没有付款怎么办？这时候需要**执行一个“补偿”事务C1**，用来回滚T1对数据库造成的修改。**这几个子事务组合在一起，就叫一个saga**。

## 二、副作用（Side Effect）

1. #### 纯函数

   - 输出不受外部环境影响：同样的输入一定可以获得同样的输出；
   - 不影响外部环境：包括但不限于修改外部数据、发起网络请求、触发事件等等

显然，大多数的异步任务都需要和外部世界进行交互，不管是发起网络请求、访问本地文件或是数据库等等，因此，它们都会产生“副作用”。

## 三、redux-saga

**redux-saga是一个Redux中间件，用来帮你管理程序的副作用**。或者更直接一点，主要是用来处理异步action。

1. ### Redux中间件

   在action被传递到reducer之前新进行了一次拦截，然后启动异步任务，等异步任务执行完成后再发送一个新的action，调用reducer修改状态数据。

2. ### watcher saga和worker saga

   - worker saga：具体业务逻辑实现
   - watcher saga：接收特定的action，然后驱动worker saga执行

   ```js
   import Api from '...'
   
   function* workerSaga(action) {
      try {
         const user = yield call(Api.fetchUser, action.payload.userId);
         yield put({type: "USER_FETCH_SUCCEEDED", user: user});
      } catch (e) {
         yield put({type: "USER_FETCH_FAILED", message: e.message});
      }
   }
   
   function* watcherSaga() {
     yield takeEvery("USER_FETCH_REQUESTED", workerSaga);
   }
   ```

3. ### Effect

   redux saga不直接调用异步函数，而是通过`call()`或`put()`这样的函数来调用，以方便测试。这些函数叫做Effect。

   - call：函数调用
   - select：获取store中的数据
   - put：向store发送action
   - take：在store上等待指定action
   - fork：和call类似，但是是非阻塞的，立即返回

   例如上面代码中的`takeEvery`，内部就是不断地`take` --> `fork` --> `take` --> ...

4. ### 组合调用

   ```js
   // 组合为一个rootSaga
   export default function* rootSaga() {
     yield all([
       takeEvery("FOO_ACTION", fooASaga),
       takeEvery("BAR_ACTION", barASaga)
     ])
   }
   ```

   ```js
   import { createStore, applyMiddleware } from 'redux'
   import createSagaMiddleware from 'redux-saga'
   
   import reducer from './reducers'
   import rootSaga from './sagas'
   
   // 创建saga
   const sagaMiddleware = createSagaMiddleware()
   // 在store上挂载
   const store = createStore(
     reducer,
     applyMiddleware(sagaMiddleware)
   )
   
   // 传入rootSaga，运行saga
   sagaMiddleware.run(rootSaga)
   ```



参考资料：

1. https://blog.csdn.net/TurkeyCock/article/details/88390208
2. [浅析redux-saga实现原理](https://juejin.im/post/59e083c8f265da43111f3a1f)
3. [官方文档](https://redux-saga-in-chinese.js.org/)



<br>



<center>--end--</center>





<br/>