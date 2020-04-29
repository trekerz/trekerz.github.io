---
title: CSS选择器 - 性能的探究及提升
subtitle: "性能探究"
date: 2019-09-26 19:50:19
tags: 
	- 笔记
	- 读书笔记
layout: post
author: "Trekerz"
header-img: "/bing/OldTownTallinn_ZH-CN4833535739_1920x1080.jpg"
---







## 一. CSS选择器性能是如何消耗的？

**工作原理**：浏览器利用CSS选择器来匹配文档元素。

**工作流程**：例如 #hd .nav > a { padding-left: 15px }

　　1.在文档所有元素中寻找所有的 a 标签。

　　2.在1的结果中寻找其父元素的类名为“.nav”的元素。

　　3.在2的结果中寻找其父辈元素的ID为“hd”的元素。

　　4.在3的结果中增加样式。

 

## **二. 分析怎么提升CSS选择器的性能?**

在工作流程中可以看出有两个方面可以提升性能：寻找的效率和寻找的次数

**效率：**选择器的搜索个数，个数越少性能越好。

**次数：**选择器的层数，层数越少性能越好。

 

## 三. 提升CSS选择器性能的方式

方式一（**减少搜索个数**）：选择效率高的选择器，参考如下建议多用类选择器少用标签选择器。

CSS选择器搜索个数从少到多的排序：
　　id选择器（#myid）
　　类选择器（.myclassname）
　　标签选择器（div,h1,p）
　　相邻选择器（h1+p）
　　子选择器（ul > li）
　　后代选择器（li a）
　　通配符选择器（*）
　　属性选择器（a[rel="external"]）
　　伪类选择器（a:hover, li:nth-child）

 

方式二（**减少层数**）：使用BEM（block_element-modifier）的命名方式。

BEM：块（block）、元素（element）、修饰符（modifier）

例如：

```css
.hd{}

.hd_nav{}

.hd_nav_a{}

.hd_nav_a-link{}

.hd_nav_a-visited{}
```

 

方式三（**减少层数**）：使用面向属性的命名方式。

**面向属性**：以“样式属性的功能”来给选择器命名。

例如：

```css
.l{ float: left }

.tc{ text-align:center; }

.auto{ margin-left:auto; margin-right:auto; }
```



<br/>



<center>--end--</center>



<br/>