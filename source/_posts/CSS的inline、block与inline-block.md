---
title: CSS的inline、block与inline-block
subtitle: "三角关系"
date: 2018-10-11 12:47:29
tags: 
	- 笔记
	- 读书笔记
layout: post
author: "Trekerz"
header-img: "/bing/OldTownTallinn_ZH-CN4833535739_1920x1080.jpg"
---







## 一、基本知识点

行内元素一般是内容的容器，而块级元素一般是其他容器的容器，行内元素适合显示具体内容，而块级元素适合做布局。

**块级元素(block)：**独占一行，对宽高的属性值生效；如果不给宽度，块级元素就默认为浏览器的宽度，即就是100%宽。

**行内元素(inline)：**可以多个标签存在一行，对宽高属性值不生效，完全靠内容撑开宽高。

**行内块元素(inline-block)：**结合的行内和块级的优点，既可以设置长宽，可以让padding和margin生效，又可以和其他行内元素并排。

## 二、行内元素与块状元素之间的转换

1. **float:** 当把行内元素设置完float:left/right后，该行内元素的display属性会被赋予block值，且拥有浮动特性。行内元素去除了之间的莫名空白。

2. **position:** 当为行内元素进行定位时，position:absolute与position:fixed.都会使得原先的行内元素变为块级元素。

3. **display:**

   1、块级标签转换为行内标签：display:inline;

   2、行内标签转换为块级标签：display:block;

   3、转换为行内块标签：display：inline-block;

## 三、特性

1. text-align属性对块级元素起作用，对行内元素不起作用
2. 块级元素独自占一行且宽度会占满父元素宽度，行内元素不会独占一行，相邻行内元素可以排在同一行。
3. 块级元素可以设置weith和height，行内元素设置width和height无效，而且块级元素即使设置宽度也还是独占一行。注意但块级元素当没有明确指定 width 和 height 值时，块级元素尺寸由内容确定，当指定了 width 和 height 的值时，内容超出块级元素的尺寸就会溢出，这时块级元素要呈现什么行为要看其 overflow 的值（visible,hidden,overflow,scroll)
4. 块级元素可以设置margin和padding属性，行内元素水平方向的margin和padding如margin-left、padding-right可以产生边距效果，但是竖直方向的margin-top、margin-bottom不起作用。
5. 行内元素的padding-top和padding-bottom会起作用，不过就像脱离了标准流一样（即padding-left和padding-right的层级比其他元素高），并不会占据位置，并且还把其他元素给盖住了。但是，假如inline的元素没有内容，“padding-top、padding-bottom"将不起作用。如果想要起作用，只需要给padding-left或者padding-right设置一个值，或者当inline的元素有内容时就会起作用。
6. 当inline-block碰到同类（inline，inline-block)时，谁的上下margin、paddin或line-height大，就听谁的。除非它是inline，因为inline的margin是不起作用的。且inline的padding是不占空间的。
7. inline和inline-block会引起间距的空格





参考资料：

[CSS的inline、block与inline-block](https://segmentfault.com/a/1190000015202771)





<br/>



<center>--end--</center>



<br/>