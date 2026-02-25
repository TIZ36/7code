#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

MODE="${1:-prod}" # prod | preview

if [[ "$MODE" != "prod" && "$MODE" != "preview" ]]; then
  echo "用法: ./deploy-vercel.sh [prod|preview]"
  echo "  prod    部署到生产环境（默认）"
  echo "  preview 部署到预览环境"
  exit 1
fi

echo "==> 检查环境..."
if ! command -v node >/dev/null 2>&1; then
  echo "❌ 未检测到 Node.js，请先安装: https://nodejs.org/"
  exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "❌ 未检测到 npm，请先安装 Node.js（会自带 npm）"
  exit 1
fi

echo "==> Node 版本: $(node -v)"
echo "==> npm 版本 : $(npm -v)"

echo "==> 安装依赖..."
npm install

echo "==> 本地构建检查..."
npm run build

echo "==> 准备 Vercel 部署..."
if [[ -n "${VERCEL_TOKEN:-}" ]]; then
  echo "==> 检测到 VERCEL_TOKEN，使用无交互部署"
  if [[ "$MODE" == "prod" ]]; then
    npx vercel@latest --prod --yes --token "$VERCEL_TOKEN"
  else
    npx vercel@latest --yes --token "$VERCEL_TOKEN"
  fi
else
  echo "==> 未检测到 VERCEL_TOKEN，进入交互式部署（适合首次使用）"
  echo "    首次会提示登录/关联项目，按提示回车即可。"
  if [[ "$MODE" == "prod" ]]; then
    npx vercel@latest --prod
  else
    npx vercel@latest
  fi
fi

echo ""
echo "✅ 部署完成。"
echo "提示：如果你想完全一键（无交互），先在 Vercel 里创建 Token，执行："
echo "  export VERCEL_TOKEN=你的token"
echo "  ./deploy-vercel.sh prod"
