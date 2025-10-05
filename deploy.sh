#!/bin/bash
set -e

echo "🚀 Start deploying Wallet app..."

# 1️⃣ Chuyển đến thư mục project thật
cd "$(pwd)"

if [ ! -d .git ]; then
  echo "🔍 Repo chưa có, cloning..."
  git clone https://github.com/tunxino/wallet_be.git
fi

# 2️⃣ Pull code mới nhất từ main
git fetch origin main
git reset --hard origin/main
git clean -fd

# 3️⃣ Cài dependencies (sạch và ổn định)
npm ci

# 4️⃣ Build NestJS project
npm run build

# 5️⃣ Restart app bằng PM2 (nếu chưa start thì start mới)
if pm2 describe wallet_be > /dev/null; then
  echo "♻️ Reloading existing PM2 process..."
  pm2 reload wallet_be
else
  echo "🚀 Starting new PM2 process..."
  pm2 start dist/main.js --name wallet_be
fi

# 6️⃣ Lưu cấu hình PM2 để tự khởi động cùng hệ thống
pm2 save

echo "✅ Deploy hoàn tất!"
