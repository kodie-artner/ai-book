export class StabilityService {
  private apiKey: string;
  private baseUrl = 'https://api.stability.ai';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateImage(prompt: string): Promise<string> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            text_prompts: [
              {
                text: prompt,
                weight: 1
              }
            ],
            cfg_scale: 7,
            height: 1024,
            width: 1024,
            samples: 1,
            steps: 30,
            style_preset: "digital-art"
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Stability AI API error: ${JSON.stringify(error)}`);
      }

      const result = await response.json();
      if (!result.artifacts?.[0]?.base64) {
        throw new Error('No image generated');
      }

      return `data:image/png;base64,${result.artifacts[0].base64}`;
    } catch (error) {
      console.error('Error generating image with Stability AI:', error);
      throw error;
    }
  }
}
