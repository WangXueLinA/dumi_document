---
title: React Hook
---

# React hook

## Hooks 为什么要在顶层使用？

hooks 的实现就是基于 fiber 的。每个组件都会生成一个 FiberNode（节点），组件内使用的 hook 会以链表的形式挂在 FiberNode 的 memoizedState 上面。各个 FiberNode 汇聚起来会变成一颗 Fiber 树，React 每次会以固定的顺序遍历这棵树，这样就把整个页面的 hook 都串联起来了。

当 react 重新渲染时，会生成一个新的 fiber 树，而这里会根据之前已经生成的 FiberNode ，拿到之前的 hook ，再复制一份到新的 FiberNode 上，生成一个新的 hooks 链表。

react 按顺序来区分不同的 hook，它默认你不会修改这个顺序。如果你没有在顶层使用 hook ，打乱了每次 hook 调用的顺序，就会导致 react 无法区分出对应的 hook

## hook 函数

### useState

useState 是 React 16.8 引入的 Hook 功能之一，它允许在函数组件中使用状态。在此之前，状态管理仅限于类组件。useState 接收一个初始值作为参数，并返回一个状态变量和一个用于更新该状态的函数。

#### 基本用法

1. **参数**：useState() 方法接受一个参数，这个参数是组件的初始状态值。例如，`const [count, setCount] = useState(0)` 中的 0 就是初始 state。

2. **返回值**：useState() 返回一个数组，其中第一个元素是当前状态（state）的值，第二个元素是用于更新这个状态值的函数。setCount 就是用来更新 count 的函数，它接收新的 state 值并触发组件的重新渲染。

3. **state 更新**：对于基础数据类型（如字符串、数字、布尔值等），useState 的更新确实是直接替换整个 state 的值，而不是类似类组件 setState 的合并策略。但对于对象或数组，直接替换整个引用时，如果只是修改了引用内部的属性或元素，则不会触发组件重新渲染，需要通过创建新对象或数组的方式来更新。

4. **state 的生命周期**：State 在组件首次渲染时创建，并且在后续的重新渲染中始终保持。不同于函数执行完毕后局部变量会消失，React 会维持 state 的持久性，每次重新渲染时，useState 返回的 state 值都会是最新的状态。这意味着在组件的每一次生命周期中都可以访问和修改这个状态值。

```js
import React, { useState } from 'react';

function Example() {
  // 使用useState初始化状态count和设置状态的方法setCount
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

在这个例子中，我们创建了一个计数器组件，初始状态 count 被设置为 0。点击按钮时触发 onClick，它通过调用 setCount 方法增加计数。

函数组件等价于的 class 类组件如下:

```js
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

#### 使用场景

1. **状态初始化**：在函数组件中，我们经常需要维护一些内部状态，如计数器、开关状态、表单输入值等。例如，一个简单的计数器组件

```js
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

2. **表单输入状态**： 在处理用户输入时，useState 可用于存储表单字段的当前值。

```js
function TextInput() {
  const [text, setText] = useState('');

  return (
    <input
      type="text"
      value={text}
      onChange={(event) => {
        setText(event.target.value);
      }}
    />
  );
}
```

3. **条件渲染**： 根据状态值决定渲染不同的 UI。

```js
function Toggle() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <>
      <button onClick={() => setIsVisible(!isVisible)}>
        Toggle Visibility
      </button>
      {isVisible && <p>I am visible</p>}
    </>
  );
}
```

4. **数据获取**： 当我们需要在组件挂载后获取数据时，可以结合 useEffect 和 useState 来管理异步获取的数据状态。

```js
function UserData() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('https://api.example.com/user');
      const data = await response.json();
      setUserData(data);
    }

    fetchData();
  }, []); // 空数组意味着仅在组件挂载时执行一次

  return userData ? <div>{userData.name}</div> : <div>Loading...</div>;
}
```

总结来说，任何在函数组件中需要维护和更新状态的情况，都是 useState 的适用场景

#### 常见陷阱

1. **状态更新可能是异步的**： 虽然 setState 在 React Class 组件中通常是异步的，但在函数组件中使用 useState 时，状态更新可能也是异步的。这意味着在调用 setCount 之后，新状态可能不会立即生效。如果你需要在状态更新后做一些事情，可以使用 useEffect 挂钩。

```js
useEffect(() => {
  console.log('Count updated to:', count);
}, [count]); // 依赖项数组中包含count，当count改变时，这个副作用函数会运行
```

2. **状态更新可能存在闭包问题**：如果在事件处理器或异步函数中直接递增状态值，可能会遇到闭包问题，导致状态值不变。解决办法是使用函数式的更新形式：

```js
// 错误的做法：
function increment() {
  setCount(count + 1); // 此处的count可能不是最新状态
}

// 正确的做法：
function increment() {
  setCount((prevCount) => prevCount + 1); // 使用函数式更新确保拿到的是最新状态
}
```

3. **多个 useState 调用不一定是有序的**： 在同一个组件中多次调用 useState，并不能保证它们更新的顺序。如果你需要根据另一个状态的值来更新另一个状态，应当考虑将它们合并成一个状态对象，或者在 useEffect 中处理依赖关系。

4. **状态更新可能不会合并**： useState 不像 Class 组件中的 setState 那样自动合并对象。如果你需要更新嵌套对象或数组，需要深拷贝现有状态后再修改，或者使用 immer 库等工具帮助处理。

```js
// 错误做法（不会合并对象）
setMyObject({ key: newValue }); // 这会替换掉原有对象

// 正确做法（合并对象）
setMyObject((prevObject) => ({ ...prevObject, key: newValue }));
```

5. **传来的 props 初始值赋值给 useState**：当父组件重新渲染并传递新的 props 时，子组件内部的 useState 初始值并不会随之更新。useState 的初始值在组件第一次渲染时确定后就不会再改变。

```js
import React, { useState } from 'react';

function ParentComponent() {
  const [parentValue, setParentValue] = useState(0);

  function handleClick() {
    setParentValue(parentValue + 1);
  }

  return (
    <ChildComponent initialCount={parentValue}>
      <button onClick={handleClick}>Increment Parent Value</button>
    </ChildComponent>
  );
}

function ChildComponent({ initialCount }) {
  const [count, setCount] = useState(initialCount);

  console.log('Rendered Child Component with count:', count);

  return <div>The count is: {count}</div>;
}

export default ParentComponent;
```

在这个例子中，ParentComponent 有一个状态 parentValue，并通过 props 传递给 ChildComponent 作为其内部 useState 的初始值 initialCount。当点击按钮增加 parentValue 时，ParentComponent 会重新渲染并传递新的 parentValue 给 ChildComponent。但由于 ChildComponent 内部的 useState 只在组件初次渲染时使用 initialCount，后续 ParentComponent 传递的新值不会影响到 ChildComponent 内部的 count 状态。

为了避免这个问题，可以在 useEffect 中监听 props 变化，并适时更新本地状态：

```js
function ChildComponent({ initialCount }) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  console.log('Rendered Child Component with count:', count);

  // ...
}
```

这样每当 initialCount 发生变化时，useEffect 钩子就会执行并将新的 props 值更新到本地状态 count 中。

### useEffect

它主要用于处理副作用操作，如订阅数据源、执行定时任务、手动更改 DOM、添加或删除事件监听器等。useEffect 会在组件渲染后执行，并且在满足一定条件时再次执行。

#### 基本使用

```js
import React, { useState, useEffect } from 'react';

function SimpleEffectExample() {
  useEffect(() => {
    console.log('Component did mount!');

    // 在组件卸载时执行的清理函数
    return () => {
      console.log('Component will unmount!');
    };
  }, []); // 空数组意味着仅在组件挂载和卸载时各执行一次

  return (
    <div>
      <h1>Hello, useEffect!</h1>
      <p>This is a simple example of using useEffect.</p>
    </div>
  );
}

export default SimpleEffectExample;
```

useEffect 在组件首次挂载到 DOM 时执行，打印出 'Component did mount!'。同时，返回的函数会在组件卸载时作为清理函数执行，打印出 'Component will unmount!'。由于依赖数组是空数组，所以这个 useEffect 效果只会执行一次，相当于类组件中的 componentDidMount 和 componentWillUnmount 生命周期方法的组合。

#### 使用场景

useEffect 适用于任何在 React 组件生命周期中需要执行副作用（如 DOM 操作、网络请求、订阅数据源、定时任务等）的情况。

1. **定期执行任务**：通过 setTimeout、setInterval 等创建定时器，定期执行某些任务。

```js
useEffect(() => {
  const intervalId = setInterval(() => {
    console.log('Performing a task every second...');
  }, 1000);

  // 清理定时器
  return () => clearInterval(intervalId);
}, []); // 没有依赖项，定时器在组件挂载时开始，卸载时停止
```

2. **组件内部状态或 props 变化执行操作**:当组件内部的某个状态或 prop 值变化时，需要执行某些副作用操作，例如更新 DOM、发送请求、调整订阅等。

```js
useEffect(() => {
  // 当value改变时，更新相关DOM
  document.getElementById('myElement').innerText = value;

  // 或者当value改变时发送请求
  fetch('/api/data', { body: JSON.stringify(value) });
}, [value]); // 当value变化时执行effect
```

#### 常见陷阱

1. **依赖项遗漏**： 如果 useEffect 依赖于某些变量，但没有在依赖数组中列出，那么这些变量的变化不会触发 useEffect 重新执行。这可能导致依赖的变量没有得到及时更新，如下所示：

```js
useEffect(() => {
  // 错误：依赖项缺失，假设我们期望当dependency变化时执行这个effect
  fetchSomeData(dependency);
}, []); // 应改为：[dependency]

// 正确：添加了依赖项
useEffect(() => {
  fetchSomeData(dependency);
}, [dependency]);
```

2. **无限循环**： 如果在 useEffect 的回调函数内部调用了 setState 并且在依赖数组中包含了该状态变量，可能会导致无限循环。这是因为每次状态更新都会触发 useEffect，进而又导致状态更新，形成了死循环。

```js
// 错误
useEffect(() => {
  // count更新会导致无限循环
  setCount(count + 1);
}, [count]); // 应避免这种情况，或者重构代码逻辑

// 正确：避免直接在effect中依赖并更新相同的state
useEffect(() => {
  const timerId = setInterval(() => {
    setCount((prevCount) => prevCount + 1);
  }, 1000);

  // 清理定时器，防止内存泄漏
  return () => clearInterval(timerId);
}, []); // 由于初始时不依赖任何变量，所以无需放入依赖数组
```

3. **清理函数**： 如果 useEffect 中有创建订阅、定时器或其他需要手动清理的资源，务必返回一个清理函数，否则可能会导致内存泄漏。
4. **与 useLayoutEffect 区别**：
   - useEffect(异步)：会在浏览器绘制完成后异步执行，不会阻塞页面渲染。因此，它适用于大多数情况下的副作用操作，比如数据获取、订阅事件、修改 DOM 等。由于是异步执行，可能会导致页面闪烁或者用户看到不一致的 UI。
   - useLayoutEffect(同步)：在浏览器绘制之前同步执行，即会阻塞页面渲染。这使得它更适合处理需要立即更新 UI 的副作用操作，比如修改 DOM 样式、测量元素尺寸等。由于是同步执行，可以确保在页面渲染前完成副作用操作，避免了页面闪烁或不一致的 UI。

### useCallback

useCallback 是 React 的一个 Hook，它可以帮助优化性能，通过缓存函数引用以避免不必要的组件重新渲染。当组件的子组件依赖于父组件的回调函数时，如果不使用 useCallback，每次父组件更新时，子组件都会被迫重新渲染，即使回调函数的内容并未改变。useCallback 通过返回一个 memoized 版本的回调函数，使得在函数体不变的情况下，其引用不会改变，从而避免了不必要的子组件重新渲染。

#### 基本使用

```js
import React, { useState, useCallback } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // 使用 useCallback 缓存计数器增加的回调函数
  const incrementCounter = useCallback(() => {
    setCount((prevCount) => prevCount + 1);
  }, []);

  // 注意：此处的依赖项数组为空，因为incrementCounter不依赖任何其他state或props
  // 如果incrementCounter内部依赖了其他变量，则需要将其添加到依赖项数组内

  return (
    <div>
      <p>当前计数：{count}</p>
      <button onClick={incrementCounter}>点击增加计数</button>
    </div>
  );
}

export default Example;
```

在这个例子中，我们创建了一个 incrementCounter 函数来增加计数器的值。由于这个回调函数的逻辑并不会随着组件状态的变化而变化（始终都是增加操作），因此我们在 useCallback 中没有传递任何依赖项，这样即使父组件重新渲染，只要 count 状态没变，incrementCounter 的引用就不会变，进而可能避免一些不必要的子组件重新渲染（如果有子组件依赖这个回调）

#### 使用场景

需要避免因父组件频繁重新渲染而导致子组件不必要的重新渲染时。特别是在大型应用中，子组件可能是高性能渲染组件（如第三方库的图表组件）或者虚拟滚动列表等，此时优化回调函数的引用稳定性显得尤为重要。

1. **优化子组件渲染**: 当父组件频繁重新渲染时，如果父组件向子组件传递的回调函数每次都会生成新的引用，即使回调函数内部逻辑没有变化，也会导致子组件无谓地重新渲染。特别是当子组件是一个复杂或高效的组件（如 React.memo 包裹的组件、动画组件、图表组件等）时，可以通过 useCallback 来缓存回调函数的引用，仅在依赖项变化时才更新回调函数。

```js
import React, { useState, useCallback } from 'react';

// 假设我们有一个复杂的子组件，比如一个列表项，它需要处理点击事件
const ExpensiveListChild = React.memo(function ListChild({ onClick }) {
  // React.memo会比较props的变化，如果有变动则会重新渲染
  // 如果onClick没有改变，那么使用useCallback后，此处就不会重新渲染
  return <div onClick={onClick}>{/* 子组件的其他渲染逻辑 */}</div>;
});

function ParentComponent() {
  const [count, setCount] = useState(0);

  // 使用useCallback来缓存处理点击事件的函数
  const handleClick = useCallback(() => {
    // 这里可能有复杂的业务逻辑，但假设它并不依赖count状态
    console.log('Item clicked!');
  }, []); // 因为在这个例子中，这个函数不依赖任何状态或props，所以依赖数组为空,如果这里依赖于count状态，可以写成[count]

  // 每次ParentComponent状态改变时，useCallback会确保只有当依赖数组里的值发生变化时，handleClick才会得到一个新的引用

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
      {/* 由于handleClick被useCallback缓存，只要它所依赖的状态不变，它就会保持相同的引用 */}
      <ExpensiveListChild onClick={handleClick} />
    </div>
  );
}

export default ParentComponent;
```

尽管父组件 ParentComponent 的 count 状态不断变化并引起自身重新渲染，但因为 handleClick 回调函数在依赖项未改变时始终保持同一个引用，因此 ExpensiveListChild 组件不会因为回调函数引用变化而重新渲染，提升了整体应用的性能。当然，如果 handleClick 内部逻辑依赖于 count 状态，那么应当将 count 添加到 useCallback 的依赖数组中，这样在 count 变化时，回调函数会正确地重新创建并触发子组件的更新。

2. **优化性能敏感的第三方库**： 在使用某些第三方库时，如 React-Mapbox-GL、D3.js 等，这些库可能会直接监听传入的函数引用变化来决定是否重新执行某些昂贵的操作。在这种情况下，通过 useCallback 来缓存函数引用可以避免不必要的重复操作。

3. **避免无限循环**： 当父组件和子组件之间存在相互影响的状态时，如果不小心在回调函数中直接修改了状态，可能会引发无限循环。通过 useCallback 确保在依赖项不变的情况下回调函数引用稳定，有助于排查这类问题。

```js
import React, { useState, useCallback } from 'react';

function ParentComponent() {
  const [selectedItem, setSelectedItem] = useState(null);

  // 使用useCallback避免在依赖项不变时生成新的回调函数
  const handleSelectionChange = useCallback(
    (newSelectedItem) => {
      setSelectedItem(newSelectedItem);
    },
    [setSelectedItem],
  ); // 当setSelectedItem改变时才更新handleSelectionChange
}
```

#### 常见陷阱

1. **依赖项遗漏**：useCallback 返回的函数引用会在依赖数组中的值发生变化时重新创建。如果你在回调函数内部使用了某些状态或 props，却没有将它们包含在依赖数组中，可能会导致闭包问题，使得回调函数使用的是过期的值。

```js
// 错误：依赖项遗漏
const handleClick = useCallback(() => {
  console.log(count); // 如果依赖项中漏掉了[count]，count可能不会是最新的值
}, []);

// 正确：添加了依赖项
const handleClick = useCallback(() => {
  console.log(count);
}, [count]);
```

2. **依赖数组中包含不需要的依赖**： 如果依赖数组中包含了不必要的依赖项，即使这些依赖项没有变化，也会导致回调函数每次都重新创建。这不仅浪费性能，而且可能导致子组件不必要的重新渲染。

```js
// 错误：unusedVariable是不必要的依赖项
const handleClick = useCallback(() => {
  console.log(id);
}, [id, unusedVariable]);

// 正确：移除不必要的依赖项
const handleClick = useCallback(() => {
  console.log(id);
}, [id]);
```

3. **过度优化**： 不恰当或过度使用 useCallback 可能导致代码难以理解和维护。并非所有的函数都需要用 useCallback 进行优化，只有当函数作为 prop 传递给子组件，且子组件是性能敏感的（如通过 React.memo 优化过）或者子组件内部有依赖函数引用的深比较时，才建议使用 useCallback。

### useMemo

用于优化性能，通过缓存计算结果来避免在每次渲染时都进行昂贵的计算。当你有一个值需要在每次渲染时计算，但计算过程较耗时或者结果在某些条件下可以复用时，可以使用 useMemo。

#### 基本使用

```js
import React, { useState, useMemo } from 'react';

function Example() {
  // 状态：一个可以改变的数字
  const [baseNumber, setBaseNumber] = useState(10);

  // 使用useMemo优化计算结果
  const square = useMemo(() => {
    console.log('Calculating square...');
    // 计算平方数，这是一个假设耗时的操作
    return baseNumber * baseNumber;
  }, [baseNumber]); // 当baseNumber改变时，重新计算平方数

  return (
    <div>
      <input
        type="number"
        value={baseNumber}
        onChange={(e) => setBaseNumber(Number(e.target.value))}
      />
      {/* 显示计算后的平方数，使用缓存的值 */}
      <p>number: {square}</p>
    </div>
  );
}

export default Example;
```

我们有一个状态 baseNumber，并使用 useMemo 来缓存 baseNumber 的平方结果。当 baseNumber 改变时，useMemo 会重新计算平方值，否则会返回缓存的平方值，避免了每次渲染时都执行计算操作。在实际应用中，useMemo 常用于避免重复计算那些复杂度较高或者代价较大的表达式或函数，尤其是在这些计算结果在某次渲染周期内不会改变的情况下。

#### 使用场景

1. **计算量大或耗时的操作**： 当组件内部有复杂的计算逻辑，如大量的数据处理、计算密集型算法等，且计算结果在多次渲染间没有变化时，可以使用 useMemo 来缓存结果，避免每次渲染都重新计算。

```js
const expensiveResult = useMemo(() => {
  // 这是一个耗时的计算，例如处理大数据集、计算几何图形面积等
  return calculateExpensiveValue(inputs);
}, [inputs]); // 当inputs改变时，重新计算
```

2. **渲染优化**： 当一个计算结果被频繁地用于渲染过程中，如一个复杂的数据映射函数，可以使用 useMemo 来缓存这个映射结果。

```js
const mappedData = useMemo(() => {
  return largeDataSet.map((item) => expensiveTransform(item));
}, [largeDataSet]); // 当largeDataSet改变时，重新映射数据
```

3. **性能敏感的子组件**： 当父组件向性能敏感的子组件（如使用 React.memo 优化过的组件）传递计算结果作为 props 时，使用 useMemo 可以避免因计算结果的引用变更而引起子组件不必要的重新渲染。

```js
const childProps = useMemo(
  () => ({
    calculatedProp: calculateSomeProp(props),
  }),
  [props.someDependency],
); // 当依赖项变化时，重新计算props

return <ChildComponent {...childProps} />;
```

4. **全局状态的衍生数据**： 在使用 Redux 或其他状态管理库时，当需要从全局状态派生出一部分用于本地渲染的数据时，可以使用 useMemo 来缓存派生数据。

#### 常见陷阱

1. **依赖项遗漏**：useMemo 接收第二个参数作为依赖项数组，只有当依赖项发生变化时才会重新计算。若忘记包含所有相关的依赖项，可能导致缓存的结果过期却未得到更新，进而引发 bug。

```js
// 错误示范：假设count会影响expensiveCalculation
const expensiveResult = useMemo(() => expensiveCalculation(data), [data]); // 应该包含[count, data]

function Component({ count, data }) {
  // ...
}
```

2. **深比较问题**：React 默认对依赖项数组进行浅比较。如果依赖项是一个<font style='color: red'> 复杂的数据结构（如数组或对象）</font>，而它的内容发生了变化但引用不变，useMemo 无法识别并重新计算。在这种情况下，可能需要使用 useDeepCompareMemoize 等工具或自定义比较函数。

3. **误解用途**：useMemo 并非解决性能问题的万能药，它主要用于优化渲染性能，而非解决副作用问题。对于副作用操作，应考虑使用 useEffect。

### useRef

useRef 是 React 中的一个内置 Hook，用于在函数组件中创建一个可变的引用对象，这个引用对象可以在组件的整个生命周期内保持不变，也就是说，它不会随着组件的重新渲染而被重新创建。这个引用对象具有 .current 属性，初始值可通过构造函数传入。

#### 基本使用

```js
import React, { useRef } from 'react';

function MyComponent() {
  // 创建一个ref，并给它赋初始值
  const myRef = useRef(initialValue);

  // 初始化时，myRef.current === initialValue
  // 如果initialValue是一个对象或函数，它将直接被引用，而非拷贝

  // 在渲染方法或其他地方使用 ref
  return (
    <div>
      {/* 把ref应用到DOM元素 */}
      <input type="text" ref={myRef} />

      {/* 或者直接在JavaScript中操作引用 */}
      <button onClick={() => console.log(myRef.current.value)}>
        Log Input Value
      </button>
    </div>
  );
}
```

在上述示例中：

- useRef(initialValue) 创建了一个引用对象。
- myRef.current 可以被用来直接访问或修改 DOM 元素或者其他任意可变的值。
- 当把 myRef 作为 ref 属性传递给一个 DOM 元素时，React 会自动将该 DOM 元素绑定到 myRef.current 上，因此我们可以通过 myRef.current 访问到该 DOM 元素实例。

#### 使用场景

1. **访问 DOM 元素**：当需要直接操作 DOM 节点时，如聚焦（focus）一个输入框、获取或修改某个元素的样式、监听滚动事件等，可以利用 useRef 创建一个引用（ref），并将该引用附加到对应的 DOM 元素上。这样就可以在组件内部通过 ref.current 访问到实际的 DOM 节点。

```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    inputEl.current.focus();
  };

  return (
    <>
      <input type="text" ref={inputEl} />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

2. **跨渲染周期保存变量**：

useRef 返回的对象 .current 属性的值在组件重新渲染时不会丢失，这使得它成为存储那些不触发视图更新但需要在组件的不同渲染之间保持一致的数据的理想选择，比如滚动位置、计数器值、甚至是其他组件的引用。

```js
function ScrollTracker() {
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollPositionRef.current = window.pageYOffset;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <div>Current Scroll Position: {scrollPositionRef.current}px</div>;
}
```

3. **节流或防抖处理**：通过 useRef 存储定时器 ID，可以确保即使在组件重新渲染后，仍能正确清除先前设置的定时器，这对于实现节流（throttle）或防抖（debounce）函数特别有用。

```js
function DebouncedSearch() {
  const searchInput = useRef('');
  const timerRef = useRef(null);

  const handleChange = (event) => {
    clearTimeout(timerRef.current);
    searchInput.current = event.target.value;

    // 使用防抖函数延迟执行搜索请求
    timerRef.current = setTimeout(() => {
      performSearch(searchInput.current);
    }, 300);
  };

  // ...
}
```

4. **组件间通信（有限制地）**：虽然不是设计用途，但在某些特定场景下，useRef 可以用来在没有父子关系的组件之间共享状态，但这通常被认为是一种高级技巧，且不如 Context API 或 Redux 这类专门的状态管理方案合适。

#### 常见陷阱

1. **依赖项遗漏**：当 useRef 用于非 DOM 目的（如存储变量）并在其他 Hook（如 useEffect、useMemo 或 useCallback）中依赖这个值时，容易忘记将 ref 当作依赖项添加进去。由于 useRef 的 .current 属性在组件重新渲染时会保持不变，React 的依赖比较系统可能无法察觉 .current 值的变化，进而导致依赖的 Hook 未能及时响应

2. **滥用 useRef 作为状态管理工具**：useRef 适合储存那些不需要引起组件重新渲染的状态。但如果过于频繁地使用 useRef 来管理那些实际上需要驱动视图更新的状态，可能会导致难以追踪的状态管理和不必要的复杂性。对于需要触发组件重新渲染的状态，请优先考虑使用 useState。

3. **忽视清理工作**：当 useRef 用于存储可清理的资源（如定时器 ID、网络请求 abort 控制器、WebGL 上下文等），在组件卸载时，需要在 useEffect 的清理函数中显式地进行清理，否则可能会导致内存泄漏。

### useImperativeHandle

useImperativeHandle 是 React 中的一个 Hook，主要用于自定义函数组件暴露给父组件或其他外部组件的实例方法或属性。在 React 函数组件中，通常组件间通信建议通过 props 进行，但有些场景下，父组件可能需要直接访问子组件的某些内部方法或状态。这时，我们可以结合 forwardRef 和 useImperativeHandle 一起来实现。

useImperativeHandle 接受两个参数：

- ref：这是一个从父组件通过 forwardRef 传递过来的 ref 对象。
- createHandle：一个函数，它返回一个对象，该对象包含你想要暴露给父组件的方法或属性。

#### 基本使用

```js
import React, { forwardRef, useImperativeHandle } from 'react';

// 创建一个子组件，并使用forwardRef包裹
const CustomChild = forwardRef((props, ref) => {
  const internalRef = useRef();

  // 在内部使用useRef或其他方式保存需要暴露的方法或状态
  const focusInput = () => {
    internalRef.current.focus();
  };

  // 使用useImperativeHandle暴露方法
  useImperativeHandle(ref, () => ({
    // 只暴露focus方法给父组件
    focus: focusInput,
    // 可以暴露更多方法或属性
    // someProperty: someValue,
  }));

  return <input ref={internalRef} {...props} />;
});

// 父组件中使用CustomChild并获取暴露的方法
function ParentComponent() {
  const childRef = useRef();

  return (
    <div>
      <CustomChild ref={childRef} />
      <button onClick={() => childRef.current.focus()}>
        Focus Child Input
      </button>
    </div>
  );
}
```

CustomChild 组件通过 useImperativeHandle 向父组件暴露了 focus 方法。父组件通过 ref 即可调用这个方法，实现了对子组件内部细节的间接操作。

<Alert message='尽管这种方法提供了灵活性，但过度依赖这种方式通常被视为反模式，因为组件间强耦合可能影响代码的可维护性和可测试性。'></Alert>

尽量遵循 React 的数据流向原则，通过 props 传递数据和回调函数，而非直接操纵子组件内部实现。

#### 使用场景

1. **DOM 元素操作**：当父组件需要精确控制子组件中的某个 DOM 元素时，例如焦点管理、滚动条位置调整、播放视频或音频等。通过 useImperativeHandle 可以暴露子组件内部的 DOM 元素引用或封装后的 DOM 操作方。如基本使用中的例子

2. **封装复杂逻辑**：子组件封装了一些复杂的业务逻辑或状态管理，但为了让父组件能够在必要时介入，可以选择性地暴露一部分接口给父组件调用，而不是通过 props 层层传递回调函数。

```js
const ComplexComponent = forwardRef((props, ref) => {
  const [data, setData] = useState(...);
  const updateData = newData => {...};

  useImperativeHandle(ref, () => ({
    updateData,
    getData: () => data,
  }));

  // ...

  return (...);
});

function ParentComponent() {
  const complexRef = useRef(null);

  const handleClick = () => {
    complexRef.current.updateData(someNewData);
  };

  return (
    <>
      <ComplexComponent ref={complexRef} />
      <button onClick={handleClick}>Update Data</button>
    </>
  );
}
```

#### 常见陷阱

1. **过度使用或滥用**：useImperativeHandle 旨在解决特殊场景下函数组件需要向父组件暴露内部方法或状态的需求，但它违反了 React 组件化的设计原则，即组件应该尽可能独立和解耦。过度依赖此 Hook 意味着组件间的耦合度增加，不利于代码的可维护性和可预测性。
2. **破坏封装性**：通过 useImperativeHandle 暴露内部方法和状态，实质上破坏了组件的封装性。如果父组件开始直接操作子组件的内部实现，可能会导致子组件失去自我管理的能力，同时也使得父组件难以理解和维护。
3. **依赖项管理不当**：useImperativeHandle 中的 createHandle 函数如果没有恰当的依赖项列表（即 useImperativeHandle 的第三个参数），可能会导致内部状态滞后或错误同步。例如，当子组件内部某个状态改变时，如果没有将其添加到依赖项数组中，暴露给父组件的方法或属性可能不会随之更新。

4. **不符合 React 数据流** ：React 推崇单向数据流，即通过 props 向下传递数据，通过回调函数向上传递信息。而使用 useImperativeHandle 时，往往会让数据流动变得复杂和隐晦，尤其是在大型应用中，可能导致混乱的数据流动方向和难以调试的问题。

5. **兼容性问题**：useImperativeHandle 必须与 forwardRef 结合使用。如果忘记了这一点，或者没有正确传递 ref，则无法正常工作。同时，由于 ref 是 React 的一个高级特性，所以在类组件和其他非标准库组件中使用时可能会遇到兼容性问题。

6. **功能冗余**： 很多时候，可以通过合理的组件设计和 props 传递来避免使用 useImperativeHandle。例如，如果子组件需要执行某个操作，可以提供一个 prop 形式的回调函数，由父组件在合适的时机调用，这样既能保持组件的独立性，又能完成所需的交互。

### useLayoutEffect

useLayoutEffect 是 React 的一个 Hook，用于在函数组件中执行副作用操作，类似于 useEffect。但两者之间有个关键的区别在于 useLayoutEffect 执行时机：

- useEffect：在所有的 DOM 更新完成后，浏览器的绘制（Paint）阶段触发，这意味着在屏幕可见的更新之后执行。这适用于大多数不直接影响布局或视觉效果的副作用，如设置订阅、发送网络请求、修改浏览器历史记录等。

- useLayoutEffect：在所有的 DOM 更新完成后立即执行，但是在浏览器绘制前触发。这意味着 useLayoutEffect 内部的更新会影响到 DOM 的布局。这个 Hook 主要用于那些需要在浏览器布局和绘制之前完成的操作，例如读取或修改 DOM 的尺寸、位置等涉及布局的属性，或者执行必须在视图更新前完成的任务。

使用 useLayoutEffect 的一个重要陷阱是，如果在此 Hook 中执行了耗时较长的操作，可能会阻塞浏览器的渲染流水线，导致界面的卡顿。因此，应确保 useLayoutEffect 内部的代码执行迅速，或者将耗时长的操作异步处理。

```js
import React, { useLayoutEffect } from 'react';

function MyComponent() {
  const divRef = React.useRef(null);

  useLayoutEffect(() => {
    // 获取DOM元素尺寸
    const dimensions = divRef.current.getBoundingClientRect();
    console.log('Element dimensions:', dimensions.width, dimensions.height);

    // 或者修改DOM属性，影响布局
    divRef.current.style.width = '50%';
  }, []); // 依赖项为空数组表示仅在挂载时执行一次

  return <div ref={divRef}>This is my component</div>;
}
```

useLayoutEffect 用于获取并打印 DOM 元素的尺寸，或者修改元素宽度，这些都是与布局相关的操作，因此使用 useLayoutEffect 更为合适。如果只是简单的副作用处理，比如设置计时器或者发送 API 请求，通常推荐使用 useEffect

### useReducer

useReducer 是 React 提供的一个 Hook，它可以让你在函数组件内部管理复杂的可变状态，特别适合于当状态逻辑较重并且可能包含多个相关联的值或者有多个触发状态变更的动作（actions）时使用。useReducer 的设计灵感来源于 Redux 等 Flux 架构，它允许开发者通过纯函数（reducer）的方式来更新应用的状态。

#### 使用场景

useReducer 接收两个参数：

1. reducer: 这是一个纯函数，接收两个参数：当前状态（state）和一个动作（action），并基于这两个参数返回一个新的状态。在 reducer 中，你需要通过 switch 语句或者其他条件逻辑来区分不同的动作类型，并据此计算出新的状态。

```js
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    // 其他 case...
    default:
      throw new Error('未知的动作类型');
  }
}
```

2. initialState: 初始状态值，当组件首次渲染时使用的状态。

当你在组件中使用 useReducer 时，它会返回一个数组，包含两个元素：

- state: 当前状态对象。
- dispatch: 一个可以用来分发（dispatch）动作到 reducer 的函数。每次调用 dispatch(action) 都会导致 state 更新以及组件重新渲染。

#### 基本使用

```js
import React, { useReducer } from 'react';

// 定义 reducer
function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function App() {
  // 使用 useReducer 初始化状态和 dispatch 函数
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
    </div>
  );
}

export default App;
```

在这个例子中，我们创建了一个计数器组件，通过 counterReducer 来管理 count 状态，并且提供了两个按钮分别触发 INCREMENT 和 DECREMENT 动作，从而更新状态。每次 dispatch 被调用时，都会触发 re-render，而组件会展示最新的 count 值。

#### 使用场景

1. **复杂状态管理**： 当组件的状态逻辑较为复杂，涉及多个相互关联的值，或者有多种不同类型的操作（actions）需要处理时，使用 useReducer 可以将状态更新逻辑提取到单独的 reducer 函数中，使代码更加清晰和易于维护。
2. **多个子组件共享同一状态**： 当多个子组件需要共享和操作同一份状态时，可以将这份状态和更新函数通过 useReducer 提取到父组件，再通过 props 传递给子组件。这样，每个子组件只需通过调用父组件传递下来的 dispatch 函数即可触发状态更新。
3. **优化性能**： 如果组件中有多个 useState Hook 需要在每次渲染时都更新，而且这些状态的更新逻辑是相关的，那么使用 useReducer 可以将这些逻辑合并到一个 reducer 函数中，从而减少不必要的渲染次数。
4. **与 Redux 类似的状态管理**： 对于习惯于 Redux 开发模式的开发者来说，useReducer 提供了一种在函数组件中使用类似 Redux 的 reducer 的方式，能够帮助你在不引入外部状态管理库的情况下实现更复杂的状态管理。

#### 常见陷阱

1. **依赖项遗漏**：当在 useReducer 的 Reducer 函数中使用到了外部变量，或者 Reducer 本身依赖于 props 或 context 时，若未将这些依赖项添加到 useEffect 或其他 Hook 的依赖数组中，可能会导致状态更新的逻辑失效或不准确。
2. **Reducer 不纯**：Reducer 函数应该是一个纯函数，即相同的输入总是产生相同的输出，并且不改变外部状态或执行副作用。如果 Reducer 中包含了副作用操作（如 API 请求、改变全局状态等），这将违反这一原则，导致难以预期的行为。
3. **忽略 initialState**：在使用 useReducer 时，如果忘记提供初始状态（initialState），或者初始状态设置不正确，可能会导致应用启动时状态异常。
4. **Dispatch 误用**：在非 UI 事件中直接调用 dispatch，而不是通过 React 的事件处理函数（如 onClick 等），可能会导致意外的多次渲染，特别是当在 useEffect 或 componentDidUpdate 生命周期方法中直接调用时。
5. **滥用 useReducer**：不是所有状态都需要使用 useReducer 管理。对于简单的、只有一个值的状态，使用 useState 可能就足够了，过度使用 useReducer 会使代码变得复杂而不必要。

### useContext

useContext 用于消费在 React 应用中通过 createContext 创建的上下文(Context)。useContext 使得组件无需通过 props 逐层传递数据，而是让多个层级的组件能够共享状态或方法。

```js
import React, { createContext, useContext } from 'react';

// 创建一个Context对象
const MyContext = createContext(defaultValue);

// 在组件中使用useContext
function MyComponent() {
  // 使用useContext接收Context的值
  const contextValue = useContext(MyContext);

  // 现在可以访问和使用MyContext中的数据
  // ...

  return (...);
}
```

#### 基本使用

首先，我们创建一个上下文，用于存储和传递一个全局的问候信息

```js
import React, { createContext, useContext, useState } from 'react';

// 创建一个上下文对象，同时提供一个默认值
const GreetingContext = createContext('Hello World!');

// 顶层组件，提供上下文的值
function App() {
  // 使用 useState 来管理我们的上下文值
  const [greeting, setGreeting] = useState('Hello World!');

  return (
    // 包裹住需要访问上下文的所有组件
    <GreetingContext.Provider value={{ greeting, setGreeting }}>
      <GreetingConsumer />
    </GreetingContext.Provider>
  );
}

// 一个简单的组件，用于消费上下文
function GreetingConsumer() {
  // 使用 useContext 获取上下文的值
  const { greeting, setGreeting } = useContext(GreetingContext);

  // 修改问候信息
  const changeGreeting = () => {
    setGreeting('Hola Mundo!');
  };

  return (
    <div>
      <h1>{greeting}</h1>
      <button onClick={changeGreeting}>Change Greeting</button>
    </div>
  );
}

export default App;
```

我们创建了一个名为 GreetingContext 的上下文，并在 App 组件中通过 `<GreetingContext.Provider>` 提供了一个 `{ greeting, setGreeting }` 对象。`GreetingConsumer` 组件通过 `useContext(GreetingContext)` 访问到了这个上下文中的值，并使用 `setGreeting` 函数来更新问候信息。当点击按钮时，所有通过 `GreetingContext.Provider` 包裹的组件都会感知到 `greeting` 的变化并重新渲染。

#### 使用场景

1. **全局状态管理**： 当应用中存在大量跨级组件间需要共享的状态时，可以创建一个 Context，并通过 useContext 在任意深度的子组件中轻松访问和更新这个状态。例如，应用的主题颜色、用户的登录状态、API 授权 token 等。

2. **免去 prop drilling**： 避免通过 props 逐层传递数据，尤其是当数据需要贯穿多个层次的组件时，使用 Context 可以极大地简化代码并提高组件的可复用性。

3. **组件库状态共享**： 在构建组件库时，有时需要在库的多个组件之间共享状态，例如，一个表单库可能需要一个全局的表单提交/重置状态，此时可以通过 Context 实现。

4. **配置信息传递**： 一些通用配置信息，如国际化语言包、API 地址、全局样式参数等，可以放在 Context 中，便于全局应用和更新。主题切换功能可以通过创建一个主题 Context，组件根据上下文提供的主题值实时更新自身的样式。

#### 常见陷阱

1. **过度使用或滥用**：不加分辨地使用 useContext 来传递任何状态可能会导致应用的状态管理变得难以理解和维护。过度依赖 Context 可能会使组件树紧密耦合，打破组件化的原则。一般而言，仅在需要跨多个层级传递状态或实现全局状态管理时才考虑使用 Context。

2. **性能损失**：当 Context.Provider 的值改变时，所有在其范围内的 useContext 消费者都会重新渲染，无论它们是否真正使用了改变的值。为了避免不必要的重新渲染，可以将经常变化的数据和不常变化的数据分离到不同的 Context，或者使用 useMemo 缓存计算结果。

3. **Context 复杂性**：当 Context 数据结构过于复杂时，可能会加大代码的理解难度和维护成本。在实际开发中，可以考虑拆分多个 Context，每个 Context 只关注一部分状态或逻辑，以此降低复杂度。

### 自定义 hook

自定义 Hook 是 React 的一种高级技术，它允许开发者把可重用的逻辑提取到独立的函数中，这些函数可以调用其他 React Hooks，然后在其他组件中复用。自定义 Hook 并不关心组件的结构，只关注如何使用 React 的状态和其他特性。

#### 基本用法

自定义 Hook 通常以 use 开头命名，例如 useCustomLogic。自定义 Hook 本质上就是一个普通的 JavaScript 函数，但它内部可以调用 React 的内置 Hook，如 useState、useEffect、useContext 等

```js
import { useState, useEffect } from 'react';

// 定义一个自定义Hook
function useCustomHook(input) {
  const [state, setState] = useState(input);

  // 假设我们在这里做一些基于input值的计算或者副作用处理
  useEffect(() => {
    // ...这里是副作用逻辑，比如监听input的变化，或者进行数据获取
  }, [input]);

  // 返回所需的值或者其他函数
  return { state, updateState: setState };
}

// 在组件中使用自定义Hook
function MyComponent() {
  const { state, updateState } = useCustomHook('initialValue');

  // 使用自定义Hook返回的结果来驱动组件的渲染和行为
  return (
    <div>
      <p>The current state is: {state}</p>
      <button onClick={() => updateState('new value')}>Update State</button>
    </div>
  );
}
```

在上面的例子中，useCustomHook 接收一个初始值，并返回一个状态对象，组件可以据此更新和读取状态。通过这种方式，我们可以将共享逻辑从组件中抽离出来，以增强代码的可维护性和组织性。

#### 使用场景

1. **状态逻辑复用**： 当多个组件需要共享相似的状态逻辑时，可以将状态初始化、更新逻辑和副作用放入自定义 Hook 中。例如，一个自定义 Hook 可以用于管理用户登录状态，包括检查本地存储的 token、发起 API 请求获取用户信息、以及处理登录登出逻辑等。
2. **副作用管理**： 当组件间存在共同的副作用操作，如数据获取、订阅、定时任务等，可以创建一个自定义 Hook 来集中管理这些副作用。例如，创建一个 useFetchData Hook，用于处理 HTTP 请求和数据缓存。
3. **性能优化**： 可以创建自定义 Hook 来计算和缓存昂贵的计算结果，避免重复计算。例如，创建一个 useDebouncedValue Hook，用于防抖动处理频繁变化的输入值。
4. **UI 相关逻辑**： 用于处理滚动位置保存、窗口大小变化、表单字段验证等与 UI 相关的逻辑。例如，创建一个 useWindowResize Hook 来监听窗口大小变化并更新组件的布局

#### 常见陷阱

1. **遗忘依赖项**：在自定义 Hook 内部使用 useState、useEffect、useCallback 或 useMemo 时，如果没有正确声明依赖项，可能会导致逻辑错误或性能问题。例如，在 useEffect 的依赖数组中漏掉了一项关键的依赖，这可能导致副作用不会按照预期更新。
2. **违反 Hook 规则**：React 的 Hook 规则要求只能在函数组件或自定义 Hook 的最顶层调用 Hook。如果在循环、条件分支或者嵌套函数中调用 Hook，会导致难以预测的后果，因为这破坏了 React 对 Hook 的有序执行。
3. **过度抽象**：过早或过度地抽象成自定义 Hook 可能导致代码难以理解和维护。确保抽象的逻辑确实具有复用价值，并且不会使整个代码库变得更复杂。

## 非 hook 内置函数

### memo

React.memo 是 React 提供的一个优化性能的 API，主要用于优化函数组件的渲染。它是一个高阶组件（Higher-Order Component, HOC），通过对函数组件进行包裹，实现只有当组件接收的新 props 与前一次渲染时的 props 不同（通过浅比较判断）时才执行渲染操作，从而减少不必要的渲染更新，提高应用程序性能

#### 基本用法

```js
// 子组件使用 React.memo 包裹 DisplayNumber 组件
const MemoizedDisplayNumber = React.memo(DisplayNumber);
// 然后在 ParentComponent 中使用 MemoizedDisplayNumber 替换原来的 DisplayNumber
function ParentComponent() {
  // ...
  return <MemoizedDisplayNumber number={number} />;
}

// 父组件
function ParentComponent() {
  const [number, setNumber] = React.useState(0);
  // 模拟每秒更新一次 number，但有可能新的 number 和旧的一样
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      const randomNumber = Math.floor(Math.random() * 10); // 可能产生重复的随机数
      setNumber(randomNumber);
    }, 1000);
    // 清除定时器
    return () => clearInterval(intervalId);
  }, []);

  // 将 number 传递给 DisplayNumber 组件
  return <DisplayNumber number={number} />;
}
```

ParentComponent 每秒更新 number，但只要 number 的值没变，MemoizedDisplayNumber 组件就不会重新渲染，从而提高了应用的性能。React.memo 默认采用浅比较（shallow equality check）来检测 props 是否发生了变化，如果 props 是复杂对象或数组，可能需要提供自定义的比较函数以实现深度比较。

#### 使用场景

1. **避免不必要的子组件渲染**：在一个大型应用中，当父组件重新渲染时，其所有子组件也会默认重新渲染。若某个子组件的数据依赖并未改变，但因父级 props 的无关变化导致其被迫渲染，此时可以使用 React.memo 来缓存组件的输出。
2. **定制化比较函数**： React.memo 还可以接受第二个可选参数，这是一个自定义的比较函数，用于进行 props 是否变化的深度比较

```js
const arePropsEqual = (prevProps, nextProps) => {
  // 自定义比较逻辑，如果返回true，则不会重新渲染
  // ...
  return (
    prevProps.someProp === nextProps.someProp &&
    prevProps.otherProp === nextProps.otherProp
  );
};

const MemoizedMyComponentWithCustomEqualityCheck = React.memo(
  MyComponent,
  arePropsEqual,
);
```

总结起来，React.memo 是用来提高 React 函数组件性能的一种便捷手段，特别适用于那些频繁渲染但 props 变化较少的场景

### forwardRef

forwardRef 是 React 的一个内置函数，它允许将一个 ref 从父组件传递给子组件，即使是函数组件。这是因为常规情况下，函数组件不能直接接收 ref，而类组件可以通过 ref 属性来访问其底层 DOM 节点或实例。forwardRef 解决了这个问题，使得函数组件同样可以处理 ref。

#### 基本使用

```js
import React, { forwardRef } from 'react';

// 子组件
const CustomComponent = forwardRef((props, ref) => {
  // 在这里，你可以通过ref参数访问或分配给DOM元素或其他组件
  return <div ref={ref}>{/* 组件内容 */}</div>;
});

// 父组件
function ParentComponent() {
  const customRef = React.useRef(null);

  // 当ref被赋值时，customRef.current将指向CustomComponent内部的DOM元素
  return <CustomComponent ref={customRef} />;
}
```

在上述定义中，CustomComponent 接受两个参数：props 和 ref。ref 参数将会被父组件通过 ref 属性传递进来。接下来，我们将 ref 传递给一个实际的 DOM 元素或其他支持 ref 的组件。通过 forwardRef，父组件就能够访问到 CustomComponent 中的具体 DOM 元素，进而进行 DOM 操作，如获取焦点、测量尺寸等。此外，如果 CustomComponent 是复合组件，它也可以选择性地将 ref 传递给它的子组件，以便父组件能直接访问子组件的实例或其内部 DOM 节点。

#### 使用场景

1. **DOM 元素的访问**： 当父组件需要直接访问或操作子组件内部的 DOM 元素时，可以使用 forwardRef 将 ref 从父组件传递到子组件，然后子组件将其绑定到具体的 DOM 节点上。
2. **封装第三方库组件**： 当封装一个第三方库的 DOM 组件时，为了能够让使用者能像使用原生 DOM 元素那样传递 ref，也需要使用 forwardRef。
3. **组件间通信**： 在某些特殊情况下，虽然 React 提倡通过 props 和状态进行组件间通信，但有时候直接操作子组件实例（非 DOM 操作）也是必要的，例如调用子组件的方法。此时，可以通过 forwardRef 来传递 ref，并通过 useImperativeHandle 来暴露子组件的部分方法给父组件使用。

### createContext

createContext 是 React 提供的一个 API，用于创建一个新的上下文对象(Context)，用于在组件树中共享和传递数据，尤其适用于跨越多个层级的组件之间的状态传递，以避免通过 props 逐层传递（prop drilling）带来的不便。

#### 基本使用

1. **创建上下文**：

```js
// 创建一个表示主题颜色的主题上下文
const ThemeContext = React.createContext('light'); // 默认主题为 'light'
```

2. **提供上下文值**： 在组件树的较高层级，使用 `<ThemeContext.Provider>` 组件来包裹需要共享该上下文的组件，并提供当前的上下文值。

```js
function App() {
  const [theme, setTheme] = useState('dark');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <SomeDeeplyNestedComponent />
    </ThemeContext.Provider>
  );
}
```

3. **消费上下文值**： 在任何嵌套层级的组件中，都可以通过 useContext Hook 来消费上下文的值。

```js
import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

function SomeDeeplyNestedComponent() {
  // 获取当前的主题值和修改主题的函数
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div>
      The current theme is: {theme}
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </div>
  );
}
```

通过 createContext 创建的上下文允许深层嵌套的组件轻松访问和更新共享状态，增强了 React 应用的状态管理能力。

#### 使用场景

1. **全局状态管理**：应用的主题切换、用户登录状态、API 授权信息、语言偏好等全局状态，可通过创建一个上下文来统一管理，并在各个层级的组件中轻松获取和更新。
2. **组件库或第三方库集成**：在构建 React 组件库时，为了方便外部应用与组件库内部状态交互，可以提供一个上下文供外部应用使用，如 Form 组件库中的表单验证状态、操作反馈等。
3. **Redux 替代方案（轻量级场景）**：对于小型到中型项目中部分模块的简单状态管理，可以使用 createContext 和 useReducer 结合代替 Redux，简化状态管理流程，尤其是在不需要复杂的中间件、异步逻辑处理和严格状态隔离的场景下

### lazy and Suspense

React.lazy 和 Suspense 是 React 中用于代码分割和延迟加载组件的功能。

React.lazy： React.lazy 是一个函数，用于动态导入组件，并返回一个“惰性”加载的组件。这样做可以实现代码分割，即只有当组件需要渲染时才会加载相应的模块，从而提高应用的初始加载速度和总体性能。

#### 基本使用

```js
import React, { lazy, Suspense } from 'react';

// 惰性加载组件
const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <div>
      {/* 当LazyComponent加载时，Suspense组件将显示fallback内容 */}
      <Suspense fallback={<div>Loading...</div>}>
        {/* 可能是懒加载的组件，也可能是正在等待异步数据的组件 */}
        <LazyComponent />
      </Suspense>
    </div>
  );
}
```

在上述代码中，React.lazy() 接收一个返回 Promise 的函数，该 Promise 将在组件需要渲染时解析为导入的组件。当组件正在加载时，包裹在 Suspense 组件内的所有内容将被暂时隐藏，并显示 Suspense 组件的 fallback 属性所指定的内容。

Suspense： Suspense 是一个 React 组件，用于包裹那些需要延迟加载的组件，当这些组件的资源尚未加载完毕时，Suspense 会显示其 fallback 内容。Suspense 不仅可以与 React.lazy 结合使用，未来也可能用于处理异步数据加载等情况。

#### 使用场景

1. **代码分割**：React.lazy 用于动态加载组件，结合 Webpack 或其他打包工具，能够实现将大应用拆分成小块，仅在需要时加载对应模块的代码，减少初始加载时的文件大小和网络传输量。
2. **按需加载**：对于一些不常访问或仅在特定条件下才需要渲染的组件，可以使用 React.lazy 进行懒加载，这样在初次加载页面时，不会加载这些组件的代码。

### Fragment

在 React 中，Fragment（片段）是一种特殊的抽象类型，它允许你将多个子元素作为一个整体返回，而无需额外包裹它们在一个额外的 DOM 元素中。Fragment 在 React v16.2 及以上版本中被引入，其符号通常写作 `<></>` 或 `<React.Fragment>`。

#### 基本使用

```js
import React, { Fragment } from 'react';

const MyComponent = () => (
  <Fragment>
    <div>First item</div>
    <div>Second item</div>
  </Fragment>
);
```

上述代码中，`<Fragment>` 就像一个看不见的容器，它不会在实际的 DOM 中生成额外的节点。在以前，为了达到类似的效果，开发者常常需要包裹子元素在一个实际的 DOM 元素（如 `<div>`）中，但这会导致 DOM 结构的冗余。现在使用 Fragment，可以避免这种冗余，使 DOM 结构更加扁平和简洁。

另外，Fragment 还可以接受一个 key 属性，这在需要在列表中使用多个片段时（如 map 函数生成列表）很有用，以辅助 React 识别列表中哪些元素改变了位置。

```js
const items = ['Apple', 'Banana', 'Cherry'];

const ListItems = () => (
  <>
    {items.map((item, index) => (
      <Fragment key={index}>
        <li>{item}</li>
        <hr />
      </Fragment>
    ))}
  </>
);
```

在这个例子中，`<>...</>` 是 `<React.Fragment>` 的简写形式，每个列表项及其后的分割线都被视为一个单独的片段，但并不会在 DOM 中额外生成 `<div>` 或其他元素作为包裹容器。

#### 使用场景

1. **避免不必要的 DOM 层级**： 当一个组件需要返回多个相邻的 DOM 元素而不希望增加额外的 DOM 层级时，可以使用 Fragment 替代常规的 HTML 元素（如 <div>）来包裹这些子元素。例如，在构建列表或者表格的时候，不希望因为每一组子元素都添加一层无意义的 <div>

<BackTop></BackTop>