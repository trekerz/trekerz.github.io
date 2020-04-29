---
title: Vue双向绑定解析
subtitle: "聊聊来龙去脉"
date: 2020-02-15 19:50:17
tags: 
	- 笔记
	- 读书笔记
layout: post
author: "Trekerz"
header-img: "/bing/OldTownTallinn_ZH-CN4833535739_1920x1080.jpg"
---








### 一、准备知识

1. `[].slice.call(list)`：将伪数组转换为数组

2. `node.nodeType`：得到节点类型

   `Node`接口是所有节点类型的父类，节点从这个接口继承了属性和方法。

3. `Object.defineProperty(obj, propertyName, descriptor)`：给对象添加属性（指定描述符）

   - 属性描述符
     - 数据描述符（4）

- 访问描述符（2）

1. `Object.keys()`：得到对象**自身**可枚举属性组成的数组
2. `obj.hasOwnProperty(prop)`：判断`props`是否是`obj`的**自身**属性
3. `DocumentFragment`：文档碎片（内存中保存n个element的容器对象，可用于高效批量更新多个节点）

### 二、数据代理

`Object.defineProperty`

1. ##### 举例

   已知`a.b.xxx`，实现`a.xxx`，即`a`直接访问`xxx`

   ```js
   // 举例
   const vm = new Vue({
     el: '#app',
     data: {
       name: 'zjf'
     }
   })
   console.log(vm.name) // zjf
   ```

### 三、模板解析

1. ##### 去除`el`元素中所有子节点保存到一个`fragment`对象中

   ```js
   // node2fragment(el)
   
   // 1. 创建空的fragment
   var fragment = document.createDocumentFragment(),
       child
   
   // 2. 将el中所有子节点转移到fragment
   while (child = el.firstChild) {
     fragment.appendChild(child)
   }
   ```

2. ##### 编译`fragment`中所有层次子节点（递归）

   - 对`{ { } }`表达式文本节点进行解析：使用正则解析，替换文本
   - 对元素节点的指令属性进行解析
     - 事件指令：拆解指令类型和指令值，调用`node.addEventListener`
     - 一般指令：拆解指令类型和指令值，根据指令类型确定要操作的属性

   ```js
   // compileElement(fragment)
   
   // 1. 去除最外层所有子节点
   var childNodes = el.childNodes,
       // compile对象
       me = this
   
   // 2. 遍历所有子节点
   [].slice.call(childNodes).forEach(function(node) => {
     var text = node.textContent
   	var reg = /\{\{(.*)\}\}/
   
   	if (me.isElementNode(node)) {
   	  // element节点
       me.compile(node)
     } else if (me.isTextNode(node) && reg.test(text)) {
       // text节点
       me.compileText(node, RegExp.$1)
     }
   
   	// 递归遍历子节点
     if (node.childNodes && node.childNodes.length) {
       me.compileElement(node)
     }
   })
   ```

3. ##### 将编译好的`fragment`添加到页面的`el`元素中

### 四、数据绑定

1. ##### 解释

   一旦更新了`data`中的某个属性数据，所有界面上直接使用或间接使用了此属性的节点都会更新。

2. ##### 数据劫持

   用来实现数据绑定的一种技术（`Object.defineProperty`）

3. ##### 过程

   `vm.name = 'a'` --> `data`中的`name`属性值变化 --> `name`的`set()`调用 --> `dep` --> 相关的所有`watcher` --> `cb()` --> `updater`

4. ##### 四个重要对象

   ###### Dep：

   (1) 实例创建的时机：初始化时给`data`的属性进行数据劫持时创建的；

   (2) 实例个数：与`data`中的属性一一对应；

   (3) 实例结构：

   `id`：标识

   `subs`：n个相关的`watcher`的容器

   ###### Watcher：

   (1) 实例创建的时机：初始化时解析模板语法时创建的；

   (2) 实例个数：与模板中表达式（不包含事件指令）一一对应；

   (3) 实例结构：

   * `cb`：用于界面更新的回调
   * `vm`：`vm`
   * `exp`：对应的表达式
   * `depIds`：相关的n个`dep`的容器对象
   * `value`：当前表达式对应的`value`
   
   ###### Dep与Watcher之间的关系（n:n的关系）
   
   * `data`属性 --> `Dep` --> n个`watcher`（场景：模板中有多个表达式使用了此属性（`{ { a } } v-text="a"`））
   
   * 表达式 --> `Watcher` --> n个`dep`（场景：多层表达式（`a.b.c`））
   
   ###### Dep与Watcher如何建立关系
   
   (1) `Observer`遍历`data`属性`value`
   
   * 每个`value`里创建一个与`value`对应的`dep`
   
   * 在`value`的`get`操作中调用`dep`的`depend`方法去绑定依赖
   
   (2) 每个模板表达式建立与表达式对应的`watcher`
   
   * `watcher`建立时会根据表达式值去取属性值`value`
   
   * 将`Dep`的静态属性`target`暂时置为本`watcher`
   
   * 触发一次`value`的`get`操作
   
   * `value`的`get`操作执行`dep`的`depend`方法，进而触发`watcher`和`dep`互相绑定





<br/>



<center>--end--</center>



<br/>