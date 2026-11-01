#!/usr/bin/env python3
"""Build the installable DSH plugin zip with deterministic metadata."""
from __future__ import annotations

import hashlib
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "dist" / "demian-trade-suite-dsh-plugin.zip"
PREFIX = "demian-trade-suite-plugin/"
FILES = [
    "package.json",
    "index.js",
    "client.js",
    "cordis.patch.yml",
    "icon.svg",
    "README.md",
    "LICENSE",
]
DIRS = ["locale", "assets"]
STAMP = (2026, 1, 1, 0, 0, 0)


def add(zf: zipfile.ZipFile, path: Path) -> None:
    info = zipfile.ZipInfo(PREFIX + path.relative_to(ROOT).as_posix(), STAMP)
    info.compress_type = zipfile.ZIP_DEFLATED
    info.external_attr = 0o644 << 16
    zf.writestr(info, path.read_bytes())


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(OUT, "w") as zf:
        for name in FILES:
            add(zf, ROOT / name)
        for directory in DIRS:
            for path in sorted((ROOT / directory).rglob("*")):
                if path.is_file():
                    add(zf, path)
    digest = hashlib.sha256(OUT.read_bytes()).hexdigest()
    print(f"zip   : {OUT} ({OUT.stat().st_size} bytes)")
    print(f"sha256: {digest}")


if __name__ == "__main__":
    main()
