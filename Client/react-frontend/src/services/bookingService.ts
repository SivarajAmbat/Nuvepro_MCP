import axios from 'axios';
import { Booking, CreateBookingRequest, UpdateBookingRequest } from '../types';
import apiClient from './movieService';

// Booking services
export const BookingService = {
  // Get all bookings
  getAll: async (): Promise<Booking[]> => {
    const response = await apiClient.get<Booking[]>('/bookings');
    return response.data;
  },

  // Get booking by ID
  getById: async (id: string): Promise<Booking> => {
    const response = await apiClient.get<Booking>(`/bookings/${id}`);
    return response.data;
  },

  // Create a new booking
  create: async (booking: CreateBookingRequest): Promise<Booking> => {
    const response = await apiClient.post<Booking>('/bookings', booking);
    return response.data;
  },

  // Cancel a booking
  cancel: async (id: string): Promise<void> => {
    await apiClient.delete(`/bookings/${id}`);
  },

  // Update booking date and time
  update: async (id: string, request: UpdateBookingRequest): Promise<Booking> => {
    const response = await apiClient.put<Booking>(`/bookings/${id}`, request);
    return response.data;
  },
};

export default BookingService;
