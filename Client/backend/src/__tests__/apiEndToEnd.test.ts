import request from 'supertest';
import { createTestApp } from './setup';
import { movies } from '../routes/movieRoutes';

/**
 * End-to-End API Test Suite
 * 
 * This test suite tests all the API endpoints in sequence to ensure
 * they work correctly in a real-world scenario. The tests are designed
 * to run in order, with each test potentially depending on the results
 * of previous tests.
 */

const app = createTestApp();

describe('Movie Booking API - End to End Tests', () => {
  // Store IDs and data for use across tests
  let movieId: string;
  let bookingId: string;
  const customerName = 'End-to-End Test User';
  let availableShowDate: string;
  let availableShowTime: string;
  let alternativeShowDate: string;
  let alternativeShowTime: string;
  
  // 1. Test Movie API Endpoints
  describe('1. Movie API Endpoints', () => {
    // Get all movies
    it('GET /api/movies - should return all movies', async () => {
      const response = await request(app)
        .get('/api/movies');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      // Store a movie ID for later tests
      movieId = response.body[0].id;
      
      // Store available show dates and times for later tests
      if (response.body[0].showDateTimes.length >= 2) {
        availableShowDate = response.body[0].showDateTimes[0].date;
        availableShowTime = response.body[0].showDateTimes[0].time;
        alternativeShowDate = response.body[0].showDateTimes[1].date;
        alternativeShowTime = response.body[0].showDateTimes[1].time;
      } else {
        availableShowDate = response.body[0].showDateTimes[0].date;
        availableShowTime = response.body[0].showDateTimes[0].time;
        // Use same date with different time if only one date/time pair is available
        alternativeShowDate = availableShowDate;
        alternativeShowTime = availableShowTime;
      }
    });
    
    // Get movie details
    it('GET /api/movies/:id - should return movie details', async () => {
      expect(movieId).toBeDefined();
      
      const response = await request(app)
        .get(`/api/movies/${movieId}`);
      
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(movieId);
      expect(response.body.title).toBeDefined();
    });
    
    // Get non-existent movie
    it('GET /api/movies/:id - should return 404 for non-existent movie', async () => {
      const response = await request(app)
        .get('/api/movies/non-existent-id');
      
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Movie not found' });
    });
  });
  
  // 2. Test Booking API Endpoints
  describe('2. Booking API Endpoints', () => {
    // Create a new booking
    it('POST /api/bookings - should create a new booking', async () => {
      expect(movieId).toBeDefined();
      expect(availableShowDate).toBeDefined();
      expect(availableShowTime).toBeDefined();
      
      const bookingData = {
        movieId,
        customerName,
        showDate: availableShowDate,
        showTime: availableShowTime,
        numberOfSeats: 2
      };
      
      const response = await request(app)
        .post('/api/bookings')
        .send(bookingData);
      
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        movieId,
        customerName,
        showDate: availableShowDate,
        showTime: availableShowTime,
        numberOfSeats: 2
      });
      
      // Store booking ID for later tests
      bookingId = response.body.id;
    });
    
    // Test validation errors for booking creation
    it('POST /api/bookings - should reject booking with missing fields', async () => {
      const response = await request(app)
        .post('/api/bookings')
        .send({ customerName });
      
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Missing required fields' });
    });
    
    it('POST /api/bookings - should reject booking with invalid movie ID', async () => {
      const response = await request(app)
        .post('/api/bookings')
        .send({
          movieId: 'invalid-id',
          customerName,
          showDate: availableShowDate,
          showTime: availableShowTime,
          numberOfSeats: 2
        });
      
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Movie not found' });
    });
    
    it('POST /api/bookings - should reject booking with invalid show date/time', async () => {
      const response = await request(app)
        .post('/api/bookings')
        .send({
          movieId,
          customerName,
          showDate: '2025-12-31',
          showTime: '23:59',
          numberOfSeats: 2
        });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid show date or time');
    });
    
    // Get all bookings
    it('GET /api/bookings - should return all bookings', async () => {
      const response = await request(app)
        .get('/api/bookings');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      // Verify our created booking is in the list
      const foundBooking = response.body.find((b: any) => b.id === bookingId);
      expect(foundBooking).toBeDefined();
    });
    
    // Get booking details
    it('GET /api/bookings/:id - should return booking details', async () => {
      expect(bookingId).toBeDefined();
      
      const response = await request(app)
        .get(`/api/bookings/${bookingId}`);
      
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(bookingId);
      expect(response.body.customerName).toBe(customerName);
      expect(response.body.movie).toBeDefined();
      expect(response.body.movie.title).toBeDefined();
    });
    
    // Get non-existent booking
    it('GET /api/bookings/:id - should return 404 for non-existent booking', async () => {
      const response = await request(app)
        .get('/api/bookings/non-existent-id');
      
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Booking not found' });
    });
    
    // Update booking
    it('PUT /api/bookings/:id - should update booking date and time', async () => {
      expect(bookingId).toBeDefined();
      expect(alternativeShowDate).toBeDefined();
      expect(alternativeShowTime).toBeDefined();
      
      const response = await request(app)
        .put(`/api/bookings/${bookingId}`)
        .send({ 
          showDate: alternativeShowDate, 
          showTime: alternativeShowTime 
        });
      
      expect(response.status).toBe(200);
      expect(response.body.showDate).toBe(alternativeShowDate);
      expect(response.body.showTime).toBe(alternativeShowTime);
      expect(response.body.id).toBe(bookingId);
    });
    
    // Update booking with invalid date/time
    it('PUT /api/bookings/:id - should reject update with invalid date/time', async () => {
      expect(bookingId).toBeDefined();
      
      const response = await request(app)
        .put(`/api/bookings/${bookingId}`)
        .send({ 
          showDate: '2025-12-31', 
          showTime: '23:59' 
        });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid show date or time');
    });
    
    // Update non-existent booking
    it('PUT /api/bookings/:id - should return 404 for non-existent booking', async () => {
      const response = await request(app)
        .put('/api/bookings/non-existent-id')
        .send({ 
          showDate: alternativeShowDate, 
          showTime: alternativeShowTime 
        });
      
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Booking not found' });
    });
    
    // Cancel booking
    it('DELETE /api/bookings/:id - should cancel booking', async () => {
      expect(bookingId).toBeDefined();
      
      const response = await request(app)
        .delete(`/api/bookings/${bookingId}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Booking cancelled successfully' });
      
      // Verify the booking is deleted
      const getResponse = await request(app)
        .get(`/api/bookings/${bookingId}`);
      
      expect(getResponse.status).toBe(404);
    });
    
    // Cancel non-existent booking
    it('DELETE /api/bookings/:id - should return 404 for non-existent booking', async () => {
      const response = await request(app)
        .delete('/api/bookings/non-existent-id');
      
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Booking not found' });
    });
  });
});