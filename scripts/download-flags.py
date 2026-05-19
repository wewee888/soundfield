"""Download locale flag PNGs into assets/flags/ for offline / Cloudflare Pages deploy."""
from pathlib import Path
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "flags"
FLAGS = ("us", "cn", "es", "fr", "de", "jp", "kr", "vn", "th")
SOURCES = [
    "https://flagcdn.com/w40/{iso}.png",
    "https://flagcdn.com/h20/{iso}.png",
    "https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.13/3x2/{iso}.png",
]

UA = (
    "Mozilla/5.0 (compatible; SOUNDTEST.PRO/1.0; +https://soundtest.pro) "
    "Python-urllib"
)


def is_png(data: bytes) -> bool:
    return len(data) > 24 and data[:8] == b"\x89PNG\r\n\x1a\n"


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "image/png,*/*"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read()


def download_one(iso: str) -> None:
    dest = OUT / f"{iso}.png"
    last_err = None
    for template in SOURCES:
        url = template.format(iso=iso)
        try:
            data = fetch(url)
            if not is_png(data):
                raise ValueError(f"not a PNG ({len(data)} bytes)")
            dest.write_bytes(data)
            print(f"ok {iso}: {len(data)} bytes <- {url}")
            return
        except (urllib.error.URLError, ValueError, OSError) as err:
            last_err = err
            print(f"skip {iso} {url}: {err}")
    raise SystemExit(f"failed {iso}: {last_err}")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for iso in FLAGS:
        download_one(iso)
    print(f"done: {len(FLAGS)} flags in {OUT}")


if __name__ == "__main__":
    main()
