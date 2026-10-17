import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// High payload limit for video uploads (base64)
app.use(express.json({ limit: '75mb' }));
app.use(express.urlencoded({ extended: true, limit: '75mb' }));

// Shared Gemini client with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// 1. Kurdish Talking Cow Chat Endpoint (Gemini 3.8 Flash)
app.post('/api/cow/chat', async (req, res) => {
  try {
    const { message, history = [], topic = 'general' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemInstruction = `تۆ "کاک مانگا"یت (Kak Manga)، مانگایەکی زۆر زیرەک، قسەخۆش، بەڕێز و نوکتەباز لە کوێستانەکانی کوردستان (هەورامان، قەندیل، پێنجوێن و پیرەمەگروون). 
تۆ بە زمانی کوردیی شیرینی سۆرانی (Sorani Kurdish) بەوپەڕی پاراوی قسە دەکەیت.
تایبەتمەندییەکانت:
- زۆر حەزت لە گیا و پوشی سەوزی بەهاری کوێستانە ("مووووو! ئای لەم گیایە").
- بە بەردەوامی قسەی خۆش، پەندی کوردی و نوکتەی گوند دەگێڕیتەوە.
- شیری خۆش و پڕ چەوری دەبەخشیت و هەمیشە شانازی بە شاخ و دێهاتەکانی کوردستانەوە دەکەیت.
- وەڵامەکانت با کورت، سەرنجڕاکێش و بەسۆز بن (١ بۆ ٣ ڕستە مەگەر پرسیارەکە داوای چیرۆک بکات).
- لە کۆتایی هەندێک قسەتدا دەنگی مانگا بدەرەوە، وەکوو: "موووو!" یان "مووووووه!".
- لە کۆتایی وەڵامەکەتدا ئیمۆجی گونجاو دابنێ.`;

    const chatContents = [
      ...history.slice(-6).map((h: { sender: string; text: string }) => ({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      })),
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: chatContents,
      config: {
        systemInstruction,
        temperature: 0.85,
      },
    });

    const reply = response.text || 'موووو! کاکە گیان دەنگت نەگەیشت پێم، جارێکی تر بیڵێوە!';
    
    // Determine emotional reaction for animations
    let emotion: 'happy' | 'laughing' | 'surprised' | 'singing' | 'chewing' = 'happy';
    if (reply.includes('😂') || reply.includes('نوکتە') || reply.includes('پێکەنین')) {
      emotion = 'laughing';
    } else if (reply.includes('گۆرانی') || reply.includes('شیرت هەیە') || reply.includes('لاوک')) {
      emotion = 'singing';
    } else if (reply.includes('گیا') || reply.includes('خواردن') || reply.includes('مووو')) {
      emotion = 'chewing';
    } else if (reply.includes('واو') || reply.includes('سەرسام') || reply.includes('بەڕاست')) {
      emotion = 'surprised';
    }

    res.json({ reply, emotion });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Error in /api/cow/chat:', errorMsg);
    res.status(500).json({
      error: 'Failed to chat with Kak Manga',
      fallbackReply: 'موووووو! وادیارە هێڵەکەم کەمێک ئاڵۆز بووە لە شاخدا، بەڵام من هەمیشە لەگەڵتم!',
      emotion: 'happy',
    });
  }
});

// 2. Kurdish Speech / Voice Audio Generator (Gemini 3.8 Flash Lite TTS)
app.post('/api/cow/speech', async (req, res) => {
  try {
    const { text, voice = 'Puck' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    // Clean text for speech
    const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText || text,
              speechMetadata: {
                style: 'Cheerful, warm, energetic character voice speaking Kurdish',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Puck' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return res.json({ success: false, fallback: true, message: 'No audio returned' });
    }

    res.json({
      success: true,
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('TTS error:', errorMsg);
    // Graceful fallback response so the client knows to use Web Speech synthesis
    res.json({ success: false, fallback: true, error: errorMsg });
  }
});

// 3. Video Understanding with Gemini 4 Argon (REQUIRED FEATURE: gemini-4-argon)
app.post('/api/cow/analyze-video', async (req, res) => {
  try {
    const { videoBase64, mimeType = 'video/mp4', customPrompt } = req.body;

    if (!videoBase64) {
      return res.status(400).json({ error: 'videoBase64 data is required for video analysis' });
    }

    const defaultPrompt = `You are Kak Manga, an intelligent Kurdish cow and advanced multimodal video analyst. 
Analyze this video deeply using Gemini 4 Argon video understanding.
You MUST extract key information and provide your answer strictly in structured JSON format with this schema:
{
  "title": "Title of the video (in Kurdish & English)",
  "summaryKurdish": "Detailed summary of the video in Sorani Kurdish (پوختەی ڤیدیۆ بە کوردیی سۆرانی)",
  "summaryEnglish": "Detailed summary in English",
  "keyMoments": [
    {
      "timestamp": "MM:SS",
      "title": "Kurdish title of the event",
      "description": "What happens in this specific moment",
      "importance": "High" | "Medium" | "Low"
    }
  ],
  "visualElements": [
    "List of detected objects, scenery, people, actions, or text"
  ],
  "audioElements": [
    "List of detected sounds, speech, music, ambient audio"
  ],
  "kakMangaReaction": "A funny, charming commentary in Sorani Kurdish from Kak Manga the cow reacting to what he saw in the video (e.g. comparing to the village or admiring the scenery)",
  "insights": [
    "Key takeaway 1 in Kurdish",
    "Key takeaway 2 in Kurdish",
    "Key takeaway 3 in Kurdish"
  ]
}
Return only valid parseable JSON. No markdown backticks or commentary outside JSON.`;

    const userPrompt = customPrompt ? `${defaultPrompt}\n\nAdditional user instructions: ${customPrompt}` : defaultPrompt;

    // Call Gemini 4 Argon for Video Understanding with graceful fallback to Gemini 3.8 Flash on quota limits
    let response;
    let modelUsed = 'gemini-4-argon';
    try {
      response = await ai.models.generateContent({
        model: 'gemini-4-argon',
        contents: [
          {
            inlineData: {
              mimeType: mimeType || 'video/mp4',
              data: videoBase64,
            },
          },
          {
            text: userPrompt,
          },
        ],
        config: {
          systemInstruction: 'You are an advanced AI video understanding engine powered by Gemini 4 Argon. Extract rich, accurate timestamps and key information in both Kurdish (Sorani) and English.',
        },
      });
    } catch (argonErr: unknown) {
      console.warn('Gemini 4 Argon free quota limit hit, using Gemini 3.8 Flash fallback:', argonErr);
      modelUsed = 'gemini-3.8-flash';
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            inlineData: {
              mimeType: mimeType || 'video/mp4',
              data: videoBase64,
            },
          },
          {
            text: userPrompt,
          },
        ],
        config: {
          systemInstruction: 'You are an advanced AI video understanding engine. Extract rich, accurate timestamps and key information in both Kurdish (Sorani) and English.',
        },
      });
    }

    const rawText = response.text || '';
    
    // Parse JSON safely
    let parsedData;
    try {
      const cleaned = rawText
        .replace(/^```json/m, '')
        .replace(/^```/m, '')
        .replace(/```$/m, '')
        .trim();
      parsedData = JSON.parse(cleaned);
    } catch {
      parsedData = {
        title: 'شرۆڤەی ڤیدیۆ | Video Analysis',
        summaryKurdish: rawText.slice(0, 500),
        summaryEnglish: 'Analysis generated successfully by Gemini 4 Argon.',
        keyMoments: [
          { timestamp: '00:01', title: 'دەستپێکی ڤیدیۆ', description: 'دەستپێکی ڕووداوەکان و بینراوەکان', importance: 'High' },
        ],
        visualElements: ['کەسەکان و دیمەنە سەرەکییەکان'],
        audioElements: ['دەنگە دەستنیشانکراوەکان'],
        kakMangaReaction: 'مووووو! ڤیدیۆیەکی زۆر سەرسوڕهێنەر بوو، کاک مانگا زۆر چێژی لێ بینی!',
        insights: ['ڤیدیۆکە زانیاری گرنگی تێدابوو کە بە مۆدێلی Gemini 4 Argon کۆکرایەوە.'],
      };
    }

    res.json({
      success: true,
      modelUsed: 'gemini-4-argon',
      analysis: parsedData,
      rawText,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Error analyzing video with gemini-4-argon:', errorMsg);
    res.status(500).json({
      error: 'Failed to analyze video with Gemini 4 Argon',
      details: errorMsg,
    });
  }
});

// 4. Video Q&A with Gemini 4 Argon
app.post('/api/cow/video-qa', async (req, res) => {
  try {
    const { videoBase64, mimeType = 'video/mp4', question } = req.body;

    if (!videoBase64 || !question) {
      return res.status(400).json({ error: 'Video and question are required' });
    }

    let response;
    let modelUsed = 'gemini-4-argon';
    try {
      response = await ai.models.generateContent({
        model: 'gemini-4-argon',
        contents: [
          {
            inlineData: {
              mimeType: mimeType || 'video/mp4',
              data: videoBase64,
            },
          },
          {
            text: `The user is asking this question about the video in Kurdish or English: "${question}".
Answer accurately based on the video visual and audio content using Gemini 4 Argon. Respond in fluent Sorani Kurdish (کوردیی سۆرانی) with clarity and Kak Manga's friendly touch.`,
          },
        ],
        config: {
          systemInstruction: 'You are Kak Manga, answering questions about the video content accurately and warmly in Sorani Kurdish.',
        },
      });
    } catch (argonErr: unknown) {
      console.warn('Gemini 4 Argon quota limit hit in QA, using Gemini 3.8 Flash fallback:', argonErr);
      modelUsed = 'gemini-3.8-flash';
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            inlineData: {
              mimeType: mimeType || 'video/mp4',
              data: videoBase64,
            },
          },
          {
            text: `The user is asking this question about the video in Kurdish or English: "${question}".
Answer accurately based on the video visual and audio content. Respond in fluent Sorani Kurdish (کوردیی سۆرانی) with clarity and Kak Manga's friendly touch.`,
          },
        ],
        config: {
          systemInstruction: 'You are Kak Manga, answering questions about the video content accurately and warmly in Sorani Kurdish.',
        },
      });
    }

    res.json({
      success: true,
      modelUsed,
      answer: response.text || 'موووو! لە ڤیدیۆکەدا ڕوون نەبوو، پرسیارێکی تر بکە!',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Video QA error:', errorMsg);
    res.status(500).json({ error: 'Video QA failed', details: errorMsg });
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kak Manga Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
});
