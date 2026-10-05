import React, { useState, useEffect, useRef } from 'react';
import { X, Zap, RefreshCw, Camera, AlertCircle } from 'lucide-react';

interface QRScannerModalProps {
  onScanned: (vpa: string, merchant: string, amount: number) => void;
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ onScanned, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setHasCamera(false);
          return;
        }
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasCamera(true);
        }
      } catch (err) {
        setHasCamera(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  return (
    <div
      data-accessibility-id="tgBank.qrScanner.screen"
      className="fixed inset-0 z-50 bg-black flex flex-col justify-between text-white"
    >
      {/* Top Bar Controls */}
      <div className="flex items-center justify-between p-4 z-10 bg-gradient-to-b from-black/80 to-transparent">
        <button
          type="button"
          data-accessibility-id="tgBank.qrScanner.closeButton"
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            data-accessibility-id="tgBank.qrScanner.flashButton"
            onClick={() => setTorchOn(!torchOn)}
            className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition ${
              torchOn ? 'bg-amber-400 text-black' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Zap className="w-5 h-5" />
          </button>

          <button
            type="button"
            data-accessibility-id="tgBank.qrScanner.switchCameraButton"
            onClick={() => setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition text-white"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Camera Viewport / Scanning Overlay */}
      <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden">
        {hasCamera ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-slate-400">
            <Camera className="w-12 h-12 mb-3 text-slate-600" />
            <p className="text-xs">Camera preview active or simulated</p>
          </div>
        )}

        {/* Animated Scanner Reticle */}
        <div
          data-accessibility-id="tgBank.qrScanner.reticle"
          className="relative w-64 h-64 border-2 border-purple-400 rounded-3xl z-10 flex items-center justify-center shadow-[0_0_0_9999px_rgba(0,0,0,0.65)]"
        >
          {/* Corner highlights */}
          <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-purple-400 rounded-tl-xl"></div>
          <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-purple-400 rounded-tr-xl"></div>
          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-purple-400 rounded-bl-xl"></div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-purple-400 rounded-br-xl"></div>

          {/* Laser line */}
          <div className="w-56 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-[0_0_8px_#c084fc] animate-pulse"></div>
        </div>

        <p className="relative z-10 text-xs text-white/80 font-medium mt-6 drop-shadow">
          Align any UPI QR code inside frame
        </p>
      </div>

      {/* Deterministic Simulation Shortcuts for TestGrid Automation */}
      <div className="p-4 z-10 bg-gradient-to-t from-black via-black/90 to-transparent space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] text-purple-300 font-semibold justify-center">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Automated Testing: Tap QR Scenario</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            data-accessibility-id="tgBank.qrScanner.demoMerchant1"
            onClick={() => onScanned('merchant@tg', 'TG Demo Store', 125.0)}
            className="p-2 bg-white/10 hover:bg-white/20 active:scale-95 transition rounded-xl text-center border border-white/10"
          >
            <span className="block text-xs font-bold text-white">TG Demo Store</span>
            <span className="text-[10px] text-purple-300">$125.00</span>
          </button>

          <button
            type="button"
            data-accessibility-id="tgBank.qrScanner.demoMerchant2"
            onClick={() => onScanned('coffee@tg', 'Starbucks Coffee', 14.5)}
            className="p-2 bg-white/10 hover:bg-white/20 active:scale-95 transition rounded-xl text-center border border-white/10"
          >
            <span className="block text-xs font-bold text-white">Starbucks</span>
            <span className="text-[10px] text-amber-300">$14.50</span>
          </button>

          <button
            type="button"
            data-accessibility-id="tgBank.qrScanner.demoMerchant3"
            onClick={() => onScanned('cloud@tg', 'TechGrid Cloud', 499.0)}
            className="p-2 bg-white/10 hover:bg-white/20 active:scale-95 transition rounded-xl text-center border border-white/10"
          >
            <span className="block text-xs font-bold text-white">TechGrid</span>
            <span className="text-[10px] text-blue-300">$499.00</span>
          </button>
        </div>
      </div>
    </div>
  );
};
