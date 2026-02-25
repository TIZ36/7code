# 数据结构 — 按日分节

> 每日只读当日小节即可。读完后前往 **algorithm.md** 同一天的小节。

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

**本日目标**：掌握单链表的指针操作，理解 dummy 节点和快慢指针的原理。

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

### 2.4 快慢指针

两个指针同时从 head 出发，**快指针每次走 2 步，慢指针每次走 1 步**。

**应用一：找中点**

```
  slow →     1 → 2 → 3 → 4 → 5 → nil
  fast →     1 → 2 → 3 → 4 → 5 → nil

  第1步: slow=2, fast=3
  第2步: slow=3, fast=5
  fast.Next==nil 停止 → slow=3 就是中点
```

- 偶数长度 `1→2→3→4`：fast 到 4 时 slow 在 2（中间偏左）
- 若要中间偏右，判断条件改为 `fast != nil && fast.Next != nil`

**应用二：判环**

```
  如果链表有环，快指针一定会追上慢指针（像操场跑步）
  
  1 → 2 → 3 → 4
              ↑   ↓
              6 ← 5
  
  快慢指针一定会在环内相遇
```

**应用三：找环入口**（Floyd 算法）

```
  相遇后，一个指针从 head 出发，一个从相遇点出发
  两个都每次走 1 步，再次相遇的点就是环入口
  
  数学原理：设 head 到入口距离 a，入口到相遇点 b，环长 c
  快指针走了 a+b+nc，慢指针走了 a+b
  2(a+b) = a+b+nc → a+b = nc → a = nc-b = (n-1)c + (c-b)
  即从 head 走 a 步 = 从相遇点走 c-b 步（都到入口）
```

### 2.5 常见坑

- **空指针**：操作前检查 `p != nil`，尤其是 `p.Next.Next` 前要确保 `p.Next != nil`
- **丢失指针**：修改 Next 之前先用临时变量保存 `next := cur.Next`
- **返回值**：函数返回的是新链表的头，不是 dummy 本身

---

## Day 3：栈、队列、堆

**本日目标**：用 slice 实现栈/队列，理解单调栈，掌握 Go 的 `container/heap`。

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

- **「最近匹配」** → 用栈：括号匹配、HTML 标签、函数调用
- **「单调性」** → 用单调栈：下一个更大/更小元素

#### 单调栈详解

维护一个从栈底到栈顶**单调递减**的栈，用于求「每个元素右边第一个比它大的」。

```
  数组: [2, 1, 4, 3]
  
  遍历 2: 栈空，入栈           栈: [2]
  遍历 1: 1 < 栈顶2，入栈      栈: [2, 1]
  遍历 4: 4 > 栈顶1 → 弹出1，1 的「下一个更大」= 4
          4 > 栈顶2 → 弹出2，2 的「下一个更大」= 4
          栈空，4 入栈          栈: [4]
  遍历 3: 3 < 栈顶4，入栈      栈: [4, 3]
  结束: 栈中剩余 [4, 3] 没有更大的元素
```

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

两头都能进出，用于「滑动窗口最大值」等场景：

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

**本日目标**：掌握树的递归思维、四种遍历、BST 性质。

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

### 4.2 四种遍历

#### 前序 (Pre-order)：根 → 左 → 右

```go
func preorder(root *TreeNode) {
    if root == nil { return }
    visit(root.Val)         // 先处理根
    preorder(root.Left)
    preorder(root.Right)
}
// 上面的树: 1, 2, 4, 5, 3, 6
```

用途：序列化树、复制树。

#### 中序 (In-order)：左 → 根 → 右

```go
func inorder(root *TreeNode) {
    if root == nil { return }
    inorder(root.Left)
    visit(root.Val)         // 中间处理根
    inorder(root.Right)
}
// 上面的树: 4, 2, 5, 1, 3, 6
```

用途：BST 中序即**有序**序列。

#### 后序 (Post-order)：左 → 右 → 根

```go
func postorder(root *TreeNode) {
    if root == nil { return }
    postorder(root.Left)
    postorder(root.Right)
    visit(root.Val)         // 最后处理根
}
// 上面的树: 4, 5, 2, 6, 3, 1
```

用途：需要**先知道左右子树结果再算根**的题（高度、直径、最大路径和）。

#### 层序 (Level-order)：BFS

```go
func levelOrder(root *TreeNode) [][]int {
    if root == nil { return nil }
    var res [][]int
    q := []*TreeNode{root}
    for len(q) > 0 {
        size := len(q)                    // 当前层的节点数
        row := make([]int, 0, size)
        for i := 0; i < size; i++ {
            node := q[0]; q = q[1:]
            row = append(row, node.Val)
            if node.Left != nil  { q = append(q, node.Left) }
            if node.Right != nil { q = append(q, node.Right) }
        }
        res = append(res, row)
    }
    return res
}
// 上面的树: [[1], [2,3], [4,5,6]]
```

### 4.3 递归思维

树的题 90% 都是递归。关键是想清楚**递归函数的定义**：

1. **函数要返回什么？**（高度、是否满足条件、子树的某个值）
2. **当前根如何利用左右子树的返回值？**
3. **base case 是什么？**（通常是 `root == nil`）

```
  求最大深度的思维过程:
  
  maxDepth(1) = 1 + max(maxDepth(2), maxDepth(3))
                        |                 |
                 1+max(maxD(4),maxD(5))  1+max(nil, maxD(6))
                      |        |              |
                   1+max(0,0) 1+max(0,0)   1+max(0,0)
                      = 1       = 1           = 1
                        |                     |
                    = 1+max(1,1) = 2     = 1+max(0,1) = 2
                              |
                          = 1 + max(2, 2) = 3
```

### 4.4 二叉搜索树 (BST)

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
- **验证 BST**：递归传 [min, max] 区间，或中序检查严格递增

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

**本日目标**：掌握图的存储、遍历（DFS/BFS）和基本性质。

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

### 5.2 图的遍历

#### DFS（深度优先）

```go
visited := make([]bool, n)

var dfs func(int)
dfs = func(u int) {
    visited[u] = true
    for _, v := range g[u] {
        if !visited[v] {
            dfs(v)
        }
    }
}

dfs(0) // 从节点 0 开始
```

```
  DFS 从 0 出发:
  0 → 1 → 3 (回溯) → (回溯到1) → (回溯到0) → 2
  
  访问顺序: 0, 1, 3, 2
```

#### BFS（广度优先）

```go
visited := make([]bool, n)
visited[0] = true
q := []int{0}

for len(q) > 0 {
    u := q[0]; q = q[1:]
    for _, v := range g[u] {
        if !visited[v] {
            visited[v] = true   // 入队时就标记！
            q = append(q, v)
        }
    }
}
```

```
  BFS 从 0 出发:
  第0层: [0]
  第1层: [1, 2]
  第2层: [3]
  
  访问顺序: 0, 1, 2, 3
```

**BFS 的关键**：入队时立刻标记 visited（不是出队时），否则同一个节点会被重复入队。

### 5.3 有向图 vs 无向图

| | 无向图 | 有向图 |
|---|-------|-------|
| 存边 | u→v 和 v→u 各存一次 | 只存 u→v |
| 连通性 | 「连通分量」 | 「强连通分量」 |
| 环检测 | DFS 中遇到已访问且非父节点 | 需要三色标记或拓扑排序 |

### 5.4 常见坑

- **忘记 visited**：导致死循环（有环图）或重复计算
- **无向图忘记存两次**：导致只能单方向走
- **BFS 入队时机**：必须入队时标记，不能等到出队

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
