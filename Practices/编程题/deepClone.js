/*
 * @Description: 实现一个深拷贝
 * @Autor: ycc
 * @Date: 2022-04-24 10:50:04
 * @LastEditTime: 2022-04-25 20:55:16
 *
 * 浅拷贝：两者共用一个内存地址，比如直接复制
 * 深拷贝：重新开辟了一块内存，将要拷贝的值放入其中
 * 很多方法都只实现了一层浅拷贝：比如...，Object.assign等
 * JSON.stringify的弊端：时间对象只是拷贝了字符串形式、function和undefined会丢失，正则会等到空对象等等
 */

// 获取精确类型
getType = (value) => {
  const s = Object.prototype.toString.call(value);
  // 取出最后的类型
  return s.replace(/^.+\s/, '').replace(']', '');
};

// 基础版本
const deepClone = (target, map = new Map()) => {
  // debugger
  // 防止循环引用，并且一定程度上做了缓存
  if (map.has(target)) {
    return map.get(target)
  }
  // 拷贝Object
  if (getType(target) === 'Object') {
    const cloneObj = {};
    map.set(target, cloneObj)
    Object.keys(target).forEach(key => {
      cloneObj[key] = deepClone(target[key], map)
    })
    return cloneObj;
  }
  // 拷贝Array
  if (Array.isArray(target)) {
    const cloneArr = [];
    map.set(target, cloneArr)
    const len = target.length;
    for (let i = 0; i < len; i++) {
      cloneArr[i] = deepClone(target[i], map);
    }
    return cloneArr;
  }

  // Function
  if (getType(target) === 'Function') {
    const cloneFun = new Function('return ' + target.toString()).call(this)
    map.set(target, cloneFun)
    return cloneFun
  }

  // Date
  if (getType(target) === 'Date') {
    const cloneDate = new Date(target.valueOf())
    map.set(target, cloneDate)
    return cloneFun
  }
  // RegExp
  if (getType(target) === 'RegExp') {
    const cloneRegExp = new RegExp(target)
    map.set(target, cloneRegExp)
    return cloneRegExp
  }

  // Set
  if (getType(target) === 'Set') {
    const cloneSet = new Set()
    map.set(target, cloneSet)
    for (const item of target.values()) {
      cloneSet.add(deepClone(item, map))
    }
    return cloneSet
  }

  // Map
  if (getType(target) === 'Map') {
    const cloneMap = new Map()
    map.set(target, cloneMap)
    for (const [key, value] of target.entries()) {
      cloneSet.set(key, deepClone(value, map))
    }
    return cloneMap
  }

  // 其他类型，不需要特殊处理的基本类型，直接返回
  map.set(target, target)
  return target
};

const cloneFun = function (fn) {
  return new Function('return ' + fn.toString()).call(this)
}



const getType = (value) => {
  const r = Object.prototype.toString.call(value)
  r.replace(/^.+\s/, '').replace(']', '')
}

const cloneDeep = (target, map = new Map()) => {

  // 解决循环引用问题，也有一定缓存的效果
  if (map.has(target)) {
    return map.get(target)
  }

  // Object
  if (getType(target) === 'Object') {
    const cloneObj = {}
    map.set(target, cloneObj)
    Object.keys(target).forEach(key => {
      cloneObj[key] = cloneDeep(target[key], map)
    })
    return cloneObj
  }
  // Array
  if (getType(target) === 'Array') {
    const cloneArr = []
    map.set(target, cloneArr)
    const len = target.length
    for (let i = 0; i < len; i++) {
      cloneArr[i] = cloneDeep(target[i], map)
    }
    return cloneArr
  }
  // Function
  if (getType(target) === 'Function') {
    const cloneFun = new Function('return ' + target.toString()).call(this)
    map.set(target, cloneFun)
    return cloneFun
  }

  //Date
  if (getType(target) === 'Date') {
    const cloneDate = new Date(target.valueOf())
    map.set(target, cloneDate)
    return cloneDate
  }

  //RegExp
  if (getType(target) === 'RegExp') {
    const cloneRegExp = new RegExp(target)
    map.set(target, cloneRegExp)
    return cloneRegExp
  }

  // Map
  if (getType(target) === 'Map') {
    const cloneMap = new Map()
    map.set(target, cloneMap)
    for (const [key, value] of cloneMap.entries()) {
      cloneMap.set(key, cloneDeep(value, map))
    }
    return cloneRegExp
  }
  // Set
  if (getType(target) === 'Map') {
    const cloneSet = new Set()
    map.set(target, cloneSet)
    for (const value of cloneSet.values()) {
      cloneSet.add(cloneDeep(value, map))
    }
    return cloneSet
  }

  //其他类型，为基本类型，不需要特殊处理，直接返回target即可，函数传参时已经深拷贝了一份
  map.set(target, target)
  return target
}



function testDeepClone() {
  const obj = {
    a: 1,
    b: '2',
    c: undefined,
    d: null,
    e: {
      e1: 'e1',
    },
    f: ['f1'],
    g() {
      console.log(this, 'this');
    },
  };
  obj.x = obj;
  const obj2 = deepClone(obj);
}