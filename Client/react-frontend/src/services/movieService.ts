import axios from 'axios';
import { Movie, CreateMovieRequest } from '../types';

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const API_BASE_URL = `http://${window.location.hostname}:3001/api`;

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Movie services
export const MovieService = {
  // Get all movies
  getAll: async (): Promise<Movie[]> => {
    const response = await apiClient.get<Movie[]>('/movies');
    return response.data;
  },

  // Get movie by ID
  getById: async (id: string): Promise<Movie> => {
    const response = await apiClient.get<Movie>(`/movies/${id}`);
    return response.data;
  },

  // Create a new movie
  create: async (movie: CreateMovieRequest): Promise<Movie> => {
    const response = await apiClient.post<Movie>('/movies', movie);
    return response.data;
  },
};

export default apiClient;
