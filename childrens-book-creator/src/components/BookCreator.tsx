import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  NumberInput,
  NumberInputField,
  Textarea,
  useToast,
  Heading,
} from '@chakra-ui/react';
import { ChildInfo, Book, APIConfig } from '../types';
import { AIServiceFactory } from '../services/ai-service-factory';
import { BookViewer } from './BookViewer';

interface BookCreatorProps {
  apiConfig: APIConfig;
}

export const BookCreator = ({ apiConfig }: BookCreatorProps) => {
  const [childInfo, setChildInfo] = useState<ChildInfo>({
    name: '',
    age: 5,
    interests: [],
    theme: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [book, setBook] = useState<Book | null>(null);
  const toast = useToast();
  const aiService = AIServiceFactory.createService(apiConfig);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const pages = await aiService.generateStory(childInfo);
      setBook({
        title: `${childInfo.name}'s ${childInfo.theme} Adventure`,
        pages,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate story. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error generating story:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setBook(null);
    setChildInfo({
      name: '',
      age: 5,
      interests: [],
      theme: '',
    });
  };

  if (book) {
    return <BookViewer {...book} onReset={handleReset} />;
  }

  return (
    <Container maxW="container.md" centerContent>
      <Box padding="8" bg="white" borderRadius="lg" boxShadow="lg" width="100%">
        <VStack spacing="6">
          <Heading size="lg">Create a Custom Story</Heading>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing="4">
              <FormControl isRequired>
                <FormLabel>Child's Name</FormLabel>
                <Input
                  value={childInfo.name}
                  onChange={(e) => setChildInfo({ ...childInfo, name: e.target.value })}
                  placeholder="Enter child's name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Age</FormLabel>
                <NumberInput
                  min={1}
                  max={12}
                  value={childInfo.age}
                  onChange={(value) => setChildInfo({ ...childInfo, age: parseInt(value) })}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Interests (comma-separated)</FormLabel>
                <Input
                  value={childInfo.interests.join(', ')}
                  onChange={(e) =>
                    setChildInfo({
                      ...childInfo,
                      interests: e.target.value.split(',').map((i) => i.trim()),
                    })
                  }
                  placeholder="e.g., dinosaurs, space, princesses"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Story Theme</FormLabel>
                <Textarea
                  value={childInfo.theme}
                  onChange={(e) => setChildInfo({ ...childInfo, theme: e.target.value })}
                  placeholder="Enter a theme or brief description of the story you'd like"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                width="100%"
                isLoading={isLoading}
                loadingText="Creating Story..."
              >
                Generate Story
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Container>
  );
};
