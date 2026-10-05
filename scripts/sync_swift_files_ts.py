#!/usr/bin/env python3
"""
Syncs Swift codebase, Xcode project files, and assets into src/swift_codebase/swiftFiles.ts
so the web browser, code inspector, and 1-click Download Xcode (.zip) contain the complete
TGBank.xcodeproj and native sources.
"""

import os
import json

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IOS_DIR = os.path.join(ROOT_DIR, "ios")
SWIFT_FILES_TS = os.path.join(ROOT_DIR, "src", "swift_codebase", "swiftFiles.ts")

category_mapping = {
    "App": "App",
    "Theme": "Theme",
    "Models": "Models",
    "Navigation": "Navigation",
    "Repository": "Repository",
    "Views": "Views",
    "TGBankUITests": "Tests",
    "TGBank.xcodeproj": "App",
}

collected_files = []

# List of file extensions to include in the project bundle
VALID_EXTENSIONS = (".swift", ".pbxproj", ".xcscheme", ".xcworkspacedata", ".plist", ".json", ".sh")

for root, dirs, files in os.walk(IOS_DIR):
    if "build" in root or ".build" in root or "certs" in root:
        continue
    for file in sorted(files):
        if any(file.endswith(ext) for ext in VALID_EXTENSIONS):
            abs_path = os.path.join(root, file)
            rel_path = os.path.relpath(abs_path, IOS_DIR)

            # Skip symlink targets like tgbank.xcodeproj if already covering TGBank.xcodeproj
            if rel_path.startswith("tgbank.xcodeproj"):
                continue

            try:
                with open(abs_path, "r", encoding="utf-8") as f:
                    content = f.read()
            except UnicodeDecodeError:
                continue

            parts = rel_path.split(os.sep)
            if "xcodeproj" in parts[0]:
                cat = "App"
            elif rel_path in ("Package.swift", "build_ipa.sh"):
                cat = "App"
            elif len(parts) > 1 and parts[1] in category_mapping:
                cat = category_mapping[parts[1]]
            elif parts[0] in category_mapping:
                cat = category_mapping[parts[0]]
            else:
                cat = "Views"

            collected_files.append({
                "path": rel_path,
                "category": cat,
                "content": content
            })

ts_content = """export interface SwiftFileDefinition {
  path: string;
  category: 'App' | 'Theme' | 'Models' | 'ViewModels' | 'Services' | 'Repository' | 'Navigation' | 'Views' | 'Tests';
  content: string;
}

export const SWIFT_PROJECT_FILES: SwiftFileDefinition[] = """

ts_content += json.dumps(collected_files, indent=2) + ";\n\n"

ts_content += """export const SWIFT_FILES: Record<string, string> = SWIFT_PROJECT_FILES.reduce(
  (acc, file) => {
    acc[file.path] = file.content;
    return acc;
  },
  {} as Record<string, string>
);
"""

with open(SWIFT_FILES_TS, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"[*] Synchronized {len(collected_files)} files into {SWIFT_FILES_TS}")
