import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CowEmotion } from '../types';
import { soundEffects } from '../services/soundEffects';
import { Sparkles, Music, Volume2, Heart } from 'lucide-react';

interface CowAvatarProps {
  emotion: CowEmotion;
  isSpeaking: boolean;
  currentSpeechText?: string;
  hasKurdishHat: boolean;
  hasSunglasses: boolean;
  hasFlower: boolean;
  onPet: () => void;
  onFeedGrass: () => void;
  onMilk: () => void;
}

export const CowAvatar: React.FC<CowAvatarProps> = ({
  emotion,
  isSpeaking,
  currentSpeechText,
  hasKurdishHat,
  hasSunglasses,
  hasFlower,
  onPet,
  onFeedGrass,
  onMilk,
}) => {
  const [blink, setBlink] = useState(false);
  const [earWiggle, setEarWiggle] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number }[]>([]);
  const [bellRinging, setBellRinging] = useState(false);

  // Periodic blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 160);
    }, 3800 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Periodic ear twitch
  useEffect(() => {
    const earInterval = setInterval(() => {
      setEarWiggle(true);
      setTimeout(() => setEarWiggle(false), 450);
    }, 5500);
    return () => clearInterval(earInterval);
  }, []);

  const handleNoseClick = () => {
    soundEffects.playMoo('normal');
    onPet();
    triggerHearts();
  };

  const handleBellClick = () => {
    soundEffects.playBell();
    setBellRinging(true);
    setTimeout(() => setBellRinging(false), 800);
  };

  const triggerHearts = () => {
    const id = Date.now();
    setFloatingHearts((prev) => [...prev, { id, x: (Math.random() - 0.5) * 80 }]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== id));
    }, 1500);
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none w-full max-w-md mx-auto">
      {/* Floating Hearts Animation */}
      <AnimatePresence>
        {floatingHearts.map((h) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 1, y: 0, x: h.x, scale: 0.6 }}
            animate={{ opacity: 0, y: -90, scale: 1.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.3, ease: 'easeOut' }}
            className="absolute top-12 z-40 pointer-events-none text-rose-500"
          >
            <Heart className="w-6 h-6 fill-rose-500" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Floating Speech Bubble */}
      <AnimatePresence>
        {currentSpeechText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', damping: 20 }}
            className="mb-3 max-w-sm w-full bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border-2 border-amber-300 relative text-center z-30"
          >
            <div className="flex items-center justify-center gap-2 mb-1.5 text-xs font-bold text-amber-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>کاک مانگا دەدوێت:</span>
              {isSpeaking && (
                <div className="flex items-center gap-0.5 ml-1">
                  <span className="w-1 h-3 bg-amber-500 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1 h-4 bg-amber-500 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              )}
            </div>
            <p className="text-stone-900 font-medium text-base leading-relaxed break-words font-comic">
              {currentSpeechText}
            </p>
            {/* Speech bubble pointer arrow */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-white border-r-2 border-b-2 border-amber-300 transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Animated Cow Character */}
      <motion.div
        animate={{
          y: isSpeaking ? [0, -6, 0] : emotion === 'chewing' ? [0, 2, -2, 0] : [0, -3, 0],
          rotate: emotion === 'laughing' ? [-2, 2, -2, 1, 0] : 0,
        }}
        transition={{
          repeat: Infinity,
          duration: isSpeaking ? 0.6 : emotion === 'chewing' ? 0.4 : 3.5,
          ease: 'easeInOut',
        }}
        className="relative cursor-pointer group"
      >
        <svg
          viewBox="0 0 320 340"
          className="w-64 h-64 md:w-72 md:h-72 drop-shadow-2xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Defs for gradients & patterns */}
          <defs>
            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F5EFE6" />
            </linearGradient>
            <linearGradient id="snoutGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFB8C6" />
              <stop offset="100%" stopColor="#F48FB1" />
            </linearGradient>
            <linearGradient id="hornGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE082" />
              <stop offset="100%" stopColor="#FFB300" />
            </linearGradient>
            <linearGradient id="bellGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD54F" />
              <stop offset="100%" stopColor="#FF8F00" />
            </linearGradient>
            <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF80AB" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FF80AB" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ears */}
          <motion.g
            animate={{
              rotate: earWiggle ? [-8, 8, -6, 0] : [0, 2, 0],
            }}
            transition={{ duration: 0.45 }}
            style={{ transformOrigin: '80px 120px' }}
          >
            {/* Left Ear */}
            <path
              d="M 90 125 C 40 100 35 155 75 160 Z"
              fill="url(#bodyGrad)"
              stroke="#443224"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d="M 85 130 C 50 115 48 145 75 150 Z"
              fill="#FFB8C6"
            />
          </motion.g>

          <motion.g
            animate={{
              rotate: earWiggle ? [8, -8, 6, 0] : [0, -2, 0],
            }}
            transition={{ duration: 0.45 }}
            style={{ transformOrigin: '240px 120px' }}
          >
            {/* Right Ear */}
            <path
              d="M 230 125 C 280 100 285 155 245 160 Z"
              fill="url(#bodyGrad)"
              stroke="#443224"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d="M 235 130 C 270 115 272 145 245 150 Z"
              fill="#FFB8C6"
            />
          </motion.g>

          {/* Horns */}
          <path
            d="M 105 105 C 80 50 115 40 120 75 Z"
            fill="url(#hornGrad)"
            stroke="#443224"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path
            d="M 215 105 C 240 50 205 40 200 75 Z"
            fill="url(#hornGrad)"
            stroke="#443224"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Cow Head Body */}
          <path
            d="M 90 130 C 90 85 230 85 230 130 C 245 180 240 220 220 245 C 190 270 130 270 100 245 C 80 220 75 180 90 130 Z"
            fill="url(#bodyGrad)"
            stroke="#443224"
            strokeWidth="5"
            strokeLinejoin="round"
          />

          {/* Cow Patches (Black Spots) */}
          <path
            d="M 105 95 C 120 95 135 110 130 130 C 125 150 95 150 95 130 Z"
            fill="#27272A"
          />
          <path
            d="M 210 100 C 230 105 235 140 215 155 C 200 150 195 125 210 100 Z"
            fill="#27272A"
          />
          <path
            d="M 100 195 C 115 190 120 215 105 230 C 95 225 90 205 100 195 Z"
            fill="#27272A"
          />

          {/* Traditional Kurdish Klaw (Hat) if enabled */}
          {hasKurdishHat && (
            <g className="cursor-pointer">
              {/* Hat base */}
              <ellipse cx="160" cy="80" rx="48" ry="18" fill="#1E293B" stroke="#443224" strokeWidth="3" />
              <path
                d="M 112 80 C 115 50 205 50 208 80 Z"
                fill="#7F1D1D"
                stroke="#443224"
                strokeWidth="3"
              />
              {/* Jamana woven pattern stripes */}
              <line x1="125" y1="75" x2="195" y2="75" stroke="#FDE047" strokeWidth="3" strokeDasharray="4 3" />
              <line x1="130" y1="65" x2="190" y2="65" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="3 3" />
              {/* Golden Kurdish tassel badge */}
              <circle cx="160" cy="52" r="5" fill="#EAB308" />
              <path d="M 160 55 L 155 70 L 165 70 Z" fill="#EAB308" />
            </g>
          )}

          {/* Eyes */}
          {!hasSunglasses ? (
            <g>
              {/* Left Eye */}
              {blink ? (
                <path d="M 120 155 Q 132 162 144 155" stroke="#27272A" strokeWidth="4.5" strokeLinecap="round" />
              ) : emotion === 'laughing' ? (
                <path d="M 120 156 Q 132 144 144 156" stroke="#27272A" strokeWidth="4.5" strokeLinecap="round" />
              ) : (
                <g>
                  <ellipse cx="132" cy="152" rx="12" ry="14" fill="#27272A" />
                  <circle cx="128" cy="148" r="4.5" fill="#FFFFFF" />
                  <circle cx="136" cy="156" r="2" fill="#FFFFFF" />
                  {/* Cute eyelashes */}
                  <path d="M 120 142 L 115 137" stroke="#27272A" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 128 138 L 126 132" stroke="#27272A" strokeWidth="2.5" strokeLinecap="round" />
                </g>
              )}

              {/* Right Eye */}
              {blink ? (
                <path d="M 176 155 Q 188 162 200 155" stroke="#27272A" strokeWidth="4.5" strokeLinecap="round" />
              ) : emotion === 'laughing' ? (
                <path d="M 176 156 Q 188 144 200 156" stroke="#27272A" strokeWidth="4.5" strokeLinecap="round" />
              ) : (
                <g>
                  <ellipse cx="188" cy="152" rx="12" ry="14" fill="#27272A" />
                  <circle cx="184" cy="148" r="4.5" fill="#FFFFFF" />
                  <circle cx="192" cy="156" r="2" fill="#FFFFFF" />
                  {/* Cute eyelashes */}
                  <path d="M 200 142 L 205 137" stroke="#27272A" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 192 138 L 194 132" stroke="#27272A" strokeWidth="2.5" strokeLinecap="round" />
                </g>
              )}
            </g>
          ) : (
            /* Cool Sunglasses */
            <g>
              <rect x="110" y="140" width="44" height="26" rx="6" fill="#18181B" stroke="#F59E0B" strokeWidth="2.5" />
              <rect x="166" y="140" width="44" height="26" rx="6" fill="#18181B" stroke="#F59E0B" strokeWidth="2.5" />
              <line x1="154" y1="150" x2="166" y2="150" stroke="#F59E0B" strokeWidth="3" />
              {/* Glass sheen */}
              <line x1="116" y1="144" x2="146" y2="158" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.4" />
              <line x1="172" y1="144" x2="202" y2="158" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.4" />
            </g>
          )}

          {/* Cute Rosy Cheeks */}
          <circle cx="106" cy="178" r="14" fill="url(#blushGrad)" />
          <circle cx="214" cy="178" r="14" fill="url(#blushGrad)" />

          {/* Snout / Muzzle */}
          <g onClick={handleNoseClick} className="cursor-pointer">
            <rect
              x="108"
              y="180"
              width="104"
              height="68"
              rx="34"
              fill="url(#snoutGrad)"
              stroke="#443224"
              strokeWidth="4.5"
            />

            {/* Nostrils */}
            <ellipse cx="140" cy="204" rx="6.5" ry="9" fill="#9D4A63" />
            <ellipse cx="180" cy="204" rx="6.5" ry="9" fill="#9D4A63" />

            {/* Animated Mouth */}
            {isSpeaking ? (
              <motion.ellipse
                cx="160"
                cy="226"
                rx={14}
                ry={9}
                fill="#881337"
                stroke="#443224"
                strokeWidth="2.5"
                animate={{ ry: [3, 9, 4, 10, 3] }}
                transition={{ repeat: Infinity, duration: 0.35 }}
              />
            ) : emotion === 'chewing' ? (
              <motion.path
                d="M 148 226 Q 160 236 172 226"
                stroke="#443224"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                animate={{ d: ['M 148 226 Q 160 236 172 226', 'M 148 224 Q 160 216 172 224', 'M 148 226 Q 160 236 172 226'] }}
                transition={{ repeat: Infinity, duration: 0.4 }}
              />
            ) : emotion === 'singing' ? (
              <ellipse cx="160" cy="226" rx="10" ry="12" fill="#881337" stroke="#443224" strokeWidth="2.5" />
            ) : emotion === 'laughing' ? (
              <path
                d="M 144 220 Q 160 240 176 220 Z"
                fill="#881337"
                stroke="#443224"
                strokeWidth="3"
              />
            ) : (
              <path
                d="M 146 225 Q 160 234 174 225"
                stroke="#443224"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </g>

          {/* Wild Mountain Flower or Grass blade in mouth */}
          {hasFlower && (
            <g>
              <path d="M 174 225 Q 210 235 225 210" stroke="#16A34A" strokeWidth="3.5" fill="none" />
              {/* Petals */}
              <circle cx="225" cy="208" r="7" fill="#F43F5E" />
              <circle cx="218" cy="204" r="5" fill="#FB7185" />
              <circle cx="232" cy="204" r="5" fill="#FB7185" />
              <circle cx="225" cy="208" r="3.5" fill="#FDE047" />
            </g>
          )}

          {/* Bell & Collar */}
          <g onClick={handleBellClick} className="cursor-pointer">
            {/* Red neck collar */}
            <path
              d="M 110 255 Q 160 280 210 255"
              stroke="#B91C1C"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />
            {/* Hanging golden cowbell */}
            <motion.g
              animate={bellRinging ? { rotate: [-18, 18, -14, 14, 0] } : { rotate: 0 }}
              transition={{ duration: 0.7 }}
              style={{ transformOrigin: '160px 270px' }}
            >
              <path
                d="M 148 272 L 172 272 L 178 300 L 142 300 Z"
                fill="url(#bellGrad)"
                stroke="#78350F"
                strokeWidth="2.5"
              />
              <circle cx="160" cy="302" r="4" fill="#92400E" />
              {/* Sound waves when ringing */}
              {bellRinging && (
                <g stroke="#F59E0B" strokeWidth="2.5" fill="none">
                  <path d="M 134 286 C 130 290 130 296 134 300" />
                  <path d="M 186 286 C 190 290 190 296 186 300" />
                </g>
              )}
            </motion.g>
          </g>
        </svg>

        {/* Emotion visual indicator badge */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-bold shadow-md border border-amber-200 flex items-center gap-1.5 text-stone-700">
          {emotion === 'talking' && <Volume2 className="w-3.5 h-3.5 text-amber-600 animate-pulse" />}
          {emotion === 'singing' && <Music className="w-3.5 h-3.5 text-rose-500 animate-bounce" />}
          {emotion === 'happy' && <Sparkles className="w-3.5 h-3.5 text-yellow-500" />}
          {emotion === 'laughing' && <span>😂</span>}
          {emotion === 'chewing' && <span>🌾</span>}
          {emotion === 'surprised' && <span>😲</span>}
          <span>
            {emotion === 'talking' && 'دەدوێت'}
            {emotion === 'singing' && 'گۆرانی'}
            {emotion === 'happy' && 'دڵخۆش'}
            {emotion === 'laughing' && 'پێکەنین'}
            {emotion === 'chewing' && 'گیاخواردن'}
            {emotion === 'surprised' && 'سەرسام'}
            {emotion === 'idle' && 'کاک مانگا'}
          </span>
        </div>
      </motion.div>

      {/* Quick interactive pet/feed/milk helper bar */}
      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={handleNoseClick}
          className="px-3.5 py-1.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
          title="دەست لە لووتی بدە بۆ موووو!"
        >
          <span>🐮</span>
          <span>دەست لە لووت بدە</span>
        </button>
        <button
          onClick={onFeedGrass}
          className="px-3.5 py-1.5 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
        >
          <span>🌾</span>
          <span>گیای پێ بدە</span>
        </button>
        <button
          onClick={onMilk}
          className="px-3.5 py-1.5 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-900 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
        >
          <span>🥛</span>
          <span>شیر بدۆشە</span>
        </button>
      </div>
    </div>
  );
};
