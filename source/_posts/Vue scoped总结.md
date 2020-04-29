---
title: Vue scoped总结
subtitle: "奇巧淫技"
date: 2019-11-04 23:40:28
tags: 
	- 笔记
	- 读书笔记
layout: post
author: "Trekerz"
header-img: "/bing/OldTownTallinn_ZH-CN4833535739_1920x1080.jpg"
---







## 一、scoped的实现原理

Vue中的scoped属性的效果主要是通过PostCss实现的。以下是转译前的代码:

```vue
<style scoped lang="less">
    .example{
        color:red;
    }
</style>
<template>
    <div class="example">scoped测试案例</div>
</template>
```

转译后:

```vue
.example[data-v-5558831a] {
  color: red;
}
<template>
    <div class="example" data-v-5558831a>scoped测试案例</div>
</template>
```

既：PostCSS给一个组件中的所有dom添加了一个独一无二的动态属性，给css选择器额外添加一个对应的属性选择器，来选择组件中的dom,这种做法使得样式只作用于含有该属性的dom元素(组件内部的dom)。

> 总结：scoped的渲染规则：

1. 给HTML的dom节点添加一个不重复的data属性(例如: data-v-5558831a)来唯一标识这个dom 元素；
2. 在每句css选择器的末尾(编译后生成的css语句)加一个当前组件的data属性选择器(例如：[data-v-5558831a])来私有化样式；
3. 如果组件内部包含有其他组件，只会给其他组件的最外层标签加上当前组件的`data`属性。

## 二、scoped穿透

##### `scoped`的局限性（[参考资料](https://www.cnblogs.com/karthuslorin/p/9038854.html)）

* 当在组件中**动态插入**一段html后，此时被插入的html结构都不会被打上`scope`属性；

* 引用了第三方组件，需要在组件中局部修改第三方组件的样式，而又不想去除`scoped`属性造成组件之间的样式污染。

##### 解决办法：穿透`scope`

（1）通过 `>>>` 或`/deep/`（css深度选择器）可以使得在使用`scoped`属性的情况下，穿透`scoped`，修改其他组件的值；

```css
/* stylus的样式穿透 使用>>> */
外层 >>> 第三方组件 {
  样式
}
.wrapper >>> .swiper-pagination-bullet-active {
    background: #fff
}

/* sass和less的样式穿透 使用/deep/ */   
外层 /deep/ 第三方组件 {
  样式
}
.wrapper /deep/ .swiper-pagination-bullet-active{
  background: #fff;
}
```

（2）写一个不带`scope`的style标签和一个带`scope`的style标签

##### 评价

以上两种方法，穿透方法实际上违反了scoped属性的意义，又使得代码太过于难看。

推荐通过在**外层dom上添加唯一的`class`**来区分不同组件，这种方法既实现了类似于scoped的效果，又方便修改各种第三方组件的样式，代码看起来也相对舒适。

## 三、在组件中修改第三方组件库样式的其它方法

上面我们介绍了在使用scoped 属性时，通过scopd穿透的方式修改引入第三方组件库样式的方法，下面我们介绍其它方式来修改引入第三方组件库的样式

> 在vue组件中不使用scoped属性

------

> 在vue组建中使用两个style标签，一个加上scoped属性，一个不加scoped属性，把需要覆盖的css样式写在不加scoped属性的style标签里

------

> 建立一个reset.css(基础全局样式)文件，里面写覆盖的css样式，在入口文件main.js 中引入







<br/>



<center>--end--</center>



<br/>