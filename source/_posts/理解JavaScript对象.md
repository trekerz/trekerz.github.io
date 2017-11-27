---
title: 理解JavaScript对象
subtitle: "对象的属性和访问"
date: 2017-11-02 15:10:54
tags: 
	- 前端基础
	- JavaScript
layout: post
author: "Trekerz"
header-img: "/blog/bg-img/null171102.jpg"
---



每个对象都是基于一个**引用类型**创建的。

ECMAScript有两种属性类型：**数据属性**、**访问器属性**。

## **1.数据属性**

#### **(1) <font color='#7485FF'>[[Configurable\]]</font>**

能否用delete删除属性、修改属性特性以及修改为访问器属性，默认true；

#### **(2) <font color='#7485FF'>[[Enumerable\]]</font>**

能否通过for-in循环返回属性，默认true；

#### **(3) <font color='#7485FF'>[[Writable\]]</font>**

能否修改属性值，默认true；

#### **(4) <font color='#7485FF'>[[Value\]]</font>**

包含这个属性的值，默认undefined。

注意1：要修改以上属性的特性值，必须用Object.defineProperty(属性所在对象，属性名字，一个描述符对象（可包含多个描述符名值对） )。如果是用此方法创建一个属性，则不赋值的话默认是false。

注意2：如果[[Writable]]被设为false后还进行赋值，非严格模式下会忽略，严格模式下报错。

注意3：一旦把[[Configurable]]设为false，就不能再把它变回可配置的了。

## **2.访问器属性**

不包含数据值，读取时会调用getter函数，写入时会调用setter函数。

#### **(1) <font color='#7485FF'>[[Configurable\]]</font>**

能否用delete删除属性、修改属性特性以及修改为访问器属性，默认true；

#### **(2) <font color='#7485FF'>[[Enumerable\]]</font>**

能否通过for-in循环返回属性，默认true；

#### **(3) <font color='#7485FF'>[[Get]]</font>**

读取时调用的函数，默认undefined；

#### **(4) <font color='#7485FF'>[[Set\]]</font>**

写入时调用的函数，默认undefined；

注意1：访问器属性不能直接定义，需用Object.defineProperty()。

注意2：get（一个指向getter函数的指针）和set函数支持IE9+，在IE8以前使用__defineGetter__()和__defineSetter__()。

## **3.同时定义多个属性**

#### **(1) <font color='#F1BE4D'>Object.defineProperty()</font>**

接收3个参数：属性所在对象、属性名字（可以是包含多个属性的一个对象）、一个描述符对象（可包含多个描述符名值对）。可以一次定义多个属性里的多个特性值。

## **4.读取属性的特性**

#### **(1) <font color='#F1BE4D'>Object.getOwnPropertyDescriptor()</font>**

接收2个参数：属性所在对象、属性名称。返回的是一个包含所有属性特性名值对的对象。

注意：在实例上调用时只取得实例本身的属性，不能取得原型上的属性（访问原型上的属性需要另外在原型对象上调用此方法）。

<br/>

<center>-&nbsp;*end*&nbsp;-</center>

<br/>