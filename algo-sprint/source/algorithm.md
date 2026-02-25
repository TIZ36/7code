# 算法思想 — 按日分节

> 每日读完 datastructure.md 当日小节后，再读本文件同日小节。读完后前往 **combo.md** 同日小节。

> **你现在在：实现层（How）**
> - 看什么：模板、状态定义、复杂度、边界、可运行代码  
> - 暂时不看：大量题面信号识别与路线分流  
> - 下一站：`combo.md`（选型层）

---

## 内容边界（先看这段，避免混读）

`algorithm.md` 只做一件事：**教你把算法写出来**。

- 这里重点是：定义状态、推导转移、模板结构、复杂度、边界处理、代码实现
- 这里不重点展开：题面信号识别、多套路选型决策（这些放在 `combo.md`）

一句话：
- `algorithm.md` = **实现手册（How）**
- `combo.md` = **选型手册（When/Why）**

---

## Day 1：双指针与滑动窗口

**本日目标**：掌握双指针的三种模式和滑动窗口的通用模板。

### 1.1 双指针总览

双指针不是一种算法，而是一种**遍历策略**——用两个指针代替两层循环，把 O(n²) 降到 O(n)。

两大类、三种模式：

```
  ① 相向双指针:  l →    ← r    两端向中间靠拢
  ② 同向双指针:  l →  r →      同方向前进
      ├─ 读写指针: w(写) r(读)   步长都是 1，但推进条件不同（数组去重、移除元素）
      └─ 快慢指针: slow → fast →→  步长不同（1 vs 2），靠速度差产生信息（链表判环、找中点）
```

> **同向双指针**是大类，**快慢指针**是其中的特例。
> 区别：读写指针在**数组**上用，两个都走1步，slow 按条件推进；
> 快慢指针在**链表**上用，步长 1 vs 2，靠速度差让两者相遇。
> Day 1 讲数组上的读写指针和滑动窗口，Day 2 讲链表上的快慢指针。

### 1.2 相向双指针

**核心**：一左一右，根据条件决定移动哪一个。

**典型题：有序数组两数之和**

```
  nums = [1, 3, 5, 7, 9], target = 8
  
  l=0, r=4: 1+9=10 > 8  → r--
  l=0, r=3: 1+7=8  = 8  → 找到！
```

**为什么不会漏？** 假设答案是 (i, j)，i < j。
- 如果 l < i，说明之前 l+r > target 导致 r 左移，但 r ≥ j（因为 r 只减不增），所以 l 会继续右移直到 l=i
- 对称地 r 不会跳过 j
- 因此双指针一定能扫到 (i, j)

**模板**：

```go
func twoSumSorted(nums []int, target int) (int, int) {
    l, r := 0, len(nums)-1
    for l < r {
        sum := nums[l] + nums[r]
        if sum == target {
            return l, r
        }
        if sum < target {
            l++
        } else {
            r--
        }
    }
    return -1, -1
}
```

**变体**：
- **三数之和**：固定一个数，对剩余部分用两数之和
- **接雨水**：左右指针维护 leftMax/rightMax
- **判断回文**：l, r 对比 s[l]==s[r]

### 1.3 同向双指针

**核心**：两个指针同方向走，一个「写」一个「读」（或一快一慢）。

**典型题：原地去重**

```
  nums = [1, 1, 2, 2, 3]
  
  w=1 (写指针), r=1 (读指针)
  r=1: nums[1]=1 == nums[w-1]=1  → 跳过
  r=2: nums[2]=2 != nums[w-1]=1  → nums[w]=2, w++  → [1,2,...]
  r=3: nums[3]=2 == nums[w-1]=2  → 跳过
  r=4: nums[4]=3 != nums[w-1]=2  → nums[w]=3, w++  → [1,2,3,...]
  
  返回 w=3，前 3 个元素就是去重后的结果
```

**模板**：

```go
func removeDuplicates(nums []int) int {
    if len(nums) == 0 { return 0 }
    w := 1
    for r := 1; r < len(nums); r++ {
        if nums[r] != nums[w-1] {
            nums[w] = nums[r]
            w++
        }
    }
    return w
}
```

### 1.4 滑动窗口

滑动窗口是同向双指针的特殊形式：**维护一个连续区间 [l, r]，右指针扩张，左指针在条件不满足时收缩**。

#### 可变长度窗口模板（最常用）

```go
func slidingWindow(s string) int {
    window := make(map[byte]int)  // 窗口内的状态
    l := 0
    ans := 0

    for r := 0; r < len(s); r++ {
        // 1. 右指针元素入窗
        c := s[r]
        window[c]++

        // 2. 收缩：当窗口不合法时，移动左指针
        for /* 窗口不满足条件 */ {
            d := s[l]
            window[d]--
            l++
        }

        // 3. 更新答案（此时窗口合法）
        if r-l+1 > ans {
            ans = r - l + 1
        }
    }
    return ans
}
```

#### 实例：最长无重复子串

「窗口不满足条件」= 窗口内有重复字符

```go
func lengthOfLongestSubstring(s string) int {
    count := make(map[byte]int)
    l, ans := 0, 0
    for r := 0; r < len(s); r++ {
        count[s[r]]++
        for count[s[r]] > 1 {  // 有重复时收缩
            count[s[l]]--
            l++
        }
        if r-l+1 > ans { ans = r - l + 1 }
    }
    return ans
}
```

```
  s = "abcabc"
  
  r=0: 窗口 [a]       ans=1
  r=1: 窗口 [ab]      ans=2
  r=2: 窗口 [abc]     ans=3
  r=3: 'a' 重复 → 收缩到 l=1, 窗口 [bca]  ans=3
  r=4: 'b' 重复 → 收缩到 l=2, 窗口 [cab]  ans=3
  r=5: 'c' 重复 → 收缩到 l=3, 窗口 [abc]  ans=3
```

#### 固定长度窗口

窗口大小始终为 k，右边进一个、左边出一个，窗口像"传送带"一样平移。

**典型题：LeetCode 643 — 子数组最大平均数 I**

> 给定数组 nums 和整数 k，找长度为 k 的连续子数组的最大平均值。

```
  nums = [1, 12, -5, -6, 50, 3],  k = 4

  初始窗口 [1, 12, -5, -6]  sum = 2
  
  右移一步：+50, -1  → [12, -5, -6, 50]  sum = 51  ← 最大
  右移一步：+3, -12  → [-5, -6, 50, 3]   sum = 42

  答案：51 / 4 = 12.75
```

每次移动只做一次加法和一次减法，不需要重新求和——这就是固定窗口的核心优势。

**模板**：

```go
func findMaxAverage(nums []int, k int) float64 {
    sum := 0
    for i := 0; i < k; i++ {
        sum += nums[i]
    }
    maxSum := sum
    for r := k; r < len(nums); r++ {
        sum += nums[r] - nums[r-k] // 右边进，左边出
        if sum > maxSum {
            maxSum = sum
        }
    }
    return float64(maxSum) / float64(k)
}
```

**与可变窗口的区别**：

| | 固定窗口 | 可变窗口 |
|---|---|---|
| 窗口大小 | 始终 = k | 动态伸缩 |
| 左指针移动 | 每步必移（r-k 位置） | 仅在不合法时收缩 |
| 典型题 | 最大平均数、定长子串匹配 | 最长无重复子串、最小覆盖子串 |

### 1.5 二分查找（补充）

有序数组上的经典算法，Day 1 适合一并掌握。

**典型题：LeetCode 704 — 二分查找**

> 给定有序数组 nums 和目标值 target，找到 target 的下标，不存在返回 -1。

```
  nums = [1, 3, 5, 7, 9], target = 7

  l=0, r=4: mid=2, nums[2]=5 < 7  → l=3
  l=3, r=4: mid=3, nums[3]=7 == 7 → 找到！返回 3
```

**模板**：

```go
func binarySearch(nums []int, target int) int {
    l, r := 0, len(nums)-1
    for l <= r {
        mid := l + (r-l)/2
        if nums[mid] == target {
            return mid
        }
        if nums[mid] < target {
            l = mid + 1
        } else {
            r = mid - 1
        }
    }
    return -1
}
```

**关键细节**：
- `mid = l + (r-l)/2` 防止 `(l+r)` 溢出
- `l <= r`（等号要有，否则漏掉单元素区间）
- 收缩时 `l = mid+1` / `r = mid-1`（不要 `l = mid`，否则可能死循环）

**变体**：
- **查找左边界**（第一个 ≥ target）：`sort.SearchInts(nums, target)`
- **查找右边界**（最后一个 ≤ target）：`sort.SearchInts(nums, target+1) - 1`
- **答案二分**：二分的不是数组下标，而是「答案空间」（如最小化最大值）

---

## Day 2：链表与快慢指针

**本日目标**：掌握反转、合并、找中点、判环四大链表操作。

### 2.1 反转链表（迭代）

**核心**：三个指针逐步翻转 Next 方向。

```
  初始:   nil ← prev   cur → next → ...
  
  步骤:
  1. next = cur.Next        (保存下一个)
  2. cur.Next = prev        (反转指向)
  3. prev = cur             (prev 前进)
  4. cur = next             (cur 前进)
  
  图示:
  nil  1 → 2 → 3 → nil
  prev cur
  
  nil ← 1  2 → 3 → nil      (1.Next = nil)
       prev cur
  
  nil ← 1 ← 2  3 → nil      (2.Next = 1)
            prev cur
  
  nil ← 1 ← 2 ← 3           (3.Next = 2)
                 prev cur=nil  → 结束
```

```go
func reverseList(head *ListNode) *ListNode {
    var prev *ListNode
    cur := head
    for cur != nil {
        next := cur.Next
        cur.Next = prev
        prev = cur
        cur = next
    }
    return prev
}
```

### 2.2 反转链表（递归）

```go
func reverseList(head *ListNode) *ListNode {
    if head == nil || head.Next == nil {
        return head
    }
    newHead := reverseList(head.Next)  // 递归反转后面的部分
    head.Next.Next = head              // 让下一个节点指向自己
    head.Next = nil                    // 断开原来的指向
    return newHead
}
```

```
  递归展开:
  reverseList(1→2→3)
    reverseList(2→3)
      reverseList(3) → 返回 3 (base case)
    回到 2: 3.Next = 2, 2.Next = nil  → 3→2
  回到 1: 2.Next = 1, 1.Next = nil    → 3→2→1
```

### 2.3 合并两个有序链表

**典型题：LeetCode 21 — 合并两个有序链表**

> 将两个升序链表合并为一个新的升序链表。

```
  l1: 1 → 3 → 5
  l2: 2 → 4 → 6

  dummy → ?
  比较 1 vs 2: 选 1  → dummy → 1
  比较 3 vs 2: 选 2  → dummy → 1 → 2
  比较 3 vs 4: 选 3  → dummy → 1 → 2 → 3
  比较 5 vs 4: 选 4  → dummy → 1 → 2 → 3 → 4
  比较 5 vs 6: 选 5  → dummy → 1 → 2 → 3 → 4 → 5
  l1 空了，接上 l2 剩余 → dummy → 1 → 2 → 3 → 4 → 5 → 6

  返回 dummy.Next
```

**模板**：

```go
func mergeTwoLists(l1, l2 *ListNode) *ListNode {
    dummy := &ListNode{}
    p := dummy
    for l1 != nil && l2 != nil {
        if l1.Val <= l2.Val {
            p.Next = l1; l1 = l1.Next
        } else {
            p.Next = l2; l2 = l2.Next
        }
        p = p.Next
    }
    if l1 != nil { p.Next = l1 }
    if l2 != nil { p.Next = l2 }
    return dummy.Next
}
```

### 2.4 找中点

```go
func findMiddle(head *ListNode) *ListNode {
    slow, fast := head, head
    for fast != nil && fast.Next != nil {
        slow = slow.Next
        fast = fast.Next.Next
    }
    return slow  // 奇数: 正中间; 偶数: 中间偏右
}
```

**偶数长度时 fast 变成 nil，怎么处理？**

这是**正常结束**，不是异常。关键在于你想返回：
- **右中点**（默认常用）：`for fast != nil && fast.Next != nil`
- **左中点**（链表归并切分常用）：`for fast.Next != nil && fast.Next.Next != nil`（先保证 `head != nil`）

例子 `1 -> 2 -> 3 -> 4`：

```text
右中点写法：
  初始 slow=1 fast=1
  一轮后 slow=2 fast=3
  二轮后 slow=3 fast=nil（正常）=> 返回 3（右中点）

左中点写法：
  初始 slow=1 fast=1
  检查 fast.Next.Next 存在，进一轮 slow=2 fast=3
  下一轮 fast.Next.Next 不存在，停止 => 返回 2（左中点）
```

若要偏左（用于链表归并排序的切分）：

```go
func findMiddleLeft(head *ListNode) *ListNode {
    slow, fast := head, head.Next   // fast 提前一步
    for fast != nil && fast.Next != nil {
        slow = slow.Next
        fast = fast.Next.Next
    }
    return slow  // 偶数时返回中间偏左
}
```

### 2.5 判环 & 找环入口

```go
func detectCycle(head *ListNode) *ListNode {
    slow, fast := head, head
    for fast != nil && fast.Next != nil {
        slow = slow.Next
        fast = fast.Next.Next
        if slow == fast {           // 有环，相遇了
            p := head
            for p != slow {         // 找入口
                p = p.Next
                slow = slow.Next
            }
            return p
        }
    }
    return nil  // 无环
}
```

---

## Day 3：栈、队列与堆的算法应用

**本日目标**：掌握栈做匹配和单调栈、BFS 模板、堆做 TopK。

### 3.1 括号匹配

**典型题：LeetCode 20 — 有效的括号**

> 判断字符串 s 中的括号是否有效（正确闭合）。

```
  s = "({[]})"

  遍历 '(': 左括号，入栈       栈: [(]
  遍历 '{': 左括号，入栈       栈: [(, {]
  遍历 '[': 左括号，入栈       栈: [(, {, []
  遍历 ']': 右括号，栈顶是 [ ✓ 弹出  栈: [(, {]
  遍历 '}': 右括号，栈顶是 { ✓ 弹出  栈: [(]
  遍历 ')': 右括号，栈顶是 ( ✓ 弹出  栈: []
  栈空 → 有效！
```

**模板**：

```go
func isValid(s string) bool {
    st := []byte{}
    pair := map[byte]byte{')':'(', ']':'[', '}':'{'}
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

### 3.2 单调栈模板

**问题**：对每个元素，求右边第一个比它大的元素。

```go
func nextGreaterElement(nums []int) []int {
    n := len(nums)
    res := make([]int, n)
    for i := range res { res[i] = -1 }  // 默认没有更大的
    
    var st []int  // 存下标，栈内对应的值单调递减
    
    for i := 0; i < n; i++ {
        // 当前元素比栈顶大 → 栈顶的「下一个更大」就是当前
        for len(st) > 0 && nums[i] > nums[st[len(st)-1]] {
            top := st[len(st)-1]
            st = st[:len(st)-1]
            res[top] = nums[i]
        }
        st = append(st, i)
    }
    return res
}
```

**举例**：

```
  nums = [2, 1, 2, 4, 3]
  
  i=0: 栈空, push 0             栈:[0]     (值:[2])
  i=1: 1<2, push 1              栈:[0,1]   (值:[2,1])
  i=2: 2>1, pop 1→res[1]=2      栈:[0]     (值:[2])
       2>=2, push 2             栈:[0,2]   (值:[2,2])
  i=3: 4>2, pop 2→res[2]=4      栈:[0]     (值:[2])
       4>2, pop 0→res[0]=4      栈:[]
       push 3                   栈:[3]     (值:[4])
  i=4: 3<4, push 4              栈:[3,4]   (值:[4,3])
  
  res = [4, 2, 4, -1, -1]
```

**变体**：
- **下一个更小**：改比较方向
- **前一个更大**：从右往左遍历
- **环形数组**：遍历两遍 `i % n`

### 3.3 BFS 模板

**典型题：图上最短距离（无权）**

> 从起点 0 出发，求到每个节点的最短步数。

```
  图:  0 — 1 — 3
       |       |
       2 ——————4

  BFS 从 0 出发:
  初始:   队列 [0]       dist = [0, -1, -1, -1, -1]
  出队 0: 邻居 1,2 入队  dist = [0, 1, 1, -1, -1]
  出队 1: 邻居 3 入队    dist = [0, 1, 1, 2, -1]
  出队 2: 邻居 4 入队    dist = [0, 1, 1, 2, 2]
  出队 3: 邻居 4 已访问  跳过
  出队 4: 无新邻居

  结果: dist = [0, 1, 1, 2, 2]
```

**模板**：

```go
func bfs(start int, g [][]int) []int {
    n := len(g)
    dist := make([]int, n)
    for i := range dist { dist[i] = -1 }
    dist[start] = 0
    
    q := []int{start}
    for len(q) > 0 {
        u := q[0]; q = q[1:]
        for _, v := range g[u] {
            if dist[v] == -1 {
                dist[v] = dist[u] + 1
                q = append(q, v)
            }
        }
    }
    return dist
}
```

**BFS 的本质**：从起点一层一层扩展，第一次到达某个节点时的步数就是最短步数（无权图）。

### 3.4 堆做 TopK

**第 K 大的元素**：维护大小为 K 的小顶堆。

```
  nums = [3, 1, 4, 1, 5, 9], K=3
  
  遍历 3: 堆 [3]           (size < K, 直接入)
  遍历 1: 堆 [1, 3]        (size < K)
  遍历 4: 堆 [1, 3, 4]     (size == K)
  遍历 1: 1 < 堆顶1 → 跳过
  遍历 5: 5 > 堆顶1 → 弹出1，入5 → 堆 [3, 4, 5]
  遍历 9: 9 > 堆顶3 → 弹出3，入9 → 堆 [4, 5, 9]
  
  堆顶 4 就是第 3 大的元素
```

**为什么用小顶堆？** 小顶堆的堆顶是堆中最小的。维护 K 个最大值，堆顶就是 K 个中最小的 = 第 K 大。

---

## Day 4：二叉树与递归

**本日目标**：掌握树递归的三种思维模式和 BST 常见操作。

### 4.1 三种递归思维

#### 模式一：自顶向下（传递信息给子树）

函数参数从根往叶子传信息，类似前序。

**典型题：LeetCode 257 — 二叉树的所有路径**

> 返回所有从根到叶子的路径。

```
       1
      / \
     2   3
      \
       5

  paths(1, []):
    path=[1], 不是叶子
    ├─ paths(2, [1]):
    │   path=[1,2], 不是叶子
    │   └─ paths(5, [1,2]):
    │       path=[1,2,5], 是叶子 → 收集 [1,2,5]
    └─ paths(3, [1]):
        path=[1,3], 是叶子 → 收集 [1,3]

  结果: [[1,2,5], [1,3]]
```

**模板**：

```go
func paths(root *TreeNode, path []int, res *[][]int) {
    if root == nil { return }
    path = append(path, root.Val)
    if root.Left == nil && root.Right == nil {
        *res = append(*res, append([]int(nil), path...))
        return
    }
    paths(root.Left, path, res)
    paths(root.Right, path, res)
}
```

#### 模式二：自底向上（利用子树结果）

函数返回值从叶子往根汇总，类似后序。

**典型题：LeetCode 543 — 二叉树的直径**

> 求任意两节点间最长路径的边数。

```
       1
      / \
     2   3
    / \
   4   5

  diameter(4)=0, diameter(5)=0
  diameter(2): l=1, r=1 → ans=max(ans,1+1)=2, return 1+max(1,1)=2
  diameter(3): l=0, r=0 → ans=max(2,0)=2, return 1
  diameter(1): l=2, r=1 → ans=max(2,2+1)=3, return 1+max(2,1)=3

  答案 ans=3（路径 4→2→1→3）
```

**模板**：

```go
func height(root *TreeNode) int {
    if root == nil { return 0 }
    return 1 + max(height(root.Left), height(root.Right))
}

// 求树的直径（任意两节点最长路径）
var ans int
func diameter(root *TreeNode) int {
    if root == nil { return 0 }
    l := diameter(root.Left)
    r := diameter(root.Right)
    ans = max(ans, l+r)    // 经过当前根的路径长度
    return 1 + max(l, r)   // 返回以当前根为端点的最长「臂」
}
```

#### 模式三：分治（把问题拆给左右子树）

**典型题：LeetCode 105 — 从前序与中序遍历构造二叉树**

> 给定 preorder 和 inorder，还原二叉树。

```
  preorder = [3, 9, 20, 15, 7]
  inorder  = [9, 3, 15, 20, 7]

  前序第一个 3 是根
  在中序中找到 3 → 左边 [9] 是左子树，右边 [15,20,7] 是右子树

  递归左: pre=[9], in=[9] → 叶子 9
  递归右: pre=[20,15,7], in=[15,20,7]
    根=20, 左=[15], 右=[7]

  结果:
       3
      / \
     9   20
        / \
       15   7
```

**模板**：

```go
func buildTree(preorder, inorder []int) *TreeNode {
    if len(preorder) == 0 { return nil }
    root := &TreeNode{Val: preorder[0]}
    idx := indexOf(inorder, preorder[0])
    root.Left = buildTree(preorder[1:1+idx], inorder[:idx])
    root.Right = buildTree(preorder[1+idx:], inorder[idx+1:])
    return root
}
```

### 4.2 BST 常见操作

#### 验证 BST

**典型题：LeetCode 98 — 验证二叉搜索树**

> 判断一棵二叉树是否是合法的 BST。

```
       5
      / \
     1   7
        / \
       4   8     ← 4 < 5，出现在右子树中，非法！

  check(5, -∞, +∞):
    check(1, -∞, 5): 1 在 (-∞,5) ✓
    check(7, 5, +∞):
      check(4, 5, 7): 4 ≤ 5 → false ✗
  返回 false
```

**模板**：

```go
func isValidBST(root *TreeNode) bool {
    return check(root, math.MinInt64, math.MaxInt64)
}

func check(n *TreeNode, lo, hi int64) bool {
    if n == nil { return true }
    v := int64(n.Val)
    if v <= lo || v >= hi { return false }
    return check(n.Left, lo, v) && check(n.Right, v, hi)
}
```

#### 中序遍历验证（另一种方式）

```go
func isValidBST(root *TreeNode) bool {
    var prev *int64
    var inorder func(*TreeNode) bool
    inorder = func(n *TreeNode) bool {
        if n == nil { return true }
        if !inorder(n.Left) { return false }
        v := int64(n.Val)
        if prev != nil && v <= *prev { return false }
        prev = &v
        return inorder(n.Right)
    }
    return inorder(root)
}
```

### 4.3 最近公共祖先 (LCA)

```go
func lowestCommonAncestor(root, p, q *TreeNode) *TreeNode {
    if root == nil || root == p || root == q {
        return root
    }
    l := lowestCommonAncestor(root.Left, p, q)
    r := lowestCommonAncestor(root.Right, p, q)
    if l != nil && r != nil { return root }  // p 和 q 分布在左右两侧
    if l != nil { return l }
    return r
}
```

```
  找 5 和 6 的 LCA:
       1          ← l=2(含5), r=3(含6) → 返回 1
      / \
     2   3
    / \   \
   4   5   6
```

---

## Day 5：DFS、回溯与 BFS

**本日目标**：掌握回溯模板、剪枝技巧、图上 DFS/BFS 的典型应用。

### 5.1 回溯的本质

回溯 = DFS + 撤销选择。它的核心是**枚举所有可能的选择路径**。

```
  回溯就是一棵决策树:
  
  选第1个位置: [1]  [2]  [3]
               ↓    ↓    ↓
  选第2个位置: [1,2] [1,3] [2,1] [2,3] [3,1] [3,2]
               ↓       ↓     ...
  选第3个位置: [1,2,3] [1,3,2]  ...
```

### 5.2 回溯模板

```go
var res [][]int

func backtrack(path []int, choices []int, /* 其他状态 */) {
    // 1. 结束条件
    if /* 满足条件 */ {
        res = append(res, append([]int(nil), path...))
        return
    }
    
    // 2. 遍历所有选择
    for i, c := range choices {
        // 3. 剪枝（可选）
        if /* 不合法 */ { continue }
        
        // 4. 做选择
        path = append(path, c)
        
        // 5. 递归
        backtrack(path, /* 更新后的选择 */)
        
        // 6. 撤销选择
        path = path[:len(path)-1]
    }
}
```

### 5.3 三大经典：排列、组合、子集

#### 全排列（每个元素用一次，顺序不同算不同）

```go
func permute(nums []int) [][]int {
    var res [][]int
    var path []int
    used := make([]bool, len(nums))
    
    var dfs func()
    dfs = func() {
        if len(path) == len(nums) {
            res = append(res, append([]int(nil), path...))
            return
        }
        for i := 0; i < len(nums); i++ {
            if used[i] { continue }
            used[i] = true
            path = append(path, nums[i])
            dfs()
            path = path[:len(path)-1]
            used[i] = false
        }
    }
    dfs()
    return res
}
```

#### 组合（选 k 个，顺序无关）

**典型题：LeetCode 77 — 组合**

> 从 1..n 中选 k 个数，返回所有组合。

```
  n=4, k=2

  dfs(start=1):
    选 1 → dfs(start=2):
      选 2 → [1,2] ✓  |  选 3 → [1,3] ✓  |  选 4 → [1,4] ✓
    选 2 → dfs(start=3):
      选 3 → [2,3] ✓  |  选 4 → [2,4] ✓
    选 3 → dfs(start=4):
      选 4 → [3,4] ✓

  结果: [1,2] [1,3] [1,4] [2,3] [2,4] [3,4]
  关键: 从 start 开始往后选，避免重复（[2,1] 不会出现）
```

**模板**：

```go
func combine(n, k int) [][]int {
    var res [][]int
    var path []int
    
    var dfs func(int)
    dfs = func(start int) {
        if len(path) == k {
            res = append(res, append([]int(nil), path...))
            return
        }
        for i := start; i <= n; i++ {
            path = append(path, i)
            dfs(i + 1)    // 下一层从 i+1 开始，避免重复
            path = path[:len(path)-1]
        }
    }
    dfs(1)
    return res
}
```

#### 子集（枚举所有子集）

**典型题：LeetCode 78 — 子集**

> 返回数组的所有子集（幂集）。

```
  nums = [1, 2, 3]

  dfs(start=0, path=[]):
    收集 []
    选 1 → dfs(1, [1]):
      收集 [1]
      选 2 → dfs(2, [1,2]):
        收集 [1,2]
        选 3 → 收集 [1,2,3]
      选 3 → 收集 [1,3]
    选 2 → dfs(2, [2]):
      收集 [2]
      选 3 → 收集 [2,3]
    选 3 → 收集 [3]

  结果: [] [1] [1,2] [1,2,3] [1,3] [2] [2,3] [3]
  关键: 每个递归节点都收集一次（不像组合只在叶子收集）
```

**模板**：

```go
func subsets(nums []int) [][]int {
    var res [][]int
    var path []int
    
    var dfs func(int)
    dfs = func(start int) {
        res = append(res, append([]int(nil), path...))  // 每个节点都是一个子集
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

### 5.4 剪枝

剪枝 = 提前排除不可能的分支，减少递归次数。

**典型题：LeetCode 39 — 组合总和**

> 从 candidates 中选数（可重复），使和为 target。

```
  candidates = [2, 3, 5], target = 7（已排序）

  dfs(start=0, remain=7):
    选 2 → remain=5:
      选 2 → remain=3:
        选 2 → remain=1: 2>1 剪枝 ✂
        选 3 → remain=0 → 收集 [2,2,3] ✓
      选 3 → remain=2:
        选 3 → 3>2 剪枝 ✂
      选 5 → remain=0 → 收集 [2,5] ✓
    选 3 → remain=4:
      选 3 → remain=1: 3>1 剪枝 ✂
    选 5 → remain=2: 5>2 剪枝 ✂

  结果: [2,2,3] [2,5]
  排序 + "candidates[i]>remain → break" 避免了大量无效分支
```

**模板**：

```go
func combinationSum(candidates []int, target int) [][]int {
    sort.Ints(candidates)  // 排序以便剪枝
    var res [][]int
    var path []int
    
    var dfs func(int, int)
    dfs = func(start, remain int) {
        if remain == 0 {
            res = append(res, append([]int(nil), path...))
            return
        }
        for i := start; i < len(candidates); i++ {
            if candidates[i] > remain { break }  // 剪枝：后面更大，不用继续
            path = append(path, candidates[i])
            dfs(i, remain-candidates[i])  // 可重复选，所以还是从 i 开始
            path = path[:len(path)-1]
        }
    }
    dfs(0, target)
    return res
}
```

### 5.5 网格 DFS

**典型题：LeetCode 200 — 岛屿数量**

> 二维网格中 '1' 是陆地，'0' 是水，求岛屿数量。

```
  grid:
  1 1 0 0
  1 0 0 0
  0 0 1 0
  0 0 0 1

  扫描 (0,0)='1' → DFS 感染整片:
    (0,0)→'0', (0,1)→'0', (1,0)→'0'
    岛屿 +1 → count=1

  继续扫描, (2,2)='1' → DFS:
    (2,2)→'0'
    岛屿 +1 → count=2

  继续扫描, (3,3)='1' → DFS:
    (3,3)→'0'
    岛屿 +1 → count=3

  答案: 3
```

**模板**：

```go
var dirs = [4][2]int{{1,0},{-1,0},{0,1},{0,-1}}

func dfs(grid [][]byte, i, j int) {
    if i < 0 || i >= len(grid) || j < 0 || j >= len(grid[0]) {
        return
    }
    if grid[i][j] != '1' { return }
    grid[i][j] = '0'  // 标记已访问（"沉岛"）
    for _, d := range dirs {
        dfs(grid, i+d[0], j+d[1])
    }
}
```

---

## Day 6：动态规划

**本日目标**：掌握 DP 的思考方法论、三大类型（线性/双序列/背包）。

### 6.1 DP 是什么

动态规划 = **用空间换时间**，把已经算过的子问题结果存起来（记忆化），避免重复计算。

**适用条件**：
1. **最优子结构**：大问题的最优解包含子问题的最优解
2. **重叠子问题**：子问题被多次重复计算

### 6.2 DP 五步法

1. **定义状态**：`dp[i]` 或 `dp[i][j]` 表示什么？（这一步最关键）
2. **找转移方程**：`dp[i]` 如何由更小的子问题推出？
3. **确定初始值**：`dp[0]`、`dp[0][0]` 等
4. **确定遍历顺序**：确保算 `dp[i]` 时，依赖的子问题已经算过
5. **确定答案**：是 `dp[n]`？还是 `max(dp[i])`？

### 6.3 一维线性 DP

#### 爬楼梯

```
  dp[i] = 到第 i 阶的方法数
  dp[i] = dp[i-1] + dp[i-2]   (从 i-1 走一步 或 从 i-2 走两步)
  dp[1]=1, dp[2]=2
```

```go
func climbStairs(n int) int {
    if n <= 2 { return n }
    a, b := 1, 2      // 滚动变量代替数组
    for i := 3; i <= n; i++ {
        a, b = b, a+b
    }
    return b
}
```

#### 打家劫舍

```
  不能偷相邻的房子。
  dp[i] = 偷到第 i 家时的最大金额
  dp[i] = max(dp[i-1],            // 不偷第 i 家
              dp[i-2] + nums[i])  // 偷第 i 家
```

```go
func rob(nums []int) int {
    if len(nums) == 1 { return nums[0] }
    a, b := nums[0], max(nums[0], nums[1])
    for i := 2; i < len(nums); i++ {
        a, b = b, max(b, a+nums[i])
    }
    return b
}
```

### 6.4 双序列 DP

#### 最长公共子序列 (LCS)

```
  text1 = "abcde", text2 = "ace"
  
  dp[i][j] = text1 前 i 个字符和 text2 前 j 个字符的 LCS 长度
  
  if text1[i-1] == text2[j-1]:
      dp[i][j] = dp[i-1][j-1] + 1    (这个字符是公共的)
  else:
      dp[i][j] = max(dp[i-1][j], dp[i][j-1])  (跳过其中一个)
```

```
  DP 表:
       ""  a  c  e
  ""  [ 0  0  0  0 ]
  a   [ 0  1  1  1 ]
  b   [ 0  1  1  1 ]
  c   [ 0  1  2  2 ]
  d   [ 0  1  2  2 ]
  e   [ 0  1  2  3 ]   ← 答案 3
```

```go
func longestCommonSubsequence(text1, text2 string) int {
    m, n := len(text1), len(text2)
    dp := make([][]int, m+1)
    for i := range dp { dp[i] = make([]int, n+1) }
    
    for i := 1; i <= m; i++ {
        for j := 1; j <= n; j++ {
            if text1[i-1] == text2[j-1] {
                dp[i][j] = dp[i-1][j-1] + 1
            } else {
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
            }
        }
    }
    return dp[m][n]
}
```

### 6.5 背包问题

#### 01 背包（每件物品只能选一次）

```
  物品: 重量 [2, 3, 4], 价值 [3, 4, 5], 背包容量 W=7
  
  dp[j] = 容量为 j 时的最大价值
  
  遍历每件物品 i:
    for j := W; j >= w[i]; j--:    // 逆序！保证每件只选一次
        dp[j] = max(dp[j], dp[j-w[i]] + v[i])
```

为什么逆序？因为正序的话 `dp[j-w[i]]` 可能已经被本轮更新过（相当于选了两次）。

#### 完全背包（每件物品可选多次）

```
  和 01 背包的唯一区别：正序遍历容量
  
    for j := w[i]; j <= W; j++:    // 正序！允许重复选
        dp[j] = max(dp[j], dp[j-w[i]] + v[i])
```

#### 零钱兑换（完全背包变体）

**典型题：LeetCode 322 — 零钱兑换**

> 用最少的硬币凑出 amount，硬币可重复选。

```
  coins = [1, 2, 5], amount = 11

  dp[j] = 凑出金额 j 的最少硬币数
  初始: dp[0]=0, 其余=∞

  遍历 coin=1: dp[1]=1  dp[2]=2  dp[3]=3  ... dp[11]=11
  遍历 coin=2: dp[2]=1  dp[3]=2  dp[4]=2  dp[5]=3  ...
  遍历 coin=5: dp[5]=1  dp[6]=2  dp[7]=2  dp[10]=2 dp[11]=3

  dp = [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3]
  答案: dp[11] = 3  (5+5+1)
```

**模板**：

```go
func coinChange(coins []int, amount int) int {
    dp := make([]int, amount+1)
    for i := range dp { dp[i] = amount + 1 }  // 初始化为「不可达」
    dp[0] = 0
    
    for _, coin := range coins {
        for j := coin; j <= amount; j++ {  // 正序 = 完全背包
            if dp[j-coin]+1 < dp[j] {
                dp[j] = dp[j-coin] + 1
            }
        }
    }
    if dp[amount] > amount { return -1 }
    return dp[amount]
}
```

### 6.6 空间优化

- 一维 DP 只依赖前 1～2 项：用滚动变量
- 二维 DP 只依赖上一行：压缩为一维数组
- 背包问题：天然可用一维 dp + 遍历方向控制

---

## Day 7：图进阶与并查集

**本日目标**：掌握拓扑排序的两种实现和并查集在图问题中的应用。

### 7.1 拓扑排序（Kahn 算法 / BFS）

适用于**有向无环图 (DAG)**，找出一种合法的节点排列顺序，使得所有边的方向一致。

```
  课程依赖: 0→1, 0→2, 1→3, 2→3
  
  入度: 0:0  1:1  2:1  3:2
  
  Kahn 过程:
  初始入度0入队: [0]
  出队 0, 删边 → 1入度变0, 2入度变0 → 入队 [1, 2]
  出队 1, 删边 → 3入度变1
  出队 2, 删边 → 3入度变0 → 入队 [3]
  出队 3
  
  拓扑序: [0, 1, 2, 3]（或 [0, 2, 1, 3]，不唯一）
```

```go
func topologicalSort(n int, edges [][]int) []int {
    g := make([][]int, n)
    indeg := make([]int, n)
    for _, e := range edges {
        u, v := e[0], e[1]
        g[u] = append(g[u], v)
        indeg[v]++
    }
    
    var q []int
    for i := 0; i < n; i++ {
        if indeg[i] == 0 { q = append(q, i) }
    }
    
    var order []int
    for len(q) > 0 {
        u := q[0]; q = q[1:]
        order = append(order, u)
        for _, v := range g[u] {
            indeg[v]--
            if indeg[v] == 0 { q = append(q, v) }
        }
    }
    
    if len(order) != n { return nil }  // 有环
    return order
}
```

**判断有环**：如果出队总数 < n，说明有节点入度永远不为 0 → 存在环。

### 7.2 拓扑排序（DFS 后序反转）

```go
func topologicalSortDFS(n int, g [][]int) []int {
    visited := make([]int, n)  // 0:未访问 1:访问中 2:已完成
    var order []int
    hasCycle := false
    
    var dfs func(int)
    dfs = func(u int) {
        if hasCycle { return }
        visited[u] = 1
        for _, v := range g[u] {
            if visited[v] == 1 { hasCycle = true; return }
            if visited[v] == 0 { dfs(v) }
        }
        visited[u] = 2
        order = append(order, u)
    }
    
    for i := 0; i < n; i++ {
        if visited[i] == 0 { dfs(i) }
    }
    
    if hasCycle { return nil }
    // 后序的逆序就是拓扑序
    for i, j := 0, len(order)-1; i < j; i, j = i+1, j-1 {
        order[i], order[j] = order[j], order[i]
    }
    return order
}
```

**三色标记判环**：
- 白色(0)：未访问
- 灰色(1)：正在访问（在当前 DFS 路径上）
- 黑色(2)：已完成

如果从灰色节点走到另一个灰色节点 → 有环（回到了自己的祖先）。

### 7.3 并查集解图问题

#### 连通分量数

**典型题：LeetCode 323 — 无向图中连通分量的数目**

> 给定 n 个节点和边列表，求连通分量数。

```
  n=5, edges=[[0,1],[1,2],[3,4]]

  初始: 每个点自成一组, count=5
  Union(0,1): 0-1 合并, count=4
  Union(1,2): 1-2 合并(Find(1)=0, Find(2)=2), count=3
  Union(3,4): 3-4 合并, count=2

  分组: {0,1,2} 和 {3,4}
  答案: count=2
```

**模板**：

```go
func countComponents(n int, edges [][]int) int {
    uf := NewUnionFind(n)
    for _, e := range edges {
        uf.Union(e[0], e[1])
    }
    return uf.count
}
```

#### 判断图是否为树

**典型题：LeetCode 261 — 以图判树**

> 给定 n 个节点和边列表，判断是否能构成一棵树（连通 + 无环）。

```
  n=5, edges=[[0,1],[0,2],[0,3],[1,4]]

  检查: 边数=4 == n-1=4 ✓（边数不对直接 false）
  Union(0,1): count=4
  Union(0,2): count=3
  Union(0,3): count=2
  Union(1,4): count=1
  count==1 → true，是树 ✓

  反例: edges=[[0,1],[1,2],[2,0]] → 边数=3, n-1=2, 3≠2 → false
```

**模板**：

```go
func validTree(n int, edges [][]int) bool {
    if len(edges) != n-1 { return false }
    uf := NewUnionFind(n)
    for _, e := range edges {
        if uf.Connected(e[0], e[1]) { return false }
        uf.Union(e[0], e[1])
    }
    return uf.count == 1
}
```
