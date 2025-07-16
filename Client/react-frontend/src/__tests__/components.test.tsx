import { expect, it, describe, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MovieService } from '../services/movieService';
import { BookingService } from '../services/bookingService';
import MovieList from '../components/movies/MovieList';
import MovieDetail from '../components/movies/MovieDetail';
import AddMovie from '../components/movies/AddMovie';
import BookingList from '../components/bookings/BookingList';
import { BrowserRouter } from 'react-router-dom';

// Mock the services
vi.mock('../services/movieService', () => ({
  MovieService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
  }
}));

vi.mock('../services/bookingService', () => ({
  BookingService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    cancel: vi.fn(),
    update: vi.fn(),
  }
}));

// Mock data
const mockMovies = [
  {
    id: '1',
    title: 'Test Movie 1',
    description: 'Test Description 1',
    duration: 120,
    showDateTimes: [
      { date: '2025-05-10', time: '10:00' },
      { date: '2025-05-10', time: '14:00' }
    ],
    availableSeats: 50
  },
  {
    id: '2',
    title: 'Test Movie 2',
    description: 'Test Description 2',
    duration: 90,
    showDateTimes: [
      { date: '2025-05-11', time: '11:00' },
      { date: '2025-05-11', time: '15:00' }
    ],
    availableSeats: 40
  }
];

const mockBookings = [
  {
    id: '1',
    movieId: '1',
    customerName: 'John Doe',
    showDate: '2025-05-10',
    showTime: '10:00',
    numberOfSeats: 2,
    bookingDate: '2025-05-05T10:00:00.000Z',
    movie: {
      title: 'Test Movie 1',
      description: 'Test Description 1',
      duration: 120
    }
  }
];

// Helper to wrap components with Router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('MovieList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays loading state initially', () => {
    MovieService.getAll.mockResolvedValueOnce([]);
    renderWithRouter(<MovieList />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays movies when loaded', async () => {
    MovieService.getAll.mockResolvedValueOnce(mockMovies);
    renderWithRouter(<MovieList />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
      expect(screen.getByText('Test Movie 2')).toBeInTheDocument();
      expect(screen.getAllByText(/View Details/i)).toHaveLength(2);
    });
  });

  it('displays error message when API fails', async () => {
    MovieService.getAll.mockRejectedValueOnce(new Error('Failed to fetch'));
    renderWithRouter(<MovieList />);
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch/i)).toBeInTheDocument();
    });
  });
});

describe('MovieDetail Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock useParams
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useParams: () => ({ id: '1' })
      };
    });
  });

  it('fetches and displays movie details', async () => {
    MovieService.getById.mockResolvedValueOnce(mockMovies[0]);
    renderWithRouter(<MovieDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
      expect(screen.getByText('Test Description 1')).toBeInTheDocument();
      expect(screen.getByText(/Duration: 120/i)).toBeInTheDocument();
    });
  });
});

describe('BookingList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays bookings when loaded', async () => {
    BookingService.getAll.mockResolvedValueOnce(mockBookings);
    renderWithRouter(<BookingList />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/Cancel Booking/i)).toBeInTheDocument();
    });
  });

  it('allows cancelling a booking', async () => {
    BookingService.getAll.mockResolvedValueOnce(mockBookings);
    BookingService.cancel.mockResolvedValueOnce({ message: 'Booking cancelled successfully' });
    
    renderWithRouter(<BookingList />);
    
    await waitFor(() => {
      fireEvent.click(screen.getByText(/Cancel Booking/i));
    });
    
    // Confirm cancellation in dialog
    fireEvent.click(screen.getByText(/Yes, Cancel Booking/i));
    
    await waitFor(() => {
      expect(BookingService.cancel).toHaveBeenCalledWith('1');
    });
  });
});

describe('AddMovie Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock useNavigate
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => vi.fn()
      };
    });
  });

  it('allows adding a new movie', async () => {
    const newMovie = {
      title: 'New Test Movie',
      description: 'New Description',
      duration: 110,
      availableSeats: 60,
      showDateTimes: [{ date: '2025-05-15', time: '13:00' }]
    };
    
    MovieService.create.mockResolvedValueOnce({
      id: '3',
      ...newMovie
    });
    
    renderWithRouter(<AddMovie />);
    
    // Fill the form
    fireEvent.change(screen.getByLabelText(/Movie Title/i), {
      target: { value: newMovie.title }
    });
    
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: newMovie.description }
    });
    
    fireEvent.change(screen.getByLabelText(/Duration/i), {
      target: { value: newMovie.duration }
    });
    
    fireEvent.change(screen.getByLabelText(/Available Seats/i), {
      target: { value: newMovie.availableSeats }
    });
    
    // For date and time inputs, we would need to mock them appropriately
    // This is a simplified test
    
    fireEvent.click(screen.getByText(/Add Movie/i));
    
    await waitFor(() => {
      expect(MovieService.create).toHaveBeenCalled();
    });
  });
});
