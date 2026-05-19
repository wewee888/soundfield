from pathlib import Path

p = Path(__file__).resolve().parents[1] / "soundtest.html"
t = p.read_text(encoding="utf-8")

broken = """  <motion class="panel" id="p-r">
        <div class="promo-desc">分享应用入口或当前报告摘要；默认不分享精确坐标，保护用户隐私。</div>
      </div>
      <button class="btn b-cyan" onclick="shareAppReferral()">推荐分享</button>
    </div>
    <div class="tool-card layout-record-tools" id="recordToolsCard">"""

broken = broken.replace("<motion ", "<div ")

fixed = """  <div class="panel" id="p-r">
    <div class="tool-card layout-record-tools" id="recordToolsCard">"""

if broken not in t:
    raise SystemExit("broken block not found")
t = t.replace(broken, fixed, 1)
p.write_text(t, encoding="utf-8")
print("fixed")
