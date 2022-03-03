/*
 * @Descripttion: 图结构封装，核心思想是节点和变分开存储
 * @Author: ycc
 * @Date: 2022-03-02 09:12:51
 * @LastEditTime: 2022-03-03 09:29:49
 */

const Queue = require('../linear/queue/Queue');
const Stack = require('../linear/stack/Stack');
class Graph {
  // 使用一个数组存储顶点
  vertexes = [];
  /* 
    一般使用字典存储边，key代表顶点，value代表该该顶点指向的其他顶点
    这里就直接使用对象了，在js里，大部分情况可以使用对象代替字典，除非你的key不是字符串，有数据类型限制
  */
  edges = {};
  noDirection = true; //默认为无向图，false代表有向图
  constructor({ noDirection = true } = {}) {
    this.noDirection = noDirection;
  }

  // 添加顶点
  addVertex(v) {
    this.vertexes.push(v);
    // 添加一个顶点时，直接边里添加一个key，value，用来存放该顶点指向的顶点
    this.edges[v] = [];
    return true;
  }

  // 添加边
  addEdge(v1, v2) {
    // v1或者v2顶点有一个不存在时，无法添加边
    if (!this.edges.hasOwnProperty(v1) || !this.edges.hasOwnProperty(v2)) {
      return false;
    }
    this.edges[v1].push(v2);
    // 无向图需要把v2顶点也指向v1
    if (this.noDirection) {
      this.edges[v2].push(v1);
    }
    return true;
  }

  // 图输出，格式为 A-->B C D
  toString() {
    let result = '';
    this.vertexes.forEach((v) => {
      result += `${v} --> `;
      const edge = this.edges[v];
      result += edge.join(' ');
      result += '\r\n';
    });
    return result;
  }
  // 广度优先搜索算法
  BFS(first, handler) {
    // 如果指定的第一个顶点在图中不存在，直接返回
    if (!this.edges.hasOwnProperty(first)) {
      return;
    }
    // 广度优先搜索基于队列实现，比较巧妙，按顺序处理时考虑队列实现
    const Q = new Queue();
    const colors = this.initializeColor();
    // 初始化指定A为第一个顶点，并将其颜色赋为灰色
    handler(first, this.edges[first]);
    Q.enqueue(first);
    colors[first] = 'gray';
    while (!Q.isEmpty()) {
      const vertex = Q.dequeue();
      const vertexRelation = this.edges[vertex];
      vertexRelation.forEach((v) => {
        // 若顶点已被访问过，就不入队了
        if (colors[v] === 'white') {
          handler(v, this.edges[v]);
          Q.enqueue(v);
          colors[v] = 'gray';
        }
      });
      // 从该例子中看出，只需要两个状态，访问过和未访问过，黑色实际上是未使用的
      colors[vertex] = 'black';
    }
  }

  // 深度优先算法
  DFS(first, handler) {
    if (!this.edges.hasOwnProperty(first)) {
      return;
    }
    const colors = this.initializeColor();
    const stack = new Stack();
    stack.push(first);
    handler(first);
    colors[first] = 'gray';
    while (!stack.isEmpty()) {
      // 取出栈顶元素，但不出栈
      const vertex = stack.peek();
      const vertexRelation = this.edges[vertex];

      for (let i = 0; i < vertexRelation.length, i++; ) {
        if (colors[vertexRelation[i]] === 'white') {
          colors[next] = 'gray';
          stack.push(next);
          handler(next);
          continue;
        }
      }

      stack.pop();
      colors[vertex] = 'black'
    }
  }

  // 不使用栈，递归实现，递归的本质是函数栈，所以可以使用递归完成的函数，都可以转化为while+栈
  DFS2(vertex, handler) {
    //1.初始化顶点颜色
    const colors = this.initializeColor();
    //2.从某个顶点开始依次递归访问
    this.dfsVisit(vertex, colors, handler);
  }
  dfsVisit(vertex, colors, handler) {
    //1.将颜色设置为灰色
    colors[vertex] = 'gray';

    //2.处理v顶点
    handler(vertex);

    //3.访问V的相邻顶点
    let vNeighbours = this.edges[vertex];
    for (let i = 0; i < vNeighbours.length; i++) {
      let a = vNeighbours[i];
      //判断相邻顶点是否为白色，若为白色，递归调用函数继续访问
      if (colors[a] == 'white') {
        this.dfsVisit(a, colors, handler);
      }
    }

    //4.将v设置为黑色
    colors[vertex] = 'black';
  }
  // 初始化顶点颜色
  initializeColor() {
    // 记录每个顶点的颜色
    const colors = {};
    this.vertexes.forEach((v) => (colors[v] = 'white'));
    return colors;
  }
}

function test() {
  // 这里可以测试无向图和有向图，默认是无向图
  //   const graph = new Graph();
  const graph = new Graph({ noDirection: false });
  const myVertexes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  // 添加节点
  myVertexes.forEach((v) => graph.addVertex(v));

  //3.添加边，按照示例添加，最后和示例图对比
  graph.addEdge('A', 'B');
  graph.addEdge('A', 'C');
  graph.addEdge('A', 'D');
  graph.addEdge('C', 'D');
  graph.addEdge('C', 'G');
  graph.addEdge('D', 'G');
  graph.addEdge('D', 'H');
  graph.addEdge('B', 'E');
  graph.addEdge('B', 'F');
  graph.addEdge('E', 'I');

  // console.log(graph.toString());

  // graph.BFS('A', (v, e) => {
  //   console.log(v, 1);
  // });
  graph.DFS('A', (v, e) => {
    console.log(v, 1);
  });
}
test();
