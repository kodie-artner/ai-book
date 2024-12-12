import jsPDF from 'jspdf';
import { Book } from '../types';

const PAGE_WIDTH = 210; // A4 width in mm
const PAGE_HEIGHT = 297; // A4 height in mm
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - (2 * MARGIN);
const CONTENT_HEIGHT = PAGE_HEIGHT - (2 * MARGIN);
const IMAGE_HEIGHT = CONTENT_HEIGHT * 0.6;

async function getBase64FromUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      mode: 'cors',
      cache: 'no-cache',
    });
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
}

export async function generatePDF(book: Book): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Add title page
  doc.setFontSize(24);
  doc.text(`A Story for ${book.childInfo.name}`, PAGE_WIDTH / 2, 40, { align: 'center' });
  
  doc.setFontSize(16);
  doc.text(`Age: ${book.childInfo.age}`, PAGE_WIDTH / 2, 60, { align: 'center' });
  doc.text(`Theme: ${book.childInfo.theme}`, PAGE_WIDTH / 2, 70, { align: 'center' });
  doc.text(`Interests: ${book.childInfo.interests.join(', ')}`, PAGE_WIDTH / 2, 80, { align: 'center' });

  // Add system prompt if available
  if (book.systemPrompt) {
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Story Generation Details', MARGIN, MARGIN + 10);
    doc.setFontSize(12);
    doc.text('System Prompt:', MARGIN, MARGIN + 20);
    const systemPromptLines = doc.splitTextToSize(book.systemPrompt, CONTENT_WIDTH);
    doc.text(systemPromptLines, MARGIN, MARGIN + 30);
  }

  // Add story pages
  for (const [index, page] of book.pages.entries()) {
    doc.addPage();

    // Add image
    try {
      // Convert image URL to base64
      let imageData: string;
      if (page.imageUrl.startsWith('data:')) {
        // If it's already a base64 string, use it directly
        imageData = page.imageUrl;
      } else {
        // Convert URL to base64
        imageData = await getBase64FromUrl(page.imageUrl);
      }

      // Create an image element to get dimensions
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageData;
      });

      const aspectRatio = img.width / img.height;
      const imageWidth = Math.min(CONTENT_WIDTH, IMAGE_HEIGHT * aspectRatio);
      const imageHeight = imageWidth / aspectRatio;

      doc.addImage(
        imageData,
        'PNG',
        MARGIN + (CONTENT_WIDTH - imageWidth) / 2,
        MARGIN,
        imageWidth,
        imageHeight
      );

      // Add story text
      doc.setFontSize(12);
      const textY = MARGIN + imageHeight + 10;
      const textLines = doc.splitTextToSize(page.content, CONTENT_WIDTH);
      doc.text(textLines, MARGIN, textY);

      // Add prompts at the bottom if available
      if (page.textPrompt || page.imagePrompt) {
        doc.setFontSize(8);
        let promptY = PAGE_HEIGHT - MARGIN - 20;

        if (page.textPrompt) {
          doc.text('Text Prompt:', MARGIN, promptY);
          const textPromptLines = doc.splitTextToSize(page.textPrompt, CONTENT_WIDTH);
          doc.text(textPromptLines, MARGIN, promptY + 5);
          promptY += 10 + (textPromptLines.length * 3);
        }

        if (page.imagePrompt) {
          doc.text('Image Prompt:', MARGIN, promptY);
          const imagePromptLines = doc.splitTextToSize(page.imagePrompt, CONTENT_WIDTH);
          doc.text(imagePromptLines, MARGIN, promptY + 5);
        }
      }

      // Add page number
      doc.setFontSize(10);
      doc.text(`Page ${index + 1}`, PAGE_WIDTH / 2, PAGE_HEIGHT - 10, { align: 'center' });
    } catch (error) {
      console.error('Error adding image to PDF:', error);
      // Add error message to PDF
      doc.setTextColor(255, 0, 0);
      doc.text('Error loading image', MARGIN, MARGIN + 20);
      doc.setTextColor(0, 0, 0);
      
      // Still add the text content
      doc.setFontSize(12);
      const textLines = doc.splitTextToSize(page.content, CONTENT_WIDTH);
      doc.text(textLines, MARGIN, MARGIN + 40);
    }
  }

  // Save the PDF
  doc.save(`${book.childInfo.name.toLowerCase()}_story.pdf`);
}
