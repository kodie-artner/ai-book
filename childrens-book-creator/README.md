# Children's Book Creator

An AI-powered web application that creates personalized children's stories with custom illustrations.

## Features

- Generate custom children's stories based on child's interests and preferences
- Choose between two AI providers:
  - OpenAI (GPT-4 for text + DALL-E for images)
  - Google Gemini (for text) + Stability AI (for images)
- Beautiful, responsive UI built with React and Chakra UI
- Secure API key management

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- API keys for your chosen provider:
  - For OpenAI mode: OpenAI API key
  - For Gemini mode: Google AI API key + Stability AI API key

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd childrens-book-creator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Get your API keys:
- OpenAI API key from: https://platform.openai.com/api-keys
- Google AI API key from: https://makersuite.google.com/app/apikey
- Stability AI API key from: https://platform.stability.ai/docs/getting-started

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Choose your AI provider (OpenAI or Gemini)
2. Enter the required API key(s)
3. Fill in the child's information:
   - Name
   - Age
   - Interests
   - Story theme
4. Click "Generate Story" to create a custom story with illustrations
5. View and enjoy your personalized children's book!

## Development

- Built with TypeScript and React
- Uses Vite as the build tool
- Chakra UI for the user interface
- State management with React hooks

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
