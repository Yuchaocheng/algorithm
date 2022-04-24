/*
 * @Description: 手写Promise二刷
 * @Autor: ycc
 * @Date: 2022-04-15 09:01:46
 * @LastEditTime: 2022-04-15 10:33:49
 */

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
class MyPromise {
  state = PENDING;
  value = null;
  reason = null;
  // 注意，将fulfilled或者rejected存储为一个队列，不是因为.then的链式调用，.then的链式调用会生成一个新的Promise，不需要存储为队列
  // 这里的目的是promise实例对象的then方法时可以被多次重复调用的，每次调用也可传入不同的回调，设置为队列存储时为了执行每一个调用then方法
  // 传入的回调，并且给回调函数传入参数值value
  fulfilledCbQueue = [];
  rejectedCbQueue = [];
  constructor(fn) {
    try {
      fn(this.resolve, this.reject);
    } catch (err) {
      this.reject(err);
    }
  }
  // 使用箭头函数，当resolve在外部被调用时，依然指向Promise实例
  resolve = (value) => {
    // 状态一旦变更则不再处理
    if (this.state === PENDING) {
      this.state = FULFILLED;
      this.value = value;
      while (this.fulfilledCbQueue.length) {
        // 注意：这里的fulfilled回调并不是外界传入then的函数，而是经过了包装的，所以不必传参，传参在包装时传入
        const fulfilledCb = this.fulfilledCbQueue.shift();
        fulfilledCb();
      }
    }
  };
  reject = (reason) => {
    if (this.state === PENDING) {
      this.state = REJECTED;
      this.reason = reason;
      while (this.rejectedCbQueue.length) {
        // 注意：这里的fulfilled回调并不是外界传入then的函数，而是经过了包装的，所以不必传参，传参在包装时传入
        const rejectedCb = this.rejectedCbQueue.shift();
        rejectedCb();
      }
    }
  };
  then(fullfilledCb, rejectedCb) {
    const isFun = (fn) => typeof fn === 'function';
    // 不是函数自己创建一个函数
    if (!isFun(fullfilledCb)) {
      fullfilledCb = (x) => x;
    }
    if (!isFun(rejectedCb)) {
      rejectedCb = (x) => x;
    }
    // resolve 逻辑集中处理
    const resolveFn = (promise, result, resolve, reject) => {
      if (promise === result) {
        throw new Error('cannot return itself');
      }
      if (result instanceof MyPromise) {
        result.then(resolve, reject);
      } else {
        resolve(result);
      }
    };
    const thenPromise = new MyPromise((resolve, reject) => {
      const fullfilledCbMicroTask = () => {
        // 利用queueMicrotask创建微任务
        queueMicrotask(() => {
          try {
            // 当我们链式调用then方法时，会生成一个新的Promise，this.value同样会被新Promise的resolve传值取代
            // 这里的resolve多次传入fullfilledCb是为了Promise实例的then方法被多次调用，而不是链式调用
            const r = fullfilledCb(this.value);
            resolveFn(thenPromise, r, resolve, reject);
          } catch (reason) {
            reject(reason);
          }
        });
      };
      const rejectedCbCbMicroTask = () => {
        queueMicrotask(() => {
          try {
            const r = rejectedCb(this.reason);
            resolveFn(thenPromise, r, resolve, reject);
          } catch (reason) {
            reject(reason);
          }
        });
      };
      // pengding状态回调函数不能立即执行，压入队列
      if (this.state === PENDING) {
        this.fulfilledCbQueue.push(fullfilledCbMicroTask);
        this.rejectedCbQueue.push(rejectedCbCbMicroTask);
      } else if (this.state === FULFILLED) {
        fullfilledCbMicroTask();
      } else {
        rejectedCbCbMicroTask();
      }
    });
    return thenPromise;
  }
  catch(rejectedCb) {
    return this.then(null, rejectedCb);
  }
  finally(cb) {
    this.then(
      (data) => {
        cb();
        // 如果在中间插入finally，return data不会影响后续的Promise调用
        return data;
      },
      (reason) => {
        cb();
        // 和上面return data同理
        throw new Error(reason);
      }
    );
  }
  static all(promiseArr) {
    if (!Array.isArray(promiseArr)) {
      throw new Error('need a Array');
    }
    const len = promiseArr.length;
    if (!len) {
      return MyPromise.resolve([]);
    }
    return MyPromise((resolve, reject) => {
      const result = [];
      let finishNum = 0;
      for (let i = 0; i < len; i++) {
        // 注意使用Promise.resolve将非Promise实例包装为Promise
        MyPromise.resolve(promiseArr[i]).then(
          (data) => {
            //注意不能push，因为执行结果要和执行顺序对齐，所以使用索引赋值
            // result.push(data);
            result[i] = data;
            // 执行Promise的顺序和Promise完成的顺序不一定一样，只有在Promise全部完成时才返回完成的结果
            if (++finishNum === len) {
              resolve(result);
            }
          },
          (reason) => {
            reject(reason);
          }
        );
      }
    });
  }
  // 类自身方法，只能通过类调用，不能通过实例对象调用
  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    } else {
      return new MyPromise((resolve) => resolve(value));
    }
  }
  static reject(reason) {
    return new MyPromise((resolve, reject) => reject(reason));
  }
}

const all = (promiseList) => {
  if (!Array.isArray(promiseList)) {
    throw new Error('nedd a Array');
  }
  const len = promiseList.length;
  const result = [];
  let finishNum = 0;
  return new Promise((resolve, reject) => {
    if (!len) {
      resolve([]);
    }

    for (let i = 0; i < len; i++) {
      Promise.resolve(promiseList[i]).then(
        (data) => {
          result[i] = data; //保证结果顺序和PromiseList顺序一致
          if (++finishNum === len) {
            resolve(result);
          }
        },
        (reason) => {
          reject(reason);
        }
      );
    }
  });
};
