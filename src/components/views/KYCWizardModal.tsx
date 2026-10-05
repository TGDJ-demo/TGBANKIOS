import React, { useState, useRef, useEffect } from 'react';
import { useBank } from '../../services/BankContext';
import {
  CheckCircle2,
  ChevronLeft,
  Camera,
  Upload,
  User,
  ShieldCheck,
  FileCheck,
  Sparkles,
  X,
} from 'lucide-react';

export const KYCWizardModal: React.FC = () => {
  const { user, completeKYC, setActiveSubscreen } = useBank();

  const [step, setStep] = useState<number>(1); // 1: Personal Info, 2: Doc Upload, 3: Doc Confirmation, 4: Selfie, 5: Review, 6: Completed
  const [fullName, setFullName] = useState(user.name);
  const [dob, setDob] = useState(user.dob);
  const [address, setAddress] = useState(user.address);
  const [docType, setDocType] = useState('Passport');
  const [docUploaded, setDocUploaded] = useState(false);
  const [selfieCaptured, setSelfieCaptured] = useState(false);
  const [showFaceScanner, setShowFaceScanner] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (showFaceScanner) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'user' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = s;
        })
        .catch(() => {});
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [showFaceScanner]);

  const handleCaptureFromCamera = () => {
    setSelfieCaptured(true);
    setShowFaceScanner(false);
  };

  const handleFinalSubmit = () => {
    completeKYC();
    setStep(6);
  };

  return (
    <div
      data-accessibility-id="tgBank.kyc.screen"
      className="flex-1 bg-slate-50 dark:bg-slate-950 p-4 space-y-4 overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveSubscreen(null)}
          className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Exit</span>
        </button>
        <span className="text-sm font-bold text-slate-900 dark:text-white">KYC Verification</span>
        <div className="w-12"></div>
      </div>

      {/* Progress Bars (6 Steps) */}
      <div className="grid grid-cols-6 gap-1 px-1">
        {[1, 2, 3, 4, 5, 6].map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all ${
              step >= s ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Personal Information */}
      {step === 1 && (
        <div
          data-accessibility-id="tgBank.kyc.wizardCard"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <User className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Step 1 — Personal Identification
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                data-accessibility-id="tgBank.kyc.fullNameField"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Sanjay G"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Date of Birth
              </label>
              <input
                type="text"
                data-accessibility-id="tgBank.kyc.dateOfBirthField"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                placeholder="14 Aug 1988"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Residential Address
              </label>
              <input
                type="text"
                data-accessibility-id="tgBank.kyc.addressField"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="458 Tech Park Blvd, Suite 200, San Jose, CA 95110"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="button"
            data-accessibility-id="tgBank.kyc.step1.nextButton"
            onClick={() => setStep(2)}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition"
          >
            Continue to Document Upload
          </button>
        </div>
      )}

      {/* Step 2: Document Upload */}
      {step === 2 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Upload className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Step 2 — Identity Document
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Document Type
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              >
                <option value="Passport">Passport</option>
                <option value="Driver's License">Driver's License</option>
                <option value="National Identity Card">National Identity Card</option>
              </select>
            </div>

            <button
              type="button"
              data-accessibility-id="tgBank.kyc.uploadDocumentButton"
              onClick={() => setDocUploaded(true)}
              className={`w-full py-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition ${
                docUploaded
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'
                  : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 text-slate-500'
              }`}
            >
              {docUploaded ? (
                <>
                  <CheckCircle2 className="w-8 h-8 mb-2" />
                  <span className="text-xs font-bold">Document Selected: {docType}_Scan.pdf</span>
                  <span className="text-[10px] text-emerald-600">Simulated OCR Verified (100% Match)</span>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 mb-2" />
                  <span className="text-xs font-semibold">Simulate Document Upload</span>
                  <span className="text-[10px] text-slate-400">PDF, JPG, or PNG up to 10MB</span>
                </>
              )}
            </button>

            {docUploaded && (
              <div
                data-accessibility-id="tgBank.kyc.documentUploaded"
                className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Document verified by automated OCR engine.</span>
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={!docUploaded}
            data-accessibility-id="tgBank.kyc.step2.nextButton"
            onClick={() => setStep(3)}
            className={`w-full py-3 font-bold rounded-xl text-xs shadow-md transition ${
              docUploaded
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Continue to Document Confirmation
          </button>
        </div>
      )}

      {/* Step 3: Document Confirmation */}
      {step === 3 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <FileCheck className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Step 3 — Document Confirmation
            </h3>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Document Type</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{docType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Document Number</span>
              <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                USA-P45889012
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Issuing Country</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">United States</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Expiry Date</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">2032-10-15</span>
            </div>
          </div>

          <button
            type="button"
            data-accessibility-id="tgBank.kyc.step3.nextButton"
            onClick={() => setStep(4)}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition"
          >
            Confirm & Proceed to Selfie
          </button>
        </div>
      )}

      {/* Step 4: Selfie & Liveness */}
      {step === 4 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm text-center">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 text-left">
            <Camera className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Step 4 — Biometric Liveness & Selfie
            </h3>
          </div>

          {/* Selfie Circle */}
          <div className="w-32 h-32 rounded-full border-4 border-dashed border-blue-500/40 mx-auto flex items-center justify-center bg-blue-50 dark:bg-blue-950/40 overflow-hidden">
            {selfieCaptured ? (
              <div className="flex flex-col items-center text-emerald-600">
                <CheckCircle2 className="w-12 h-12" />
                <span className="text-[10px] font-bold mt-1">Verified</span>
              </div>
            ) : (
              <User className="w-16 h-16 text-blue-400" />
            )}
          </div>

          <div className="space-y-2">
            <button
              type="button"
              data-accessibility-id="tgBank.kyc.captureSelfieButton"
              onClick={() => setShowFaceScanner(true)}
              className="w-full py-2.5 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-600 dark:text-blue-400 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Camera className="w-4 h-4" />
              <span>Capture Native Camera Selfie</span>
            </button>

            <button
              type="button"
              data-accessibility-id="tgBank.kyc.simulateSelfieButton"
              onClick={() => setSelfieCaptured(true)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Simulate Verified Selfie (Automation)</span>
            </button>
          </div>

          <button
            type="button"
            disabled={!selfieCaptured}
            data-accessibility-id="tgBank.kyc.step4.nextButton"
            onClick={() => setStep(5)}
            className={`w-full py-3 font-bold rounded-xl text-xs shadow-md transition ${
              selfieCaptured
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Continue to Final Review
          </button>
        </div>
      )}

      {/* Step 5: Review */}
      {step === 5 && (
        <div
          data-accessibility-id="tgBank.kyc.reviewCard"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Step 5 — Review KYC Information
            </h3>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Full Name</span>
              <span
                data-accessibility-id="tgBank.kyc.reviewName"
                className="font-bold text-slate-800 dark:text-slate-200"
              >
                {fullName}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Date of Birth</span>
              <span
                data-accessibility-id="tgBank.kyc.reviewDob"
                className="font-medium text-slate-800 dark:text-slate-200"
              >
                {dob}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Address</span>
              <span
                data-accessibility-id="tgBank.kyc.reviewAddress"
                className="font-medium text-slate-800 dark:text-slate-200 text-right truncate max-w-[200px]"
              >
                {address}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Document</span>
              <span
                data-accessibility-id="tgBank.kyc.reviewDocument"
                className="font-bold text-emerald-600"
              >
                {docType} (Verified)
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Biometric Liveness</span>
              <span
                data-accessibility-id="tgBank.kyc.reviewSelfie"
                className="font-bold text-emerald-600"
              >
                Passed (100% Match)
              </span>
            </div>
          </div>

          <button
            type="button"
            data-accessibility-id="tgBank.kyc.submitButton"
            onClick={handleFinalSubmit}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Submit KYC Profile</span>
          </button>
        </div>
      )}

      {/* Step 6: Completed */}
      {step === 6 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h3
              data-accessibility-id="tgBank.kyc.completedTitle"
              className="text-lg font-bold text-slate-900 dark:text-white"
            >
              KYC Completed Successfully
            </h3>
            <p
              data-accessibility-id="tgBank.kyc.completedMessage"
              className="text-xs text-slate-500 dark:text-slate-400 mt-1"
            >
              Your demo KYC profile is fully verified and active for global banking transactions.
            </p>
          </div>

          <button
            type="button"
            data-accessibility-id="tgBank.kyc.doneButton"
            onClick={() => setActiveSubscreen(null)}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-500/20 transition"
          >
            Done
          </button>
        </div>
      )}

      {/* Face Scanner Modal Overlay */}
      {showFaceScanner && (
        <div
          data-accessibility-id="tgBank.faceScanner.screen"
          className="fixed inset-0 z-50 bg-black flex flex-col justify-between text-white"
        >
          <div className="flex justify-between items-center p-4">
            <button
              type="button"
              data-accessibility-id="tgBank.faceScanner.closeButton"
              onClick={() => setShowFaceScanner(false)}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold">Position your face inside the oval</span>
            <div className="w-10"></div>
          </div>

          <div className="relative flex-1 flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              data-accessibility-id="tgBank.faceScanner.faceGuide"
              className="w-60 h-80 border-4 border-emerald-400 rounded-full z-10 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)]"
            />
          </div>

          <div className="p-6 flex justify-center bg-black/80">
            <button
              type="button"
              data-accessibility-id="tgBank.faceScanner.shutterButton"
              onClick={handleCaptureFromCamera}
              className="w-16 h-16 rounded-full border-4 border-white bg-emerald-500 active:scale-95 transition"
            />
          </div>
        </div>
      )}
    </div>
  );
};
