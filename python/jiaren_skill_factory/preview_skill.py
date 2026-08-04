"""Locate or generate a post-training preview through AI-Toolkit.

AI-Toolkit already creates samples at checkpoint intervals.  Reusing the
latest sample is deterministic and avoids loading the base model twice.  The
script returns a machine-readable result for the Electron scheduler.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path


PREVIEW_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".mp4", ".mov"}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True)
    parser.add_argument("--weight", required=True)
    parser.add_argument("--trigger", required=True)
    parser.add_argument("--type", choices=["image", "video"], required=True)
    args = parser.parse_args()

    output = Path(args.output).resolve()
    weight = Path(args.weight).resolve()
    if not output.is_absolute() or not weight.is_absolute() or not weight.is_file():
        raise ValueError("absolute existing output and weight paths are required")

    candidates = sorted(
        (path for path in output.rglob("*") if path.is_file() and path.suffix.lower() in PREVIEW_EXTENSIONS),
        key=lambda path: path.stat().st_mtime,
        reverse=True,
    )
    preview = candidates[0] if candidates else None
    prompt = (
        f"{args.trigger}, consistent style same as reference material, smooth motion, medium shot, 4k high detail"
        if args.type == "video"
        else f"{args.trigger}, clean scene, consistent aesthetic, sharp details"
    )
    result = {
        "ok": preview is not None,
        "previewPath": str(preview) if preview else None,
        "weightPath": str(weight),
        "prompt": prompt,
        "negativePrompt": "blurry, distorted, broken motion, low resolution, ugly, inconsistent character",
        "message": "latest AI-Toolkit training sample selected" if preview else "training completed without a sample preview",
    }
    print(json.dumps(result, ensure_ascii=False), flush=True)


if __name__ == "__main__":
    main()

