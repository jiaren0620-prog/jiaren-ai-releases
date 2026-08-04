const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  buildOrderedGeminiImageParts,
  buildOrderedImagePrompt,
  buildOrderedOpenAIImageContent,
  normalizeOrderedMultimodalContent,
} = require('../shared/inlineMediaContent.cjs');

const references = [
  {
    referenceKey: 'image-a',
    dataUrl: 'data:image/png;base64,QQ==',
    mime: 'image/png',
    bytes: Buffer.from('A'),
  },
  {
    referenceKey: 'image-b',
    dataUrl: 'data:image/jpeg;base64,Qg==',
    mime: 'image/jpeg',
    bytes: Buffer.from('B'),
  },
];

const request = {
  prompt: '保持人物身份，完成最终画面。',
  multimodalContent: [
    { type: 'text', text: '前文文字' },
    { type: 'image', referenceKey: 'image-a', referenceIndex: 0 },
    { type: 'text', text: '中间衔接文字' },
    { type: 'image', referenceKey: 'image-b', referenceIndex: 1 },
    { type: 'text', text: '结尾文字' },
  ],
};

const normalized = normalizeOrderedMultimodalContent(request, references);
assert.deepEqual(
  normalized.map((part) => part.type === 'text' ? part.text : `image-${part.referenceIndex}`),
  [
    '前文文字',
    'image-0',
    '中间衔接文字',
    'image-1',
    '结尾文字\n\n全局生成要求：保持人物身份，完成最终画面。',
  ],
);

const openAi = buildOrderedOpenAIImageContent(request, references);
assert.deepEqual(openAi.map((part) => part.type), [
  'text',
  'image_url',
  'text',
  'image_url',
  'text',
]);
assert.equal(openAi[1].image_url.url, references[0].dataUrl);
assert.equal(openAi[3].image_url.url, references[1].dataUrl);

const gemini = buildOrderedGeminiImageParts(request, references);
assert.deepEqual(gemini.map((part) => part.text ? 'text' : 'inline_data'), [
  'text',
  'inline_data',
  'text',
  'inline_data',
  'text',
]);
assert.equal(gemini[1].inline_data.data, Buffer.from('A').toString('base64'));
assert.equal(gemini[3].inline_data.data, Buffer.from('B').toString('base64'));

const anchored = buildOrderedImagePrompt(request, references);
assert.match(anchored, /^前文文字\n\[参考图1\]\n中间衔接文字/);
assert.match(anchored, /中间衔接文字\n\[参考图2\]\n结尾文字/);
assert.match(anchored, /全局生成要求：保持人物身份，完成最终画面。$/);

const indexOnly = buildOrderedOpenAIImageContent({
  prompt: '完成',
  multimodalContent: [
    { type: 'text', text: '甲' },
    { type: 'image', referenceIndex: 1 },
    { type: 'text', text: '乙' },
  ],
}, references);
assert.equal(indexOnly[1].image_url.url, references[1].dataUrl);

const mainSource = fs.readFileSync(path.resolve(__dirname, '../dist-electron/electron/main.js'), 'utf8');
const canvasSource = fs.readFileSync(path.resolve(__dirname, '../dist/assets/MainCanvasFlow-BbsMxxcM.js'), 'utf8');
assert.match(mainSource, /buildOrderedOpenAIImageContent\(request, references\.slice\(0, 6\)\)/);
assert.match(mainSource, /buildOrderedGeminiImageParts\(request, references\.slice\(0, 14\)\)/);
assert.match(mainSource, /buildOrderedImagePrompt\(request, references\)/);
assert.match(canvasSource, /richPromptContent: q/);
assert.match(canvasSource, /multimodalContent: JiarenMultimodalContent/);

console.log('Inline rich-media prompt ordering checks passed.');
