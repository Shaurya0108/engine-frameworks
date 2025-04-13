import { EngineTemplateRequest, ApiError } from '../types';

const API_BASE_URL = 'http://localhost:8000';

/**
 * Generates an engine template and returns a Blob for download
 * @param templateData The engine template request data
 * @returns Promise that resolves to a Blob containing the zip file
 * @throws Error with API error message
 */
export const generateEngineTemplate = async (templateData: EngineTemplateRequest): Promise<Blob> => {
  try {
    const response = await fetch(`${API_BASE_URL}/engine-template`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(templateData),
    });
    
    if (!response.ok) {
      const errorData = await response.json() as ApiError;
      throw new Error(errorData.detail || 'Failed to generate engine template');
    }
    
    return await response.blob();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred');
  }
};

/**
 * Triggers a file download from a blob
 * @param blob The blob to download
 * @param filename The name to save the file as
 */
export const downloadFile = (blob: Blob, filename: string): void => {
  // Create a URL for the blob
  const url = window.URL.createObjectURL(blob);
  
  // Create a temporary link element and trigger download
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
