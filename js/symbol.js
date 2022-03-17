function classTest() {
  // 所以个人理解Symbol本身就是一个常量了，一般不会去改它的值，没有意义
  const colorSymbol = Symbol('color');
  class Test {
    #p = 3;
    constructor() {
      this[colorSymbol] = 'while';
    }
    changeColor(color) {
      this[colorSymbol] = color;
    }
    getColor() {
      return this[colorSymbol];
    }
  }
  let t1 = new Test();
  let t2 = new Test();
  console.log(t1['#p']);
  console.log((t1['#p'] = 3));

  t1.changeColor('red');
  t2.changeColor('black');
  console.log(t1);
  const symbols = Object.getOwnPropertySymbols(t1);
  console.log(symbols[0]);
  console.log(symbols['color']);
  console.log(t2);
}
classTest();
