/*
 * @Description: 学习generaor语法
 * @Autor: ycc
 * @Date: 2022-04-15 11:32:40
 * @LastEditTime: 2022-04-15 11:46:06
 */

function base() {
  function* helloWorldGenerator() {
    yield 'hello';
    yield 'world';
    return 'ending';
  }
}
