---
title: 理解 React Hooks 的 Capture Value 特性
subtitle: "一个疑惑点"
date: 2019-12-04 20:37:21
tags: 
	- 笔记
	- 读书笔记
layout: post
author: "Trekerz"
header-img: "/bing/OldTownTallinn_ZH-CN4833535739_1920x1080.jpg"
---







## 1、状态值为什么不是最新的？

- 官方相关 issue：[Why am I seeing stale props or state inside my function?](https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state)

“这个 effects 取的值怎么不是最新的？！”这个疑惑可以说是在使用 React Hooks 时经常遇到的疑问。

在下列代码中，当你点击按钮 3s 后，alert 显示的数值却是 3s 前的 count 变量 —— 即无法获取最新的值，获取的值是过去某个时刻的（即Capture Value特性，值被捕获了）：

```react
import React, { useState, useCallback } from "react";
 import ReactDOM from "react-dom";
 
 function Example() {
   const [count, setCount] = useState(0);
 
   const handleAlertClick = useCallback(()=>{
     setTimeout(() => {
       alert('You clicked on: ' + count);
     }, 3000)
   }, [count]);
 
   return (
     <div>
       <p>You clicked {count} times</p>
       <button onClick={() => setCount(count + 1)}>
         增加 count
       </button>
       <button onClick={handleAlertClick}>
         显示 count
       </button>
     </div>
   );
 }
 const rootElement = document.getElementById("root");
 ReactDOM.render(<Example />, rootElement);
```

> 示例代码：[https://codesandbox.io/s/k5pm...](https://codesandbox.io/s/k5pmk0omx7)

**具体操作步骤**：

- 当我们先点击 显示 按钮，在 3s 后（模拟耗时任务）会出现弹层
- 在这 3s 期间快速点击 增加 count 按钮
- 3s 后看到的弹层计数仍旧为 0.

![show count](https://ws2.sinaimg.cn/large/006tKfTcly1g14p16hlgrg30fm0ajatm.gif)

## 2、解释

这是官方特意设置的机制，官方原文是：**This prevents bugs caused by the code assuming props and state don’t change**；（强行翻译一下，大概意思是：**防止因 React 认为 `props` 或者 `state` 没有变更而引起的 bug**）

为了理解官方这么设定的意图，将上面代码稍微修改一下：

- 去掉 `显示 count` 按钮
- 增加一个 `减少 count` 的按钮
- 使用 `useEffect` 代替 `useCallback`，让每次更改 count 都会弹窗

```react
...
useEffect(()=>{
    setTimeout(() => {
      alert('count: ' + count);
    }, 3000)
  }, [count]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        增加 count
      </button>
      <button onClick={() => setCount(count - 1)}>
        减少 count
      </button>
    </div>
  );
}
...
```

我们先点击一次 `增加 count`，然后再紧接着点击一次 `减少 count`：

- 如果不是按照官方的机制设置，那么我们看到的两次弹层显示的 `count` 数值都是 0 —— 很明显这不是我们想要的
- 还好实际情况不是这样，会先显示 1，然后显示 0

![calc](https://ws4.sinaimg.cn/large/006tKfTcly1g14p4sefc3g30fm0ajn0l.gif)

总结起来，这个现象其实就是文章 [精读《useEffect 完全指南》](https://segmentfault.com/a/1190000018639033) 所提及的 **Capture Value** 特性（可以自行前往原文了解更多细节）

## 3、扩展：如何获取即刻的 `count` 变量

回到原来的问题，倔强如我，**我就是想要在 3s 后获取的是此时此刻的 `count` 变量，而不是我 3s 前点击时的 `count` 值**，该怎么操作？

官方给出的解决方案是，**每次改变 `count` 的时候，将其放在 [ref](https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables) 类型的变量里即可**。

**（所有的Hooks API都具有capture values特性，除了`useRef`）**

修改一下原来的代码：

```react
  const countRef = useRef(null);
  const handleAlertClick = useCallback(
    () => {
      setTimeout(() => {
        alert("You clicked on: " + countRef.current);
      }, 3000);
    },
    [count]
  );

  return (
    <div>
      <p>You clicked {count} times</p>
      <button
        onClick={() => {
          countRef.current = count + 1;
          setCount(count + 1);
        }}
      >
        增加 count
      </button>
      <button onClick={handleAlertClick}>显示 count</button>
    </div>
  );
```

更改过后的代码运行后，`3s` 后 alert 显示的 `count` 变量就是你页面上所见到的样子了：

![count](https://ws4.sinaimg.cn/large/006tKfTcly1g14pl1a881g30fm0ajwhh.gif)

> ref 类型的变量通常是用来存储 DOM 元素引用，但在 react hooks 中，它可以存放任何可变数据，就好比类实例属性一样，具体参考 [Is there something like instance variables?](https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables)

这等操作，其实就是借助 `ref` 类型变量绕过 **Capture Value** 特性来达到目的。

## 4、总结

援引文章 [精读《useEffect 完全指南》](https://segmentfault.com/a/1190000018639033) 中对 Capture Value 概念的解释：**每次 Render 的内容都会形成一个快照并保留下来，因此当状态变更而 Rerender 时，就形成了 N 个 Render 状态，而每个 Render 状态都拥有自己固定不变的 Props 与 State**。

通过这个示例，相信会比较容易地理解 **Capture Value** 特性，并如何使用 `ref` 来暂时绕过它。在知道并理解这个特性后，有助于进一步熟悉了 React Hooks 的运行机制，减少掉坑的次数。







<br/>



<center>--end--</center>



<br/>