import {
  Box,
  Button,
  Container,
  Heading,
  Image,
  Text,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { StoryPage } from '../types';

interface BookViewerProps {
  pages: StoryPage[];
  title: string;
  onReset: () => void;
}

export const BookViewer = ({ pages, title, onReset }: BookViewerProps) => {
  const [currentPage, setCurrentPage] = useState(0);

  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Container maxW="container.lg" centerContent>
      <VStack spacing="6" width="100%">
        <Heading size="xl">{title}</Heading>
        <Box
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          width="100%"
          bg="white"
          boxShadow="xl"
          p="6"
        >
          <VStack spacing="4">
            <Image
              src={pages[currentPage].imageUrl}
              alt={`Page ${currentPage + 1}`}
              borderRadius="md"
              maxH="500px"
              objectFit="contain"
            />
            <Text fontSize="lg" textAlign="center">
              {pages[currentPage].content}
            </Text>
          </VStack>
        </Box>

        <HStack spacing="4">
          <Button
            onClick={goToPreviousPage}
            isDisabled={currentPage === 0}
            colorScheme="blue"
          >
            Previous Page
          </Button>
          <Text>
            Page {currentPage + 1} of {pages.length}
          </Text>
          <Button
            onClick={goToNextPage}
            isDisabled={currentPage === pages.length - 1}
            colorScheme="blue"
          >
            Next Page
          </Button>
        </HStack>

        <Button onClick={onReset} colorScheme="gray">
          Create Another Story
        </Button>
      </VStack>
    </Container>
  );
};
