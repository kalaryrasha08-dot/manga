import React from 'react';
import { Sparkles, MessageCircle, Smile, Volume2, ShieldAlert, Award, Music2 } from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

interface VoiceControlsProps {
  onSpeakPhrase: (text: string, emotion: 'happy' | 'singing' | 'laughing' | 'chewing') => void;
  isSpeaking: boolean;
}

export const VoiceAndSoundControls: React.FC<VoiceControlsProps> = ({
  onSpeakPhrase,
  isSpeaking,
}) => {
  const kurdishPhrases = [
    {
      label: 'سڵاو و ناسین',
      icon: '👋',
      text: 'سڵاو کاکە گیان! بەخێربێیت بۆ کوێستان، من کاک مانگای قسەکەرم بە کوردی!',
      emotion: 'happy' as const,
      color: 'from-amber-500 to-orange-500',
    },
    {
      label: 'نوکتەی کوردی',
      icon: '😂',
      text: 'مام ڕۆستەم ڕۆژێک لێمی پرسی بۆچی شاخت هەیە؟ وتم بۆ ئەوەی وایفای شاخ باشتر بگرمەوە! هاهاها مووووو!',
      emotion: 'laughing' as const,
      color: 'from-pink-500 to-rose-500',
    },
    {
      label: 'گۆرانی مانگا',
      icon: '🎵',
      text: 'مانگا مانگا شیرت هەیە؟ بەڵێ بەڵێ سێ گۆزەم هەیە! لە کوێستان گیا دەخۆم و بۆ هەمووان شیر دەبەخشم!',
      emotion: 'singing' as const,
      color: 'from-purple-500 to-indigo-500',
    },
    {
      label: 'پەندی پێشینان',
      icon: '📜',
      text: 'پەندی کوردی دەڵێت: مانگا بە شیریەوە جوانە و مرۆڤیش بە ئەدەب و قسەی خۆشەوە!',
      emotion: 'happy' as const,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      label: 'حەز بە گیا',
      icon: '🌿',
      text: 'مووووو! ئای لەم ڕێواس و کەنکنگ و پونگەی کوێستان، دەمەوێت هەمووی بخۆم!',
      emotion: 'chewing' as const,
      color: 'from-lime-500 to-green-600',
    },
    {
      label: 'فەلسەفەی شاخ',
      icon: '🏔️',
      text: 'ئێمە مانگاکانی کوێستان، ئاو لە کانیی سازگار دەخۆینەوە و بۆیە هێندە بەختەوەرین!',
      emotion: 'happy' as const,
      color: 'from-sky-500 to-blue-600',
    },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-amber-200/80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-amber-600" />
          <span>دەنگ و قسە ئامادەکراوەکانی کاک مانگا</span>
        </h3>
        <span className="text-xs text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-full font-medium">
          بە دەنگی کوردی 🎙️
        </span>
      </div>

      {/* Grid of quick voice buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {kurdishPhrases.map((phrase, idx) => (
          <button
            key={idx}
            disabled={isSpeaking}
            onClick={() => onSpeakPhrase(phrase.text, phrase.emotion)}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 hover:bg-amber-50/80 border border-stone-200/80 hover:border-amber-400 text-right transition-all group disabled:opacity-60 active:scale-95 shadow-xs"
          >
            <span className="text-2xl p-1.5 rounded-lg bg-white shadow-xs group-hover:scale-110 transition-transform">
              {phrase.icon}
            </span>
            <div className="flex-1 min-w-0">
              <span className="block font-bold text-xs text-stone-800 group-hover:text-amber-900 truncate">
                {phrase.label}
              </span>
              <span className="block text-[11px] text-stone-500 truncate">
                لێدان بە دەنگ
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Instant Sound FX Bar */}
      <div className="mt-4 pt-3.5 border-t border-stone-100 flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs font-bold text-stone-600 flex items-center gap-1.5">
          <span>کارتێکەرە دەنگییەکان:</span>
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => soundEffects.playMoo('normal')}
            className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold transition-colors active:scale-95"
          >
            موووو ئاسایی 🐮
          </button>
          <button
            onClick={() => soundEffects.playMoo('happy')}
            className="px-2.5 py-1 rounded-lg bg-pink-100 hover:bg-pink-200 text-pink-900 text-xs font-semibold transition-colors active:scale-95"
          >
            مووووی کەیفساز 🎶
          </button>
          <button
            onClick={() => soundEffects.playMoo('opera')}
            className="px-2.5 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-semibold transition-colors active:scale-95"
          >
            مووووی ئۆپێرا 🎭
          </button>
          <button
            onClick={() => soundEffects.playShepherdMelody()}
            className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-semibold transition-colors active:scale-95 flex items-center gap-1"
          >
            <Music2 className="w-3 h-3" />
            <span>شمشاڵی شوان 🪈</span>
          </button>
        </div>
      </div>
    </div>
  );
};
