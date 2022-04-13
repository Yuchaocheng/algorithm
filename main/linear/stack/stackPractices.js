/*
 * @Description: 栈结构练习题
 * @Autor: ycc
 * @Date: 2022-04-11 20:52:51
 * @LastEditTime: 2022-04-13 10:35:58
 */

/**
 * @description: 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。
 *              1. 左括号必须用相同类型的右括号闭合。 2.左括号必须以正确的顺序闭合。
 * @param {*} s
 * @return {*}
 */

// 栈结构经典例题
var isValid = function (s) {
  const stack = [];
  const leftTypes = ['(', '{', '['];
  const rightTypes = [')', '}', ']'];
  const map = {
    '{': '}',
    '(': ')',
    '[': ']',
  };
  const len = s.length;
  for (let i = 0; i < len; i++) {
    const c = s[i];
    if (leftTypes.includes(c)) {
      stack.push(c);
      continue;
    }
    if (rightTypes.includes(c)) {
      // 情况2：右括号没人匹配
      if (!stack.length) {
        return false;
      }
      const popC = stack.pop();
      // 情况3：匹配顺序出错
      if (map[popC] !== c) {
        return false;
      }
      continue;
    }
    // 出现了其他字符
    return false;
  }
  // 情况1：左括号没有匹配完
  return stack.length === 0;
};

/**
 * @description: 删除字符串中的所有相邻重复项
 * @param {*} s
 * @return {*}
 */
var removeDuplicates = function (s) {
  const len = s.length;
  if (len < 2) {
    return s;
  }
  const stack = [];
  for (let i = 0; i < len; i++) {
    if (!stack.length) {
      stack.push(s[i]);
      continue;
    }
    if (stack[stack.length - 1] === s[i]) {
      //重复了
      stack.pop();
    } else {
      //未重复
      stack.push(s[i]);
    }
  }
  return stack.join('');
};

/**
 * @description: 根据 逆波兰表示法，求表达式的值
 *               有效的算符包括 +、-、*、/(两个整数之间的除法只保留整数部分)
 *               可以认为给出的表达式都是有效的
 * @param {*} tokens
 * @return {*}
 */
// 该题和删除重复字符是非常像的，都是消除字符的题目
var evalRPN = function (tokens) {
  const stack = [];
  const len = tokens.length;
  const set = new Set(['+', '-', '*', '/']);
  for (let i = 0; i < len; i++) {
    const c = tokens[i];
    if (set.has(c)) {
      // 注意点：先pop出来的是第二个运算数，顺序不能出错，减法和除法都是和顺序有关的
      const c2 = stack.pop();
      const c1 = stack.pop();
      stack.push(calculate(c1, c2, c));
    } else {
      stack.push(c);
    }
  }
  return stack.pop();
};
var calculate = function (c1, c2, type) {
  switch (type) {
    case '+': {
      return Number(c1) + Number(c2); // 注意点：因为题目中给出的示例都是字符串，所以这里+法要转成数字
    }
    case '-': {
      return c1 - c2;
    }
    case '*': {
      return c1 * c2;
    }
    case '/': {
      return parseInt(c1 / c2); // 注意点：取整优先使用paseInt，Math.floor对于负数的取整和正数表现不一致
    }
  }
};

// 教程写法：思路一致，利用Map结构简化操作
var evalRPN2 = function (tokens) {
  const len = tokens.length;
  const stack = [];
  const map = new Map([
    ['+', (c1, c2) => c1 * 1 + c2 * 1], // 利用*1将字符串转为数字更加快速便捷
    ['-', (c1, c2) => c1 - c2],
    ['*', (c1, c2) => c1 * c2],
    ['/', (c1, c2) => parseInt(c1 / c2)],
  ]);
  for (let i = 0; i < len; i++) {
    const c = tokens[i];
    if (map.has(c)) {
      const c2 = stack.pop();
      const c1 = stack.pop();
      stack.push(map.get(c)(c1, c2));
    } else {
      stack.push(c);
    }
  }
  return stack.pop();
};
