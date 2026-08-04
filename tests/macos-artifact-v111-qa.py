import pathlib
import plistlib
import posixpath
import stat
import sys
import zipfile


APP = "Jiaren AI.app/"
RESOURCES = APP + "Contents/Resources/"
HELPER_NAME = "\u9996\u6b21\u6253\u5f00.command"
README_NAME = "\u5b89\u88c5\u8bf4\u660e.txt"


def verify(path):
    arch = "arm64" if "arm64" in path.name else "x64"
    with zipfile.ZipFile(path) as archive:
        names = set(archive.namelist())
        rmbg_models = [
            name for name in names
            if name.startswith(RESOURCES + "rmbg2/") and name.endswith(".onnx")
        ]
        required = [
            APP + "Contents/Info.plist",
            APP + "Contents/MacOS/Jiaren AI",
            RESOURCES + "jiaren.icns",
            RESOURCES + "app/package.json",
            RESOURCES + "app/node_modules/@img/colour/package.json",
            RESOURCES + "app/dist-electron/electron/main.js",
            RESOURCES + "app/dist/index.html",
            RESOURCES + "upscayl/realesrgan-ncnn-vulkan",
            RESOURCES + f"app/node_modules/@img/sharp-darwin-{arch}/lib/sharp-darwin-{arch}.node",
            RESOURCES + f"app/node_modules/@img/sharp-libvips-darwin-{arch}/lib/libvips-cpp.8.17.3.dylib",
            RESOURCES + f"app/node_modules/onnxruntime-node/bin/napi-v6/darwin/{arch}/onnxruntime_binding.node",
            RESOURCES + f"app/node_modules/onnxruntime-node/bin/napi-v6/darwin/{arch}/libonnxruntime.1.23.2.dylib",
            RESOURCES + "app/node_modules/ffmpeg-static/ffmpeg",
            HELPER_NAME,
            README_NAME,
        ]
        missing = [name for name in required if name not in names]
        forbidden = [
            name for name in names
            if "/win32/" in name.lower()
            or name.lower().endswith((".exe", ".dll"))
            or "sharp-win32-" in name.lower()
        ]
        plist = plistlib.loads(archive.read(required[0]))
        helper = archive.read(HELPER_NAME).decode("utf-8")
        readme = archive.read(README_NAME).decode("utf-8")
        executable = [
            APP + "Contents/MacOS/Jiaren AI",
            RESOURCES + "app/node_modules/ffmpeg-static/ffmpeg",
            RESOURCES + "upscayl/realesrgan-ncnn-vulkan",
            HELPER_NAME,
        ]
        modes = {
            name: (archive.getinfo(name).external_attr >> 16) & 0o777
            for name in executable
        }
        resource_counts = {
            "skills": sum(name.startswith(RESOURCES + "data/") for name in names),
            "agents": sum(name.startswith(RESOURCES + ".agents/") for name in names),
            "local_service": sum(name.startswith(RESOURCES + "jiaren-local-service/") for name in names),
            "tools": sum(name.startswith(RESOURCES + "tools/") for name in names),
        }
        helpers = []
        for name in names:
            if "/Frameworks/Jiaren AI Helper" not in name or not name.endswith("/Contents/Info.plist"):
                continue
            helper_plist = plistlib.loads(archive.read(name))
            executable_name = helper_plist["CFBundleExecutable"]
            executable_path = posixpath.join(posixpath.dirname(name), "MacOS", executable_name)
            helpers.append((executable_name, executable_path, helper_plist["CFBundleIdentifier"]))

        symlinks = {
            info.filename: archive.read(info).decode("utf-8")
            for info in archive.infolist()
            if stat.S_ISLNK(info.external_attr >> 16)
        }

        def resolve_link(name):
            seen = set()
            current = name
            while current in symlinks:
                assert current not in seen, f"Circular symlink: {name}"
                seen.add(current)
                current = posixpath.normpath(
                    posixpath.join(posixpath.dirname(current), symlinks[current])
                )
            parts = current.split("/")
            for index in range(1, len(parts)):
                prefix = "/".join(parts[:index])
                if prefix in symlinks:
                    target = posixpath.normpath(
                        posixpath.join(posixpath.dirname(prefix), symlinks[prefix])
                    )
                    current = "/".join([target, *parts[index:]])
                    return resolve_link(current)
            return current

        unresolved_links = [
            (name, target)
            for name, target in symlinks.items()
            if resolve_link(name) not in names and resolve_link(name) + "/" not in names
        ]

        assert archive.testzip() is None
        assert not missing, missing
        assert not forbidden, forbidden[:20]
        assert rmbg_models, "Missing local RMBG ONNX model"
        assert plist["CFBundleDisplayName"] == "Jiaren AI"
        assert plist["CFBundleExecutable"] == "Jiaren AI"
        assert plist["CFBundleIdentifier"] == "com.jiaren.ai.canvas"
        assert plist["CFBundleShortVersionString"] == "1.1.1"
        assert plist["CFBundleIconFile"] == "jiaren.icns"
        assert all(mode == 0o755 for mode in modes.values()), modes
        assert "${0:A:h}" in helper
        assert "xattr -dr com.apple.quarantine" in helper
        assert "codesign --force --deep --sign -" in helper
        assert "\u4e0d\u9700\u8981\u5b89\u88c5 Xcode" in readme
        assert "\u672a\u4f7f\u7528 Apple \u5f00\u53d1\u8005\u8bc1\u4e66" in readme
        assert all(count > 0 for count in resource_counts.values()), resource_counts
        assert len(helpers) == 4, helpers
        assert all(executable_path in names for _, executable_path, _ in helpers), helpers
        assert len({bundle_id for _, _, bundle_id in helpers}) == 4, helpers
        assert not unresolved_links, unresolved_links

        print(path.name)
        print(f"  entries={len(names)} rmbg_models={len(rmbg_models)}")
        print(f"  permissions={modes}")
        print(f"  resources={resource_counts}")
        print(f"  helpers={helpers}")
        print(f"  symlinks={len(symlinks)}")


for artifact in map(pathlib.Path, sys.argv[1:]):
    verify(artifact)

print("Jiaren AI 1.1.1 macOS artifacts passed structural QA.")
