#!/bin/zsh
set -e
DIR="${0:A:h}"
APP="$DIR/Jiaren AI.app"
if [[ ! -d "$APP" && -d "/Applications/Jiaren AI.app" ]]; then
  APP="/Applications/Jiaren AI.app"
fi
if [[ ! -d "$APP" ]]; then
  echo "未找到 Jiaren AI.app，请保持脚本与应用位于同一文件夹。"
  read -k 1
  exit 1
fi
/usr/bin/xattr -dr com.apple.quarantine "$APP" || true
/usr/bin/codesign --force --deep --sign - "$APP"
open "$APP"
echo "Jiaren AI 已完成本机授权并打开。"
