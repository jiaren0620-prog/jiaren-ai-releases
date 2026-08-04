# Jiaren Local Skill Factory and Industrial 3D

## Integration boundary

These features extend the existing Jiaren React Flow canvas. They do not add
tldraw, a second viewport, or a second persistence layer.

- `skill-factory` is a new source node.
- `model-3d-upload` keeps its existing `model3d` output contract.
- `model-3d-preview` keeps its existing `model3d -> image` contract.
- Existing canvas panning, zooming, connection validation, project storage,
  start page, and Studio canvas code are not replaced.

## Skill Factory setup

AI-Toolkit remains an external local engine. Use a dedicated Python 3.11 or
3.12 environment; the machine-wide Python 3.13 installation is not assumed to
be compatible with the current Torch stack.

Example Windows layout without spaces or non-ASCII characters:

```powershell
mkdir C:\JiarenAI
cd C:\JiarenAI
git clone https://github.com/ostris/ai-toolkit.git ai-toolkit
py -3.11 -m venv venv
C:\JiarenAI\venv\Scripts\python.exe -m pip install --upgrade pip
C:\JiarenAI\venv\Scripts\python.exe -m pip install -r C:\JiarenAI\ai-toolkit\requirements.txt
```

Configure these three absolute paths in the Skill Factory dialog:

```text
AI-Toolkit: C:\JiarenAI\ai-toolkit
Python:     C:\JiarenAI\venv\Scripts\python.exe
Workspace:  C:\JiarenAI\SkillFactory
```

The scheduler runs the current upstream command:

```text
python run.py <absolute-training-config.yaml>
```

It never calls the obsolete `train.py` entrypoint. Only one process trains at
a time; additional jobs are FIFO queued. GPU memory is read from `nvidia-smi`.
Below 16384 MiB, generated configs enable `model.low_vram` and gradient
checkpointing.

Training files are copied into an ASCII-only local job directory. Video jobs
use ffmpeg to extract frames and, when OpenCV is available in the selected
environment, reject black and blurry frames. Current Wan 2.1 training in
AI-Toolkit learns from these cleaned frames; it does not learn temporal motion
from raw clips. Wan 2.2 is the upstream path to adopt later for true multi-frame
datasets on higher-memory GPUs.

## Industrial 3D

The renderer is built from Three.js and its official example modules:

- GLB/GLTF, OBJ, FBX, STL and USDZ local loading
- Orbit control with left drag rotate, middle drag pan, wheel zoom
- part tree, ray picking, Shift multi-select, hide/isolate/show
- physical materials, local Jiaren chat-model JSON material generation
- studio environments, background color, wireframe, bloom and shadows
- PNG snapshot output and binary GLB export

The AI material action uses the API connection already configured by the user
in Jiaren. No LiteLLM or new gateway is introduced.

## STEP adapter

`occt-import-js` is LGPL-2.1, not MIT. WebAssembly isolation does not remove
LGPL notice, relinking, and replacement obligations. Therefore it is not
bundled into the pure-MIT Jiaren build.

STEP/STP remains an optional adapter boundary. Configure an independently
distributed local converter executable that accepts:

```text
converter.exe <absolute-input.step> <absolute-output.glb>
```

Then launch Jiaren with:

```powershell
$env:JIAREN_OCCT_CONVERTER='C:\JiarenAI\occt\converter.exe'
```

Without that adapter, selecting STEP produces a clear local error while the
other formats remain available.

## License record

| Component | License | Bundled | Notes |
| --- | --- | --- | --- |
| Three.js | MIT | Yes | Renderer and official examples |
| React Flow / `@xyflow/react` | MIT | Existing | Jiaren's existing top-level canvas |
| Ostris AI-Toolkit | MIT | No | External user-installed training engine |
| tldraw | Current custom license | No | Not MIT; intentionally not integrated |
| TheBrowserLab | No license found | No | Visual reference only; no source copied |
| occt-import-js | LGPL-2.1 | No | Optional independent STEP adapter only |
| ApexForge | GPL-3.0 | No | Not referenced or integrated |

## Build files

```text
src/features/skill-factory/*
src/features/industrial-3d/*
electron/skill-factory-runtime.cjs
python/jiaren_skill_factory/*
scripts/build-local-features-0720.cjs
```

Build the renderer module:

```powershell
node scripts\build-local-features-0720.cjs
```

The release ASAR packaging script copies the generated ESM module, Electron
runtime, and Python helpers into the existing app package. No Docker, cloud
upload service, or multi-user server is involved.

