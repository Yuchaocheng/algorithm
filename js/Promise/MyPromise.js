// 先定义三个常量表示状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

const isObj = (value) => Object.prototype.toString.call(value) === '[object Object]';
const isFun = (value) => Object.prototype.toString.call(value) === '[object Function]';

// 当执行onFulfilled时，不能单纯把结果resolve，需要考虑两种特殊情况，第一，返回值就是自身
function resolvePromise(promise2, result, resolve, reject) {
  // 如果相等了，说明return的是自己，抛出类型错误并返回
  if (promise2 === result) {
    // return reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
    // 更容易记住
    return reject(new TypeError('Cannot return to itself'));
  }
  // 如果result本来就是Promise实例对象，则将该result重新包装为一个新的Promise，该Promise在result，resolve时resolve
  // 以下代码就实现了这一点，result.then会在result，resolve时调用then的第一个回调函数，调用后promise2 resolve
  if (result instanceof MyPromise) {
    result.then(resolve, reject);
  } else {
    resolve(result);
  }
}
class MyPromise {
  constructor(fn) {
    this.onFulfilledQueue = []; // fullfilled队列
    this.onRejectedQueue = []; // rejected队列
    // 传入的函数是立即执行的
    try {
      fn(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }
  state = PENDING;
  value = null; //成功之后的值
  reason = null; //失败之后的值

  resolve = (value) => {
    // 只有状态是等待，才执行状态修改，这也意味着，一旦状态变更后，重复调用resolve或者reject是没有意义的
    if (this.state === PENDING) {
      this.state = FULFILLED;
      this.value = value;
      // 当resolve后，需要把回调数组内的函数全部执行一遍，这是多次调用.then的要求
      // 如果只执行队列第一个函数，那么后面的.then都不会执行了（在resolve是异步时，即resolve晚于.then）
      while (this.onFulfilledQueue.length) {
        const onFulfilled = this.onFulfilledQueue.shift();
        onFulfilled(value);
      }
    }
  };
  reject = (reason) => {
    if (this.state === PENDING) {
      this.reason = reason;
      this.state = REJECTED;
      while (this.onRejectedQueue.length) {
        const onRejected = this.onRejectedQueue.shift();
        onRejected(reason);
      }
    }
  };
  then(onFulfilled, onRejected) {
    /* onFulfilled 和 onRejected有可能未传入函数，未传入函数时，给一个默认函数
       还有一种处理是未传入函数时，不执行回调，但是那样会违背一个Promise一定是一个微任务的原则
       并且可能会有多处判断，所以这里还是选择使用默认函数
    */
    if (!isFun(onFulfilled)) {
      onFulfilled = (value) => value;
    }
    if (!isFun(onRejected)) {
      onRejected = (value) => value;
    }
    // 在之前逻辑的基础上，返回一个新的Promise
    const promise2 = new MyPromise((resolve, reject) => {
      // onFulfilled 微任务创建
      const fulFilledMicrotask = () => {
        // 使用queueMicrotask创造一个微任务
        queueMicrotask(() => {
          try {
            let result = onFulfilled(this.value);
            resolvePromise(promise2, result, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };
      const rejectedMicrotask = () => {
        queueMicrotask(() => {
          try {
            let result = onRejected(this.reason);
            resolvePromise(promise2, result, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };
      if (this.state === FULFILLED) {
        fulFilledMicrotask();
      } else if (this.state === REJECTED) {
        rejectedMicrotask();
      } else {
        // 这里不能简单的push onFulfilled，因为后面执行回调时，需要同步resolve或者reject，类似resolve或者reject的递归调用
        this.onFulfilledQueue.push(fulFilledMicrotask);
        this.onRejectedQueue.push(rejectedMicrotask);
      }
    });
    return promise2;
  }
  // 在类内部使用箭头函数定义一个方法，可以让方法的this指向当前实例，无论该方法被谁调用了，讨论结束
  test = () => {
    console.log(this, 'this');
  };

  // 实现 静态方法 Promise.resolve方法，即只能通过类调用，而不能通过实例对象调用
  static resolve(value) {
    // 如果是Promise实例就直接返回
    if (value instanceof MyPromise) {
      return value;
    }
    return new MyPromise((resolve) => resolve(value));
  }
  static reject(reason) {
    return new MyPromise((resolve, reject) => reject(reason));
  }
}
// PromiseA + 规范要求添加的方法
// MyPromise.deferred = function () {
//   var result = {};
//   result.promise = new MyPromise(function (resolve, reject) {
//     result.resolve = resolve;
//     result.reject = reject;
//   });
//   return result;
// };
// module.exports = MyPromise;

// 第一步，实现基础的Promise
function test1(success = true) {
  const promise = new MyPromise((resolve, reject) => {
    if (success) {
      resolve('success');
    } else {
      setTimeout(() => {
        reject('error');
      }, 1000);
    }
  });
  promise.then(
    (res) => {
      console.log(res, 'resolve1');
    },
    (reason) => {
      console.log(reason, 'reject1');
    }
  );

  promise.then(
    (res) => {
      console.log(res, 'resolve2');
    },
    (reason) => {
      console.log(reason, 'reject2');
    }
  );
  promise.test();
}

//
// test1();

// 第二步，实现then方法的链式调用

function test2(success = true) {
  const promise = new MyPromise((resolve, reject) => {
    // 目前这里只处理同步的问题
    // resolve('success');

    setTimeout(() => {
      resolve('success');
    }, 1000);
  });
  promise
    .then((value) => {
      console.log(1);
      console.log(value, 'resolve');
      return 'success2';
    })
    .then((value) => {
      console.log(2);
      console.log(value, 'resolve');
    });
}

// test2();

// 第三步，错误处理
function test3() {
  const promise = new MyPromise((resolve, reject) => {
    throw new Error('出错了');
  });
  promise.then(
    (value) => {
      console.log(1);
      console.log('resolve', value);
    },
    (reason) => {
      console.log(2);
      console.log(reason.message);
    }
  );
  const promise2 = new MyPromise((resolve, reject) => {
    resolve('success');
  });
  // 第一个then方法中的错误要在第二个then方法中捕获到
  promise2
    .then(
      (value) => {
        console.log(1);
        console.log('resolve', value);
        throw new Error('then error');
      },
      (reason) => {
        console.log(2);
        console.log(reason.message);
      }
    )
    .then(
      (value) => {
        console.log(3);
        console.log(value);
      },
      (reason) => {
        console.log(4);
        console.log(reason.message);
        console.log(reason);
      }
    );
}
// test3();

// 如何把一个Promise重新包装成一个相同的Promise
function test4() {
  const p1 = new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, 1000);
  });
  p1.then((res) => {
    console.log(res, 1);
    return p1;
  }).then((res) => {
    console.log(res, '222');
  });
  const p2 = new Promise((resolve, reject) => {
    p1.then(resolve, reject);
  });
  p2.then((res) => {
    console.log(res, 2);
  });
}
// test4();

// 测试Promise.then返回自身，是会报错的。因为如果返回一个Promise，应该自身根据返回值创建一个Promise，而返回值本来就是自身，一个不确定的Promise
// 这种情况会让逻辑变得奇怪，所以报错
function test5() {
  const promise = new Promise((resolve, reject) => {
    resolve(100);
  });
  const p1 = promise.then((value) => {
    console.log(value);
    return p1;
  });
}
// test5();

function test6(useSelf = true) {
  const className = useSelf ? MyPromise : Promise;
  const p = new className((resolve, reject) => {
    reject(100);
  });
  p.then(
    (res) => {
      console.log(1);
      console.log(res);
      return 1;
    },
    (err) => {
      console.log(2);
      console.log(err);
      return 2;
    }
  ).then(
    (res) => {
      console.log(11);
      console.log(res);
      return 11;
    },
    (err) => {
      console.log(22);
      console.log(err);
      return 22;
    }
  );
}
// test6(false);

// 测试参数可选
function test7(useSelf = true) {
  const className = useSelf ? MyPromise : Promise;
  const promise = new className((resolve, reject) => {
    resolve(100);
  });

  promise
    .then()
    .then()
    .then()
    .then((value) => console.log(value));
}
// test7(false);
// test7(true);

// 测试Promise.resolve和Promise.reject
function test8() {
  MyPromise.resolve()
    .then(() => {
      console.log(0);
      return MyPromise.resolve(4);
    })
    .then((res) => {
      console.log(res);
    });
  MyPromise.reject(1).then(
    (value) => {
      console.log(value, 11);
    },
    (reason) => {
      console.log(reason, 22);
    }
  );
}
test8();
