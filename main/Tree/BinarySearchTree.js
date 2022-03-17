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
  // 类内部方法，递归插入节点
  #insertNode = function (node, newNode) {
    // 插入失败，不允许插入相同的key节点
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
  // 递归查找节点
  #searchNode = function (node, newKey) {
    if (!node) {
      return null
    }

    // 找到了节点
    if (newKey === node.key) {
      return node;
    }

    if (newKey < node.key) {
      return this.#searchNode(node.left, newKey);
    }

    if (newKey > node.key) {
      return this.#searchNode(node.right, newKey);
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
  // 搜索数据，该中搜索方式类似深度优先搜索
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
  // 遍历-先序遍历，传入遍历处理函数，类似forEach的形式
  preorderTraversal(handler) {
    if (typeof handler !== 'function') {
      return;
    }
    this.#traversalNode(this.root, handler);
  }
  // 遍历-中序遍历
  inorderTraversal(handler) {
    if (typeof handler !== 'function') {
      return;
    }
    this.#traversalNode(this.root, handler, 'inorder');
  }
  // 遍历-后序遍历
  postorderTraversal(handler) {
    if (typeof handler !== 'function') {
      return;
    }
    this.#traversalNode(this.root, handler, 'postorder');
  }
  // 节点遍历主函数
  #traversalNode = function (node, handler, mode = 'preorder') {
    // 节点为null时结束递归
    if (!node) {
      return;
    }
    if (mode === 'preorder') {
      handler(node.key, node.value);
    }
    // 先序遍历优先执行左子树，只要左子树有节点，就一直压如左子节点
    if (node.left) {
      this.#traversalNode(node.left, handler, mode);
    }
    if (mode === 'inorder') {
      handler(node.key, node.value);
    }

    // 当左子树执行完后，执行右子节点
    if (node.right) {
      this.#traversalNode(node.right, handler, mode);
    }

    if (mode === 'postorder') {
      handler(node.key, node.value);
    }
  };



  // 查找最小项
  min() {
    // 如果为空树，返回null
    if (!this.root) {
      return null
    }
    let current = this.root;
    while (current.left) {
      current = current.left;
    }
    // 找到了左下节点
    return current.key
  }
  // 查找最大项
  max() {
    // 如果为空树，返回null
    if (!this.root) {
      return null
    }
    let current = this.root;
    while (current.right) {
      current = current.right;
    }
    return current.key;
  }
  // 删除 --难点：删除过后依然要符合二叉搜索树的特性，即左子树节点值小于父节点，右子树大于父节点
  remove(key) {
    // 空树返回null
    if (!this.root) {
      return false
    }
    let current = this.root
    let parent = null;
    let isLeftChild = true
    // 循环查找key节点，以及它的父节点
    while (current.key !== key) {
      parent = current;
      if (key < current.key) {
        isLeftChild = true
        current = current.left
      } else {
        isLeftChild = false
        current = current.right
      }
      // 找到最后还是没有找到key，说明该key都没有，无法删除
      if (!current) {
        return false
      }
    }
    // 找到了current以及parent

    // 1. key节点没有子节点
    if (!current.left && !current.right) {
      // 有一种特殊情况，parent为null，说明要删除的是根节点
      if (!parent) {
        this.root = null
      } else {
        isLeftChild ? parent.left = null : parent.right = null
      }
      return true
    }

    // 2. key节点只有一个子节点
    if (!current.left || !current.right) {
      let grandChild = current.left ? current.left : current.right
      // 特殊情况，删除根节点，此时根节点有子节点
      if (!parent) {
        this.root = grandChild
      } else {
        isLeftChild ? parent.left = grandChild : parent.right = grandChild
      }
      return true
    }

    // 3. key节点有两个子节点 -- 使用后继删除
    let successor = this.getSuccessor(current);

    if (!parent) { // 删除有两个子节点的根节点
      successor.left = this.root.left
      this.root = successor
    } else {
      successor.left =  current.left
      isLeftChild ? parent.left = successor : parent.right = successor
    }
  }

  /* 
  获取某个节点的后继节点，后继节点只有右子树，如果存在左子树说明它不是后继节点
  即该节点右子树的最小节点
  */
  getSuccessor(node) {
    if (!node || !node.right) {
      return null
    }
    let parent = node;
    let successor = node.right;
    while (successor.left) {
      parent = successor
      successor = successor.left
    }

    // successor肯定是没有左子节点，因为它就是最小的，还要考虑两个情况，就是它的父节点以及它的右子节点


    /* 
    如果successor不是node.right，说明查找到的后继至少是node的孙子，
    这种情况下要将successor的right指向node的right，否则原先的right就丢失了
    */
    if (successor !== node.right) {
      /* 
      parent.left指向successor.right有两种情况
      1. successor确实存在右子节点，替代successor成为parent的左子节点
      2. successor无右子节点， parent.left赋值为null，不然的话依然指向successor，就不对了
      */
      parent.left = successor.right;
      successor.right = node.right
    }
    return successor
  }
}

function test() {
  const bst = new BinarySearchTree();

  bst.insert(11, { id: 11 });
  bst.insert(7, { id: 7 });
  bst.insert(15, { id: 15 });
  bst.insert(5, { id: 5 });
  bst.insert(3, { id: 3 });
  bst.insert(9, { id: 9 });
  bst.insert(8, { id: 8 });
  bst.insert(10, { id: 10 });
  bst.insert(13, { id: 13 });
  bst.insert(12, { id: 12 });
  bst.insert(14, { id: 14 });
  bst.insert(20, { id: 20 });
  bst.insert(18, { id: 18 });
  bst.insert(25, { id: 25 });
  bst.insert(6, { id: 6 });

  // 测试删除
  bst.remove(9)
  bst.remove(7)
  bst.remove(15)

  // 测试先序遍历
  bst.preorderTraversal((key, value) => {
    // console.log(`key: ${key}; value: ${JSON.stringify(value)} \r\n`);
  });
  // 测试中序遍历
  bst.inorderTraversal((key, value) => {
    console.log(`key: ${key}; value: ${JSON.stringify(value)} \r\n`);
  });
  // 测试后序遍历
  bst.postorderTraversal((key, value) => {
    // console.log(`key: ${key}; value: ${JSON.stringify(value)} \r\n`);
  });

  console.log(bst, 'bst');
}
test();
