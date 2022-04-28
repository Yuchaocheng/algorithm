const curry = function (fn, ...params) {
    if (typeof fn !== 'function') {
        return fn
    }
    return function (...rest) {
        params = params.concat(rest)
        if (params.length < fn.length) {
            return curry.call(this, fn, ...params)
        } else {
            return fn.apply(this, params)
        }
    }
}

const addInit = function (a, b, c) {
    return a + b + c
}
const add = curry(addInit)
