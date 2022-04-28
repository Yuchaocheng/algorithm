
const isPrime = (num) => {
    if (typeof num !== 'number') {
        return false
    }
    if (num <= 1) {
        return false
    }
    const temp = parseInt(Math.sqrt(num))
    for (let i = 2; i <= temp; i++) {
        if (num % i === 0) {
            return false
        }
    }
    return true
}

var countPrimes = function (n) {
    let ans = 0;
    for (let i = 2; i < n; ++i) {
        ans += isPrime(i);
    }
    return ans;
};


// 暴力求解

// 如果该数是一个质数，它的倍数一定是一个合数，并且后面的合数都是由前面的个数叠加组成
var countPrimes = function (n) {
    const isPrime = new Array(n).fill(1);
    let ans = 0;
    for (let i = 2; i < n; ++i) {
        if (isPrime[i]) {
            ans += 1;
            for (let j = i * i; j < n; j += i) {
                isPrime[j] = 0;
            }
        }
    }
    return ans;
};


var countPrimes = function (n) {
    const arr = new Array(n).fill(1)
    let count = 0
    for (let i = 2; i < n; i++) {
        if (arr[i]) {
            count += 1
            for (let j = i + i; j < n; j += i) {
                arr[j] = 0
            }
        }
    }
    return count
};
