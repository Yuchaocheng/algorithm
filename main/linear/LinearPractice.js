/*
 * @Date: 2022-03-05 18:01:41
 * @LastEditTime: 2022-03-05 22:01:24
 * @Author: ycc
 * @Description: 线性结构其他结构如数组：练习题
 */

/**  数组1
 * @description: leetCode485 给定一个二进制数组 nums ， 计算其中最大连续 1 的个数
 * 例：输入：nums = [1,1,0,1,1,1]
       输出：3
       解释：开头的两位和最后的三位都是连续 1 ，所以最大连续 1 的个数是 3.
 * @param {*}
 * @return {*}
 */
// 暴力求解 复杂度O(N)
function findMaxSerialOnes(nums) {
    if (!Array.isArray(nums) || !nums.length) {
        return 0
    }
    const length = nums.length
    let max = 0
    let current = 0
    for (let i = 0; i < length; i++) {
        if (nums[i] === 1) {
            current += 1
        } else {
            if (current > max) {
                max = current
            }
            current = 0
        }
    }
    // 如果数组最后一串1最长且在末尾，在此处处理
    if (current > max) {
        max = current
    }
    return max
}
// console.log(findMaxSerialOnes([1, 1, 0, 1, 1, 1]));


/** 数组2
 * @description: Leetcode 283： 给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序
 *               请注意 ，必须在不复制数组的情况下原地对数组进行操作
 *               
 * @param {Array} nums
 * @return {Array} 移动后的数组
 * @感受 和排序比较类似，特别像插入排序中，局部有序时的insertIndex
 */
var moveZeroes = function (nums) {
    if (!Array.isArray(nums) || !nums.length) {
        return nums
    }
    let left = 0
    let right = nums.length - 1

    while (true) {
        // 这里的判断不严谨，不能走过头，添加 left < length - 1 条件
        while (nums[left] !== 0 && left < nums.length - 1) {
            left++
        }
        if (left < right) {
            // 注意，这里不能交换位置，交换位置会让非零元素的相对位置改变，应该是将0删除和push
            nums.splice(left, 1)
            nums.push(0)
            right--
        } else {
            // 当指针相遇时退出循环
            break
        }
    }

    return nums
};

// 教程思路：设置一个指针，非0元素指针，非0元素按顺序排列完成，从指针到末尾再置为0
// 从时间复杂度上来说不如双指针，代码看起来更简便一点
moveZeroes2 = (nums) => {
    if (!Array.isArray(nums) || !nums.length) {
        return nums
    }
    let index = 0
    nums.forEach((item) => {
        // 非0元素顺序排列
        if (item !== 0) {
            nums[index] = item
            index++
        }
    })
    for (let i = index; i < nums.length; i++) {
        nums[i] = 0
    }
    return nums
}
// console.log(moveZeroes([0, 1, 0, 3, 12]));
// console.log(moveZeroes2([0, 1, 0, 3, 12]));


/** 数组3
 * @description: 给你一个数组 nums 和一个值 val，你需要 原地 移除所有数值等于 val 的元素，并返回移除后数组的新长度
 * @param {*} nums
 * @param {*} val
 * @return {*}
 */
var removeElement = function (nums, val) {
    if (!Array.isArray(nums) || !nums.length) {
        return 0
    }
    let index = 0;
    while (index < nums.length) {

        // 注意，如果等于val，指针不能向后移动，因为在数组中删除了该元素，当前指针已经指向了下一个元素
        if (nums[index] === val) {
            nums.splice(index, 1)
        } else {
            index++
        }
    }
    return nums.length
};

// console.log(removeElement([0, 1, 2, 2, 3, 0, 4, 2], 2));


/** 链表1
 * @description: 给你一个链表的头节点 head 和一个整数 val ，请你删除链表中所有满足 Node.val == val 的节点，并返回 新的头节点
 * @param {ListNode} head
 * @param {*} val
 * @return {*}
 * head = [1,2,6,3,4,5,6], val = 6    [1,2,3,4,5]
 */
// 题目给出的节点类，该题目是不具备可测试性的，因为默认已经有一个链表，并且head是头部，并不是传入的数组，这个题先跳过
function ListNode(val, next) {
    this.val = (val === undefined ? 0 : val)
    this.next = (next === undefined ? null : next)
}
var removeElements = function (head, val) {
    let newHead = new ListNode(0, head)
    let cur = newHead
    // 走到链表的末尾
    while (cur.next) {
        if (previous.next.val !== val) {
            previous = previous.next
        } else {//删除
            previous = previous.next.next
        }
    }
    return newHead.next
    // let newHead = new ListNode(0, head);
    // let previous = newHead;
    // while (previous.next) {
    //     if (previous.next.val == val) {
    //         previous.next = previous.next.next;
    //     } else {
    //         previous = previous.next;
    //     }
    // }
    // return newHead.next;
};