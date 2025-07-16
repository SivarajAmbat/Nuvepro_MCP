import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Paper,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { format } from 'date-fns';
import { MovieService } from '../../services/movieService';
import { BookingService } from '../../services/bookingService';
import { Movie, CreateBookingRequest } from '../../types';

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Booking form state
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [numberOfSeats, setNumberOfSeats] = useState<number>(1);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        if (!id) {
          setError('No movie ID provided');
          setLoading(false);
          return;
        }
        
        const data = await MovieService.getById(id);
        setMovie(data);
        
        // Extract unique dates
        const uniqueDates = [...new Set(data.showDateTimes.map(show => show.date))];
        setAvailableDates(uniqueDates);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching movie:', err);
        setError('Could not fetch movie details. Please try again later.');
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // Update available times when date changes
  useEffect(() => {
    if (movie && selectedDate) {
      const timesForSelectedDate = movie.showDateTimes
        .filter(show => show.date === selectedDate)
        .map(show => show.time);
      
      setAvailableTimes(timesForSelectedDate);
      
      // Reset time if it's not available for the new date
      if (!timesForSelectedDate.includes(selectedTime)) {
        setSelectedTime('');
      }
    }
  }, [selectedDate, movie, selectedTime]);

  const handleDateChange = (event: SelectChangeEvent<string>) => {
    setSelectedDate(event.target.value);
  };

  const handleTimeChange = (event: SelectChangeEvent<string>) => {
    setSelectedTime(event.target.value);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!movie || !id) {
      setBookingError('Movie information is not available');
      return;
    }
    
    if (!customerName.trim()) {
      setBookingError('Please enter your name');
      return;
    }
    
    if (numberOfSeats < 1) {
      setBookingError('Please select at least 1 seat');
      return;
    }
    
    if (numberOfSeats > movie.availableSeats) {
      setBookingError(`Only ${movie.availableSeats} seats available`);
      return;
    }
    
    try {
      const bookingRequest: CreateBookingRequest = {
        movieId: id,
        customerName,
        showDate: selectedDate,
        showTime: selectedTime,
        numberOfSeats
      };
      
      await BookingService.create(bookingRequest);
      setBookingSuccess(true);
      
      // Reset form
      setCustomerName('');
      setNumberOfSeats(1);
      
      // Update movie to reflect new available seats
      const updatedMovie = await MovieService.getById(id);
      setMovie(updatedMovie);
    } catch (err) {
      console.error('Error creating booking:', err);
      setBookingError('Failed to create booking. Please try again.');
    }
  };

  const handleCloseSnackbar = () => {
    setBookingSuccess(false);
    setBookingError(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !movie) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">{error || 'Movie not found'}</Typography>
      </Box>
    );
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch {
      return dateString;
    }
  };  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
        <Box sx={{ width: { xs: '100%', md: '58.33%' }, px: 2, mb: { xs: 3, md: 0 } }}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h4" component="div">
                {movie.title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {movie.description}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Duration: {movie.duration} minutes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available seats: {movie.availableSeats}
              </Typography>              <Box mt={2}>
                <Typography variant="h6">Show Times</Typography>
                <Box sx={{ mt: 1 }}>
                  {[...new Set(movie.showDateTimes.map(show => show.date))].map(date => (
                    <Box key={date} sx={{ mb: 2 }}>
                      <Paper sx={{ p: 2, mb: 1 }}>
                        <Typography variant="subtitle1">
                          {formatDate(date)}
                        </Typography>
                        <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                          {movie.showDateTimes
                            .filter(show => show.date === date)
                            .map(show => (
                              <Button
                                key={`${show.date}-${show.time}`}
                                variant="outlined"
                                size="small"
                              >
                                {show.time}
                              </Button>
                            ))
                          }                        </Box>
                      </Paper>
                    </Box>
                  ))}
                </Box>              </Box>
              
              <Box mt={3}>
                <Button 
                  variant="outlined" 
                  color="primary"
                  onClick={() => navigate('/movies')}
                >
                  Back to Movies
                </Button>              </Box>
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ width: { xs: '100%', md: '41.67%' }, px: 2 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Book Tickets
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box component="form" onSubmit={handleBooking} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="customerName"
                  label="Your Name"
                  name="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="date-select-label">Select Date</InputLabel>
                  <Select
                    labelId="date-select-label"
                    id="date-select"
                    value={selectedDate}
                    label="Select Date"
                    onChange={handleDateChange}
                  >
                    {availableDates.map(date => (
                      <MenuItem key={date} value={date}>
                        {formatDate(date)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl fullWidth margin="normal" required disabled={!selectedDate}>
                  <InputLabel id="time-select-label">Select Time</InputLabel>
                  <Select
                    labelId="time-select-label"
                    id="time-select"
                    value={selectedTime}
                    label="Select Time"
                    onChange={handleTimeChange}
                  >
                    {availableTimes.map(time => (
                      <MenuItem key={time} value={time}>{time}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl fullWidth margin="normal" required>
                  <TextField
                    id="seats"
                    label="Number of Seats"
                    type="number"
                    InputProps={{ inputProps: { min: 1, max: movie.availableSeats } }}
                    value={numberOfSeats}
                    onChange={(e) => setNumberOfSeats(parseInt(e.target.value))}
                  />
                </FormControl>
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={!selectedDate || !selectedTime || !customerName || numberOfSeats < 1}
                >
                  Book Now
                </Button>              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
      
      <Snackbar 
        open={bookingSuccess} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Booking successful! You can view your booking in My Bookings.
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={!!bookingError} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {bookingError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MovieDetail;
