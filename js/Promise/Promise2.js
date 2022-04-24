const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(fn) {
    try {
      fn(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }
  state = PENDING;
  value = null;
  reason = null;
  fulfilledQueue = [];
  rejectedQueue = [];

  resolve = (value) => {
    // 只处理pending状态，一旦状态变更，则不可逆转
    if (this.state === PENDING) {
      this.state = FULFILLED;
      this.value = value;
      while (this.fulfilledQueue.length) {
        const onFulfilled = this.fulfilledQueue.shift();
        onFulfilled();
      }
    }
  };
  reject = (reason) => {
    if (this.state === PENDING) {
      this.state = REJECTED;
      this.reason = reason;
      while (this.rejectedQueue.length) {
        const onRejected = this.rejectedQueue.shift();
        onRejected();
      }
    }
  };
  then(onFulfilled, onRejected) {
    const isFun = (value) => typeof value === 'function';
    if (!isFun(onFulfilled)) {
      onFulfilled = (x) => x;
    }
    if (!isFun(onRejected)) {
      onRejected = (x) => x;
    }
    // resolve 逻辑集中处理
    const resolveFun = (promise, result, resolve, reject) => {
      if (promise === result) {
        throw new Error('cannot return to itself');
      }
      if (result instanceof MyPromise) {
        // .then的回调如果返回的又是一个Promise对象，则会在该Promise对象resolve时resolve，reject时reject
        result.then(resolve, reject);
      } else {
        // 如果返回的不是Promise对象，则将其resolve
        resolve(result);
      }
    };
    const resultPromise = new MyPromise((resolve, reject) => {
      const fulfilledMicrotask = () => {
        queueMicrotask(() => {
          try {
            const r = onFulfilled(this.value);
            resolveFun(resultPromise, r, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      };
      const rejectedMicrotask = () => {
        queueMicrotask(() => {
          try {
            const r = onRejected(this.value);
            resolveFun(resultPromise, r, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      };
      if (this.state === FULFILLED) {
        fulfilledMicrotask();
      } else if (this.state === REJECTED) {
        rejectedMicrotask();
      } else {
        // 当处于pending状态时，和前两状态不同，此时then中的回调不能立即执行，压缩数组，等待resolve调用后执行
        this.fulfilledQueue.push(fulfilledMicrotask);
        this.rejectedQueue.push(rejectedMicrotask);
      }
    });
    return resultPromise;
  }
  catch(callback) {
    return this.then(null, callback);
  }
  finally(callback) {
    return this.then(
      (data) => {
        callback();
        return data;
      },
      (error) => {
        callback();
        throw error;
      }
    );
  }
  all(promises) {
    return new MyPromise((resolve, reject) => {
      // 如果Promise.all接收到的是一个空数组([])，它会立即决议。
      if (!promises.length) {
        resolve([]);
      }
      let result = [];
      let resolvedPro = 0;
      for (let index = 0, length = promises.length; index < length; index++) {
        Promise.resolve(promises[index]).then(
          (data) => {
            // 注意，这里要用index赋值，而不是push。因为要保持返回值和接收到的promise的位置一致性。
            result[index] = data;
            if (++resolvedPro === length) {
              resolve(result);
            }
          },
          (error) => {
            reject(error);
          }
        );
      }
    });
  }
  all(promiseList) {
    return new MyPromise((resolve, reject) => {
      if (!promiseList.length) {
        resolve([]);
      }
      let result = [];
      let resolvedNum = 0;
      const length = promiseList.length;
      for (let index = 0; index < length; index++) {
        Promise.resolve(promiseList[index]).then(
          (value) => {
            // 注意，这里要用index赋值，而不是push。因为要保持返回值和接收到的promise的位置一致性。
            result[index] = value;
            // 这里不能使用index，因为最后index完成的promise不代表是最后一个完成的Promise，完成顺序未定
            if (++resolvedNum === length) {
              resolve(result);
            }
          },
          (error) => {
            reject(error);
          }
        );
      }
    });
  }
  // 实现静态方法 Promise.resolve
  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    }
    return new Promise((resolve) => resolve(value));
  }
  static rejected(reason) {
    return new Promise((resolve, rejected) => rejected(reason));
  }
}

const p = new Promise((resolve, reject) => {
  reject(100);
});
p.then((res) => {
  console.log(res, 1);
})
  .catch((err) => {
    console.log(err, 2);
    return new Promise((resolve, reject) => {
      //   resolve(12);
      reject(12);
    });
  })
  .then((res) => {
    console.log(res, 3);
  })
  .catch((err) => {
    console.log(err, 4);
  });
