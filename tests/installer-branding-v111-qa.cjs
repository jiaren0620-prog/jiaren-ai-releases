"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

const installer = read("build/installer.nsh");
const builder = read("electron-builder-v019.cjs");
const icon = fs.readFileSync(path.join(root, "build", "icon.ico"));

for (const clause of [
  "\u6e90\u7801\u53ef\u89c1\u8f6f\u4ef6\uff1b\u4e2a\u4eba\u7528\u6237\u53ef\u6309\u793e\u533a\u8bb8\u53ef\u8bc1\u514d\u8d39\u4f7f\u7528\uff0c\u7ec4\u7ec7\u751f\u4ea7\u3001\u56e2\u961f\u90e8\u7f72\u3001\u4e8c\u6b21\u5f00\u53d1\u3001\u5d4c\u5165\u3001\u518d\u5206\u53d1\u6216\u5546\u4e1a\u670d\u52a1\u9700\u53e6\u884c\u53d6\u5f97\u5546\u4e1a\u8bb8\u53ef\u8bc1",
  "\u4e0d\u5185\u7f6e\u3001\u4e0d\u552e\u5356\u3001\u4e0d\u6258\u7ba1\u4efb\u4f55\u5927\u6a21\u578b API \u5bc6\u94a5\u4e0e\u8c03\u7528\u901a\u9053",
  "\u5f00\u53d1\u8005\u672a\u642d\u5efa\u4efb\u4f55\u8f6c\u53d1\u3001\u4e2d\u8f6c\u670d\u52a1\u5668",
  "\u8de8\u5883\u7f51\u7edc\u8bbf\u95ee\u3001\u5883\u5916\u5927\u6a21\u578b\u8c03\u7528\u76f8\u5173\u6cd5\u5f8b\u8d23\u4efb",
  "\u4e25\u7981\u751f\u6210\u65f6\u653f\u3001\u8272\u60c5\u3001\u66b4\u529b\u3001\u9020\u8c23\u7b49\u8fdd\u6cd5\u8fdd\u89c4\u5185\u5bb9",
  "\u5373\u4ee3\u8868\u5df2\u5b8c\u6574\u9605\u8bfb\u3001\u7406\u89e3\u5e76\u81ea\u613f\u63a5\u53d7\u672c\u5168\u90e8\u6761\u6b3e",
]) {
  assert.ok(installer.includes(clause), `missing installer clause: ${clause}`);
}

assert.match(installer, /!macro customWelcomePage/);
assert.match(installer, /!macro customInstallMode[\s\S]*StrCpy \$isForceCurrentInstall "1"/);
assert.match(installer, /Var JiarenDisclaimerCheckbox/);
assert.match(installer, /Var JiarenDisclaimerHintControl/);
assert.match(installer, /\$\{NSD_CreateCheckbox\} 0 108u 100% 16u/);
assert.match(installer, /\u6211\u5df2\u4ed4\u7ec6\u9605\u8bfb\uff0c\u540c\u610f\u6240\u6709\u514d\u8d23\u6761\u6b3e/);
assert.match(installer, /勾选后才可继续安装/);
assert.match(installer, /\$\{NSD_GetState\} \$JiarenDisclaimerCheckbox \$0/);
assert.match(installer, /\$\{NSD_SetState\} \$JiarenDisclaimerCheckbox \$\{BST_UNCHECKED\}/);
assert.doesNotMatch(installer, /\u2610|\u2611/);
assert.doesNotMatch(installer, /\$\{NSD_CreateLabel\} 0 33u 100% 63u/);
assert.doesNotMatch(installer, /\$\{NSD_CreateLabel\} 0 100u 100% 28u/);
assert.match(installer, /SendMessage \$0 \$\{WM_SETTEXT\} 0 "STR:\u7ee7\u7eed\u5b89\u88c5"/);
assert.match(installer, /CreateControl EDIT[^\r\n]+0 32u 100% 72u/);
assert.match(installer, /!define MUI_BGCOLOR "F4F7F4"/);
assert.match(installer, /版本 1\.1\.3 正式版 · 2026\.08\.04/);
assert.match(installer, /CreateFont \$3 "Microsoft YaHei UI" "8" "400"/);
assert.match(installer, /SetCtlColors \$JiarenDisclaimerText 0x17211A 0xFFFFFF/);
assert.match(installer, /\$\{If\} \$0 != \$\{BST_CHECKED\}[\s\S]{0,180}Abort/);

assert.match(builder, /perMachine: false/);
assert.match(builder, /allowElevation: false/);
assert.match(builder, /allowToChangeInstallationDirectory: true/);
assert.match(builder, /installerHeaderIcon: requiredPath\(buildRoot, "icon\.ico"\)/);

assert.equal(icon.readUInt16LE(0), 0);
assert.equal(icon.readUInt16LE(2), 1);
assert.equal(icon.readUInt16LE(4), 9);
assert.ok(fs.existsSync(path.join(root, "build", "jiaren-logo-source.png")));
assert.ok(fs.existsSync(path.join(root, "build", "jiaren-icon-preview.png")));

console.log("Jiaren AI 1.1.3 installer layout, branding, path selection, and disclaimer contracts passed.");
