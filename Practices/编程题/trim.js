/*
 * @Description: 实现一个trim方法
 * @Autor: ycc
 * @Date: 2022-04-24 09:22:20
 * @LastEditTime: 2022-04-24 10:46:42
 */

// 核心思路：使用两遍快慢指针，一遍从头，一遍从尾：错误！！！，从尾部开始不要考虑快慢指针，无法使用.leng删除
function trimError(s) {}

/**
 * @description: 核心思路：双指针
 *               开始指针只要当前项为空，就等于当前i+1，直到遇到不为空的，统计结束；
 *               结束指针：遇到不为空的，结束指针等于当前指针，这样结束指针一定是最后一个不为空的指针
 * @param {*} s
 * @return {*}
 */
const trim = (s) => {
  let startI = 0;
  let endI = s.length - 1;
  let startFlag = false;
  const len = s.length;
  for (let i = 0; i < len; i++) {
    if (s[i] === ' ') {
      if (!startFlag) {
        // +1才是起始非空格的索引
        startI = i + 1;
      }
    } else {
      endI = i;
      startFlag = true;
    }
  }
  return s.slice(startI, endI + 1);
};
console.log(trim('  123     '));

//正则：正则处理非常简单
const trim2 = (s) => {
  return s.replace(/^\s+/, '').replace(/\s+$/, '');
};
