---
title: Python网络框架纵览
subtitle: "【笔记】Python基础"
date: 2017-03-13 23:58:09
tags: 
	- 笔记
	- 读书笔记
	- Python
	- 网络技术
	- 前端基础
layout: post
author: "Trekerz"
header-img: "/blog/bg-img/null170313.jpg"
---



### **一、   网络框架综述**

##### **1.    **网络框架及MVC架构

###### (1)  网络框架

一组Python包，能使开发者专注于网站应用业务逻辑的开发，无须处理网络应用底层的协议、线程、进程等方面。

###### (2)  MVC架构

​	模型：用于封装与应用程序的业务逻辑相关的数据及对数据的处理方法。

​	视图：负责数据的显示和呈现。一个模型通常为多个视图提供服务。

​	控制器：负责从用户端收集用户的输入，可以看成提供视图的反向功能。

##### **2.    **4种Python网络框架

​	(1)  Django（最成熟，强大、相对封闭）

​	(2)  Tornado（强大、支持协程、高效并发）

​	(3)  Flask（年轻、集大成、微小）

​	(4)  Twisted（开源、事件驱动）

### **二、  开发环境准备**

easy_install和pip

##### **1.    **使用Python虚环境

可以避免同一计算机中不同项目中相同组件的不同版本间的冲突。

##### **2.    **Windows环境下的安装

##### **3.    **Linux环境下的安装

​	(1)  easy_install的下载与安装

​	(2)  pip的下载与安装

##### **4.    **easy_install与pip的使用

​	(1)  用easy_install管理其他组件

​	(2)  用pip管理其他组件

### **三、  Web服务器**

a.    Web服务器：Nginx、Apache、lighthttpd、IIS

b.    Python程序与Web服务器的接口：WSGI。

##### **1.    **实例1：WSGI接口

​	a.    WSGI是Python服务器端程序连接到Web服务器的通用协议。

​	b.    WSGI Sever与Web服务器的接口包括：uwsgi、fastcgi等。

步骤：定义一个服务器端程序.py，再定义一个WSGI Server程序.py，通过python命令执行wsgi_server.py，监听服务器端口，即可。

 

WSGI Server本身也可以作为一个服务器，但由于性能方面的原因，一般只做测试使用，不能用于正式运行。

##### **2.    **实例2：Linux+Nginx+uWSGI配置

​	(1)  安装Nginx（并启动）

​	(2)  按需调整Nginx参数

​	(3)  安装uWSGI配置

​	(4)  集成Nginx与uWSGI

在站点配置文件中为location配置uwsgi_pass。两方面要配置成同一个地址。

注：可以为一个uWSGI配置多个Nginx Server和location，这样就能实现多个域名访问同一个Python程序。

##### **3.    **实例3：建立安全的HTTPS网站

在HTTP下加入SSL层，通过SSL达到数据加密及身份确认的功能。OpenSSL是一个强大的免费Socket层密码库，可以通过它搭建HTTPS站点。

步骤：

​	a.    在服务器中安装OpenSSL包（openssl和libssl-dev）

​	b.    生成SSL密钥和证书

​	c.    将证书配置到Web服务器中（在Nginx配置文件中添加server段，指定服务器证书和服务器密钥的全路径文件名）

此时，就要通过443端口访问网站了。

<br/>

<br/>