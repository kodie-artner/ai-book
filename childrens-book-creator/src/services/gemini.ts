import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChildInfo, StoryPage } from '../types';
import { StabilityService } from './stability';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private stabilityService: StabilityService;
  private model: string = 'gemini-pro';

  constructor(apiKey: string, stabilityApiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.stabilityService = new StabilityService(stabilityApiKey);
  }

  async generateStory(childInfo: ChildInfo): Promise<StoryPage[]> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.model });

      const storyPrompt = `Write a children's story for ${childInfo.name}, who is ${childInfo.age} years old and loves ${childInfo.interests.join(', ')}. 
      The story should be about ${childInfo.theme}. Make it educational and engaging for a ${childInfo.age}-year-old.
      The story should be exactly ${childInfo.storyOptions.pageCount} pages long, with approximately ${childInfo.storyOptions.wordsPerPage} words per page.
      Format your response exactly as follows:
      [SCENE 1]
      (Write the first scene here with ~${childInfo.storyOptions.wordsPerPage} words)
      [SCENE 2]
      (Write the second scene here with ~${childInfo.storyOptions.wordsPerPage} words)
      ...and so on for exactly ${childInfo.storyOptions.pageCount} scenes.`;

      const result = await model.generateContent(storyPrompt);
      const response = await result.response;
      const story = response.text();

      // Split the story into scenes
      const scenes = story
        .split('[SCENE')
        .slice(1)
        .map(scene => {
          const content = scene
            .split(']')
            .slice(1)
            .join(']')
            .trim();
          return content;
        })
        .filter(content => content.length > 0)
        .slice(0, childInfo.storyOptions.pageCount); // Ensure we have exactly the requested number of pages

      // Generate images for each scene using Stability AI
      const pages: StoryPage[] = [];
      for (const content of scenes) {
        const imagePrompt = `Create a child-friendly, colorful illustration for a children's book scene: ${content}. Style: digital art, cute, whimsical, safe for children.`;
        const imageUrl = await this.stabilityService.generateImage(imagePrompt);
        pages.push({ content, imageUrl });
      }

      return pages;
    } catch (error) {
      console.error('Error generating story with Gemini:', error);
      throw error;
    }
  }
}
