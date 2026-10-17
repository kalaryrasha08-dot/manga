import React, { useState, useEffect } from 'react';
import { CowAvatar } from './components/CowAvatar';
import { VoiceAndSoundControls } from './components/VoiceAndSoundControls';
import { ChatPanel } from './components/ChatPanel';
import { VideoAnalyzerStudio } from './components/VideoAnalyzerStudio';
import { MangaComicStudio } from './components/MangaComicStudio';
import { CowEmotion, ChatMessage } from './types';
import { sendChatMessage, requestSpeechAudio } from './services/api';
import { soundEffects } from './services/soundEffects';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ExportApkModal } from './components/ExportApkModal';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Heart,
  Video,
  BookOpen,
  MessageCircle,
  Milk,
  Glasses,
  Flower2,
  Crown
} from 'lucide-react';

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'cow' | 'video' | 'manga'>('cow');

  // Cow states
  const [emotion, setEmotion] = useState<CowEmotion>('happy');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentSpeechText, setCurrentSpeechText] = useState<string>(
    'سڵاو کاکە گیان! من کاک مانگام، بە کوردی قسە دەکەم و لە کوێستانەکانی کوردستان دەژیم! مووووو!'
  );

  // Accessories
  const [hasKurdishHat, setHasKurdishHat] = useState<boolean>(true);
  const [hasSunglasses, setHasSunglasses] = useState<boolean>(false);
  const [hasFlower, setHasFlower] = useState<boolean>(true);

  // Stats
  const [milkLiters, setMilkLiters] = useState<number>(12);
  const [grassFedCount, setGrassFedCount] = useState<number>(8);
  const [happinessLevel, setHappinessLevel] = useState<number>(95);

  // Sound settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  // Chat conversation
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'cow',
      text: 'سڵاو هاوڕێی ئازیز! من مانگایەکی قسەکەرم لە کوێستانەکانی کوردستان. هەر پرسیارێکت هەیە بە کوردی لێم بپرسە، یان گۆرانی و نوکتەت بۆ دەگێڕمەوە! مووووو!',
      timestamp: new Date(),
      emotion: 'happy',
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Function to speak Kurdish text aloud
  const speakText = async (text: string, newEmotion?: CowEmotion) => {
    if (newEmotion) {
      setEmotion(newEmotion);
    }
    setCurrentSpeechText(text);
    setIsSpeaking(true);

    if (!soundEnabled) {
      setTimeout(() => {
        setIsSpeaking(false);
        setEmotion('idle');
      }, 2500);
      return;
    }

    try {
      // 1. Try server Gemini TTS first
      const audioBase64 = await requestSpeechAudio(text);
      if (audioBase64) {
        await soundEffects.playBase64Wav(audioBase64);
        setIsSpeaking(false);
        setEmotion('idle');
        return;
      }
    } catch {
      // Fallback
    }

    // 2. Fallback to browser Kurdish speech synthesis
    soundEffects.speakBrowserKurdish(text);
    // Approximate speaking duration
    const words = text.split(/\s+/).length;
    const duration = Math.min(Math.max(words * 260, 2000), 7000);

    setTimeout(() => {
      setIsSpeaking(false);
      setEmotion('idle');
    }, duration);
  };

  // Handle user sending chat message
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await sendChatMessage(text, historyPayload);
      const cowMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'cow',
        text: res.reply,
        timestamp: new Date(),
        emotion: res.emotion,
      };

      setMessages((prev) => [...prev, cowMsg]);
      speakText(res.reply, res.emotion);
      setHappinessLevel((prev) => Math.min(prev + 2, 100));
    } catch (err: unknown) {
      const fallbackReply = 'موووووو! کەمێک دەنگم پچڕا بەهۆی باوبۆرانی شاخ، بەڵام هەمیشە وەڵامت دەدەمەوە!';
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'cow',
          text: fallbackReply,
          timestamp: new Date(),
          emotion: 'happy',
        },
      ]);
      speakText(fallbackReply, 'happy');
    } finally {
      setIsChatLoading(false);
    }
  };

  // Quick phrase spoken
  const handleSpeakPhrase = (text: string, emotionType: 'happy' | 'singing' | 'laughing' | 'chewing') => {
    speakText(text, emotionType);
  };

  // Pet action
  const handlePet = () => {
    setHappinessLevel((prev) => Math.min(prev + 3, 100));
    setCurrentSpeechText('مووووو! دەستەکانت خۆش بێت، ختوکەم هات!');
    setEmotion('laughing');
    setTimeout(() => setEmotion('idle'), 1800);
  };

  // Feed grass action
  const handleFeedGrass = () => {
    soundEffects.playMunch();
    setGrassFedCount((prev) => prev + 1);
    setHappinessLevel((prev) => Math.min(prev + 5, 100));
    setMilkLiters((prev) => prev + 1);
    setEmotion('chewing');
    speakText('دەستت خۆش بێت! ئەم گژوگیایەی کوێستان تامی هەنگوین دەدات!', 'chewing');
  };

  // Milk cow action
  const handleMilk = () => {
    soundEffects.playMilking();
    setMilkLiters((prev) => prev + 2);
    setEmotion('happy');
    speakText('مووووو! شیرێکی چەور و پاکم بۆ ئامادە کردیت، نوشی گیانت بێت!', 'happy');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/70 via-stone-50 to-emerald-50/30 text-stone-900 pb-16 font-sans">
      {/* Top Navbar with Kurdish Motif & Controls */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Logo & App Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-sm">
              🐮
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-stone-900">
                  کاک مانگا
                </h1>
                <span className="text-[11px] bg-amber-500/15 text-amber-900 px-2.5 py-0.5 rounded-full font-bold border border-amber-300">
                  قسەکەری کوردی
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                مانگایەکی زیرەکی قسەکەر بە دەنگ، گۆرانی، و شرۆڤەی ڤیدیۆ بە Gemini 4 Argon
              </p>
            </div>
          </div>

          {/* Stats & Quick Toggles */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Milk Liter Counter */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs font-bold shadow-2xs">
              <Milk className="w-3.5 h-3.5 text-sky-600" />
              <span>{milkLiters} لیتر شیر</span>
            </div>

            {/* Grass Fed Counter */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold shadow-2xs">
              <span>🌾</span>
              <span>{grassFedCount} گیاخواردن</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border transition-all ${
                soundEnabled
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-stone-100 border-stone-200 text-stone-400'
              }`}
              title={soundEnabled ? 'دەنگ چالاکە' : 'دەنگ بێدەنگە'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 border-t border-amber-100/60 overflow-x-auto no-scrollbar py-2">
          <button
            onClick={() => setActiveTab('cow')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap active:scale-95 ${
              activeTab === 'cow'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700'
            }`}
          >
            <span>🐮</span>
            <span>مانگای قسەکەر و دەنگ</span>
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap active:scale-95 ${
              activeTab === 'video'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-sm'
                : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>شرۆڤەی ڤیدیۆ (Gemini 4 Argon)</span>
            <span className="bg-amber-400 text-amber-950 text-[10px] px-1.5 py-0.2 rounded-md font-mono">
              Argon
            </span>
          </button>

          <button
            onClick={() => setActiveTab('manga')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap active:scale-95 ${
              activeTab === 'manga'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>مانگای کۆمیکسی دەنگدار</span>
          </button>

          <button
            onClick={() => setShowExportModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap active:scale-95 bg-stone-900 hover:bg-stone-800 text-white shadow-xs ml-auto"
            title="ڕێنمایی دروستکردنی APK لە گێتهەب"
          >
            <span>📱</span>
            <span>دروستکردنی APK لە گێتهەب</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* TAB 1: TALKING COW & LIVE KURDISH CHAT */}
        {activeTab === 'cow' && (
          <div className="space-y-6">
            {/* Top Interactive Banner: Kurdish Pasture Backdrop & Customization Controls */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-sky-200 via-amber-100 to-emerald-200/70 border-2 border-amber-200 shadow-xl p-6 sm:p-8">
              {/* Mountain silhouettes */}
              <div className="absolute bottom-0 inset-x-0 h-32 opacity-25 pointer-events-none flex items-end justify-between">
                <span className="text-8xl">🏔️</span>
                <span className="text-9xl">⛰️</span>
                <span className="text-8xl">🏔️</span>
              </div>

              {/* Accessories Customization Floating Bar */}
              <div className="relative z-10 flex items-center justify-between flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-2xl border border-amber-200 shadow-xs">
                  <span className="text-xs font-bold text-stone-700">ڕازاندنەوەی کاک مانگا:</span>
                  <button
                    onClick={() => setHasKurdishHat(!hasKurdishHat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      hasKurdishHat
                        ? 'bg-red-800 text-white shadow-2xs'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    <Crown className="w-3 h-3" />
                    <span>کڵاوی کوردی</span>
                  </button>
                  <button
                    onClick={() => setHasSunglasses(!hasSunglasses)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      hasSunglasses
                        ? 'bg-stone-900 text-white shadow-2xs'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    <Glasses className="w-3 h-3" />
                    <span>چاوێلکە</span>
                  </button>
                  <button
                    onClick={() => setHasFlower(!hasFlower)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      hasFlower
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    <Flower2 className="w-3 h-3" />
                    <span>گوڵ</span>
                  </button>
                </div>

                {/* Happiness Bar */}
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-2xl border border-amber-200 shadow-xs">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span className="text-xs font-bold text-stone-700">کەیف و شادی:</span>
                  <div className="w-24 h-2.5 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-500"
                      style={{ width: `${happinessLevel}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-stone-600">{happinessLevel}%</span>
                </div>
              </div>

              {/* Main Avatar Centerpiece */}
              <div className="relative z-10 py-2">
                <CowAvatar
                  emotion={emotion}
                  isSpeaking={isSpeaking}
                  currentSpeechText={currentSpeechText}
                  hasKurdishHat={hasKurdishHat}
                  hasSunglasses={hasSunglasses}
                  hasFlower={hasFlower}
                  onPet={handlePet}
                  onFeedGrass={handleFeedGrass}
                  onMilk={handleMilk}
                />
              </div>
            </div>

            {/* Two Column Layout: Voice Controls & Chat Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Spoken Phrases & Kurdish Soundboard (6 cols) */}
              <div className="lg:col-span-6 space-y-6">
                <VoiceAndSoundControls
                  onSpeakPhrase={handleSpeakPhrase}
                  isSpeaking={isSpeaking}
                />

                {/* Kurdish Folklore & Cow Wisdom Highlight Card */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200/90 shadow-md">
                  <div className="flex items-center gap-2.5 mb-2 text-amber-900 font-bold text-sm">
                    <span className="text-lg">🏔️</span>
                    <h4>دەربارەی کاک مانگای کوێستان</h4>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed font-comic">
                    کاک مانگا هێمای گژوگیای پاک، ئاوی سازگاری کانیاوەکانی کوردستان و میواندۆستیی دێهاتە. دەتوانیت بە مایکرۆفۆن یان نووسین قسەی لەگەڵ بکەیت و هەموو وەڵامەکانت بە کوردیی سۆرانی بە دەنگەوە پێشکەش دەکات.
                  </p>
                </div>
              </div>

              {/* Live Interactive Kurdish Chat (6 cols) */}
              <div className="lg:col-span-6">
                <ChatPanel
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isLoading={isChatLoading}
                  onPlayAudioAgain={(text) => speakText(text, 'talking')}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VIDEO UNDERSTANDING WITH GEMINI 4 ARGON */}
        {activeTab === 'video' && (
          <VideoAnalyzerStudio />
        )}

        {/* TAB 3: KURDISH AUDIO MANGA COMIC STUDIO */}
        {activeTab === 'manga' && (
          <MangaComicStudio
            onSpeakDialogue={(text) => speakText(text, 'talking')}
            isSpeaking={isSpeaking}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-6 text-center text-xs text-stone-400">
        <p>کاک مانگا | بەرنامەی زیرەکی دەستکردی کوردی بە مۆدێلی Gemini 3.8 Flash و Gemini 4 Argon</p>
      </footer>

      {/* Export APK Modal */}
      <ExportApkModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} />

      {/* PWA Offline indicator */}
      <OfflineIndicator />
    </div>
  );
}
