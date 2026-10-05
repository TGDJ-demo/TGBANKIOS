import React, { useState } from 'react';
import { SWIFT_FILES } from '../../swift_codebase/swiftFiles';
import { Folder, FileCode, Download, Copy, Check, ExternalLink, Code, FileBox } from 'lucide-react';
import JSZip from 'jszip';

export const SwiftCodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string>('Package.swift');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const currentFileContent = SWIFT_FILES[selectedFile] || '// File not found';

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(currentFileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadIpa = () => {
    const a = document.createElement('a');
    a.href = '/TGBank-debug.ipa';
    a.download = 'TGBank-debug.ipa';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder('TGBank-iOS');

      Object.entries(SWIFT_FILES).forEach(([path, content]) => {
        folder?.file(path, content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'TGBank-Native-iOS-Xcode.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to create zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const fileList = Object.keys(SWIFT_FILES);

  return (
    <div className="flex h-full bg-slate-900 border-l border-slate-800 text-slate-100 overflow-hidden">
      {/* File Tree Sidebar */}
      <div className="w-56 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-3 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Folder className="w-4 h-4 text-amber-400" />
            <span>TGBank Native iOS</span>
          </span>
          <span className="text-[10px] text-slate-400">{fileList.length} files</span>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {fileList.map((filePath) => {
            const isSelected = selectedFile === filePath;
            const fileName = filePath.split('/').pop() || filePath;
            const isTest = filePath.includes('Tests');

            return (
              <button
                key={filePath}
                type="button"
                onClick={() => setSelectedFile(filePath)}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs transition ${
                  isSelected
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <FileCode
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isSelected ? 'text-white' : isTest ? 'text-purple-400' : 'text-blue-400'
                  }`}
                />
                <span className="truncate">{fileName}</span>
              </button>
            );
          })}
        </div>

        {/* Download Actions */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <button
            type="button"
            onClick={handleDownloadIpa}
            className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition"
          >
            <FileBox className="w-3.5 h-3.5" />
            <span>Download Debug IPA</span>
          </button>

          <button
            type="button"
            disabled={isZipping}
            onClick={handleDownloadZip}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-700/80 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isZipping ? 'Archiving...' : 'Download Xcode (.zip)'}</span>
          </button>
        </div>
      </div>

      {/* Code Editor Preview */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
        {/* Editor Tab Bar */}
        <div className="h-10 px-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-blue-400 font-semibold">{selectedFile}</span>
            <span className="text-[10px] text-slate-500 font-mono">
              Swift 6.0 / SwiftUI / iOS 17+
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>

        {/* Syntax-colored Swift Code Content */}
        <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre selection:bg-blue-600 selection:text-white">
          <code>{currentFileContent}</code>
        </div>
      </div>
    </div>
  );
};
