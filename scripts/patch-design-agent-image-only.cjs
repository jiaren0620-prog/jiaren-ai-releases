"use strict";

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const bundlePath = path.join(projectRoot, "dist", "assets", "DesignAgentPanel-DdUMLKSc.js");
const marker = "async function la(){var r,o;const e=ae;";
const patchMarker = "/* jiaren:image-only-design-planning */";

const source = fs.readFileSync(bundlePath, "utf8");
if (source.includes(patchMarker)) {
  console.log("Design Agent image-only planning patch is already applied.");
  process.exit(0);
}
if (!source.includes(marker)) {
  throw new Error(`Cannot find Design Agent planning marker in ${bundlePath}`);
}

const imageOnlyPlanning = marker + patchMarker + `if(e&&k(e)){I("reason"),sa(),re("");try{const s=Me(),c=(S||"现代商业产品设计").trim(),b=ie(c,z,{platformLabel:s.platformLabel,marketLabel:s.marketLabel,language:s.outputLanguage,platformRules:s.platformRules}),w=[Fe({title:"稳健转化方案",style:"清晰转化型",background:"干净、克制并符合当前平台的商业背景",lighting:"真实材质光与清晰产品轮廓光",composition:"产品为绝对主视觉，移动端优先，卖点层级清楚",copywritingArea:"预留简洁且可编辑的文案区域",commerceReasoning:"优先确保产品识别、信息可读性与转化效率",prompt:[b,"Direction: conversion-focused commercial layout.","Use the uploaded product image as the mandatory identity reference.","Keep the original product structure, color, material, label proportions and logo placement unchanged."].join("\\n"),score:92,reviewerNotes:"本地提示词已完成约束检查；生成阶段只调用当前选择的图片模型。"},0,z),Fe({title:"高级品牌方案",style:"克制品牌型",background:"高级留白与低噪声品牌场景",lighting:"柔和主光、精确高光与真实材质层次",composition:"编辑式构图，产品主体突出，保留品牌呼吸感",copywritingArea:"标题与品牌信息使用明确留白区",commerceReasoning:"兼顾品牌质感、产品真实性与长期复用",prompt:[b,"Direction: premium brand-led editorial commercial design.","Use the uploaded product image as the mandatory identity reference.","Preserve every recognizable product detail and avoid invented branding or unreadable copy."].join("\\n"),score:90,reviewerNotes:"本地提示词已完成约束检查；生成阶段只调用当前选择的图片模型。"},1,z),Fe({title:"活动冲击方案",style:"高识别活动型",background:"有层次的活动氛围，避免杂乱装饰",lighting:"高对比商业光，主体边缘清楚",composition:"第一眼识别产品，视觉动势集中但不遮挡主体",copywritingArea:"促销信息集中在独立安全区域",commerceReasoning:"强化停留率和活动识别，同时保持产品准确",prompt:[b,"Direction: high-impact campaign visual with controlled energy.","Use the uploaded product image as the mandatory identity reference.","Do not cover, deform, recolor or replace the product; keep promotional elements secondary."].join("\\n"),score:88,reviewerNotes:"本地提示词已完成约束检查；生成阶段只调用当前选择的图片模型。"},2,z)],U={product:{category:s.taskLabel,color:"以上传产品图为准",shape:"保持原产品结构",material:"保持原产品材质",sellingPoints:[c,"产品主体准确","平台用途适配"],targetAudience:s.platformLabel+"目标用户"},keyword:{theme:c,purpose:s.taskLabel,scene:s.platformLabel,constraints:["保持产品身份一致","不生成水印和乱码","不调用对话模型"]},plans:w};D("vision",{status:"done",summary:"已读取产品图"}),D("keyword",{status:"done",summary:c}),D("design",{status:"done",summary:w.length+" 个本地方案"}),D("prompt",{status:"done",summary:"已生成图片模型 Prompt"}),D("review",{status:"done",summary:"仅调用图片模型"}),Ae(U),Le(w[0].id),re(w[0].prompt),u("方案与提示词已在本地生成；出图时只调用当前选择的图片模型。"),JiarenCollaborativeTask&&JiarenSetWorkflowStep(4)}catch(s){me(c=>c.map(b=>b.status==="running"?{...b,status:"error",summary:"失败"}:b)),u(s instanceof Error?s.message:"生成图片提示词失败。")}finally{I(void 0)}return}`;

fs.writeFileSync(bundlePath, source.replace(marker, imageOnlyPlanning), "utf8");
console.log(`Patched ${bundlePath}`);
