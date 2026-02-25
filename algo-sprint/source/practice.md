# 例题与答案 — 按日巩固

> **使用方式**：每道题按四步走：
> 1. 先只看「题意」，自己想 3～5 分钟
> 2. 卡住了看「提示 1」，再想 3 分钟
> 3. 还卡住看「提示 2」（更具体的方向）
> 4. 最后对照「完整思路 + 代码」
>
> 这种「渐进提示」迫使你主动思考，比直接看答案记忆更深。

---

## Day 1

### 例题 1：两数之和 II（有序数组）— LeetCode 167

**题意**：有序数组找两数之和等于 target，返回两数下标（从 1 开始）。

<details><summary>💡 提示 1（方向）</summary>

数组已经有序，你能否利用「有序」这个性质，避免 O(n²) 暴力？想想两端的数有什么特殊性。

</details>

<details><summary>💡 提示 2（更具体）</summary>

试试从数组两端各放一个指针。两数之和太大了怎么办？太小了呢？

</details>

<details><summary>✅ 完整思路与代码</summary>

**思路**：相向双指针。`l=0, r=len-1`，若 `nums[l]+nums[r] > target` 则 `r--`，否则 `l++`，相等即答案。

```go
func twoSum(numbers []int, target int) []int {
    l, r := 0, len(numbers)-1
    for l < r {
        sum := numbers[l] + numbers[r]
        if sum == target {
            return []int{l + 1, r + 1}
        }
        if sum > target {
            r--
        } else {
            l++
        }
    }
    return nil
}
```

**复杂度**：时间 O(n)，空间 O(1)。

**边界检查**：数组长度 ≥ 2（题意保证）；有序保证不漏解；不需要处理重复。

</details>

---

### 例题 2：最长无重复字符子串 — LeetCode 3

**题意**：求字符串中最长不含重复字符的子串长度。

<details><summary>💡 提示 1（方向）</summary>

你需要一个「窗口」来框住当前子串。什么时候需要缩小窗口？

</details>

<details><summary>💡 提示 2（更具体）</summary>

用 map 记住每个字符最后出现的位置。当右指针遇到重复字符时，左指针应该跳到哪？

</details>

<details><summary>✅ 完整思路与代码</summary>

**思路**：滑动窗口 + map 记录字符最后出现下标。右指针扩，若当前字符已出现且上次位置 ≥ 左指针，则左指针移到 `last+1`；每次用 `r-l+1` 更新答案。

```go
func lengthOfLongestSubstring(s string) int {
    last := make(map[byte]int)
    l, ans := 0, 0
    for r := 0; r < len(s); r++ {
        b := s[r]
        if idx, ok := last[b]; ok && idx >= l {
            l = idx + 1
        }
        last[b] = r
        if r-l+1 > ans {
            ans = r - l + 1
        }
    }
    return ans
}
```

**复杂度**：时间 O(n)，空间 O(字符集)。

**边界检查**：空字符串 → 返回 0（l=0, r 不进循环）；全相同字符 → 返回 1；全不同 → 返回 len(s)。

</details>

---

**下一站**：→ [quiz.md - Day 1](quiz.md#day-1)

---

## Day 2

### 例题 1：反转链表 — LeetCode 206

**题意**：反转单链表。

<details><summary>💡 提示 1（方向）</summary>

你需要把每个节点的 Next 指针反过来。想想需要几个指针变量来完成这件事？

</details>

<details><summary>💡 提示 2（更具体）</summary>

用三个指针：prev（已反转部分的头）、cur（当前处理的节点）、next（暂存下一个）。每步做什么？

</details>

<details><summary>✅ 完整思路与代码</summary>

**思路**：迭代三指针。`prev=nil, cur=head`，每次 `next=cur.Next`，`cur.Next=prev`，然后 `prev, cur = cur, next`。

```go
func reverseList(head *ListNode) *ListNode {
    var prev *ListNode
    for head != nil {
        next := head.Next
        head.Next = prev
        prev, head = head, next
    }
    return prev
}
```

**复杂度**：时间 O(n)，空间 O(1)。

**边界检查**：nil 链表 → 直接返回 nil；单节点 → 返回自身；两节点 → 正确反转。

</details>

---

### 例题 2：合并两个有序链表 — LeetCode 21

**题意**：将两个有序链表合并为一个有序链表。

<details><summary>💡 提示 1（方向）</summary>

和合并两个有序数组的思路类似。但链表需要注意：结果链表的头节点怎么处理比较优雅？

</details>

<details><summary>💡 提示 2（更具体）</summary>

用一个 dummy 头节点，这样就不用特判「结果链表为空」的情况。两条链各一个指针，每次把小的接上。

</details>

<details><summary>✅ 完整思路与代码</summary>

**思路**：dummy 节点 + 比较两链当前节点，小的接在 dummy 链后。

```go
func mergeTwoLists(l1 *ListNode, l2 *ListNode) *ListNode {
    dummy := &ListNode{}
    p := dummy
    for l1 != nil && l2 != nil {
        if l1.Val <= l2.Val {
            p.Next, l1 = l1, l1.Next
        } else {
            p.Next, l2 = l2, l2.Next
        }
        p = p.Next
    }
    if l1 != nil {
        p.Next = l1
    } else {
        p.Next = l2
    }
    return dummy.Next
}
```

**复杂度**：时间 O(n+m)，空间 O(1)。

**边界检查**：一条为 nil → 直接返回另一条；两条都为 nil → 返回 nil；等值节点正确处理（`<=` 保证稳定）。

</details>

---

**下一站**：→ [quiz.md - Day 2](quiz.md#day-2)

---

## Day 3

### 例题 1：有效括号 — LeetCode 20

**题意**：判断括号字符串是否有效（成对且顺序正确）。

<details><summary>💡 提示 1（方向）</summary>

「最近的左括号」必须和当前右括号匹配。什么数据结构天然维护「最近的」？

</details>

<details><summary>💡 提示 2（更具体）</summary>

栈。左括号入栈，遇到右括号时检查栈顶。还要考虑：栈空时遇到右括号、遍历完栈不空。

</details>

<details><summary>✅ 完整思路与代码</summary>

**思路**：栈。左括号入栈，右括号与栈顶匹配则弹栈，否则无效；最后栈空才有效。

```go
func isValid(s string) bool {
    st := []byte{}
    pair := map[byte]byte{')': '(', ']': '[', '}': '{'}
    for i := 0; i < len(s); i++ {
        b := s[i]
        if b == '(' || b == '[' || b == '{' {
            st = append(st, b)
        } else {
            if len(st) == 0 || st[len(st)-1] != pair[b] {
                return false
            }
            st = st[:len(st)-1]
        }
    }
    return len(st) == 0
}
```

**复杂度**：时间 O(n)，空间 O(n)。

**边界检查**：空字符串 → true；纯左括号 → false（栈不空）；纯右括号 → false（栈空时弹栈）。

</details>

---

### 例题 2：数组中的第 K 个最大元素 — LeetCode 215

**题意**：找出未排序数组中第 K 大的元素。

<details><summary>💡 提示 1（方向）</summary>

排序后取第 K 个是 O(n log n)。能不能更快？想想堆和快排 partition 的性质。

</details>

<details><summary>💡 提示 2（更具体）</summary>

方法一：维护大小为 K 的小顶堆，遍历完堆顶就是第 K 大。方法二：快排 partition，根据 pivot 位置决定只往一边递归。

</details>

<details><summary>✅ 完整思路与代码</summary>

**思路**：小顶堆维护 K 个最大值。Go 用 `container/heap`。

```go
import "container/heap"

type IntHeap []int
func (h IntHeap) Len() int            { return len(h) }
func (h IntHeap) Less(i, j int) bool   { return h[i] < h[j] }
func (h IntHeap) Swap(i, j int)        { h[i], h[j] = h[j], h[i] }
func (h *IntHeap) Push(x interface{})  { *h = append(*h, x.(int)) }
func (h *IntHeap) Pop() interface{}    { old := *h; x := old[len(old)-1]; *h = old[:len(old)-1]; return x }

func findKthLargest(nums []int, k int) int {
    h := &IntHeap{}
    for _, v := range nums {
        heap.Push(h, v)
        if h.Len() > k {
            heap.Pop(h)
        }
    }
    return (*h)[0]
}
```

**复杂度**：时间 O(n log k)，空间 O(k)。

**边界检查**：k=1 → 最大值；k=len(nums) → 最小值；含重复值也正确。

</details>

---

**下一站**：→ [quiz.md - Day 3](quiz.md#day-3)

---

## Day 4

### 例题 1：二叉树最大深度 — LeetCode 104

**题意**：求二叉树最大深度。

<details><summary>💡 提示 1（方向）</summary>

一棵树的深度和它的左右子树深度有什么关系？

</details>

<details><summary>💡 提示 2（更具体）</summary>

递归：空树深度 0，非空则 `1 + max(左深度, 右深度)`。想想这是前序、中序还是后序？

</details>

<details><summary>✅ 完整思路与代码</summary>

**思路**：后序递归。空树 0；否则 `1 + max(左深度, 右深度)`。

```go
func maxDepth(root *TreeNode) int {
    if root == nil {
        return 0
    }
    return 1 + max(maxDepth(root.Left), maxDepth(root.Right))
}
func max(a, b int) int { if a > b { return a }; return b }
```

**复杂度**：时间 O(n)，空间 O(高度)。

**边界检查**：nil → 0；只有根 → 1；完全偏斜（退化链表）→ 空间 O(n)。

</details>

---

### 例题 2：验证二叉搜索树 — LeetCode 98

**题意**：判断二叉树是否为 BST。

<details><summary>💡 提示 1（方向）</summary>

BST 不仅要求「左 < 根 < 右」，还要求左子树的**所有节点**都小于根。单纯比较父子不够。

</details>

<details><summary>💡 提示 2（更具体）</summary>

方法一：递归时传一个 [min, max] 区间，当前节点必须在区间内。方法二：中序遍历，结果应严格递增。

</details>

<details><summary>✅ 完整思路与代码</summary>

**思路**：递归传 [min, max] 区间。

```go
import "math"

func isValidBST(root *TreeNode) bool {
    var check func(*TreeNode, int64, int64) bool
    check = func(n *TreeNode, lo, hi int64) bool {
        if n == nil {
            return true
        }
        v := int64(n.Val)
        if v <= lo || v >= hi {
            return false
        }
        return check(n.Left, lo, v) && check(n.Right, v, hi)
    }
    return check(root, math.MinInt64, math.MaxInt64)
}
```

**复杂度**：时间 O(n)，空间 O(高度)。

**边界检查**：nil → true；单节点 → true；Val 为 int32 极值时用 int64 避免溢出。

</details>

---

**下一站**：→ [quiz.md - Day 4](quiz.md#day-4)

---

## Day 5

### 例题 1：子集 — LeetCode 78

**题意**：求数组的所有子集（幂集）。

<details><summary>💡 提示 1（方向）</summary>

每个元素有「选」或「不选」两种状态。怎么系统性地枚举所有可能？

</details>

<details><summary>💡 提示 2（更具体）</summary>

回溯：从 start 开始，每次选一个加入路径，递归，再撤销。注意：Go 中 append 的 slice 需要深拷贝才能收集进结果。

</details>

<details><summary>✅ 完整思路与代码</summary>

**思路**：回溯。从下标 start 开始选，每层记录当前路径为一种子集。

```go
func subsets(nums []int) [][]int {
    var res [][]int
    var path []int
    var dfs func(int)
    dfs = func(start int) {
        res = append(res, append([]int(nil), path...))
        for i := start; i < len(nums); i++ {
            path = append(path, nums[i])
            dfs(i + 1)
            path = path[:len(path)-1]
        }
    }
    dfs(0)
    return res
}
```

**复杂度**：时间 O(2^n)，空间 O(n)。

**边界检查**：空数组 → 只有 `[[]]`；单元素 → `[[], [x]]`。

</details>

---

### 例题 2：岛屿数量 — LeetCode 200

**题意**：二维网格，'1' 为陆地，求连通陆地块数。

<details><summary>💡 提示 1（方向）</summary>

从任意一个 '1' 出发，把整块连通的 '1' 都访问完，就算一个岛。怎么遍历连通区域？

</details>

<details><summary>💡 提示 2（更具体）</summary>

DFS 或 BFS。访问过的改成 '0'（或用 visited），然后四方向扩展。外层循环每次发现新的 '1'，计数 +1。

</details>

<details><summary>✅ 完整思路与代码</summary>

**思路**：DFS。遍历网格，遇到 '1' 则从该点 DFS 把整块标为 '0'，块数 +1。

```go
func numIslands(grid [][]byte) int {
    if len(grid) == 0 {
        return 0
    }
    n, m := len(grid), len(grid[0])
    var dfs func(int, int)
    dfs = func(i, j int) {
        if i < 0 || i >= n || j < 0 || j >= m || grid[i][j] != '1' {
            return
        }
        grid[i][j] = '0'
        dfs(i+1, j)
        dfs(i-1, j)
        dfs(i, j+1)
        dfs(i, j-1)
    }
    count := 0
    for i := 0; i < n; i++ {
        for j := 0; j < m; j++ {
            if grid[i][j] == '1' {
                count++
                dfs(i, j)
            }
        }
    }
    return count
}
```

**复杂度**：时间 O(n×m)，空间 O(n×m)递归栈。

**边界检查**：空网格 → 0；全 '0' → 0；全 '1' → 1；1×1 网格 → 视值而定。

</details>

---

**下一站**：→ [quiz.md - Day 5](quiz.md#day-5)

---

## Day 6

### 例题 1：爬楼梯 — LeetCode 70

**题意**：每次可爬 1 或 2 阶，到 n 阶有多少种方法。

<details><summary>💡 提示 1（方向）</summary>

到第 n 阶，你是从第 n-1 阶来的（走 1 步），还是从第 n-2 阶来的（走 2 步）。这两种选择之间有什么关系？

</details>

<details><summary>💡 提示 2（更具体）</summary>

`f(n) = f(n-1) + f(n-2)`，像不像一个经典数列？初始值 `f(1)=1, f(2)=2`。能用两个变量滚动吗？

</details>

<details><summary>✅ 完整思路与代码</summary>

**思路**：`dp[i]=dp[i-1]+dp[i-2]`，滚动为两个变量。

```go
func climbStairs(n int) int {
    if n <= 2 {
        return n
    }
    a, b := 1, 2
    for i := 3; i <= n; i++ {
        a, b = b, a+b
    }
    return b
}
```

**复杂度**：时间 O(n)，空间 O(1)。

**边界检查**：n=1 → 1；n=2 → 2。

</details>

---

### 例题 2：最长递增子序列 — LeetCode 300

**题意**：求数组最长严格递增子序列长度。

<details><summary>💡 提示 1（方向）</summary>

子序列可以不连续。如果你知道以每个位置结尾的 LIS 长度，能推出整体答案吗？

</details>

<details><summary>💡 提示 2（更具体）</summary>

`dp[i]` = 以 `nums[i]` 结尾的 LIS 长度。对每个 `j < i` 且 `nums[j] < nums[i]`，`dp[i] = max(dp[i], dp[j]+1)`。初始全为 1。时间 O(n²)。

</details>

<details><summary>✅ 完整思路与代码</summary>

**思路**：经典一维 DP。

```go
func lengthOfLIS(nums []int) int {
    if len(nums) == 0 {
        return 0
    }
    dp := make([]int, len(nums))
    for i := range dp {
        dp[i] = 1
    }
    ans := 1
    for i := 1; i < len(nums); i++ {
        for j := 0; j < i; j++ {
            if nums[j] < nums[i] && dp[j]+1 > dp[i] {
                dp[i] = dp[j] + 1
            }
        }
        if dp[i] > ans {
            ans = dp[i]
        }
    }
    return ans
}
```

**复杂度**：时间 O(n²)，空间 O(n)。进阶可用二分 + 贪心做到 O(n log n)。

**边界检查**：空数组 → 0；单元素 → 1；全递减 → 1；全递增 → n。

</details>

---

**下一站**：→ [quiz.md - Day 6](quiz.md#day-6)

---

## Day 7

### 例题 1：省份数量（并查集）— LeetCode 547

**题意**：n 个城市，isConnected[i][j]=1 表示相连，求省份数（连通分量数）。

<details><summary>💡 提示 1（方向）</summary>

这就是求图的连通分量数。你能用什么数据结构高效地合并「同属一组」的节点？

</details>

<details><summary>💡 提示 2（更具体）</summary>

并查集。初始每个城市自成一组。遍历所有边，Union 连通的两个城市。最后统计有多少个根（parent[i]==i）。

</details>

<details><summary>✅ 完整思路与代码</summary>

**思路**：并查集 + 路径压缩。

```go
func findCircleNum(isConnected [][]int) int {
    n := len(isConnected)
    parent := make([]int, n)
    for i := range parent {
        parent[i] = i
    }
    var find func(int) int
    find = func(x int) int {
        if parent[x] != x {
            parent[x] = find(parent[x])
        }
        return parent[x]
    }
    union := func(a, b int) {
        parent[find(a)] = find(b)
    }
    for i := 0; i < n; i++ {
        for j := i + 1; j < n; j++ {
            if isConnected[i][j] == 1 {
                union(i, j)
            }
        }
    }
    count := 0
    for i := 0; i < n; i++ {
        if find(i) == i {
            count++
        }
    }
    return count
}
```

**复杂度**：时间约 O(n²·α(n))，空间 O(n)。

**边界检查**：n=1 → 1；全连通 → 1；全不连通 → n。

</details>

---

### 例题 2：课程表（拓扑排序）— LeetCode 207

**题意**：numCourses 门课，prerequisites 为先修关系，判断能否修完所有课（无环）。

<details><summary>💡 提示 1（方向）</summary>

这是有向图上判断是否有环。什么算法能检测有向图是否存在合法的排列顺序？

</details>

<details><summary>💡 提示 2（更具体）</summary>

拓扑排序（Kahn）：统计入度，入度 0 入队；出队时删边，新入度 0 入队。如果出队总数 < numCourses，说明有环。

</details>

<details><summary>✅ 完整思路与代码</summary>

**思路**：Kahn 拓扑排序。

```go
func canFinish(numCourses int, prerequisites [][]int) bool {
    indeg := make([]int, numCourses)
    g := make([][]int, numCourses)
    for _, e := range prerequisites {
        v, u := e[0], e[1]
        g[u] = append(g[u], v)
        indeg[v]++
    }
    var q []int
    for i := 0; i < numCourses; i++ {
        if indeg[i] == 0 {
            q = append(q, i)
        }
    }
    out := 0
    for len(q) > 0 {
        u := q[0]
        q = q[1:]
        out++
        for _, v := range g[u] {
            indeg[v]--
            if indeg[v] == 0 {
                q = append(q, v)
            }
        }
    }
    return out == numCourses
}
```

**复杂度**：时间 O(V+E)，空间 O(V+E)。

**边界检查**：无先修 → 全能修完；自环 `[0,0]` → 入度永不为 0，返回 false。

</details>

---

**下一站**：→ [quiz.md - Day 7](quiz.md#day-7)。完成即完成 7 日速通。
