/*
 * @Descripttion: 优先级队列类，优先级队列和队列相比，队列只能在队尾添加
 *                而优先级队列需要根据优先级在队列任意位置添加
 * @Author: ycc
 * @Date: 2022-02-17 08:03:11
 * @LastEditTime: 2022-02-17 08:59:10
 */

const Queue = require('./Queue');

class PriorityQueue extends Queue {
  constructor() {
    // 调用子类的constructor方法，父类的属性和方法默认继承，但是如果要调用同名方法，可通过super
    super();
  }
  // 重写enqueue
  enqueue(elemenet, priority) {
    const obj = { elemenet, priority };
    if (this.isEmpty()) {
      // 调用父类的同名方法时，加super
      super.enqueue(obj);
    } else {
      let isAdded = false;
      const size = this.size();
      for (let i = 0; i < size; i++) {
        // 这里定义的优先级越小，越紧急，插入到优先级队列的前端
        if (priority < this.items[i].priority) {
          this.items.splice(i, 0, obj);
          isAdded = true;
          break;
        }
      }
      // 优先级最小
      if (!isAdded) {
        this.items.push(obj);
      }
    }
  }

  //重写toString()
  toString() {
    let str = '';
    this.items.forEach((item) => {
      str += `${item.elemenet}-${item.priority} `;
    });
    return str;
  }
}

let priQueue = new PriorityQueue();

console.log(priQueue.toString());
