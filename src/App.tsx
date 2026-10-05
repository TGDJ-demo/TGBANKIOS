import React, { useState } from 'react';
import { BankProvider, useBank } from './services/BankContext';
import { IOSDeviceFrame } from './components/ios/IOSDeviceFrame';
import { AutomationInspector } from './components/testgrid/AutomationInspector';
import { TestRunner } from './components/testgrid/TestRunner';
import { SwiftCodeViewer } from './components/testgrid/SwiftCodeViewer';
import { IpaBuildViewer } from './components/testgrid/IpaBuildViewer';
import {
  Layers,
  Play,
  FileCode,
  Shield,
  Smartphone,
  Sliders,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Laptop,
  FileBox,
  Download,
} from 'lucide-react';

type DevTab = 'inspector' | 'runner' | 'swift' | 'ipa';

const AppContent: React.FC = () => {
  const { resetDemoData, setActiveSubscreen } = useBank();
  const [activeDevTab, setActiveDevTab] = useState<DevTab>('inspector');
  const [showDevPanel, setShowDevPanel] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation / App Header */}
      <header className="h-14 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
            <span className="font-extrabold text-white text-xs tracking-wider">TG</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm text-white tracking-tight">TG Bank</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800/80">
                Native iOS & TestGrid Suite
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              SwiftUI Architecture • Appium/XCUITest Contracts • Deterministic Banking State
            </p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-2">
          {/* Direct Download Debug IPA Button */}
          <a
            href="/TGBank-debug.ipa"
            download="TGBank-debug.ipa"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition active:scale-95"
            title="Download Exported iOS Debug IPA for Appium/TestGrid"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Debug IPA</span>
            <span className="text-[10px] bg-emerald-800/80 px-1 py-0.2 rounded text-emerald-100 hidden md:inline font-mono">
              .ipa
            </span>
          </a>

          <button
            type="button"
            onClick={() => setActiveSubscreen('testControls')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/80 text-purple-300 text-xs font-semibold transition"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edge-Case Controls</span>
          </button>

          <button
            type="button"
            onClick={resetDemoData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            title="Reset All Balances & State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset State</span>
          </button>

          <button
            type="button"
            onClick={() => setShowDevPanel(!showDevPanel)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition lg:hidden"
          >
            <Laptop className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Dual-Pane Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Pane: Interactive iOS Device Simulator */}
        <div className="flex-1 overflow-y-auto flex items-center justify-center p-4 sm:p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
          <div className="w-full flex flex-col items-center">
            <IOSDeviceFrame />
            <p className="text-[11px] text-slate-500 mt-4 text-center">
              Fully interactive iPhone 15 Pro simulator with 100% synchronized deterministic state.
            </p>
          </div>
        </div>

        {/* Right Pane: TestGrid Engineering Workbench */}
        <div
          className={`${
            showDevPanel ? 'flex' : 'hidden'
          } lg:flex w-full lg:w-[540px] xl:w-[600px] flex-col bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 shrink-0 h-[600px] lg:h-auto overflow-hidden`}
        >
          {/* Workbench Tabs */}
          <div className="h-11 bg-slate-950/80 border-b border-slate-800 px-3 flex items-center justify-between shrink-0">
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setActiveDevTab('inspector')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeDevTab === 'inspector'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Contracts Inspector</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDevTab('runner')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeDevTab === 'runner'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>Automation Runner</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDevTab('swift')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeDevTab === 'swift'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Swift / Xcode</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDevTab('ipa')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeDevTab === 'ipa'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-400 hover:text-emerald-200 hover:bg-slate-800'
                }`}
              >
                <FileBox className="w-3.5 h-3.5" />
                <span className="flex items-center gap-1">
                  <span>Debug IPA</span>
                  <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-700/80 px-1 py-0.2 rounded uppercase">
                    Ready
                  </span>
                </span>
              </button>
            </div>
          </div>

          {/* Workbench Body */}
          <div className="flex-1 overflow-hidden">
            {activeDevTab === 'inspector' && <AutomationInspector />}
            {activeDevTab === 'runner' && <TestRunner />}
            {activeDevTab === 'swift' && <SwiftCodeViewer />}
            {activeDevTab === 'ipa' && <IpaBuildViewer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BankProvider>
      <AppContent />
    </BankProvider>
  );
}
