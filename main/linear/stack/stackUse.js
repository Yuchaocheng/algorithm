/*
 * @Descripttion:
 * @Author: ycc
 * @Date: 2022-02-16 08:46:51
 * @LastEditTime: 2022-02-16 08:55:38
 */

const Stack = require("./Stack");

function dec2bin(dec) {
    // new 一个 Stack，保存余数
    const stack = new Stack();

    // 当不确定循环次数时，使用 while 循环
    while (dec > 0) {
        // 除二取余法
        stack.push(dec % 2); // 获取余数，放入栈中
        dec = Math.floor(dec / 2); // 除数除以二，向下取整
    }

    let binaryString = "";
    // 不断地从栈中取出元素（0 或 1），并拼接到一起。
    while (!stack.isEmpty()) {
        binaryString += stack.pop();
    }

    return binaryString;
}

console.log(dec2bin(100)); //--> 1100100
