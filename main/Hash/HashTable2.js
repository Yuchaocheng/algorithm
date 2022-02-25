/*
 * @Descripttion: 哈希表数据结构实现 - 采用链地址法解决地址冲突 - bucket内以对象形式存储
   用对象存储明显优于数组存储，逻辑更清晰简单
 * @Author: ycc
 * @Date: 2022-02-24 09:39:25
 * @LastEditTime: 2022-02-24 10:10:09
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
      // 修改的情况
      if (bucket.hasOwnProperty(key)) {
        bucket[key] = value;
        return;
      }
    } else {
      storage[index] = {};
    }
    storage[index][key] = value;
    this.count++;
    if (this.count / this.limit > 0.75) {
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
      if (bucket.hasOwnProperty(key)) {
        return bucket[key];
      }
    }
    return null;
  }

  // 删除，删除成功返回删除的元素
  remove(key) {
    const { limit, storage } = this;
    const index = hashFun(key, limit);
    const bucket = storage[index];
    if (bucket) {
      if (bucket.hasOwnProperty(key)) {
        const temp = bucket[key];
        delete bucket[key];
        this.count--;
        if (this.limit > 7 && this.count / this.limit < 0.25) {
          const newPrime = this.getNearPrime(Math.floor(this.limit * 0.5));
          this.resize(newPrime);
        }
        return temp;
      }
    }
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
        for (const key in bucket) {
          this.put(key, bucket[key]);
        }
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
