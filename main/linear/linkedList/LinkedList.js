class LinkedList {
  length = 0;
  head = null;
  Node = class {
    data;
    next = null;
    constructor(data) {
      this.data = data;
    }
  };

  // 向链表尾部添加数据
  // 核心思路：从head开始一个引用接一个引用查找，直到最后一个元素时，将其引用（next）指向插入元素
  append(data) {
    // 1. 创建新节点
    const newNode = new this.Node(data);
    // 2. 追加新节点
    if (this.length) {
      let current = this.head;
      // 链表中最后一个元素的next（引用）为null，使用!==null，更加严谨
      while (current.next !== null) {
        current = current.next;
      }
      current.next = newNode;
    } else {
      this.head = newNode;
    }

    // 3、追加完新节点后，不要忘记链表长度 + 1
    this.length++;
  }

  // 在链表中任意位置插入数据
  inset(position, data) {
    const newNode = new this.Node(data);
    // 1. 对position进行越界判断
    if (position < 0 || position > this.length) {
      // false代表插入失败
      return false;
    }
    // 在开头插入
    if (position === 0) {
      newNode.next = this.head; // 将新插入节点的next指向原先的第一个节点
      this.head = newNode; // 将head指向新节点
    } else {
      let previous = this.head; //插入位置的前一个节点
      let i = 1;
      while (i < position) {
        previous = previous.next;
        i++;
      }
      // 新插入节点的next，指向原position节点，原position = previous节点的next指向
      newNode.next = previous.next;
      // previous节点的next指向插入节点
      previous.next = newNode;
    }

    // 链表长度 + 1
    this.length++;
  }

  // 获取对应位置的元素，注意获取的是Node中的data，而不是Node本身
  get(position) {
    // get时position最大为length-1
    if (position < 0 || position >= this.length) {
      return null;
    }
    let i = 0;
    // 此时的current已经是索引为0的值了
    let current = this.head;
    while (i < position) {
      i += 1;
      current = current.next;
    }
    return current.data;
  }

  // 返回元素在链表中的索引。如果链表中没有该元素就返回-1
  indexOf(data) {
    let index = 0;
    let current = this.head;
    while (index < this.length) {
      if (current.data === data) {
        return index;
      }
      current = current.next;
      index += 1;
    }
    return -1;
  }

  // 修改某个位置的元素，类似get，get获取position数据。update是在get到后更新一下data
  update(position, data) {
    if (position < 0 || position >= this.length) {
      return false;
    }
    let i = 0;
    let current = this.head;
    while (i < position) {
      i += 1;
      current = current.next;
    }
    current.data = data;
    return true;
  }

  // 从链表的特定位置移除一项。即将前一项，跳过position项，指向后一项，不要忘记长度减1
  removeAt(position) {
    // 1. 越界判断
    if (position < 0 || position >= this.length) {
      return false;
    }
    // 2. 判断删除的是首个节点
    if (position === 0) {
      this.head = this.head.next;
    } else {
      let i = 0;
      let current = this.head;
      let previous = null;
      while (i < position) {
        previous = current;
        current = current.next;
        i++;
      }
      previous.next = current.next;
    }
    this.length--;
    return true;
  }
  // 从链表中移除一项，该方法可以通过indexOf和removeAt方法结合实现，但是这样会循环两遍，降低效率
  remove(data) {
    let index = 0;
    // 该方法定义两个变量，一个变量逻辑有点绕
    let current = this.head;
    let previous = null;
    while (index < this.length) {
      if (current.data === data) {
        if (previous) {
          previous.next = current.next;
        } else {
          // previous不存在说明首个元素就相等了
          this.head = this.head.next;
        }

        this.length--;
        return true;
      }
      previous = current;
      current = current.next;
      index++;
    }
    return false;
  }

  isEmpty() {
    return this.length === 0;
  }

  size() {
    return this.length;
  }

  // 重写toString方法，便于查看链表内的数据
  toString() {
    let current = this.head;
    let str = '';
    // 循环结束条件是current，而非current.next的原因是，最后一个节点也在条件内
    while (current) {
      str += `${current.data} `;
      current = current.next;
    }
    return str;
  }
}

function test() {
  const linkedList = new LinkedList();
  linkedList.inset(0, 'i0');
  linkedList.inset(1, 'i3');
  linkedList.append('123');
  linkedList.append('45');
  linkedList.append('abc');

  console.log(linkedList.toString());
}

module.exports = LinkedList;
