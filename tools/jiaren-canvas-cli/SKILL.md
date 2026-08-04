---
name: jiaren-canvas-control
description: 通过本地 Jiaren Canvas CLI 读取当前画布、提交可审批的画布修改计划并读取执行回执。用于 Codex/CLI 与 Jiaren AI 画布闭环协作，不接触用户 API Key。
---

# Jiaren Canvas Control

## 安全边界

- 只连接 `127.0.0.1` 上当前运行的 Jiaren AI。
- 首次使用必须在 Jiaren Agent 中显示配对码，再执行 `jiaren-canvas pair <配对码>`。
- CLI 只能提交计划。新增、修改、删除、运行节点均须用户在 Jiaren Agent 中审批。
- 不读取、不输出、不传递用户配置的模型 API Key。
- 失败重试只重试失败的本地读取或下载，不重复提交付费生成任务。

## 常用命令

```powershell
jiaren-canvas status
jiaren-canvas pair 123456
jiaren-canvas snapshot
jiaren-canvas submit-plan .\plan.json
jiaren-canvas plans pending
jiaren-canvas receipts
```

## 计划格式

```json
{
  "title": "创建绘图节点",
  "summary": "在当前视图右侧创建一个待生成的绘图节点",
  "operations": [
    {
      "type": "node.add",
      "kind": "generateImage",
      "position": { "x": 420, "y": 260 },
      "data": { "prompt": "产品摄影，柔和侧光", "status": "idle" }
    }
  ]
}
```

提交后读取返回的 `plan.id`，等待用户审批，再用 `jiaren-canvas receipts` 检查执行回执。
