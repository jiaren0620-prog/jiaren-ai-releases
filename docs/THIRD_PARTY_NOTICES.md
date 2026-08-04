# Third Party Notices

## HKUDS/ViMax

Jiaren AI - 视频工作台 includes a TypeScript workflow adaptation inspired by the HKUDS/ViMax project:

- Source project: https://github.com/HKUDS/ViMax
- Local reference revision used during integration: `3713567`
- License: MIT

The user-facing product name remains Jiaren AI. Third-party project names are not used as feature branding inside the application UI.

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Storyboard and Video Workflow References

Jiaren AI's canvas-native storyboard/video workflow was designed with reference to public storyboard and video-generation workflow patterns:

- HITsz-TMG/VideoClaw: https://github.com/HITsz-TMG/VideoClaw, License: MIT
- BroderQi/Storyboard: https://github.com/BroderQi/Storyboard, License: MIT
- 0xsline/StoryGen-Atelier: https://github.com/0xsline/StoryGen-Atelier, License observed locally/web as Apache-2.0

The Jiaren AI implementation is original TypeScript/React code integrated into the existing Jiaren canvas, API bridge, image generation node, and image-generation workflow. It does not embed the SoulArtisan local package code because the local license text requires separate commercial authorization.

MIT License references for HITsz-TMG/VideoClaw and BroderQi/Storyboard:

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## T8mars/T8-penguin-canvas

Jiaren AI includes selected image, audio, local-processing, ComfyUI, utility, and 3D node capabilities adapted from the project. Video, VibeX, RunningHub, FAL, Grok, and Codex workbenches are excluded:

- Source project: https://github.com/T8mars/T8-penguin-canvas
- License: MIT

The implementation in Jiaren AI is integrated into the Jiaren canvas workflow and uses Jiaren AI's own runtime/API bridge.

MIT License

Copyright (c) 2026 T8mars

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


## Jaaz

The Jaaz repository was reviewed only for architectural context. Its source, prompts, and UI were not copied or embedded because the inspected license prohibits derivative embedding without separate commercial authorization. JiarenAI uses an original local planner, image designer, prompt refiner, and canvas operator implementation.


## OpenViz

OpenViz was reviewed as a product-workflow reference. The inspected repository did not include a root LICENSE file, so JiarenAI does not copy or redistribute its source. The industrial sketch renderer is an original JiarenAI implementation of the requested sketch, line-art, mask, CMF, reference, and export workflow.
