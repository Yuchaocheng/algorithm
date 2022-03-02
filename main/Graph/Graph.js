/*
 * @Descripttion: 图结构封装，核心思想是节点和变分开存储
 * @Author: ycc
 * @Date: 2022-03-02 09:12:51
 * @LastEditTime: 2022-03-02 10:05:55
 */

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
    // console.log(this.vertexes);
    // console.log(this.edges);
    this.vertexes.forEach((v) => {
      result += `${v} --> `;
      const edge = this.edges[v];
      result += edge.join(' ');
      result += '\r\n';
    });
    return result;
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

  console.log(graph.toString());
}
test();
