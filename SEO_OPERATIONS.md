# SOUNDTEST.PRO SEO 运维记录

本文档记录 soundtest.pro 的索引健康状况、修复历史与后续运维动作。Google Search Console（GSC）位于 https://search.google.com/search-console/index?resource_id=sc-domain%3Asoundtest.pro。

## 索引健康基线（2026-09-05 审计）

| 维度 | 数值 | 含义 |
|---|---|---|
| 已编入索引 | **0** | 一个页面都没被收 |
| 备用网页（有适当的规范标记） | **378** | 多语言版都指向同一个英文 canonical，被 Google 视为"备用" |
| 网页会自动重定向 | **71** | sitemap 列了 `.html`，`_redirects` 又 302 到 clean URL |
| 已抓取 - 尚未编入索引 | 4 | |
| 重复网页，Google 选择的规范与 sitemap 不同 | 1 | |
| 由于遇到其他 4xx 问题而被屏蔽 | 1 | |

根因诊断：
1. **所有翻译版（en/、zh/、es/、fr/、de/、ja/、ko/、vi/、th/）的 `<link rel="canonical">` 都指向同一个英文根 URL**（例如 `zh/accuracy.html` 的 canonical 是 `https://soundtest.pro/accuracy.html`）。这是 378 个备用网页的真正原因。
2. **sitemap 列了 25 个 URL，使用 `.html` 形式**，但 `_redirects` 又把 `.html` 302 到 clean URL（如 `/samples/`），sitemap 与生产路径不一致，触发"自动重定向"判定。
3. **sitemap 缺少 9 种语言版本中 8 种语言的子页面**（只有英文进了 sitemap）。
4. **CI 部署从 2026-08-22 起就失败**（`.github/workflows/deploy.yml` 缺 `CLOUDFLARE_API_TOKEN`），生产环境实际已 14 天未更新。

## 修复历史

### 2026-09-05 三轮修复 + 内容层

| Commit | 内容 | 解决 GSC 哪个问题 / 哪个 SEO 维度 |
|---|---|---|
| `c43b145` | 重写 sitemap.xml：22 个 `<url>` 节点，每个含 x-default + 9 语言 hreflang，URL 用 clean URL | 71 个"自动重定向" |
| `15023e2` | 195 个 HTML 页面的 canonical 修复，每页指向自己的语言版 clean URL | 1 个"重复 canonical" |
| `db1548c` | **174 个翻译子页面补全 hreflang 注解** + use-cases 路径 canonical 修正 | 378 个"备用网页"（这一项是 GSC 数字不掉的主因）|
| `c680d52` | 6 个英文 use-case 页加 FAQPage schema + 可见 FAQ section，24 条 Q&A | 长尾关键词命中（"邻居噪音能否报警"、"多少分贝算扰民"） |
| `8504667` | 新建 `/noise-levels/` 页（30 行 dB 参考表 + FAQPage + ItemList schema），206 个 footer 加链接，sitemap 加项 | Featured Snippet 抢占（"how many dB is X"） |

辅助脚本（可重复运行）：

- `scripts/generate-sitemap.py`：扫仓库、套 `_redirects` 规则，重新生成 `sitemap.xml`。**新增 doc 类型时必须在 HTML_TO_CANONICAL 加映射**。
- `scripts/fix-canonical.py`：仅修复 canonical（已被 `fix-hreflang-and-canonical.py` 取代，保留作历史参考）。
- `scripts/fix-hreflang-and-canonical.py`：**生产用的脚本**，同时修 canonical + 加 hreflang 注解。
- `scripts/add-faq-section.py`：从 `scripts/content/use-case-faqs.json` 读问答，注入可见 FAQ section + JSON-LD schema。
- `scripts/add-footer-link.py`：把给定链接加进 footer Resources 段，幂等。
- `scripts/content/use-case-faqs.json`：6 use-case × 4 Q&A 的 source-of-truth；扩 FAQ 时改这里然后重跑 `add-faq-section.py`。

### 重要教训（已写入脚本注释）

1. **Google 主要看 HTML head 里的 hreflang，不是 sitemap 里的**。第一轮只修了 sitemap hreflang，HTML 里的 hreflang 是 0，结果 GSC 备用网页数字纹丝不动。
2. **CF Pages 的 URL 路由**：文件路径 `use-cases/zh/foo.html` 对应的可访问 URL 是 `/use-cases/zh/foo/`，**不是** `/zh/use-cases/foo/`。前者在文件系统里有对应路径，后者在 CF Pages 会 fallthrough 到首页（但因为不在 sitemap 也不被链接，实际无害）。
3. **`next(iter(dict.values()))` 取第一个值**在 Python 3.7+ 是插入顺序，第一次写脚本时没注意，导致 canonical 全部指向遍历顺序里第一个语言（`de/`），所有翻译页的 canonical 全错。第二轮修复时改为按 `lang` key 显式取值。

### 部署方式变更

- **废弃**：`.github/workflows/deploy.yml`（GitHub Actions 部署，因缺 API token 一直失败）。
- **改用**：Cloudflare Pages 直接 Git 集成（在 CF Dashboard → soundtest-pro → 设置 → 连接 GitHub → 选 wewee888/soundfield → 框架预设"无" → 构建命令留空 → 输出目录 `.`）。每次 push `main` 自动部署。

## 维护操作手册

### 何时重新跑脚本

| 触发条件 | 操作 |
|---|---|
| 新增语言子目录（如新增 `pt/`） | 在两个脚本的 `LANGS` 加 `"pt"`，跑两个脚本 |
| 新增 doc 页面（如 `guide.html`）且 `_redirects` 有规则 | 在两个脚本的 `HTML_TO_CANONICAL` 加映射，跑两个脚本 |
| 新增 use-case 页面 | 只需 `python scripts/generate-sitemap.py`（use-cases 自动识别） |
| 新增语言版本但页面结构不变 | 只需 `python scripts/fix-hreflang-and-canonical.py` |

新页面落地的完整流程：
```bash
# 1. 编辑 HTML
# 2. 如果是新的 doc 类型 + 新的 _redirects 规则，更新两个脚本的 HTML_TO_CANONICAL
# 3. 重生成 sitemap + 修 canonical + 加 hreflang
python scripts/generate-sitemap.py
python scripts/fix-hreflang-and-canonical.py
# 4. (可选) 加 FAQ: 在 scripts/content/use-case-faqs.json 加问答，再跑 add-faq-section.py --lang en
# 5. (可选) 加 footer 链接: python scripts/add-footer-link.py
# 6. 提交
git add -A
git commit -m "feat(content): add <page>"
git push origin main
# 7. CF Pages 自动部署（通常 30-90 秒）
# 8. 验证：sitemap 有 xhtml:link，翻译页 head 有 hreflang，新页 FAQPage schema 在
curl -s https://soundtest.pro/sitemap.xml | grep -c "xhtml:link"        # 应 >= 220
curl -sL "https://soundtest.pro/zh/accuracy/" | grep -c 'rel="alternate" hreflang='   # 应 = 10
curl -sL "https://soundtest.pro/<new-page>/" | grep -c "FAQPage"         # 应 = 1 (如果加了 FAQ)
```

### 每次发版后 1-2 小时验证

```bash
# sitemap 是新版本（应有 xhtml:link 注解）
curl -s "https://soundtest.pro/sitemap.xml?cb=$RANDOM" | grep -c "xhtml:link"

# 抽查一个翻译页的 canonical 是否指向自己
curl -sL "https://soundtest.pro/zh/accuracy/" | grep -o '<link rel="canonical"[^>]*>'
# 期望: <link rel="canonical" href="https://soundtest.pro/zh/accuracy/">
```

### GSC 提交与监控节奏

**首次提交（已完成 2026-09-05）**：
1. GSC → 站点地图 → 输入 `https://soundtest.pro/sitemap.xml` → 提交
2. GSC → 网址检查 → 输入 `https://soundtest.pro/` → 请求编入索引
3. GSC → 网页 → 每条"网页未被编入索引的原因"右侧点"**验证**"按钮 → "已开始"

**Featured Snippet 监控**（新增）：
- GSC → 效果 → 搜索结果 → 过滤 URL 包含 `/noise-levels/`，看展示次数与点击
- Google 搜索 `how many decibels is a vacuum cleaner`、`70 dB sound example`、`噪音等级对照` —— 看 `/noise-levels/` 是否在 #0 位
- 不在也别慌 —— Featured Snippet 是渐进的，2-4 周才会稳定

**FAQ rich result 监控**（新增）：
- 打开 https://search.google.com/test/rich-results，输入 use-case 页面 URL
- 期望检测到 `FAQPage` 类型且无错误
- 注意：Google 自 2023 年 8 月起大幅限制 FAQ rich result 在 SERP 中的显示（仅政府和权威站点），所以**看到 FAQ 标记命中但不显示在 SERP 也属正常**

**周节奏**（建议每周一看一眼）：
- GSC → 网页 → 索引覆盖率。重点关注：
  - "备用网页"数字**应持续下降**（如果还在涨，说明 hreflang/canonical 出错，需要重跑 `scripts/fix-hreflang-and-canonical.py`）
  - "已编入索引"数字**应持续上升**
- GSC → 站点地图 → 状态应保持 "成功"，提取 URL 数 = 23（22 旧 + `/noise-levels/`）
- GSC → 效果 → 哪些查询开始带来展示？长尾关键词（如 "邻居噪音记录"、"施工噪音投诉"、"vacuum cleaner dB"）出现 = 内容层见效

**重要**：GSC 显示"已开始"不等于"完成"，只是触发重新评估。验证完成要等 1-7 天，URL 重新抓取另要 1-3 天，所以 GSC 数字变化有 **2-14 天延迟**是正常的。

**季度节奏**：
- GSC → 链接 → 外链数（domain authority 信号）
- GSC → 效果 → 搜索查询（看哪些关键词开始带来展示/点击）
- 更新 `MONETIZATION_AND_DISTRIBUTION.md` 里的关键词清单（基于实际搜索表现）

### 预期时间线（修复后）

| 时间 | 应看到的变化 |
|---|---|
| 提交 sitemap 后几分钟 | "站点地图" 状态从 "暂时无法提取" → "成功" |
| 1-3 天 | 备用网页数字开始下降 |
| 1-2 周 | 已编入索引数字开始上涨（先慢后快） |
| 2-4 周 | 71 个重定向 + 1 个重复 canonical 应清零 |
| 4-8 周 | 378 个备用网页大部分被重新评估并索引 |

## 已知遗留问题

1. **根 URL `/` 的 canonical 是 `/a/`**（A/B 测试变体页）。这是 _redirects 配置的设计选择，不是 bug。如果未来想统一 canonical 到 `/`，需要修改 `functions/_middleware.js` 的 A/B 分流逻辑。
2. **`use-cases/en/index.html` 不存在**（其他 8 种语言都有）。sitemap 里 `/use-cases/` 的 hreflang 会自动跳过 en。如要补全，在 `use-cases/en/` 加一个 index.html。
3. **`launch-metrics.html`、`monetization.html`、`soundtest.html`、`stats.html`** 在 9 种语言中都没有对应的英文版之外的翻译。sitemap 同样会自动跳过。

## 应急回滚

如果新 sitemap/canonical 引发的副作用比修复更大：

```bash
# 1. 找出问题提交
git log --oneline -5
# 2. 回滚到上一个稳定 commit
git revert <bad-commit-sha>
git push origin main
# 3. CF Pages 自动部署旧版本
# 4. 在 GSC 里"重新抓取"受影响页面
```

不要直接 `git reset --hard` 后强推——会破坏团队协作历史。
