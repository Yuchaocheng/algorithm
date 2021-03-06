/*
 * @Descripttion:
 * @Author: ycc
 * @Date: 2022-02-16 08:42:41
 * @LastEditTime: 2022-02-16 09:13:42
 */
// 栈结构的封装
// 栈可以使用数组封装，也可以使用链表实现
class Stack {
    constructor() {
        this.items = [];
    }

    // push(item) 压栈操作，往栈里面添加元素
    push(item) {
        this.items.push(item);
    }

    // pop() 出栈操作，从栈中取出元素，并返回取出的那个元素
    pop() {
        return this.items.pop();
    }

    // peek() 查看栈顶元素
    peek() {
        return this.items[this.items.length - 1];
    }

    // isEmpty() 判断栈是否为空
    isEmpty() {
        return this.items.length === 0;
    }

    // size() 获取栈中元素个数
    size() {
        return this.items.length;
    }

    // toString() 返回以字符串形式的栈内元素数据
    toString() {
        let result = "";
        for (let item of this.items) {
            result += item + " ";
        }
        return result;
    }
}

module.exports = Stack
