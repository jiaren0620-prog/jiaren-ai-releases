import argparse
import os
import pathlib
import plistlib
import stat
import zipfile


APP_NAME = "Jiaren AI"
APP_PREFIX = f"{APP_NAME}.app/"
APP_RESOURCES = f"{APP_PREFIX}Contents/Resources/"


def clone_info(original, filename, mode=None, compress_type=None):
    info = zipfile.ZipInfo(filename, date_time=original.date_time)
    info.comment = original.comment
    info.create_system = 3
    info.extra = original.extra
    info.internal_attr = original.internal_attr
    info.external_attr = original.external_attr if mode is None else mode << 16
    info.compress_type = original.compress_type if compress_type is None else compress_type
    return info


def new_info(filename, mode=0o100644, compress_type=zipfile.ZIP_DEFLATED):
    info = zipfile.ZipInfo(filename)
    info.create_system = 3
    info.external_attr = mode << 16
    info.compress_type = compress_type
    return info


def rename_runtime_entry(filename):
    if not filename.startswith("Electron.app/"):
        return filename
    relative = filename[len("Electron.app/"):]
    relative = relative.replace("Electron Helper", f"{APP_NAME} Helper")
    if relative == "Contents/MacOS/Electron":
        relative = f"Contents/MacOS/{APP_NAME}"
    return APP_PREFIX + relative


def update_plist(filename, data):
    values = plistlib.loads(data)
    if filename == "Electron.app/Contents/Info.plist":
        values.update({
            "CFBundleDisplayName": APP_NAME,
            "CFBundleExecutable": APP_NAME,
            "CFBundleIdentifier": "com.jiaren.ai.canvas",
            "CFBundleName": APP_NAME,
            "CFBundleShortVersionString": "1.1.1",
            "CFBundleVersion": "1.1.1",
            "CFBundleIconFile": "jiaren.icns",
            "LSApplicationCategoryType": "public.app-category.graphics-design",
            "NSRequiresAquaSystemAppearance": False,
        })
    elif "Electron Helper" in filename and filename.endswith("/Contents/Info.plist"):
        helper_app = filename.split("/Contents/Frameworks/", 1)[1].split(".app/", 1)[0]
        executable = helper_app.replace("Electron Helper", f"{APP_NAME} Helper")
        suffix = executable[len(f"{APP_NAME} Helper"):].strip(" ()").lower()
        bundle_suffix = f".{suffix}" if suffix else ""
        values.update({
            "CFBundleDisplayName": executable,
            "CFBundleExecutable": executable,
            "CFBundleIdentifier": f"com.jiaren.ai.canvas.helper{bundle_suffix}",
            "CFBundleName": executable,
            "CFBundleShortVersionString": "1.1.1",
            "CFBundleVersion": "1.1.1",
        })
    return plistlib.dumps(values, fmt=plistlib.FMT_XML, sort_keys=False)


def source_mode(path, executable=False):
    if executable:
        return 0o100755
    return 0o100644


def write_file(archive, source, destination, executable=False):
    mode = source_mode(source, executable)
    archive.write(
        source,
        destination,
        compress_type=zipfile.ZIP_DEFLATED,
        compresslevel=6,
    )
    archive.getinfo(destination).create_system = 3
    archive.getinfo(destination).external_attr = mode << 16


def write_tree(archive, source_root, destination_root, skip=None, executable=None):
    source_root = pathlib.Path(source_root)
    if not source_root.exists():
        raise FileNotFoundError(source_root)
    for source in sorted(source_root.rglob("*")):
        if not source.is_file():
            continue
        relative = source.relative_to(source_root).as_posix()
        if skip and skip(relative):
            continue
        is_executable = bool(executable and executable(relative))
        write_file(archive, source, destination_root + relative, is_executable)


def skip_platform_app_file(relative):
    normalized = relative.replace("\\", "/")
    lower = normalized.lower()
    if lower.startswith("node_modules/@img/sharp-darwin-"):
        return True
    if lower.startswith("node_modules/@img/sharp-libvips-darwin-"):
        return True
    if lower.startswith("node_modules/@img/sharp-win32-"):
        return True
    if lower.startswith("node_modules/@img/sharp-libvips-win32-"):
        return True
    if lower.startswith("node_modules/onnxruntime-node/bin/napi-v6/"):
        return True
    if lower.startswith("node_modules/ffmpeg-static/ffmpeg"):
        return True
    return False


def upscayl_executable(relative):
    name = pathlib.PurePosixPath(relative).name
    return name in {
        "realesrgan-ncnn-vulkan",
        "upscayl-bin",
    } or relative.endswith(".sh")


def add_runtime(runtime_zip, archive):
    with zipfile.ZipFile(runtime_zip, "r") as runtime:
        for original in runtime.infolist():
            if original.filename == "Electron.app/Contents/Resources/default_app.asar":
                continue
            filename = rename_runtime_entry(original.filename)
            data = runtime.read(original)
            if original.filename.endswith("/Contents/Info.plist"):
                data = update_plist(original.filename, data)
            is_directory = original.is_dir()
            is_symlink = stat.S_ISLNK(original.external_attr >> 16)
            compress_type = zipfile.ZIP_STORED if is_directory or is_symlink else zipfile.ZIP_DEFLATED
            info = clone_info(original, filename, compress_type=compress_type)
            archive.writestr(info, data, compress_type=compress_type, compresslevel=6)


def build(args):
    output = pathlib.Path(args.output)
    partial = pathlib.Path(str(output) + ".partial")
    partial.unlink(missing_ok=True)
    output.parent.mkdir(parents=True, exist_ok=True)

    project = pathlib.Path(args.project)
    app_source = pathlib.Path(args.app_source)
    windows_resources = pathlib.Path(args.windows_resources)
    arch = args.arch

    with zipfile.ZipFile(
        partial,
        "w",
        compression=zipfile.ZIP_DEFLATED,
        compresslevel=6,
        allowZip64=True,
    ) as archive:
        add_runtime(args.runtime_zip, archive)
        write_tree(
            archive,
            app_source,
            APP_RESOURCES + "app/",
            skip=skip_platform_app_file,
        )

        image_packages = [
            f"sharp-darwin-{arch}",
            f"sharp-libvips-darwin-{arch}",
        ]
        for package_name in image_packages:
            write_tree(
                archive,
                project / "node_modules" / "@img" / package_name,
                APP_RESOURCES + f"app/node_modules/@img/{package_name}/",
            )

        write_tree(
            archive,
            project / "node_modules" / "onnxruntime-node" / "bin" / "napi-v6" / "darwin" / arch,
            APP_RESOURCES + f"app/node_modules/onnxruntime-node/bin/napi-v6/darwin/{arch}/",
        )
        write_file(
            archive,
            project / "build" / "mac-runtime-cache" / f"ffmpeg-darwin-{arch}",
            APP_RESOURCES + "app/node_modules/ffmpeg-static/ffmpeg",
            executable=True,
        )

        for resource_name in [
            ".agents",
            "data",
            "jiaren-local-service",
            "python",
            "rmbg2",
            "shared",
            "tools",
        ]:
            write_tree(
                archive,
                windows_resources / resource_name,
                APP_RESOURCES + f"{resource_name}/",
            )
        write_file(
            archive,
            windows_resources / "sql-wasm.wasm",
            APP_RESOURCES + "sql-wasm.wasm",
        )
        write_tree(
            archive,
            project / "build" / "upscayl" / "macos",
            APP_RESOURCES + "upscayl/",
            executable=upscayl_executable,
        )
        write_file(
            archive,
            args.icon,
            APP_RESOURCES + "jiaren.icns",
        )

        helper = pathlib.Path(args.helper)
        readme = pathlib.Path(args.readme)
        write_file(archive, helper, "\u9996\u6b21\u6253\u5f00.command", executable=True)
        write_file(archive, readme, "\u5b89\u88c5\u8bf4\u660e.txt")

    os.replace(partial, output)


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--project", required=True)
    parser.add_argument("--arch", choices=("arm64", "x64"), required=True)
    parser.add_argument("--runtime-zip", required=True)
    parser.add_argument("--app-source", required=True)
    parser.add_argument("--windows-resources", required=True)
    parser.add_argument("--icon", required=True)
    parser.add_argument("--helper", required=True)
    parser.add_argument("--readme", required=True)
    parser.add_argument("--output", required=True)
    return parser.parse_args()


if __name__ == "__main__":
    build(parse_args())
