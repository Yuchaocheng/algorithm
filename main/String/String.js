/*
 * @Description: 字符串类型练习题
 * @Autor: ycc
 * @Date: 2022-03-31 09:53:43
 * @LastEditTime: 2022-04-11 10:48:19
 */

/**
 * @description: 反转字符串： 将输入的字符串反转过来。输入字符串以字符数组 s 的形式给出
 * @param {*} s
 * @return {*}
 */
// 第一种直接调用数组的reverse方法
var reverseString = function (s) {
  return s.reverse();
};
// 单指针法解题
var reverseString2 = function (s) {
  const len = s.length;
  for (let i = 0; i < Math.floor(len / 2); i++) {
    let otherI = len - 1 - i;
    const temp = s[i];
    s[i] = s[otherI];
    s[otherI] = temp;
  }
  return s;
};
// 双指针法解题
var reverseString3 = function (s) {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    [s[left], s[right]] = [s[right], s[left]];
    left++;
    right--;
  }
  return s;
};

/**
 * @description: 给定一个字符串 s 和一个整数 k，从字符串开头算起，每计数至 2k 个字符，就反转这 2k 字符中的前 k 个字符
 * @param {*} s
 * @param {*} k
 * @return {*}
 */
// 利用slice截取解题
var reverseStr = function (s, k) {
  let result = '';
  while (s) {
    const str = s.slice(0, k);
    s = s.slice(k);
    result += str.split('').reverse().join('');
    if (s.length <= k) {
      result += s;
      break;
    } else {
      result += s.slice(0, k);
      s = s.slice(k);
    }
  }
  return result;
};
// 利用数组指针解题，优势在于数组不需要反转的部分保持不动即可
reverseStr2 = function (s, k) {
  const len = s.length;
  s = s.split('');
  for (let i = 0; i < len; i += 2 * k) {
    let left = i;
    let right = i + k - 1;
    if (right > len - 1) {
      right = len - 1;
    }
    while (left < right) {
      [s[left], s[right]] = [s[right], s[left]];
      left++;
      right--;
    }
  }
  return s.join('');
};

/**
 * @description:  请实现一个函数，把字符串 s 中的每个空格替换成"%20"
 * @param {*} s
 * @return {*}
 */
// 使用replace快速解题
var replaceSpace = function (s) {
  return s.replace(/\s/g, '%20');
};
var replaceSpace2 = function (s) {
  s = s.split('');
  let i = 0;
  while (i < s.length) {
    if (s[i] === ' ') {
      s[i] = '%20';
    }
    i++;
  }
  return s.join('');
};

/**
 * @description: 给你一个字符串 s ，颠倒字符串中 单词 的顺序。
 * @param {*} s
 * @return {*}
 */
var reverseWords = function (s) {
  s = s.trim(); //去除首尾空格
  const arr = Array.from(s);
  // 去除多于空格
  let slow = 0;
  const len = arr.length;
  // fast是每一个位置都要一个一个走过的，在这种情况下，使用for比while方便
  for (let i = 0; i < len; i++) {
    if (arr[i] === ' ' && arr[i - 1] === ' ') {
      continue;
    }
    arr[slow++] = arr[i];
  }
  arr.length = slow; //注意下，最后一个字符赋值后，slow又++了一次，所以length刚好等于slow
  return arr.join('').split(' ').reverse().join(' ');
};

const r = reverseWords('a good   example');

/**
 * @description: 给你两个字符串 haystack 和 needle ，请你在 haystack 字符串中找出 needle 字符串出现的第一个位置（下标从 0 开始）。如果不存在，则返回  -1
处。
 * @param {*} haystack
 * @param {*} needle
 * @return {*}
 * 
 * // 本题是KMP算法的经典解题，以下是个人的解题
 */
// 法1：两层循环暴力解题
var strStr = function (haystack, needle) {
  if (needle === '') {
    return 0;
  }
  const len = haystack.length;
  if (needle.length > haystack.length) {
    return -1;
  }
  for (let i = 0; i < len; i++) {
    let j = i;
    while (haystack[j] === needle[j - i]) {
      if (j - i === needle.length - 1) {
        return i;
      }
      j++;
    }
  }
  return -1;
};

// KMP算法解题
var strStr2 = function (haystack, needle) {
  if (needle.length === 0) {
    return 0;
  }
  function getNext(s) {
    const next = [];
    const len = s.length;
    let j = 0;
    next.push(j);
    for (let i = 1; i < len; i++) {
      while (j > 0 && s[j] !== s[i]) {
        j = next[j - 1];
      }

      if (s[j] === s[i]) {
        j++;
      }
      next.push(j); // 相等时因为j已经++，代表下一次的匹配位置，刚好是本次的前缀长度；不相等时为0
    }
    return next;
  }
  const next = getNext(needle);
  let j = 0; //当前匹配到的needle位置
  for (let i = 0; i < haystack.length; i++) {
    while (j > 0 && haystack[j] !== haystack[i]) {
      j = next[j - 1];
    }
    if (haystack[i] === needle[j]) {
      j++;
      if (j === needle.length) {
        return i - j + 1;
      }
    }
  }
  return -1;
};

/**
 * @description: 给定一个非空的字符串 s ，检查是否可以通过由它的一个子串重复多次构成
 * @param {*} s
 * @return {*}
 * 法1：利用repeat API巧妙解题
 */
var repeatedSubstringPattern = function (s) {
  const len = s.length;
  if (len < 2) {
    return false;
  }
  const repeatStrList = [];
  let repeatS = s[0];
  // 1. 寻找匹配字符串
  for (let i = 1; i < len; i++) {
    if (s[i] === s[0]) {
      repeatStrList.push(repeatS);
    }
    repeatS += s[i];
  }
  for (const r of repeatStrList) {
    const rest = len % r.length;
    // 除不尽说明无法重复构成
    if (rest) {
      continue;
    }
    const num = len / r.length;
    if (r.repeat(num) === s) {
      return true;
    }
  }
  return false;
};

// KMP算法解题
var repeatedSubstringPattern2 = function (s) {
  if (s.length === 0) return false;

  const getNext = (s) => {
    let next = [];
    let j = 0;

    next.push(j);

    for (let i = 1; i < s.length; ++i) {
      while (j > 0 && s[i] !== s[j]) j = next[j - 1];
      if (s[i] === s[j]) j++;
      next.push(j);
    }

    return next;
  };

  let next = getNext(s);

  // 利用前缀表判断字符串是否有重复，根据公式  数组长度 % (数组长度 - 前缀表最后一位(不为0)) === 0 说明有重复
  if (next[next.length - 1] !== 0 && s.length % (s.length - next[next.length - 1]) === 0) return true;
  return false;
};
