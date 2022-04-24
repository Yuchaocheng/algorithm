/*
 * @Description: 回溯算法刷题
 * @Autor: ycc
 * @Date: 2022-04-23 20:58:10
 * @LastEditTime: 2022-04-24 09:19:34
 */

/**
 * @description: 组合：给定两个整数n和k，返回范围[1,n]中所有可能的k个数的组合
 * @param {*} n
 * @param {*} k
 * @return {*}
 */
var combine = function (n, k) {
  const res = [];
  const path = [];
  const backtrack = (start, end, k) => {
    // 递归终止
    if (k < 1) {
      res.push([...path]);
      return;
    }
    // 控制树的横向遍历
    //如果剩余的数小于k，那么就没有循环的必要了，必然不可能使k等于0，必然不可能填满该路径
    for (let i = start; i <= end - k + 1; i++) {
      path.push(i); // 处理节点
      backtrack(i + 1, end, k - 1); // 递归：控制树的纵向遍历，注意下一层搜索要从i+1开始
      path.pop(); // 回溯，撤销处理的节点
    }
  };
  backtrack(1, n, k);
  return res;
};

/**
 * @description: 组合总和 III：找出所有相加之和为 n 的 k 个数的组合，且满足下列条件：
 *               a. 只使用数字1到9； b.每个数字 最多使用一次
 *
 * @param {*} k
 * @param {*} n
 * @return {*}
 */
var combinationSum3 = function (k, n) {
  const res = [];
  const path = [];
  const backtrack = (start, end, k) => {
    if (k < 1) {
      const sum = path.reduce((pre, cur) => pre + cur, 0);
      if (sum === n) {
        res.push([...path]);
      }
      return;
    }
    for (let i = start; i <= end; i++) {
      path.push(i);
      // 没调用一次backtrack，k就减少1，并且要从i+1出开始查找，因为数字不能重复使用
      backtrack(i + 1, end, k - 1);
      path.pop(); // 回溯
    }
  };
  backtrack(1, 9, k);
  return res;
};

/**
 * @description: 电话号码的字母组合：给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。
 *               2-9映射的字母和电话号码一样
 * @param {*} digits
 * @return {*}
 */
// 法1：个人回溯解题
var letterCombinations = function (digits) {
  if (!digits.length) {
    return [];
  }
  digits = Array.from(digits);
  let s = '';
  const res = [];
  // 该map就是电话号码上数字和字母的映射关系，由题目给出
  const digitsMap = {
    2: 'abc',
    3: 'def',
    4: 'ghi',
    5: 'jkl',
    6: 'mno',
    7: 'pqrs',
    8: 'tuv',
    9: 'wxyz',
  };
  const backtrack = () => {
    if (!digits.length) {
      res.push(s);
      return;
    }
    const num = digits.shift();
    const chars = digitsMap[num];
    for (let i = 0; i < chars.length; i++) {
      s += chars[i];
      backtrack();
      // s -= chars[i]; //坑点：字符串不能这种形式删除最后一个字母，减法一定会被当做数字算法
      s = s.slice(0, s.length - 1);
    }
    digits.unshift(num);
  };
  // 不要忘记调用回溯函数
  backtrack();
  return res;
};

var letterCombinations2 = function (digits) {
  const len = digits.length;
  if (!len) {
    return [];
  }
  const res = [];
  const map = ['', '', 'abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz']; // 数组表示数字映射比对象高效
  const path = [];
  const backtracking = (index) => {
    if (path.length === len) {
      res.push(path.join(''));
      return;
    }
    const num = digits[index]
    for (const v of map[num]) {
      path.push(v);
      //这里也存在回溯，index的值在递归后增加，但是递归结束后无增加，因为传值中增加，而不是赋值
      backtracking(index + 1);
      path.pop(); // 回溯
    }
  };
  backtracking(0);
  return res
};
