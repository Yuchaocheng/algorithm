/*
 * @Description: hash表练习文件
 * @Autor: ycc
 * @Date: 2022-03-31 09:53:43
 * @LastEditTime: 2022-03-31 16:19:03
 */

/**
 * @description: 给定两个字符串 s 和 t ，编写一个函数来判断 t 是否是 s 的字母异位词。
 *               注意：若 s 和 t 中每个字符出现的次数都相同，则称 s 和 t 互为字母异位词。
 * @param {*} s
 * @param {*} t
 * @return {*}
 *  @思路  优先判断两个字符串长度是否相等。如果长度相等，那么只存两种情况字符数量不等
 *         1. t中存在s中没有的字符
 *         2. t中的字符s中都存在，但是t中的某个字符个数多于s
 */

// 法1：对象映射解题
var isAnagram = function (s, t) {
  if (s.length !== t.length) {
    return false;
  }
  const oMap = {};
  for (const key of s) {
    if (oMap.hasOwnProperty(key)) {
      oMap[key] += 1;
    } else {
      oMap[key] = 1;
    }
  }
  for (const key of t) {
    if (oMap.hasOwnProperty(key)) {
      // 情况2：t中某个字符的个数多于s
      if (oMap[key] === 0) {
        return false;
      }
      oMap[key] -= 1;
    } else {
      // 情况1：t中出现了s中没有的字符，则直接返回false
      return false;
    }
  }
  return true;
};
// 法2：类似的数组映射解题
isAnagram2 = function (s, t) {
  if (s.length !== t.length) {
    return false;
  }
  const arr = new Array(26).fill(0);
  const base = 'a'.charCodeAt();
  for (const key of s) {
    arr[key.charCodeAt() - base]++;
  }
  for (const key of t) {
    // 两种情况都根据该判断完成。 情况2：t中存在某个字符个数多于s，则key位置处被减为小于0
    // 情况1：若t中存在s中没有的字符，因为初始值为1，同样被减为小于0
    if (arr[key.charCodeAt() - base] === 0) {
      return false;
    }
    arr[key.charCodeAt() - base]--;
  }
  return true;
};

/**
 * @description: 给定两个数组，编写一个函数来计算它们的交集。
 *               输出结果中的每个元素一定是 唯一 的
 * @param {*} nums1
 * @param {*} nums2
 * @return {*}
 */
var intersection = function (nums1, nums2) {
  const set1 = new Set(nums1);
  const set2 = new Set();
  nums2.forEach((item) => {
    if (set1.has(item)) {
      set2.add(item);
    }
  });
  return [...set2];
};

/**
 * @description: 编写一个算法来判断一个数 n 是不是快乐数。关于快乐数的定义，在Practices.md中
 *               解题的关键就是快乐数有可能是无限循环的，无限循环关键是循环，
 *               所以一旦重复出现就说明是永远无法变为1的，否则可变为1
 *
 * @param {*}
 * @return {*}
 */
// 法1：暴力求解
var isHappy = function (n) {
  if (n < 1) {
    return false;
  }
  let i = 0;
  while (n !== 1) {
    let total = 0;
    n = n + '';
    for (const key of n) {
      total += key * key;
    }
    n = total;
    i++;
    if (i > 100) {
      return false;
    }
  }
  return true;
};
// console.log(isHappy(19));
// 扩展，求一个数各个位置上的数字的平方和，除了使用字符串快速处理外，还可以

var getSum = function (n) {
  let sum = 0;
  while (n) {
    sum = (n % 10) ** 2;
    n = Math.floor(n / 10);
  }
};

/**
 * @description: 给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标
 *               你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现
 * @param {*} nums
 * @param {*} target
 * @return {*}
 */
// 暴力解题就先略过了
// 解题关键：求两个数的和等于trget，换个思路就是遍历到其中一个加数时，可以算出另外一个加数，数组中查找是否存在该加数
var twoSum = function (nums, target) {
  const map = new Map();
};

/**
 * @description: 四数相加：给你四个整数数组 nums1、nums2、nums3 和 nums4 ，数组长度都是 n
 *               请你计算有多少个元组 (i, j, k, l) 能满足 nums1[i] + nums2[j] + nums3[k] + nums4[l] == 0
 * @param {*} nums1
 * @param {*} nums2
 * @param {*} nums3
 * @param {*} nums4
 * @return {*}
 *
 * 注意：本题只需要解答出有多少组，不需要返回i/j/k/l 的值，给定的数组内可能会出现重复的个数的
 */
var fourSumCount = function (nums1, nums2, nums3, nums4) {
  const map = new Map(); //使用map结构，不仅要统计出两数之和，还要统计出生成两数和的个数，因为i和j只要不同，他们就算不同的组
  let count = 0;

  nums1.forEach((s1) => {
    nums2.forEach((s2) => {
      const key = s1 + s2;
      if (map.has(key)) {
        map.set(key, map.get(key) + 1);
      } else {
        map.set(key, 1);
      }
    });
  });

  // 2. 接下来就简化为求解二数之和的过程了
  for (const [key, value] of map) {
    const result = twoSum(0 - key, nums3, nums4);
    if (result) {
      count += result * value;
    }
  }
  return count;
};

function twoSum(target, nums3, nums4) {
  let map = new Map();
  let count = 0;
  // 先把数组转化为map，这样就不需要进行双重循环了，而是进行两次1重循环
  nums4.forEach((n) => {
    if (map.has(n)) {
      map.set(n, map.get(n) + 1);
    } else {
      map.set(n, 1);
    }
  });
  nums3.forEach((item) => {
    const other = target - item;
    if (map.has(other)) {
      count += map.get(other);
    }
  });
  return count;
}

// 思路一样，更简洁的代码
var fourSumCount2 = function (nums1, nums2, nums3, nums4) {
  const map = new Map();
  let count = 0;
  for (const n1 of nums1) {
    for (const n2 of nums2) {
      const sum = n1 + n2;
      let value = map.get(sum) || 0;
      map.set(sum, value + 1);
    }
  }

  for (const n3 of nums3) {
    for (const n4 of nums4) {
      const sum = n3 + n4;
      count += map.get(0 - sum) || 0;
    }
  }
  return count;
};

/**
 * @description: 赎金信: 给你两个字符串：ransomNote 和 magazine ，判断 ransomNote 能不能由 magazine 里面的字符构成
 *                       magazine 中的每个字符只能在 ransomNote 中使用一次
 * @param {*} ransomNote
 * @param {*} magazine
 * @return {*}
 */

// 法1：通过map两次双重循环求解
var canConstruct = function (ransomNote, magazine) {
  if (magazine.length < ransomNote.length) {
    return false;
  }
  const map = new Map();
  for (const s of magazine) {
    // 这里的理解有点歧义，题目中要表达的是magazine中某字符出现x次，做多只能使用x次，而不是只能使用1次
    // map.set(s, 1)
    map.set(s, (map.get(s) || 0) + 1);
  }
  for (const s of ransomNote) {
    if (map.get(s)) {
      // 使用过一次后，则将值置为0
      map.set(s, map.get(s) - 1);
    } else {
      // ransomNote中存在magazine中没有的字符，或者使用超过了magazine中出现的次数
      return false;
    }
  }
  return true;
};

// 法2: 暴力求解：双重循环，通过不断删除外层循环magazine的字符，最后查看ransomNote是否为空

// 法3：数组哈希解题，数组哈希一般的场景就是字母且只有小写字母的场景
var canConstruct2 = function (ransomNote, magazine) {
  const charArr = new Array(26).fill(0);
  const base = 'a'.charCodeAt();
  for (const s of magazine) {
    charArr[s.charCodeAt() - base] += 1;
  }
  for (const s of ransomNote) {
    if (!charArr[s.charCodeAt() - base]) {
      return false;
    }
    charArr[s.charCodeAt() - base] -= 1;
  }
  return true;
};

/**
 * @description:  三数之和：给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组
 * @param {*} nums
 * @return {*}
 */
var threeSum = function (nums) {
  const length = nums.length;
  for (let i = 0; i < length; i++) {
      
  }
};
