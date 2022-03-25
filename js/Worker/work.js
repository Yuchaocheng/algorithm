importScripts("./test.js");
console.log(a, 11);
/* 子线程监听主线程 */
this.addEventListener(
    "message",
    function (e) {
        let message = e.data;
        // console.log(message, "message");
        if (message === "close") {
            this.close(); // work内部关闭自身.
        }
    },
    false
);

// 子线程向主线程发送消息
this.postMessage("Hello World");
