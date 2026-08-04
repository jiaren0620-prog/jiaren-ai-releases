# Jiaren Canvas MCP

Jiaren AI 的本地 MCP 桥接服务。它只连接 `127.0.0.1` 上正在运行的 Jiaren Canvas Control，读取画布状态，并把所有写操作提交为 Jiaren AI 内的待审批计划。

Codex MCP 插件会在 Jiaren AI 运行期间自动取得仅限本机的临时令牌，无需 OpenAI 登录验证码。手动 CLI 客户端仍使用六位配对码：

1. 启动 Jiaren AI。
2. 在 Jiaren Agent 中点击 `CLI` 获取六位本地配对码。
3. 运行 `jiaren-canvas pair <code>`。

这个六位数字仅用于手动 CLI 画布桥接，不是 OpenAI 登录验证码。
