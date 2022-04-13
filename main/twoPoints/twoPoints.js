/*
 * @Description: 双指针法练习，双指针法并不属于任何一种数据结构，只是使用上比较多，单独提炼出来而已
                 常见的双指针前后指针和快慢指针
 * @Autor: ycc
 * @Date: 2022-04-11 14:48:52
 * @LastEditTime: 2022-04-11 20:25:47
 */
/**
 * @description: 移除元素：移除所有值为val的元素
 * @param {*} nums
 * @param {*} val
 * @return {*}
 */
// 快慢指针
var removeElement = function (nums, val) {
  const len = nums.length;
  let j = 0;
  for (let i = 0; i < len; i++) {
    if (nums[i] === val) {
      continue;
    }
    nums[j++] = nums[i];
  }
  nums.length = j;
  return j;
};
console.log(removeElement([3, 2, 2, 3], 3));

/**
 * @description: 将输入的字符串反转过来,s以数组形式给出
 * @param {*}
 * @return {*}
 */
// 反转字符串 - 前后指针
var reverseString = function (s) {
  let [l, r] = [0, s.length - 1];
  while (l < r) {
    [s[l++], s[r--]] = [s[r], s[l]];
  }
  return s;
};

/**
 * @description: 给你单链表的头节点 head ，请你反转链表，并返回反转后的链表
 * @param {ListNode} head
 * @return {ListNode}
 */
// 使用双指针，记录当前链表项的前一项，反转时需要直到当前项，前一项以及后一项，后一项可以通过next拿到
var reverseList = function (head) {
  const v = new ListNode(-1, head);
  let cur = v.next;
  let pre = null;
  while (cur) {
    const temp = cur.next;
    cur.next = pre;

    pre = cur;
    cur = temp;
  }
  // 关键步骤，最后返回的pre就是原链表最后一项，新链表头
  return pre;
};

/**
 * @description: 删除链表的倒数第 N 个结点
 * @param {*} head
 * @param {*} n
 * @return {*}
 * 解题关键 1：倒数第n个，就是正数第len-n个，所以快指针先走n，再两个指针同时走len-n，此时快指针刚好走完
 *         2：fast不存在的特殊情况判断，删除第一个元素
 */
var removeNthFromEnd = function (head, n) {
  const ret = new ListNode(-1, head);
  let fast = (slow = ret.next);
  let fastI = 0;
  // 快指针先走n
  while (fastI < n) {
    fast = fast.next;
    fastI++;
  }
  // fast不存在说明是要删除第一节点
  if (!fast) {
    ret.next = ret.next.next;
    return ret.next;
  }
  while (fast.next) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next;
  return ret.next;
};

/**
 * @description: 链表相交。 给你两个单链表的头节点 headA 和 headB ，
 * 请你找出并返回两个单链表相交的起始节点。如果两个链表没有交点，返回 null
 * @param {*} headA
 * @param {*} headB
 * @return {*}
 */
// 解题关键，链表相交意味着尾部相同，相交节点一定是内存中的同一块区域，不是节点值相等，而是就是同一个节点
// 两个链表长度较长的那位，优先走diff步，这样就可以进行尾部对应比较了。还有一种思路将链表翻转，相等于从后开始匹配，不需要关注长度
var getIntersectionNode = function (headA, headB) {
  if (!headA || !headB) {
    return null;
  }

  function countLen(node) {
    let i = 0;
    while (node) {
      i++;
      node = node.next;
    }
    return i;
  }
  const lenA = countLen(headA);
  const lenB = countLen(headB);
  const diff = Math.abs(lenA - lenB);
  // 默认headA长度大于headB，若不是，则调换
  let fast = headA;
  let slow = headB;
  if (lenA < lenB) {
    [fast, slow] = [slow, fast];
  }
  // 快指针先走diff步
  for (let i = 0; i < diff; i++) {
    fast = fast.next;
  }
  while (fast) {
    if (fast === slow) {
      return fast;
    }
    fast = fast.next;
    slow = slow.next;
  }
  return null;
};

/**
 * @description: 环形链表：给定一个链表的头节点  head ，返回链表开始入环的第一个节点。 如果链表无环，则返回 null
 * @param {*} head
 * @return {*}
 */
// 此题使用哈希解题更加简洁，有环形结构证明同一个节点多次出现。空间复杂度较高
var detectCycle = function (head) {
  const set = new Set();
  const ret = new ListNode(-1, head);
  let cur = ret.next;
  while (cur) {
    if (set.has(cur)) {
      return cur;
    }
    set.add(cur);
    cur = cur.next;
  }
  return null;
};

/**
 * @description: 给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组
 *
 * @param {*} nums
 * @return {*}
 */
// 双指针法解题：所有n数之和的题目都可以使用双指针法，左右双指针，判断和与target的比值，区别是首先要通过循环确定两数之和的值以及双指针范围
// 注意点是当两个值相等时不要忘记移动指针
var threeSum = function (nums) {
  const len = nums.length;
  if (len < 3) {
    return [];
  }
  nums = nums.sort((a, b) => a - b); //先进行排序
  const map = new Map();
  for (let i = 0; i < len - 2; i++) {
    const target = 0 - nums[i];
    let l = i + 1;
    let r = len - 1;
    while (l < r) {
      const sum = nums[l] + nums[r];
      if (sum > target) {
        r--;
        continue;
      }
      if (sum < target) {
        l++;
        continue;
      }
      const value = [nums[i], nums[l], nums[r]];
      // 去重，因为value已经按顺序排列了，所以只要转成字符串就能判断是否重复
      const key = value.join(',');
      map.set(key, value);
      l++;
      r--;
    }
  }
  return Array.from(map.values());
};

/**
 * @description: 四数之和
 * @param {number[]} nums
 * @param {number} target
 * @return {number[][]}
 *
 * 该题的解题思路和三数之和一模一样：不要忘记后一个指针的开始位置是前一个指针+1，因为数据时不能重复使用的
 * 所以这里 j = i+1,l=j+1     不要忘记匹配成功时移动指针
 */
var fourSum = function (nums, target) {
  const len = nums.length;
  if (len < 4) {
    return [];
  }
  // 先排序
  nums = nums.sort((a, b) => a - b);
  const map = new Map();
  for (let i = 0; i < len - 3; i++) {
    for (let j = i + 1; j < len - 2; j++) {
      let l = j + 1;
      let r = len - 1;
      const sum1 = nums[i] + nums[j];
      while (l < r) {
        const sum = sum1 + nums[l] + nums[r];
        if (sum > target) {
          r--;
          continue;
        }
        if (sum < target) {
          l++;
          continue;
        }
        const value = [nums[i], nums[j], nums[l], nums[r]];
        const key = value.join(','); //去重
        map.set(key, value);
        l++;
        r--;
      }
    }
  }
  return Array.from(map.values());
};
