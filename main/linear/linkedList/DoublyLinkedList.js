// 双向链表结构
// 结构相对复杂了，如果思考起来吃力，可以考虑画一下插入的情况
class DoublyLinkedList {
    head = null;
    tail = null;
    length = 0;
    Node = class {
        prev = null;
        next = null;
        data;
        constructor(data) {
            this.data = data
        }
    }

    //向链表尾部追加一个新元素
    append(data) {
        const newNode = new this.Node(data);
        if (this.length) {
            //不要忘记把newNode的prev属性赋值
            newNode.prev = this.tail
            this.tail.next = newNode;
            this.tail = newNode
        } else {
            // 链表内无数据，添加的是第一个元素
            this.head = this.tail = newNode;
        }
        this.length++
    }
    // 向链表的指定位置插入一个新元素
    insert(position, data) {
        if (position < 0 || position > this.length) {
            return false
        }
        const newNode = new this.Node(data)
        /* 
        * 为什么这里优先判断position === this.length?即链表尾部插入
        * 因为position和this.length都为0时，优先调用append方法，使tail指针也得到处理。
        * 如果是position为0里面处理，就需要在内部再次判断this.length是否也等于0，重复判断
        */
        if (position === this.length) {
            this.append(data)
            // append方法里长度会加1，这里统一到最后操作长度
            this.length--;
        } else if (position === 0) {
            newNode.next = this.head
            this.head.prev = newNode
            this.head = newNode
        } else {
            let i = 0;
            let current = this.head
            while (i < position) {
                i++;
                current = current.next
            }
            newNode.prev = current.prev
            newNode.next = current
            current.prev.next = newNode
            current.prev = newNode
        }

        this.length += 1;
        return true

    }
    //  获取指定位置的Node节点，类内部方法
    getNode(position) {
        if (position < 0 || position >= this.length) {
            return null
        }
        let current = this.head
        let reverse = false
        if (position > this.length / 2) {
            current = this.tail
            reverse = true
            position = this.length - position - 1
        }
        let i = 0
        while (i < position) {
            i++;
            current = reverse ? current.prev : current.next;
        }
        return current
    }
    //  获取指定位置的元素
    getElement(position) {
        const current = this.getNode(position)
        if (current) {
            return current.data
        }
        return current
    }

    //返回元素在链表中的索引
    indexOf(data) {
        let index = 0;
        let current = this.head
        while (index < this.length) {
            if (current.data === data) {
                return index
            }
            current = current.next
            index += 1;
        }
        return -1
    }
    //修改指定位置上的元素
    update(position, data) {
        const current = this.getNode(position)
        if (current) {
            current.data = data
            return true
        }
        return false
    }

    // 根据node删除，类内部方法
    removeByNode(node) {

        // 当双向链表内只有一个节点时
        if (this.length === 1) {
            this.tail = null
            this.head = null
            return
        }
        // 移除的是第一个节点
        if (!node.prev) {
            node.next.prev = null;
            this.head = node.next
        } else if (!node.next) {  //移除的是最后一个节点
            node.prev.next = null
            this.tail = node.prev
        } else {
            // 中间节点
            node.prev.next = node.next
            node.next.prev = node.prev
        }
        this.length--
    }
    //  从链表中的删除指定位置的元素，删除成功返回删除的元素，删除失败返回null
    removeAt(position) {
        const current = this.getNode(position)
        if (current) {
            this.removeByNode(current);
            return current.data
        }
        return null
    }

    // 从链表删除指定的元素
    remove(data) {
        let index = 0;
        let current = this.head
        while (index < this.length) {
            if (current.data === data) {
                this.removeByNode(current)
                return true
            }
            current = current.next
            index += 1;
        }
        return false
    }

    isEmpty() {
        return this.length === 0
    }

    size() {
        return this.length
    }

    getHead(){
        return this.head.data
    }
    getTail(){
        return this.tail.data
    }

    // 重写toString方法，便于查看链表内的数据
    toString() {
        let current = this.head;
        let str = '';
        while (current) {
            str += `${current.data} `
            current = current.next
        }
        return str
    }

    // 返回反向遍历节点字符串形式
    forwardString() {
        let current = this.tail;
        let str = '';
        while (current) {
            str += `${current.data} `
            current = current.prev
        }
        return str
    }

    // 返回正向遍历的节点的字符串形式
    backwardString() {
        return this.toString()
    }
}

const double = new DoublyLinkedList()
double.append('abc')
double.append('nba')
double.append('333')
double.insert(0, 'in00')
double.insert(3, 'i33')
double.insert(5, '5555')

console.log(double.toString());

console.log(double.removeAt(5, '5555'));
console.log(double.removeAt(0, '5555'));




console.log(double.toString());
