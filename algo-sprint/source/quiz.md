# 每日自测题 — 按日限时练习

> **使用方式**：
> 1. 按 UMPIRE 流程做：理解 → 匹配模式 → 规划 → 写代码 → 检查 → 评估复杂度
> 2. 每道题限时（建议时间标注在表中）
> 3. 做完后**必须过「做完检查清单」**（见下方），再进入下一题
> 4. 不会做的题：先看「关键词提示」尝试 5 分钟，还不行就回 combo.md / practice.md 找同类型
> 5. 把卡住的题记到 **review.md**，明天热身时重做

---

## 做完检查清单（每道题都过一遍）

- [ ] 空输入 / nil 是否处理了？
- [ ] 单元素 / 单节点是否正确？
- [ ] 全同值 / 全相同输入是否正确？
- [ ] 最大最小值是否溢出？
- [ ] 复杂度是否符合预期（看 n 的范围推算）？
- [ ] 代码能否再简化（变量名、冗余判断）？

---

## Day 1

**主题**：数组、双指针、滑动窗口
  
> 实时增量题池：请在本日步骤栏打开「实时题池」。

| # | 题号 | 题目名称 | 难度 | 限时 | 关键词提示 |
|---|------|----------|------|------|------------|
| 1 | 1 | [两数之和](https://leetcode.com/problems/two-sum/) | Easy | 15min | 无序 → 哈希表存「值→下标」 |
| 2 | 26 | [删除有序数组中的重复项](https://leetcode.com/problems/remove-duplicates-from-sorted-array/) | Easy | 15min | 有序 + 原地 → 同向双指针 |
| 3 | 209 | [长度最小的子数组](https://leetcode.com/problems/minimum-size-subarray-sum/) | Med | 20min | 连续子数组 + 最小长度 → 可变滑窗 |
| 4 | 76 | [最小覆盖子串](https://leetcode.com/problems/minimum-window-substring/) | Hard | 30min | 子串 + 覆盖 → 滑窗 + map 计数 |

**Day 1 完成标准**：1～3 全部独立完成，第 4 题至少写出框架。

---

## Day 2

**主题**：链表

> 实时增量题池：请在本日步骤栏打开「实时题池」。

| # | 题号 | 题目名称 | 难度 | 限时 | 关键词提示 |
|---|------|----------|------|------|------------|
| 1 | 141 | [环形链表](https://leetcode.com/problems/linked-list-cycle/) | Easy | 15min | 判环 → 快慢指针 |
| 2 | 19 | [删除链表的倒数第 N 个结点](https://leetcode.com/problems/remove-nth-node-from-end-of-list/) | Med | 20min | 倒数 → 快指针先走 N 步 |
| 3 | 2 | [两数相加](https://leetcode.com/problems/add-two-numbers/) | Med | 20min | 链表数字 → dummy + 进位 |
| 4 | 148 | [排序链表](https://leetcode.com/problems/sort-list/) | Med | 30min | 链表排序 → 归并：找中点 + 合并 |

**Day 2 完成标准**：1～3 全部独立完成，第 4 题能写出归并思路。

---

## Day 3

**主题**：栈、队列、堆

> 实时增量题池：请在本日步骤栏打开「实时题池」。

| # | 题号 | 题目名称 | 难度 | 限时 | 关键词提示 |
|---|------|----------|------|------|------------|
| 1 | 155 | [最小栈](https://leetcode.com/problems/min-stack/) | Med | 15min | 辅助栈存当前最小 |
| 2 | 232 | [用栈实现队列](https://leetcode.com/problems/implement-queue-using-stacks/) | Easy | 15min | 两个栈倒腾 |
| 3 | 215 | [数组中的第 K 个最大元素](https://leetcode.com/problems/kth-largest-element-in-an-array/) | Med | 20min | TopK → 小顶堆大小 K |
| 4 | 239 | [滑动窗口最大值](https://leetcode.com/problems/sliding-window-maximum/) | Hard | 30min | 窗口最值 → 单调递减双端队列 |

**Day 3 完成标准**：1～3 全部独立完成。第 4 题能说清单调队列思路。

---

## Day 4

**主题**：二叉树

> 实时增量题池：请在本日步骤栏打开「实时题池」。

| # | 题号 | 题目名称 | 难度 | 限时 | 关键词提示 |
|---|------|----------|------|------|------------|
| 1 | 94 | [二叉树的中序遍历](https://leetcode.com/problems/binary-tree-inorder-traversal/) | Easy | 15min | 左→根→右，递归或栈 |
| 2 | 226 | [翻转二叉树](https://leetcode.com/problems/invert-binary-tree/) | Easy | 15min | 前序/后序，交换左右 |
| 3 | 101 | [对称二叉树](https://leetcode.com/problems/symmetric-tree/) | Easy | 15min | 递归比较镜像子树 |
| 4 | 236 | [最近公共祖先](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/) | Med | 25min | 后序：左右各含 p/q 则当前是答案 |

**Day 4 完成标准**：1～3 独立完成，第 4 题能写出递归框架。

---

## Day 5

**主题**：DFS、回溯、BFS

> 实时增量题池：请在本日步骤栏打开「实时题池」。

| # | 题号 | 题目名称 | 难度 | 限时 | 关键词提示 |
|---|------|----------|------|------|------------|
| 1 | 46 | [全排列](https://leetcode.com/problems/permutations/) | Med | 20min | 排列 → 回溯 + visited |
| 2 | 39 | [组合总和](https://leetcode.com/problems/combination-sum/) | Med | 20min | 组合 → 回溯 + start + 可重复 |
| 3 | 79 | [单词搜索](https://leetcode.com/problems/word-search/) | Med | 25min | 网格 → DFS 四方向 + 回溯 |
| 4 | 127 | [单词接龙](https://leetcode.com/problems/word-ladder/) | Hard | 30min | 最短转换 → BFS + 逐位枚举 |

**Day 5 完成标准**：1～3 独立完成，第 4 题至少写出 BFS 框架。

---

## Day 6

**主题**：动态规划

> 实时增量题池：请在本日步骤栏打开「实时题池」。

| # | 题号 | 题目名称 | 难度 | 限时 | 关键词提示 |
|---|------|----------|------|------|------------|
| 1 | 198 | [打家劫舍](https://leetcode.com/problems/house-robber/) | Med | 15min | 选/不选 → 一维 DP |
| 2 | 322 | [零钱兑换](https://leetcode.com/problems/coin-change/) | Med | 20min | 最少硬币 → 完全背包 |
| 3 | 1143 | [最长公共子序列](https://leetcode.com/problems/longest-common-subsequence/) | Med | 25min | 双序列 → 二维 DP |
| 4 | 416 | [分割等和子集](https://leetcode.com/problems/partition-equal-subset-sum/) | Med | 25min | 是否能凑出 sum/2 → 01 背包 |

**Day 6 完成标准**：1～3 独立完成。第 4 题能定义出 DP 状态和转移。

---

## Day 7

**主题**：图、并查集、综合

> 实时增量题池：请在本日步骤栏打开「实时题池」。

| # | 题号 | 题目名称 | 难度 | 限时 | 关键词提示 |
|---|------|----------|------|------|------------|
| 1 | 200 | [岛屿数量](https://leetcode.com/problems/number-of-islands/) | Med | 20min | 连通块 → DFS/BFS/并查集 |
| 2 | 210 | [课程表 II](https://leetcode.com/problems/course-schedule-ii/) | Med | 20min | 依赖 → 拓扑排序输出序 |
| 3 | 128 | [最长连续序列](https://leetcode.com/problems/longest-consecutive-sequence/) | Med | 20min | 连续 → 哈希表 + 只从起点枚举 |
| 4 | 42 | [接雨水](https://leetcode.com/problems/trapping-rain-water/) | Hard | 30min | 每列水量 → 双指针/单调栈 |

**Day 7 完成标准**：1～3 独立完成。第 4 题能用至少一种方法写出。

---

## 七天完成后

1. 打开 **review.md**，回顾所有「卡住了」的记录。
2. 把卡住最多的 2～3 个类型，再各补 2 道同类型题加强。
3. 按 [thinking.md](thinking.md) 的「模式识别表」检查：每个模式是否都有至少一道能独立写出？
4. 模拟一次限时笔试：从每天 quiz 中各取 1 题（共 7 题），限时 2 小时完成。
