import request from 'supertest';
import { createTestApp } from './setup';
import { movies } from '../routes/movieRoutes';

const app = createTestApp();

describe('Booking Routes', () => {
  const validBookingData = {
    movieId: '',
    customerName: 'John Doe',
    showDate: '2025-05-08',
    showTime: '14:00',
    numberOfSeats: 2
  };

  // Store created booking ID for later tests
  let createdBookingId: string;

  beforeEach(() => {
    // Reset validBookingData.movieId before each test
    validBookingData.movieId = movies[0].id;
  });

  // Test create booking endpoint
  it('POST /api/bookings - should create a new booking', async () => {
    const response = await request(app)
      .post('/api/bookings')
      .send(validBookingData);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      movieId: validBookingData.movieId,
      customerName: validBookingData.customerName,
      showDate: validBookingData.showDate,
      showTime: validBookingData.showTime,
      numberOfSeats: validBookingData.numberOfSeats
    });
    
    // Store the booking ID for other tests
    createdBookingId = response.body.id;
  });

  it('POST /api/bookings - should return 400 for missing fields', async () => {
    const response = await request(app)
      .post('/api/bookings')
      .send({ customerName: 'John Doe' });  // Missing required fields

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Missing required fields' });
  });

  it('POST /api/bookings - should return 404 for invalid movie ID', async () => {
    const response = await request(app)
      .post('/api/bookings')
      .send({
        ...validBookingData,
        movieId: 'invalid-id'
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Movie not found' });
  });

  it('POST /api/bookings - should return 400 for invalid show date and time', async () => {
    const response = await request(app)
      .post('/api/bookings')
      .send({
        ...validBookingData,
        showDate: '2025-05-20', // Assuming this date doesn't exist in the movie's show times
        showTime: '23:00'
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Invalid show date or time for this movie' });
  });

  // Test get all bookings endpoint
  it('GET /api/bookings - should return all bookings', async () => {
    const response = await request(app)
      .get('/api/bookings');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test get single booking endpoint
  it('GET /api/bookings/:id - should return booking details', async () => {
    // First create a booking to retrieve
    const createResponse = await request(app)
      .post('/api/bookings')
      .send(validBookingData);

    const bookingId = createResponse.body.id;

    // Now get the booking
    const response = await request(app)
      .get(`/api/bookings/${bookingId}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: bookingId,
      customerName: validBookingData.customerName
    });
  });

  // Test update booking endpoint
  it('PUT /api/bookings/:id - should update booking date and time', async () => {
    // First create a booking to update
    const createResponse = await request(app)
      .post('/api/bookings')
      .send(validBookingData);

    const bookingId = createResponse.body.id;
    
    // Get the first available show date and time for the movie that's different
    const movie = movies.find(m => m.id === validBookingData.movieId);
    const newShowDate = movie?.showDateTimes[1]?.date || '2025-05-09';
    const newShowTime = movie?.showDateTimes[1]?.time || '16:00';
    
    // Now update the booking
    const updateResponse = await request(app)
      .put(`/api/bookings/${bookingId}`)
      .send({ showDate: newShowDate, showTime: newShowTime });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.showDate).toBe(newShowDate);
    expect(updateResponse.body.showTime).toBe(newShowTime);
  });

  it('PUT /api/bookings/:id - should return 400 for invalid show date and time', async () => {
    // First create a booking to update
    const createResponse = await request(app)
      .post('/api/bookings')
      .send(validBookingData);

    const bookingId = createResponse.body.id;
    
    // Now try to update with invalid date/time
    const updateResponse = await request(app)
      .put(`/api/bookings/${bookingId}`)
      .send({ showDate: '2025-05-20', showTime: '23:00' }); // Assuming these don't exist

    expect(updateResponse.status).toBe(400);
    expect(updateResponse.body.message).toContain('Invalid show date or time');
  });

  // Test delete booking endpoint
  it('DELETE /api/bookings/:id - should cancel booking', async () => {
    // First create a booking to delete
    const createResponse = await request(app)
      .post('/api/bookings')
      .send(validBookingData);

    const bookingId = createResponse.body.id;
    
    // Now delete the booking
    const deleteResponse = await request(app)
      .delete(`/api/bookings/${bookingId}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual({ message: 'Booking cancelled successfully' });

    // Verify it's deleted
    const getResponse = await request(app)
      .get(`/api/bookings/${bookingId}`);
    
    expect(getResponse.status).toBe(404);
  });

  it('DELETE /api/bookings/:id - should return 404 for non-existent booking', async () => {
    const response = await request(app)
      .delete('/api/bookings/non-existent-id');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Booking not found' });
  });
});