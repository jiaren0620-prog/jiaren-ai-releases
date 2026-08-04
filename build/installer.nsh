!include "nsDialogs.nsh"
!include "LogicLib.nsh"
!include "WinMessages.nsh"

!define MUI_ABORTWARNING
!define MUI_BGCOLOR "F4F7F4"
!define MUI_TEXTCOLOR "17211A"
!define MUI_INSTFILESPAGE_COLORS "17211A F4F7F4"

!ifndef BUILD_UNINSTALLER

Var JiarenDisclaimerDialog
Var JiarenDisclaimerText
Var JiarenDisclaimerCheckbox
Var JiarenDisclaimerHintControl

!macro customWelcomePage
  Page custom JiarenDisclaimerPage JiarenDisclaimerLeave
!macroend

!macro customInstallMode
  StrCpy $isForceCurrentInstall "1"
!macroend

!macro customHeader
  BrandingText "Jiaren AI · 本地创作工具"
!macroend

Function JiarenDisclaimerInitialize
  ${NSD_SetState} $JiarenDisclaimerCheckbox ${BST_UNCHECKED}
  SendMessage $JiarenDisclaimerHintControl ${WM_SETTEXT} 0 "STR:勾选后才可继续安装"
  SetCtlColors $JiarenDisclaimerHintControl 0x6B756E 0xF4F7F4
  GetDlgItem $0 $HWNDPARENT 1
  SendMessage $0 ${WM_SETTEXT} 0 "STR:继续安装"
  SendMessage $JiarenDisclaimerText ${EM_SETSEL} 0 0
  SendMessage $JiarenDisclaimerText ${EM_SCROLLCARET} 0 0
  SendMessage $JiarenDisclaimerText ${WM_VSCROLL} 6 0
  ${NSD_KillTimer} JiarenDisclaimerInitialize
FunctionEnd

Function JiarenDisclaimerPage
  IfSilent JiarenDisclaimerPageSkip

  nsDialogs::Create 1018
  Pop $JiarenDisclaimerDialog
  ${If} $JiarenDisclaimerDialog == error
    Abort
  ${EndIf}

  SetCtlColors $JiarenDisclaimerDialog 0x17211A 0xF4F7F4

  ${NSD_CreateLabel} 0 0 100% 16u "安装 Jiaren AI"
  Pop $0
  CreateFont $1 "Microsoft YaHei UI" "13" "700"
  SendMessage $0 ${WM_SETFONT} $1 1
  SetCtlColors $0 0x245C3A 0xF4F7F4

  ${NSD_CreateLabel} 0 17u 100% 12u "版本 1.1.3 正式版 · 2026.08.04"
  Pop $0
  SetCtlColors $0 0x667269 0xF4F7F4

  StrCpy $2 "本桌面 AI 无限画布工具为 JiarenAI 发布的源码可见软件；个人用户可按社区许可证免费使用，组织生产、团队部署、二次开发、嵌入、再分发或商业服务需另行取得商业许可证；"
  StrCpy $2 "$2$\r$\n$\r$\n本软件仅提供画布绘制、视图编辑交互框架，不内置、不售卖、不托管任何大模型 API 密钥与调用通道；如需 AI 文生图、3D 生成功能，需要使用者自行独立申请各大 AI 厂商接口密钥；"
  StrCpy $2 "$2$\r$\n$\r$\n软件支持填写自定义接口地址，可对接国内合规大模型或境外模型；所有网络请求、数据传输均在使用者本地电脑终端完成，开发者未搭建任何转发、中转服务器，不会收集、存储、留存你的文字、图片、个人信息；"
  StrCpy $2 "$2$\r$\n$\r$\n依据国家网络安全、数据安全相关法律法规，跨境网络访问、境外大模型调用相关法律责任，全部由软件使用者自行承担；"
  StrCpy $2 "$2$\r$\n$\r$\n软件本身的使用、修改和再分发权受根目录 LICENSE 约束；个人使用软件生成的内容不当然受本软件许可证限制，但仍须遵守模型、API、素材和适用法律要求；"
  StrCpy $2 "$2$\r$\n$\r$\n严禁生成时政、色情、暴力、造谣等违法违规内容；违规使用产生的后果由使用者自行承担。"
  StrCpy $2 "$2$\r$\n$\r$\n使用者下载、安装、运行本软件，即代表已完整阅读、理解并自愿接受本全部条款。"

  nsDialogs::CreateControl EDIT "${DEFAULT_STYLES}|${WS_TABSTOP}|${WS_VSCROLL}|${ES_MULTILINE}|${ES_READONLY}|${ES_AUTOVSCROLL}|${ES_WANTRETURN}" "" 0 32u 100% 72u "$2"
  Pop $JiarenDisclaimerText
  CreateFont $3 "Microsoft YaHei UI" "8" "400"
  SendMessage $JiarenDisclaimerText ${WM_SETFONT} $3 1
  SendMessage $JiarenDisclaimerText ${EM_SETMARGINS} 3 655370
  SetCtlColors $JiarenDisclaimerText 0x17211A 0xFFFFFF
  SendMessage $JiarenDisclaimerText ${EM_SETSEL} 0 0
  SendMessage $JiarenDisclaimerText ${EM_SCROLLCARET} 0 0

  ${NSD_CreateCheckbox} 0 108u 100% 16u "我已仔细阅读，同意所有免责条款"
  Pop $JiarenDisclaimerCheckbox
  CreateFont $3 "Microsoft YaHei UI" "9" "600"
  SendMessage $JiarenDisclaimerCheckbox ${WM_SETFONT} $3 1
  SetCtlColors $JiarenDisclaimerCheckbox 0x17211A 0xF4F7F4

  ${NSD_CreateLabel} 0 126u 100% 10u "勾选后才可继续安装"
  Pop $JiarenDisclaimerHintControl
  CreateFont $3 "Microsoft YaHei UI" "8" "400"
  SendMessage $JiarenDisclaimerHintControl ${WM_SETFONT} $3 1
  SetCtlColors $JiarenDisclaimerHintControl 0x6B756E 0xF4F7F4

  ${NSD_CreateTimer} JiarenDisclaimerInitialize 50
  nsDialogs::Show
  Return

JiarenDisclaimerPageSkip:
  Abort
FunctionEnd

Function JiarenDisclaimerLeave
  IfSilent JiarenDisclaimerLeaveDone
  ${NSD_GetState} $JiarenDisclaimerCheckbox $0
  ${If} $0 != ${BST_CHECKED}
    MessageBox MB_OK|MB_ICONEXCLAMATION "请先勾选同意所有免责条款，才能继续安装。"
    Abort
  ${EndIf}
JiarenDisclaimerLeaveDone:
FunctionEnd

!endif
