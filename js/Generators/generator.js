/*
 * @Description: 实现generator函数
 * @Autor: ycc
 * @Date: 2022-04-18 08:09:05
 * @LastEditTime: 2022-04-18 09:13:36
 */

// 基础使用
function base() {
  function* g(x = 0) {
    setInterval(() => {
      console.log(x, 'x');
    }, 1000);
    console.log(this, 11);
    x = yield 1;
    const x2 = yield 2;
    yield 3;
    return 4;
  }
  const obj = { a: 1, g: g };
  const gen = obj.g(100);
  console.log(gen, 'gen'); //生成一个generator类型的变量，generator广义上也是对象

  console.log(gen.next(1)); // {value: 1, done: false}
  console.log(gen.next(2)); // {value: 2, done: false}
  //   console.log(gen.next()); // {value: 3, done: false}
  //   console.log(gen.next()); // {value: 4, done: true}
}
// base();
// 尝试手写
function try1() {
  // 根据传入函数做词法分析，将yield不同的部分放到switch case的各个case中
  // 这一步直接使用实例代替
  function myGenerator(fn, ...params) {
    // 上层变量：上下文信息
    var context = {
      prev: 0,
      next: 0,
      done: false,
    };
    function genMain(param) {
      context.prev = context.next;
      // case部分的逻辑，需要词法解析传入的函数，取每一步yield之前的代码，这里只做模拟
      switch (context.prev) {
        case 0: {
          // 第一部分代码接受的param是由调用generator的函数时传入，并不是由next函数传入
          context.next = 2;
          return 'result1';
        }
        case 2: {
          console.log(param, 1);
          context.next = 4;
          return 'result2';
        }
        case 4: {
          console.log(param, 2);
          context.next = 6;
          return 'result3';
        }
        case 6: {
          console.log(param, 3);
          context.done = true;
          return undefined;
        }
      }
    }
    // 调用generator函数后，可以调用返回值上的方法，所以判断返回值应该是个对象
    return {
      next(param) {
        param = context.next ? [param] : params;
        const value = genMain.apply(null, param);
        return {
          value,
          done: context.done,
        };
      },
    };
  }
  const g = myGenerator();
  console.log(g, 'g');
  console.log(g.next());
  console.log(g.next(1));
  console.log(g.next(2));
  console.log(g.next(3));
}
try1();
