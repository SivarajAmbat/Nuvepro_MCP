import express, { Request, Response, Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Movie } from '../models/movie';

const router: Router = express.Router();

// In-memory database
export const movies: Movie[] = [
  {
    id: uuidv4(),
    title: "Inception",
    description: "A thief who steals corporate secrets through dream-sharing technology",
    duration: 148,
    showDateTimes: [
      { date: "2025-05-08", time: "10:00" },
      { date: "2025-05-08", time: "14:00" },
      { date: "2025-05-09", time: "18:00" },
      { date: "2025-05-09", time: "21:00" }
    ],
    availableSeats: 50
  },
  {
    id: uuidv4(),
    title: "The Dark Knight",
    description: "Batman fights against the criminal mastermind known as the Joker",
    duration: 152,
    showDateTimes: [
      { date: "2025-05-08", time: "11:00" },
      { date: "2025-05-08", time: "15:00" },
      { date: "2025-05-09", time: "19:00" },
      { date: "2025-05-09", time: "22:00" }
    ],
    availableSeats: 50
  }
];

// Get all movies
router.get('/', (_req: Request, res: Response): void => {
  res.json(movies);
});

// Get movie by id
router.get('/:id', (req: Request<{ id: string }>, res: Response): void => {
  const movie = movies.find(m => m.id === req.params.id);
  if (!movie) {
    res.status(404).json({ message: 'Movie not found' });
    return;
  }
  res.json(movie);
});

// Create new movie
router.post('/', (req: Request<{}, {}, Movie>, res: Response): void => {
  const { title, description, duration, showDateTimes, availableSeats } = req.body;

  // Validate request
  if (!title || !description || !duration || !showDateTimes || !availableSeats) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  // Validate show dates are in the future
  const now = new Date();
  const isValidDates = showDateTimes.every(show => {
    const showDateTime = new Date(`${show.date}T${show.time}`);
    return showDateTime > now;
  });

  if (!isValidDates) {
    res.status(400).json({ message: 'Show dates must be in the future' });
    return;
  }

  const newMovie: Movie = {
    id: uuidv4(),
    title,
    description,
    duration,
    showDateTimes,
    availableSeats
  };

  movies.push(newMovie);
  res.status(201).json(newMovie);
});

export default router;