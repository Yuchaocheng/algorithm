/*
 * @Descripttion: 二叉搜索树的封装
 * @Author: ycc
 * @Date: 2022-02-25 08:07:20
 * @LastEditTime: 2022-02-25 09:20:36
 */

class BinarySearchTree {
  root = null;
  Node = class {
    left = null;
    right = null;
    constructor(key, value) {
      this.key = key;
      this.value = value;
    }
  };
  // 类内部方法，递归查找插入节点
  #insertNode = function (node, newNode) {
    // 插入失败，已经有key时不允许再插入
    if (newNode.key === node.key) {
      return false;
    }
    if (newNode.key < node.key) {
      if (node.left) {
        return this.#insertNode(node.left, newNode);
      } else {
        node.left = newNode;
        return true;
      }
    }

    if (newNode.key > node.key) {
      if (node.right) {
        return this.#insertNode(node.right, newNode);
      } else {
        node.right = newNode;
        return true;
      }
    }
  };
  // 递归查找
  #searchNode = function (node, newKey) {
    // 插入失败，已经有key时不允许再插入
    if (newKey === node.key) {
      return node;
    }
    if (newKey < node.key) {
      if (node.left) {
        return this.#insertNode(node.left, newKey);
      } else {
        return null;
      }
    }

    if (newKey > node.key) {
      if (node.right) {
        return this.#insertNode(node.right, newKey);
      } else {
        return null;
      }
    }
  };
  // 插入数据
  insert(key, value) {
    const newNode = new this.Node(key, value);
    if (!this.root) {
      this.root = newNode;
      return true;
    }
    return this.#insertNode(this.root, newNode);
  }
  // 搜索数据
  search(key) {
    if (!this.root) {
      return null;
    }
    const node = this.#searchNode(this.root, key);
    if (node) {
      return node.value;
    }
    return null;
  }
  // 查找最小项
  min() {
    // 如果为空树，返回null
    let min = null;
    let node = this.root;
    while (node) {
      if (!node.left) {
        min = node.key;
      }
      node = node.left;
    }
    return min;
  }
  // 查找最大项
  max() {
    // 如果为空树，返回null
    let max = null;
    let node = this.root;
    while (node) {
      if (!node.right) {
        max = node.key;
      }
      node = node.right;
    }
    return max;
  }
}

function test() {
  const binTree = new BinarySearchTree();
  binTree.insert(5, { id: 5 });
  binTree.insert(9, { id: 9 });
  console.log(binTree.insert(1, { id: 1 }));
  console.log(binTree.insert(3, { id: 3 }));
  console.log(binTree.insert(9, { id: 9 }));

  //   console.log(binTree.search(9));
  console.log(binTree.min(), 'min');
  console.log(binTree.max(), 'max');

  console.log(binTree, 'binTree');
}
test();
