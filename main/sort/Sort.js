/* 排序算法实现 */

// 创建列表类，内部放一个数组，排序方法封装在该类中
class ArrayList {
    array = [];
    insert(item) {
        this.array.push(item);
    }
    toString() {
        return this.array.join('-');
    }
    // 交换位置，排序中经常用到，就独立封装下
    swap(m, n) {
        const temp = this.array[m];
        this.array[m] = this.array[n];
        this.array[n] = temp;
    }
    // 冒泡排序
    bubbleSort(ascending = true) {
        const length = this.array.length;

        // 排列lenght-1次，最后一次只剩1个元素，不需要再排列
        for (let j = length - 1; j > 0; j--) {
            // 将本轮的最大值排到末尾
            for (let i = 0; i < j; i++) {
                // 后一个减去前一个元素的差值
                let diff = this.array[i + 1] - this.array[i];
                // 升序差值应该要大于0，降序差值应该要小于0
                const condition = ascending ? diff > 0 : diff < 0;
                // 不满足条件时位置交换
                if (!condition) {
                    this.swap(i, i + 1);
                }
            }
        }
    }
    // 选择排序
    selectionSort() {
        const length = this.array.length;
        let minIndex = 0;
        for (let j = 0; j < length - 1; j++) {
            // 注意：这里不要忘记给minIndex赋比较初始值j，否则minIndex为上一轮的赋值结果，会出问题
            minIndex = j;

            // 选择排序，每一轮先找出最小值，然后交换位置
            for (let i = j; i < length; i++) {
                if (this.array[i] < this.array[minIndex]) {
                    minIndex = i;
                }
            }
            if (j !== minIndex) {
                this.swap(j, minIndex);
            }
        }
    }
    // 插入排序
    insertionSort() {
        const length = this.array.length;
        // 循环次数确定时使用for，循环次数不确定时使用while
        for (let i = 1; i < length; i++) {
            let insertIndex = i;
            const temp = this.array[i];
            // 循环找到插入位置
            while (temp < this.array[insertIndex - 1] && insertIndex > 0) {
                insertIndex--;
            }
            // 需要将i调换位置，插入到左侧局部有序中
            if (insertIndex !== i) {
                /* 注意这里不是交换了，而是把左边部分有序的数组向后移动 */
                // 这里利用数组提供的splice方法直接插入，这样也更符合插入排序的语义
                this.array.splice(i, 1); //先删除i位置元素
                this.array.splice(insertIndex, 0, temp); //将i插入到insertIndex位置
            }
        }
    }

    // 插入排序教程方法，两种方式皆可，从代码量上来看，该方式简洁，但从语义上来讲，方式1更符合插入排序的语义
    insertionSort2() {
        const length = this.array.length;
        // 循环次数确定时使用for，循环次数不确定时使用while
        for (let i = 1; i < length; i++) {
            let insertIndex = i;
            const temp = this.array[i];
            // 循环找到插入位置
            while (temp < this.array[insertIndex - 1] && insertIndex > 0) {
                // 当i元素小于局部有序的元素时，则将局部元素右移
                this.array[insertIndex] = this.array[insertIndex - 1];
                insertIndex--;
            }
            if (insertIndex !== i) {
                this.array[insertIndex] = temp;
            }
        }
    }

    // 希尔排序
    shellSort() {
        // 希尔算法原稿，初始增量gap为列表长度一半，然后每次都为上一次的一半
        let gap = Math.floor(this.array.length / 2);
        // 1. 第一层循环，修改gap，进行分组插入排序
        while (gap >= 1) {
            this.insertionSort3(gap);
            gap = Math.floor(gap / 2);
        }
    }
    // 间隔可设置的插入排序
    insertionSort3(gap) {
        const length = this.array.length;
        // 2. 第2层循环，每个元素都需要在各自分组中进行插入排序
        for (let i = gap; i < length; i++) {
            const temp = this.array[i];
            let insertIndex = i;
            // 找出插入位置  3. 第三次循环，循环找出插入位置
            while (this.array[insertIndex - gap] > temp && insertIndex > 0) {
                this.array[insertIndex] = this.array[insertIndex - gap];
                insertIndex -= gap;
            }
            this.array[insertIndex] = temp;
        }
    }
    // 快速排序
    quickSort() {
        const length = this.array.length;
        this.quickSortMain(0, length - 1);
    }
    quickSortMain(start, end) {
        // 循环结束条件，分割的数组长度为0
        if (start >= end) {
            return;
        }
        let hub = this.median(start, end);
        // 如果只有1、2、3个元素，创建枢纽时已经排序完毕
        if (end - start < 3) {
            return;
        }
        let left = start + 1; //首位已经在建立枢纽时排列好了
        let right = end - 2; //最后一位已在建立枢纽时排列好了，最后第二位就是枢纽，所以从最后第三位开始
        while (left < right) {
            // 左指针不停移动，直到大于枢纽
            while (this.array[left] < hub && left < right) {
                left++;
            }
            // 右指针不停移动，直到小于枢纽
            while (this.array[right] > hub && left < right) {
                right--;
            }
            // 两个指针停止移动时，交换左右元素
            if (left < right) {
                this.swap(left, right);
            }
        }
        // 循环结束，left和right相遇。将放到数组倒数第二的枢纽和left或right调换位置
        this.swap(left, end - 1);

        // 将切分开的左右两串继续排列
        this.quickSortMain(start, left - 1);
        this.quickSortMain(right + 1, end);
    }
    // 快速排序-建立枢纽
    median(left, right) {
        let center = Math.floor((left + right) / 2);

        // 通过比较大小，将left，center，right三个位置进行排序，枢纽center就在相对正确的位置了
        // 因为只有三个元素，就通过类似冒泡排序对其进行排序
        if (this.array[left] > this.array[center]) {
            this.swap(left, center);
        }
        if (this.array[center] > this.array[right]) {
            this.swap(center, right);
        }
        if (this.array[left] > this.array[center]) {
            this.swap(left, center);
        }

        // 开始快速排序前，先把枢纽移动到最后第二位，因为right已经知道大于center了
        this.swap(center, right - 1);
        return this.array[right - 1];
    }
    // 快速排序方法2，方法1中对于枢纽的处理略显麻烦了
    // 该方法确实相对会简便一些，容易理解和记忆。虽然效率上稍微牺牲了一丢丢
    quickSort2(arr) {
        if (!arr.length) {
            return;
        }
        const hub = this.median2(arr);
        // 不大于三个元素时，创造枢纽时已排序完毕，递归结束
        if (arr.length <= 3) {
            return arr;
        }
        const l = [];
        const r = [];
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            if (arr[i] < hub) {
                l.push(element);
            } else {
                r.push(element);
            }
        }
        return [...this.quickSort2(l), ...this.quickSort2(r)];
    }
    // 只寻找枢纽，不再排序到倒数第二位
    median2(arr) {
        function swap(m, n) {
            const temp = arr[m];
            arr[m] = arr[n];
            arr[n] = temp;
        }
        let left = 0;
        let right = arr.length - 1;
        let center = Math.floor((left + right) / 2);
        if (arr[left] > arr[center]) {
            swap(left, center);
        }
        if (arr[center] > arr[right]) {
            swap(center, right);
        }
        if (arr[left] > arr[center]) {
            swap(left, center);
        }
        return arr[center];
    }
}

function test() {
    const list = new ArrayList();
    list.insert(99);
    list.insert(12);
    list.insert(125);
    list.insert(91);
    list.insert(58);
    list.insert(333);
    list.insert(46);
    list.insert(33);
    list.insert(7);
    list.insert(84);

    // 原先顺序
    console.log(list.toString());

    // 冒泡排序测试
    // list.bubbleSort(false)
    // console.log(list.toString());

    // 选择排序测试
    // list.selectionSort()
    // console.log(list.toString());

    // 插入排序测试
    // list.insertionSort3(2);
    // console.log(list.toString());

    // 希尔排序测试
    // list.shellSort()
    // console.log(list.toString());

    // 快速排序测试
    // list.quickSort();
    // console.log(list.toString());

    console.log(list.quickSort2(list.array));

    // console.log(list.toString());
}
test();