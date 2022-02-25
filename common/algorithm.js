/*
 * @Descripttion: 算法代码汇总
 * @Author: ycc
 * @Date: 2022-02-23 08:51:13
 * @LastEditTime: 2022-02-24 09:37:25
 */

// 不使用霍纳法则计算
exports.noHN = (str, BASE_NUM) => {
  let hashCode = 0;
  for (let i = 0; i < str.length; i++) {
    // 通过charCodeAt获取字符串当前字符的unicode码（十进制表示）
    let iCode = str.charCodeAt(i);
    // 注意，字符串的顺序和幂的计算顺序相反，第一位为计算时的最高位，幂的次数最大
    hashCode += iCode * Math.pow(BASE_NUM, str.length - i - 1);
    console.log(hashCode, 'hashCode');
  }
  return hashCode;
};

// 使用霍纳法则计算多项式
exports.HN = (str, BASE_NUM) => {
  let hashCode = 0;
  for (let i = 0; i < str.length; i++) {
    // 通过charCodeAt获取字符串当前字符的unicode码（十进制表示）
    let iCode = str.charCodeAt(i);
    // 每次以括号为向，从高位计算，总结高位计算出来的项 * baseNum + 下一项
    hashCode = hashCode * BASE_NUM + iCode;
  }
  return hashCode;
};

// 质数判断
exports.isPrime = (num) => {
  if (typeof num !== 'number') {
    throw new Error('param need a number');
  }
  // 质数为大于1的自然数
  if (num <= 1) {
    return false;
  }
  const temp = parseInt(Math.sqrt(num));
  for (let i = 2; i <= temp; i++) {
    if (num % i === 0) {
      return false;
    }
  }
  return true;
};

// 判断质数的gcd实现
exports.gcd = () => {};
