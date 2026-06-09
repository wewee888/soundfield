# SOUNDTEST.PRO 开发交接文档

`soundfield` 是一个单文件静态网页声级计应用，入口文件为 `measure/`。它面向移动端浏览器和桌面浏览器，提供实时分贝估算、A/C/Z 计权切换、快/慢响应、波形/频谱/1/3 倍频程/趋势可视化、录音/录像取证、GPS 与结构化测点标记、历史记录、CSV/PDF 导出等能力。

> 重要说明：当前 App 使用浏览器麦克风和 Web Audio API 做消费级声级估算，不是法定计量声级计。不同设备、浏览器、麦克风增益、系统音频链路会导致数值差异。正式噪声检测仍需专业校准设备。

## 快速运行

本项目没有构建步骤，直接打开 HTML 即可。

推荐用本地 HTTP 服务运行，避免浏览器权限限制：

```powershell
Set-Location "e:\.site\dB_test\soundfield"
python -m http.server 8080
```

然后访问：

```text
http://localhost:8080/index.html       # 全球推广网站首页
http://localhost:8080/measure/  # 直接打开声级记录工具
```

也可以直接双击 `measure/`，但麦克风、摄像头、定位等权限在 `file://` 下可能不可用。正式调试请使用 `localhost` 或 HTTPS。

## Lemon Squeezy 收款与会员（已接入）

项目已预留 Cloudflare Pages Functions 会员接口：

- `POST /api/membership/create-checkout`：创建 Lemon Checkout
- `POST /api/membership/lookup`：按购买邮箱校验会员状态
- `GET /api/membership/config`：返回收款配置是否生效（不暴露密钥）

在 Cloudflare Pages 项目里配置以下环境变量后即可启用真实收款：

- `LEMON_SQUEEZY_API_KEY`：Lemon API Key（`lsk_live_*` 或 `lsk_test_*`）
- `LEMON_STORE_ID`：Lemon Store ID
- `LEMON_VARIANT_PRO`：Pro 订阅 Variant ID
- `LEMON_VARIANT_TEAM`：Team 订阅 Variant ID
- `LEMON_VARIANT_LIFETIME`：买断版 Variant ID
- `LEMON_REDIRECT_URL`（可选）：支付成功回跳地址，不填默认回到 `measure/`
- `LEMON_SQUEEZY_MODE`（可选）：`live` / `test`，不填会按 Key 前缀推断

## 当前发布状态

当前版本适合做 **阶段 1 Web/PWA 公开测试版**：部署到 HTTPS 域名后，可让小范围用户验证实时监测、证据照片、录音录像、地点标注、PDF/CSV 导出和 Pro/Team 权益兴趣。

暂不建议直接正式应用商店上架或收费发布，原因是管理员权限、账号体系、真实订阅支付、平台 IAP、正式隐私协议、真机矩阵、相册/文件原生保存、后台录制能力和审核素材仍未完成。应用内“设置 -> 管理员 -> 发布前自检”会显示当前发布判断和阻塞项；正式上架检查项记录在 `APP_STORE_READINESS.md`。

阶段 1 对外测试前至少确认：

1. 通过 HTTPS 域名访问，不使用普通 HTTP 局域网地址。
2. iPhone Safari、Android Chrome、Windows Edge、macOS Safari/Chrome 均完成一次监测、拍照、录音/录像、保存和导出。
3. 隐私说明清楚告知麦克风、摄像头、定位、录音录像和本地浏览器存储的用途。
4. 所有报告和商店文案都保留“环境记录与证据辅助，正式检测请以经检定声级计复核为准”的边界。

## 权限与缓存逻辑

浏览器的麦克风、摄像头和定位授权由系统按“域名/来源”管理；在 HTTPS、`localhost` 或 `127.0.0.1` 下，用户允许后通常不会每次刷新都重新弹系统授权。但普通 HTTP 局域网 IP、微信内置浏览器、隐私模式、清理站点数据或更换域名，都可能导致权限重新询问。

SOUNDTEST.PRO 自己的首次授权引导会用 `localStorage` 记录在 `sf_permission_guide_v1` 中。用户点击“开始授权”或“稍后”后，刷新页面不会再反复显示这个品牌权限说明；如果浏览器 Permissions API 能查询到麦克风、摄像头或定位已经是 `granted`，也会自动隐藏首次引导。

如果需要重新测试首次授权体验，可以在浏览器开发者工具里清除该站点的 localStorage，或删除 `sf_permission_guide_v1`。

## 当前文件结构

```text
soundfield/
  index.html         # 全球推广网站首页：定位、用例入口、SEO 关键词和 CTA
  measure/           # Web/PWA 工具入口页，跳转到 measure/
  measure/    # 单文件应用：HTML + CSS + JavaScript
  privacy.html       # 全球推广信任页：权限、隐私、本地存储和数据边界
  accuracy.html      # 精度与计量边界说明：非认证测量、设备差异、校准建议
  standards.html     # WHO/美国/欧盟/昼夜噪声参考说明，避免自动合规判定
  samples.html       # 导出样例说明：证据照片、录像、PDF、CSV、manifest、备份
  download.html      # Web/PWA、未来桌面买断版和未来原生 App 分发说明
  monetization.html  # 全球 Web-first 变现方案：Free/Pro/Lifetime、广告、联盟和 B2B
  compliance.html    # 全球隐私、Cookie、录音录像同意、GDPR 风格合规基础
  launch-metrics.html # 阶段 1 全球网站公测转化事件和成功标准
  en/ es/ fr/ de/ ja/ ko/ vi/ th/
    index.html       # 多语言静态入口目录，服务 Google SEO 和本地分享
  POLICY_DRAFTS.md   # 阶段 1 公开测试隐私政策、用户协议和免责声明草案
  BETA_TEST_PLAN.md   # 阶段 1 真机冒烟测试矩阵、脚本和通过标准
  use-cases/
    neighbor-noise-evidence.html
    construction-noise-monitoring.html
    property-noise-complaint-report.html
    workplace-noise-inspection.html
  assets/
    site.css        # 全球推广网站共享视觉样式
    site-content.js # 网站定位、关键词、路由、用例和上线指标内容模型
    layout-flow.css  # 流式布局修复：避免内容被压缩进一屏
    pro-meter.js     # 专业计量辅助函数：A/C 计权、时间计权、Ln 超越声级、1/3 倍频程、脉冲事件检测
    evidence-utils.js # 取证编号、元数据规范化和结构化测点格式化
    storage-utils.js  # 本地存储状态、配额显示和元数据备份辅助函数
  APP_STORE_READINESS.md # 正式应用商店上架所需后端、原生和审核材料清单
  README.md          # 本交接文档
```

`measure/` 内部大致分为四段：

- `<head>`：页面元信息、主题色、移动端 viewport。
- `<style>`：完整 UI 样式、布局、响应式和动画。
- `<body>`：App 壳、主屏、记录页、地图页、设置页、底部导航。
- `<script>`：状态管理、Web Audio、绘图、录制、导出和初始化逻辑。

新增的 `assets/` 文件是方案 B/C 的第一步拆分。后续继续拆分时，优先把内联 CSS/JS 逐步迁移到 `assets/`，每次迁移后保持 `measure/` 可直接运行。

## 页面功能

### 主监测页

- 大字号显示当前声级。
- 顶部显示状态：就绪、监测中、录制中。
- 显示 `dBA/dBC/dBZ` 和快/慢响应。
- 展示 `LAeq`、峰值、最小值、时长、平均值、`L5`、`L10`、`L50`、`L90`、`L95`。
- 支持波形、频谱、1/3 倍频程、趋势四个可视化 tab。
- 支持「录音模式 / 录像模式 / 照片模式」三种证据采集模式，默认进入录音模式。
- 录音模式只请求麦克风，适合长时间低耗电记录声音证据。
- 录像模式会进入全屏水印相机，主按钮会启动麦克风监测，并保存 Canvas 合成后的水印视频与声音证据。
- 照片模式会进入全屏水印相机，主按钮生成带分贝、GPS、地址和设备信息的证据图片。
- 全屏水印相机会叠加当前 dB、`LAeq`、AVG、PEAK、MIN、时间、地点、GPS 和设备/校准摘要。
- 保存后的视频文件本身应包含烧录进去的当前 dB、`LAeq`、AVG、PEAK、MIN、时间、地点、GPS、设备/校准摘要和免责声明；不能只检查 App 预览层。
- 全屏水印相机顶部区分两个状态：圆形红点表示“监测中”，方形红点表示“录制中”，避免把正在监测误认为正在录像。
- 点击“返回”只退出全屏取景器，不强制关闭摄像头；点击“关摄像头”会关闭预览，录像进行中会提示先停止录像。
- 页面内摄像头预览卡片仍保留为备用入口，卡片内部也有“关闭摄像头”按钮，用户不需要回到页头关闭。
- GPS/地址信息位于模式操作区下面，便于录音、录像或拍照后确认位置、手动修正地点或重新识别。
- 支持手动补充楼栋、楼层、房间号和测点名，保存到记录、CSV、PDF 和证据清单中。
- 录制保存时生成唯一取证编号、本地媒体 SHA-256、元数据 SHA-256 和 JSON 证据清单。该哈希用于导出后完整性核对，不等同司法权威时间戳。
- Web 长时监测支持自动停止、事件阈值、手动噪声标记和脉冲峰值标记；锁屏后台 24-72 小时稳定值守仍需原生 App 承接。
- 录像开始前会尽量请求浏览器持久存储；停止后录音/录像先进入“记录”页。若 IndexedDB 持久保存成功，刷新后仍可恢复下载；若手机浏览器没有授予持久存储，本次文件仍会以临时 Blob URL 展示，用户应在刷新或关闭页面前点击“保存视频/保存录音”下载到手机。
- 设置里的管理员“媒体文件与会员保存策略”会显示 IndexedDB、持久化授权、存储已用/配额、记录数量、可恢复媒体和临时媒体数量；支持导出本机备份 JSON。该备份只包含设置和记录元数据，不包含录音/录像 Blob。
- 停止监测时会自动生成本次监测摘要 PNG，包含平均、最高、最低、LAeq、时长和趋势。

### 记录页

- 列出历史录制会话。
- 支持搜索备注或坐标。
- 展示平均分贝、峰值、最小值、录制时长、位置、备注和视频标记。
- 单条记录可导出 PDF。
- 有媒体的记录可下载；文件扩展名根据浏览器实际录制 MIME 类型选择，例如 Chrome 常见 `.webm`，Safari/iOS 可能是 `.mp4`。
- 支持删除单条记录。

### 移动端录像保存逻辑

推荐用户流程：

1. 切换到「录像模式」。
2. App 进入全屏水印相机；允许摄像头权限后，画面会叠加分贝、`LAeq`、时间、地址、GPS 和设备/校准摘要。
3. 点击底部主按钮“开始录像”，允许麦克风和浏览器存储。
4. 点击“停止录像并保存”。
5. 如需回到主页查看数据，点击“返回”；如需关闭摄像头，点击全屏底部“关摄像头”或页面预览卡片里的“关闭摄像头”。
6. 到“记录”页确认新记录，如果看到“临时文件”提示，应立即点击“保存视频”或“保存录音”下载到手机。
7. 打开系统下载位置里的视频文件，确认水印已经烧录进视频画面，而不是只存在于 App 预览层。

技术说明：

- Web 端没有原生 App 那种直接写入相册/文件系统的统一权限。多数浏览器只能先把 `MediaRecorder` 生成的 `Blob` 保存在内存 URL 或 IndexedDB 中，再由用户点击下载。
- SOUNDTEST.PRO 会优先把录制 Blob 写入 IndexedDB；如果失败，仍保留本次页面会话的临时下载入口，避免“停止后没有保存按钮”。
- 关闭摄像头预览不等于保存录像；只有点击录制按钮开始 `MediaRecorder` 后，停止录制才会生成可保存的音频/视频文件。
- 当前 `evidenceMode` 会保存到 `localStorage`，刷新后保持上次选择的录音、录像或照片模式；`watermarkCameraOpen` 只代表当前页面内的全屏取景状态，不跨刷新恢复。

### 手机发烫与长时省电

手机长时间运行时，发热主要来自麦克风实时分析、A 计权频谱计算、Canvas 动画重绘、摄像头预览/录像、GPS 精定位和屏幕常亮锁叠加。尤其是边录像边看实时波形时，浏览器会持续调用音频、视频和 GPU，温升属于预期风险。

当前版本默认开启「长时省电模式」：

- 短时间监测不会再按 60fps 满速刷新，而是限制音频分析和可视化重绘频率。
- 连续监测超过 8 分钟后，会进一步降低分析、动画和摄像头 overlay 更新频率。
- 非录制状态下进入长时省电后会释放屏幕常亮锁，减少屏幕和系统功耗。
- GPS 精校只保留短窗口，避免长时间持续高精度定位。
- 摄像头预览优先请求 720p/24fps 左右的约束，降低视频链路压力。

推荐用户流程：长时间只测分贝时不要一直开摄像头；需要证据时再短时间拍照或录像。连续录像建议分段保存，避免手机高温导致浏览器杀后台、录制中断或临时 Blob 丢失。

### 地图页

- 用 Canvas 绘制带 GPS 的记录点。
- 不是在线地图 SDK，只是根据记录中的经纬度范围做相对坐标投影。
- 下方展示带坐标的会话列表。

### 设置页

- 计权：`A` / `C` / `Z`。
- 响应：快 / 慢。
- 麦克风增益：`micGainDb`，默认 `18 dB`。
- 校准偏移：`calOffset`，范围 `-20 ~ 20 dB`，校准向导可记录参考标准、参考误差和估计误差范围。
- 警报阈值：`alertTh`，默认 `80 dB`。
- 声级警报开关：`alertsOn`。
- 频谱平滑：`smoothing`。
- 数据管理：导出 CSV、导出 PDF、清空记录。

## 核心状态变量

主要状态集中在 `measure/` 的脚本开头：

| 变量 | 说明 |
| --- | --- |
| `LS_KEY` | localStorage key，当前为 `sf_v5` |
| `DB.records` | 历史会话记录数组 |
| `audioCtx` | Web Audio 的 `AudioContext` |
| `analyser` | 时域分析器，用于波形和 RMS |
| `fftAn` | 频域分析器，用于频谱和 A 计权修正 |
| `micStream` | 麦克风流 |
| `camStream` | 摄像头流 |
| `mediaRec` | MediaRecorder 实例 |
| `wakeLock` | 屏幕常亮锁 |
| `isMon` | 是否正在监测 |
| `isRec` | 是否正在录制 |
| `isCam` | 是否启用摄像头 |
| `peak` | 当前会话峰值 |
| `mn` | 当前会话最小值 |
| `dbH` | 当前会话声级样本历史 |
| `trendH` | 趋势图采样历史 |
| `curDb` | 界面当前显示声级 |
| `leqEnergy` / `leqTime` | Leq 能量积分 |
| `curLoc` | 当前 GPS 信息 |
| `calOffset` | 校准偏移 |
| `micGainDb` | 麦克风输入增益 |
| `alertTh` | 告警阈值 |
| `weighting` | `A`、`C` 或 `Z` |
| `timeWeight` | `F` 快响应或 `S` 慢响应 |

## 声级算法流程

核心流程在 `toggleMon()`、`tick()` 和相关计算函数中。

1. 用户点击「开始监测」。
2. `toggleMon()` 调用 `navigator.mediaDevices.getUserMedia()` 获取麦克风。
3. 创建 `AudioContext`、两个 `AnalyserNode` 和一个 `GainNode`。
4. 麦克风流连接到增益节点，再分发给时域分析器和频域分析器。
5. `tick()` 每帧通过 `requestAnimationFrame` 执行。
6. `instantDb()`：
   - 从 `analyser.getFloatTimeDomainData()` 取时域数据。
   - 计算 RMS。
   - 使用 `20 * log10(rms) + splRef() + calOffset` 得到基础 dB。
   - 如果是 A/C 计权，通过 `fftAn.getFloatFrequencyData()` 和频域计权修正估算。
7. `applyMeterBallistics()` 根据 `timeWeight` 做快/慢响应平滑。
8. 更新主数值、统计值、仪表盘、警报、可视化和历史样本。

专业统计说明：

- `LAeq` 使用能量平均。
- `L5` / `L10` / `L50` / `L90` / `L95` 采用超越声级语义：`L10` 表示 10% 时间被超过的声级，`L90` 表示 90% 时间被超过的背景声级。
- A/C 计权、Fast/Slow 时间常数、超越声级、1/3 倍频程和脉冲事件检测辅助函数已抽到 `assets/pro-meter.js`。

当前 `splRef()` 固定返回 `105`，这是经验参考值，不是设备校准结果。生产级升级时应改为设备校准流程或外部校准器导入。

## 记录与导出

录制逻辑：

- `toggleRec()` 启动或停止 `MediaRecorder`。
- 录制轨道包含麦克风音频，以及可选摄像头视频轨道。
- 停止录制后进入 `saveRec()`。
- `saveRec()` 创建 blob URL，并把会话写入 `DB.records`。

记录字段大致包括：

| 字段 | 说明 |
| --- | --- |
| `id` | 时间戳 ID |
| `time` | 录制开始时间 |
| `url` | 本次运行内可用的 blob URL |
| `avgDb` | 平均声级 |
| `peakDb` | 峰值 |
| `minDb` | 最小值 |
| `loc` | GPS 坐标和精度 |
| `note` | 用户备注 |
| `hasVid` | 是否包含视频 |
| `dur` | 录制时长 |
| `snap` | 趋势快照数组 |
| `weighting` | 计权类型 |
| `timeWeight` | 快/慢响应 |

导出：

- `exportCSV()`：导出全部记录为 CSV，带 UTF-8 BOM。
- `buildPDF()`：使用 jsPDF 生成报告。
- `exportPDF(id)`：导出单条记录 PDF。
- `exportAllPDF()`：导出全部记录 PDF。

注意：`saveState()` 会把 `url` 去掉后写入 localStorage；新版同时使用 IndexedDB 保存录制 Blob，刷新页面后会尝试自动恢复视频下载链接。若浏览器不支持 IndexedDB、处于隐私模式或存储空间不足，历史元数据仍在，但视频文件可能无法恢复。

## 数据持久化

使用 `localStorage`，key 为：

```js
const LS_KEY = 'sf_v5';
```

保存内容包括：

- 设置项：`calOffset`、`micGainDb`、`alertTh`、`alertsOn`、`smoothing`、`curViz`、`weighting`、`timeWeight`
- 历史记录：`DB.records`

如果修改记录结构，建议同步升级 `LS_KEY`，例如 `sf_v6`，避免旧数据反序列化异常。

## 外部依赖

页面只通过 CDN 引入了一个外部库：

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
```

用途：生成 PDF 报告。

如果要离线部署，需要把 jsPDF 下载到本地并改为相对路径引用。

## 浏览器权限与兼容性

需要的浏览器能力：

- `navigator.mediaDevices.getUserMedia`：麦克风、摄像头。
- `AudioContext` / `webkitAudioContext`：实时音频分析。
- `MediaRecorder`：录制 WebM。
- `navigator.geolocation`：GPS 定位。
- `navigator.wakeLock`：屏幕常亮，可用则启用，不可用不阻断。
- `localStorage`：保存设置和记录。
- Canvas 2D：绘制波形、频谱、趋势和地图。

权限注意：

- 麦克风、摄像头和定位通常要求 `localhost` 或 HTTPS。
- iOS Safari 对 `MediaRecorder`、WebM、后台运行、自动播放限制较多，需要真机验证。
- 微信/部分内置浏览器可能限制麦克风、定位或下载。

## 常见排错

### 点击开始后提示麦克风权限被拒绝

- 确认使用 `localhost` 或 HTTPS 打开。
- 检查浏览器地址栏麦克风权限。
- 检查系统隐私设置是否允许浏览器访问麦克风。

### 分贝读数明显偏高或偏低

- 在设置里调节「麦克风增益」和「校准偏移」。
- 换设备后需要重新校准。
- 当前算法不是专业校准链路，设备差异属于预期问题。

### 无法定位

- 确认页面运行在 `localhost` 或 HTTPS。
- 确认浏览器定位权限已允许。
- Windows 台式机或无 GPS 设备可能只能获得粗略定位或失败。

### 录制没有视频

- 先点击摄像头按钮启用摄像头，再开始录制。
- 如果摄像头权限失败，录制会只包含音频。

### 刷新后视频下载按钮没了

- 新版会优先使用 IndexedDB 持久化录制 Blob，并在页面初始化时恢复下载链接。
- 如果浏览器禁用 IndexedDB、隐私模式清理存储或空间不足，视频仍可能无法恢复；正式产品可进一步接入 File System Access API 或后端上传。

## 建议的下一步开发顺序

1. **继续拆分单文件**：已新增 `assets/layout-flow.css` 和 `assets/pro-meter.js`；下一步可继续拆出 `audio.js`、`storage.js`、`export.js`、`visualization.js`。
2. **改进数据存储**：当前已用 IndexedDB 保存录音 Blob，并补充存储健康状态、File System Access 保存路径和元数据备份导出；下一步可做备份导入、媒体批量打包导出和存储低水位提醒。
3. **完善校准流程**：增加校准向导，记录校准时间、参考声级、设备信息。
4. **增强声学可信度**：将 A 计权从近似频域修正升级为标准滤波链路，明确采样率和窗口。
5. **PDF 中文字体**：当前 jsPDF 默认字体对中文支持有限，正式导出中文报告需嵌入中文字体或使用 HTML 转 PDF 方案。
6. **安全和隐私**：增加显式隐私说明，解释音频/视频仅本地处理。
7. **移动端验证**：重点测试 iOS Safari、Android Chrome、微信内置浏览器。
8. **自动化检查**：引入 ESLint/Prettier，减少单文件维护风险。

## 维护约定

- 保持 `measure/` 可直接运行，不引入必须构建的工具链，除非明确迁移为正式项目。
- 新增状态字段时同步更新 `saveState()` 和 `loadState()`。
- 修改 DOM id 时同步检查所有 `document.getElementById()` 调用。
- 修改记录结构时同步更新 `renderRecs()`、`drawMap()`、`exportCSV()` 和 `buildPDF()`。
- 面向用户的计量文案必须保守，避免暗示具备法定取证或专业认证能力。
