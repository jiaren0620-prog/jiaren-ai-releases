---
name: chat-ui
description: Local Jiaren Agent chat UI patterns adapted from inference-sh/skills chat-ui.
source: https://github.com/inference-sh/skills/tree/main/ui/chat-ui
---

# Jiaren Chat UI

- Keep the message list scrollable and the composer fixed.
- Render user and assistant messages with distinct alignment and accessible labels.
- Show a typing state while a request is running and disable duplicate submission.
- Support multi-line input, Enter to send, and Shift+Enter for a line break.
- Treat attachments as first-class context. Show removable file chips before sending.
- Keep attachment actions separate for files, folders, and images.
- Use the host application's design tokens and icon set.
- Preserve message history without exposing API keys or local absolute paths in visible replies.

