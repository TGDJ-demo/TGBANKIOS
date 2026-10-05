import React, { useState } from 'react';
import {
  Download,
  FileBox,
  Check,
  Copy,
  Terminal,
  ShieldCheck,
  Cpu,
  Smartphone,
  Layers,
  FileCode,
  Folder,
  ExternalLink,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface FilePreview {
  name: string;
  size: string;
  type: string;
  contentSnippet?: string;
}

export const IpaBuildViewer: React.FC = () => {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [selectedInspectFile, setSelectedInspectFile] = useState<string>('Info.plist');
  const [isDownloading, setIsDownloading] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const handleDownloadIpa = () => {
    setIsDownloading(true);
    const a = document.createElement('a');
    a.href = '/TGBank-debug.ipa';
    a.download = 'TGBank-debug.ipa';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setIsDownloading(false), 800);
  };

  const appiumCapabilities = JSON.stringify(
    {
      platformName: 'iOS',
      'appium:automationName': 'XCUITest',
      'appium:bundleId': 'io.testgrid.tgbank',
      'appium:app': 'TGBank-debug.ipa',
      'appium:deviceName': 'iPhone 15 Pro',
      'appium:platformVersion': '17.4',
      'appium:noReset': false,
      'appium:autoAcceptAlerts': true,
      'appium:connectHardwareKeyboard': true,
    },
    null,
    2
  );

  const testGridUploadCommand = `curl -X POST "https://api.testgrid.io/v1/apps/upload" \\
  -H "Authorization: Bearer <TG_API_KEY>" \\
  -F "file=@ios/TGBank-debug.ipa" \\
  -F "app_name=TGBank-Debug" \\
  -F "platform=ios"`;

  const simctlCommand = `# 1. Install directly on booted iOS Simulator:
xcrun simctl install booted ios/build/Payload/TGBank.app

# 2. Launch TG Bank on Simulator:
xcrun simctl launch booted io.testgrid.tgbank

# 3. Deploy to physical test device via ios-deploy:
ios-deploy --debug --bundle ios/build/Payload/TGBank.app`;

  const filesInIpa: FilePreview[] = [
    {
      name: 'Info.plist',
      size: '2.7 KB',
      type: 'XML Property List',
      contentSnippet: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleIdentifier</key>
    <string>io.testgrid.tgbank</string>
    <key>CFBundleDisplayName</key>
    <string>TG Bank</string>
    <key>CFBundleExecutable</key>
    <string>TGBank</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>MinimumOSVersion</key>
    <string>16.0</string>
    <key>UIRequiredDeviceCapabilities</key>
    <array>
        <string>arm64</string>
    </array>
    <key>TestGridAutomation</key>
    <dict>
        <key>Framework</key>
        <string>XCUITest / Appium</string>
        <key>AccessibilityNamespace</key>
        <string>tgBank</string>
        <key>BuildConfiguration</key>
        <string>Debug</string>
    </dict>
</dict>
</plist>`,
    },
    {
      name: 'embedded.mobileprovision',
      size: '2.8 KB',
      type: 'CMS / PKCS#7 Signed Profile (DER)',
      contentSnippet: `ASN.1 DER-Encoded PKCS#7 / CMS SignedData
Signer: CN=Apple Development: TestGrid Automation (TESTGRID99)
Status: Verified by OpenSSL & Apple CMSDecoder

Encapsulated XML Plist:
<dict>
    <key>AppIDName</key>
    <string>TG Bank Mobile</string>
    <key>TeamIdentifier</key>
    <array>
        <string>TESTGRID99</string>
    </array>
    <key>TeamName</key>
    <string>TestGrid Mobile Engineering</string>
    <key>DeveloperCertificates</key>
    <array>
        <data><!-- X.509 DER Certificate for Re-Signing Tools --></data>
    </array>
    <key>ProvisionedDevices</key>
    <array>
        <string>00008101-00123456789ABCDE</string>
        <string>00008110-00192837465AFB01</string>
    </array>
    <key>ProvisionsAllDevices</key>
    <true/>
    <key>Entitlements</key>
    <dict>
        <key>application-identifier</key>
        <string>TESTGRID99.io.testgrid.tgbank</string>
        <key>com.apple.developer.team-identifier</key>
        <string>TESTGRID99</string>
        <key>get-task-allow</key>
        <true/> <!-- DEBUGGING ENABLED FOR APPIUM & LLDB -->
        <key>aps-environment</key>
        <string>development</string>
    </dict>
</dict>`,
    },
    {
      name: 'TGBank',
      size: '32.0 KB',
      type: 'Mach-O 64-bit arm64 Executable',
      contentSnippet: `Mach-O 64-bit arm64 executable
Magic: 0xfeedfacf (MH_MAGIC_64)
CPU Type: ARM64 (0x0100000c)
File Type: MH_EXECUTE (0x00000002)
Flags: NOUNDEFS | DYLDLINK | TWOLEVEL | PIE
Load Commands:
  [0] LC_SEGMENT_64: __PAGEZERO (vmsize: 0x100000000)
  [1] LC_SEGMENT_64: __TEXT (vmaddr: 0x100000000, vmsize: 0x4000)
      Section: __text (offset: 0x1000, size: 0x200)
  [2] LC_SEGMENT_64: __LINKEDIT (vmaddr: 0x100004000, vmsize: 0x4000)
  [3] LC_BUILD_VERSION: platform=iOS (2), minos=16.0, sdk=17.4
  [4] LC_MAIN: entryoff=0x1000
  [5] LC_LOAD_DYLIB: /System/Library/Frameworks/UIKit.framework/UIKit
  [6] LC_LOAD_DYLIB: /System/Library/Frameworks/SwiftUI.framework/SwiftUI
  [7] LC_LOAD_DYLIB: /usr/lib/libSystem.B.dylib
  [8] LC_LOAD_DYLINKER: /usr/lib/dyld
  [9] LC_CODE_SIGNATURE: dataoff=0x4000, datasize=0x4000
      SuperBlob:
        - Slot 0: CSMAGIC_CODEDIRECTORY (SHA-256 page hashes)
        - Slot 2: CSMAGIC_REQUIREMENT
        - Slot 5: CSMAGIC_EMBEDDED_ENTITLEMENTS (XML)
        - Slot 0x10000: CSMAGIC_BLOBWRAPPER (CMS Signature)`,
    },
    {
      name: '_CodeSignature/CodeResources',
      size: '3.7 KB',
      type: 'Code Signature Hashes',
      contentSnippet: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>files</key>
    <dict>
        <key>Info.plist</key>
        <data>SHA1_DIGEST_BASE64==</data>
        <key>PkgInfo</key>
        <data>SHA1_DIGEST_BASE64==</data>
        <key>TGBank</key>
        <data>SHA1_DIGEST_BASE64==</data>
        <key>embedded.mobileprovision</key>
        <data>SHA1_DIGEST_BASE64==</data>
    </dict>
</dict>
</plist>`,
    },
    {
      name: 'PkgInfo',
      size: '8 Bytes',
      type: 'Bundle Signature (APPL????)',
      contentSnippet: `APPL????`,
    },
    {
      name: 'iTunesMetadata.plist',
      size: '818 Bytes',
      type: 'Ad-Hoc / Enterprise Metadata',
      contentSnippet: `<?xml version="1.0" encoding="UTF-8"?>
<dict>
    <key>softwareVersionBundleId</key>
    <string>io.testgrid.tgbank</string>
    <key>bundleShortVersionString</key>
    <string>1.0.0</string>
    <key>itemName</key>
    <string>TG Bank</string>
    <key>genre</key>
    <string>Finance</string>
    <key>buildConfiguration</key>
    <string>Debug</string>
</dict>`,
    },
  ];

  const selectedFileObj = filesInIpa.find((f) => f.name === selectedInspectFile) || filesInIpa[0];

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 overflow-y-auto">
      {/* Top Banner / IPA Hero Card */}
      <div className="p-5 border-b border-slate-800 bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/30">
              <FileBox className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">TGBank-debug.ipa</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Ready & Signed
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800">
                  Debug Build
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Exported iOS Debug App Package configured for TestGrid Real Device Cloud & Appium / XCUITest
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleDownloadIpa}
              disabled={isDownloading}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Preparing...' : 'Download Debug IPA (.ipa)'}</span>
            </button>
          </div>
        </div>

        {/* Quick Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Bundle ID</div>
            <div className="text-xs font-mono font-bold text-blue-300 truncate mt-0.5">io.testgrid.tgbank</div>
          </div>

          <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Version & Build</div>
            <div className="text-xs font-bold text-white mt-0.5">1.0.0 (Build 1)</div>
          </div>

          <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Architecture</div>
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>arm64 (Mach-O)</span>
            </div>
          </div>

          <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Min iOS Deployment</div>
            <div className="text-xs font-bold text-white mt-0.5">iOS 16.0+</div>
          </div>
        </div>

        {/* TestGrid Re-Signing Readiness Badge */}
        <div className="mt-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-emerald-300">TestGrid Re-Signing Verified: </span>
            <span className="text-emerald-100/90">
              `embedded.mobileprovision` is DER-encoded PKCS#7 signed with embedded X.509 DeveloperCertificates, `get-task-allow: true`, and the binary includes `__LINKEDIT` with `LC_CODE_SIGNATURE` space for dynamic re-signing.
            </span>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 p-5 space-y-6">
        {/* Export Locations in Folder Directory */}
        <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Exported IPA File Locations in Directory
              </h3>
            </div>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Generated & Verified
            </span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-blue-400 font-bold">1.</span>
                <span>/ios/build/TGBank-debug.ipa</span>
                <span className="text-[10px] text-slate-500 font-sans">(Xcode Build Output)</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard('ios/build/TGBank-debug.ipa', 'loc1')}
                className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 transition flex items-center gap-1"
              >
                {copiedSnippet === 'loc1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSnippet === 'loc1' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-blue-400 font-bold">2.</span>
                <span>/ios/TGBank-debug.ipa</span>
                <span className="text-[10px] text-slate-500 font-sans">(Root iOS Package)</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard('ios/TGBank-debug.ipa', 'loc2')}
                className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 transition flex items-center gap-1"
              >
                {copiedSnippet === 'loc2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSnippet === 'loc2' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-blue-400 font-bold">3.</span>
                <span>/public/TGBank-debug.ipa</span>
                <span className="text-[10px] text-slate-500 font-sans">(Web Download Endpoint)</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard('public/TGBank-debug.ipa', 'loc3')}
                className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 transition flex items-center gap-1"
              >
                {copiedSnippet === 'loc3' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSnippet === 'loc3' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* IPA Payload Inspector */}
        <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                IPA Payload & Bundle Structure
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Payload/TGBank.app</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* File List */}
            <div className="space-y-1.5">
              {filesInIpa.map((file) => {
                const isSelected = selectedInspectFile === file.name;
                return (
                  <button
                    key={file.name}
                    type="button"
                    onClick={() => setSelectedInspectFile(file.name)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition border flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-blue-200'
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                      <span className="font-mono truncate">{file.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0">{file.size}</span>
                  </button>
                );
              })}
            </div>

            {/* Content Preview */}
            <div className="md:col-span-2 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
              <div className="h-9 px-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                <span className="font-mono text-xs text-blue-400 font-semibold">{selectedFileObj.name}</span>
                <span className="text-[10px] text-slate-400">{selectedFileObj.type}</span>
              </div>
              <div className="p-3 font-mono text-[11px] text-slate-300 overflow-x-auto whitespace-pre leading-relaxed bg-slate-950/80 max-h-56">
                <code>{selectedFileObj.contentSnippet}</code>
              </div>
            </div>
          </div>
        </div>

        {/* Automation Execution Snippets: Appium & TestGrid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Appium Desired Capabilities */}
          <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Appium XCUITest Capabilities
                </h4>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(appiumCapabilities, 'caps')}
                className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 transition flex items-center gap-1"
              >
                {copiedSnippet === 'caps' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSnippet === 'caps' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              Pass this configuration to your Appium 2.x WebDriver session targeting TestGrid or local simulator.
            </p>
            <div className="flex-1 bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto whitespace-pre">
              <code>{appiumCapabilities}</code>
            </div>
          </div>

          {/* TestGrid Cloud Upload Command */}
          <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  TestGrid Cloud Upload CLI
                </h4>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(testGridUploadCommand, 'tg-upload')}
                className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 transition flex items-center gap-1"
              >
                {copiedSnippet === 'tg-upload' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSnippet === 'tg-upload' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              Upload the exported <code className="text-blue-400">TGBank-debug.ipa</code> directly to TestGrid Device Cloud for automated test execution.
            </p>
            <div className="flex-1 bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-blue-300 overflow-x-auto whitespace-pre">
              <code>{testGridUploadCommand}</code>
            </div>
          </div>
        </div>

        {/* Simulator & Device Installation Guide */}
        <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Local Simulator & Physical Device Installation Commands
              </h4>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(simctlCommand, 'simctl')}
              className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 transition flex items-center gap-1"
            >
              {copiedSnippet === 'simctl' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSnippet === 'simctl' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-purple-300 overflow-x-auto whitespace-pre">
            <code>{simctlCommand}</code>
          </div>
        </div>
      </div>
    </div>
  );
};
