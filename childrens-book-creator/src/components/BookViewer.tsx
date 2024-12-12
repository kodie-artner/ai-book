import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  VStack,
  HStack,
  IconButton,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Book } from '../types';
import { generatePDF } from '../utils/pdf-generator';

interface BookViewerProps {
  book: Book;
  onReset: () => void;
}

export const BookViewer: React.FC<BookViewerProps> = ({ book, onReset }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Ensure book and pages exist
  if (!book || !book.pages || book.pages.length === 0) {
    return (
      <Box maxW="container.lg" mx="auto" p={8} textAlign="center">
        <Text>No story content available.</Text>
        <Button onClick={onReset} mt={4}>
          Create New Story
        </Button>
      </Box>
    );
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(book.pages.length - 1, prev + 1));
  };

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      await generatePDF(book);
      toast({
        title: 'Success',
        description: 'Story downloaded as PDF',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download PDF',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentPageData = book.pages[currentPage];

  return (
    <Box maxW="container.lg" mx="auto" p={8}>
      {/* Title */}
      <VStack spacing={8} align="stretch">
        <Flex justify="space-between" align="center">
          <Text fontSize="2xl" fontWeight="bold">
            {book.childInfo.name}'s Story
          </Text>
          <HStack>
            <Button onClick={onReset} variant="outline">
              Create New Story
            </Button>
            <Button 
              onClick={handleDownload} 
              colorScheme="green"
              isLoading={isLoading}
              loadingText="Downloading..."
            >
              Download PDF
            </Button>
          </HStack>
        </Flex>

        {/* Story Content */}
        <Box
          borderWidth={1}
          borderRadius="lg"
          p={8}
          bg="white"
          boxShadow="lg"
          minH="600px"
        >
          <VStack spacing={6} align="stretch">
            {/* Page Content */}
            <Box flex={1}>
              <Text mb={6} fontSize="lg">
                {currentPageData.content}
              </Text>
              <Box
                position="relative"
                width="100%"
                paddingTop="56.25%" // 16:9 aspect ratio
              >
                <img
                  src={currentPageData.imageUrl}
                  alt={`Page ${currentPage + 1}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            </Box>

            {/* Navigation */}
            <Flex justify="space-between" align="center" mt={4}>
              <Text>
                Page {currentPage + 1} of {book.pages.length}
              </Text>
              <HStack>
                <IconButton
                  aria-label="Previous page"
                  icon={<ChevronLeftIcon />}
                  onClick={handlePrevPage}
                  isDisabled={currentPage === 0}
                />
                <IconButton
                  aria-label="Next page"
                  icon={<ChevronRightIcon />}
                  onClick={handleNextPage}
                  isDisabled={currentPage === book.pages.length - 1}
                />
              </HStack>
            </Flex>

            {/* Prompts Section */}
            {(currentPageData.textPrompt || currentPageData.imagePrompt) && (
              <Box mt={4} pt={4} borderTopWidth={1} fontSize="sm" color="gray.600">
                {currentPageData.textPrompt && (
                  <Text mb={2}>
                    <Text as="span" fontWeight="bold">Text Prompt:</Text> {currentPageData.textPrompt}
                  </Text>
                )}
                {currentPageData.imagePrompt && (
                  <Text>
                    <Text as="span" fontWeight="bold">Image Prompt:</Text> {currentPageData.imagePrompt}
                  </Text>
                )}
              </Box>
            )}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};
