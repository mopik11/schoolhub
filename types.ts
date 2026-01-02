export interface Homework {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  description: string;
  platform: 'Bakaláři' | 'Teams';
  completed: boolean;
}

export interface Note {
  id: string;
  subject: string;
  topic: string;
  date: string;
  content: string;
}

export interface TeamsMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  important: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isAudio?: boolean;
  audioData?: AudioBuffer; // Store decoded audio buffer for playback
  sources?: { uri: string; title: string }[];
}

export enum Tab {
  DASHBOARD = 'Přehled',
  MATERIALS = 'Materiály',
  CHAT = 'AI Doučování',
  PODCAST = 'Podcasty',
}