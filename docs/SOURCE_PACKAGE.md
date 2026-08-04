# Jiaren AI 1.1.2 源码包说明

Jiaren AI 自有代码依据 Jiaren AI Community License 1.0 与单独商业许可证双重许可发布。完整社区许可证见仓库根目录 `LICENSE`，商业授权说明见 `COMMERCIAL_LICENSE.md`。

## 包含内容

- Jiaren AI 桌面端前端和 Electron 运行代码；
- Jiaren 本地服务、渠道驱动、画布 CLI/MCP、Agent、Skills 和共享模块；
- Windows/macOS 构建配置、安装器脚本和品牌构建资源；
- 自动化补丁、发行回归测试、第三方声明和许可文档。

## 有意排除

- `node_modules` 和 Electron/NSIS 工具缓存；
- 本地抠图模型权重、Upscayl 二进制、FFmpeg 等大型第三方运行文件；
- `release-*` 安装产物、QA 浏览器配置、日志、缓存和临时文件；
- 社区服务器私有管理后台、数据库、Nginx 和线上部署配置；
- `.env`、API Key、账号凭据、Cookie、用户画布项目和私人素材。

这些排除项用于控制下载体积并保护线上基础设施，不属于桌面安装包中 JiarenAI 自有程序的对应源码。第三方运行文件可根据对应组件说明独立获取。

## 第三方组件

第三方代码和工具继续遵循各自许可证，详见 `THIRD_PARTY_NOTICES.md`。Jiaren AI 自定义许可仅覆盖 JiarenAI 有权许可的部分。

## 商标

社区许可证和商业许可证均不授予 Jiaren AI、JiarenAI、JIA 名称、Logo、域名和产品视觉的商标使用权。未经书面授权，分叉和再发布版本应使用清晰不同的名称与品牌，不能暗示获得 JiarenAI 官方认可。
