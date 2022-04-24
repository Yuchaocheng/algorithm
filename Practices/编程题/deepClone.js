/*
 * @Description: 实现一个深拷贝
 * @Autor: ycc
 * @Date: 2022-04-24 10:50:04
 * @LastEditTime: 2022-04-24 12:02:20
 *
 * 浅拷贝：两者共用一个内存地址，比如直接复制
 * 深拷贝：重新开辟了一块内存，将要拷贝的值放入其中
 * 很多方法都只实现了一层浅拷贝：比如...，Object.assign等
 * JSON.stringify的弊端：时间对象只是拷贝了字符串形式、function和undefined会丢失，正则会等到空对象等等
 */

// 引用类型判断
const isObj = (value) => {
  const type = typeof value;
  return (type === 'object' || type === 'function') && type !== null;
};

// 获取精确类型
getType = (value) => {
  const s = Object.prototype.toString.call(value);
  // 取出最后的类型
  return s.replace(/^.=\s/).replace(']');
};

// 基础版本
const deepClone = (obj, map = new Map()) => {
  if (!isObj) {
    // 基本类型的值在函数参数传递时，已经复制了一块内存地址，拷贝了值
    return obj;
  }
  // Object
  if (Object.prototype.toString.call(obj) === '[object Object]') {
    const cloneObj = {};
    for (const key in obj) {
      cloneObj[key] = deepClone(obj[key]);
    }
    return cloneObj;
  }
  // Array
  if (Array.isArray(obj)) {
    const cloneArr = [];
    const len = obj.length;
    for (let i = 0; i < len; i++) {
      cloneArr[i] = deepClone[obj[i]];
    }
    return obj;
  }
  // Function

  // Date

  // Set

  // Map

  return obj;
};
