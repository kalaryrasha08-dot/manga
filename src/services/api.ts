import { VideoAnalysisResult } from '../types';

export interface ChatResponse {
  reply: string;
  emotion: 'happy' | 'laughing' | 'surprised' | 'singing' | 'chewing';
  audioBase64?: string;
}

export async function sendChatMessage(
  message: string,
  history: { sender: 'user' | 'cow'; text: string }[]
): Promise<ChatResponse> {
  const res = await fetch('/api/cow/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to chat with Kak Manga');
  }

  return res.json();
}

export async function requestSpeechAudio(text: string): Promise<string | null> {
  try {
    const res = await fetch('/api/cow/speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && data.audioBase64) {
      return data.audioBase64;
    }
    return null;
  } catch (err) {
    console.warn('Speech request error:', err);
    return null;
  }
}

export async function analyzeVideoWithArgon(
  videoBase64: string,
  mimeType: string,
  customPrompt?: string
): Promise<{ success: boolean; modelUsed: string; analysis: VideoAnalysisResult }> {
  const res = await fetch('/api/cow/analyze-video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ videoBase64, mimeType, customPrompt }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.details || err.error || 'Failed to analyze video with Gemini 4 Argon');
  }

  return res.json();
}

export async function askQuestionAboutVideo(
  videoBase64: string,
  mimeType: string,
  question: string
): Promise<string> {
  const res = await fetch('/api/cow/video-qa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ videoBase64, mimeType, question }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.details || err.error || 'Failed to answer video question');
  }

  const data = await res.json();
  return data.answer;
}
