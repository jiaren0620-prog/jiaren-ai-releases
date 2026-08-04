---
name: jiaren-canvas
description: Read and operate the currently running Jiaren AI infinite canvas through its local MCP bridge. Use when the user asks Codex to inspect, summarize, add, update, delete, connect, select, or run nodes in Jiaren AI.
---

# Jiaren Canvas

Use the `jiaren-canvas` MCP tools to work with the user's current Jiaren AI canvas.

1. Call `jiaren_canvas_get_state` before reasoning about the whole canvas, or `jiaren_canvas_get_selection` for selection-scoped work.
2. Prefer exactly one `jiaren_canvas_generate_text`, `jiaren_canvas_generate_image`, `jiaren_canvas_generate_video`, or `jiaren_canvas_generate_audio` call when the user wants a ready-to-run result. Direct image generation uses a hidden executor and leaves only the final image node on the visible canvas. Never pass a `modelId` to direct image generation. Use `jiaren_canvas_create_generation_flow` only when the user explicitly wants editable prompt and generation nodes.
   - Ordinary raster-image requests must use `jiaren_canvas_generate_image`: product main images, e-commerce images, posters, advertising images, photorealistic images, PNG/JPG/WebP output, and image editing all belong here.
   - Do not use `jiaren_canvas_create_svg` for an ordinary image request, even when the requested size is fixed or the image contains text. Do not create a local SVG/PNG with shell commands or write an image into `.project` as a substitute for the canvas image result.
   - Use `jiaren_canvas_create_svg` only when the user explicitly asks for SVG, vector artwork, an icon, a logo, or editable line art. The word "产品主图" or "电商主图" alone is never a vector request.
3. Preserve sequence and references: pass existing source nodes through `referenceNodeIds`; use `jiaren_canvas_connect_nodes` when adding links to existing nodes. Video means the primary-canvas `sdVideo` node, not the removed secondary storyboard roles.
4. Prefer the focused update, move, resize, select, viewport, run, and delete helpers. Use `jiaren_canvas_apply_ops` only for mixed changes that cannot be expressed cleanly with one focused helper.
5. Every write creates an approval card and returns a plan ID. Tell the user that approval is waiting, then call `jiaren_canvas_wait_for_plan` with that plan ID. Continue only from the returned terminal receipt and a fresh canvas snapshot; never claim success from submission alone. A `run.node` receipt with `queued: true` means only that the renderer accepted the dispatch; it is not image completion. Do not treat a queued task, a local file path, a shell command, or an assistant claim as a generated image. Do not submit a duplicate node or SVG fallback.
   - For a successful image result, verify all of these: the terminal receipt status is `succeeded`; the final canvas snapshot contains the same node ID; that node has `kind: "imageInput"` and `data.agentResult: true`; and it contains a final image URL or image source. If any check fails, report failure and leave no false success message.
6. If waiting times out, use `jiaren_canvas_get_plan` rather than submitting a duplicate plan. Use `jiaren_canvas_list_receipts` to inspect recent execution failures or completed work.
7. Keep edits scoped to the user's request. Preserve existing nodes and edges unless deletion was explicitly requested. Codex plans and operates the canvas; Jiaren runs media generation as a delegated background task.
8. Never ask for or expose API keys, login tokens, cookies, or credentials. The canvas snapshot is already redacted.
9. For direct Jiaren Agent image tasks, never name, guess, select, or repeat an underlying model, provider, API route, key, or executor in progress updates or final replies. Say that the Jiaren image task is being processed and report success only after the terminal receipt and final canvas-node check above. Never say an image will appear later when the task has failed or when only a local file exists.

Recommended closed loop:

1. Read canvas state or selection.
2. Submit one coherent plan with temporary references for nodes created together.
3. Wait for that plan's approval and execution receipt.
4. Read the canvas again when the next decision depends on generated or propagated data.
5. Continue with another scoped plan only when needed.

The plugin receives a temporary loopback-only credential while Jiaren AI is running. The six-digit Jiaren pairing code is only for manual CLI clients; it is not an OpenAI or Codex login code.
