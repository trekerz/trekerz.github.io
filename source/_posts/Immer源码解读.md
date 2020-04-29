---
title: Immer源码解读
subtitle: "Mweststrate的另一杰作"
date: 2020-04-18 23:00:31
tags: 
	- 笔记
	- 源码
layout: post
author: "Trekerz"
header-img: "/bing/YukonEmerald_ZH-CN1893750172_1920x1080.jpg"
---





 

```js
// 以此例讲解
produce(obj, state => {
  state.products.count++
})
```

1. ### 生成代理

   将`obj`包装一下，转为`draft`。`draft`是一个`Proxy`。步骤如下：

   ```js
   const state = {
     modified, // 是否被修改过
     finalized, // 是否已经完成（所有setter执行完，且已生成最终的copy）
     parent, // 父级对象
     base, // 原始对象（也就是obj）
     copy, // base的浅拷贝（Object.assign）
     draft, // 自身的代理
     drafts, // 属性的代理
     scope, // draft链数组
   }
   const draft = new Proxy(state, {
     // getter
   	get(state, prop) {
       if (prop === DRAFT_STATE) {
         return state;
       }
       var drafts = state.drafts;
   
       if (!state.modified && has(drafts, prop)) {
         return drafts[prop];
       }
   
       var value = source$1(state)[prop];
   
       if (state.finalized || !isDraftable(value)) {
         return value;
       }
   
       if (state.modified) {
         if (value !== peek$1(state.base, prop)) {
           return value;
         }
   
         drafts = state.copy;
       }
   
       // 生成当前prop的draft，放到父级的drafts里
       return drafts[prop] = createProxy$1(value, state);
     },
     
     // setter
     set(state, prop, value) {
       if (!state.modified) {
         var baseValue = peek$1(state.base, prop);
         
         var isUnchanged = value ? is(baseValue, value) || value === state.drafts[prop] : is(baseValue, value) && prop in state.base;
         if (isUnchanged) {
           return true;
         }
         markChanged$1(state);
       }
   
       state.assigned[prop] = true;
       state.copy[prop] = value;
       return true;
     }
   })
   ```

   这个`draft`暴露给用户去取值和赋值时，会触发`getter`和`setter`函数。

2. ### `getter`

   主要作用：

   - 懒初始化代理对象

     当代理对象子属性被访问时，才会生成子属性的代理对象。

   > 以开头的例子来说：
   >
   > 首先，`state`的`draft`是在执行`reducer`之前就生成的；
   >
   > 当执行到`state.products`时，即触发`getter`，此时才会去生成`state.products`的`draft`，并放入`state`的`drafts`里。

   - 根据内部状态（`modified`、`finalized`）决定返回值还是代理对象。

     `get`接收两个参数，第一个为 `state`，即创建 `Proxy` 时传入的第一个参数（目标对象），第二个参数为`prop`，即想要获取的属性名，具体逻辑如下：

     > - 若 `prop` 为`DRAFT_STATE`则直接返回 `state` 对象（会在最后处理结果时用到）；
     > - 取 `state` 的 `drafts` 属性。`drafts` 中保存了`state.base`子对象的 proxy，譬如`base = { key1: obj1, key2: obj2 }`，则`drafts = { key1: proxyOfObj1, key2: proxyOfObj2 }`；
     > - 若 `state` 尚未被修改并且 `drafts` 中存在 `prop` 对应的 `proxy`，则返回该 `proxy`；
     > - 若`state.copy`存在，则取`state.copy[prop]`，否则取`state.base[prop]`，存于 `value`；
     > - 若 `state` 已经结束计算了或者 `value` 不能用来生成 `proxy`，则直接返回 `value`；
     > - 若 `state` 已被标记修改
     >   - 若`value !== state.base[prop]`则直接返回 `value`；
     >   - 否则把`state.copy`赋值给 `drafts`（`copy` 里也包含了子对象的 `proxy`，具体会在 `set` 部分细说）；
     > - 若未提前返回则执行`createProxy(value, state)`生成以 `value` 为 `base`、`state` 为 `parent` 的子 `state` 的 `proxy`，存到 `drafts` 里并返回。

3. ### `setter`

   当`draft`修改时，首先对`base`值进行浅拷贝，保存到`copy`，将被修改的属性值保存到`copy`，同时将`modified`置为`true`。

   同时，为了保证整条链路的对象都是新对象，会根据`parent`来递归父级，不断浅拷贝(即`markChanged`方法，此时会往父级的`copy`里写入子级的`draft`)，以保证从叶子节点到根节点链路上的每个节点都是新对象。

   ```js
   function markChanged$1(state) {
     if (!state.modified) {
       state.modified = true;
       // 往父级的copy写入子级的draft（这样就可以在第4步的生成环节递归子级）
       state.copy = assign(shallowCopy(state.base), state.drafts);
       state.drafts = null;
       // 递归父级
       if (state.parent) {
         markChanged$1(state.parent);
       }
     }
   }
   ```

   > 以开头的例子来说：
   >
   > 上一步中`state.products`被执行时，触发的`getter`函数生成了`state.products`的`draft`，放入了`state`的`drafts`里，同时也返回给了`state.products`这个表达式，供后续操作使用；
   >
   > 此时对`state.products.count`赋值`value`，就是对`state.products`返回的`draft`赋值`value`，此时会做两件事：
   >
   > - 把`count: value`键值对放入`state.products`的`draft`的`copy`；
   > - 递归父级`draft`，即`state`的`draft`，这时会把`state.products`的`draft`放入`state`的`draft`的`copy`里（具体就是把`state`的`draft`的`drafts`挪到`copy`），以此来标明`state`节点的更新。

4. ### 生成`Immutable`对象

   ##### (1) 如果`modified`为`true`

   说明对象没有被修改，那么直接返回`base`属性。

   ##### (2) 如果`modified`为`false`

   说明对象被修改了，按理是返回`copy`属性。但是`setter`过程是递归的，`draft`的子对象也是`draft`，此时`copy`里还含有很多`draft`，所以想拿到真正的`copy`属性，必须对`state`再进行递归（`finalize`），拿到真正的`copy`值。

   ```js
   // 开始递归，对root执行finalizeTree
   finalizeTree(root, rootPath, scope) {
     const state = root[DRAFT_STATE]
     if (state) {
       if (!this.useProxies) {
         state.finalizing = true
         state.copy = shallowCopy(state.draft, true)
         state.finalizing = false
       }
       root = state.copy
     }
   
     const needPatches = !!rootPath && !!scope.patches
     const finalizeProperty = (prop, value, parent) => {
       if (value === parent) {
         throw Error("Immer forbids circular references")
       }
   
       const isDraftProp = !!state && parent === root
   
       if (isDraft(value)) {
         const path =
           isDraftProp && needPatches && !state.assigned[prop]
           ? rootPath.concat(prop)
           : null
   
         // 递归finalize（内部会用root的子节点去执行finalizeTree）
         value = this.finalize(value, path, scope)
   
         if (isDraft(value)) {
           scope.canAutoFreeze = false
         }
   
         if (Array.isArray(parent) || isEnumerable(parent, prop)) {
           parent[prop] = value
         } else {
           // 赋值
           Object.defineProperty(parent, prop, {value})
         }
   
         if (isDraftProp && value === state.base[prop]) return
       }
       else if (isDraftProp && is(value, state.base[prop])) {
         return
       }
       
       // 检查没有冻结的对象，把它们都进行递归，防止再次被写入draft
       else if (isDraftable(value) && !Object.isFrozen(value)) {
         each(value, finalizeProperty)
       }
   
       if (isDraftProp && this.onAssign) {
         this.onAssign(state, prop, value)
       }
     }
   
     // 运行
     each(root, finalizeProperty)
     return root
   }
   ```

   从对象最外层往里递归，嵌套执行`finalizeTree`、`finalizeProperty`，把`copy`中的`draft`都替换成真正的值（即子节点）。

5. ### `revoke`

   停止根节点的代理。





### 参考资料：

1. [精读《Immer.js》源码](https://juejin.im/post/5aaf6d596fb9a028d207be00)
2. [Immer全解析](https://juejin.im/post/5c70e50f51882562276c47ef)
3. [Github官方仓库](https://github.com/immerjs/immer)



<br/>



<center>--end--</center>



<br/>