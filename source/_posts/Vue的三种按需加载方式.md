---
title: Vue的三种按需加载方式
subtitle: "常见面试题"
date: 2019-11-29 11:34:29
tags: 
	- 笔记
	- 读书笔记
	- 面试
layout: post
author: "Trekerz"
header-img: "/bing/OldTownTallinn_ZH-CN4833535739_1920x1080.jpg"
---







### 一、vue异步组件技术

- vue-router配置路由，使用vue的[异步组件](https://cn.vuejs.org/v2/guide/components.html#异步组件)技术，可以实现按需加载。但是，这种情况下一个组件生成一个js文件。

```js
{
	path: '/promisedemo',
	name: 'PromiseDemo',
	component: resolve => require(['../components/PromiseDemo'], resolve)
}
```

### 二、es提案的`import()`

* 需要[webpack](https://webpack.docschina.org/guides/code-splitting#-dynamic-imports-) > 2.4

```js
// 没有指定webpackChunkName，每个组件打包成一个js文件；
// 指定了相同的webpackChunkName，会合并打包成一个js文件
{
  path: '/importfuncdemo1',
  name: 'ImportFuncDemo1',
  component: import('../components/ImportFuncDemo1')
}
```

#### 三、webpack提供的`require.ensure()`

```js
{
  path: '/promisedemo',
  name: 'PromiseDemo',
  component: resolve => require.ensure([], () => resolve(require('../components/PromiseDemo')), 'demo')
},
```



参考资料：

https://segmentfault.com/a/1190000011519350

https://segmentfault.com/a/1190000013630936





<br/>



<center>--end--</center>



<br/>