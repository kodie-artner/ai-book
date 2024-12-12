import OpenAI from 'openai';
import { ChildInfo, StoryPage, StoryLength } from '../types';
import { AIService } from './ai-service-factory';

const WORDS_PER_PAGE = {
  short: 30,
  medium: 50,
  long: 80,
};

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
      const wordsPerPage = WORDS_PER_PAGE[childInfo.storyOptions.length];
      
      // Generate story content
      const storyPrompt = `Write a children's story for ${childInfo.name}, who is ${childInfo.age} years old and loves ${childInfo.interests.join(', ')}. 
      The story should be about ${childInfo.theme}. Make it educational and engaging for a ${childInfo.age}-year-old.
      The story should be exactly ${childInfo.storyOptions.pageCount} pages long, with approximately ${wordsPerPage} words per page.
      Format your response exactly as follows:
      [SCENE 1]
      (Write the first scene here)
      [SCENE 2]
      (Write the second scene here)
      ...and so on for exactly ${childInfo.storyOptions.pageCount} scenes.
      
      Important: Do NOT include any word count indicators like "~(30 words)" at the beginning of each scene.`;

      const storyCompletion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ 
          role: "system", 
          content: "You are a children's story writer. Write engaging, age-appropriate content. Never include word count indicators in the story text."
        },
        { 
          role: "user", 
          content: storyPrompt 
        }],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const story = storyCompletion.choices[0]?.message?.content || '';
      const scenes = story
        .split('[SCENE')
        .slice(1) // Remove the first empty element
        .map(scene => {
          // Extract content after ']' and remove any word count indicators
          const content = scene
            .split(']')[1]
            .trim()
            .replace(/~\(\d+\s*words?\)/, '')
            .trim();
          return content;
        })
        .filter(content => content.length > 0)
        .slice(0, childInfo.storyOptions.pageCount); // Ensure we have exactly the requested number of pages

      const pages: StoryPage[] = [];
      let artStyle = ''; // Store the art style description from the first image

      // Generate images for each scene
      for (const [index, sceneContent] of scenes.entries()) {
        let imagePrompt = `Create a child-friendly illustration for a children's book scene: ${sceneContent}. `;
        
        if (index === 0) {
          // For the first image, establish the art style based on the story theme and child's interests
          imagePrompt += `Style: Create a ${childInfo.age}-appropriate, engaging illustration with a consistent art style that will be maintained throughout the book. `;
          imagePrompt += `The style should appeal to a ${childInfo.age}-year-old who loves ${childInfo.interests.join(', ')}. `;
          imagePrompt += `Make it colorful, whimsical, and safe for children. The art style should be memorable and distinctive.`;
        } else {
          // For subsequent images, reference the established style
          imagePrompt += `Use the EXACT SAME art style, color palette, and character design as the previous illustrations. `;
          imagePrompt += `Maintain perfect consistency with the previous images in terms of: character appearances, art style, level of detail, color scheme, and overall aesthetic. `;
          imagePrompt += `This should look like it belongs in the same book as the previous illustrations.`;
        }

        const imageResponse = await this.openai.images.generate({
          model: "dall-e-3",
          prompt: imagePrompt,
          size: "1024x1024",
          quality: "standard",
          n: 1,
          style: "vivid", // Use vivid style for more consistent, illustration-like images
        });

        // Store the art style description from the first image
        if (index === 0 && imageResponse.data[0]?.revised_prompt) {
          artStyle = imageResponse.data[0].revised_prompt;
        }

        pages.push({
          content: sceneContent,
          imageUrl: imageResponse.data[0]?.url || '',
          textPrompt: storyPrompt,
          imagePrompt: imagePrompt,
        });

        // Add a small delay between image generations to avoid rate limits
        if (index < scenes.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      return pages;
    } catch (error) {
      console.error('Error generating story with OpenAI:', error);
      throw error;
    }
  }
}
