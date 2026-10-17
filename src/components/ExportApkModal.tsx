import React, { useState } from 'react';
import { Github, Download, FileCode, Check, Copy, ExternalLink, X, Smartphone, Sparkles } from 'lucide-react';

interface ExportApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportApkModal: React.FC<ExportApkModalProps> = ({ isOpen, onClose }) => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyText = (text: string, step: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const gitCommands = `# هەنگاوەکانی بردن بۆ گێتهەب:
git init
git add .
git commit -m "Initial commit for Kak Manga App"
git branch -M main
git remote add origin https://github.com/USERNAME/kak-manga.git
git push -u origin main`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl border border-amber-200 text-right relative space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center text-2xl shadow-sm">
            <Github className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">
              دروستکردنی پەڕگەی APK لە ڕێگەی گێتهەب (GitHub to APK)
            </h3>
            <p className="text-xs text-stone-500">
              تەواوی فایل و ڕێکخستنی ئۆتۆماتیکی GitHub Actions بۆ پڕۆژەکە زیاد کراوە
            </p>
          </div>
        </div>

        {/* 2 Ways to Get APK */}
        <div className="space-y-4 pt-2">
          {/* Method 1: GitHub Actions Automatic APK Build */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-amber-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>ڕێگای یەکەم: دروستکردنی ئۆتۆماتیکی لە GitHub Actions (ئامادەیە)</span>
              </span>
              <span className="bg-amber-200/80 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
                پێشنیارکراو
              </span>
            </div>

            <p className="text-stone-700 leading-relaxed">
              فایلی <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 font-mono">.github/workflows/build-apk.yml</code> لەناو پڕۆژەکەدا دانراوە. کاتێک کۆدەکە دەبەیتە گێتهەب:
            </p>

            <ol className="list-decimal list-inside space-y-1.5 text-stone-700 pr-1 leading-relaxed">
              <li>پڕۆژەکە لە کۆگایەکی گێتهەب دابنێ (Push بکە).</li>
              <li>لە گێتهەب، دەست لەسەر تابی <strong>Actions</strong> بدە لە سەرەوە.</li>
              <li>دەبینیت کردارێک بە ناوی <strong>«Build Android APK»</strong> دەستپێدەکات.</li>
              <li>دوای تەواوبوون، فایلە <strong>.apk</strong> یەکە لە بەشی <strong>Artifacts</strong> ڕاستەوخۆ بە یەک کرتە دابەزێنە!</li>
            </ol>

            {/* Git push snippet */}
            <div className="bg-stone-900 text-stone-200 p-3 rounded-xl font-mono text-[11px] relative mt-2 dir-ltr text-left">
              <pre className="overflow-x-auto">{gitCommands}</pre>
              <button
                onClick={() => copyText(gitCommands, 1)}
                className="absolute top-2 right-2 px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-[10px] flex items-center gap-1 transition-colors"
              >
                {copiedStep === 1 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedStep === 1 ? 'کۆپی کرا' : 'کۆپیکردن'}</span>
              </button>
            </div>
          </div>

          {/* Method 2: PWABuilder (Instant 1-Click Online APK) */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-emerald-950 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>ڕێگای دووەم: بەبێ کۆمپایڵکردن لە PWABuilder.com (دەستبەجێ)</span>
              </span>
              <span className="bg-emerald-200/80 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px]">
                خێراترین
              </span>
            </div>

            <p className="text-stone-700 leading-relaxed">
              لەبەر ئەوەی کاک مانگا تەواوی مەرجەکانی <strong>PWA و Manifest و Icons</strong> ی هەیە:
            </p>

            <ol className="list-decimal list-inside space-y-1.5 text-stone-700 pr-1 leading-relaxed">
              <li>بچۆ بۆ ماڵپەڕی <strong>PWABuilder.com</strong>.</li>
              <li>بەستەری بەرنامەکەت دابنێ و کلیک لەسەر <strong>Start</strong> بکە.</li>
              <li>دەستبەجێ دوگمەی <strong>Package for Android (APK / AAB)</strong> دابگرە؛ فایلە APK یەکە ئامادە دەبێت بۆ دابەزاندن و خستنەسەر Google Play Store!</li>
            </ol>

            <a
              href="https://www.pwabuilder.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs"
            >
              <span>کردنەوەی PWABuilder.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all"
          >
            داخستنی پەنجەرەکە
          </button>
        </div>
      </div>
    </div>
  );
};
