import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Share2, PlusSquare, X, Check, Laptop } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  // If already installed as standalone PWA
  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-2xs">
        <Check className="w-3.5 h-3.5 text-emerald-600" />
        <span className="hidden sm:inline">ئەپەکە دامەزراوە</span>
        <span className="sm:hidden">دامەزراوە</span>
      </div>
    );
  }

  const handleButtonClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95 animate-pulse"
        title="دابەزاندنی کاک مانگا وەکوو ئەپڵیکەیشن لەسەر مۆبایل یان کۆمپیوتەر"
      >
        <Download className="w-4 h-4" />
        <span>دابەزاندنی ئەپ (Install)</span>
      </button>

      {/* Install Instructions Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-amber-200 text-right relative space-y-4">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 left-4 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-300 flex items-center justify-center text-2xl shadow-xs">
                🐮
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  چۆن کاک مانگا بکەیت بە ئەپ (App)؟
                </h3>
                <p className="text-xs text-stone-500">
                  لەسەر مۆبایلەکەت (ئایفۆن یان ئەندرۆید) وەکوو بەرنامەیەکی ڕاستەقینە کار دەکات
                </p>
              </div>
            </div>

            {/* Platform Guides */}
            <div className="space-y-3 pt-2">
              {/* iPhone / iPad Guide */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-2">
                <div className="font-bold text-amber-950 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-amber-700" />
                  <span>بۆ مۆبایلی ئایفۆن (iPhone / Safari):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-stone-700 leading-relaxed pr-1">
                  <li>لەسەر وێبگەڕی Safari دوگمەی <strong>هاوبەشکردن (Share <Share2 className="w-3 h-3 inline text-amber-700" />)</strong> لە خوارەوە دابگرە.</li>
                  <li>بچۆ خوارەوە و دەست لەسەر <strong>«Add to Home Screen»</strong> بدە.</li>
                  <li>لە بەشی سەرەوە دەست لەسەر <strong>«Add»</strong> بدە؛ ئایکۆنی کاک مانگا دەچێتە سەر شاشەی مۆبایلەکەت!</li>
                </ol>
              </div>

              {/* Android Guide */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2">
                <div className="font-bold text-emerald-950 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-700" />
                  <span>بۆ مۆبایلی ئەندرۆید (Android / Chrome):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-stone-700 leading-relaxed pr-1">
                  <li>دەست لەسەر <strong>سێ خاڵەکەی سەرەوە (⋮)</strong> لە Chrome بدە.</li>
                  <li>هەڵبژاردنی <strong>«Install app»</strong> یان <strong>«Add to Home screen»</strong> دابگرە.</li>
                  <li>دوگمەی <strong>Install</strong> دابگرە تا بە تەواوی دابەزێت.</li>
                </ol>
              </div>

              {/* Computer / Desktop Guide */}
              <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200 text-xs space-y-2">
                <div className="font-bold text-sky-950 flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-sky-700" />
                  <span>بۆ کۆمپیوتەر (Chrome / Edge / Windows / Mac):</span>
                </div>
                <p className="text-stone-700 leading-relaxed">
                  لە بەشی سەرەوەی ناونیشانی وێبگەڕەکە (Address bar)، کرتە لەسەر ئایکۆنی کۆمپیوتەر یان <strong>«Install App»</strong> بکە.
                </p>
              </div>
            </div>

            {/* Action button */}
            {isInstallable && (
              <button
                onClick={async () => {
                  await install();
                  setShowModal(false);
                }}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>دابەزاندنی یەکسەر (Install Now)</span>
              </button>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all"
            >
              داخستن
            </button>
          </div>
        </div>
      )}
    </>
  );
};
