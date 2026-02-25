#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"

RAW_JSON="source/leetcode_live.json"
OUT_MD="source/live_pool.md"
OFFICIAL_URL="https://leetcode.com/api/problems/algorithms/"
PROFILE="${1:-${PROFILE:-backend}}"

echo "同步 LeetCode 实时题库..."
echo "题池加权画像: $PROFILE"
curl -sL "$OFFICIAL_URL" -o "$RAW_JSON"

PROFILE="$PROFILE" python3 - <<'PY'
import json
import os
from datetime import datetime, timezone, timedelta

RAW_JSON = "source/leetcode_live.json"
OUT_MD = "source/live_pool.md"
OFFICIAL_URL = "https://leetcode.com/api/problems/algorithms/"
PROFILE = os.getenv("PROFILE", "backend").lower()

with open(RAW_JSON, "r", encoding="utf-8") as f:
    data = json.load(f)

pairs = data.get("stat_status_pairs", [])
problems = []
for x in pairs:
    if x.get("paid_only"):
        continue
    s = x.get("stat", {})
    slug = s.get("question__title_slug")
    fid = s.get("frontend_question_id")
    if not slug or not fid:
        continue
    lvl = x.get("difficulty", {}).get("level")
    diff = {1: "Easy", 2: "Medium", 3: "Hard"}.get(lvl, "Unknown")
    problems.append({
        "id": str(s.get("question_id", 0)),
        "frontend_id": str(fid),
        "title": s.get("question__title", ""),
        "title_slug": slug,
        "difficulty": diff,
        "url": f"https://leetcode.com/problems/{slug}/",
    })

problems.sort(key=lambda x: int(x.get("id", 0)), reverse=True)

def day_for_title(title: str) -> int:
    t = title.lower()
    if any(k in t for k in ["linked list", "list node", "listnode"]):
        return 2
    if any(k in t for k in ["stack", "queue", "heap", "priority", "deque", "kth"]):
        return 3
    if any(k in t for k in ["tree", "bst", "binary tree", "lca"]):
        return 4
    if any(k in t for k in ["dfs", "bfs", "grid", "island", "permutation", "combination", "subset", "word search", "backtracking"]):
        return 5
    if any(k in t for k in ["dp", "dynamic", "subsequence", "knapsack", "coin change", "robber", "edit distance", "lcs"]):
        return 6
    if any(k in t for k in ["graph", "course", "network", "union find", "topological", "edge", "node"]):
        return 7
    return 1

def profile_score(title: str, day: int, profile: str) -> int:
    t = title.lower()
    score = 0
    if profile == "backend":
        if any(k in t for k in ["array", "subarray", "string", "window", "hash", "map", "prefix"]):
            score += 5
        if any(k in t for k in ["graph", "network", "course", "topological", "union", "edge", "node"]):
            score += 4
        if any(k in t for k in ["heap", "kth", "priority", "queue"]):
            score += 3
        if day in (1, 3, 7):
            score += 2
    elif profile == "ai":
        if any(k in t for k in ["dp", "subsequence", "sequence", "distance", "edit", "lcs"]):
            score += 5
        if any(k in t for k in ["tree", "graph", "path", "search", "bfs", "dfs"]):
            score += 4
        if any(k in t for k in ["probability", "matrix", "xor", "bit"]):
            score += 3
        if day in (4, 5, 6, 7):
            score += 2
    else:
        score += 1
    return score

def focus_for_title(title: str) -> str:
    t = title.lower()
    tags = []
    if any(k in t for k in ["array", "subarray", "prefix", "sum", "window", "substring", "string"]):
        tags.append("数组/字符串")
    if any(k in t for k in ["two", "pair", "difference", "kth", "xor"]):
        tags.append("双指针/位运算")
    if any(k in t for k in ["linked list", "list node", "listnode"]):
        tags.append("链表")
    if any(k in t for k in ["stack", "queue", "heap", "priority", "deque"]):
        tags.append("栈/队列/堆")
    if any(k in t for k in ["tree", "bst", "binary tree", "lca"]):
        tags.append("树")
    if any(k in t for k in ["dfs", "bfs", "grid", "island", "permutation", "combination", "subset", "backtracking"]):
        tags.append("DFS/BFS/回溯")
    if any(k in t for k in ["dp", "dynamic", "subsequence", "knapsack", "coin change", "robber", "edit distance", "lcs"]):
        tags.append("动态规划")
    if any(k in t for k in ["graph", "course", "network", "union find", "topological", "edge", "node"]):
        tags.append("图/并查集")
    if not tags:
        tags.append("综合")
    return " + ".join(tags[:2])

day_pool = {i: [] for i in range(1, 8)}
pool = problems[:900]
used = set()

for d in range(1, 8):
    candidates = []
    for p in pool:
        pid = p["id"]
        if pid in used:
            continue
        base = 8 if day_for_title(p["title"]) == d else 0
        score = base + profile_score(p["title"], d, PROFILE)
        candidates.append((score, int(pid), p))
    candidates.sort(key=lambda x: (x[0], x[1]), reverse=True)
    for _, _, p in candidates[:8]:
        day_pool[d].append(p)
        used.add(p["id"])

cn_tz = timezone(timedelta(hours=8))
now = datetime.now(cn_tz).strftime("%Y-%m-%d %H:%M:%S %Z")

lines = []
lines.append("# 实时题池（自动生成）")
lines.append("")
lines.append("> 本文件由 `sync_leetcode.sh` 自动更新。")
lines.append("> 建议用法：每天主线题之外，再加 1~2 道实时题，避免只会旧题模板。")
lines.append("")
lines.append(f"- 同步时间：`{now}`")
lines.append(f"- 题库来源：`{OFFICIAL_URL}`（已存本地：`{RAW_JSON}`）")
lines.append(f"- 岗位画像：`{PROFILE}`（可选：backend / ai）")
lines.append(f"- 免费题总数：`{len(problems)}`")
lines.append("")
lines.append("---")
lines.append("")
lines.append("## 最新 Free Top 20（按题库 id 倒序）")
lines.append("")
lines.append("| # | 题号 | 题目 | 难度 | 考察内容 | 链接 |")
lines.append("|---|------|------|------|----------|------|")
for i, p in enumerate(problems[:20], 1):
    lines.append(
        f"| {i} | {p['frontend_id']} | {p['title']} | {p['difficulty']} | {focus_for_title(p['title'])} | [Link]({p['url']}) |"
    )
lines.append("")

for d in range(1, 8):
    lines.append("---")
    lines.append("")
    lines.append(f"## Day {d}")
    lines.append("")
    lines.append("> 加练建议：先完成当日自测，再从下面挑 1~2 题补强。")
    lines.append("")
    lines.append("| # | 题号 | 题目 | 难度 | 考察内容 | 链接 |")
    lines.append("|---|------|------|------|----------|------|")
    for i, p in enumerate(day_pool[d], 1):
        lines.append(
            f"| {i} | {p['frontend_id']} | {p['title']} | {p['difficulty']} | {focus_for_title(p['title'])} | [Link]({p['url']}) |"
        )
    lines.append("")

with open(OUT_MD, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print(f"Generated: {OUT_MD}")
PY

echo "完成：$OUT_MD"
