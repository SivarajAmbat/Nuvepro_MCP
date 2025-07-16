import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

/**
 * Handle API errors in a consistent way
 * @param error The error object from axios 
 * @param fallbackMessage Default message to display
 * @returns Error message to display
 */
export const handleApiError = (error: unknown, fallbackMessage: string = 'An error occurred'): string => {
  console.error('API Error:', error);
  
  // Handle Axios errors
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string }>;
    
    if (axiosError.response) {
      // The server responded with a status code outside the 2xx range
      const errorMessage = axiosError.response.data?.message || 
        `Server error: ${axiosError.response.status}`;
      toast.error(errorMessage);
      return errorMessage;
    } else if (axiosError.request) {
      // The request was made but no response was received
      const errorMessage = 'No response from server. Please check your connection.';
      toast.error(errorMessage);
      return errorMessage;
    }
  }
  
  // For all other types of errors
  toast.error(fallbackMessage);
  return fallbackMessage;
};
