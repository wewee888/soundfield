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

### 2026-09-05 一次性修复

| Commit | 内容 |
|---|---|
| `c43b145` | 重写 sitemap.xml：22 个 `<url>` 节点，每个含 x-default + 9 语言 hreflang，URL 用 clean URL（与 `_redirects` 目标一致） |
| `15023e2` | 195 个 HTML 页面的 canonical 修复，每页指向自己的语言版 clean URL |

辅助脚本（可重复运行）：

- `scripts/generate-sitemap.py`：扫仓库、套 `_redirects` 规则，重新生成 `sitemap.xml`。
- `scripts/fix-canonical.py`：批量修复/补全所有 HTML 的 `<link rel="canonical">`。

### 部署方式变更

- **废弃**：`.github/workflows/deploy.yml`（GitHub Actions 部署，因缺 API token 一直失败）。
- **改用**：Cloudflare Pages 直接 Git 集成（在 CF Dashboard → soundtest-pro → 设置 → 连接 GitHub → 选 wewee888/soundfield → 框架预设"无" → 构建命令留空 → 输出目录 `.`）。每次 push `main` 自动部署。

## 维护操作手册

### 何时重新跑脚本

| 触发条件 | 操作 |
|---|---|
| 新增语言子目录（如新增 `pt/`） | 在 `scripts/generate-sitemap.py` 的 `LANGS` 加 `"pt"`，跑两个脚本 |
| 新增 doc 页面（如 `guide.html`）且 `_redirects` 有规则 | 在 `scripts/generate-sitemap.py` 和 `fix-canonical.py` 的 `HTML_TO_CANONICAL` 加映射，跑两个脚本 |
| 新增 use-case 页面 | 只需 `python scripts/generate-sitemap.py`（use-cases 自动识别） |
| 新增语言版本但页面结构不变 | 只需 `python scripts/fix-canonical.py`（按目录自动推断 lang） |

新页面落地的完整流程：
```bash
# 1. 编辑 HTML
# 2. 如果是新的 doc 类型 + 新的 _redirects 规则，更新两个脚本的 HTML_TO_CANONICAL
# 3. 重生成 sitemap + 修 canonical
python scripts/generate-sitemap.py
python scripts/fix-canonical.py
# 4. 提交
git add -A
git commit -m "feat(content): add <page>"
git push origin main
# 5. CF Pages 自动部署（通常 30-90 秒）
# 6. 验证
curl -s https://soundtest.pro/sitemap.xml | grep -c "xhtml:link"   # 应 >= 100
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

**周节奏**（建议每周一看一眼）：
- GSC → 网页 → 索引覆盖率。重点关注：
  - "备用网页"数字**应持续下降**（如果还在涨，说明 hreflang/canonical 出错）
  - "已编入索引"数字**应持续上升**
- GSC → 站点地图 → 状态应保持 "成功"，提取 URL 数 = sitemap 节点数 × 语言变体数

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
