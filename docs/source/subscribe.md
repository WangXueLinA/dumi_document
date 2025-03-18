---
toc: content
title: 订阅发布模式
group: 源码
---

# 订阅发布模式

订阅发布模式（Publish-Subscribe Pattern）是一种设计模式，它定义了消息的发布者（Publisher）和订阅者（Subscriber）。发布者不直接将消息发送给特定的订阅者，而是将消息发布到一个公共的地方（如事件中心或主题），订阅者对感兴趣的主题进行订阅，当有新的消息发布到该主题时，所有订阅了该主题的订阅者都会收到通知并处理相应消息。

## 实现原理

- 发布者不关心谁订阅了消息，只负责发布消息。
- 订阅者不直接从发布者那里获取消息，而是将自己的处理逻辑注册到消息中心，等待消息到来时触发。
- 消息中心（也称为调度中心或中介者）负责管理和分发消息，对接收的消息进行存储或转发给已订阅的订阅者。

## 手动实现

```js
class EventChannel {
  constructor() {
    this.events = {}; // 用于存储事件和其对应处理函数的映射表
  }

  /**
   * 订阅事件
   * @param {string} eventName - 事件名称
   * @param {Function} handler - 事件处理函数
   */
  subscribe(eventName, handler) {
    // 如果事件还没有对应的处理函数集合，则创建一个
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    // 将处理函数添加到事件对应的集合中
    this.events[eventName].push(handler);
  }

  /**
   * 取消订阅事件
   * @param {string} eventName - 事件名称
   * @param {Function} [handler] - 可选的，需要移除的特定处理函数，如果不提供，则移除该事件的所有处理函数
   */
  unsubscribe(eventName, handler = null) {
    if (this.events[eventName]) {
      if (handler) {
        // 移除特定的事件处理函数
        this.events[eventName] = this.events[eventName].filter(
          (fn) => fn !== handler,
        );
      } else {
        // 清空该事件的所有处理函数
        delete this.events[eventName];
      }
    }
  }

  /**
   * 发布事件，触发所有订阅了该事件的处理函数
   * @param {string} eventName - 事件名称
   * @param {...*} args - 需要传递给处理函数的参数
   */
  publish(eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((handler) => handler(...args));
    }
  }
}

// 使用示例
const channel = new EventChannel();

// 定义事件处理函数
const handleNews = (headline) => console.log('Received news:', headline);
const handleAlert = (message) => console.error('Alert:', message);

// 订阅事件
channel.subscribe('news', handleNews);
channel.subscribe('alert', handleAlert);

// 发布事件
channel.publish('news', 'Breaking News!');
channel.publish('alert', 'System error detected!');

// 取消订阅特定事件的处理函数
channel.unsubscribe('news', handleNews);

// 再次发布事件，handleNews不再接收新闻事件
channel.publish('news', 'Latest Update');
```

EventChannel 类充当了发布订阅中心的角色，它维护了一个事件对象（events）来储存不同事件和对应处理函数的关联。通过 subscribe 方法订阅事件，unsubscribe 方法取消订阅，而 publish 方法则是触发事件，调用所有订阅了该事件的处理函数。

<BackTop></BackTop>