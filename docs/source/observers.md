---
toc: content
title: 观察者模式
group: 源码
---

# 观察者模式

观察者模式（Observer Pattern）是一种设计模式，它定义了对象之间的一对多依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都会得到通知并自动更新。

## 实现原理

- 观察者模式主要包括两个角色：Subject（被观察者）和 Observer（观察者）。
- Subject 维护一个观察者列表，并提供方法来添加、删除观察者和通知所有观察者。
- Observer 定义一个更新接口，当 Subject 状态变化时，Subject 会调用观察者的更新方法。

## 手动实现

```js
// 定义观察者接口
class WeatherObserver {
  update(weatherData) {
    throw new Error('WeatherObserver 子类需要重写 update 方法');
  }
}

// 定义具体的观察者（比如邮件通知服务和短信通知服务）
class EmailWeatherObserver extends WeatherObserver {
  constructor(email) {
    super();
    this.email = email;
  }

  update(weatherData) {
    console.log(`已通过电子邮件通知 ${this.email} 天气更新：${weatherData}`);
    // 在这里实际执行发送邮件的逻辑
  }
}

class SMSWeatherObserver extends WeatherObserver {
  constructor(phoneNumber) {
    super();
    this.phoneNumber = phoneNumber;
  }

  update(weatherData) {
    console.log(`已通过短信通知 ${this.phoneNumber} 天气更新：${weatherData}`);
    // 在这里实际执行发送短信的逻辑
  }
}

// 定义被观察者（天气服务）
class WeatherService {
  constructor() {
    this.observers = [];
    this.currentWeather = null;
  }

  // 添加观察者
  attach(observer) {
    this.observers.push(observer);
  }

  // 删除观察者
  detach(observer) {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  // 通知所有观察者
  notify() {
    this.observers.forEach((observer) => observer.update(this.currentWeather));
  }

  // 设置天气并通知观察者
  setWeather(newWeather) {
    this.currentWeather = newWeather;
    this.notify();
  }
}

// 使用示例
const weatherService = new WeatherService();

// 用户订阅天气更新服务
const emailObserver = new EmailWeatherObserver('user@example.com');
const smsObserver = new SMSWeatherObserver('1234567890');

weatherService.attach(emailObserver);
weatherService.attach(smsObserver);

// 天气发生变化并通知所有订阅用户
weatherService.setWeather('晴朗');
// 输出：
// 已通过电子邮件通知 user@example.com 天气更新：晴朗
// 已通过短信通知 1234567890 天气更新：晴朗

// 移除其中一个观察者
weatherService.detach(emailObserver);
weatherService.setWeather('多云');
// 输出：
// 已通过短信通知 1234567890 天气更新：多云
```

WeatherService 是被观察者，当天气状态发生变化时，它会通知所有的观察者（在这里是 EmailWeatherObserver 和 SMSWeatherObserver）。每个观察者都实现了 update 方法，用于在接收到天气更新时执行相应的通知逻辑。

<BackTop></BackTop>