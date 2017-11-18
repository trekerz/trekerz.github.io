---
title: BOM总结
subtitle: "BOM知识点"
date: 2017-11-02 23:17:17
tags: 
	- 前端基础
	- JavaScript
layout: post
author: "Trekerz"
header-img: "171102.jpg"
---



## **一、window对象**

#### **1. 框架中window**

##### **(1) name属性**

window的属性，即框架frame的名字。

##### **(2) top对象**

指向最外层框架。

##### **(3) parent对象**

指向直接上层框架。

##### **(4) self对象**

始终指向window。

#### **2. window的位置**

##### **(1) screenLeft、screenTop（IE、Opera、Safari、Chrome）**

窗口相对于屏幕左边和上边的位置。

##### **(2) screenX、screenY（FireFox、Safari、Chrome）**

同上。

注意：在IE、Opera中，screenLeft和screenY把工具栏也考虑了，所以最大化时不是0；而Safari、Chrome、FireFox最大化则为0。

##### **(3) moveTo()、moveBy()**

接收2个参数：moveTo是新位置的坐标值，moveBy是水平和垂直要移动的像素数。

#### **3. window的大小**

##### **(1) innerWidth、innerHeight、outerWidth、outerHeight（≥IE8才有）**

注意：在Chrome中，inner和outer值相同；其它outer指整个浏览器窗口，inner指除去边框后。

##### **(2)document.documentElement.clientWidth、document.documentElement.clientHeight、document.body.clientWidth、document.body.clientHeight（≤IE8也有）**

注意：在IE6的标准模式下用documentElement，混杂模式下用body；在Chrome下则都可以。

##### **(3) resizeTo()、resizeBy()**

接收2个参数：resizeTo是新宽度和新高度，moveBy是宽度差和高度差。

#### **4. 导航和打开窗口**

##### **(1) open()**

接收4个参数：URL（必选）、窗口目标（已有窗口或框架名称）、一个特性字符串（新窗口特性）、一个表示新页面是否取代历史记录中当前加载页面的布尔值。返回一个指向新窗口的引用。

##### **(2) close()**

仅适用于通过window.open()打开的弹出窗口。

##### **(3) closed属性、opener属性**

#### **5. 间歇调用和超时调用**

##### **(1) setTimeout()、setInterval ()**

接收2个参数：要执行的代码、以毫秒表示的时间。JavaScript会有一个任务队列，把添加进来的任务按添加顺序执行。

最佳实践：一般用超时调用来模拟间歇调用，因为间歇调用可能会导致后一个调用在前一个调用结束前启动。

##### **(2) clearTimeout ()、clearInterval()**

#### **6. 系统对话框**

##### **(1) alert()**

##### **(2) confirm()**

##### **(3) prompt()**

注意：以上三个方法都是同步、模态的，调用时代码会暂停执行。

##### **(4) find()**

##### **(5) print()**

## **二、location对象**

注意：location既是window的对象又是document的对象，window.location和document.location引用的是同一个对象。

#### **1. 属性**

| 8个属性     |
| -------- |
| hash     |
| host     |
| hostname |
| href     |
| pathname |
| port     |
| protocol |
| search   |

注意：这些属性可写，每次修改后页面都会重新加载。

#### **2. 位置操作**

##### **(1) assign()**

改变窗口的网址（即位置）。

##### **(2) replace()**

同assign()，但去到新的位置后无法后退（后退按钮失效）。

##### **(3) reload()**

重新加载当前页面。

注意：如果要强制从服务器重新加载（而不是从缓存），则要加一个true参数。

## **三、navigator对象**

IE中有window.clientInformation，Opera有window.opera，但window.navigator是通用的。

#### **1. 属性**

略。（各种属性和方法）

#### **2. 检测插件**

##### **(1) navigator.plugins数组（非IE浏览器）**

数组每一项都包含以下属性：name、description、filename、length（插件所处理的MIME类型数量）。

注意：IE浏览器则是用ActiveXObject类型（COM对象）来表示插件的，检测IE插件就是new一个该类型并传入要检测的插件名称，看有没有报错来确定插件存不存在。

#### **3. 注册处理程序**

以下两个方法可以让站点指明它可以处理特定类型的信息。

##### **(1) registerContentHandler()**

接收3个参数：要处理的MIME类型、可以处理该MIME类型的页面的URL以及应用程序的名称。

##### **(2) registerProtocolHandler()**

接收3个参数：要处理的协议（mailto、ftp等）、处理该协议的页面的URL以及应用程序的名称。

## **四、screen对象**

只用来表明客户端的能力，包括浏览器窗口外部的显示器信息（像素宽高等）。

#### **1. 属性和方法**

略。

## **五、history对象**

#### **1. 属性和方法**

##### **(1) go()**

接收1个参数：数字或字符串，表示在历史记录中前进或后退的步数或最近的某个页面。

##### **(2) back()、forward()**

注意：这两个方法不接收参数，只能进或退1页。

##### **(3) length属性**

历史记录的数量。

<br/>

<center>-&nbsp;*end*&nbsp;-</center>

<br/>