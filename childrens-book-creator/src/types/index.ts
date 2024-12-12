export type AIProvider = 'openai' | 'gemini';

export type StoryLength = 'short' | 'medium' | 'long';

export interface APIConfig {
  provider: AIProvider;
  apiKey: string;
  stabilityApiKey?: string;
}

export interface StoryPage {
  content: string;
  imageUrl: string;
  textPrompt?: string;
  imagePrompt?: string;
}

export interface StoryOptions {
  pageCount: number;
  length: StoryLength;
}

export interface ChildInfo {
  name: string;
  age: number;
  interests: string[];
  theme: string;
  storyOptions: StoryOptions;
}

export interface Book {
  pages: StoryPage[];
  childInfo: ChildInfo;
  systemPrompt?: string;
}
