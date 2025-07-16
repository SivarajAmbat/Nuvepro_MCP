import express from 'express';
import cors from 'cors';
import movieRoutes from './routes/movieRoutes';
import bookingRoutes from './routes/bookingRoutes';

const app = express();
const port = 3001; // Changed to 3001 to avoid conflict with React's default port

app.use(cors({
  origin: '*', // or '*' during development
  credentials: true
}));

app.use(express.json());

app.use('/api/movies', movieRoutes);
app.use('/api/bookings', bookingRoutes);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
