/*
 * @Description: 二叉树练习
 * @Autor: ycc
 * @Date: 2022-04-14 20:32:31
 * @LastEditTime: 2022-04-23 07:57:02
 */

// 二叉树的遍历迭代法非常不好理解，建议使用递归法
/**
 * @description: 先序遍历（父节点先遍历）
 * @param {*} root
 * @return {*}
 */
var preorderTraversal = function (root) {
  const result = [];
  traversal(root, result);
  return result;
};

var traversal = function (node, result) {
  if (!node) {
    return;
  }
  result.push(node.val); //先遍历父节点
  traversal(node.left, result); // 再遍历左节点
  traversal(node.right, result); // 最后历右节点
};

// 所有的递归都可以使用栈结构重写
var preorderTraversal = function (root) {
  if (!root) return [];
  const result = [];
  const stack = [root];
  while (stack.length) {
    // 父节点优先弹出
    const cur = stack.pop();
    result.push(cur);
    // 栈里先push右子节点，这样左子节点才会在栈顶，优先弹出
    if (cur.right) {
      stack.push(cur.right);
    }
    if (cur.left) {
      stack.push(cur.left);
    }
  }
};

/**
 * @description: 中序遍历
 * @param {*} root
 * @return {*}
 */
var inorderTraversal = function (root) {
  const result = [];
  const traversal = (node) => {
    if (!node) return;
    traversal(node.left); //中序遍历，先遍历左子节点
    result.push(node.val); // 第二遍历父节点，父节点遍历顺序在中间，称为中序遍历
    traversal(node.right); //后序遍历，最后遍历右子节点
  };
  traversal(root);
  return result;
};
var inorderTraversal = function (root) {
  const stack = [];
  let cur = root;
  while (stack.length || cur) {
    if (cur) {
      stack.push(cur);
      // 左
      cur = cur.left;
    } else {
      // --> 弹出 中   //左子节点不存在时，弹出自身即父节点
      cur = stack.pop();
      res.push(cur.val);
      // 右
      cur = cur.right;
    }
  }
  return res;
};

/**
 * @description: 二叉树层序遍历
 * @param {*} root
 * @return {*}
 */

// 法1：可以使用两个队列，一个记录本次循环的节点，一个放置下一次循环的节点
// 注意：循环就是广度优先，即队列按顺序遍历；递归就是深度优先，即先找到最底下的
var levelOrder = function (root) {
  if (!root) {
    return [];
  }
  let curQueue = [root];
  let nextQueue = [];
  const result = [];
  while (true) {
    // 注意：一直操作的是节点，最后需要输出的是val
    result.push(curQueue.map((node) => node.val));
    while (curQueue.length) {
      const node = curQueue.shift();
      if (node.left) {
        nextQueue.push(node.left);
      }
      if (node.right) {
        nextQueue.push(node.right);
      }
    }
    if (nextQueue.length) {
      curQueue = nextQueue;
      nextQueue = [];
    } else {
      break;
    }
  }
  return result;
};

// 记录当前层次的节点数量，即可用一个队列完成
var levelOrder = function (root) {
  if (!root) {
    return [];
  }
  const queue = [root];
  const res = [];
  while (queue.length) {
    // 记录当前一层的节点个数，可以代替双队列，只用一个队列完成
    const len = queue.length;
    const levelRes = []; //一层的遍历
    for (let i = 0; i < len; i++) {
      const node = queue.shift();
      levelRes.push(node.val);
      if (node.left) {
        // 入队下一轮节点
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }
    res.push(levelRes);
  }
  return res;
};

/**
 * @description: 二叉树的层序遍历 II：给你二叉树的根节点 root ，返回其节点值 自底向上的层序遍历 。
 * @param {*} root
 * @return {*}
 */
// 将层序遍历的结果反转一下就可以了
var levelOrderBottom = function (root) {
  if (!root) {
    return [];
  }
  const stack = [];
  const queue = [root];
  while (queue.length) {
    const len = queue.length;
    const levelNodes = [];
    for (let i = 0; i < len; i++) {
      const node = queue.shift();
      levelNodes.push(node.val);
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }
    stack.push(levelNodes);
  }
  const res = [];
  // 将栈中的数据全部输出，即反转数组，也可以使用reverse
  while (stack.length) {
    res.push(stack.pop());
  }
  return res;
};

/**
 * @description: 给定一个二叉树的 根节点 root，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值 。
 * @param {TreeNode} root
 * @return {number[]}
 */
// 即返回每一层最右侧（最后一个）的元素，它不一定是右节点，也可能是左节点
var rightSideView = function (root) {
  if (!root) {
    return [];
  }
  let cur = root;
  const res = [];
  const queue = [root];
  while (queue.length) {
    const len = queue.length;
    for (let i = 0; i < len; i++) {
      const node = queue.shift();
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
      // 最后一项，压入结果
      if (i === len - 1) {
        res.push(node.val);
      }
    }
  }
  return res;
};

// 层序遍历变形，求每一层的平均值
var averageOfLevels = function (root) {
  if (!root) {
    return [];
  }
  const queue = [root];
  const res = [];
  while (queue.length) {
    const len = queue.length;
    let sum = 0;
    for (let i = 0; i < len; i++) {
      const node = queue.shift();
      sum += node.val;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    res.push(sum / len);
  }
  return res;
};
/**
 * @description: 二叉树的最大深度：给定一个二叉树，找出其最大深度。
 * @param {*} root
 * @return {*}
 */
// 直接使用层序遍历解决，二叉树的最大深度就是层数
var maxDepth = function (root) {
  // 最大的深度就是二叉树的层数
  if (root === null) return 0;
  let queue = [root];
  let height = 0;
  while (queue.length) {
    let n = queue.length;
    height++;
    for (let i = 0; i < n; i++) {
      let node = queue.shift();
      node.left && queue.push(node.left);
      node.right && queue.push(node.right);
    }
  }
  return height;
};
// 法2：先序遍历解题：取左子树和右子树深度的较大值
var maxDepth2 = function (root) {
  const getDepth = (node, dep = 0) => {
    // 先序遍历
    if (node) {
      dep++; //加上当前层深度
      // 深度等于左子树和左子树中深度较大的树
      dep = Math.max(getDepth(node.left, dep), getDepth(node.right, dep));
    }
    return dep;
  };
  return getDepth(root);
};

/**
 * @description: 二叉树的最小深度：给定一个二叉树，找出其最小深度。
 * @param {TreeNode} root
 * @return {number}
 */
// 最小深度是说最早的某个节点没有左子节点 也没有右子节点
var minDepth = function (root) {
  if (!root) {
    return 0;
  }
  let dep = 0;
  const queue = [root];
  while (true) {
    dep++;
    const len = queue.length;
    for (let i = 0; i < len; i++) {
      const node = queue.shift();
      if (!node.left && !node.right) {
        return dep;
      }
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }
  }
};

/**
 * @description 给你一棵二叉树的根节点 root ，翻转这棵二叉树，并返回其根节点。
 * @param {TreeNode} root
 * @return {TreeNode}
 */
// 翻转二叉树，依然可以使用层序遍历，当然也可以使用前序遍历和后续遍历
var invertTree = function (root) {
  if (!root) {
    return root;
  }
  const queue = [root];
  // 层序遍历，遍历整棵树
  while (queue.length) {
    const node = queue.shift();
    const temp = node.left;
    node.left = node.right;
    node.right = temp;
    // [node.left, node.right] = [node.right, node.left] //这种方式交换值为什么不行？
    if (node.left) {
      queue.push(node.left);
    }
    if (node.right) {
      queue.push(node.right);
    }
  }
  return root;
};

/**
 * @description 对称二叉树：给你一个二叉树的根节点 root ， 检查它是否轴对称
 * @param {TreeNode} root
 * @return {boolean}
 */

// 法1:利用层序遍历求解，每一层都对称则意味着该树轴对称
// 注意：要考虑左右子节点有缺失的情况，缺失的是左节点还是右节点对是否对称有不同的影响
var isSymmetric = function (root) {
  if (!root) {
    return true;
  }
  const queue = [root];
  while (queue.length) {
    let len = queue.length;
    // 除了第一层，其他层节点个数不为偶数则不对称
    if (len % 2 === 1 && queue[0] !== root) {
      return false;
    }
    let l = 0;
    let r = len - 1;
    while (l < r) {
      // 如果节点存在，则值为节点val，如果不存在则为null，null和null也属于对称
      const left = queue[l] ? queue[l].val : queue[l];
      const right = queue[r] ? queue[r].val : queue[r];
      l++;
      r--;
      if (left !== right) {
        return false;
      }
    }
    // 将下一层节点入队：注意，一个节点只有一个子节点时，另一个子节点null也需要计算入内，对称是要关注左右子节点的
    while (len--) {
      const node = queue.shift();
      if (!node) {
        continue;
      }
      queue.push(node.left || null);
      queue.push(node.right || null);
    }
  }
  return true;
};

// 法2，不严格的后续遍历,左子树遍历左右(中)，右子树右左(中)，中其实没有用到
// 一颗树是否对称，其实就是判断它的左右子树是否对称
var isSymmetric = function (root) {
  const compare = function (left, right) {
    // 都不存在视为对称
    if (!left && !right) {
      return true;
    }
    // 一个不存在一个存在，视为不对称
    if (!left || !right) {
      return false;
    }
    if (left.val !== right.val) {
      return false;
    }
    const outCompare = compare(left.left, right.right);
    const inCompare = compare(left.right, right.left);
    // 内外都对称了才视为该子树对称
    return outCompare && inCompare;
  };
  if (!root) {
    return true;
  }
  return compare(root.left, root.right);
};

/**
 * @description: 给你一棵 完全二叉树 的根节点 root ，求出该树的节点个数
 * @param {*} root
 * @return {*}
 */

// 法1和法2常规利用二叉树的先序遍历和层序遍历解题，不再给出
// 法3可以利用完全二叉树的特性解题。完全二叉树可能是一颗完美二叉树，完美二叉树的节点个数是有公式的
// 完美二叉树判断方式是树的根节点到树左下节点和树右下节点的路径长度一致
// 就算该完全二叉树不是一颗完美二叉树，就递归判断它的左右子树，看看是否是完美二叉树，到最后叶子节点一定是一个完美二叉树
var countNodes = function (root) {
  //利用完全二叉树的特点
  if (!root) {
    return 0;
  }
  let { left, right } = root;
  let leftDep = 0;
  let rightDep = 0;
  while (left) {
    leftDep++;
    left = left.left;
  }
  while (right) {
    rightDep++;
    right = right.right;
  }
  // 根据根节点到左下叶子节点和右下叶子节点的个数判断，该树是否是一颗完美二叉树
  if (leftDep === rightDep) {
    return Math.pow(2, leftDep + 1) - 1;
  }
  return 1 + countNodes(root.left) + countNodes(root.right);
};

/**
 * @description：平衡二叉树：给定一个二叉树，判断它是否是高度平衡的二叉树
 *               高度平衡：个二叉树每个节点 的左右两个子树的高度差的绝对值不超过 1
 * @param {TreeNode} root
 * @return {boolean}
 */
// 法1：后续遍历求解高度，递归判断每个节点是否是平衡二叉树
var isBalanced = function (root) {
  // 节点不存在是一颗平衡二叉树
  if (!root) {
    return true;
  }
  const getHeight = (node) => {
    if (!node) {
      return 0;
    }
    return Math.max(getHeight(node.left), getHeight(node.right)) + 1;
  };
  const leftHeight = getHeight(root.left);
  const rightHeight = getHeight(root.right);
  if (Math.abs(leftHeight - rightHeight) > 1) {
    return false;
  }
  const leftBalanced = isBalanced(root.left);
  const rightBalanced = isBalanced(root.right);
  return leftBalanced && rightBalanced;
};

/**
 * @description: 二叉树所有路径:给你一个二叉树的根节点 root ，按 任意顺序 ，返回所有从根节点到叶子节点的路径
 * @param {*} root
 * @return {*}
 */
// 法1：利用先序遍历和栈结构解题
// 注意：回溯要和递归要意义对应，永远在一起
var binaryTreePaths = function (root) {
  if (!root) {
    return [];
  }
  const res = [];
  const stack = [];
  const traversal = (node) => {
    if (!node) {
      return;
    }
    stack.push(node.val);
    if (!node.left && !node.right) {
      res.push(stack.join('->'));
    }
    traversal(node.left);
    traversal(node.right);
    stack.pop();
  };
  traversal(root);
  return res;
};

var binaryTreePaths2 = function (root) {
  //递归遍历+递归三部曲
  let res = [];
  //1. 确定递归函数 函数参数
  const getPath = function (node, curPath) {
    //2. 确定终止条件，到叶子节点就终止
    if (node.left === null && node.right === null) {
      curPath += node.val;
      res.push(curPath);
      return;
    }
    //3. 确定单层递归逻辑
    curPath += node.val + '->'; //注意：这里就是巧妙的回溯了，因为对于1的左右节点来说，curPath永远是1->,js函数赋值是值的拷贝，不是值的引用，所以在递归函数中改变curPath并不改变自己的curPath
    console.log(curPath, 'curPath');
    node.left && getPath(node.left, curPath);
    node.right && getPath(node.right, curPath);
  };
  getPath(root, '');
  return res;
};

/**
 * @description: 左叶子之和：给定二叉树的根节点 root ，返回所有左叶子之和
 *               左叶子:首先是叶子节点，即没有左右子节点，其次它是父节点的左子节点
 * @param {*} root
 * @return {*}
 */
// 法1：先序遍历，层序遍历不太适合解这道题，无法知道一层中的哪个元素是左，哪个元素是右
var sumOfLeftLeaves = function (root) {
  let sum = 0;
  const traversal = (node, type = '') => {
    if (!node) {
      return;
    }
    if (!node.left && !node.right && type === 'left') {
      sum += node.val;
      return;
    }
    traversal(node.left, 'left');
    traversal(node.right, 'right');
  };
  traversal(root);
  return sum;
};

/**
 * @description: 路径总和：root和目标整数 targetSum，
 *               判断该树中是否存在 根节点到叶子节点 的路径，路径上所有节点值相加等于目标和 targetSum
 * @param {*} root
 * @param {*} targetSum
 * @return {*}
 */
var hasPathSum = function (root, targetSum) {
  if (!root) {
    return false;
  }
  let sum = 0;
  let isEqual = false; // 是否找到相等路径，如果已经找到，所有递归结束
  const traversal = (node) => {
    if (isEqual) {
      //一旦找到，终止所有递归
      return;
    }
    if (!node) {
      return;
    }
    sum += node.val;
    if (!node.left && !node.right) {
      isEqual = sum === targetSum;
      sum -= node.val; //回溯
      return;
    }
    traversal(node.left);
    traversal(node.right);
    sum -= node.val; //回溯
  };
  traversal(root);
  return isEqual;
};

/**
 * @description: 路径总和 II：根节点 root 和目标targetSum ，找出所有 从根节点到叶子节点 路径总和等于给定目标和的路径。
 * @param {*} root
 * @param {*} targetSum
 * @return {*}
 */
// 递归解题：注意路径保存时不能直接保存栈，需要浅拷贝一下
var pathSum = function (root, targetSum) {
  if (!root) {
    return [];
  }
  const res = [];
  const pathStack = [];
  const traversal = (node) => {
    if (!node) {
      return;
    }
    pathStack.push(node.val);
    if (!node.left && !node.right) {
      const sum = pathStack.reduce((pre, cur) => pre + cur, 0);
      // console.log(sum)
      if (sum === targetSum) {
        // 这里有个坑，pathStack自始至终都是一个地址，push进数组的只是pathStack的地址，进行一个浅拷贝即可
        res.push([...pathStack]);
      }
      pathStack.pop();
      return;
    }
    traversal(node.left);
    traversal(node.right);
    pathStack.pop();
  };
  traversal(root);
  return res;
};

/**
 * @description: 根据前序、中序遍历构造二叉树：给定两个整数数组 preorder 和 inorder ，请构造二叉树并返回根节点
 * @param {*} preorder
 * @param {*} inorder
 * @return {*}
 */
var buildTree = function (preorder, inorder) {
  // 先序遍历数组为空说明当前树无节点
  if (!preorder.length) {
    return null;
  }
  const nodeVal = preorder.shift(); //先序遍历第一个节点为父节点，父节点移除后，先序遍历前一部分的left节点和中序遍历是一致的
  const node = new TreeNode(nodeVal);
  if (preorder.length) {
    const index = inorder.indexOf(nodeVal);
    // inorder很明显使用父节点分割左右子树，preorder与inorder前一部分相等，所以index处刚好是右子树的第一个
    node.left = buildTree(preorder.slice(0, index), inorder.slice(0, index));
    node.right = buildTree(preorder.slice(index), inorder.slice(index + 1));
  }
  return node;
};

/**
 * @description: 合并二叉树
 * @param {*} root1
 * @param {*} root2
 * @return {*}
 */
// 法1：先序遍历
var mergeTrees = function (root1, root2) {
  if (!root1) {
    return root2;
  }
  if (!root2) {
    return root1;
  }
  // 这里可以不创造一颗新树，而是改造已有的root1也可以
  root1.val += root2.val;
  root1.left = mergeTrees(root1.left, root2.left);
  root1.right = mergeTrees(root1.right, root2.right);
  return root1;
};
// 法2：层序遍历
var mergeTrees = function (root1, root2) {
  if (!root1) {
    return root2;
  }
  if (!root2) {
    return root1;
  }
  const queue = [root1, root2];
  // 以root1位基础，进行root2合并。核心思想：只遍历两树都存在的位置，一旦有一棵树不存在，保持原样或者改为对方的数值
  while (queue.length) {
    // queue每次都是push两个的，即两棵树都存在的位置，所以一定可以shift两次
    const node1 = queue.shift();
    const node2 = queue.shift();
    node1.val += node2.val;
    if (node1.left && node2.left) {
      queue.push(node1.left);
      queue.push(node2.left);
    }
    if (node1.right && node2.right) {
      queue.push(node1.right);
      queue.push(node2.right);
    }

    if (!node1.left && node2.left) {
      node1.left = node2.left;
    }
    if (!node1.right && node2.right) {
      node1.right = node2.right;
    }
  }
  return root1;
};

/**
 * @description: 二叉搜索树中的搜索：在 BST 中找到节点值等于 val 的节点。 返回以该节点为根的子树。 如果节点不存在，则返回 null
 * @param {*} root
 * @param {*} val
 * @return {*}
 */
// 什么时候需要有返回值，什么时候不需要返回值。当得到结果后就结束所有递归，此时需要返回值。如果有了结果还需要遍历整棵树，不需要返回值
var searchBST = function (root, val) {
  if (!root || val === root.val) {
    return root;
  }
  if (val < root.val) {
    return searchBST(root.left, val);
  }
  if (val > root.val) {
    return searchBST(root.right, val);
  }
};

/**
 * @description:验证二叉搜索树：给你一个二叉树的根节点 root ，判断其是否是一个有效的二叉搜索树
 * @param {*} root
 * @return {*}
 */

// 注意：每个节点都大于左子节点并且小于右子节点，并不能保证该树是一颗二叉搜索树

// 法1：中序遍历，如果从小到大，则证明是一颗二叉搜索树
var isValidBST = function () {
  let pre = null;
  const inorder = (node) => {
    if (!node) {
      return true;
    }
    const leftValid = inorder(node.left);
    if (pre !== null && pre.val >= node.val) {
      return false;
    }
    pre = node; // 因为中序递增，前一个节点即最大值
    const rightValid = inorder(node.right);
    return leftValid && rightValid;
  };
  return inorder(root);
};

// 法2: 先获取中序数组，再判断它是否是递增的

var isValidBST2 = function () {
  const inorder = [];
  const inorderTraversal = (node) => {
    if (!node) {
      return;
    }
    inorderTraversal(node.left);
    inorder.push(node);
    inorderTraversal(node.right);
  };
  inorderTraversal();
  for (let i = 0; i < inorder.length - 1; i++) {
    if (inorder[i] >= inorder[i + 1]) {
      return false;
    }
  }
  return true;
};

/**
 * @description:二叉搜索树的最小绝对差：给你一个二叉搜索树的根节点 root ，返回 树中任意两不同节点值之间的最小差值
 * @param {TreeNode} root
 * @return {number}
 */

//  注意是二叉搜索树，二叉搜索树可是有序的。遇到在二叉搜索树上求什么最值啊，差值之类的，就把它想成在一个有序数组上求最值，求差值
// 法1：先求解中序数组，再遍历数组找到最小差值
var getMinimumDifference = function (root) {
  const inorder = [];
  const inorderTraversal = (node) => {
    if (!node) {
      return;
    }
    inorderTraversal(node.left);
    inorder.push(node.val);
    inorderTraversal(node.right);
  };
  inorderTraversal(root);
  let min = Infinity;
  for (let i = 0; i < inorder.length - 1; i++) {
    const diff = inorder[i + 1] - inorder[i];
    if (i === 0) {
      min = diff;
    } else {
      min = Math.min(min, diff);
    }
  }
  return min;
};

/**
 * @description: 二叉搜索树中的众数
 * 给你一个含重复值的二叉搜索树（BST）的根节点 root ，找出并返回 BST 中的所有 众数（即，出现频率最高的元素）
 * 如果树中有不止一个众数，可以按 任意顺序 返回
 *
 * @param {*} root
 * @return {*}
 */
// 法1：二叉搜索树的特点：中序遍历即从小到大排序了，在中序遍历时统计count，输出出现次数最多的元素
var findMode = function (root) {
  let count = 0;
  let maxCount = 0;
  let pre = null;
  const res = [];
  const traversal = (node) => {
    if (!node) {
      return;
    }
    traversal(node.left);
    if (pre !== null) {
      if (pre.val === node.val) {
        count++;
      } else {
        count = 1;
      }
      if (count === maxCount) {
        res.push(node.val);
      } else if (count > maxCount) {
        maxCount = count;
        res.length = 0;
        res.push(node.val);
      }
    } else {
      count++;
      maxCount = count;
      res.push(node.val);
    }
    pre = node;
    traversal(node.right);
  };
  traversal(root);
  return res;
};

// 法2：对于普通二叉树或者说任意结构，出现次数排序的题目：可以使用Map结构遍历解题
var findMode2 = function (root) {
  const map = new Map();
  const traversal = (node) => {
    if (!node) {
      return;
    }
    const val = node.val;
    map.set(val, (map.get(val) | 0) + 1);
    traversal(node.left);
    traversal(node.right);
  };
  traversal(root);
  const res = [];
  let maxCount = 0;
  for (const [key, value] of map) {
    if (value === maxCount) {
      res.push(key);
    } else if (value > maxCount) {
      maxCount = value;
      res.length = 0;
      res.push(key);
    }
  }
  return res;
};

/**
 * @description: 二叉树的最近公共祖先：给定一个二叉树, 找到该树中两个指定节点的最近公共祖先
 * @param {*}
 * @return {*}
 */
// 暴力求解：从根节点开始遍历每个节点，每个节点又遍历它的子树，如果存在p、q节点则赋值
// 没有思路的时候就要想暴力求解
var lowestCommonAncestor = function (root, p, q) {
  if (!root) {
    return root;
  }
  let ancestor = root;
  const traversal = (node) => {
    if (!node) {
      return;
    }
    if (container(node, p) && container(node, q)) {
      ancestor = node;
    }
    traversal(node.left);
    traversal(node.right);
  };
  const container = (node, target) => {
    if (!node) {
      return false;
    }
    if (node === target) {
      return true;
    }
    return container(node.left, target) || container(node.right, target);
  };
  traversal(root);
  return ancestor;
};

// 法2：寻找最近公共祖先，之所以要找到后要遍历是因为从上往下，如果可以从下往上查找，找到后就不需要再遍历了。
// 从下网上查找就可以使会用后序遍历
var lowestCommonAncestor2 = function (root, p, q) {
  let ancestor = null;
  const traversal = (node) => {
    // 最近祖先一旦找到，其他递归逻辑终结，否则会被上层覆盖
    if (ancestor) {
      return;
    }
    if (!node) {
      return false;
    }
    const left = traversal(node.left);
    const right = traversal(node.right);
    // 从底向下，找到了最近祖先
    if (left && right) {
      // p、q分别在节点的左右两侧
      ancestor = node;
      return true;
    }

    // p、q就是节点自身
    if (node === p || node === q) {
      // 并且另一个节点已经找到，即被包含了
      if (left || right) {
        ancestor = node;
      }
      return true;
    }
    return left || right;
  };
  traversal(root);
  return ancestor;
};
var lowestCommonAncestor2 = function (root, p, q) {
  // 1. 确定递归的函数
  const travelTree = function (root, p, q) {
    // 2. 确定递归终止条件
    if (root === null || root === p || root === q) {
      return root;
    }
    // 3. 确定递归单层逻辑
    let left = travelTree(root.left, p, q);
    let right = travelTree(root.right, p, q);
    if (left !== null && right !== null) {
      return root;
    }
    if (left === null) {
      return right;
    }
    return left;
  };
  return travelTree(root, p, q);
};

/**
 * @description: 二叉搜索树的最近公共祖先：利用公式:从上往下遍历节点值在[p,q]之间的，即为最近公共祖先
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
// 二叉搜索树：从上往下遍历，只要某一个节点的值大于p小于q即可，就是两个节点的最近公共祖先，在它之上的公共祖先不可能在[p,q]区间内，
// 因为二叉搜索树的性质，公共祖先的祖先，p和q是肯定在它的一边，那么只可能全部比它大，或者全部比它小
// 简而言之：二叉搜索数中的任意两个节点，你在他们的上方，只能找到一个节点大于等于较小节点，小于等于较大节点
var lowestCommonAncestor = function (root, p, q) {
  if (!root) {
    return root;
  }
  if (root.val > p.val && root.val > q.val) {
    return lowestCommonAncestor(root.left, p, q);
  }
  if (root.val < p.val && root.val < q.val) {
    return lowestCommonAncestor(root.right, p, q);
  }
  return root;
};

/**
 * @description: 二叉搜索树中的插入操作
 * @param {TreeNode} root
 * @param {number} val
 * @return {TreeNode}
 */
// 有一个坑点，如果root不存在，即根节点不存在，应该要插入val节点
var insertIntoBST = function (root, val) {
  if (!root) {
    return new TreeNode(val);
  }
  if (val < root.val) {
    if (root.left) {
      insertIntoBST(root.left, val);
    } else {
      root.left = new TreeNode(val);
    }
  } else {
    if (root.right) {
      insertIntoBST(root.right, val);
    } else {
      root.right = new TreeNode(val);
    }
  }
  return root;
};

/**
 * @description: 删除二叉搜索树中的节点
 * @param {*} root
 * @param {*} key
 * @return {*}
 */
// 法1：个人实现
var deleteNode = function (root, key) {
  // 插入节点，在删除操作中需要插入节点
  const insert = (node, insertNode) => {
    if (!node) {
      return insertNode;
    }
    if (!insertNode) {
      return node;
    }
    if (insertNode.val < node.val) {
      node.left = insert(node.left, insertNode);
    } else {
      node.right = insert(node.right, insertNode);
    }
    return node;
  };
  const traversal = (node) => {
    // type说明本节点是父节点的左子节点或者右子节点
    if (!node) {
      return node;
    }

    if (node.val === key) {
      if (node.left && node.right) {
        const temp = node.left.right;
        node.left.right = node.right;
        node = node.left;
        insert(node.right, temp);
      } else {
        node = node.left || node.right;
      }
      return node;
    }
    parent = node;
    if (key < node.val) {
      node.left = traversal(node.left);
    } else {
      node.right = traversal(node.right);
    }
    return node;
  };
  return traversal(root);
};

// 法2：移动整颗左子树或者整颗右子树逻辑更加清晰
var deleteNode2 = function (root, key) {
  // 将删除节点的右节点添加到左节点的最右侧
  const insetRight = (node, insertNode) => {
    while (node.right) {
      node = node.right;
    }
    node.right = insertNode;
  };
  const traversal = (node) => {
    if (!node) {
      return node;
    }

    if (node.val === key) {
      if (node.left && node.right) {
        insetRight(node.left, node.right);
        node = node.left;
      } else {
        node = node.left || node.right;
      }
      return node;
    }
    if (key < node.val) {
      node.left = traversal(node.left);
    } else {
      node.right = traversal(node.right);
    }
    return node;
  };
  return traversal(root);
};

/**
 * @description: 修剪二叉搜索树：给定root和边界[low,high]，通过修剪二叉搜索树，使得所有节点的值在[low, high]中
 * @param {TreeNode} root
 * @param {number} low
 * @param {number} high
 * @return {TreeNode}
 */
// 这道题比删除节点简单，是因为它删除的是它自身且左子树或右子树，因为它的左子树和右子树一定大于小于它，
// 相当于删除节点，节点只存在左子节点或者右子节点的情况
var trimBST = function (root, low, high) {
  if (!root) {
    return root;
  }
  if (root.val < low) {
    root = trimBST(root.right, low, high);
  } else if (root.val > high) {
    root = trimBST(root.left, low, high);
  } else {
    root.left = trimBST(root.left, low, high);
    root.right = trimBST(root.right, low, high);
  }
  return root;
};
