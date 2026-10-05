#!/usr/bin/env python3
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
}

collected_files = []

for root, dirs, files in os.walk(IOS_DIR):
    if "build" in root or ".build" in root:
        continue
    for file in sorted(files):
        if file.endswith(".swift"):
            abs_path = os.path.join(root, file)
            rel_path = os.path.relpath(abs_path, IOS_DIR)
            with open(abs_path, "r", encoding="utf-8") as f:
                content = f.read()

            parts = rel_path.split(os.sep)
            if rel_path == "Package.swift":
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

print(f"[*] Synchronized {len(collected_files)} Swift files into {SWIFT_FILES_TS}")
