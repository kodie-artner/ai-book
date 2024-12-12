import { useState, useEffect } from 'react'
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
  useToast,
} from '@chakra-ui/react'
import { APIConfig, AIProvider } from '../types'

const STORAGE_KEY = 'ai_book_api_config'

interface LoginProps {
  onLogin: (config: APIConfig) => void
}

export const Login = ({ onLogin }: LoginProps) => {
  const [apiKey, setApiKey] = useState('')
  const [stabilityApiKey, setStabilityApiKey] = useState('')
  const [provider, setProvider] = useState<AIProvider>('openai')
  const toast = useToast()

  useEffect(() => {
    const savedConfig = localStorage.getItem(STORAGE_KEY)
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig) as APIConfig
        setProvider(config.provider)
        setApiKey(config.apiKey)
        if (config.stabilityApiKey) {
          setStabilityApiKey(config.stabilityApiKey)
        }
      } catch (error) {
        console.error('Error loading saved config:', error)
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!apiKey) {
      toast({
        title: 'Error',
        description: 'Please enter an API key',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (provider === 'gemini' && !stabilityApiKey) {
      toast({
        title: 'Error',
        description: 'Please enter a Stability AI API key for image generation',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    const config: APIConfig = {
      provider,
      apiKey,
      ...(provider === 'gemini' && { stabilityApiKey }),
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))

    onLogin(config)
  }

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setApiKey('')
    setStabilityApiKey('')
    setProvider('openai')
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
              <FormControl isRequired>
                <FormLabel>
                  {provider === 'openai' ? 'OpenAI API Key' : 'Google AI API Key'}
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
                <FormControl isRequired>
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
              {localStorage.getItem(STORAGE_KEY) && (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  colorScheme="red"
                  w="100%"
                >
                  Clear Saved API Keys
                </Button>
              )}
            </VStack>
          </form>
        </VStack>
      </Box>
    </Container>
  )
}
