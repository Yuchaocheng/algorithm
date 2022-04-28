let a = "9007199254740991";
let b = "1234567899999999999";

function add(a, b) {
    //取两个数字的最大长度
    let maxLength = Math.max(a.length, b.length);
    //用0去补齐长度
    a = a.padStart(maxLength, 0);//"0009007199254740991"
    b = b.padStart(maxLength, 0);//"1234567899999999999"
    //定义加法过程中需要用到的变量
    let t = 0;
    let f = 0;   //"进位"
    let sum = "";
    for (let i = maxLength - 1; i >= 0; i--) {
        t = parseInt(a[i]) + parseInt(b[i]) + f;
        f = Math.floor(t / 10);
        sum = t % 10 + sum;
    }
    if (f == 1) {
        sum = "1" + sum;
    }
    return sum;
}


// 第一种，两个大数用字符串表示，相加也用字符串相加，最后输出也是字符串
function add2(a, b) {
    const maxLen = Math.max(a.length, b.length)
    // 位对其
    a = a.padStart(maxLen, '0')
    b = b.padStart(maxLen, '0')

    let x = 0 // 一次计算和
    let y = 0 //进位
    let sum = '' //最后的结果
    for (let i = maxLen - 1; i >= 0; i--) {
        x = parseInt(a[i]) + parseInt(b[i]) + y
        y = parseInt(x / 10)
        sum = x % 10 + sum
    }
    if (y === 1) {
        sum = '1' + sum
    }
    return sum
}


console.log(add(a, b));
console.log(add2(a, b));