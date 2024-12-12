import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  Input,
  VStack,
  Heading,
  Text,
  Select,
  FormControl,
  FormLabel,
  FormHelperText,
} from '@chakra-ui/react'
import { APIConfig, AIProvider } from '../types'

interface LoginProps {
  onApiKeySubmit: (config: APIConfig) => void
}

export const Login = ({ onApiKeySubmit }: LoginProps) => {
  const [apiKey, setApiKey] = useState('')
  const [stabilityApiKey, setStabilityApiKey] = useState('')
  const [provider, setProvider] = useState<AIProvider>('openai')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (apiKey.trim()) {
      const config: APIConfig = {
        provider,
        apiKey,
        ...(provider === 'gemini' && { stabilityApiKey }),
      }
      onApiKeySubmit(config)
    }
  }

  return (
    <Container maxW="container.sm" centerContent>
      <Box p={8} bg="white" borderRadius="lg" boxShadow="lg" w="100%">
        <VStack spacing={6}>
          <Heading size="lg">Welcome to Story Creator</Heading>
          <Text>Choose your AI provider and enter your API keys</Text>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>AI Provider</FormLabel>
                <Select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as AIProvider)}
                >
                  <option value="openai">OpenAI (GPT-4 + DALL-E)</option>
                  <option value="gemini">Google Gemini + Stability AI</option>
                </Select>
                <FormHelperText>
                  {provider === 'gemini' 
                    ? 'Uses Google Gemini for text and Stability AI for images' 
                    : 'Uses OpenAI for both text and images'}
                </FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel>
                  {provider === 'openai' ? 'OpenAI API Key' : 'Google Gemini API Key'}
                </FormLabel>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`Enter your ${
                    provider === 'openai' ? 'OpenAI' : 'Google AI'
                  } API key`}
                />
              </FormControl>
              {provider === 'gemini' && (
                <FormControl>
                  <FormLabel>Stability AI API Key</FormLabel>
                  <Input
                    type="password"
                    value={stabilityApiKey}
                    onChange={(e) => setStabilityApiKey(e.target.value)}
                    placeholder="Enter your Stability AI API key"
                  />
                  <FormHelperText>
                    Required for generating images with Stability AI
                  </FormHelperText>
                </FormControl>
              )}
              <Button type="submit" colorScheme="blue" w="100%">
                Start Creating Stories
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Container>
  )
}
