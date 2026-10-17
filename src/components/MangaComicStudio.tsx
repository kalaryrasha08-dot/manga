import React, { useState } from 'react';
import { BookOpen, Volume2, Plus, Sparkles, Share2, Layers, Check, Palette } from 'lucide-react';
import { MangaPanel } from '../types';

interface MangaComicStudioProps {
  onSpeakDialogue: (text: string) => void;
  isSpeaking: boolean;
}

const INITIAL_MANGA_PANELS: MangaPanel[] = [
  {
    id: 1,
    titleKurdish: 'بەشی ١: سەردان بۆ قەڵای هەولێر',
    dialogueKurdish: 'مووووو! سەیری ئەم قەڵا دێرینە بکەن، لەسەر گردێک وەستاوە و بە هەزاران ساڵ مێژووی هەیە!',
    dialogueEnglish: 'Moo! Look at this ancient citadel standing tall with thousands of years of history!',
    speaker: 'کاک مانگا',
    setting: 'قەڵای هەولێر (Erbil Citadel)',
    sceneDescription: 'کاک مانگا بە کڵاوی کوردییەوە لە بەردەم دەروازەی قەڵای دێرینی هەولێر وەستاوە.',
    bgGradient: 'from-amber-200 via-orange-100 to-amber-300',
    characterMood: 'happy',
    soundEffect: 'موووووو! 🏰',
  },
  {
    id: 2,
    titleKurdish: 'بەشی ٢: لەوەڕگە سەوزەکانی هەورامان',
    dialogueKurdish: 'ئای لەم باخ و گوڵ و گژوگیایە! هەوای پاکی هەورامان شیری من چەند هێندە شیرینتر دەکات!',
    dialogueEnglish: 'Ah, these orchards and lush meadows! The pure Hawraman breeze makes my milk ten times sweeter!',
    speaker: 'کاک مانگا',
    setting: 'هەورامانی ڕەنگین (Hawraman)',
    sceneDescription: 'دیمەنی پلیکانەیی دێهاتی هەورامان لەگەڵ چیا بەرزەکان و کانییە تەڕەکان.',
    bgGradient: 'from-emerald-200 via-teal-100 to-green-300',
    characterMood: 'chewing',
    soundEffect: 'قرم قرم 🌿',
  },
  {
    id: 3,
    titleKurdish: 'بەشی ٣: لەسەر شاخی گۆیژەی سلێمانی',
    dialogueKurdish: 'شارەکەی بابان چەند جوانە لەم بەرزاییەوە! من گۆرانییەکی مەقامی کوردی دەچڕم بۆ هەموو خەڵک!',
    dialogueEnglish: 'How beautiful the city of Baban looks from above! I am singing a folk song for everyone!',
    speaker: 'کاک مانگا',
    setting: 'شاخی گۆیژە - سلێمانی (Sulaymaniyah)',
    sceneDescription: 'کاک مانگا لە کاتی ئاوابوونی خۆر بەسەر شاردا دەڕوانێت و گۆرانی دەڵێت.',
    bgGradient: 'from-rose-200 via-pink-100 to-indigo-300',
    characterMood: 'singing',
    soundEffect: '🎶 لاوک و بەستە',
  },
  {
    id: 4,
    titleKurdish: 'بەشی ٤: گەلیی زاخۆ و پردی دەلال',
    dialogueKurdish: 'ئاو لەژێر پردی دەلالەوە هاژەی دێت و منیش بە کوردی باسی خۆشەویستیی ئەم خاکە دەکەم!',
    dialogueEnglish: 'The stream rushes under Delal Bridge while I talk about the warmth of this land in Kurdish!',
    speaker: 'کاک مانگا',
    setting: 'پردی دەلال - زاخۆ (Duhok / Zakho)',
    sceneDescription: 'کاک مانگا لە تەنیشت پردی بەردینی دێرین چەپڵە لێدەدات و پێدەکەنێت.',
    bgGradient: 'from-sky-200 via-blue-100 to-cyan-300',
    characterMood: 'laughing',
    soundEffect: 'هاهاها! 🌊',
  },
];

export const MangaComicStudio: React.FC<MangaComicStudioProps> = ({
  onSpeakDialogue,
  isSpeaking,
}) => {
  const [panels, setPanels] = useState<MangaPanel[]>(INITIAL_MANGA_PANELS);
  const [activePanelId, setActivePanelId] = useState<number>(1);
  const [isCreating, setIsCreating] = useState(false);

  // New panel creator state
  const [newTitle, setNewTitle] = useState('');
  const [newDialogue, setNewDialogue] = useState('');
  const [newSetting, setNewSetting] = useState('');
  const [newBg, setNewBg] = useState('from-amber-200 to-orange-200');

  const handleAddPanel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDialogue.trim()) return;

    const newPanel: MangaPanel = {
      id: panels.length + 1,
      titleKurdish: newTitle || `بەشی ${panels.length + 1}`,
      dialogueKurdish: newDialogue,
      dialogueEnglish: 'Custom Kurdish Manga Panel created by user',
      speaker: 'کاک مانگا',
      setting: newSetting || 'کوێستانی کوردستان',
      sceneDescription: 'کاک مانگا بە دڵخۆشییەوە قسە دەکات.',
      bgGradient: newBg,
      characterMood: 'happy',
      soundEffect: 'موووووو! ✨',
    };

    setPanels([...panels, newPanel]);
    setActivePanelId(newPanel.id);
    setIsCreating(false);
    setNewTitle('');
    setNewDialogue('');
    setNewSetting('');
  };

  const currentPanel = panels.find((p) => p.id === activePanelId) || panels[0];

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-amber-200/90 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-stone-900">
              مانگای کوردیی قسەکەر (Kurdish Audio Manga)
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            لێرەدا دەتوانیت پەڕەکانی مانگای کاک مانگا بخوێنیتەوە و بە دەستی لەسەر قسەکان بدەیت تا بە دەنگی بەرز بیخوێنێتەوە!
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>دروستکردنی لاپەڕەی مانگای خۆت</span>
        </button>
      </div>

      {/* Creator Form Modal / Toggle */}
      {isCreating && (
        <form onSubmit={handleAddPanel} className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-4">
          <h3 className="font-bold text-sm text-purple-950 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>لاپەڕەیەکی نوێ بۆ مانگای کاک مانگا زیاد بکە</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">ناونیشانی بەشەکە:</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="بۆ نموونە: گەشت بۆ قەندیل"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">شوێنی ڕووداو (شار / شوێن):</label>
              <input
                type="text"
                value={newSetting}
                onChange={(e) => setNewSetting(e.target.value)}
                placeholder="بۆ نموونە: ڕانیە و دەربەندی ڕانیە"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">قسەی کاک مانگا لەم لاپەڕەیەدا (بە کوردی):</label>
            <textarea
              value={newDialogue}
              onChange={(e) => setNewDialogue(e.target.value)}
              rows={2}
              placeholder="مووووو! لێرەدا چی دەڵێت؟..."
              required
              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-600">ڕەنگی پاشبنەما:</span>
              <button
                type="button"
                onClick={() => setNewBg('from-amber-200 to-orange-200')}
                className="w-6 h-6 rounded-full bg-amber-400 border-2 border-white shadow-xs"
              />
              <button
                type="button"
                onClick={() => setNewBg('from-emerald-200 to-green-200')}
                className="w-6 h-6 rounded-full bg-emerald-400 border-2 border-white shadow-xs"
              />
              <button
                type="button"
                onClick={() => setNewBg('from-sky-200 to-blue-200')}
                className="w-6 h-6 rounded-full bg-sky-400 border-2 border-white shadow-xs"
              />
              <button
                type="button"
                onClick={() => setNewBg('from-rose-200 to-purple-200')}
                className="w-6 h-6 rounded-full bg-rose-400 border-2 border-white shadow-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3.5 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold"
              >
                پەشیمانبوونەوە
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs"
              >
                تۆمارکردنی لاپەڕە
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Main Manga Comic Reader Canvas */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br border-4 border-stone-900 shadow-2xl overflow-hidden min-h-[380px] flex flex-col justify-between"
        style={{
          background: `linear-gradient(135deg, ${
            currentPanel.bgGradient.includes('from-') ? '' : '#FDF4E3'
          })`,
        }}
      >
        {/* Japanese / Comic Halftone Dot Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Panel Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="bg-stone-900 text-white px-3.5 py-1 rounded-lg text-xs font-black shadow-md flex items-center gap-2">
            <span>{currentPanel.titleKurdish}</span>
            <span className="text-amber-400 font-mono">[{currentPanel.id}/{panels.length}]</span>
          </div>

          <div className="bg-white/90 backdrop-blur-sm border-2 border-stone-900 px-3 py-1 rounded-lg text-[11px] font-bold text-stone-800 shadow-xs">
            📍 {currentPanel.setting}
          </div>
        </div>

        {/* Comic Scene Core */}
        <div className="relative z-10 my-6 flex flex-col sm:flex-row items-center justify-around gap-6">
          {/* Character illustration / Cow in Manga style */}
          <div className="relative flex flex-col items-center">
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-white/80 border-4 border-stone-900 p-2 shadow-xl flex items-center justify-center relative">
              <span className="text-6xl sm:text-7xl animate-pulse">🐮</span>
              {/* Comic action lines badge */}
              <div className="absolute -top-3 -right-3 bg-amber-400 border-2 border-stone-900 font-black text-stone-900 text-[10px] px-2 py-0.5 rounded-md shadow-xs transform rotate-12">
                کاک مانگا
              </div>
            </div>
            {/* Comic Onomatopoeia sound effect */}
            <div className="mt-2 bg-yellow-300 border-2 border-stone-900 px-3 py-0.5 rounded-full font-black text-xs text-stone-900 shadow-sm transform -rotate-3">
              {currentPanel.soundEffect}
            </div>
          </div>

          {/* Interactive Manga Speech Bubble (Click to speak in Kurdish!) */}
          <div
            onClick={() => onSpeakDialogue(currentPanel.dialogueKurdish)}
            className="flex-1 max-w-md bg-white border-4 border-stone-900 rounded-3xl p-5 shadow-2xl relative cursor-pointer hover:scale-102 hover:border-amber-600 transition-all group"
            title="کرتە بکە بۆ گوێگرتن لەم دەقە بە زمانی کوردی!"
          >
            {/* Click to listen helper badge */}
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-stone-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-amber-600 group-hover:animate-bounce" />
                <span>کرتە بکە تا بە کوردی بیخوێنێتەوە 🎙️</span>
              </span>
              <span className="text-[10px] text-stone-400">بڵقێ قسە</span>
            </div>

            <p className="text-base sm:text-lg font-bold text-stone-900 leading-relaxed font-comic">
              «{currentPanel.dialogueKurdish}»
            </p>

            {/* Bubble pointer triangle */}
            <div className="hidden sm:block absolute top-1/2 -right-3 -translate-y-1/2 w-5 h-5 bg-white border-t-4 border-r-4 border-stone-900 transform rotate-45" />
          </div>
        </div>

        {/* Panel Footer Navigation */}
        <div className="relative z-10 flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5">
            {panels.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePanelId(p.id)}
                className={`w-7 h-7 rounded-lg font-black text-xs transition-all border-2 ${
                  p.id === activePanelId
                    ? 'bg-stone-900 text-white border-stone-900 scale-110 shadow-sm'
                    : 'bg-white/80 text-stone-800 border-stone-400 hover:bg-white'
                }`}
              >
                {p.id}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSpeakDialogue(currentPanel.dialogueKurdish)}
              disabled={isSpeaking}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
            >
              <Volume2 className="w-4 h-4" />
              <span>گوێگرتن لە هەموو دەقەکە 🔊</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
