import OpenAI from 'openai';
import { ChildInfo, StoryPage } from '../types';
import { AIService } from './ai-service-factory';

export class OpenAIService implements AIService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true, // Note: In production, you should use a backend service
    });
  }

  async generateStory(childInfo: ChildInfo): Promise<StoryPage[]> {
    try {
      // Generate story content
      const storyPrompt = `Write a children's story for ${childInfo.name}, who is ${childInfo.age} years old and loves ${childInfo.interests.join(', ')}. The story should be about ${childInfo.theme}. Make it educational and engaging for a ${childInfo.age}-year-old. Format the story in 5 separate scenes, each marked with [SCENE X] where X is the scene number.`;

      const storyCompletion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: storyPrompt }],
      });

      const story = storyCompletion.choices[0]?.message?.content || '';
      const scenes = story.split('[SCENE').filter((scene) => scene.trim());

      const pages: StoryPage[] = [];

      // Generate images for each scene
      for (const scene of scenes) {
        const sceneContent = scene.split(']')[1].trim();
        const imagePrompt = `Create a child-friendly illustration for a children's book scene: ${sceneContent}`;

        const imageResponse = await this.openai.images.generate({
          model: "dall-e-3",
          prompt: imagePrompt,
          size: "1024x1024",
          quality: "standard",
          n: 1,
        });

        pages.push({
          content: sceneContent,
          imageUrl: imageResponse.data[0]?.url || '',
        });
      }

      return pages;
    } catch (error) {
      console.error('Error generating story with OpenAI:', error);
      throw error;
    }
  }
}
