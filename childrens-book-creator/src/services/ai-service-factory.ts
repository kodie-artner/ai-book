import { OpenAIService } from './openai';
import { GeminiService } from './gemini';
import { APIConfig, ChildInfo, StoryPage } from '../types';

export interface AIService {
  generateStory(childInfo: ChildInfo): Promise<StoryPage[]>;
}

export class AIServiceFactory {
  static createService(config: APIConfig): AIService {
    switch (config.provider) {
      case 'openai':
        return new OpenAIService(config.apiKey);
      case 'gemini':
        if (!config.stabilityApiKey) {
          throw new Error('Stability AI API key is required when using Gemini');
        }
        return new GeminiService(config.apiKey, config.stabilityApiKey);
      default:
        throw new Error(`Unsupported AI provider: ${config.provider}`);
    }
  }
}
