"use strict";

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const targetPath = path.join(projectRoot, "dist", "assets", "T8AdvancedNodes-complete-v6.js");
const defaultsPath = path.join(projectRoot, "dist", "assets", "t8-original-defaults-B6J-Pl2o.js");
const marker = "Jiaren v0.1.9 Seedance studio skill bridge";

let source = fs.readFileSync(targetPath, "utf8");
if (!source.includes(marker)) {
  const oldFunction = /jiarenCompileSeedancePrompt = \(prompt, context = \{\}\) => \{[\s\S]*?\n  \},\n  Up =/;
  const newFunction = `/* ${marker} */
  jiarenCompileSeedancePrompt = (prompt, context = {}) => {
    const source = String(prompt || "").trim();
    if (!source || source.includes("JIAREN SEEDANCE SOURCE LOCK")) return source;
    if (context.skillMode === "seedance") return source;
    const references = [
      context.imageCount ? \`${"${context.imageCount}"} 张图片锁定人物/产品身份、造型、比例与场景\` : "",
      context.videoCount ? \`${"${context.videoCount}"} 段视频锁定动作与运镜节奏\` : "",
      context.audioCount ? \`${"${context.audioCount}"} 段音频锁定对白、环境音与节拍\` : "",
    ].filter(Boolean).join("；") || "无外部参考素材，以原始镜头文字为准";
    const shortInput = source.length < 240 && !/[\\n。；;]|镜头|场景|内景|外景|台词|对白/.test(source);
    const studioRules = shortInput
        ? "影视工坊一句话成片：将一句话拆成起承转合、角色动作、场景锚点、镜头节奏、声音与结尾画面，但不得改变原始意图。"
        : "影视工坊改编：按原文事件覆盖率拆成连续镜头，先锁定角色、场景、道具和空间锚点，再编译为可执行视频提示词。";
    const directorRules = "Seedance 视频导演：检查开场钩子、Goal × Conflict、A/B 双轨节奏和视听母题；按 S1 逐镜、S2 批次、S3 九宫格组织，不重写已确认剧情。";
    return [
      "JIAREN SEEDANCE SOURCE LOCK",
      \`原始镜头：\${source}\`,
      studioRules,
      directorRules,
      "执行规则：完整呈现原始镜头中的人物、地点、事件、动作顺序、道具、对白、旁白和内心独白；台词逐字保留，不概括、不省略、不另写剧情。",
      \`参考关系：\${references}。参考素材只承担已声明职责，禁止互相替换主体、场景或风格。\`,
      \`连续性：时长 \${context.duration || 5} 秒，画幅 \${context.ratio || "16:9"}；保持人物身份、五官、服饰、体型、左右站位、视线、道具、场景结构、光线方向和色调一致。\`,
      "镜头约束：动作起止清楚，运镜平稳，主体持续可见；无跳轴、无突然换角度、无多肢体、无穿模、无闪烁、无鬼影、无主体增减、无文字水印。",
    ].filter(Boolean).join("\\n");
  },
  Up =`;
  if (!oldFunction.test(source)) {
    throw new Error("Seedance prompt compiler anchor not found.");
  }
  source = source.replace(oldFunction, newFunction);

  const skillContextAnchor = `            duration: yt,\n            ratio: _t,\n          });`;
  if (!source.includes(skillContextAnchor)) {
    throw new Error("Seedance compiler context anchor not found.");
  }
  source = source.replace(skillContextAnchor, `            duration: yt,\n            ratio: _t,\n            skillMode: String(_.seedanceSkillMode || "seedance"),\n          });`);

  const modeAnchor = /(\n\s*)Vt = _.webSearch === !0,\n(\s*)P = typeof _.seed == "number" \? _.seed : -1,/;
  if (!modeAnchor.test(source)) {
    throw new Error("Seedance skill mode state anchor not found.");
  }
  source = source.replace(modeAnchor, `$1Vt = _.webSearch === !0,\n$2skillMode = String(_.seedanceSkillMode || "seedance"),\n$2P = typeof _.seed == "number" ? _.seed : -1,`);

  const uiAnchor = `            o("div", {\n              children: [\n                t("label", {\n                  className: "text-[10px] text-white/50 block mb-1",\n                  children: "本地 Prompt(可选)",`;
  const uiReplacement = `            o("div", {\n              className: "grid grid-cols-[minmax(0,1fr)_150px] gap-2",\n              children: [\n                o("label", {\n                  className: "grid min-w-0 gap-1 text-[10px] text-white/50",\n                  children: [\n                    t("span", { children: "导演编译层" }),\n                    t("select", {\n                      value: skillMode,\n                      onChange: (O) => n({ seedanceSkillMode: O.target.value }),\n                      className: "w-full rounded bg-white/5 border border-white/10 px-2 py-1 text-[11px] text-white outline-none focus:border-lime-300/60",\n                      children: [\n                        t("option", { value: "studio", children: "影视工坊 + 导演" }),\n                        t("option", { value: "seedance", children: "纯 Seedance" }),\n                      ],\n                    }),\n                  ],\n                }),\n                o("label", {\n                  className: "text-[10px] text-white/50 block mb-1",\n                  children: "本地 Prompt(可选)",`;
  const stableUiReplacement = uiReplacement.replace(
    'className: "grid grid-cols-[minmax(0,1fr)_150px] gap-2"',
    'className: "space-y-2"',
  );
  if (!source.includes(uiAnchor)) {
    throw new Error("Seedance skill mode UI anchor not found.");
  }
  source = source.replace(uiAnchor, stableUiReplacement);
  fs.writeFileSync(targetPath, source, "utf8");
  console.log("Applied Seedance studio skill bridge.");
} else {
  console.log("Seedance studio skill bridge is already applied.");
}

let defaults = fs.readFileSync(defaultsPath, "utf8");
if (defaults.includes('seedanceSkillMode:"studio"')) {
  defaults = defaults.replace('seedanceSkillMode:"studio"', 'seedanceSkillMode:"seedance"');
  fs.writeFileSync(defaultsPath, defaults, "utf8");
  console.log("Changed the JiarenAI studio mode to opt-in.");
} else if (!defaults.includes("seedanceSkillMode")) {
  const anchor = 'seedanceNzModel:"fast",';
  if (!defaults.includes(anchor)) throw new Error("Seedance defaults anchor not found.");
  defaults = defaults.replace(anchor, `${anchor}seedanceSkillMode:"seedance",animeStudioMode:"auto",`);
  fs.writeFileSync(defaultsPath, defaults, "utf8");
  console.log("Enabled JiarenAI studio mode by default.");
} else {
  console.log("JiarenAI studio mode default is already present.");
}
