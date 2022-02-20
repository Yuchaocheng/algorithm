// 集合类，从概念和功能上就是ES6中的Set类

class Set {
    items = {}; //用对象封装集合

    add(value) {
        if (this.has(value)) {
            return false
        }
        this.items[value] = value
        return true
    }
    delete(value) {
        if (!this.has(value)) {
            return false
        }
        delete this.items[value]
        return true
    }
    has(value) {
        return this.items.hasOwnProperty(value)
    }
    clear() {
        this.items = {}
    }
    size() {
        return Object.keys(this.items).length
    }
    values() {
        // 不要写Object.keys，因为key类型规定为字符串，但添加的值不一定是字符串
        return Object.values(this.items)
    }


    /******** 以下为 集合间的操作 ***********/

    // 求该集合和另一个集合的并集
    union(otherSet) {
        const unionSet = new Set()
        this.values().forEach(value => {
            unionSet.add(value)
        })
        otherSet.values().forEach(value => {
            unionSet.add(value)
        })
        return unionSet
    }

    // 求交集
    intersection(otherSet) {
        const intersection = new Set()
        this.values().forEach(value => {
            if (otherSet.has(value)) {
                intersection.add(value)
            }
        })
        return intersection
    }

    // 求差集
    difference(otherSet) {
        const newSet = new Set()
        this.values().forEach(value => {
            if (!otherSet.has(value)) {
                newSet.add(value)
            }
        })
        return newSet
    }

    // 求子集，判断自身是否为otherSet的子集
    isSubSet(otherSet) {
        return this.values().every(value => otherSet.has(value))
    }
}


(() => {
    const set = new Set()
    const otherSet = new Set()
    set.add(1)
    set.add(2)
    set.add(3)
    set.add(4)


    otherSet.add('a')
    otherSet.add('b')
    otherSet.add('c')
    otherSet.add(3)
    otherSet.add(4)

    console.log(set.union(otherSet).values());
    console.log(set.intersection(otherSet).values());
    console.log(set.difference(otherSet).values());
    console.log(otherSet.difference(set).values());
    console.log(set.isSubSet(otherSet));
    console.log(otherSet.isSubSet(set));

})()
