/*
 * @Descripttion: 哈希函数实现
 * @Author: ycc
 * @Date: 2022-02-23 08:09:16
 * @LastEditTime: 2022-02-23 09:41:11
 */
const { HN } = require('../../common/algorithm');

// 将字符串转为数字时，采用幂的连乘方式转为大数字，幂的底数取一个大于27即可，大部分应用选用37
const BASE_NUM = 37;
/**
 * @description: 1. 将字符串转成比较大的数字：hashCode；2.将大数字hashCode压缩成数组范围之内
 * @param {*} str 数据字符串
 * @param {*} size 数组长度
 * @return {*} 压缩后的数组下标
 */
module.exports = function (str, size) {
  let hashCode = 0;
  // 利用幂的连乘和霍纳法则将字符串转为大数字
  hashCode = HN(str, BASE_NUM);

  // 利用取余操作将大数字转为数组下标index
  return hashCode % size;
};

function test() {
  // 哈希函数测试
  const hashFun = require('./hashFun');
  console.log(hashFun('abc', 7));
  console.log(hashFun('cba', 7));
  console.log(hashFun('nba', 7));
  console.log(hashFun('DNA', 7));
}
// test();
