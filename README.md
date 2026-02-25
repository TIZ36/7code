<div align="center">

# `7` 日算法速通

**面向有经验开发者的 7 天结构化算法冲刺训练**

[![Go](https://img.shields.io/badge/Go-1.21+-00ADD8?logo=go&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](#)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](#)
[![License](https://img.shields.io/badge/License-MIT-green)](#)

<br />

*不是从零开始学算法，而是帮你在 7 天内把散落的知识串成体系，补齐短板，直面面试。*

</div>

---

## Why

刷了 200+ 题，但面试时还是——

- 拿到题不知道该用什么模式？
- 会做但写不完、边界总出错？
- 复习没体系，看了就忘？

这个项目用 **UMPIRE 解题框架 + 间隔复习 + 难度递进** 的方式，把 7 天的学习路径固化成一个可以"无脑跟着走"的交互式 Web 应用。

---

## Preview

```
┌─────────────────────────────────────────────────────────┐
│  算法 7 日速通                                            │
│                                                         │
│  Day 0  解题思维框架     ┃  思维框架  速查总览              │
│  Day 1  数组·双指针·滑窗  ┃                                │
│  Day 2  链表             ┃  ┌─ UMPIRE 解题六步法 ───────┐ │
│  Day 3  栈·队列·堆       ┃  │ U — Understand           │ │
│● Day 4  二叉树·BST       ┃  │ M — Match                │ │
│  Day 5  DFS·回溯·BFS     ┃  │ P — Plan                 │ │
│  Day 6  动态规划          ┃  │ I — Implement            │ │
│  Day 7  图·并查集·综合    ┃  │ R — Review               │ │
│                          ┃  │ E — Evaluate             │ │
│  ████████░░ 10/50 步     ┃  └──────────────────────────┘ │
│                          ┃                                │
│                          ┃     ◁ 上一步    Day 0  ▷ 下一步 │
└─────────────────────────────────────────────────────────┘
```

---

## Features

| | 特性 | 说明 |
|:---:|---|---|
| **1** | **结构化 7 日路线** | 每天覆盖：数据结构 → 算法思想 → 组合技巧 → 例题 → 自测 → 复盘 |
| **2** | **UMPIRE 解题框架** | 系统化的六步解题流程，告别"拿到题就写代码" |
| **3** | **难度递进** | Day 1-2 Easy → Day 3-4 Medium → Day 5-6 Medium → Day 7 Hard |
| **4** | **间隔复习** | 每天热身回顾前一天错题，对抗遗忘曲线 |
| **5** | **渐进提示** | 例题提供三级提示（思路 → 关键步骤 → 完整解答），先想再看 |
| **6** | **进度持久化** | localStorage 自动保存，关掉浏览器不丢进度 |
| **7** | **Markdown 驱动** | 修改 `source/*.md` 即刻热更新，内容完全可定制 |

---

## 7 日速览

```
Day 0  ➜  解题思维框架（UMPIRE 六步法 · 模式识别决策树 · 边界清单）
Day 1  ➜  数组/切片 · 哈希表   ×   双指针 · 滑动窗口 · 二分查找
Day 2  ➜  链表 · 哨兵节点      ×   反转 · 合并 · 快慢指针 · Floyd
Day 3  ➜  栈 · 队列 · 堆       ×   单调栈 · BFS · TopK
Day 4  ➜  二叉树 · BST         ×   递归遍历 · 层序 · LCA
Day 5  ➜  图 · 邻接表          ×   回溯 · 剪枝 · 网格搜索
Day 6  ➜  DP 数组              ×   线性 DP · 背包 · 双序列
Day 7  ➜  并查集               ×   拓扑排序 · 连通分量 · 综合
```

---

## Quick Start

```bash
# 克隆
git clone <repo-url> && cd code/algo-sprint

# 一键启动（自动安装依赖 + 启动开发服务器）
./start.sh
```

或者手动：

```bash
npm install
npm run dev
# → http://localhost:5173
```

---

## Project Structure

```
code/
├── algo-sprint/
│   ├── source/               # 学习内容（Markdown 驱动，修改即热更新）
│   │   ├── thinking.md       #   Day 0 — 解题思维框架
│   │   ├── datastructure.md  #   数据结构知识点 + Go 实现
│   │   ├── algorithm.md      #   算法思想与模板
│   │   ├── combo.md          #   DS + 算法组合技巧
│   │   ├── practice.md       #   例题（渐进提示）
│   │   ├── quiz.md           #   每日自测
│   │   ├── review.md         #   复盘模板
│   │   └── index.md          #   总路线图
│   ├── src/
│   │   ├── App.jsx           #   应用主组件
│   │   ├── index.css         #   样式
│   │   └── main.jsx          #   入口
│   ├── start.sh              # 一键启动脚本
│   ├── vite.config.js
│   └── package.json
├── main.go                   # Go 算法练习
├── go.mod
└── .gitignore
```

---

## Daily Flow

每天按 **四个阶段** 线性推进，前端会自动引导：

```
 ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
 │  热身     │ ➜  │  学习     │ ➜  │  实战     │ ➜  │  复盘     │
 │  15 min   │    │  40-60min │    │ 90-120min │    │  10 min   │
 │           │    │           │    │           │    │           │
 │ 重做昨天  │    │ 数据结构  │    │ 例题练习  │    │ 记录反思  │
 │ 错题一道  │    │ 算法思想  │    │ 限时自测  │    │ 标记弱项  │
 │           │    │ 组合技巧  │    │           │    │           │
 └──────────┘    └──────────┘    └──────────┘    └──────────┘
```

---

## Customize

所有学习内容都在 `source/` 目录下的 Markdown 文件中，使用 `## Day X` 作为分节标记。

修改任意 `.md` 文件后，Vite HMR 会即时更新前端页面——无需重启。

```markdown
## Day 3

### 你的自定义内容

随意添加、修改、删减...
```

---

## Target Audience

- 有 LeetCode 200+ 刷题经验的开发者
- 准备 Golang 后端/支付服务器/AI 方向面试
- 想在 7 天内系统化复习而非漫无目的地刷题

---

## Tech Stack

| 层 | 技术 |
|---|---|
| 前端 | React 19 + Vite 6 |
| 渲染 | react-markdown + remark-gfm + rehype-raw |
| 内容 | Markdown（Vite `?raw` import，HMR 热更新） |
| 持久化 | localStorage |
| 算法语言 | Go |

---

<div align="center">

**Star it if it helps. Fork it to make it yours.**

</div>
