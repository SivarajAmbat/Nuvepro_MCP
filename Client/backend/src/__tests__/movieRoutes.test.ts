import request from 'supertest';
import { createTestApp } from './setup';
import { movies } from '../routes/movieRoutes';

const app = createTestApp();

describe('Movie Routes', () => {
  it('GET /api/movies - should return all movies', async () => {
    const response = await request(app).get('/api/movies');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
    expect(response.body[0].showDateTimes).toBeDefined();
    expect(Array.isArray(response.body[0].showDateTimes)).toBe(true);
  });

  it('GET /api/movies/:id - should return a movie by id', async () => {
    const movie = movies[0];
    const response = await request(app).get(`/api/movies/${movie.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(movie);
    expect(response.body.showDateTimes).toBeDefined();
    expect(Array.isArray(response.body.showDateTimes)).toBe(true);
  });

  it('GET /api/movies/:id - should return 404 for non-existent movie', async () => {
    const response = await request(app).get('/api/movies/nonexistent-id');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Movie not found' });
  });

  it('POST /api/movies - should add a new movie', async () => {
    const newMovie = {
      title: 'Test Movie',
      description: 'A test movie description',
      duration: 120,
      showDateTimes: [
        { date: '2025-06-01', time: '14:00' },
        { date: '2025-06-01', time: '18:00' },
      ],
      availableSeats: 30,
    };

    const response = await request(app)
      .post('/api/movies')
      .send(newMovie);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: expect.any(String),
      ...newMovie,
    });

    // Verify the movie was actually added to our in-memory database
    const getResponse = await request(app).get(`/api/movies/${response.body.id}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toEqual(response.body);
  });

  it('POST /api/movies - should return 400 for missing required fields', async () => {
    const invalidMovie = {
      title: 'Incomplete Movie',
      // Missing other required fields
    };

    const response = await request(app)
      .post('/api/movies')
      .send(invalidMovie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Missing required fields' });
  });

  it('POST /api/movies - should return 400 for past show dates', async () => {
    const movieWithPastDates = {
      title: 'Past Movie',
      description: 'A movie with past show dates',
      duration: 110,
      showDateTimes: [{ date: '2020-01-01', time: '14:00' }],
      availableSeats: 40,
    };

    const response = await request(app)
      .post('/api/movies')
      .send(movieWithPastDates);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Show dates must be in the future' });
  });
});