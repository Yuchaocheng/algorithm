/*
 * @Descripttion: 哈希表数据结构实现 - 采用链地址法解决地址冲突
   教程中数组每一项又用了一个数组作为bucket，bucket内部放置数据时又放一个数组，内部为key和value
   个人认为这里bucket直接用一个对象，每一个数据再用key和value存储在bucket中更简单。见HashTable2.js
 * @Author: ycc
 * @Date: 2022-02-23 09:02:03
 * @LastEditTime: 2022-02-24 09:42:29
 */
const hashFun = require('./hashFun');
const { isPrime } = require('../../common/algorithm');

class HashTable {
  storage = []; //存储数组
  count = 0; //hash表当前元素个数
  //hash表总容量 --动态。根据装填因子，太大时扩容，太小时降容，提高效率和利用率
  limit = 7;

  // 新增或者修改
  put(key, value) {
    const { limit, storage } = this;
    const index = hashFun(key, limit);
    const bucket = storage[index];
    if (bucket) {
      for (const item of bucket) {
        // 修改的情况
        if (item[0] === key) {
          item[1] = value;
          return;
        }
      }
    } else {
      storage[index] = [];
    }
    // 如果不是修改，那么只能是新增的情况，包括bucket不存在或者内部未找到
    storage[index].push([key, value]);
    this.count++;
    /* 当装填因子大于0.75时，进行括容 */
    if (this.count / this.limit > 0.75) {
      // 哈希表的容量最好是质数，有利于均匀分布
      const newPrime = this.getNearPrime(this.limit * 2);
      this.resize(newPrime);
    }
  }

  // 获取对应表项
  get(key) {
    const { limit, storage } = this;
    const index = hashFun(key, limit);
    const bucket = storage[index];
    if (bucket) {
      for (const item of bucket) {
        if (item[0] === key) {
          return item[1];
        }
      }
    }
    // 和新增类似，没有找到可能没有bucket或者，bucket内部没有该key
    return null;
  }

  // 删除，删除成功返回删除的元素
  remove(key) {
    const { limit, storage } = this;
    const index = hashFun(key, limit);
    const bucket = storage[index];
    if (bucket) {
      for (let i = 0; i < bucket.length; i++) {
        const item = bucket[i];
        if (item[0] === key) {
          // 删除该元素
          bucket.splice(i, 1);
          this.count--;
          /* 当装填因子小于0.25时，进行缩容，给一个最小值，这里设置为7 */
          if (this.limit > 7 && this.count / this.limit < 0.25) {
            const newPrime = this.getNearPrime(Math.floor(this.limit * 0.5));
            this.resize(newPrime);
          }
          // 返回被删除元素
          return item[1];
        }
      }
    }
    // 和get类似，若无该元素，删除后返回null
    return null;
  }
  isEmpty() {
    return this.count === 0;
  }
  size() {
    return this.count;
  }

  // 对哈希表进行扩容或者压缩
  resize(newLimit) {
    // 1. 存储当前数据
    const oldStorage = this.storage;

    // 2.重置属性
    this.storage = [];
    this.count = 0;
    this.limit = newLimit;

    // 3.遍历所有的桶和桶内项，重新添加
    oldStorage.forEach((bucket) => {
      if (bucket) {
        bucket.forEach((item) => this.put(item[0], item[1]));
      }
    });
  }

  // 获取邻近的质数，向后获取
  getNearPrime(num) {
    while (!isPrime(num)) {
      num++;
    }
    return num;
  }
}

function test() {
  const hashTable = new HashTable();
  hashTable.put('bob', { name: 'bob', age: 11 });
  hashTable.put('bob', { name: 'bob', age: 12 });
  hashTable.put('Tom', { name: 'Tom', age: 120 });
  hashTable.put('jom1', { name: 'Tom', age: 120 });
  hashTable.put('sadom2', { name: 'Tom', age: 120 });
  hashTable.put('Tasdfm3', { name: 'Tom', age: 120 });
  hashTable.put('gsdf4', { name: 'Tom', age: 120 });
  hashTable.put('hasdf5', { name: 'Tom', age: 120 });
  hashTable.put('13sdfa6', { name: 'Tom', age: 120 });
  hashTable.put('hadf7', { name: 'Tom', age: 120 });
  hashTable.put('jfgdf8', { name: 'Tom', age: 120 });

  hashTable.remove('Tom');
  hashTable.remove('sadom2');
  hashTable.remove('gsdf4');
  hashTable.remove('13sdfa6');
  hashTable.remove('jfgdf8');
  hashTable.remove('hasdf5');
  hashTable.remove('hadf7');
  hashTable.remove('Tasdfm3');
  console.log(hashTable, 'hashTable');
}
test();
