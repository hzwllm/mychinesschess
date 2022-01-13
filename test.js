// 方法校验的几个函数
// function checktype(myobj,type){
//     return Object.prototype.toString.call(myobj).indexOf(type)>=0
// }
function typethrow(obj, type) {
    if (!(Object.prototype.toString.call(obj).indexOf(type) >= 0)) {
        throw `type error,need ${type}`
    }
}
class newvuedatamanage {
    constructor(obj) {
        typethrow(obj, 'Object')
        this.obj = obj
        // for(let k in obj){
        //     this[k]=obj[k]
        // }
    }
    // 获取时自动刷新
    get obj() {
        console.log(345678)
        return this
    }
    // 初始化赋值
    set obj(value) {
        // this.obj=value
        console.log(value)
        return this
    }
}
try {
    let c = new newvuedatamanage({})
    // c.obj
} catch (e) {
    console.log(234567)
    console.log(e)
}
const handler = {
    // 读取代理对象的原型时，该方法就会被调用
    getPrototypeOf: function (target) {
        console.log('原型上方法')
        return Reflect.getPrototypeOf(target)//obj或者null
    },
    // 方法主要用来拦截Object.setPrototypeOf().如果成功修改了[[Prototype]], setPrototypeOf 方法返回 true,否则返回 false.
    setPrototypeOf: function (target, prototype) {
        console.log('设置原型')
        // 不允许修改原型
        return false//boolean
    },
    // 方法用于拦截对对象的Object.isExtensible()
    isExtensible: function (target) {
        // 判断是否为可扩展对象，返回值要与Object.isExtensible()值预约
        console.log('可扩展')
        return true//boolean
    },
    // 拦截Object.preventExtensions()方法让一个对象变的不可扩展，也就是永远不能再添加新的属性
    preventExtensions: function () {
        console.log('called');
        Object.preventExtensions(target);
        return true;//boolean
    },
    // 是 Object.getOwnPropertyDescriptor()  的钩子,获取是否有该自有属性，不查找原型链
    getOwnPropertyDescriptor: function (target, prop) {
        //         getOwnPropertyDescriptor 必须返回一个 object 或 undefined。
        // 如果属性作为目标对象的不可配置的属性存在，则该属性无法报告为不存在。
        // 如果属性作为目标对象的属性存在，并且目标对象不可扩展，则该属性无法报告为不存在。
        // 如果属性不存在作为目标对象的属性，并且目标对象不可扩展，则不能将其报告为存在。
        // 属性不能被报告为不可配置，如果它不作为目标对象的自身属性存在，或者作为目标对象的可配置的属性存在。
        // Object.getOwnPropertyDescriptor（target）的结果可以使用 Object.defineProperty 应用于目标对象，也不会抛出异常。
        console.log('获取自有属性' + prop)
        // console.log(prop)
        // if(prop==='length'){
        //     return undefined
        // }
        return Reflect.getOwnPropertyDescriptor(target,prop)
        // return {
        //     configurable: true,
        //     enumerable: true,
        //     value: 10
        // };//obj,ownprop
    },
    // handler.defineProperty() 用于拦截对对象的 Object.defineProperty() 操作
    defineProperty: function (target, property, descriptor) {
        console.log('called: ' + property);
        return true;//boolean
        // 如果目标对象不可扩展， 将不能添加属性。
        // 不能添加或者修改一个属性为不可配置的，如果它不作为一个目标对象的不可配置的属性存在的话。
        // 如果目标对象存在一个对应的可配置属性，这个属性可能不会是不可配置的。
        // 如果一个属性在目标对象中存在对应的属性，那么 Object.defineProperty(target, prop, descriptor) 将不会抛出异常。
        // 在严格模式下， false 作为 handler.defineProperty 方法的返回值的话将会抛出 TypeError 异常.

    },
    // handler.has() 方法是针对 in 操作符的代理方法。
    has: function (target, prop) {
        //         如果目标对象的某一属性本身不可被配置，则该属性不能够被代理隐藏.
        // 如果目标对象为不可扩展对象，则该对象的属性不能够被代理隐藏
        console.log('called: ' + prop);
        return true;//boolean
    },
    // handler.get() 方法用于拦截对象的读取属性操作。receiver Proxy或者继承Proxy的对象
    get: function (target, prop, receiver) {
        //         如果要访问的目标属性是不可写以及不可配置的，则返回的值必须与该目标属性的值相同。
        // 如果要访问的目标属性没有配置访问方法，即get方法是undefined的，则返回值必须为undefined。
        // console.log("called:get " + prop);
        
        return target[prop]; //value
    },
    // handler.set() 方法是设置属性值操作的捕获器。新属性值。receiver最初被调用的对象。通常是 proxy 本身，但 handler 的 set 方法也有可能在原型链上，或以其他方式被间接地调用（因此不一定是 proxy 本身）。
    set: function (target, prop, value, receiver) {
        //         若目标属性是一个不可写及不可配置的数据属性，则不能改变它的值。
        // 如果目标属性没有配置存储方法，即 [[Set]] 属性的是 undefined，则不能设置它的值。
        // 在严格模式下，如果 set() 方法返回 false，那么也会抛出一个 TypeError 异常。
        target[prop] = value;
        console.log('property set: ' + prop + ' = ' + value);
        return true; //boolean
    },
    // handler.deleteProperty() 方法用于拦截对对象属性的 delete 操作。target目标对象。property待删除的属性名
    deleteProperty: function (target, property) {
        // 如果目标对象的属性是不可配置的，那么该属性不能被删除
        console.log('called:delete ' + property);
        return true;//booble
    },
    // handler.ownKeys() 方法用于拦截 Reflect.ownKeys().
    ownKeys: function (target) {
        //         ownKeys 的结果必须是一个数组.
        // 数组的元素类型要么是一个 String ，要么是一个 Symbol.
        // 结果列表必须包含目标对象的所有不可配置（non-configurable ）、自有（own）属性的key.
        // 如果目标对象不可扩展，那么结果列表必须包含目标对象的所有自有（own）属性的key，不能有其它值.
        console.log('called:ownKeys');
        // let keys=['length']
        // // console.log(target)
        // for(let i in target){
        //     keys.push(i)
        //     console.log(target[i])
        //     console.log(i)
        // }

        return Reflect.ownKeys(target);
    },
    // handler.apply() 方法用于拦截函数的调用。target目标对象（函数）。thisArg被调用时的上下文对象。argumentsList被调用时的参数数组。
    apply: function (target, thisArg, argumentsList) {
        // apply方法可以返回任何值。
        // proxy(...args)
        // Function.prototype.apply() 和 Function.prototype.call()
        // Reflect.apply()
        // 如果违反了以下约束，代理将抛出一个TypeError：
        // target必须是可被调用的。也就是说，它必须是一个函数对象。
        console.log('called: ' + argumentsList.join(', '));
        return argumentsList[0] + argumentsList[1] + argumentsList[2];
    },
    // handler.construct() 方法用于拦截new 操作符. 为了使new操作符在生成的Proxy对象上生效，用于初始化代理的目标对象自身必须具有[[Construct]]内部方法（即 new target 必须是有效的）。
    // target目标对象。
    // constructor的参数列表
    // newTarget最初被调用的构造函数，就上面的例子而言是p。
    construct: function(target, argumentsList, newTarget) {
        console.log('called: ' + argumentsList.join(', '));
        return { value: argumentsList[0] * 10 }//construct 方法必须返回一个对象。
    }
}
let c={}
let p = new Proxy(c, handler)
p.a=12345
p[1]=12345
p[0]=1234
console.log(p)
Object.keys(p)
p.toString()
console.log(p)
console.log(Object.keys(p))
// p.forEach(element => {
//     console.log(element,23456789)
// })
console.log(p.forEach,2345678)
p.construct
p.toString()
console.log(p.toString())
Object.getPrototypeOf(p)
console.log(Object.getPrototypeOf(p))