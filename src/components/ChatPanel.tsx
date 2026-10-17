import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2, Sparkles, MessageSquare, RefreshCw } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onPlayAudioAgain: (text: string) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onPlayAudioAgain,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const kurdishSuggestions = [
    'نوکتەیەکی کوردیی گوندم بۆ بگێڕەوە 😂',
    'بۆچی بە کوردی قسە دەکەیت کاک مانگا؟ 🐮',
    'لە کوێستانەکانی کوردستان چی دەخۆیت؟ 🌿',
    'پەندێکی پێشینانی بەتامم بۆ بڵێ 📜',
    'شیرت چەند بەسوودە بۆ لەش؟ 🥛',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  // Web Speech API for Kurdish / Arabic Speech-to-Text
  const toggleListening = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      alert('مایکرۆفۆن لەم وێبگەڕەدا پشتگیری ناکرێت، تکایە ڕاستەوخۆ بنووسە.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.lang = 'ckb-IQ'; // Central Kurdish (Sorani) or fall back to ar
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setInputText(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.warn('Speech recognition error:', e);
      setIsListening(false);
    }
  };

  return (
    <div className="bg-white/85 backdrop-blur-md rounded-2xl shadow-xl border border-amber-200/90 flex flex-col h-[520px] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-amber-100 bg-amber-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-300 flex items-center justify-center text-lg">
            🐮
          </div>
          <div>
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
              <span>گفتوگۆ لەگەڵ کاک مانگا</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            </h3>
            <p className="text-[11px] text-stone-500">بە کوردیی سۆرانی بدوێ و وەڵامت دەداتەوە بە دەنگ</p>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-stone-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 ${
                msg.sender === 'user' ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white shadow-xs'
              }`}
            >
              {msg.sender === 'user' ? 'تۆ' : '🐮'}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-xs relative text-sm ${
                msg.sender === 'user'
                  ? 'bg-amber-600 text-white rounded-tr-xs'
                  : 'bg-white text-stone-800 border border-amber-200/70 rounded-tl-xs'
              }`}
            >
              <p className="leading-relaxed font-comic">{msg.text}</p>
              
              {msg.sender === 'cow' && (
                <div className="mt-2 flex items-center justify-between text-[11px] text-stone-400 border-t border-stone-100 pt-1.5">
                  <span className="text-[10px]">کاک مانگا</span>
                  <button
                    onClick={() => onPlayAudioAgain(msg.text)}
                    className="hover:text-amber-600 flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded hover:bg-amber-50"
                    title="دووبارە بیبیستەوە"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>گوێگرتن</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm shadow-xs">
              🐮
            </div>
            <div className="bg-white rounded-2xl rounded-tl-xs px-4 py-3 border border-amber-200/70 shadow-xs flex items-center gap-2">
              <span className="text-xs text-stone-500 font-medium">کاک مانگا بیر دەکاتەوە...</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts horizontal scroll */}
      <div className="p-2.5 bg-amber-50/40 border-t border-amber-100/60 overflow-x-auto no-scrollbar flex items-center gap-2">
        <span className="text-[11px] font-bold text-amber-800 whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-600" />
          <span>پێشنیارەکان:</span>
        </span>
        {kurdishSuggestions.map((sug, i) => (
          <button
            key={i}
            onClick={() => onSendMessage(sug)}
            disabled={isLoading}
            className="text-xs bg-white hover:bg-amber-100/80 text-stone-700 hover:text-amber-900 border border-amber-200/60 rounded-full px-3 py-1 whitespace-nowrap transition-colors shadow-2xs active:scale-95 disabled:opacity-50"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-amber-100 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleListening}
          className={`p-2.5 rounded-xl border transition-all ${
            isListening
              ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
              : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200'
          }`}
          title={isListening ? 'گوێدەگرێت...' : 'قسە بکە بە دەنگ'}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="بە کوردی شتێک بۆ کاک مانگا بنووسە..."
          disabled={isLoading}
          className="flex-1 px-3.5 py-2.5 text-sm rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-stone-800 placeholder:text-stone-400"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium transition-all disabled:opacity-40 disabled:hover:bg-amber-600 shadow-sm active:scale-95"
        >
          <Send className="w-4 h-4 rotate-180" />
        </button>
      </form>
    </div>
  );
};
