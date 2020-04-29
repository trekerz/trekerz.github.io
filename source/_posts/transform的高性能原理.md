---
title: transform的高性能原因
subtitle: "为何比margin更快？"
date: 2019-09-25 20:52:21
tags: 
	- 笔记
	- 读书笔记
layout: post
author: "Trekerz"
header-img: "/bing/OldTownTallinn_ZH-CN4833535739_1920x1080.jpg"
---







## 一、重排

DOM的变化影响到了元素的集合属性，浏览器需要进行重排，重排必然引起重绘。

1. 重拍何时发生：

	* 元素位置改变
	* 元素尺寸改变
	* 元素内容改变
	* 页面渲染初始化（无法避免）
	* 浏览器窗口尺寸改变

1. 浏览器的自动优化
  
   （1）相邻的三次重排重绘，v8会用队列缓存起来，一次完成。
   
   （2）获取布局信息（如`offsetTop`等）的操作会导致队列刷新，队列强制刷新会导致计算任务立即执行。
   
1. 绝对定位的好处

   绝对定位会让元素脱离文档流，可以有效防止重排。

## 二、渲染过程

浏览器有2个重要的执行线程：主线程、合成线程。

主线程负责JavaScript、计算CSS样式、页面布局；合成线程负责将位图绘制到屏幕上。

1. 渲染过程

   构建`DOM`树 -> 构建`CSSOM`树 -> 执行`Script` -> 构建`Render`树 -> `Layout`布局 -> `Paint`重绘 -> `Composite Layers`组合层

   上面过程中，前六个过程都是主线程负责，只有最后一个组合层是合成线程负责。

2. `transform`

   `transform`是位于`Composite Layers`组合层，而`width`、`left`、`margin`等则是位于`Layout`层，在`Layout`层发生的改变必定导致`Paint Setup and Paint` -> `Composite Layers`，所以相对而言使用`transform`实现的动画效果肯定比`left`这些更加流畅。

   另外，`transform`有GPU加速的支持。





<br/>



<center>--end--</center>



<br/>