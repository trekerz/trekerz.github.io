---
title: Cucumber/Behave实践总结
subtitle: "讲讲测试"
date: 2019-08-22 20:57:10
tags: 
	- 笔记
	- 读书笔记
	- 测试
layout: post
author: "Trekerz"
header-img: "/bing/OldTownTallinn_ZH-CN4833535739_1920x1080.jpg"
---







[Cucumber](https://cucumber.io/docs) 是一个基于行为驱动（[Behaviour-Driven Development / BDD](https://cucumber.io/docs/guides/bdd-tutorial/)）的测试框架，它以「行为驱动测试」为理论基础，用一种运营、产品、开发、测试都能明白的语法（[`Gherkin`](https://cucumber.io/docs/gherkin/reference/)）来描述一个测试过程。

Cucumber兼容了多种开发语言，主要有Java、JavaScript、Kotlin、C++、PHP、Python；而本文要讲的 [Behave](https://behave.readthedocs.io/en/latest/) 就是 Cucumber 的 Python 版实践。

## 🥒  安装Behave

Behave的安装有两种方式。

第一种是通过 `pip` 命令直接安装依赖包：

```bash
pip install behave
```

这种方式笔者在尝试的时候会报找不到资源的错误，估计是默认源的问题。

第二种是通过 github 下载后安装：

```shell
pip install git+https://github.com/behave/behave
```

这种方式是在 github 下载 release 包之后自动进行本地安装。

安装完成之后，在命令行输入 python 或 python3 进入 python 环境，输入 `import behave`，没有报错则表示成功安装。

## 🥒  基本概念

注：此部分转载自简书 [python behave学习笔记 - 基础](https://www.jianshu.com/p/0f52b13f2779)

1. ### 目录结构

   Behave 要被执行，需要运行在满足下面两种情况的目录下：

   * 有 `feature files` 。这个 `feature files` 可以试由非技术人员编写；

   * 一个`“steps”`目录，`steps` 里面包含 `python step implementation` 。

   还可以添加一些 `environmental controls` 。 比如：

   ```python
   before
   after
   scenarios
   features
   ```

   #### 最小目录

   一个可执行的最小 `feature` 目录为

   ```wiki
   features/
       - everything.feature
       - steps/
   				- steps.py
   ```

   #### 复杂目录

   一个更复杂的目录为

   ```wiki
   features/
   		- signup.feature
   		- login.feature
   		- account_details.feature
   		- environment.py
   		- steps/
   				- website.py
   				- utils.py
   ```

   按照项目的不同模块有不同的 `feature files` ，也有 `environment.py` 这样的环境配置文件，在 `steps` 里面则是测试代码。

2. ### 什么是 feature files

   `feature file` 是指一个通常命名为 `**.feature` 的纯文本文件（UTF-8）。

   这个文件里面包含了用自然语言（`Gherkin`）描述的系统的功能特征。这些功能特征是具有代表性的期望结果。

   一个典型的 `feature files` 如下：

   ```feature
   Feature: showing off behave
   
     Scenario: run a simple test
        Given we have behave installed
         When we implement a test
         Then behave will test it for us!
   ```

   篇幅原因，详情请看 第二部分 开头的注释。

3. ### 关于测试代码

   测试代码实现在 python 文件中，这些 python 文件都需要被放入到 `steps` 文件夹下。

   测试代码的文件名并不需要与feature文件的名称一致。

   `Steps` 是通过修饰符来进行匹配的。

   在测试代码中，修饰符接受一串字符串，这串字符串要和 `feature` 文件中 `scenario` 使用的字符串一样。

   篇幅原因，详情请看 第二部分 开头的注释。

## 🥒  使用Behave

Behave的官网提供了一个 [demo](https://behave.readthedocs.io/en/latest/tutorial.html) 供初学者使用，我们来把它搭建起来。

1. 创建 Python 工程

   * 打开 PyCharm ，创建工程，编译器版本默认是 python3.6 ；

2. 编写 `feature` 文件

   * 创建文件夹 `/features` ；

   * 进入 `/features` ，新建一个 `.feature` 文件，命名为 `tutorial.feature` ，输入以下代码：

     ```feature
     Feature: showing off behave
     
       Scenario: run a simple test
          Given we have behave installed
           When we implement a test
           Then behave will test it for us!
     ```

3. 编写 `step` 文件

   * 在 `/features` 目录下创建文件夹 `/steps` ，进入 `/steps` 文件夹，新建一个测试文件，命名为 `tutorial.py` ;

   * 在 `tutorial.py` 中分别编写 `given` 、 `when` 和 `then` 测试语句如下：

     ```python
     from behave import *
     
     @given('we have behave installed')
     def step_impl(context):
         pass
     
     @when('we implement a test')
     def step_impl(context):
         assert True is not False
     
     @then('behave will test it for us!')
     def step_impl(context):
         assert context.failed is False
     ```

4. 运行测试框架

   * 调出 `Termial` ，输入命令：

     ```shell
     behave
     ```

     执行测试框架，即能看到测试结果。

以上为 `Behave` 官网的 demo 教程，关于更多使用技巧请移步 [官网](https://behave.readthedocs.io/en/latest/tutorial.html) 查看。

## 🥒  用Behave实现一个api测试用例

详情请看博客 [一个基于Behave框架的http接口测试实例](https://www.cnblogs.com/helenMemery/p/6496922.html) 。







<br/>



<center>--end--</center>



<br/>