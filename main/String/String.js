/*
 * @Description: 字符串类型练习题
 * @Autor: ycc
 * @Date: 2022-03-31 09:53:43
 * @LastEditTime: 2022-04-06 12:10:07
 */

/**
 * @description: 反转字符串： 将输入的字符串反转过来。输入字符串以字符数组 s 的形式给出
 * @param {*} s
 * @return {*}
 */
// 第一种直接调用数组的reverse方法
var reverseString = function (s) {
    return s.reverse()
};
// 单指针法解题
var reverseString2 = function (s) {
    const len = s.length
    for (let i = 0; i < Math.floor(len / 2); i++) {
        let otherI = len - 1 - i
        const temp = s[i]
        s[i] = s[otherI]
        s[otherI] = temp
    }
    return s

};
// 双指针法解题
var reverseString3 = function (s) {
    let left = 0
    let right = s.length - 1
    while (left < right) {
        [s[left], s[right]] = [s[right], s[left]]
        left++;
        right--;
    }
    return s
};

/**
 * @description: 给定一个字符串 s 和一个整数 k，从字符串开头算起，每计数至 2k 个字符，就反转这 2k 字符中的前 k 个字符
 * @param {*} s
 * @param {*} k
 * @return {*}
 */
// 利用slice截取解题
var reverseStr = function (s, k) {
    let result = ''
    while (s) {
        const str = s.slice(0, k)
        s = s.slice(k)
        result += str.split('').reverse().join('')
        if (s.length <= k) {
            result += s
            break
        } else {
            result += s.slice(0, k)
            s = s.slice(k)
        }
    }
    return result
};
// 利用数组指针解题，优势在于数组不需要反转的部分保持不动即可
reverseStr2 = function (s, k) {
    const len = s.length;
    s = s.split('')
    for (let i = 0; i < len; i += 2 * k) {
        let left = i
        let right = i + k - 1
        if (right > len - 1) {
            right = len - 1
        }
        while (left < right) {
            [s[left], s[right]] = [s[right], s[left]]
            left++
            right--
        }
    }
    return s.join('')
}


/**
 * @description:  请实现一个函数，把字符串 s 中的每个空格替换成"%20"
 * @param {*} s
 * @return {*}
 */
// 使用replace快速解题
var replaceSpace = function (s) {
    return s.replace(/\s/g, '%20')
};
var replaceSpace2 = function (s) {
    s = s.split('')
    let i = 0
    while (i < s.length) {
        if (s[i] === ' ') {
            s[i] = '%20'
        }
        i++
    }
    return s.join('')
};

/**
 * @description: 给你一个字符串 s ，颠倒字符串中 单词 的顺序。
 * @param {*} s
 * @return {*}
 */
var reverseWords = function (s) {
    s = s.trim(); // 去掉首位空格
    let slow = 0;
    let fast = 0;
    // 删除多余空格
    s = s.split('');
    while (fast < s.length) {
        fast++;
        // 连续空格
        if (s[fast] === ' ' && s[slow] === ' ') {
            continue;
        }
        slow++;
        s[slow] = s[fast];
    }
    s.length = slow + 1;
    return s.join('').split(' ').reverse().join(' ');
};

const r = reverseWords("a good   example")
console.log(r, 'r');
