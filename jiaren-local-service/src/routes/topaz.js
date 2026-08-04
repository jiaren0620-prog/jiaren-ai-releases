'use strict';

const express = require('express');
const { resolveAiWatermarkMediaRef } = require('../tools/aiWatermark/media');
const {
  detectTopazStatus,
  runGigapixelImage,
  runTopazVideo,
} = require('../tools/topaz/runner');

const router = express.Router();

function normalizeSource(body) {
  const b = body || {};
  return String(
    b.source ||
    b.url ||
    b.imageUrl ||
    b.videoUrl ||
    '',
  ).trim();
}

function sendError(res, error, status = 500) {
  res.status(status).json({
    success: false,
    error: error?.message || String(error),
    hint: error?.hint || '',
  });
}

router.get('/status', (req, res) => {
  try {
    res.json({
      success: true,
      data: detectTopazStatus({
        gigapixelPath: req.query?.gigapixelPath,
        executablePath: req.query?.executablePath,
        topazVideoPath: req.query?.topazVideoPath,
        ffmpegPath: req.query?.ffmpegPath,
      }),
    });
  } catch (error) {
    sendError(res, error);
  }
});

router.post('/gigapixel', async (req, res) => {
  try {
    const source = normalizeSource(req.body);
    if (!source) return sendError(res, new Error('缺少输入图像'), 400);
    const media = await resolveAiWatermarkMediaRef(source);
    if (media.kind !== 'image') return sendError(res, new Error('Topaz 图像高清化只接受图像输入'), 400);
    const result = await runGigapixelImage({
      ...req.body,
      sourcePath: media.path,
    });
    res.json({
      success: true,
      data: {
        ...result,
        input: {
          kind: media.kind,
          mime: media.mime,
          source: media.source,
        },
      },
    });
  } catch (error) {
    sendError(res, error);
  }
});

router.post('/video', async (req, res) => {
  try {
    const source = normalizeSource(req.body);
    if (!source) return sendError(res, new Error('缺少输入视频'), 400);
    const media = await resolveAiWatermarkMediaRef(source);
    if (media.kind !== 'video') return sendError(res, new Error('Topaz 视频高清化只接受视频输入'), 400);
    const result = await runTopazVideo({
      ...req.body,
      sourcePath: media.path,
    });
    res.json({
      success: true,
      data: {
        ...result,
        input: {
          kind: media.kind,
          mime: media.mime,
          source: media.source,
        },
      },
    });
  } catch (error) {
    sendError(res, error);
  }
});

module.exports = router;
