#!/usr/bin/env sh

# 终止一个错误
set -e
git config --global user.email "847300267@qq.com"
git config --global user.name "Lily"

# 构建
npm run build

# 进入生成的构建文件夹
cd docs/.vuepress/dist

# 如果你是要部署到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

echo "before push"
# 如果你想要部署到 https://<USERNAME>.github.io
git push -f git@github.com:one-pencil/one-pencil.github.io.git release
echo "after push"
cd -
