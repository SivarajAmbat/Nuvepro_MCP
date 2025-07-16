import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Layout
import Layout from './components/layout/Layout';
import Home from './components/layout/Home';

// Movie Components
import MovieList from './components/movies/MovieList';
import MovieDetail from './components/movies/MovieDetail';
import AddMovie from './components/movies/AddMovie';

// Booking Components
import BookingList from './components/bookings/BookingList';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<MovieList />} />
            <Route path="/movies/add" element={<AddMovie />} />
            <Route path="/movies/:id" element={<MovieDetail />} />
            <Route path="/bookings" element={<BookingList />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
      <ToastContainer position="bottom-center" />
    </ThemeProvider>
  );
}

export default App;
