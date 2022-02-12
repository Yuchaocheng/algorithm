/*
 * @Descripttion: JS基础刷题
 * @Author: ycc
 * @Date: 2022-02-11 18:59:41
 * @LastEditTime: 2022-02-12 17:01:09
 */

/**
 * @description: 0.1 + 0.2 === 0.3 嘛？为什么？
 * @param {*}
 * @return {*}
 *  精度和范围不是一回事，比方说10进制下我的精度是2个有效数字，那么我只能表示1.x的精度，但是范围可以非常小
 *  比方说1.x 乘以10的-2次方，那就是0.01x 。这和我们平时所理解的精度是有差异的，是科学表示法时的精度
 *
 * 结论：JavaScript 底层，所有数字都是以64位浮点数形式储存。1位符号位，11位指数位，52位有效数字位
 *  1.xxxxxx(52位,即精度为2的52次方分之一，转为10进制大概为16位) * 2的指数（指数范围为2的11次方）
 *  二进制无法精确表示十进制的0.1，它只能表示如1/2,1/4,以2的n次方为精度，那你可能说n非常非常大时
 *  精度小到一定程度肯定可以组装出0.1，但实际n是有位数限制的，js中n的最大位为1024。另一个角度，即使n非常小
 *  也存在无法拼出某个数的可能。 比如0.00000000000000003，也永远无法拼成0.1。
 *  如果说我们用公式去转换0.1和0.2就会发现，他们两刚好属于无法完全转换的类型，二进制小数会无限循环下去。
 *
 *  所以说进制转换存在精度问题 ***********************
 *
 *  所以计算机底层要进行计算，将十进制转为二进制时，精度就以丢失，不等于0.3就是必然的
 */
function precision() {
    console.log(0.1 + 0.2 === 0.3);
}
// precision();

/* 要解释清楚上面的精度问题，首先就是要学会十进制小数转二进制小数。
   十进制小数转二进制小数： 乘2取整，顺序排列
*/
// 看一下将0.1转为二进制小数是多少
function decimalTrans(decimal) {}

/* 
再看一下对阶运算的问题： 1.25 * 10^5 和 1.58 * 10^3  肯定无法直接计算，需要把指数部分对其，再算有效数字部分 
小阶 看齐 大阶：1.25 * 10^5 - 0.0158 * 10^5  
大阶 看齐 小阶：125 * 10^3 * 1.58 * 10^3

有点复杂，先跳过吧，所以计算机基础还是要学，二进制运算知识
*/

/**
 * @description:实现函数能够深度克隆
 *  深克隆和浅克隆的区别，就在于对象和数组两种类型，其他像函数、日期等是一样的
 * @param {Object} 需要深拷贝的源对象
 * @return {Object} 深拷贝成功后返回的对象
 */
function deepClone(obj) {
    if (!obj instanceof Object) {
        return obj;
    }

    // 拷贝日期对象
    if (obj instanceof Date) {
        return new Date(obj);
    }
    // 拷贝正则对象
    if (obj instanceof RegExp) {
        // 也可以写成 new RgeExp(obj.source,obj.flags)
        return new RegExp(obj);
    }

    // 拷贝函数
    if (obj instanceof Function) {
        return new Function("return " + obj.toString())();
    }

    /* 如果要实现浅克隆，放开以下代码 */
    // if (Array.isArray(obj)) {
    //     return [...obj];
    // } else {
    //     return { ...obj };
    // }

    // 深克隆对象或者数组中存放的数据，使用Object.keys是因为它能同时处理对象和数组两种形式

    const isArr = Array.isArray(obj);
    const res = isArr ? [] : {};
    Object.keys(obj).forEach((key) => {
        const value = obj[key];
        // 排除null
        if (typeof value === "object" && value) {
            if (isArr) {
                res.push(deepClone(value));
            } else {
                res[key] = deepClone(value);
            }
        }
    });
    return res;
}
const source = {
    name: "Jack",
    meta: {
        age: 12,
        birth: new Date("1997-10-10"),
        ary: [1, 2, { a: 1 }],
        say() {
            console.log("Hello");
        },
    },
};
console.log(deepClone(source));
