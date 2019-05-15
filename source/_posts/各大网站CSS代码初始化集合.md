---
title: 各大网站CSS代码初始化集合
subtitle: "【笔记】CSS初始化经验"
date: 2017-07-21 20:47:09
tags: 
	- 笔记
	- 前端基础
	- CSS
	- 工具
layout: post
author: "Trekerz"
header-img: "/bing/AurovilleIndia_ZH-CN4983141175_1920x1080.jpg"
---



css代码之所以初始化，是因为能**尽量减少各浏览器之间的兼容性问题**！



### 腾讯QQ官网 样式初始化

```css
body,ol,ul,h1,h2,h3,h4,h5,h6,p,th,td,dl,dd,form,fieldset,legend,input,textarea,select{margin:0;padding:0}
body{font:12px"宋体","Arial Narrow",HELVETICA;background:#fff;-webkit-text-size-adjust:100%;}

a{color:#2d374b;text-decoration:none}
a:hover{color:#cd0200;text-decoration:underline}

em{font-style:normal}

li{list-style:none}

img{border:0;vertical-align:middle}

table{border-collapse:collapse;border-spacing:0}

p{word-wrap:break-word}
```

 

### 新浪官网 样式初始化

```CSS
body,ul,ol,li,p,h1,h2,h3,h4,h5,h6,form,fieldset,table,td,img,div{margin:0;padding:0;border:0;}

body{background:#fff;color:#333;font-size:12px; margin-top:5px;font-family:"SimSun","宋体","Arial Narrow";}

ul,ol{list-style-type:none;}

select,input,img,select{vertical-align:middle;}

a{text-decoration:none;}
a:link{color:#009;}
a:visited{color:#800080;}
a:hover,a:active,a:focus{color:#c00;text-decoration:underline;}
```



### 淘宝官网 样式初始化

```CSS
body, h1, h2, h3, h4, h5, h6, hr, p, blockquote, dl, dt, dd, ul, ol, li, pre, form, fieldset, legend, button, input, textarea, th, td { margin:0; padding:0; }

body, button, input, select, textarea { font:12px/1.5tahoma, arial, \5b8b\4f53; }

h1, h2, h3, h4, h5, h6{ font-size:100%; }

address, cite, dfn, em, var { font-style:normal; }

code, kbd, pre, samp { font-family:couriernew, courier, monospace; }

small{ font-size:12px; }

ul, ol { list-style:none; }

a { text-decoration:none; }
a:hover { text-decoration:underline; }

sup { vertical-align:text-top; }
sub{ vertical-align:text-bottom; }

legend { color:#000; }

fieldset, img { border:0; }

button, input, select, textarea { font-size:100%; }

table { border-collapse:collapse; border-spacing:0; }
```



### 网易官网 样式初始化

```CSS
html {overflow-y:scroll;}

body {margin:0; padding:29px00; font:12px"\5B8B\4F53",sans-serif;background:#ffffff;}

div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,form,fieldset,input,textarea,blockquote,p{padding:0; margin:0;}

table,td,tr,th{font-size:12px;}

li{list-style-type:none;}

img{vertical-align:top;border:0;}

ol,ul {list-style:none;}

h1,h2,h3,h4,h5,h6{font-size:12px; font-weight:normal;}

address,cite,code,em,th {font-weight:normal; font-style:normal;}
```

<br/>

<center>-&nbsp;*end*&nbsp;-</center>

<br/>