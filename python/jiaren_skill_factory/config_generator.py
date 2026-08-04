"""Generate current Ostris AI-Toolkit LoRA training YAML.

The canvas owns dataset cleaning and caption generation.  This module only
emits fields understood by AI-Toolkit's current ``sd_trainer`` extension.
Keeping this boundary explicit prevents UI-only options from leaking into the
toolkit YAML and breaking training after an upstream update.
"""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass
from pathlib import Path


COMMON_TRIGGER_WORDS = {
    "style", "video", "image", "photo", "movie", "person", "character",
    "scene", "camera", "motion", "quality", "beautiful", "cinematic",
}


def yaml_string(value: str) -> str:
    """JSON quoting is valid YAML and safely escapes Windows backslashes."""

    return json.dumps(value, ensure_ascii=False)


def validate_ascii_absolute_path(value: str, field_name: str) -> str:
    path = Path(value).expanduser()
    if not path.is_absolute():
        raise ValueError(f"{field_name} must be an absolute path")
    normalized = str(path.resolve())
    if any(ord(char) > 127 for char in normalized) or re.search(r"\s", normalized):
        raise ValueError(f"{field_name} cannot contain spaces or non-ASCII characters: {normalized}")
    return normalized


def validate_trigger_word(value: str) -> str:
    trigger = value.strip().lower()
    if not re.fullmatch(r"[a-z][a-z0-9_]{5,31}", trigger):
        raise ValueError("trigger_word must be 6-32 lowercase ASCII letters, digits, or underscores")
    if trigger in COMMON_TRIGGER_WORDS or ("_" not in trigger and not any(ch.isdigit() for ch in trigger)):
        raise ValueError("trigger_word must be a unique identifier containing a digit or underscore")
    return trigger


@dataclass(frozen=True)
class TrainingConfig:
    training_type: str
    dataset_path: str
    trigger_word: str
    caption: str
    output_path: str
    vram_mib: int
    job_name: str


def generate_training_yaml(config: TrainingConfig) -> str:
    training_type = config.training_type.strip().lower()
    if training_type not in {"image", "video"}:
        raise ValueError("training_type must be image or video")

    dataset_path = validate_ascii_absolute_path(config.dataset_path, "dataset_path")
    output_path = validate_ascii_absolute_path(config.output_path, "output_path")
    trigger_word = validate_trigger_word(config.trigger_word)
    job_name = re.sub(r"[^a-zA-Z0-9_-]", "_", config.job_name).strip("_") or f"jiaren_{trigger_word}"
    low_vram = int(config.vram_mib or 0) < 16384

    is_video = training_type == "video"
    rank = 16 if is_video else 8
    steps = 1200 if is_video else 800
    model_name = "Wan-AI/Wan2.1-T2V-1.3B-Diffusers" if is_video else "black-forest-labs/FLUX.1-dev"
    model_flags = ["        arch: \"wan21\""] if is_video else ["        is_flux: true"]
    sample_prompt = (
        f"{trigger_word}, consistent style same as reference material, smooth motion, medium shot, 4k high detail"
        if is_video
        else f"{trigger_word}, clean scene, consistent aesthetic, sharp details"
    )

    # Wan 2.1's current AI-Toolkit path learns from extracted frames.  The
    # Jiaren preprocessor therefore converts reference clips into cleaned JPGs
    # before this config is launched.  It remains a LoRA on the Wan video model.
    dataset_lines = [
        f"        - folder_path: {yaml_string(dataset_path)}",
        "          caption_ext: \"txt\"",
        "          caption_dropout_rate: 0.05",
        "          shuffle_tokens: false",
        "          cache_latents_to_disk: true",
        "          resolution: [ 512, 632 ]" if is_video else "          resolution: [ 512, 768, 1024 ]",
    ]

    lines = [
        "---",
        "job: extension",
        "config:",
        f"  name: {yaml_string(job_name)}",
        "  process:",
        "    - type: \"sd_trainer\"",
        f"      training_folder: {yaml_string(output_path)}",
        "      device: \"cuda:0\"",
        f"      trigger_word: {yaml_string(trigger_word)}",
        "      network:",
        "        type: \"lora\"",
        f"        linear: {rank}",
        f"        linear_alpha: {rank}",
        "      save:",
        "        dtype: \"float16\"",
        "        save_every: 300",
        "        max_step_saves_to_keep: 4",
        "        push_to_hub: false",
        "      datasets:",
        *dataset_lines,
        "      train:",
        "        batch_size: 1",
        f"        steps: {steps}",
        "        gradient_accumulation_steps: 1",
        "        train_unet: true",
        "        train_text_encoder: false",
        f"        gradient_checkpointing: {'true' if low_vram else 'false'}",
        "        noise_scheduler: \"flowmatch\"",
        *( ["        timestep_type: \"sigmoid\""] if is_video else [] ),
        "        optimizer: \"adamw8bit\"",
        "        lr: 0.0001",
        "        dtype: \"bf16\"",
        "      model:",
        f"        name_or_path: {yaml_string(model_name)}",
        *model_flags,
        "        quantize: true",
        "        quantize_te: true",
        f"        low_vram: {'true' if low_vram else 'false'}",
        "      sample:",
        "        sampler: \"flowmatch\"",
        "        sample_every: 300",
        "        sample_start_step: 300",
        "        width: 832" if is_video else "        width: 1024",
        "        height: 480" if is_video else "        height: 1024",
        *( ["        num_frames: 40", "        fps: 15"] if is_video else [] ),
        "        prompts:",
        f"          - {yaml_string(sample_prompt)}",
        "        neg: \"blurry, distorted, broken motion, low resolution, ugly, inconsistent character\"",
        "        seed: 42",
        "        walk_seed: true",
        "        guidance_scale: 5" if is_video else "        guidance_scale: 4",
        "        sample_steps: 30" if is_video else "        sample_steps: 20",
        "meta:",
        "  name: \"[name]\"",
        "  version: \"1.0\"",
        "  managed_by: \"Jiaren Skill Factory\"",
        f"  training_type: {yaml_string(training_type)}",
        "  auto_clean_frames: true",
        f"  global_caption: {yaml_string(config.caption.strip())}",
        "",
    ]
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--type", required=True, choices=["image", "video"])
    parser.add_argument("--dataset", required=True)
    parser.add_argument("--trigger", required=True)
    parser.add_argument("--caption", default="")
    parser.add_argument("--output", required=True)
    parser.add_argument("--vram-mib", type=int, default=0)
    parser.add_argument("--job-name", required=True)
    parser.add_argument("--write", required=True)
    args = parser.parse_args()

    yaml_text = generate_training_yaml(
        TrainingConfig(
            training_type=args.type,
            dataset_path=args.dataset,
            trigger_word=args.trigger,
            caption=args.caption,
            output_path=args.output,
            vram_mib=args.vram_mib,
            job_name=args.job_name,
        )
    )
    destination = Path(validate_ascii_absolute_path(args.write, "write"))
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(yaml_text, encoding="utf-8")
    print(json.dumps({"ok": True, "configPath": str(destination), "lowVram": args.vram_mib < 16384}))


if __name__ == "__main__":
    main()

