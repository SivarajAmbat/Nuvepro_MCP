import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  CircularProgress,
  Divider,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert
} from '@mui/material';
import { format } from 'date-fns';
import { BookingService } from '../../services/bookingService';
import { Booking } from '../../types';
import BookingChangeDialog from './BookingChangeDialog';

const BookingList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState<boolean>(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [changeDialogOpen, setChangeDialogOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await BookingService.getAll();
      setBookings(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Could not fetch your bookings. Please try again later.');
      setLoading(false);
    }
  };

  const handleCancelDialogOpen = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setCancelDialogOpen(true);
  };

  const handleCancelDialogClose = () => {
    setCancelDialogOpen(false);
    setSelectedBookingId(null);
  };

  const handleChangeDialogOpen = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setChangeDialogOpen(true);
  };

  const handleChangeDialogClose = () => {
    setChangeDialogOpen(false);
    setSelectedBookingId(null);
  };

  const handleCancelBooking = async () => {
    if (!selectedBookingId) return;
    
    try {
      await BookingService.cancel(selectedBookingId);
      
      // Update local state
      setBookings(prevBookings => prevBookings.filter(booking => booking.id !== selectedBookingId));
      
      // Show success notification
      setNotification({
        message: 'Booking cancelled successfully',
        type: 'success'
      });
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setNotification({
        message: 'Failed to cancel booking. Please try again.',
        type: 'error'
      });
    } finally {
      handleCancelDialogClose();
    }
  };

  const handleBookingChanged = (updatedBooking: Booking) => {
    // Update the local state with the updated booking
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === updatedBooking.id ? updatedBooking : booking
      )
    );
    
    // Show success notification
    setNotification({
      message: 'Booking updated successfully',
      type: 'success'
    });
    handleChangeDialogClose();
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        My Bookings
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      {bookings.length > 0 ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>
          {bookings.map((booking) => (
            <Box key={booking.id} sx={{ width: { xs: '100%', md: '50%' }, p: 1.5 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {booking.movie?.title}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={`${booking.numberOfSeats} ${booking.numberOfSeats > 1 ? 'seats' : 'seat'}`} 
                      color="primary" 
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip 
                      label={`${formatDate(booking.showDate)} at ${booking.showTime}`} 
                      color="secondary" 
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Booked by: {booking.customerName}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Booking date: {formatDate(booking.bookingDate)}
                  </Typography>
                  
                  {booking.movie && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Movie duration: {booking.movie.duration} minutes
                    </Typography>
                  )}
                  
                  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      onClick={() => handleChangeDialogOpen(booking.id)}
                    >
                      Change Date/Time
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="error"
                      onClick={() => handleCancelDialogOpen(booking.id)}
                    >
                      Cancel Booking
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      ) : (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            You don't have any bookings yet
          </Typography>
        </Box>
      )}
      
      {/* Confirm Cancel Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={handleCancelDialogClose}
        aria-labelledby="cancel-booking-dialog-title"
        aria-describedby="cancel-booking-dialog-description"
      >
        <DialogTitle id="cancel-booking-dialog-title">
          Cancel Booking
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="cancel-booking-dialog-description">
            Are you sure you want to cancel this booking? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDialogClose} color="primary">
            No, Keep It
          </Button>
          <Button onClick={handleCancelBooking} color="error" autoFocus>
            Yes, Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Change Booking Dialog */}
      {selectedBookingId && changeDialogOpen && (
        <BookingChangeDialog 
          open={changeDialogOpen}
          bookingId={selectedBookingId}
          onClose={handleChangeDialogClose}
          onBookingChanged={handleBookingChanged}
        />
      )}
        {/* Notifications */}
      {notification && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.type}
            elevation={6}
            variant="filled"
          >
            {notification.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default BookingList;