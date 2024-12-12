export type AIProvider = 'openai' | 'gemini'

export interface APIConfig {
  provider: AIProvider;
  apiKey: string;
  stabilityApiKey?: string;
}

export interface ChildInfo {
  name: string;
  age: number;
  interests: string[];
  theme: string;
}

export interface StoryPage {
  content: string;
  imageUrl: string;
}

export interface Book {
  title: string;
  pages: StoryPage[];
}
