---
title: JS中用for...in...遍历数组遇到的坑
subtitle: "尾部多出函数项"
date: 2017-11-27 23:14:30
tags: 
	- JavaScript
	- 问题与解决
layout: post
author: "Trekerz"
header-img: "/bing/PineLogSP_ZH-CN1105763820_1920x1080.jpg"
---



今天在用JS写数组去重算法时候遇到一个跟`for...in...`有关的问题。函数原本是这么写的：

```js
Array.prototype.unique = function (){
    var arr = this;
    var obj = {};
    var data = [];
    for(var i in arr){  // 这里出了问题
        if(!obj[arr[i]]){
            obj[arr[i]] = true;
            data.push(arr[i]);
        }
    }
    return data;
}

// 用例
var arr = [1,2,34,42,2,3,5];
console.log(arr.unique());
```

这个算法是利用哈希表记录数组从而进行去重，中间`for...in...`的功能就是为了遍历数组，以便一个个记录在哈希表中。

从代码来看，正常运行结果应该会是`[1,2,34,42,3,5]`，但最终控制台输出的数组却在末尾多了一个函数项：

![img](1.png)

随后查阅了网上这种问题的解决办法，看了几篇博文后归纳出原因如下：在对Array进行扩充的场景中，数组处在原型环境中，使用`for...in...`遍历的话会多遍历出一个函数自身项，这个项表示的是函数本身，这是JS的特点。如果函数不是处在原型扩充的场景中，则不会发生这个问题，例如把上述代码改成这样的话就不会多出一项：

```js
function unique(arr){
    var obj = {};
    var data = [];
    for(var i in arr){  // 现在没问题了
        if(!obj[arr[i]]){
            obj[arr[i]] = true;
            data.push(arr[i]);
        }
    }
    return data;
}

// 用例
var arr = [1,2,34,42,2,3,5];
console.log(unique(arr));
```

那么现在这个问题就可以有两个解决方案：

1. 把函数写成像上面一样的函数声明，这样用`for...in...`进行遍历就不会多出一项，但是这种写法不符合一般项目规范，拿到别人的环境中跑有可能会出现问题。
2. 不要在数组中使用`for...in...`写法，老老实实写成一般的遍历形式，这样无论在什么场景中都不会出错：

```js
for(var i = 0; i<arr.length; i++)
```

个人更偏向于第二种方案，毕竟使用第一种方案总得去注意适用场景。

<br/>

<center>-&nbsp;*end*&nbsp;-</center>

<br/>