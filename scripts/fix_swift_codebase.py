#!/usr/bin/env python3
import os
import re
import glob

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IOS_DIR = os.path.join(ROOT_DIR, "ios")
TGBANK_DIR = os.path.join(IOS_DIR, "TGBank")

# 1. Ensure Resources directory exists
resources_dir = os.path.join(TGBANK_DIR, "Resources")
os.makedirs(resources_dir, exist_ok=True)
with open(os.path.join(resources_dir, ".gitkeep"), "w") as f:
    f.write("")

# 2. Fix Package.swift
package_swift_path = os.path.join(IOS_DIR, "Package.swift")
package_swift_content = """// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "TGBank",
    defaultLocalization: "en",
    platforms: [
        .iOS(.v16)
    ],
    products: [
        .library(
            name: "TGBank",
            targets: ["TGBank"]
        ),
    ],
    dependencies: [],
    targets: [
        .target(
            name: "TGBank",
            dependencies: [],
            path: "TGBank"
        ),
        .testTarget(
            name: "TGBankUITests",
            dependencies: ["TGBank"],
            path: "TGBankUITests"
        )
    ]
)
"""
with open(package_swift_path, "w") as f:
    f.write(package_swift_content)

# 3. Process each .swift file in ios/
swift_files = []
for root, dirs, files in os.walk(IOS_DIR):
    for f in files:
        if f.endswith(".swift"):
            swift_files.append(os.path.join(root, f))

color_replacements = [
    (r"Color\(\.systemBackground\)", "Color(uiColor: .systemBackground)"),
    (r"Color\(\.secondarySystemBackground\)", "Color(uiColor: .secondarySystemBackground)"),
    (r"Color\(\.systemGroupedBackground\)", "Color(uiColor: .systemGroupedBackground)"),
    (r"Color\(\.secondarySystemGroupedBackground\)", "Color(uiColor: .secondarySystemGroupedBackground)"),
    (r"Color\(\.systemGray([0-9])\)", r"Color(uiColor: .systemGray\1)"),
    (r"Color\(\.systemGray\)", "Color(uiColor: .systemGray)"),
]

for sf in swift_files:
    with open(sf, "r") as f:
        content = f.read()

    orig_content = content

    for pat, rep in color_replacements:
        content = re.sub(pat, rep, content)

    # Wrap keyboardType if not already wrapped
    # Match `.keyboardType(...)` without `#if os(iOS)` immediately preceding
    lines = content.splitlines()
    new_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        if stripped.startswith(".keyboardType(") and not (i > 0 and "#if os(iOS)" in lines[i-1]):
            indent = line[:len(line) - len(line.lstrip())]
            new_lines.append(f"{indent}#if os(iOS)")
            new_lines.append(line)
            new_lines.append(f"{indent}#endif")
        else:
            new_lines.append(line)
        i += 1
    content = "\n".join(new_lines) + "\n"

    # If file references uiColor: or #if os(iOS), ensure #if canImport(UIKit) is present
    if ("uiColor:" in content or "keyboardType" in content) and "canImport(UIKit)" not in content and "import UIKit" not in content:
        # insert after `import SwiftUI`
        if "import SwiftUI" in content:
            content = content.replace("import SwiftUI\n", "import SwiftUI\n#if canImport(UIKit)\nimport UIKit\n#endif\n", 1)

    if content != orig_content:
        with open(sf, "w") as f:
            f.write(content)
        print(f"Updated: {os.path.relpath(sf, ROOT_DIR)}")

print("[*] Swift codebase sanitized successfully.")
