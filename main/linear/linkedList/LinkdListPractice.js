/*
 * @Description: 链表练习
 * @Autor: ycc
 * @Date: 2022-03-30 07:59:19
 * @LastEditTime: 2022-03-31 09:20:46
 */

/**
 * @param {ListNode} head
 * @param {number} val
 * @return {ListNode}
 */
const LinkedList = require('./LinkedList');
const link = new LinkedList();

function ListNode(val, next) {
  this.data = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}
/* 虽然heade传入的是一个数组，但是其实内部默认它是一个链表 */
// 移除链表中的元素
var removeElements = function (head, val) {
  const ret = new ListNode(0, head);
  let cur = ret;
  while (cur.next) {
    if (cur.next.data === val) {
      cur.next = cur.next.next;
      continue;
    }
    cur = cur.next;
  }
  return ret.next;
};

function test() {
  let head = [1, 2, 6, 3, 4, 5, 6];
  head.forEach((item) => {
    link.append(item);
  });
  let newHead = removeElements(link.head, 6);
  const result = [];
  let cur = newHead; // head指向第一个，即它即是链表第一个元素，它的next指向下一个元素
  if (!cur) {
    return [];
  }
  while (cur) {
    result.push(cur.data);
    cur = cur.next;
  }
  return result;
}

// 翻转链表
var reverseList = function (head) {
  let v = this.ListNode(-1, head);
  let cur = v.next;
  let pre = null;
  while (cur) {
    const temp = cur.next;
    cur.next = pre;
    pre = cur;
    cur = temp;
  }
  return pre;
};

/**
 * @description: 给你一个链表，两两交换其中相邻的节点，并返回交换后链表的头节点
 * @param {*} head
 * @return {*} newHead
 */
var swapPairs = function (head) {
  // 链表长度小于2时，无法交换
  if (!head || !head.next) {
    return head;
  }
  const v = new ListNode(-1, head);
  let pre = v.next; // 交换节点中的前一个
  let cur = pre.next; // 交换节点中的后一个
  let prepre = null; //交换节点前一个的前一个
  // 新一轮交换，交换的两个节点都必须存在
  while (cur) {
    const nextTemp = cur.next;
    cur.next = pre;
    pre.next = nextTemp;
    if (prepre) {
      // 交换已经完成，cur变为了pre
      prepre.next = cur;
    } else {
      v.next = cur;
    }
    // 交换完成，pre实际上是交换前的cur，交换前cur就是下一轮交换节点的前一个节点
    prepre = pre;
    pre = nextTemp;
    if (!nextTemp) {
      cur = null;
    } else {
      cur = nextTemp.next;
    }
  }
  return v.next;
};

/**
 * @description: 给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。
 * @param {*} head
 * @param {*} n
 * @return {*}
 */

// 方法1：暴力求解，遍历一次链表，将n转化为从前往后的index，然后就是普通的链表删除index项
var removeNthFromEnd = function (head, n) {
  const v = new ListNode(-1, head);
  // 获取列表长度
  function getILinkLengh() {
    let length = 0;
    let cur = v.next;
    while (cur) {
      length += 1;
      cur = cur.next;
    }
    return length;
  }
  // 从前往后的index
  const length = getILinkLengh();
  const index = length - n;

  if (index < 0 || index >= length) {
    return v.next;
  }
  if (index === 0) {
    v.next = v.next.next;
    return v.next;
  }
  let i = 0;
  let current = v.next;
  let pre = null;
  while (i < index) {
    pre = current;
    current = current.next;
    i++;
  }
  pre.next = current.next;
  return v.next;
};

// 快慢指针，快指针先走n步，还需要走length-n走完，慢指针在快指针走了n步后开始走，也走了length-n，刚好就是要删除的元素

var removeNthFromEnd2 = function (head, n) {
  let v = new ListNode(-1, head);
  let fast = v.next;
  let slow = v.next;
  // 快指针先走n步
  while (n > 0) {
    fast = fast.next;
    n--;
  }
  // 删除链表开头
  if (!fast) {
    v.next = v.next.next;
    return v.next;
  }
  while (fast.next) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next ? slow.next.next : null;
  return v.next;
};

/**
 * @description: 给你两个单链表的头节点 headA 和 headB ，请你找出并返回两个单链表相交的起始节点。如果两个链表没有交点，返回 null 。
 * @param {*} headA
 * @param {*} headB
 * @return {*}
 */
// 法1 暴力求解
var getIntersectionNode = function (headA, headB) {
  let v1 = new ListNode(-1, headA);
  let v2 = new ListNode(-1, headB);
  let curA = v1.next;
  while (curA) {
    let curB = v2.next;
    while (curB) {
      // 这里有一个注意点，相交链表并不是节点值相等，而是节点相等，即同一个节点
      if (curA === curB) {
        return curA;
      }
      curB = curB.next;
    }
    curA = curA.next;
  }
  return null;
};

/* 
 法2，根据相交链表的特点，如果两个链表相交，则相交那一段即最后一段一定是相等的
 所以将两个链表末端对其，然后从短的链表开头逐一比较即可
*/

function getIntersectionNode2() {
  const v1 = new ListNode(-1, headA);
  const v2 = new ListNode(-1, headB);
  let curA = v1.next;
  let curB = v2.next;
  function getLength(head) {
    let length = 0;
    while (head) {
      length++;
      head = head.next;
    }
    return length;
  }
  const lengthA = getLength(curA);
  const lengthB = getLength(curB);
  // 默认lengthA >= lengthB
  let fast = curA;
  let slow = curB;
  if (lengthA < lengthB) {
    fast = curB;
    slow = curA;
  }
  let diff = Math.abs(lengthA - lengthB);
  // 快指针先走diff
  while (diff > 0) {
    fast = fast.next;
    diff--;
  }
  while (fast) {
    if (fast === slow) {
      return fast;
    }
    fast = fast.next;
    slow = slow.next;
  }
  return null;
}

/**
 * @description: 环形链表，判断是否有环，返回入环节点。核心入环节点出现两次，并且是首个出现第二次的节点
 * @param {*} head
 * @return {*}
 */
var detectCycle = function (head) {
  const set = new Set();
  const v = new ListNode(-1, head);
  let cur = v.next;
  while (cur) {
    if (set.has(cur)) {
      return cur;
    }
    set.add(cur);
    cur = cur.next;
  }
  return null;
};
