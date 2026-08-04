'use strict';

let cachedSharp;

function makeUnavailableSharp(loadError) {
  const sharpUnavailable = () => {
    const error = new Error('本机图像处理组件 sharp 未加载，上传仍可用，请修复依赖后再使用缩略图、裁剪等图像处理能力。');
    error.code = 'sharp_unavailable';
    error.cause = loadError;
    throw error;
  };
  sharpUnavailable.available = false;
  sharpUnavailable.loadError = loadError;
  return sharpUnavailable;
}

function loadOptionalSharp() {
  if (cachedSharp) return cachedSharp;
  try {
    cachedSharp = require('sharp');
    cachedSharp.available = true;
  } catch (error) {
    console.warn('[optional-sharp] sharp unavailable, image processing routes will degrade:', error?.message || error);
    cachedSharp = makeUnavailableSharp(error);
  }
  return cachedSharp;
}

module.exports = loadOptionalSharp();
module.exports.loadOptionalSharp = loadOptionalSharp;
