## 装饰器
装饰器本质上就是一个函数，装饰器目前只能用于类，类的方法，类的属性，类的方法的参数。
- 如果是参数装饰器，那么装饰器函数接收的第一个参数是target(类的原型)，key(方法名)，paramIndex

### 参数装饰器
```typescript
function paramDecorator(target: any, key: string, paramIndex: number) {
    // target类的原型， Person.prototype { getName }
    console.log(target, key, paramIndex);
}

function nameDecorator(target: any, key: string): any {
    const descriptor: PropertyDescriptor = {
        writable: false
    }
    return descriptor;
}

// 普通方法，target对应的是类的prototype
// key 对应的是装饰的方法的名字
function getAgeDecorator(target: any, key: string, descriptor: PropertyDescriptor) {
    console.log('target..', target);
    console.log('key..', key);
    descriptor.writable = false; //装饰的方法不能被重写
    descriptor.value = () => {
        return 'descriptor.value';
    }
}


function visitDecorator(target: any, key: string, descriptor: PropertyDescriptor) {
    descriptor.writable = false;
}


function personDecorator(constructor: any){
    constructor.prototype.getName = () => {
        console.log('lzc');
    }
    console.log('testDecorator.....', constructor);
}

// 类的装饰器
@personDecorator
class Person {
  
    // 属性装饰器
    @nameDecorator
    name = 'lzc';
    
    age = 10;
    
    private _address: string;
    
    // 参数装饰器
    getName(@paramDecorator name: string, age: number){
        console.log(name, age);
    }
    
    // 方法装饰器
    @getAgeDecorator
    getAge(){
      return this.age;
    }
    
    
    get address(){
        return this._address;
    }

    // 访问器装饰器
    @visitDecorator
    set address(ad:string){
        this._address = ad;
    }
}

const p = new Person();
p.getName('lzc', 26);
```

