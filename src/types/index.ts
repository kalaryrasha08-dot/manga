export type CowEmotion = 'idle' | 'happy' | 'talking' | 'chewing' | 'singing' | 'laughing' | 'surprised';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'cow';
  text: string;
  audioUrl?: string;
  timestamp: Date;
  emotion?: CowEmotion;
}

export interface VideoKeyMoment {
  timestamp: string;
  title: string;
  description: string;
  importance: 'High' | 'Medium' | 'Low';
}

export interface VideoAnalysisResult {
  title: string;
  summaryKurdish: string;
  summaryEnglish: string;
  keyMoments: VideoKeyMoment[];
  visualElements: string[];
  audioElements: string[];
  kakMangaReaction: string;
  insights: string[];
}

export interface MangaPanel {
  id: number;
  titleKurdish: string;
  dialogueKurdish: string;
  dialogueEnglish: string;
  speaker: string;
  setting: string;
  sceneDescription: string;
  bgGradient: string;
  characterMood: CowEmotion;
  soundEffect: string;
}
