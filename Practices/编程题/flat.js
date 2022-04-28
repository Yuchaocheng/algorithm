Array.prototype.myFlat = function (num) {
    if (num < 1) {
        return this
    }
    const res = []
    num.forEach(n => {
        if (Array.isArray(n)) {
            // concat是不改变原数组的
            res = res.concat(n.myFlat(num - 1))
        } else {
            res.push(n)
        }
    })
    return res
}
Array.prototype.myFlat = function (num = 1) {
    if (num < 1) {
        return this
    }
    let result = []
    this.forEach(item => {
        if (Array.isArray(item)) {
            // 也可以不用ES6
            // result.push(...item.myFlat(num - 1))
            result = result.concat(item.myFlat(num - 1))
        } else {
            result.push(item)
        }
    })
    return result
}

// 使用栈结构实现
Array.prototype.myFlat2 = function (nums) {
    const stack = [...nums]
    const res = []
    while (stack.length) {
        
    }
}