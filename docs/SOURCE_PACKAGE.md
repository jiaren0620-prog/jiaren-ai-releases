# Jiaren AI 1.1.2 源码包说明

Jiaren AI 自有代码依据 GNU Affero General Public License version 3 发布，SPDX 标识为 `AGPL-3.0-only`。完整许可证见仓库根目录 `LICENSE`。

## 包含内容

- Jiaren AI 桌面端前端和 Electron 运行代码；
- Jiaren 本地服务、渠道驱动、画布 CLI/MCP、Agent、Skills 和共享模块；
- Windows/macOS 构建配置、安装器脚本和品牌构建资源；
- 自动化补丁、发行回归测试、第三方声明和许可文档。

## 有意排除

- `node_modules` 和 Electron/NSIS 工具缓存；
- 本地抠图模型权重、第三方 3D 模型、演示音频、Upscayl 二进制、FFmpeg 等大型第三方运行文件；
- `release-*` 安装产物、QA 浏览器配置、日志、缓存和临时文件；
- 社区服务器私有管理后台、数据库、Nginx 和线上部署配置；
- `.env`、API Key、账号凭据、Cookie、用户画布项目和私人素材。

这些排除项用于控制下载体积并保护线上基础设施，不属于桌面安装包中 JiarenAI 自有程序的对应源码。第三方运行文件可根据对应组件说明独立获取。

## 第三方组件

第三方代码和工具继续遵循各自许可证，详见 `THIRD_PARTY_NOTICES.md`。AGPL-3.0 仅覆盖 JiarenAI 有权许可的部分。

## 商标

AGPL-3.0 不授予 Jiaren AI、JiarenAI、JIA 名称、Logo、域名和产品视觉的商标使用权。分叉和再发布版本应使用清晰不同的名称与品牌，不能暗示获得 JiarenAI 官方认可。
