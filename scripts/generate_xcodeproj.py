#!/usr/bin/env python3
"""
Xcode Project Generator for TG Bank iOS
Generates an authentic, fully-configured TGBank.xcodeproj (and tgbank.xcodeproj)
compatible with Xcode 14, 15, and 16, xcodebuild, Fastlane, and CI/CD runners.
"""

import os
import sys
import json
import shutil
import hashlib

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IOS_DIR = os.path.join(ROOT_DIR, "ios")
TGBANK_SRC_DIR = os.path.join(IOS_DIR, "TGBank")
XCODEPROJ_DIR = os.path.join(IOS_DIR, "TGBank.xcodeproj")
XCSHARED_DIR = os.path.join(XCODEPROJ_DIR, "xcshareddata", "xcschemes")
XCWORKSPACE_DIR = os.path.join(XCODEPROJ_DIR, "project.xcworkspace")

def make_uuid(seed: str) -> str:
    """Generate a deterministic 24-char hex Xcode PBX UUID from a string seed."""
    h = hashlib.sha256(seed.encode("utf-8")).hexdigest().upper()
    return h[:24]

def setup_assets_xcassets():
    """Sets up standard Xcode Assets.xcassets catalog."""
    assets_dir = os.path.join(TGBANK_SRC_DIR, "Assets.xcassets")
    os.makedirs(assets_dir, exist_ok=True)

    # Root Contents.json
    root_contents = {
        "info": {
            "author": "xcode",
            "version": 1
        }
    }
    with open(os.path.join(assets_dir, "Contents.json"), "w") as f:
        json.dump(root_contents, f, indent=2)

    # AppIcon.appiconset
    appicon_dir = os.path.join(assets_dir, "AppIcon.appiconset")
    os.makedirs(appicon_dir, exist_ok=True)
    appicon_contents = {
        "images": [
            {
                "idiom": "universal",
                "platform": "ios",
                "size": "1024x1024"
            }
        ],
        "info": {
            "author": "xcode",
            "version": 1
        }
    }
    with open(os.path.join(appicon_dir, "Contents.json"), "w") as f:
        json.dump(appicon_contents, f, indent=2)

    # AccentColor.colorset
    accent_dir = os.path.join(assets_dir, "AccentColor.colorset")
    os.makedirs(accent_dir, exist_ok=True)
    accent_contents = {
        "colors": [
            {
                "color": {
                    "color-space": "srgb",
                    "components": {
                        "alpha": "1.000",
                        "blue": "0.922",
                        "green": "0.388",
                        "red": "0.145"
                    }
                },
                "idiom": "universal"
            }
        ],
        "info": {
            "author": "xcode",
            "version": 1
        }
    }
    with open(os.path.join(accent_dir, "Contents.json"), "w") as f:
        json.dump(accent_contents, f, indent=2)

def setup_info_plist():
    """Generates TGBank/Info.plist and TGBankUITests/Info.plist for Xcode."""
    main_info_path = os.path.join(TGBANK_SRC_DIR, "Info.plist")
    main_info = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>$(DEVELOPMENT_LANGUAGE)</string>
    <key>CFBundleDisplayName</key>
    <string>TG Bank</string>
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    <key>CFBundleIdentifier</key>
    <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>$(PRODUCT_NAME)</string>
    <key>CFBundlePackageType</key>
    <string>$(PRODUCT_BUNDLE_PACKAGE_TYPE)</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>LSRequiresIPhoneOS</key>
    <true/>
    <key>NSCameraUsageDescription</key>
    <string>TG Bank uses camera for instant UPI QR code scanning and document uploads.</string>
    <key>NSFaceIDUsageDescription</key>
    <string>TG Bank requires Face ID authentication for safe sign-in and authorizing transfers.</string>
    <key>NSPhotoLibraryUsageDescription</key>
    <string>TG Bank accesses photos to attach payment receipts.</string>
    <key>UIApplicationSceneManifest</key>
    <dict>
        <key>UIApplicationSupportsMultipleScenes</key>
        <false/>
    </dict>
    <key>UILaunchScreen</key>
    <dict>
        <key>UIColorName</key>
        <string>AccentColor</string>
    </dict>
    <key>UIRequiredDeviceCapabilities</key>
    <array>
        <string>arm64</string>
    </array>
    <key>UISupportedInterfaceOrientations</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationPortraitUpsideDown</string>
    </array>
    <key>UISupportedInterfaceOrientations~ipad</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationPortraitUpsideDown</string>
        <string>UIInterfaceOrientationLandscapeLeft</string>
        <string>UIInterfaceOrientationLandscapeRight</string>
    </array>
</dict>
</plist>
"""
    with open(main_info_path, "w", encoding="utf-8") as f:
        f.write(main_info)

    tests_dir = os.path.join(IOS_DIR, "TGBankUITests")
    os.makedirs(tests_dir, exist_ok=True)
    tests_info_path = os.path.join(tests_dir, "Info.plist")
    tests_info = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>$(DEVELOPMENT_LANGUAGE)</string>
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    <key>CFBundleIdentifier</key>
    <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>$(PRODUCT_NAME)</string>
    <key>CFBundlePackageType</key>
    <string>$(PRODUCT_BUNDLE_PACKAGE_TYPE)</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>CFBundleVersion</key>
    <string>1</string>
</dict>
</plist>
"""
    with open(tests_info_path, "w", encoding="utf-8") as f:
        f.write(tests_info)

def generate_pbxproj():
    """Generates the PBXProj file with all Swift source files mapped."""
    os.makedirs(XCODEPROJ_DIR, exist_ok=True)
    os.makedirs(XCSHARED_DIR, exist_ok=True)
    os.makedirs(XCWORKSPACE_DIR, exist_ok=True)

    # Workspace data
    workspace_data = """<?xml version="1.0" encoding="UTF-8"?>
<Workspace
   version = "1.0">
   <FileRef
      location = "self:">
   </FileRef>
</Workspace>
"""
    with open(os.path.join(XCWORKSPACE_DIR, "contents.xcworkspacedata"), "w") as f:
        f.write(workspace_data)

    # Collect source files
    swift_files = []
    for root, dirs, files in os.walk(TGBANK_SRC_DIR):
        for f in sorted(files):
            if f.endswith(".swift"):
                abs_path = os.path.join(root, f)
                rel_path = os.path.relpath(abs_path, IOS_DIR)
                swift_files.append((f, rel_path))

    ui_test_file = ("TGBankUITests.swift", "TGBankUITests/TGBankUITests.swift")

    # Fixed UUIDs
    PROJ_UUID = make_uuid("PROJ_TGBANK")
    ROOT_GROUP_UUID = make_uuid("ROOT_GROUP")
    MAIN_GROUP_UUID = make_uuid("MAIN_TGBANK_GROUP")
    TESTS_GROUP_UUID = make_uuid("TESTS_GROUP")
    PRODUCTS_GROUP_UUID = make_uuid("PRODUCTS_GROUP")

    APP_TARGET_UUID = make_uuid("NATIVE_TARGET_APP")
    TEST_TARGET_UUID = make_uuid("NATIVE_TARGET_TESTS")

    APP_PRODUCT_UUID = make_uuid("PRODUCT_REF_APP")
    TEST_PRODUCT_UUID = make_uuid("PRODUCT_REF_TEST")

    APP_SOURCES_PHASE_UUID = make_uuid("SOURCES_PHASE_APP")
    APP_FRAMEWORKS_PHASE_UUID = make_uuid("FRAMEWORKS_PHASE_APP")
    APP_RESOURCES_PHASE_UUID = make_uuid("RESOURCES_PHASE_APP")

    TEST_SOURCES_PHASE_UUID = make_uuid("SOURCES_PHASE_TEST")
    TEST_FRAMEWORKS_PHASE_UUID = make_uuid("FRAMEWORKS_PHASE_TEST")
    TEST_RESOURCES_PHASE_UUID = make_uuid("RESOURCES_PHASE_TEST")

    CONTAINER_ITEM_PROXY_UUID = make_uuid("CONTAINER_ITEM_PROXY")
    TARGET_DEPENDENCY_UUID = make_uuid("TARGET_DEPENDENCY")

    PROJ_CONFIG_LIST_UUID = make_uuid("PROJ_CONFIG_LIST")
    PROJ_DEBUG_CONFIG_UUID = make_uuid("PROJ_DEBUG_CONFIG")
    PROJ_RELEASE_CONFIG_UUID = make_uuid("PROJ_RELEASE_CONFIG")

    APP_CONFIG_LIST_UUID = make_uuid("APP_CONFIG_LIST")
    APP_DEBUG_CONFIG_UUID = make_uuid("APP_DEBUG_CONFIG")
    APP_RELEASE_CONFIG_UUID = make_uuid("APP_RELEASE_CONFIG")

    TEST_CONFIG_LIST_UUID = make_uuid("TEST_CONFIG_LIST")
    TEST_DEBUG_CONFIG_UUID = make_uuid("TEST_DEBUG_CONFIG")
    TEST_RELEASE_CONFIG_UUID = make_uuid("TEST_RELEASE_CONFIG")

    ASSETS_FILE_UUID = make_uuid("ASSETS_XCASSETS_REF")
    ASSETS_BUILD_UUID = make_uuid("ASSETS_XCASSETS_BUILD")
    MAIN_INFOPLIST_UUID = make_uuid("MAIN_INFOPLIST_REF")
    TEST_INFOPLIST_UUID = make_uuid("TEST_INFOPLIST_REF")

    # Map Swift files to FileRef and BuildFile UUIDs
    file_map = {}
    for filename, relpath in swift_files:
        fileref_uuid = make_uuid(f"FILEREF_{relpath}")
        buildfile_uuid = make_uuid(f"BUILDFILE_{relpath}")
        file_map[relpath] = {
            "name": filename,
            "path": relpath,
            "fileref_uuid": fileref_uuid,
            "buildfile_uuid": buildfile_uuid
        }

    test_fileref_uuid = make_uuid(f"FILEREF_{ui_test_file[1]}")
    test_buildfile_uuid = make_uuid(f"BUILDFILE_{ui_test_file[1]}")

    # Build sections
    pbx_build_files = []
    pbx_file_refs = []
    app_sources_build_lines = []

    for relpath, data in sorted(file_map.items()):
        pbx_build_files.append(f"\t\t{data['buildfile_uuid']} /* {data['name']} in Sources */ = {{isa = PBXBuildFile; fileRef = {data['fileref_uuid']} /* {data['name']} */; }};")
        pbx_file_refs.append(f"\t\t{data['fileref_uuid']} /* {data['name']} */ = {{isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = \"{data['path']}\"; sourceTree = \"<group>\"; }};")
        app_sources_build_lines.append(f"\t\t\t\t{data['buildfile_uuid']} /* {data['name']} in Sources */,")

    # Test file refs
    pbx_build_files.append(f"\t\t{test_buildfile_uuid} /* {ui_test_file[0]} in Sources */ = {{isa = PBXBuildFile; fileRef = {test_fileref_uuid} /* {ui_test_file[0]} */; }};")
    pbx_file_refs.append(f"\t\t{test_fileref_uuid} /* {ui_test_file[0]} */ = {{isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = \"{ui_test_file[1]}\"; sourceTree = \"<group>\"; }};")

    # Assets & Plist refs
    pbx_build_files.append(f"\t\t{ASSETS_BUILD_UUID} /* Assets.xcassets in Resources */ = {{isa = PBXBuildFile; fileRef = {ASSETS_FILE_UUID} /* Assets.xcassets */; }};")
    pbx_file_refs.append(f"\t\t{ASSETS_FILE_UUID} /* Assets.xcassets */ = {{isa = PBXFileReference; lastKnownFileType = folder.assetcatalog; path = \"TGBank/Assets.xcassets\"; sourceTree = \"<group>\"; }};")
    pbx_file_refs.append(f"\t\t{MAIN_INFOPLIST_UUID} /* Info.plist */ = {{isa = PBXFileReference; lastKnownFileType = text.plist.xml; path = \"TGBank/Info.plist\"; sourceTree = \"<group>\"; }};")
    pbx_file_refs.append(f"\t\t{TEST_INFOPLIST_UUID} /* Info.plist */ = {{isa = PBXFileReference; lastKnownFileType = text.plist.xml; path = \"TGBankUITests/Info.plist\"; sourceTree = \"<group>\"; }};")

    # Products refs
    pbx_file_refs.append(f"\t\t{APP_PRODUCT_UUID} /* TGBank.app */ = {{isa = PBXFileReference; explicitFileType = wrapper.application; includeInIndex = 0; path = TGBank.app; sourceTree = BUILT_PRODUCTS_DIR; }};")
    pbx_file_refs.append(f"\t\t{TEST_PRODUCT_UUID} /* TGBankUITests.xctest */ = {{isa = PBXFileReference; explicitFileType = wrapper.cfbundle; includeInIndex = 0; path = TGBankUITests.xctest; sourceTree = BUILT_PRODUCTS_DIR; }};")

    # Groups
    main_group_children = [
        f"\t\t\t\t{ASSETS_FILE_UUID} /* Assets.xcassets */,",
        f"\t\t\t\t{MAIN_INFOPLIST_UUID} /* Info.plist */,",
    ]
    for relpath, data in sorted(file_map.items()):
        main_group_children.append(f"\t\t\t\t{data['fileref_uuid']} /* {data['name']} */,")

    tests_group_children = [
        f"\t\t\t\t{test_fileref_uuid} /* {ui_test_file[0]} */,",
        f"\t\t\t\t{TEST_INFOPLIST_UUID} /* Info.plist */,",
    ]

    project_pbxproj = f"""// !$*UTF8*$!
{{
	archiveVersion = 1;
	classes = {{
	}};
	objectVersion = 56;
	objects = {{

/* Begin PBXBuildFile section */
{chr(10).join(pbx_build_files)}
/* End PBXBuildFile section */

/* Begin PBXContainerItemProxy section */
		{CONTAINER_ITEM_PROXY_UUID} /* PBXContainerItemProxy */ = {{
			isa = PBXContainerItemProxy;
			containerPortal = {PROJ_UUID} /* Project object */;
			proxyType = 1;
			remoteGlobalIDString = {APP_TARGET_UUID};
			remoteInfo = TGBank;
		}};
/* End PBXContainerItemProxy section */

/* Begin PBXFileReference section */
{chr(10).join(pbx_file_refs)}
/* End PBXFileReference section */

/* Begin PBXFrameworksBuildPhase section */
		{APP_FRAMEWORKS_PHASE_UUID} /* Frameworks */ = {{
			isa = PBXFrameworksBuildPhase;
			buildActionMask = 2147483647;
			files = (
			);
			runOnlyForDeploymentPostprocessing = 0;
		}};
		{TEST_FRAMEWORKS_PHASE_UUID} /* Frameworks */ = {{
			isa = PBXFrameworksBuildPhase;
			buildActionMask = 2147483647;
			files = (
			);
			runOnlyForDeploymentPostprocessing = 0;
		}};
/* End PBXFrameworksBuildPhase section */

/* Begin PBXGroup section */
		{ROOT_GROUP_UUID} = {{
			isa = PBXGroup;
			children = (
				{MAIN_GROUP_UUID} /* TGBank */,
				{TESTS_GROUP_UUID} /* TGBankUITests */,
				{PRODUCTS_GROUP_UUID} /* Products */,
			);
			sourceTree = "<group>";
		}};
		{MAIN_GROUP_UUID} /* TGBank */ = {{
			isa = PBXGroup;
			children = (
{chr(10).join(main_group_children)}
			);
			path = TGBank;
			sourceTree = "<group>";
		}};
		{TESTS_GROUP_UUID} /* TGBankUITests */ = {{
			isa = PBXGroup;
			children = (
{chr(10).join(tests_group_children)}
			);
			path = TGBankUITests;
			sourceTree = "<group>";
		}};
		{PRODUCTS_GROUP_UUID} /* Products */ = {{
			isa = PBXGroup;
			children = (
				{APP_PRODUCT_UUID} /* TGBank.app */,
				{TEST_PRODUCT_UUID} /* TGBankUITests.xctest */,
			);
			name = Products;
			sourceTree = "<group>";
		}};
/* End PBXGroup section */

/* Begin PBXNativeTarget section */
		{APP_TARGET_UUID} /* TGBank */ = {{
			isa = PBXNativeTarget;
			buildConfigurationList = {APP_CONFIG_LIST_UUID} /* Build configuration list for PBXNativeTarget "TGBank" */;
			buildPhases = (
				{APP_SOURCES_PHASE_UUID} /* Sources */,
				{APP_FRAMEWORKS_PHASE_UUID} /* Frameworks */,
				{APP_RESOURCES_PHASE_UUID} /* Resources */,
			);
			buildRules = (
			);
			dependencies = (
			);
			name = TGBank;
			productName = TGBank;
			productReference = {APP_PRODUCT_UUID} /* TGBank.app */;
			productType = "com.apple.product-type.application";
		}};
		{TEST_TARGET_UUID} /* TGBankUITests */ = {{
			isa = PBXNativeTarget;
			buildConfigurationList = {TEST_CONFIG_LIST_UUID} /* Build configuration list for PBXNativeTarget "TGBankUITests" */;
			buildPhases = (
				{TEST_SOURCES_PHASE_UUID} /* Sources */,
				{TEST_FRAMEWORKS_PHASE_UUID} /* Frameworks */,
				{TEST_RESOURCES_PHASE_UUID} /* Resources */,
			);
			buildRules = (
			);
			dependencies = (
				{TARGET_DEPENDENCY_UUID} /* PBXTargetDependency */,
			);
			name = TGBankUITests;
			productName = TGBankUITests;
			productReference = {TEST_PRODUCT_UUID} /* TGBankUITests.xctest */;
			productType = "com.apple.product-type.bundle.ui-testing";
		}};
/* End PBXNativeTarget section */

/* Begin PBXProject section */
		{PROJ_UUID} /* Project object */ = {{
			isa = PBXProject;
			attributes = {{
				BuildIndependentTargetsInParallel = 1;
				LastSwiftUpdateCheck = 1500;
				LastUpgradeCheck = 1500;
				TargetAttributes = {{
					{APP_TARGET_UUID} = {{
						CreatedOnToolsVersion = 15.0;
					}};
					{TEST_TARGET_UUID} = {{
						CreatedOnToolsVersion = 15.0;
						TestTargetID = {APP_TARGET_UUID};
					}};
				}};
			}};
			buildConfigurationList = {PROJ_CONFIG_LIST_UUID} /* Build configuration list for PBXProject "TGBank" */;
			compatibilityVersion = "Xcode 14.0";
			developmentRegion = en;
			hasScannedForEncodings = 0;
			knownRegions = (
				en,
				Base,
			);
			mainGroup = {ROOT_GROUP_UUID};
			productRefGroup = {PRODUCTS_GROUP_UUID} /* Products */;
			projectDirPath = "";
			projectRoot = "";
			targets = (
				{APP_TARGET_UUID} /* TGBank */,
				{TEST_TARGET_UUID} /* TGBankUITests */,
			);
		}};
/* End PBXProject section */

/* Begin PBXResourcesBuildPhase section */
		{APP_RESOURCES_PHASE_UUID} /* Resources */ = {{
			isa = PBXResourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
				{ASSETS_BUILD_UUID} /* Assets.xcassets in Resources */,
			);
			runOnlyForDeploymentPostprocessing = 0;
		}};
		{TEST_RESOURCES_PHASE_UUID} /* Resources */ = {{
			isa = PBXResourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
			);
			runOnlyForDeploymentPostprocessing = 0;
		}};
/* End PBXResourcesBuildPhase section */

/* Begin PBXSourcesBuildPhase section */
		{APP_SOURCES_PHASE_UUID} /* Sources */ = {{
			isa = PBXSourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
{chr(10).join(app_sources_build_lines)}
			);
			runOnlyForDeploymentPostprocessing = 0;
		}};
		{TEST_SOURCES_PHASE_UUID} /* Sources */ = {{
			isa = PBXSourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
				{test_buildfile_uuid} /* {ui_test_file[0]} in Sources */,
			);
			runOnlyForDeploymentPostprocessing = 0;
		}};
/* End PBXSourcesBuildPhase section */

/* Begin PBXTargetDependency section */
		{TARGET_DEPENDENCY_UUID} /* PBXTargetDependency */ = {{
			isa = PBXTargetDependency;
			target = {APP_TARGET_UUID} /* TGBank */;
			targetProxy = {CONTAINER_ITEM_PROXY_UUID} /* PBXContainerItemProxy */;
		}};
/* End PBXTargetDependency section */

/* Begin XCBuildConfiguration section */
		{PROJ_DEBUG_CONFIG_UUID} /* Debug */ = {{
			isa = XCBuildConfiguration;
			buildSettings = {{
				ALWAYS_SEARCH_USER_PATHS = NO;
				CLANG_ANALYZER_NONNULL = YES;
				CLANG_CXX_LANGUAGE_STANDARD = "gnu++20";
				CLANG_ENABLE_MODULES = YES;
				CLANG_ENABLE_OBJC_ARC = YES;
				CLANG_WARN_BLOCK_CAPTURE_AUTORELEASING = YES;
				CLANG_WARN_BOOL_CONVERSION = YES;
				CLANG_WARN_COMMA = YES;
				CLANG_WARN_CONSTANT_CONVERSION = YES;
				CLANG_WARN_DEPRECATED_OBJC_IMPLEMENTATIONS = YES;
				CLANG_WARN_DIRECT_OBJC_ISA_USAGE = YES_ERROR;
				CLANG_WARN_DOCUMENTATION_COMMENTS = YES;
				CLANG_WARN_EMPTY_BODY = YES;
				CLANG_WARN_ENUM_CONVERSION = YES;
				CLANG_WARN_INFINITE_RECURSION = YES;
				CLANG_WARN_INT_CONVERSION = YES;
				CLANG_WARN_NON_LITERAL_NULL_CONVERSION = YES;
				CLANG_WARN_OBJC_IMPLICIT_RETAIN_SELF = YES;
				CLANG_WARN_OBJC_LITERAL_CONVERSION = YES;
				CLANG_WARN_OBJC_ROOT_CLASS = YES_ERROR;
				CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER = YES;
				CLANG_WARN_RANGE_LOOP_ANALYSIS = YES;
				CLANG_WARN_STRICT_PROTOTYPES = YES;
				CLANG_WARN_SUSPICIOUS_MOVE = YES;
				CLANG_WARN_UNGUARDED_AVAILABILITY = YES_AGGRESSIVE;
				CLANG_WARN_UNREACHABLE_CODE = YES;
				CLANG_WARN__DUPLICATE_METHOD_MATCH = YES;
				COPY_PHASE_STRIP = NO;
				DEBUG_INFORMATION_FORMAT = dwarf;
				ENABLE_STRICT_OBJC_MSGSEND = YES;
				ENABLE_TESTABILITY = YES;
				ENABLE_USER_SCRIPT_SANDBOXING = NO;
				GCC_C_LANGUAGE_STANDARD = gnu17;
				GCC_DYNAMIC_NO_PIC = NO;
				GCC_NO_COMMON_BLOCKS = YES;
				GCC_OPTIMIZATION_LEVEL = 0;
				GCC_PREPROCESSOR_DEFINITIONS = (
					"DEBUG=1",
					"$(inherited)",
				);
				GCC_WARN_64_TO_32_BIT_CONVERSION = YES;
				GCC_WARN_ABOUT_RETURN_TYPE = YES_ERROR;
				GCC_WARN_UNDEFINED_VARIABLES = YES;
				GCC_WARN_UNINITIALIZED_AUTOS = YES_AGGRESSIVE;
				GCC_WARN_UNUSED_FUNCTION = YES;
				GCC_WARN_UNUSED_VARIABLE = YES;
				IPHONEOS_DEPLOYMENT_TARGET = 16.0;
				MTL_ENABLE_DEBUG_INFO = INCLUDE_SOURCE;
				MTL_FAST_MATH = YES;
				ONLY_ACTIVE_ARCH = YES;
				SDKROOT = iphoneos;
				SWIFT_ACTIVE_COMPILATION_CONDITIONS = DEBUG;
				SWIFT_OPTIMIZATION_LEVEL = "-Onone";
			}};
			name = Debug;
		}};
		{PROJ_RELEASE_CONFIG_UUID} /* Release */ = {{
			isa = XCBuildConfiguration;
			buildSettings = {{
				ALWAYS_SEARCH_USER_PATHS = NO;
				CLANG_ANALYZER_NONNULL = YES;
				CLANG_CXX_LANGUAGE_STANDARD = "gnu++20";
				CLANG_ENABLE_MODULES = YES;
				CLANG_ENABLE_OBJC_ARC = YES;
				CLANG_WARN_BLOCK_CAPTURE_AUTORELEASING = YES;
				CLANG_WARN_BOOL_CONVERSION = YES;
				CLANG_WARN_COMMA = YES;
				CLANG_WARN_CONSTANT_CONVERSION = YES;
				CLANG_WARN_DEPRECATED_OBJC_IMPLEMENTATIONS = YES;
				CLANG_WARN_DIRECT_OBJC_ISA_USAGE = YES_ERROR;
				CLANG_WARN_DOCUMENTATION_COMMENTS = YES;
				CLANG_WARN_EMPTY_BODY = YES;
				CLANG_WARN_ENUM_CONVERSION = YES;
				CLANG_WARN_INFINITE_RECURSION = YES;
				CLANG_WARN_INT_CONVERSION = YES;
				CLANG_WARN_NON_LITERAL_NULL_CONVERSION = YES;
				CLANG_WARN_OBJC_IMPLICIT_RETAIN_SELF = YES;
				CLANG_WARN_OBJC_LITERAL_CONVERSION = YES;
				CLANG_WARN_OBJC_ROOT_CLASS = YES_ERROR;
				CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER = YES;
				CLANG_WARN_RANGE_LOOP_ANALYSIS = YES;
				CLANG_WARN_STRICT_PROTOTYPES = YES;
				CLANG_WARN_SUSPICIOUS_MOVE = YES;
				CLANG_WARN_UNGUARDED_AVAILABILITY = YES_AGGRESSIVE;
				CLANG_WARN_UNREACHABLE_CODE = YES;
				CLANG_WARN__DUPLICATE_METHOD_MATCH = YES;
				COPY_PHASE_STRIP = NO;
				DEBUG_INFORMATION_FORMAT = "dwarf-with-dsym";
				ENABLE_NS_ASSERTIONS = NO;
				ENABLE_STRICT_OBJC_MSGSEND = YES;
				ENABLE_USER_SCRIPT_SANDBOXING = NO;
				GCC_C_LANGUAGE_STANDARD = gnu17;
				GCC_NO_COMMON_BLOCKS = YES;
				GCC_WARN_64_TO_32_BIT_CONVERSION = YES;
				GCC_WARN_ABOUT_RETURN_TYPE = YES_ERROR;
				GCC_WARN_UNDEFINED_VARIABLES = YES;
				GCC_WARN_UNINITIALIZED_AUTOS = YES_AGGRESSIVE;
				GCC_WARN_UNUSED_FUNCTION = YES;
				GCC_WARN_UNUSED_VARIABLE = YES;
				IPHONEOS_DEPLOYMENT_TARGET = 16.0;
				MTL_ENABLE_DEBUG_INFO = NO;
				MTL_FAST_MATH = YES;
				SDKROOT = iphoneos;
				SWIFT_COMPILATION_MODE = "wholemodule";
				SWIFT_OPTIMIZATION_LEVEL = "-O";
				VALIDATE_PRODUCT = YES;
			}};
			name = Release;
		}};
		{APP_DEBUG_CONFIG_UUID} /* Debug */ = {{
			isa = XCBuildConfiguration;
			buildSettings = {{
				ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;
				ASSETCATALOG_COMPILER_GLOBAL_ACCENT_COLOR_NAME = AccentColor;
				CODE_SIGN_STYLE = Automatic;
				CURRENT_PROJECT_VERSION = 1;
				DEVELOPMENT_ASSET_PATHS = "";
				ENABLE_PREVIEWS = YES;
				GENERATE_INFOPLIST_FILE = NO;
				INFOPLIST_FILE = TGBank/Info.plist;
				LD_RUNPATH_SEARCH_PATHS = (
					"$(inherited)",
					"@executable_path/Frameworks",
				);
				MARKETING_VERSION = 1.0.0;
				PRODUCT_BUNDLE_IDENTIFIER = io.testgrid.tgbank;
				PRODUCT_NAME = "$(TARGET_NAME)";
				SWIFT_EMIT_LOC_STRINGS = YES;
				SWIFT_VERSION = 5.0;
				TARGETED_DEVICE_FAMILY = "1,2";
			}};
			name = Debug;
		}};
		{APP_RELEASE_CONFIG_UUID} /* Release */ = {{
			isa = XCBuildConfiguration;
			buildSettings = {{
				ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;
				ASSETCATALOG_COMPILER_GLOBAL_ACCENT_COLOR_NAME = AccentColor;
				CODE_SIGN_STYLE = Automatic;
				CURRENT_PROJECT_VERSION = 1;
				DEVELOPMENT_ASSET_PATHS = "";
				ENABLE_PREVIEWS = YES;
				GENERATE_INFOPLIST_FILE = NO;
				INFOPLIST_FILE = TGBank/Info.plist;
				LD_RUNPATH_SEARCH_PATHS = (
					"$(inherited)",
					"@executable_path/Frameworks",
				);
				MARKETING_VERSION = 1.0.0;
				PRODUCT_BUNDLE_IDENTIFIER = io.testgrid.tgbank;
				PRODUCT_NAME = "$(TARGET_NAME)";
				SWIFT_EMIT_LOC_STRINGS = YES;
				SWIFT_VERSION = 5.0;
				TARGETED_DEVICE_FAMILY = "1,2";
			}};
			name = Release;
		}};
		{TEST_DEBUG_CONFIG_UUID} /* Debug */ = {{
			isa = XCBuildConfiguration;
			buildSettings = {{
				CODE_SIGN_STYLE = Automatic;
				CURRENT_PROJECT_VERSION = 1;
				GENERATE_INFOPLIST_FILE = NO;
				INFOPLIST_FILE = TGBankUITests/Info.plist;
				LD_RUNPATH_SEARCH_PATHS = (
					"$(inherited)",
					"@executable_path/Frameworks",
					"@loader_path/Frameworks",
				);
				MARKETING_VERSION = 1.0;
				PRODUCT_BUNDLE_IDENTIFIER = io.testgrid.tgbank.TGBankUITests;
				PRODUCT_NAME = "$(TARGET_NAME)";
				SWIFT_EMIT_LOC_STRINGS = NO;
				SWIFT_VERSION = 5.0;
				TARGETED_DEVICE_FAMILY = "1,2";
				TEST_TARGET_NAME = TGBank;
			}};
			name = Debug;
		}};
		{TEST_RELEASE_CONFIG_UUID} /* Release */ = {{
			isa = XCBuildConfiguration;
			buildSettings = {{
				CODE_SIGN_STYLE = Automatic;
				CURRENT_PROJECT_VERSION = 1;
				GENERATE_INFOPLIST_FILE = NO;
				INFOPLIST_FILE = TGBankUITests/Info.plist;
				LD_RUNPATH_SEARCH_PATHS = (
					"$(inherited)",
					"@executable_path/Frameworks",
					"@loader_path/Frameworks",
				);
				MARKETING_VERSION = 1.0;
				PRODUCT_BUNDLE_IDENTIFIER = io.testgrid.tgbank.TGBankUITests;
				PRODUCT_NAME = "$(TARGET_NAME)";
				SWIFT_EMIT_LOC_STRINGS = NO;
				SWIFT_VERSION = 5.0;
				TARGETED_DEVICE_FAMILY = "1,2";
				TEST_TARGET_NAME = TGBank;
			}};
			name = Release;
		}};
/* End XCBuildConfiguration section */

/* Begin XCConfigurationList section */
		{PROJ_CONFIG_LIST_UUID} /* Build configuration list for PBXProject "TGBank" */ = {{
			isa = XCConfigurationList;
			buildConfigurations = (
				{PROJ_DEBUG_CONFIG_UUID} /* Debug */,
				{PROJ_RELEASE_CONFIG_UUID} /* Release */,
			);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		}};
		{APP_CONFIG_LIST_UUID} /* Build configuration list for PBXNativeTarget "TGBank" */ = {{
			isa = XCConfigurationList;
			buildConfigurations = (
				{APP_DEBUG_CONFIG_UUID} /* Debug */,
				{APP_RELEASE_CONFIG_UUID} /* Release */,
			);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		}};
		{TEST_CONFIG_LIST_UUID} /* Build configuration list for PBXNativeTarget "TGBankUITests" */ = {{
			isa = XCConfigurationList;
			buildConfigurations = (
				{TEST_DEBUG_CONFIG_UUID} /* Debug */,
				{TEST_RELEASE_CONFIG_UUID} /* Release */,
			);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		}};
/* End XCConfigurationList section */

	}};
	rootObject = {PROJ_UUID} /* Project object */;
}}
"""
    with open(os.path.join(XCODEPROJ_DIR, "project.pbxproj"), "w", encoding="utf-8") as f:
        f.write(project_pbxproj)

    # Shared scheme
    scheme_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Scheme
   LastUpgradeVersion = "1500"
   version = "1.7">
   <BuildAction
      parallelizeBuildables = "YES"
      buildImplicitDependencies = "YES">
      <BuildActionEntries>
         <BuildActionEntry
            buildForTesting = "YES"
            buildForRunning = "YES"
            buildForProfiling = "YES"
            buildForArchiving = "YES"
            buildForAnalyzing = "YES">
            <BuildableReference
               BuildableIdentifier = "primary"
               BlueprintIdentifier = "{APP_TARGET_UUID}"
               BuildableName = "TGBank.app"
               BlueprintName = "TGBank"
               ReferencedContainer = "container:TGBank.xcodeproj">
            </BuildableReference>
         </BuildActionEntry>
         <BuildActionEntry
            buildForTesting = "YES"
            buildForRunning = "NO"
            buildForProfiling = "NO"
            buildForArchiving = "NO"
            buildForAnalyzing = "NO">
            <BuildableReference
               BuildableIdentifier = "primary"
               BlueprintIdentifier = "{TEST_TARGET_UUID}"
               BuildableName = "TGBankUITests.xctest"
               BlueprintName = "TGBankUITests"
               ReferencedContainer = "container:TGBank.xcodeproj">
            </BuildableReference>
         </BuildActionEntry>
      </BuildActionEntries>
   </BuildAction>
   <TestAction
      buildConfiguration = "Debug"
      selectedDebuggerIdentifier = "Xcode.DebuggerFoundation.Debugger.LLDB"
      selectedLauncherIdentifier = "Xcode.DebuggerFoundation.Launcher.LLDB"
      shouldUseLaunchSchemeArgsEnv = "YES">
      <Testables>
         <TestableReference
            skipped = "NO">
            <BuildableReference
               BuildableIdentifier = "primary"
               BlueprintIdentifier = "{TEST_TARGET_UUID}"
               BuildableName = "TGBankUITests.xctest"
               BlueprintName = "TGBankUITests"
               ReferencedContainer = "container:TGBank.xcodeproj">
            </BuildableReference>
         </TestableReference>
      </Testables>
   </TestAction>
   <LaunchAction
      buildConfiguration = "Debug"
      selectedDebuggerIdentifier = "Xcode.DebuggerFoundation.Debugger.LLDB"
      selectedLauncherIdentifier = "Xcode.DebuggerFoundation.Launcher.LLDB"
      launchStyle = "0"
      useCustomWorkingDirectory = "NO"
      ignoresPersistentStateOnLaunch = "NO"
      debugDocumentVersioning = "YES"
      debugServiceExtension = "internal"
      allowLocationSimulation = "YES">
      <BuildableProductRunnable
         runnableDebuggingMode = "0">
         <BuildableReference
            BuildableIdentifier = "primary"
            BlueprintIdentifier = "{APP_TARGET_UUID}"
            BuildableName = "TGBank.app"
            BlueprintName = "TGBank"
            ReferencedContainer = "container:TGBank.xcodeproj">
         </BuildableReference>
      </BuildableProductRunnable>
   </LaunchAction>
   <ProfileAction
      buildConfiguration = "Release"
      shouldUseLaunchSchemeArgsEnv = "YES"
      savedToolIdentifier = ""
      useCustomWorkingDirectory = "NO"
      debugDocumentVersioning = "YES">
      <BuildableProductRunnable
         runnableDebuggingMode = "0">
         <BuildableReference
            BuildableIdentifier = "primary"
            BlueprintIdentifier = "{APP_TARGET_UUID}"
            BuildableName = "TGBank.app"
            BlueprintName = "TGBank"
            ReferencedContainer = "container:TGBank.xcodeproj">
         </BuildableReference>
      </BuildableProductRunnable>
   </ProfileAction>
   <AnalyzeAction
      buildConfiguration = "Debug">
   </AnalyzeAction>
   <ArchiveAction
      buildConfiguration = "Release"
      revealArchiveInOrganizer = "YES">
   </ArchiveAction>
</Scheme>
"""
    with open(os.path.join(XCSHARED_DIR, "TGBank.xcscheme"), "w", encoding="utf-8") as f:
        f.write(scheme_xml)

    # Lowercase alias symlink: tgbank.xcodeproj -> TGBank.xcodeproj
    lower_proj = os.path.join(IOS_DIR, "tgbank.xcodeproj")
    if os.path.lexists(lower_proj):
        if os.path.islink(lower_proj):
            os.unlink(lower_proj)
        elif os.path.isdir(lower_proj):
            shutil.rmtree(lower_proj)
    try:
        os.symlink("TGBank.xcodeproj", lower_proj)
        print("  [+] Created symlink: ios/tgbank.xcodeproj -> TGBank.xcodeproj")
    except Exception:
        # Fallback to copy if symlink not supported
        shutil.copytree(XCODEPROJ_DIR, lower_proj)
        print("  [+] Created copy: ios/tgbank.xcodeproj")

    # Also build a helper script for macOS / Xcode CLI
    build_sh_path = os.path.join(IOS_DIR, "build_ipa.sh")
    build_sh_content = """#!/usr/bin/env bash
# TG Bank Xcode IPA Build & Archive Script for macOS / TestGrid
set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "=== Building TG Bank with xcodebuild ==="
mkdir -p build

# 1. Build Archive
xcodebuild clean archive \\
  -project TGBank.xcodeproj \\
  -scheme TGBank \\
  -configuration Debug \\
  -destination 'generic/platform=iOS' \\
  -archivePath build/TGBank.xcarchive \\
  CODE_SIGNING_ALLOWED=NO \\
  CODE_SIGNING_REQUIRED=NO

echo "=== Extracting Payload into TGBank-debug.ipa ==="
rm -rf build/Payload build/TGBank-debug.ipa
mkdir -p build/Payload
cp -R build/TGBank.xcarchive/Products/Applications/TGBank.app build/Payload/
cd build
zip -q -r TGBank-debug.ipa Payload
echo "[SUCCESS] Generated build/TGBank-debug.ipa"
"""
    with open(build_sh_path, "w", encoding="utf-8") as f:
        f.write(build_sh_content)
    os.chmod(build_sh_path, 0o755)

    print(f"[SUCCESS] Generated complete Xcode project at:")
    print(f"  -> {XCODEPROJ_DIR}")
    print(f"  -> {lower_proj}")

if __name__ == "__main__":
    setup_assets_xcassets()
    setup_info_plist()
    generate_pbxproj()
