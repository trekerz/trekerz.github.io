---
title: Django基础2
subtitle: "【笔记】Django框架基础知识——第2部分"
date: 2017-03-16 22:55:18
tags: 
	- 笔记
	- 读书笔记
	- Python
	- 前端基础
layout: post
author: "Trekerz"
header-img: "/bing/StMaryFalls_ZH-CN8917284967_1920x1080.jpg"
---



### **四、   Django视图层**

视图层主要工作：衔接HTTP请求、Python程序、HTTP模板等。

#### **1.    **URL映射

通过URL dispatcher可以指定用户的每一个访问的后台Python处理函数是什么。

###### **(1)  **普通URL映射

django.conf.urls.url

通过urlpatterns列表维护，用正则表达式定义。

###### **(2)  **正则表达式

（语法、字符意义）

###### **(3)  **命名URL参数映射

参数代替表达式：?P\<param_name\>pattern

（注意：当URL可以映射多个函数时，取第一个）

###### **(4)  **分布式URL映射

include()提供了同个项目中多个应用之间的分布式URL映射功能。

（注意：各种父映射文件、子映射文件之间的相互作用）

###### **(5)  **反向解析

从映射名（即函数名）到URL地址的解析功能。

在模板文件中：

```
{%URL 'name' %}
```

在Python程序中：django.core.urlresolvers.reverse(‘name’)

#### **2.    **视图函数

​        视图函数是处理HTTP请求的Python函数，视图函数的功能是通过模型层对象处理数据，然后用如下中的一种方式返回HTTP Response:

a.    直接构造HTTP Body

b.    用数据渲染HTML模板文件

c.    如果有逻辑错误，则返回HTTP错误或其他状态

###### **(1)  **直接构造HTML页面

​         适用于简单的页面，直接构造出返回值后用HttpResponse()函数封装后返回。

###### **(2)  **用数据渲染HTML模板文件

​         使用render()函数。

###### **(3)  **返回HTTP错误

​         通过HTTP头中的Status参数表达并用HttpResponse()返回；也可以直接返回Django自带的定义好的Status参数的子类（例如：return HttpResponseNotFound()）。

#### **3.    **模板语法

​        由目标文件（HTML、CSS等）和用于替换动态内容的模板特殊语法组成。

###### **(1)  **变量替换

{{ variable }}

###### **(2)  **过滤器

​         放在变量后用于控制变量显示格式的技术。变量与过滤器之间通过管道符号|连接。如下是将upper过滤器应用在moment.headline变量中：

{{moment.headline | upper}}

​         此外还有更多不同功能的过滤器。

###### **(3)  **流程控制

​         模板文件提供流程控制功能：

```
{% for %}
```

和

```
{% if %}
```

###### **(4)  **模板继承

​         将多个页面的公共部分写在一个模板文件中，然后在其他模板文件中共享该公用部分的内容。包括两种：父模板文件（公用部分）、子模板文件。视图函数通过渲染继承了父模板文件的子模板文件来获得最终的页面。

### **五、  使用Django表单**

#### **1.    **表单绑定状态

bound：一个表单对象在实例化且被赋予过数据内容后的状态。此状态具有表单数据验证功能。

unbound：违背赋予过数据内容的状态。此状态可以被赋予数据。

#### **2.    **表单数据验证

​        在服务器端用Python代码验证表单中数据的合法性。包括：字段属性验证、自定义逻辑验证。

###### **(1)  **字段属性验证

​         在Form渲染的过程Django会自动根据验证约束要求验证字段内容。开发者也可以在代码中通过is_vaild()函数在代码中获得表单验证是否通过的信息，用errors属性获得错误提示信息。

###### **(2)  **自定义逻辑验证

​         开发者可以重载Form子类的clean()函数进行自定义逻辑定义。

#### **3.    **检查变更字段

​        Django提供了has_changed()函数来判断用户是否修改过表单数据。此外还能用changed_data()精确定位修改过哪些内容。

### **六、  个性化管理员站点**

​       开发者可以通过继承Django定义的管理员数据模型、模板、站点类来开发出个性化的管理员站点。

#### **1.    **模型

​        通过定义继承自django.contrib.admin.ModelAdmin的子类，可以定制个性化的数据模型管理功能，并且需要在应用的admin.py文件中注册模型类时指定该子类。

​        8个常用的管理类属性。

#### **2.    **模板

​        开发者可以自定义模板文件，具体步骤如下：

###### **(1)  **定义子模板文件路径

###### **(2)  **修改项目settings.py

###### **(3)  **开发子模板文件

###### **(4)  **测试定制效果

#### **3.    **站点

​        如果需要修改一些管理站点中的通用属性，比如管理站点头、站点标题等，则可以通过定义自己的AdminSite类来实现，具体步骤如下：

###### **(1)  **定义AdminSite子类

###### **(2)  **修改项目urls.py

###### **(3)  **测试定制效果

AdminSite中常用的定制属性：site_header、site_title、site_url、login_form。

<br/>

<br/>