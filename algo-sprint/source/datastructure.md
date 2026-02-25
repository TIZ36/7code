# 数据结构 — 按日分节

> 每日只读当日小节即可。读完后前往 **algorithm.md** 同一天的小节。

> **你现在在：结构层（What）**
> - 看什么：数据结构定义、存储方式、基本操作、复杂度、Go 容器特性  
> - 暂时不看：具体解题模板、多套路选型决策  
> - 下一站：`algorithm.md`（实现层）

---

## Day 1：数组、切片、哈希表

**本日目标**：深入理解 Go 中 slice 和 map 的底层行为，熟练用它们解题。

### 1.1 数组 vs 切片

Go 中数组 `[N]T` 是固定长度、值类型；刷题几乎不用。**切片 `[]T`** 才是主角。

```go
// 声明方式
a := []int{1, 2, 3}          // 字面量
b := make([]int, 5)          // 长度=5, 值全为0
c := make([]int, 0, 10)      // 长度=0, 容量=10（预分配）
```

#### 切片底层结构

```
slice 结构体:
┌──────────┬──────┬──────────┐
│ pointer  │ len  │ cap      │
│ → 底层数组│ 当前长度│ 总容量    │
└──────────┴──────┴──────────┘
```

- `len`：当前元素个数，`len(s)` 获取
- `cap`：底层数组从 slice 起始到末尾的容量，`cap(s)` 获取
- **多个 slice 可能共享同一底层数组**：`s2 := s[1:3]` 和 s 共享内存

#### append 与扩容

```go
s := make([]int, 0, 2)   // len=0, cap=2
s = append(s, 1)          // len=1, cap=2  (未扩容)
s = append(s, 2)          // len=2, cap=2  (未扩容)
s = append(s, 3)          // len=3, cap=4  (扩容! 新底层数组)
```

- cap 不够时 append 会分配新数组并拷贝（O(n)）
- 扩容策略：cap < 256 时翻倍，之后按 ~1.25 倍增长
- **刷题技巧**：如果能预估大小，用 `make([]int, 0, n)` 预分配，避免多次扩容

#### 传参行为（重要！）

```go
func modify(s []int) {
    s[0] = 999     // ← 会影响调用方！（共享底层数组）
    s = append(s, 1) // ← 不影响调用方的 s（append 可能换了底层数组）
}
```

- slice 传参是传「header 的拷贝」（pointer + len + cap），不是深拷贝
- 修改元素会影响原 slice，但 append 后调用方的 len 不变
- **刷题中收集路径时必须深拷贝**：`res = append(res, append([]int(nil), path...))`

#### 常用操作速查

| 操作 | 写法 | 时间 |
|------|------|------|
| 访问第 i 个 | `s[i]` | O(1) |
| 追加到末尾 | `s = append(s, x)` | 均摊 O(1) |
| 删除第 i 个（不保序） | `s[i] = s[len(s)-1]; s = s[:len(s)-1]` | O(1) |
| 删除第 i 个（保序） | `s = append(s[:i], s[i+1:]...)` | O(n) |
| 拷贝 | `dst := make([]int, len(src)); copy(dst, src)` | O(n) |
| 反转 | 双指针交换 `s[i], s[j] = s[j], s[i]` | O(n) |

<details>
<summary><strong>图解：删除第 i 个元素 —— 保序 vs 不保序</strong></summary>

假设 `s = [A, B, C, D, E]`，要删除 index=1 的元素 `B`：

**不保序删除（O(1)）—— 用末尾元素覆盖，然后截断**

不关心剩余元素的先后顺序，只要把目标去掉就行。做法：把最后一个元素搬到被删位置，再缩短一格。

```
原始：  [A, B, C, D, E]    要删 B（i=1）

步骤1：s[1] = s[4]  → 把末尾 E 搬到 B 的位置
        [A, E, C, D, E]

步骤2：s = s[:4]    → 截掉最后一格
        [A, E, C, D]
```

结果 `[A, E, C, D]`——`B` 没了，但 **原来的顺序被打乱了**（E 跑到了前面）。
好处是只做了一次赋值 + 一次截断，**O(1)**。

```go
s[i] = s[len(s)-1]
s = s[:len(s)-1]
```

**保序删除（O(n)）—— 前移后面所有元素，保持原顺序**

需要保持剩余元素的原始顺序。做法：把 i 后面的元素整体往前搬一格。

```
原始：  [A, B, C, D, E]    要删 B（i=1）

步骤：  append(s[:1], s[2:]...)
        把 [C, D, E] 整体左移一格

结果：  [A, C, D, E]
```

结果 `[A, C, D, E]`——`B` 没了，**顺序完全保持**。
代价是后面所有元素都要搬，最坏 **O(n)**。

```go
s = append(s[:i], s[i+1:]...)
```

**什么时候用哪个？**

| 场景 | 选择 | 理由 |
|------|------|------|
| 集合去重、计数，不在意顺序 | 不保序 O(1) | 快 |
| 结果要求有序输出、排列问题 | 保序 O(n) | 正确 |
| 不确定？ | 默认保序 | 安全，大多数题目隐含要求顺序 |

</details>

### 1.2 哈希表 (map)

#### 基本用法

```go
m := make(map[string]int)    // 创建
m["apple"] = 3               // 写入
v := m["apple"]              // 读取（key 不存在返回零值 0）
v, ok := m["banana"]         // 判断是否存在
delete(m, "apple")           // 删除
```

#### 遍历

```go
for k, v := range m {
    // 遍历顺序是随机的！每次运行可能不同
}
```

#### 刷题中的典型用法

**用法一：计数器**

```go
count := make(map[byte]int)
for i := 0; i < len(s); i++ {
    count[s[i]]++
}
```

**用法二：存在性判断（集合）**

```go
seen := make(map[int]bool)
for _, v := range nums {
    if seen[target-v] {
        // 找到配对
    }
    seen[v] = true
}
```

**用法三：值 → 下标映射**

```go
idx := make(map[int]int)  // val → index
for i, v := range nums {
    if j, ok := idx[target-v]; ok {
        return []int{j, i}
    }
    idx[v] = i
}
```

#### 复杂度

| 操作 | 平均 | 最坏 |
|------|------|------|
| 读/写/删 | O(1) | O(n)（哈希冲突极端情况） |
| 遍历 | O(n) | O(n) |

#### 常见坑

- `map[K]V` 的 K 必须是可比较类型（不能是 slice、map、func）
- 并发读写 map 会 panic，需要 `sync.Map` 或加锁（刷题一般不涉及）
- `for range` 遍历时可以安全 `delete`，但不建议在遍历中 `insert`

---

## Day 2：链表

**本日目标**：掌握单链表的节点结构、遍历、插删指针操作和 dummy 用法。

### 2.1 单链表结构

```go
type ListNode struct {
    Val  int
    Next *ListNode
}
```

```
  ┌─────┬──┐    ┌─────┬──┐    ┌─────┬──────┐
  │  1  │ ─┼───→│  2  │ ─┼───→│  3  │ nil  │
  └─────┴──┘    └─────┴──┘    └─────┴──────┘
  head
```

- 每个节点只有 `Val` 和 `Next`，访问第 i 个节点必须从头遍历 O(i)
- 插入/删除只需改指针，O(1)（已知前驱时）
- Go 中用 `*ListNode`，nil 表示空链表

### 2.2 遍历

```go
// 标准遍历
for p := head; p != nil; p = p.Next {
    fmt.Println(p.Val)
}

// 遍历并记录前驱
var prev *ListNode
for cur := head; cur != nil; {
    next := cur.Next  // 先保存下一个
    // ... 处理 cur ...
    prev = cur
    cur = next
}
```

### 2.3 dummy 节点（哨兵节点）

**核心思想**：创建一个假的头节点，让所有操作统一，不用特判「操作的是 head」的情况。

```go
dummy := &ListNode{Next: head}
// ... 操作链表 ...
return dummy.Next  // 真正的新头
```

**什么时候用 dummy？**
- 头节点可能被删除（如「删除值为 x 的所有节点」）
- 需要在头部插入（如合并链表）
- 凡是结果链表的头可能变化时，一律用 dummy

```
  dummy → [1] → [2] → [3] → nil
  
  删除节点 1 后:
  dummy → [2] → [3] → nil
  
  return dummy.Next → [2] → [3] → nil
```

### 2.4 常见原地插删（结构操作）

链表最核心的是“改指针”，不是随机访问。

```go
// 在 head 前插入 x
newHead := &ListNode{Val: x, Next: head}

// 删除 cur 的下一个节点（保证 cur 和 cur.Next 非 nil）
cur.Next = cur.Next.Next

// 头删（删除 head）
if head != nil {
    head = head.Next
}
```

> 快慢指针、判环、找中点属于算法技巧，统一放在 `algorithm.md` Day 2。

### 2.5 常见坑

- **空指针**：操作前检查 `p != nil`，尤其是 `p.Next.Next` 前要确保 `p.Next != nil`
- **丢失指针**：修改 Next 之前先用临时变量保存 `next := cur.Next`
- **返回值**：函数返回的是新链表的头，不是 dummy 本身

---

## Day 3：栈、队列、堆

**本日目标**：掌握栈、队列、堆这三种容器的结构特性和 Go 实现方式。

### 3.1 栈 (Stack) — LIFO

Go 没有内置栈，用 slice 模拟：

```go
var st []int

// 压栈
st = append(st, x)

// 栈顶
top := st[len(st)-1]

// 弹栈
st = st[:len(st)-1]

// 判空
if len(st) == 0 { /* 空 */ }
```

所有操作 O(1)（append 均摊）。

#### 栈的直觉

```
  压入 1, 2, 3:
  ┌───┐
  │ 3 │  ← 栈顶（最后进，最先出）
  │ 2 │
  │ 1 │
  └───┘
```

- 常见场景：撤销/回退、表达式求值、函数调用栈
- 单调栈属于算法技巧，见 `algorithm.md` Day 3

### 3.2 队列 (Queue) — FIFO

用 slice 模拟：

```go
var q []int

// 入队
q = append(q, x)

// 队头
front := q[0]

// 出队
q = q[1:]

// 判空
if len(q) == 0 { /* 空 */ }
```

- 出队 `q = q[1:]` 不会回收内存（slice 头指针后移），大量出入队后底层数组可能浪费
- 刷题量级一般无问题；若数据量极大可用 `container/list` 双向链表

#### 双端队列

两头都能进出（既能当队列也能当栈）：

```go
// 用 slice 模拟双端队列
var dq []int
// 尾部入队
dq = append(dq, x)
// 尾部出队
dq = dq[:len(dq)-1]
// 头部出队
dq = dq[1:]
// 头部查看
dq[0]
```

### 3.3 堆 / 优先队列 (Heap)

**堆的本质**：一棵完全二叉树，满足「堆性质」：
- **小顶堆**：父 ≤ 子，堆顶是最小值
- **大顶堆**：父 ≥ 子，堆顶是最大值

```
  小顶堆:         大顶堆:
      1               9
     / \             / \
    3   2           7   8
   / \             / \
  7   4           3   5
```

#### Go 的 container/heap

需要实现 `heap.Interface`（5 个方法）：

```go
import "container/heap"

type MinHeap []int

func (h MinHeap) Len() int           { return len(h) }
func (h MinHeap) Less(i, j int) bool { return h[i] < h[j] }  // 小顶堆
func (h MinHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }

func (h *MinHeap) Push(x interface{}) {
    *h = append(*h, x.(int))
}

func (h *MinHeap) Pop() interface{} {
    old := *h
    n := len(old)
    x := old[n-1]
    *h = old[:n-1]
    return x
}

// 使用
h := &MinHeap{}
heap.Push(h, 5)
heap.Push(h, 2)
heap.Push(h, 8)
min := heap.Pop(h).(int) // 2
```

**注意**：不要直接调 `h.Push()`/`h.Pop()`，必须用 `heap.Push(h, x)` 和 `heap.Pop(h)`，后者会维护堆性质。

#### 复杂度

| 操作 | 时间 |
|------|------|
| Push | O(log n) |
| Pop（取最值） | O(log n) |
| Peek（看堆顶） | O(1)，直接 `(*h)[0]` |
| 建堆 (heap.Init) | O(n) |

#### 什么时候用堆？

- **TopK 问题**：维护大小 K 的堆
- **合并 K 个有序链表/数组**：堆存各路当前最小值
- **动态维护最值**：数据流中位数、任务调度等

---

## Day 4：二叉树与 BST

**本日目标**：看懂树节点结构、父子关系、BST 基本性质。

### 4.1 基本结构

```go
type TreeNode struct {
    Val   int
    Left  *TreeNode
    Right *TreeNode
}
```

```
       1
      / \
     2   3
    / \   \
   4   5   6
```

- **叶子**：左右子都为 nil 的节点（如 4, 5, 6）
- **深度/高度**：根到最远叶子的路径长度
- **满二叉树**：每层都满；**完全二叉树**：除最后一层外都满，最后一层从左往右连续

### 4.2 遍历名称（仅结构认知）

- 前序：根 → 左 → 右
- 中序：左 → 根 → 右
- 后序：左 → 右 → 根
- 层序：按层从上到下

> 具体遍历模板、递归写法、BFS 写法统一看 `algorithm.md` Day 4。

### 4.3 二叉搜索树 (BST)

**性质**：对任意节点，左子树所有值 < 当前值 < 右子树所有值。

```
       8
      / \
     3   10
    / \    \
   1   6    14
      / \
     4   7
```

- **中序遍历**：1, 3, 4, 6, 7, 8, 10, 14（有序！）
- **查找**：与根比较，小则走左，大则走右 → O(h)，h 为高度
- **插入**：找到 nil 的位置插入
- 验证/构造/遍历等算法动作见 `algorithm.md` Day 4

#### BST 查找

```go
func searchBST(root *TreeNode, val int) *TreeNode {
    if root == nil || root.Val == val {
        return root
    }
    if val < root.Val {
        return searchBST(root.Left, val)
    }
    return searchBST(root.Right, val)
}
```

---

## Day 5：图（邻接表）

**本日目标**：掌握图的表示方式（邻接表/邻接矩阵）和有向无向差异。

### 5.1 图的表示

#### 邻接表（最常用）

```go
// 方式一：切片（节点编号 0..n-1）
g := make([][]int, n)
g[0] = append(g[0], 1)   // 0 → 1
g[0] = append(g[0], 2)   // 0 → 2

// 方式二：map（节点编号不连续或非整数时）
g := make(map[int][]int)
g[0] = append(g[0], 1)
```

```
  邻接表:
  0: [1, 2]       0 ── 1
  1: [0, 3]       │    │
  2: [0]          2    3
  3: [1]
  
  注意：无向图每条边存两次 (u→v 和 v→u)
```

#### 邻接矩阵

```go
// n×n 矩阵，matrix[i][j] = 1 表示 i→j 有边
matrix := make([][]int, n)
for i := range matrix {
    matrix[i] = make([]int, n)
}
matrix[0][1] = 1
```

- 优点：O(1) 判断两点是否相连
- 缺点：O(n²) 空间，稀疏图浪费
- 刷题中邻接表更常用

#### 带权图

```go
type Edge struct {
    To, Weight int
}
g := make([][]Edge, n)
g[0] = append(g[0], Edge{1, 5})   // 0→1 权重5
```

### 5.2 图的结构要点

- 图通常用“点 + 边”建模：用户关系、依赖关系、网络连通
- 题目若给出“关系对 / 依赖对”，通常就要先建图
- 刷题里默认先用邻接表，内存更省、遍历更方便

> DFS/BFS、拓扑、最短路属于算法部分，统一看 `algorithm.md` Day 5/7。

### 5.3 有向图 vs 无向图

| | 无向图 | 有向图 |
|---|-------|-------|
| 存边 | u→v 和 v→u 各存一次 | 只存 u→v |
| 连通性 | 「连通分量」 | 「强连通分量」 |
| 环检测（算法问题） | 一般结合 DFS/拓扑 | 见 `algorithm.md` |

### 5.4 常见坑

- **忘记 visited**：导致死循环（有环图）或重复计算
- **无向图忘记存两次**：导致只能单方向走
- **边方向**：有向图和无向图存边方式不同（无向图要存两次）

---

## Day 6：复用前面结构

**本日重点**：动态规划。数据结构以数组、切片、哈希表为主。

DP 题目的数据结构通常很简单：
- **一维 DP**：`dp := make([]int, n+1)` 或滚动变量 `a, b`
- **二维 DP**：`dp := make([][]int, m+1)`，每行 `make([]int, n+1)`
- **状态压缩**：用 `map[state]int` 存状态（如字符串状态、bitmask）

回顾 Day 1 的 slice 和 map 用法即可。关键是 Day 6 的 algorithm.md 中的状态设计方法。

---

## Day 7：并查集

**本日目标**：理解并查集的原理，手写带路径压缩和按秩合并的实现。

### 7.1 是什么

并查集管理一组元素的**分组**关系，支持两种操作：
- **Find(x)**：x 属于哪个集合？（返回集合的代表元素 / 根）
- **Union(x, y)**：把 x 和 y 所在的两个集合合并

### 7.2 思想

每个集合用一棵树表示，树根是代表元素。

```
  初始: 每个元素自成一组
  [0] [1] [2] [3] [4]
  
  Union(0,1): 把 1 的根指向 0
      0
      |
      1
  
  Union(2,3):
      2
      |
      3
  
  Union(0,2): 把 2 的根指向 0
      0
     / \
    1   2
        |
        3
  
  Find(3): 3→2→0, 返回 0
```

### 7.3 完整实现（带路径压缩 + 按秩合并）

```go
type UnionFind struct {
    parent []int
    rank   []int
    count  int      // 连通分量数
}

func NewUnionFind(n int) *UnionFind {
    parent := make([]int, n)
    rank := make([]int, n)
    for i := range parent {
        parent[i] = i   // 初始时每个元素的父亲是自己
    }
    return &UnionFind{parent, rank, n}
}

// 路径压缩：让路径上所有节点直接指向根
func (uf *UnionFind) Find(x int) int {
    if uf.parent[x] != x {
        uf.parent[x] = uf.Find(uf.parent[x])  // 递归压缩
    }
    return uf.parent[x]
}

// 按秩合并：矮树挂到高树上，避免退化成链
func (uf *UnionFind) Union(x, y int) {
    rx, ry := uf.Find(x), uf.Find(y)
    if rx == ry { return }           // 已经同组
    if uf.rank[rx] < uf.rank[ry] {
        uf.parent[rx] = ry
    } else if uf.rank[rx] > uf.rank[ry] {
        uf.parent[ry] = rx
    } else {
        uf.parent[ry] = rx
        uf.rank[rx]++
    }
    uf.count--
}

func (uf *UnionFind) Connected(x, y int) bool {
    return uf.Find(x) == uf.Find(y)
}
```

### 7.4 为什么要路径压缩 + 按秩？

```
  不优化时 Find 可能退化为 O(n):
  0 ← 1 ← 2 ← 3 ← 4   (链状)
  
  路径压缩后:
      0
    / | \ \
   1  2  3  4           (所有直接连根)
  
  Find 几乎 O(1)（准确说是 O(α(n))，α 是反阿克曼函数，实际 ≤ 4）
```

### 7.5 典型场景

- **岛屿数量**：每个 '1' 是节点，相邻 '1' 做 Union，最后数 count
- **连通分量数**：Union 所有边后看 count
- **账户合并**：同一邮箱的账户 Union
- **判断是否连通**：Find(x) == Find(y)
