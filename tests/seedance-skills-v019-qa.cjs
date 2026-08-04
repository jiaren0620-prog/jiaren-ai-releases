"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const advancedNodeSource = fs.readFileSync(path.join(root, "dist", "assets", "T8AdvancedNodes-complete-v6.js"), "utf8");
const defaultsSource = fs.readFileSync(path.join(root, "dist", "assets", "t8-original-defaults-B6J-Pl2o.js"), "utf8");
const pipeline = JSON.parse(fs.readFileSync(path.join(root, "data", "video-skills", "pipeline.json"), "utf8"));
const studioSkill = fs.readFileSync(path.join(root, "data", "skills", "anime_short_drama_studio.md"), "utf8");
const directorSkill = fs.readFileSync(path.join(root, "data", "skills", "seedance_video_director.md"), "utf8");

assert.match(advancedNodeSource, /if \(context\.skillMode === "seedance"\) return source;/);
assert.match(advancedNodeSource, /seedanceSkillMode \|\| "seedance"/);
assert.match(advancedNodeSource, /影视工坊 \+ 导演/);
assert.match(advancedNodeSource, /纯 Seedance/);
assert.match(advancedNodeSource, /JIAREN SEEDANCE SOURCE LOCK/);
assert.match(defaultsSource, /seedanceSkillMode:"seedance"/);
assert.equal(pipeline.defaultMode, "seedance");
assert.equal(pipeline.enabledByDefault, false);
assert.equal(pipeline.hardRules.replaceExistingSeedanceApi, false);
assert.equal(pipeline.hardRules.useCurrentUserApiOnly, true);
assert.match(studioSkill, /默认“纯 Seedance”保持原提示词和原请求不变/);
assert.match(directorSkill, /默认“纯 Seedance”不会经过此层/);

console.log(JSON.stringify({
  ok: true,
  defaultMode: pipeline.defaultMode,
  studioMode: "opt-in",
  stages: pipeline.stages.map((stage) => stage.id),
}, null, 2));
