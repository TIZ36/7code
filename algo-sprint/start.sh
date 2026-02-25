#!/bin/bash
cd "$(dirname "$0")"

if [ ! -d "node_modules" ]; then
  echo "首次运行，安装依赖..."
  npm install
fi

if [ -x "./sync_leetcode.sh" ]; then
  echo "同步实时题池..."
  ./sync_leetcode.sh || echo "实时题池同步失败，继续启动前端。"
fi

echo "启动算法 7 日速通..."
echo "浏览器打开 http://localhost:5173"
npm run dev
