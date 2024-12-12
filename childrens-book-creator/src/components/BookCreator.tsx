import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  useToast,
} from '@chakra-ui/react';
import { ChildInfo, APIConfig, Book, StoryLength } from '../types';
import { AIServiceFactory } from '../services/ai-service-factory';
import { BookViewer } from './BookViewer';

const WORDS_PER_PAGE = {
  short: 30,
  medium: 50,
  long: 80,
};

export const BookCreator: React.FC<{ config: APIConfig }> = ({ config }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [book, setBook] = useState<Book | null>(null);
  const toast = useToast();

  const [childInfo, setChildInfo] = useState<ChildInfo>({
    name: '',
    age: 5,
    interests: [],
    theme: '',
    storyOptions: {
      pageCount: 5,
      length: 'medium'
    }
  });

  const handleNumberChange = (field: 'age' | 'pageCount', value: string) => {
    const numberValue = parseInt(value) || 0;
    if (field === 'age') {
      setChildInfo(prev => ({ ...prev, age: numberValue }));
    } else {
      setChildInfo(prev => ({
        ...prev,
        storyOptions: {
          ...prev.storyOptions,
          [field]: numberValue
        }
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const service = AIServiceFactory.createService(config);
      const pages = await service.generateStory(childInfo);
      setBook({ pages, childInfo });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate story',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
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
      storyOptions: {
        pageCount: 5,
        length: 'medium'
      }
    });
  };

  if (book) {
    return <BookViewer book={book} onReset={handleReset} />;
  }

  return (
    <Box p={4} maxW="container.md" mx="auto">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
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
              min={2}
              max={12}
              value={childInfo.age}
              onChange={(value) => handleNumberChange('age', value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Interests (comma-separated)</FormLabel>
            <Input
              value={childInfo.interests.join(', ')}
              onChange={(e) => setChildInfo({ ...childInfo, interests: e.target.value.split(',').map(i => i.trim()) })}
              placeholder="e.g., dinosaurs, space, princesses"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Story Theme</FormLabel>
            <Input
              value={childInfo.theme}
              onChange={(e) => setChildInfo({ ...childInfo, theme: e.target.value })}
              placeholder="Enter a theme for the story"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Number of Pages</FormLabel>
            <NumberInput
              min={3}
              max={10}
              value={childInfo.storyOptions.pageCount}
              onChange={(value) => handleNumberChange('pageCount', value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Story Length</FormLabel>
            <Select
              value={childInfo.storyOptions.length}
              onChange={(e) => setChildInfo(prev => ({
                ...prev,
                storyOptions: {
                  ...prev.storyOptions,
                  length: e.target.value as StoryLength
                }
              }))}
            >
              <option value="short">Short (~{WORDS_PER_PAGE.short} words per page)</option>
              <option value="medium">Medium (~{WORDS_PER_PAGE.medium} words per page)</option>
              <option value="long">Long (~{WORDS_PER_PAGE.long} words per page)</option>
            </Select>
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isLoading}
            loadingText="Creating Story..."
          >
            Generate Story
          </Button>
        </VStack>
      </form>
    </Box>
  );
};
