---
title: JS设计模式3-策略模式
subtitle: "表单的多重验证"
date: 2017-08-25 22:37:01
tags: 
	- JS设计模式
	- JavaScript
layout: post
author: "Trekerz"
header-img: "/bing/CoastalFog_ZH-CN8104406852_1920x1080.jpg"
---

# **策略模式**

**定义**：定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换。

**举例**：表单效验（是否为空、长度、手机号、邮箱等等）    

计算年终奖（工资、效绩）下面以年终将做说明：比如公司的年终奖是根据员工的工资和绩效来考核的，绩效为A的人，年终奖为工资的4倍，绩效为B的人，年终奖为工资的3倍，绩效为C的人，年终奖为工资的2倍；

```js
// 一组策略类封装具体的算法
const Bouns = {
	A (salary){
		return salary * 4;
	},
	B (salary){
		return salary * 3;
	},
	C (salary){
		return salary * 2;
	}
};
Object.freeze(Bouns);

/*
* 计算年终奖 环境类Context
* @param {String} A 效绩等级
* @param {Number} 10000 每月工资
* @returns {Number} 40000 年终奖
*/
const calculateBouns = function (type, salary){
	return Bouns[type](salary);
};

// 测试年终奖计算方式
const demo1 = calculateBouns('A', 10000);
const demo2 = calculateBouns('B', 80000);
console.log(demo1, demo2); // 40000, 240000
```

**说明**：
策略模式指的是 定义一系列的算法，把它们一个个封装起来，将不变的部分和变化的部分隔开，
实际就是将算法的使用和实现分离出来；算法的使用方式是不变的，都是根据某个算法取得计算后的奖金数，
而算法的实现是根据绩效对应不同的绩效规则；
一个基于策略模式的程序至少由2部分组成，第一个部分是一组**策略类**，策略类封装了具体的算法，
并负责具体的计算过程。第二个部分是**环境类**Context，该Context接收客户端的请求，
随后把请求委托给某一个策略类。
复合开放-封闭原则，可变的部分为策略类（一组算法），不变的部分为执行具体算法的方式。

# **表单验证**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>test</title>
    <style>
        
    </style>
</head>
<body>

    <form id='registerForm'>
        <p>用户名：<input type="text" name="userName"></p>
        <input type="submit" value="提交">
    </form>

    <script>
        // 策略类
        const stragtegys = {
            isNotEmpty (value,errorMsg){
                if (value === ''){
                    return errorMsg;
                }
            },
            minLength (value,length,errorMsg){
                if (value.length < length){
                    return errorMsg;
                }
            }
        };
        Object.freeze(stragtegys);

        // 保存校验规则
        var Validator = function () {
            this.cache = [];
        }

        // 添加策略功能
        Validator.prototype.add = function (dom,rules){
            var self = this;
            for (var i = 0; i < rules.length; i++) {
                var rule = rules[i];
                (function (rule) {
                    var stragtegyAry = rule.stragtegy.split(":");
                    var errorMsg = rule.errorMsg;
                    self.cache.push(function () {
                        var stragtegy = stragtegyAry.shift();
                        stragtegyAry.unshift(dom.value);
                        stragtegyAry.push(errorMsg);
                        return stragtegys[stragtegy].apply(dom,stragtegyAry);
                    });
                })(rule);
            }
        };

        // 校验开始功能
        Validator.prototype.start = function () {
            for(var i =0; i < this.cache.length; i++){
                var validatorFunc = this.cache[i];
                var msg = validatorFunc(); //开始校验
                if(msg){
                    return msg; /* 只要遇到一个规则不通过就返回，如果需要返回所有不通过的msg，则需在这里用数组把它们存放起来。 */
                }
            }
        };

        // 执行
        var registerForm = document.getElementById('registerForm');
        var validateFunc = function () {
            var validator = new Validator();
            validator.add(registerForm.userName,[
                {stragtegy:'isNotEmpty',errorMsg:'用户名不能为空'},
                {stragtegy:'minLength:6',errorMsg:'用户名长度不能小于6'}
                ]
            );
            var errorMsg = validator.start();
            return errorMsg;
        }

        registerForm.onsubmit = function () {
            var errorMsg = validateFunc();
            if(errorMsg){
                alert(errorMsg);
                return false;
            }
        }

    </script>
</body>
</html>
```

**说明**：此处代码来源于--腾讯.曾探的《javascript设计模式》，这能很好的说明策略模式的用途。

> 参考文档：
> [理解javascript中的策略模式](http://www.cnblogs.com/tugenhua0707/p/4722696.html)

<br/>

<center>-&nbsp;*end*&nbsp;-</center>

<br/>