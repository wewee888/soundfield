"""Final public URLs for soundtest.pro.

Cloudflare Pages serves `foo.html` at `/foo` (no trailing slash) and
308-redirects `/foo/` and `/foo.html` there. Directory indexes
(`index.html`) stay on the trailing-slash URL: `/de/` returns 200 and
`/de` 308s back to `/de/`. Canonicals, hreflang, and the sitemap must use
the URL that returns 200.
"""

from __future__ import annotations

from pathlib import Path

LANGS = ["en", "zh", "es", "fr", "de", "ja", "ko", "vi", "th"]

SKIP_DIRS = {
    "test-results",
    "_temp",
    "scripts",
    "functions",
    "assets",
    "public",
    "a",
    "b",
    "c",
    ".git",
    ".wrangler",
    ".github",
    ".claude",
    "tests",
}

# Pages that must not be submitted in sitemap.xml. They stay reachable.
SITEMAP_EXCLUDE = {
    "auth.html",
    "launch-metrics.html",
    "monetization.html",
    "refund.html",
    "changelog.html",
    "camera.html",
    "stats.html",
    "admin.html",
    "app.html",
    "404.html",
}

# Clean path for a doc html file, without a trailing slash.
# compliance.html is a redirect to the terms page.
DOC_FINAL = {
    "app.html": "/soundtest",
    "soundtest.html": "/soundtest",
    "samples.html": "/samples",
    "accuracy.html": "/accuracy",
    "auth.html": "/auth",
    "about.html": "/about",
    "terms.html": "/terms",
    "compliance.html": "/terms",
    "download.html": "/download",
    "launch-metrics.html": "/launch-metrics",
    "monetization.html": "/monetization",
    "standards.html": "/standards",
    "changelog.html": "/changelog",
    "disclaimer.html": "/disclaimer",
    "privacy.html": "/privacy",
    "refund.html": "/refund",
    "noise-levels.html": "/noise-levels",
    "camera.html": "/camera",
    "stats.html": "/stats",
    "admin.html": "/admin",
    "online-decibel-meter.html": "/online-decibel-meter",
    "how-loud-is-30-db.html": "/how-loud-is-30-db",
    "how-loud-is-40-db.html": "/how-loud-is-40-db",
    "how-loud-is-50-db.html": "/how-loud-is-50-db",
    "how-loud-is-60-db.html": "/how-loud-is-60-db",
    "how-loud-is-70-db.html": "/how-loud-is-70-db",
    "how-loud-is-80-db.html": "/how-loud-is-80-db",
    "how-loud-is-90-db.html": "/how-loud-is-90-db",
    "how-loud-is-100-db.html": "/how-loud-is-100-db",
    "how-loud-is-110-db.html": "/how-loud-is-110-db",
    "gb-3096-2008.html": "/gb-3096-2008",
}


def is_skipped_rel(rel: str) -> bool:
    return bool(set(rel.split("/")) & SKIP_DIRS)


def final_public_path(rel: str) -> str | None:
    """Map a repo-relative html path to the URL path that returns 200."""
    if is_skipped_rel(rel) or not rel.endswith(".html"):
        return None

    parts = rel.split("/")
    fname = parts[-1]
    dirs = parts[:-1]

    if fname == "index.html":
        if not dirs:
            return "/"
        return "/" + "/".join(dirs) + "/"

    if fname == "compliance.html":
        if dirs and dirs[0] in LANGS and len(dirs) == 1:
            return f"/{dirs[0]}/terms"
        if not dirs:
            return "/terms"

    if fname in DOC_FINAL and (not dirs or (len(dirs) == 1 and dirs[0] in LANGS)):
        final = DOC_FINAL[fname]
        if dirs:
            return f"/{dirs[0]}{final}"
        return final

    if dirs and dirs[0] == "use-cases":
        stem = fname[: -len(".html")]
        if stem == "index":
            return "/" + "/".join(dirs) + "/"
        return "/" + "/".join(dirs + [stem])

    stem = fname[: -len(".html")]
    if not dirs:
        return f"/{stem}"
    return "/" + "/".join(dirs + [stem])


def logical_sitemap_key(rel: str) -> tuple[str | None, str | None]:
    """Return (language-agnostic path, lang) for sitemap inclusion.

    lang is None for the x-default / unprefixed file. Returns (None, None)
    when the file must not be listed.
    """
    if is_skipped_rel(rel) or not rel.endswith(".html"):
        return None, None

    parts = rel.split("/")
    fname = parts[-1]
    if fname in SITEMAP_EXCLUDE:
        return None, None

    dirs = parts[:-1]
    lang: str | None = None
    if dirs and dirs[0] in LANGS:
        lang = dirs[0]
        dirs = dirs[1:]

    if fname == "index.html":
        if dirs and dirs[0] == "use-cases":
            if len(dirs) > 1 and dirs[1] in LANGS:
                lang = dirs[1]
            return "/use-cases/", lang
        if dirs:
            return None, None
        return "/", lang

    if dirs and dirs[0] == "use-cases":
        stem = fname[: -len(".html")]
        if len(dirs) > 1 and dirs[1] in LANGS:
            lang = dirs[1]
        return f"/use-cases/{stem}", lang

    if fname not in DOC_FINAL or fname == "compliance.html":
        return None, None
    if dirs:
        return None, None
    return DOC_FINAL[fname], lang


def sibling_path(logical_key: str, lang: str) -> str:
    """Absolute path (no domain) for one language of a logical page."""
    if lang == "x-default":
        return logical_key
    if logical_key == "/":
        return f"/{lang}/"
    if logical_key == "/use-cases/":
        if lang == "en":
            return "/use-cases/"
        return f"/use-cases/{lang}/"
    if logical_key.startswith("/use-cases/"):
        tail = logical_key[len("/use-cases/") :]
        if lang == "en":
            return f"/use-cases/{tail}"
        return f"/use-cases/{lang}/{tail}"
    return f"/{lang}{logical_key}"


def _register(aliases: dict[str, str], source: str, final: str) -> None:
    if not source or not final:
        return
    aliases[source] = final
    if source != "/" and source.endswith("/"):
        aliases.setdefault(source.rstrip("/"), final)
    elif source != "/":
        aliases.setdefault(source + "/", final)
        if not source.endswith(".html"):
            aliases.setdefault(source + ".html", final)


def build_alias_map(root: Path) -> dict[str, str]:
    """Map redirecting path variants onto the path that returns 200."""
    aliases: dict[str, str] = {}
    for dirpath, dirnames, filenames in __import__("os").walk(root):
        full = Path(dirpath)
        rel_dir = full.relative_to(root).as_posix()
        if rel_dir == ".":
            rel_dir = ""
        if rel_dir and is_skipped_rel(rel_dir):
            dirnames[:] = []
            continue
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            if not fn.endswith(".html"):
                continue
            rel = f"{rel_dir}/{fn}" if rel_dir else fn
            final = final_public_path(rel)
            if not final:
                continue
            _register(aliases, final, final)
            # The on-disk pretty URL, which may itself redirect (compliance).
            parts = rel.split("/")
            fname = parts[-1]
            dirs = parts[:-1]
            if fname == "index.html":
                pretty = "/" if not dirs else "/" + "/".join(dirs) + "/"
            else:
                stem = fname[: -len(".html")]
                pretty = "/" + "/".join(dirs + [stem]) if dirs else f"/{stem}"
            _register(aliases, pretty, final)
            if not fname.endswith("index.html"):
                html_path = "/" + "/".join(dirs + [fname]) if dirs else f"/{fname}"
                _register(aliases, html_path, final)
    # Explicit redirect sources from _redirects that have no html of that name.
    _register(aliases, "/app", "/soundtest")
    _register(aliases, "/compliance", "/terms")
    for lang in LANGS:
        _register(aliases, f"/{lang}/compliance", f"/{lang}/terms")
        _register(aliases, f"/{lang}/app", f"/{lang}/soundtest")
    return aliases


def normalize_absolute_url(url: str, aliases: dict[str, str]) -> str:
    """Rewrite a soundtest.pro URL to the 200 path. Leave other URLs alone."""
    for prefix in ("https://soundtest.pro", "http://soundtest.pro", "https://www.soundtest.pro", "http://www.soundtest.pro"):
        if url.startswith(prefix):
            rest = url[len(prefix) :]
            break
    else:
        return url

    path, sep, tail = rest.partition("?")
    if sep:
        query, hash_sep, fragment = tail.partition("#")
        suffix = "?" + query + (("#" + fragment) if hash_sep else "")
    else:
        path, hash_sep, fragment = path.partition("#")
        suffix = ("#" + fragment) if hash_sep else ""

    if path == "":
        path = "/"
    final = aliases.get(path)
    if final is None:
        return url if url.startswith("https://soundtest.pro") else "https://soundtest.pro" + path + suffix
    return "https://soundtest.pro" + final + suffix
