"""Prepare a small local image/video dataset for AI-Toolkit.

Videos are sampled with ffmpeg.  When OpenCV is available in the configured
training environment, black and blurry frames are removed using deterministic
thresholds.  Without OpenCV, ffmpeg's ``mpdecimate`` still removes duplicate
or near-static frames and the job remains usable offline.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
from pathlib import Path


IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}
VIDEO_EXTENSIONS = {".mp4", ".mov", ".webm", ".avi", ".mkv"}


def emit(progress: int, message: str) -> None:
    print(f"JIAREN_PROGRESS {max(0, min(100, progress))} {message}", flush=True)


def safe_path(value: str, name: str) -> Path:
    path = Path(value).expanduser().resolve()
    if not path.is_absolute():
        raise ValueError(f"{name} must be absolute")
    if any(ord(char) > 127 for char in str(path)) or re.search(r"\s", str(path)):
        raise ValueError(f"{name} cannot contain spaces or non-ASCII characters: {path}")
    return path


def ffmpeg_path() -> str:
    configured = os.environ.get("JIAREN_FFMPEG", "").strip()
    candidate = configured if configured and Path(configured).is_file() else shutil.which("ffmpeg")
    if not candidate:
        raise RuntimeError("ffmpeg was not found; configure JIAREN_FFMPEG or add ffmpeg to PATH")
    return candidate


def clean_frames(frame_paths: list[Path]) -> tuple[list[Path], str]:
    try:
        import cv2  # type: ignore
    except ImportError:
        return frame_paths, "OpenCV unavailable; ffmpeg duplicate-frame cleaning used"

    kept: list[Path] = []
    for frame in frame_paths:
        image = cv2.imread(str(frame))
        if image is None:
            frame.unlink(missing_ok=True)
            continue
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        black_ratio = float((gray < 18).mean())
        sharpness = float(cv2.Laplacian(gray, cv2.CV_64F).var())
        if black_ratio > 0.88 or sharpness < 32.0:
            frame.unlink(missing_ok=True)
            continue
        kept.append(frame)
    return kept, "OpenCV black/blur cleaning applied"


def write_caption(media_path: Path, trigger: str, caption: str) -> None:
    content = ", ".join(part for part in (trigger.strip(), caption.strip()) if part)
    media_path.with_suffix(".txt").write_text(content, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--inputs-json", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--type", choices=["image", "video"], required=True)
    parser.add_argument("--trigger", required=True)
    parser.add_argument("--caption", default="")
    args = parser.parse_args()

    output = safe_path(args.output, "output")
    raw_inputs = json.loads(Path(args.inputs_json).read_text(encoding="utf-8"))
    if not isinstance(raw_inputs, list) or not 3 <= len(raw_inputs) <= 5:
        raise ValueError("exactly 3-5 input files are required")
    inputs = [safe_path(str(value), "input") for value in raw_inputs]
    if not all(path.is_file() for path in inputs):
        raise FileNotFoundError("one or more training files no longer exist")

    output.mkdir(parents=True, exist_ok=True)
    (output / "caption.txt").write_text(
        ", ".join(part for part in (args.trigger.strip(), args.caption.strip()) if part),
        encoding="utf-8",
    )
    emit(3, "dataset directory ready")

    created: list[Path] = []
    ffmpeg = None
    for index, source in enumerate(inputs):
        extension = source.suffix.lower()
        if extension in IMAGE_EXTENSIONS:
            target = output / f"source_{index + 1:02d}{extension}"
            shutil.copy2(source, target)
            write_caption(target, args.trigger, args.caption)
            created.append(target)
        elif extension in VIDEO_EXTENSIONS and args.type == "video":
            ffmpeg = ffmpeg or ffmpeg_path()
            pattern = output / f"clip_{index + 1:02d}_%04d.jpg"
            command = [
                ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-i", str(source),
                "-vf", "fps=1/2,mpdecimate,scale='min(960,iw)':-2", "-q:v", "2", str(pattern),
            ]
            result = subprocess.run(command, capture_output=True, text=True, check=False)
            if result.returncode != 0:
                raise RuntimeError(f"damaged or unsupported video {source.name}: {result.stderr[-800:]}")
            frames = sorted(output.glob(f"clip_{index + 1:02d}_*.jpg"))
            frames, clean_message = clean_frames(frames)
            if not frames:
                raise RuntimeError(f"all extracted frames were black, blurry, or unreadable: {source.name}")
            for frame in frames:
                write_caption(frame, args.trigger, args.caption)
            created.extend(frames)
            emit(8 + int(((index + 1) / len(inputs)) * 74), clean_message)
        else:
            raise ValueError(f"unsupported file for {args.type} training: {source.name}")
        emit(8 + int(((index + 1) / len(inputs)) * 74), f"prepared {source.name}")

    if len(created) < 3:
        raise RuntimeError("dataset cleaning left fewer than three usable samples")
    emit(100, f"dataset ready with {len(created)} samples")
    print(json.dumps({"ok": True, "sampleCount": len(created), "datasetPath": str(output)}), flush=True)


if __name__ == "__main__":
    main()

