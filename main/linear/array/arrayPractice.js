/*
 * @Date: 2022-03-05 22:01:52
 * @LastEditTime: 2022-03-06 12:21:47
 * @Author: ycc
 * @Description: 数组刷题
 */

/*
 * @Date: 2022-03-05 18:01:41
 * @LastEditTime: 2022-03-05 22:01:24
 * @Author: ycc
 * @Description: 线性结构其他结构如数组：练习题
 */

/**  
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
    return 0;
  }
  const length = nums.length;
  let max = 0;
  let current = 0;
  for (let i = 0; i < length; i++) {
    if (nums[i] === 1) {
      current += 1;
    } else {
      if (current > max) {
        max = current;
      }
      current = 0;
    }
  }
  // 如果数组最后一串1最长且在末尾，在此处处理
  if (current > max) {
    max = current;
  }
  return max;
}
// console.log(findMaxSerialOnes([1, 1, 0, 1, 1, 1]));

/**
 * @description: Leetcode 283： 给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序
 *               请注意 ，必须在不复制数组的情况下原地对数组进行操作
 *
 * @param {Array} nums
 * @return {Array} 移动后的数组
 * @感受 和排序比较类似，特别像插入排序中，局部有序时的insertIndex
 */
var moveZeroes = function (nums) {
  if (!Array.isArray(nums) || !nums.length) {
    return nums;
  }
  let left = 0;
  let right = nums.length - 1;

  while (true) {
    // 这里的判断不严谨，不能走过头，添加 left < length - 1 条件
    while (nums[left] !== 0 && left < nums.length - 1) {
      left++;
    }
    if (left < right) {
      // 注意，这里不能交换位置，交换位置会让非零元素的相对位置改变，应该是将0删除和push
      nums.splice(left, 1);
      nums.push(0);
      right--;
    } else {
      // 当指针相遇时退出循环
      break;
    }
  }

  return nums;
};

// 教程思路：设置一个指针，非0元素指针，非0元素按顺序排列完成，从指针到末尾再置为0
// 从时间复杂度上来说不如双指针，代码看起来更简便一点
moveZeroes2 = (nums) => {
  if (!Array.isArray(nums) || !nums.length) {
    return nums;
  }
  let index = 0;
  nums.forEach((item) => {
    // 非0元素顺序排列
    if (item !== 0) {
      nums[index] = item;
      index++;
    }
  });
  for (let i = index; i < nums.length; i++) {
    nums[i] = 0;
  }
  return nums;
};
// console.log(moveZeroes([0, 1, 0, 3, 12]));
// console.log(moveZeroes2([0, 1, 0, 3, 12]));

/**
 * @description: 给你一个数组 nums 和一个值 val，你需要 原地 移除所有数值等于 val 的元素，并返回移除后数组的新长度
 * @param {*} nums
 * @param {*} val
 * @return {*}
 */
var removeElement = function (nums, val) {
  if (!Array.isArray(nums) || !nums.length) {
    return 0;
  }
  let index = 0;
  while (index < nums.length) {
    // 注意，如果等于val，指针不能向后移动，因为在数组中删除了该元素，当前指针已经指向了下一个元素
    if (nums[index] === val) {
      nums.splice(index, 1);
    } else {
      index++;
    }
  }
  return nums.length;
};

/**
 * @description: 给定一个 n 个元素有序的（升序）整型数组 nums 和一个目标值 target  ，写一个函数搜索 nums 中的 target，如果目标值存在返回下标，否则返回 -1
 * @param {nums} 数组
 * @param {target} 数字
 * @return {*}
 * 总结： 找到返回，未找到继续去 左边区域或者右边区域寻找
 */
const search = function (nums, target) {
  if (!nums.length) {
    return -1;
  }
  let left = 0;
  let right = nums.length - 1;
  let center = -1;

  // 左右指针中间还有元素
  while (right - left > 1) {
    center = Math.floor((left + right) / 2);
    if (target < nums[center]) {
      right = center;
    } else if (target > nums[center]) {
      left = center;
    } else {
      return center;
    }
  }
  // 查找到最后，剩余左右两个元素未对比过
  if (nums[left] === target) {
    return left;
  }
  if (nums[right] === target) {
    return right;
  }

  /* 
    二分查找变形题：找不到时不返回-1，而是返回插入位置
     没找到有三种情况，target在left左边，taget小于数组任何数，否则不可能在左边，返回0；
     在right右边，返回length，
     或者在两者之间
    */
  // if (target < nums[left]) { //在left左边
  //     return 0
  // }
  // if (target > nums[right]) {//在right右边
  //     return length
  // }
  // return left + 1 //在两者之间

  return -1;
};
// console.log(search([-1, 0, 3, 5, 9, 12], 34));
// 二分查找教程方法，感觉该方法更好
function search2(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  // 使用左闭右闭区间
  while (left <= right) {
    let mid = left + Math.floor((right - left) / 2);
    // 这里的加1减1很关键，因为left和right本身已经是被比较过的了，所以没必要再进行比较了
    if (nums[mid] > target) {
      right = mid - 1; // 去左面闭区间寻找
    } else if (nums[mid] < target) {
      left = mid + 1; // 去右面闭区间寻找
    } else {
      return mid;
    }
  }
  // if (target < nums[left]) { //在left左边
  //     return 0
  // }
  // if (target > nums[right]) {//在right右边
  //     return length
  // }
  // return left + 1 //在两者之间
  return -1;
}
// 左闭右闭区间，即寻找左边界
function searchInsert2(arr, target) {
  if (!arr.length) {
    return 0;
  }
  // target在数组左边
  if (target < arr[0]) {
    return 0;
  }
  // target在数组右边
  if (target > arr[arr.length - 1]) {
    return arr.length;
  }
  let left = 0;
  let right = arr.length - 1;
  // target默认插入到数组末尾，一旦在查找时发现target小于或等于某一项，将插入位置赋值为该项
  let pos = arr.length;
  while (left <= right) {
    let mid = left + Math.floor((right - left) / 2);
    if (target > arr[mid]) {
      left = mid + 1;
    } else {
      pos = mid;
      right = mid - 1;
    }
  }
  return pos;
}
// search2([1, 2, 3, 3]);

/**
 * @description:  在排序数组中查找元素的第一个和最后一个位置
 *                给定一个按照升序排列的整数数组 nums，和一个目标值 target。
 *                找出给定目标值在数组中的开始位置和结束位置
 *                注意：升序数组可能有重复值，若没有重复值，就是left-right
 * @param {*} nums
 * @param {*} target
 * @return {*}
 *
 * 总结：寻找左右边界
 */
function searchFirstAndLast(nums, target) {
  if (!nums.length) {
    return [-1, -1];
  }
  let left = rangeSearch(nums, target, { range: [0, nums.length - 1], dir: 'left' });
  let right = rangeSearch(nums, target, { range: [0, nums.length - 1], dir: 'right' });
  return [left, right];
}

// 一定范围内的二分查找
function rangeSearch(nums, target, { range: [left = 0, right = left], dir = 'left' }) {
  if (!nums.length) {
    return -1;
  }
  let initLeft = left;
  let initRight = right;
  let center = -1;

  function searchContinue(current) {
    // 继续二分向左查找
    if (nums[current] === nums[current - 1] && dir === 'left') {
      return rangeSearch(nums, target, { range: [initLeft, current - 1], dir });
    }
    if (nums[current] === nums[current + 1] && dir === 'right') {
      return rangeSearch(nums, target, { range: [current + 1, initRight], dir });
    }
    // 当左右两边不等于当前找到的current时结束递归，说明不再需要继续查找了
    return current;
  }
  // 左右指针中间还有元素
  while (right - left > 1) {
    center = Math.floor((left + right) / 2);
    if (target < nums[center]) {
      right = center;
    } else if (target > nums[center]) {
      left = center;
    } else {
      // 找到了可能继续查找
      return searchContinue(center);
    }
  }
  if (nums[left] === target && target === nums[right]) {
    let result = dir === 'left' ? left : right;
    return searchContinue(result);
  }

  // 查找到最后，剩余左右两个元素未对比过
  if (nums[left] === target) {
    return searchContinue(left);
  }
  if (nums[right] === target) {
    return searchContinue(right);
  }

  // 当找不到时，说明已经是最左或者最右

  return -1;
}

// console.log(searchFirstAndLast([5, 7, 7, 8, 8, 10], 10));

// 寻找最大最小值，教程解法，寻找左右边界，根据左右边界值判断有无找到
function searchFirstAndLast2(nums, target) {
  if (nums.length === 0) {
    return [-1, -1];
  }
  // taget在数组左侧
  if (target < nums[0]) {
    return [-1, -1];
  }
  // target在数组右侧
  if (target > nums[nums.length - 1]) {
    return [-1, -1];
  }
  // target在数组中间，寻找左右边界
  let left = 0;
  let right = nums.length - 1;
  // target的左边界即
  function getLeftBorder(left, right) {
    let leftBorder = -1;
    while (left <= right) {
      let middle = left + Math.floor((right - left) / 2);
      if (target > nums[middle]) {
        left = middle + 1;
      } else {
        leftBorder = middle;
        right = middle - 1;
      }
    }
    return leftBorder;
  }
  function getRightBorder(left, right) {
    let rightBoder = -1;
    while (left <= right) {
      let middle = left + Math.floor((right - left) / 2);
      if (target < nums[middle]) {
        right = middle - 1;
      } else {
        rightBoder = middle;
        left = middle + 1;
      }
    }
    return rightBoder;
  }

  const leftBorder = getLeftBorder(left, right);
  const rightBorder = getRightBorder(left, right);
  // 未找到
  if (leftBorder > rightBorder) {
    return [-1, -1];
  }
  return [leftBorder, rightBorder];
}

// console.log(searchFirstAndLast2([5, 7, 7, 8, 8, 10], 6));
// console.log(searchFirstAndLast2([5, 7, 7, 8, 8, 10], 8));
// console.log(searchFirstAndLast2([], 0));

/**
 * @description:  给你一个非负整数 x ，计算并返回 x 的 算术平方根，整数部分
 * @param {*} x
 * @return {*}
 *
 */

// 暴力求解，对于指数运算来说，暴力求解效率并不会特别低
var mySqrt = function (x) {
  let result = 1;

  while (true) {
    if (result * result === x) {
      return result;
    }
    if (result * result < x) {
      result++;
    } else {
      return result - 1;
    }
  }
};

// 二分求解吗，类似于寻找左边界
var mySqrt2 = function (x) {
  if (x === 0 || x === 1) {
    return x;
  }
  let result = 1;
  let left = 0;
  let right = x - 1;
  while (left <= right) {
    let mid = left + Math.floor((right - left) / 2);
    console.log(mid, 'mid');
    if (mid * mid === x) {
      return mid;
    }
    if (mid * mid < x) {
      result = mid;
      left = mid + 1;
    } else {
      // 不能直接跳出循环，因为result不是1递增，上一次计算出的result到这个reuslt中间可能还存在合法值
      right = mid - 1;
    }
  }
  return result;
};
// console.log(mySqrt2(0));

/**
 * @description:  给定一个 正整数 num ，编写一个函数，如果 num 是一个完全平方数，则返回 true ，否则返回 false
 * @param {*} x
 * @return {*}
 *
 */

// 暴力求解
var isPerfectSquare = function (x) {
  let r = 1;
  while (true) {
    if (r * r === x) {
      return true;
    }
    if (r * r > x) {
      return false;
    }
    r++;
  }
};
// 二分求解
var isPerfectSquare2 = function (num) {
  let left = 1;
  let right = num;
  while (left <= right) {
    let mid = left + Math.floor((right - left) / 2);
    if (mid * mid === num) {
      return true;
    }
    if (mid * mid > num) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return false;
};
