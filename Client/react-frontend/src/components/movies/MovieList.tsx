import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Typography, 
  CircularProgress,
  Stack,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { MovieService } from '../../services/movieService';
import { Movie } from '../../types';
import { useApiRequest } from '../../hooks/useApi';
import { formatDate } from '../../utils/dateUtils';

const MovieList: React.FC = () => {
  const { data: movies, loading, error } = useApiRequest<Movie[]>(
    MovieService.getAll,
    []
  );

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
    <Box sx={{ flexGrow: 1, mb: 4 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', margin: '-12px' }}>
        {movies && movies.length > 0 ? (
          movies.map((movie) => (
            <Box key={movie.id} sx={{ 
              width: { xs: '100%', sm: '50%', md: '33.33%' }, 
              padding: '12px'
            }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {movie.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {movie.description}
                  </Typography>
                  <Typography variant="body2">
                    Duration: {movie.duration} minutes
                  </Typography>
                  <Typography variant="body2">
                    Available seats: {movie.availableSeats}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Upcoming Shows: {movie.showDateTimes.length > 0 ? 
                      movie.showDateTimes.slice(0, 2).map(show => 
                        `${formatDate(show.date, 'MMM dd')} at ${show.time}`
                      ).join(', ') + (movie.showDateTimes.length > 2 ? '...' : '')
                      : 'None scheduled'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    component={RouterLink} 
                    to={`/movies/${movie.id}`}
                    variant="outlined"
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Box>
          ))        ) : (
          <Box sx={{ width: '100%', padding: '12px', textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No movies available
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MovieList;
