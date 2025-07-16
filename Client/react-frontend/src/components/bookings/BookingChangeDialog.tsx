import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { format } from 'date-fns';
import { BookingService } from '../../services/bookingService';
import { MovieService } from '../../services/movieService';
import { Booking, Movie, UpdateBookingRequest } from '../../types';

interface BookingChangeDialogProps {
  open: boolean;
  bookingId: string;
  onClose: () => void;
  onBookingChanged: (booking: Booking) => void;
}

const BookingChangeDialog: React.FC<BookingChangeDialogProps> = ({
  open,
  bookingId,
  onClose,
  onBookingChanged,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch booking details
        const bookingData = await BookingService.getById(bookingId);
        setBooking(bookingData);
        setSelectedDate(bookingData.showDate);
        setSelectedTime(bookingData.showTime);
        
        // Fetch movie details to get available show times
        const movieData = await MovieService.getById(bookingData.movieId);
        setMovie(movieData);
        
        // Extract unique dates
        const uniqueDates = [...new Set(movieData.showDateTimes.map(show => show.date))];
        setAvailableDates(uniqueDates);
        
        // Set available times for the selected date
        const timesForSelectedDate = movieData.showDateTimes
          .filter(show => show.date === bookingData.showDate)
          .map(show => show.time);
        setAvailableTimes(timesForSelectedDate);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching booking details:', err);
        setError('Could not fetch booking details. Please try again later.');
        setLoading(false);
      }
    };
    
    if (open && bookingId) {
      fetchData();
    }
  }, [bookingId, open]);
  
  // Update available times when date changes
  useEffect(() => {
    if (movie && selectedDate) {
      const timesForSelectedDate = movie.showDateTimes
        .filter(show => show.date === selectedDate)
        .map(show => show.time);
      
      setAvailableTimes(timesForSelectedDate);
      
      // If the current selected time is not available for the new date,
      // reset it or select the first available time
      if (!timesForSelectedDate.includes(selectedTime) && timesForSelectedDate.length > 0) {
        setSelectedTime(timesForSelectedDate[0]);
      } else if (timesForSelectedDate.length === 0) {
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
  
  const handleSubmit = async () => {
    if (!booking) return;
    
    try {
      setSubmitting(true);
      
      // Only update if date or time has changed
      if (selectedDate !== booking.showDate || selectedTime !== booking.showTime) {
        const updateRequest: UpdateBookingRequest = {
          showDate: selectedDate,
          showTime: selectedTime
        };
        
        const updatedBooking = await BookingService.update(bookingId, updateRequest);
        onBookingChanged(updatedBooking);
      } else {
        onClose();
      }
    } catch (err) {
      console.error('Error updating booking:', err);
      setError('Failed to update booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch {
      return dateString;
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Change Booking Date/Time</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" my={2}>
            {error}
          </Typography>
        ) : (
          <>
            <Typography variant="body1" gutterBottom sx={{ mt: 1 }}>
              {movie?.title}
            </Typography>

            <FormControl fullWidth margin="normal">
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
            
            <FormControl fullWidth margin="normal" disabled={!selectedDate || availableTimes.length === 0}>
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
            
            {availableTimes.length === 0 && selectedDate && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                No show times available for this date
              </Typography>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>        <Button 
          onClick={handleSubmit} 
          color="primary" 
          disabled={!!(
            submitting || 
            loading || 
            !selectedDate || 
            !selectedTime || 
            (booking && selectedDate === booking.showDate && selectedTime === booking.showTime)
          )}
        >
          {submitting ? 'Updating...' : 'Update Booking'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingChangeDialog;
