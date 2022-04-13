/*
 * @Description: 队列练习
 * @Autor: ycc
 * @Date: 2022-04-13 08:26:09
 * @LastEditTime: 2022-04-13 08:55:41
 */

var maxSlidingWindow = function (nums, k) {
  // 构造一个单调双向队列，大数在前
  class Queue {
    queue = [];
    enqueue(value) {
      if (!this.queue.length) {
        this.queue.push(value);
        return;
      }
      let back = this.queue[this.queue.length - 1];
      while (this.queue.length && back < value) {
        this.queue.pop();
        back = this.queue[this.queue.length - 1];
      }
      this.queue.push(value);
    }
    // 当要出队的数等于队列头元素时，头元素出队。如果不等于头元素，说明比头元素小，因为如果比头元素大，头元素就应该是该数
    // 比头元素小又比头元素优先入队，所以已经在头元素入队时被消除出队了
    dequeue(value) {
      // 队列开头是最大元素，比它小的数一定是后出现的，如果是在它之前出现则入队是会被消除
      // 因为比它后出现，所以消除时也比他后消除
      if (value === this.queue[0]) {
        this.queue.shift();
      }
    }
    front() {
      return this.queue[0];
    }
  }
  const result = [];
  const len = nums.length;
  const queue = new Queue();
  let l = (r = 0);
  while (r < k) {
    queue.enqueue(nums[r++]);
  }
  // k-1项入队时，窗口已经生成，可以输出最大值
  result.push(queue.front());

  while (r < len) {
    queue.enqueue(nums[r++]);
    queue.dequeue(nums[l++]);
    result.push(queue.front());
  }
  return result;
};

/**
 * @description:  给你一个整数数组 nums 和一个整数 k ，请你返回其中出现频率前 k 高的元素。你可以按 任意顺序 返回答案。
 * @param {*} nums
 * @param {*} k
 * @return {*}
 */
// 法1：个人哈希和排序解题
var topKFrequent = function (nums, k) {
  const map = new Map();
  for (const n of nums) {
    map.set(n, (map.get(n) || 0) + 1);
  }
  // 将map转为对象数组，便于排序
  const arr = [];
  for (const [key, value] of map) {
    arr.push({ key, value });
  }
  arr.sort((a, b) => b.value - a.value);
  arr.length = k;
  return arr.map((n) => n.key);
};
