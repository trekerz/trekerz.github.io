---
title: Generator笔记
subtitle: "两个协议"
date: 2019-11-25 12:07:51
tags: 
	- 笔记
	- 前端基础
layout: post
author: "Trekerz"
header-img: "/bing/YukonEmerald_ZH-CN1893750172_1920x1080.jpg"
---





## 一、迭代协议

1. ### 两个协议

   - 可迭代协议
   - 迭代器协议

2. ### 可迭代协议

   允许Js对象去定义或定制迭代行为。（可迭代的判断标准）

   特点：可以使用`for...of...`、`yield*`、解构、扩展运算符来进行迭代

   ##### (1) ES6内置的可迭代类型

   `Array`、`Map`、`Set`

   可调用`.keys()`、`.values()`、`.entries()`获取内置迭代器

   ##### (2) 自定义迭代对象

   原型上加一个`@iterator`方法，即名字是`Symbol.iterator`的属性。

   ##### (3) `Symbol.iterator`

   返回一个对象的无参函数。则被返回的对象符合迭代器协议。

3. ### 迭代器协议

   定义了一种标准的方式来产生一个有限或无限序列的值。（迭代的实现）

   ##### (1) 条件

   实现一个`next()`方法，返回一个对象的无参函数，被返回对象拥有两个属性：

   - `done`
   - `value`

4. ### 几个名词之间的关系

   ##### (1) 囊括范围

   可迭代对象 > 迭代器 > 生成器

   ##### (2) 生成器Generator

   是一种返回迭代器的函数，生成器返回的对象是一个携带`[Symbol.iterator]`属性和`next()`方法的对象，所以这个对象既是迭代器，又是可迭代对象。

   ##### (3) ES6内置可迭代对象

   这些可迭代对象都内置了默认的迭代器。

## 二、Generator

1. Generator可以理解为一个状态机，内部封装了很多状态，**返回一个迭代器`Iterator`对象**；
2. 迭代器`Iterator`对象：定义标准方式产生一个有限或无限序列值，迭代器有`next()`方法；
3. 多次返回可以被`next`多次调用，最大特点是可以控制执行顺序

> `yield`和`yield*`的区别：
>
> `yield*`接收一个可迭代对象，称之为委托迭代，相当于多个`yield`合并到一起。

## 三、PolyFill

1. ### 原理图

   [链接](https://juejin.im/post/5df83b93f265da33f8652ccc#heading-24)

2. ### 代码

   ```js
   function createIterator(items) {
     let i = 0
     return {
       next() {
         let done = i >= items.length
         let value = !done ? items[i++] : void 0
         return { done, value }
       },
       [Symbol.iterator]: function() {
         return this
       }
     }
   }
   let iterator = createIterator([1, 2, 3])
   ...iterator // 1, 2, 3
   ```



<br/>



<center>--end--</center>



<br/>