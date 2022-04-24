/* Promise的基础使用，基础概念等等 */
function thenTest() {
  new Promise((resolve, reject) => {
    resolve(1);
    // 该错误是不会被捕获的，因为状态已经再上一句改变为fullfilled了，无法逆转
    throw new Error('出错了');
  })
    .then((res) => {
      console.log(res, 1);
      t();
    })
    .then((res) => {
      console.log(res, 2);
    })
    // .catch((err) => console.log(err))
    .then((res) => {
      console.log(res, 3);
    })
    .then((res) => {
      console.log(res, 'res33');
    });
}
// thenTest();

// Promise会吃掉错误，虽然错误被浏览器捕捉并打印出来了，但是程序的运行是不会终止的
function errorDeal() {
  const someAsyncThing = function () {
    return new Promise(function (resolve, reject) {
      // 下面一行会报错，因为x没有声明
      resolve(x + 2);
    });
  };

  someAsyncThing().then(function () {
    console.log('everything is great');
  });

  setTimeout(() => {
    console.log(123);
  }, 2000);
  // Uncaught (in promise) ReferenceError: x is not defined
  // 123
}

// Promise.resolve 和 Promis.reject 测试
function pTest() {
  // 情况1：参数是一个Promise实例
  const p = new Promise((resolve, reject) => reject(1));
  const p1 = Promise.resolve(p)
    .then((res) => console.log(res, 1))
    .catch((err) => console.log(err, 2));
  console.log(p1);
  // 一开始就是rejected状态
  Promise.reject(p)
    .then((res) => console.log(res, 1))
    .catch((err) => console.log(err, 2));
}
// pTest();

// Promise this指向的问题，之前一直没考虑这个问题
function promiseThis() {
  const p = new Promise(function (resolve, reject) {
    console.log(1);
    resolve(1);
  });
  const p2 = p.then();
  console.log(p2);
  console.log(2);
}
// promiseThis();

// Promise的链式调用

function PLinkTest() {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('success');
    }, 2000);
  });
  console.log(promise, 111);

  promise.catch((value) => {
    console.log(1);
    console.log('resolve', value);
  });
  promise.catch((value) => {
    console.log(1);
    console.log('resolve', value);
  });
  //   promise.then((value) => {
  //     console.log(1);
  //     console.log('resolve', value);
  //     return 'success success';
  //   });

  //   promise.then((value) => {
  //     console.log(2);
  //     console.log('resolve', value);
  //   });

  //   promise.then((value) => {
  //     console.log(3);
  //     console.log('resolve', value);
  //   });
  const p = new Promise((reslve, reject) => {
    setTimeout(() => {
      resolve(3);
    }, 1000);
  });

  p.then();
}

// PLinkTest();
