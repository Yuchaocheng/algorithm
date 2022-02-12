/*
 * @Descripttion:
 * @Author: ycc
 * @Date: 2022-02-10 20:07:37
 * @LastEditTime: 2022-02-11 16:44:06
 */

/**
 * @description: 给你一个整数 n ，请你返回所有 0 到 1 之间（不包括 0 和 1）满足分母小于等于  n 的 最简 分数 。分数可以以 任意 顺序返回。
 * @param {Number} n
 * @return {Array}
 *
 * 总结：核心在于最简分数，如何判断一个分数为最简分数
 */
var simplifiedFractions = function (n) {
    const result = [];
    while (n > 1) {
        let maxSon = n - 1;
        for (let sonIndex = 1; sonIndex <= maxSon; sonIndex++) {
            if (checkImprove(n, sonIndex)) {
                result.push(`${sonIndex}/${n}`);
            }
        }
        n--;
    }
    return result;
};

// 分解下，如何判断一个分数是否为最简分数，即两个数字没有共同的除了1之外的公约数
function check(mon, son) {
    const sonSplitResult = [...new Set(numSplit(son, "array"))];
    for (let index = 0; index < sonSplitResult.length; index++) {
        /* 下面的本质就是判断两者的最大公约数是否大于1 */
        if (mon % sonSplitResult[index] === 0 && sonSplitResult[index] !== 1) {
            return false;
        }
    }
    return true;
}

// 优化，判断一个分数是否为最简分数，实际是判断分子分母的最大公约数是否等于1
// 即求解两个数的最大公约数：辗转相除法（使用最广泛）
function checkImprove(mon, son) {
    return gcd(mon, son) === 1;
}

// gcd定理实现，两数的最大公约数等于较小数和两数相除余数的最大公约数
function gcd(a, b) {
    if (a < b) {
        throw new Error("first param need larger second param");
    }
    if (a % b === 0) {
        return b;
    } else {
        return gcd(b, a % b);
    }
}

// TODO 继续分解，因数分解，把一个整数分解成质数相乘的形式
function numSplit(x, type = "string") {
    let i = x;
    let k = 1;
    const result = [];
    /* 不需要i > k，只需要保证sqrt(i)<k */
    while (i > k) {
        if (i % k === 0 && k !== 1) {
            // 这里只添加了一个乘数，还有一个乘数存在继续分解的可能，但也有可能不分解，所以在最后一项中需要添加
            result.push(k);
            i = i / k;
            k = 1;
        } else {
            // 最后一项自身需要添加进数组
            if (k + 1 >= Math.sqrt(i)) {
                result.push(i);
            }
            k++;
        }
    }

    /* 没有质因数 */
    if (result.length === 0) {
        result.push(x);
    }

    // 以字符串类型返回
    if (type === "string") {
        return `x = ` + result.join(" * ");
    }
    // 以数组类型返回
    if (type === "array") {
        return result;
    }
}

// prime质数、composite合数
// 判断一个数是否为质数
function isPrime(num) {
    // 不必从2循环到num-1。只需要循环到sqrt(num)，因为如果sqrt(num)之前如果从未整除，说明之后也不会
    for (let index = 2; index <= Math.sqrt(num); index++) {
        if (num % index === 0) {
            // 如果不是质数，返回最小的质因数，省去主函数中寻找的过程
            return index;
        }
    }
    return true;
}
// 获取因数
function getFactor(num) {
    const result = [];
    const factor = isPrime(num);
    // num为质数
    if (factor !== true) {
        // num被分解为了两个因数相乘的结果
        result.push(factor); // 第一个因数
        result.push(...getFactor(num / factor)); // 第二个因数
    } else {
        result.push(num);
    }
    return result;
}

/* 
因数分解优化
1. 编写isPrime函数，判断某数是否为质数。从2循环到sqrt(num)
2. 编写getFactor-获取因数函数，在其内部调用isPrime，如果是质数，直接压入结果返回。如果不是
isPrime返回因数，压入结果数组，对另一个因数递归调用getFactor，获取其因数。
*/
function numSplitImprove(x, type = "string") {
    const result = getFactor(x);
    if (type === "string") {
        return `x = ` + result.join(" * ");
    }
    if (type === "array") {
        return result;
    }
}

// simplifiedFractions函数验证
(() => {
    // console.log(simplifiedFractions(2));
    // console.log(simplifiedFractions(3));
    // console.log(simplifiedFractions(4));
    // console.log(simplifiedFractions(5));
    // console.log(simplifiedFractions(6));
})();

/**
 * @description: 给定一个数组nums，内部存放着学生分数。任意取出k个分数，求解最高分和最低分可能出现的最小差值
 * @param {Array[Number]} nums
 * @param {number} k 1 <= k <= nums.length <= 1000
 * @return {number}  0 <= nums[i] <= 10的五次方
 */
var minimumDifference = function (nums, k) {
    const copyNums = [...nums];
    const diffArr = [];
    for (let i = 0; i < nums.length; i++) {
        copyNums.shift();
        copyNums.forEach((n) => diffArr.push(Math.abs(i - n)));
    }
};

/* 上述题目又可以先分解为，给你n个数，从中取出m个数，有多少种取法 */
function takeOut(nums, k) {
    const result = [];
    const length = nums.length;
    // i < length + 1 - k 是因为按顺序取，所以第一个数字取的位数 + 剩余位数<length
    for (let i = 0; i < length  - k+ 1; i++) {
        
    }
}
