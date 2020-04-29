---
title: Javascript中的this梳理
subtitle: "关键知识点"
date: 2019-05-21 21:39:10
tags: 
	- 笔记
	- 读书笔记
layout: post
author: "Trekerz"
header-img: "/bing/OldTownTallinn_ZH-CN4833535739_1920x1080.jpg"
---







> `this`算是`javascript`中又爱又恨的东西了. 其实`this`的概念并没有多少, 本文将把`this`的概念用示例梳理一次.

# 最基本的`this`概念

## 指向`globe`的`this`

```js
//浏览器内 落单的this, 普通调用的函数中的this 都指向windows对像;
this === window; //true
(function(){ return this; })() === window; //true

function A(){
	return this;
}
A() === window; //true
// node 中则指向 globe
```

## 对像属性函数中的`this`指向父对像

```js
function This(){
	return this;
};
var obj = {
	A: function(){return this},
	B: This,
	C: {
		CA: This
	}
};
console.log(This() === windows); //true
console.log(obj.A() === obj); //true
console.log(obj.B() === obj); //true
console.log(obj.C.CA() === obj); //false
console.log(obj.C.CA() === obj.C); //true
```

## 构建函数中的`this`指向实例化对像

```javascript
function C(name){
	this.name = name;
}
var a = new C('a');
console.log(a.name); // a;

//ES6
class C1{
	constructor(name){
		this.name = name;
	}
}
var b = new C1('b');
console.log(b.name); // b

//父类构建函数中的`this`也指向实例化的对像
class C2 extends C1{
	constructor(name,age){
		super(name);
		this.age = age;
	}
}
var c = new C2('c',10);
console.log(c.name); // c
console.log(c.age); // 10
```

# `call`, `apply` 改变this指向

```js
function D(){
	console.log('D:' + this);
}
var Obj = {
	name : 'obj',
	show : function(){
		console.log('name:' + this.name);
	}
}

//call , apply 会执行函数并改变this的指向
D.call('call'); // D:call
D.apply('apply'); // D:apply
Obj.show(); // name:obj
Obj.show.call({name:'call'}); // name:call
Obj.show.apply({name:'apply'}); // name:apply
```

# `bind` 方法会生成一个绑定了this的新函数

```js
var D = function(){
	console.log('D:' + this);
}

var DBind = D.bind('bind');
DBind(); // D:bind

// call,apply不能改变this指向, 再使用bind定也无法改变
DBind.call('call'); // D:bind
DBind.apply('apply'); // D:bind
DBind.bind('bind1')(); // D:bind

//但不会改变 new 运算符执函时 this 的指向.
new DBind(); // D:[object Object]
```

# 箭头函数 this指向不变

```js
//箭头函数中的this指上下文的this, 无法用 call/apply 和 bind改变;
function getShow(){
	return ()=>{
		console.log("this:" + this);
	};
}
var show = getShow.call('a');
show(); // this:a
show.call('b'); // this:a
show.apply('c'); // this:a
show.bind('d')(); // this:a
```

# 实用 示例

1. 类型判断

   ```js
   function getType(obj){
   	return Object.prototype.toString.call(obj).slice(8,-1).toLowerCase();
   };
   ```

2. arguments 转 array

   ```js
   function fn(){
   	var args = [].slice.call(arguments,0)
   }
   ```

3. 练习题

   ```js
   var a = () => {
     this.b = 2
     console.log('1', this)
     return function () {
       this.a = 1
       console.log('2', this)
     }
   }
   var c = function() {
     this.q = '12'
     this.w = () => {
       this.b = 2
       console.log('1', this)
       return function () {
         this.a = 1
         console.log('2', this)
       }
     }
   	console.log('3', this)
   }
   var e = new c()
   console.log('4', e)
   e.w()()
   // 3 {q: "12", w: ƒ}
   // 4 {q: "12", w: ƒ}
   // 1 {q: "12", w: ƒ, b: 2}
   // 2 Window
   ```

   





<br/>



<center>--end--</center>



<br/>