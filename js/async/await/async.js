/*
 * @Description: async/await原理解析
 * @Autor: ycc
 * @Date: 2022-04-18 09:24:19
 * @LastEditTime: 2022-04-18 09:30:59
 */

function run(gen) {
  var g = gen(); //由于每次gen()获取到的都是最新的迭代器,因此获取迭代器操作要放在step()之前,否则会进入死循环

  function step(val) {
    //封装一个方法, 递归执行next()
    var res = g.next(val); //获取迭代器对象，并返回resolve的值
    if (res.done) return res.value; //递归终止条件
    res.value.then((val) => {
      //Promise的then方法是实现自动迭代的前提
      step(val); //等待Promise完成就自动执行下一个next，并传入resolve的值
    });
  }
  step(); //第一次执行
}
