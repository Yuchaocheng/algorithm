<!--
 * @Descripttion: 记录一下有些遗忘的API，笔试时忘记很尴尬
 * @Author: ycc
 * @Date: 2022-02-11 16:02:37
 * @LastEditTime: 2022-04-06 12:07:13
-->

# Math 相关

- Math.abs(x)：求解 x 的绝对值
- Math.sqrt(x)：求解 x 的平方根

- 获得一个数的平方：
  1. n \* n
  2. n \*\* 2
  3. Math.pow(n,2)

# 数组相关

- map.values 或者 map.keys 转化的是一个类数组，可以使用 Array.from 转化为真正的数组

# 字符串相关

- 无法通过字符串的 length 属性改变字符串本身吗，这点和数组不同
- 字符串的下标只能获取对应数值，不能更改对应数值，无法使用 str[0] = 3 改变字符串
