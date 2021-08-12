### LazyMan函数
期望的效果：LazyMan('Mike').eat('dinner').sleep(10).eat('supper')，依次打印 Mike，dinner，等待10秒，打印supper


### 方法一 类似于Promise.then的实现
本质上和promise的原理差不多，内部维护一个resolve状态，可以将sleep实现成类似于promise的then方法，在调用sleep时重新创建一个lazyMan
```javascript
const invoke = Symbol()
function LazyMan(name){
  return new $LazyMan(name)
}
function $LazyMan(name){
  this._name = name;
  this._tasks = []
  this._resolved = !!name;
  if(this._resolved){
    console.log('new a lazyMan...', name)
  }
}

$LazyMan.prototype[invoke] = function(callback) {
  if(this._resolved){
    callback()
  } else {
    this._tasks.push(callback)
  }
  return this
}

$LazyMan.prototype.eat = function(...args){
  // eat函数的逻辑
  const _eat = () => { console.log('he eat:', ...args) }
  return this[invoke](_eat)
}

$LazyMan.prototype.drink = function(...args){
  // drink函数的逻辑
  const _drink = () => { console.log('he drink:', ...args) }
  return this[invoke](_drink)
}
$LazyMan.prototype.sleep = function(time){
  const nextMan = new this.constructor
  nextMan._count = this._count + 1
  this[invoke]((timer) => {
    setTimeout(() => {
      console.log('he sleep:', time);
      nextMan._resolved = true
      nextMan._tasks.forEach(f => f())
    }, time * 1000)
  })
  return nextMan
}
```


### 第二种实现
```javascript
function LazyMan(name){
  return new $LazyMan(name)
}
function $LazyMan(name){
  this._name = name;
  this._tasks = []
  console.log('new a lazyMan...', name)
  setTimeout(() => {
    this.next()
  }, 0)
}

$LazyMan.prototype.eat = (what) => {
    const task = () => {
        console.log('eat:', what)
    }
    this._tasks.push(task)
    return this
}

$LazyMan.prototype.sleep = (time) => {
    const task = () => {
        setTimeout(() => {
            console.log('sleep:', time)
            this.next()
        }, time * 1000)
    }
    this._tasks.push(task)
    return this
}

$LazyMan.prototype.next = () => {
    const task = this._tasks.shift()
    if(task){
      task()
    }
    return this
}
```
