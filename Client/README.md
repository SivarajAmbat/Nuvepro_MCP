# Movie Booking Application

This is a full-stack movie booking application with a Node.js/Express TypeScript backend and a modern React TypeScript frontend.

## Project Structure

- `node-backend/`: Node.js backend API for movie booking
- `react-frontend/`: React frontend application

## Features

- Browse available movies
- Book movie tickets for specific dates/times
- View booking details
- Cancel bookings
- Change booking date/time
- Add new movies as an administrator

## Tech Stack

### Backend
- **Node.js** with **Express** framework
- **TypeScript** for type-safe code
- **Jest** for unit and integration testing
- RESTful API architecture
- In-memory data storage (no external database required)

### Frontend
- **React 19** with functional components and hooks
- **TypeScript** for improved development experience
- **Material UI v7** for modern UI components and styling
- **React Router v7** for client-side routing
- **Axios** for API communication
- **React Hook Form** for form handling
- **Date-fns** for date manipulation
- **Testing Library** for component testing
- **Selenium** for end-to-end testing

## How to Start the Movie Ticket Booking Application
- Navigate to the Movie Ticket Booking System Application Directory
- Start the Application
   - Double-click on the file named start-app.
   - All required dependencies will be installed.
   - The backend and frontend services will start.
- Access the Application
   - Once everything is set up, the application will automatically open in your default web browser at: http://localhost:3000

## API Documentation

### Movies Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/movies` | Get all movies | - | Array of movie objects |
| GET | `/api/movies` | Get movie by Name | - | Single movie object |
| POST | `/api/movies` | Create a new movie | Movie object | Created movie object |

**Movie Object Structure:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "duration": number,
  "showDateTimes": [
    {
      "date": "string", // Format: YYYY-MM-DD
      "time": "string"  // Format: HH:mm
    }
  ],
  "availableSeats": number
}
```

### Bookings Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/bookings` | Get all bookings | - | Array of booking objects |
| GET | `/api/bookings/:id` | Get booking by ID | - | Single booking object |
| POST | `/api/bookings` | Create a new booking | Booking creation object | Created booking object |
| DELETE | `/api/bookings/:id` | Cancel a booking | - | Success message |
| PUT | `/api/bookings/:id` | Update booking date/time | Update object | Updated booking object |

**Booking Object Structure:**
```json
{
  "id": "string",
  "movieId": "string",
  "customerName": "string",
  "showDate": "string", // Format: YYYY-MM-DD
  "showTime": "string", // Format: HH:mm
  "numberOfSeats": number,
  "bookingDate": "string" // ISO 8601 format
}
```

**Booking Creation Object:**
```json
{
  "movieId": "string",
  "customerName": "string",
  "showDate": "string",
  "showTime": "string",
  "numberOfSeats": number
}
```

**Booking Update Object:**
```json
{
  "showDate": "string", // Optional
  "showTime": "string"  // Optional
}
```




