#!/bin/bash
cd "$(dirname "$0")"

if [ ! -d "node_modules" ]; then
  echo "首次运行，安装依赖..."
  npm install
fi

echo "启动算法 7 日速通..."
echo "浏览器打开 http://localhost:5173"
npm run dev
