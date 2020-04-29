---
title: React中的Context
subtitle: "React中的一大方面"
date: 2019-03-24 19:41:20
tags: 
	- 笔记
	- 读书笔记
layout: post
author: "Trekerz"
header-img: "/bing/OldTownTallinn_ZH-CN4833535739_1920x1080.jpg"
---







context 表示上下文，将好像组件里面的全局变量一样，一般我们不使用这个属性，因为这个有可能损坏组件。指定 context 允许我们将变量从一个组件传递到另一个组件，而不需要一层一层的传递。推荐使用 **`props`** 或者 **`state`**来传递属性。

## 使用方式

我们需要使用 **`prop-types`** 库来定义传递context的类型，另外：

1. 在 **父组件** 中需要设置 **`childContextTypes`**(key-value 对象) 和 **`getChildContext()`(返回context对象)** 
2. 在 **子组件** 中需要设置 **`contextTypes`** 来获取 context, 并使用 **`this.context`** 来访问上下文对象

另外，上面的几个属性：

-  **`prop-types`** 是用来告诉 React我们的context的类型的
-  **`childContextTypes`** 不产生context, 只是定义context
-  **`getChildContext()`** 为了给context填充数据，我们需要调用这个函数

## 示例

父组件

```jsx
import PropTypes from 'prop-types';

class Message extends Component {
    static propTypes = {
       users: PropTypes.array.isRequired,
       initialActiveChatIdx: PropTypes.number,
       messages: PropTypes.array.isRequired
    }

    // 在父组件中 定义上下文类型
    static childContextType = {
        users: PropTypes.array,
        userMap: PropTypes.object
    }

    // 在父组件中 给context填充数据
    getChildContext() {
        return { // 返回context对象
            users: this.getUsers(),
            userMap: this.getUserMap()
        }
    }

    getUsers = () => {
        // ... 获取数据
    }

    getUserMap = () => {
        // ... 获取数据
    }

    render() {
       return (
           <div>
                <ThreadList />
                <ChatWindow />
           </div>
       )
    }
}
```

子组件，获取context

```dart
class ThreadList extends Component {
    // 为了在子组件中抓取context, 我们需要告诉React我们想要访问context
    // 我们通过在子组件中定义 contextTypes 和 React交流
    static contextTypes = {
        users: PropTypes.array
    }

    render() {
        return (
            <div className={styles.threadList}>
                <ul className={styles.list}>
                    {this.context.users.map((user, idx) =>( // 通过 'this.context' 访问context中的数据
                        <UserListing 
                            onClick={this.props.onClick}
                            key={idx}
                            index={idx}
                            user={user}
                        />
                    ))}
                </ul>
            </div>
        )
    }
}



class ChatWindow extends Component {
    // 任何定义了contextTypes的子组件，我们都能够访问父组件中定义的数据
    // 而不必通过props来传递
    // context 数据通过 this.context 对象来获取
    static contextTypes = {
        userMap: PropType.object
    }
}
```

## context 和 生命周期函数

如果加入了context, 下面生命周期函数将获取一个额外的参数

```tsx
constructor(props, context)
componentWillReceiveProps(nextProps, nextContext)
shouldComponentUpdate(nextProps, nextState, nextContext)
componentWillUpdate(nextProps, nextState, nextContext)
componentDidUpdate(prevProps, prevState, prevContext)
```

> 无状态函数也可以添加一个额外的参数

```jsx
import PropTypes from 'prop-types';

const Button = ({children}, context) => 
    <Button style={{background: context.color}}>
        {children}
    </Button>
```

## 总结

在js中使用全局变量通常不是一个好的主意，context通常作为全局变量用于有限的场景中，比如 登录的用户，在产品阶段建议使用props，而不是使用 context。

由于组件的state和props可以改变，context也可以改变，每当父组件中的state或者props变化时，getChildContext() 都会被调用，context更新后，子组件也会重新渲染。但是如果子组件中使用 **`shouldComponentUpdate()`** 返回false,则子组件不会更新，会引发错误，所以慎用context。







<br/>



<center>--end--</center>



<br/>

