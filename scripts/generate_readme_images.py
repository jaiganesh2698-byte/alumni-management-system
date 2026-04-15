#!/usr/bin/env python3
"""Render sample SQLite CLI output as a PNG for README and faculty submission."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
DB = ROOT / "alumni.db"
OUT = ROOT / "docs" / "images" / "db-01-v_alumni_directory.png"


def _mono_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for path in (
        "/System/Library/Fonts/Supplemental/Menlo.ttc",
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
        "C:\\Windows\\Fonts\\consola.ttf",
    ):
        p = Path(path)
        if p.exists():
            try:
                return ImageFont.truetype(str(p), size, index=0)
            except OSError:
                continue
    return ImageFont.load_default()


def main() -> int:
    if not DB.exists():
        print("Run ./run.sh first to create alumni.db", file=sys.stderr)
        return 1

    header_lines = [
        "$ cd alumni-management-system && ./run.sh",
        '$ sqlite3 alumni.db -header -column "SELECT * FROM v_alumni_directory;"',
        "",
    ]
    proc = subprocess.run(
        ["sqlite3", str(DB), "-header", "-column", "SELECT * FROM v_alumni_directory;"],
        capture_output=True,
        text=True,
        check=True,
    )
    body = proc.stdout.rstrip()
    lines = header_lines + (body.splitlines() if body else ["(no rows)"])

    font = _mono_font(14)
    padding = 24
    line_h = 18
    w = 920
    h = padding * 2 + line_h * len(lines) + 8

    img = Image.new("RGB", (w, h), (28, 25, 23))
    draw = ImageDraw.Draw(img)
    y = padding
    for i, line in enumerate(lines):
        color = (209, 213, 219) if i < 3 else (243, 244, 246)
        draw.text((padding, y), line, font=font, fill=color)
        y += line_h

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, "PNG")
    print(f"Wrote {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
