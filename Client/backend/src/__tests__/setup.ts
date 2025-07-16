import express from 'express';
import cors from 'cors';
import movieRoutes from '../routes/movieRoutes';
import bookingRoutes from '../routes/bookingRoutes';

export function createTestApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api/movies', movieRoutes);
  app.use('/api/bookings', bookingRoutes);
  return app;
}