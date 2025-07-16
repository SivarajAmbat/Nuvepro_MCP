# Movie Booking System API

A Node.js backend API for movie booking system with in-memory database.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will run on http://localhost:3000

## Docker Deployment

### Build the Docker Image

```bash
docker build -t movie-booking-api .
```

### Run the Container

```bash
docker run -d -p 3000:3000 --name movie-booking-api movie-booking-api
```

This will:
- Build an optimized production image
- Run the container in detached mode (-d)
- Map port 3000 from the container to your host machine
- Name the container "movie-booking-api"

To use a different port on your host machine (e.g., if port 3000 is already in use):
```bash
docker run -d -p 3002:3000 --name movie-booking-api movie-booking-api
```
This will map the container's port 3000 to port 3002 on your host machine.

To stop the container:
```bash
docker stop movie-booking-api
```

To remove the container:
```bash
docker rm movie-booking-api
```

## API Documentation

### Movies

#### GET /api/movies
Get all available movies.

**Response**
- Status: 200 OK
- Content-Type: application/json
```json
[
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
]
```

#### POST /api/movies
Add a new movie to the system.

**Request Body**
- Content-Type: application/json
```json
{
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

**Response**
- Status: 201 Created
- Content-Type: application/json
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

**Error Responses**
- Status: 400 Bad Request
```json
{
  "message": "Missing required fields"
}
```
- Status: 400 Bad Request
```json
{
  "message": "Show dates must be in the future"
}
```

#### GET /api/movies/:id
Get details of a specific movie by ID.

**Parameters**
- `id` (path parameter) - The unique identifier of the movie

**Response**
- Status: 200 OK
- Content-Type: application/json
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

**Error Responses**
- Status: 404 Not Found
```json
{
  "message": "Movie not found"
}
```

### Bookings

#### POST /api/bookings
Create a new movie booking.

**Request Body**
- Content-Type: application/json
```json
{
  "movieId": "string",
  "customerName": "string",
  "showDate": "string", // Format: YYYY-MM-DD
  "showTime": "string", // Format: HH:mm
  "numberOfSeats": number
}
```

**Response**
- Status: 201 Created
- Content-Type: application/json
```json
{
  "id": "string",
  "movieId": "string",
  "customerName": "string",
  "showDate": "string",
  "showTime": "string",
  "numberOfSeats": number,
  "bookingDate": "string" // ISO 8601 format
}
```

**Error Responses**
- Status: 400 Bad Request
```json
{
  "message": "Missing required fields"
}
```
- Status: 404 Not Found
```json
{
  "message": "Movie not found"
}
```
- Status: 400 Bad Request
```json
{
  "message": "Invalid show date or time"
}
```
- Status: 400 Bad Request
```json
{
  "message": "Not enough seats available"
}
```

#### GET /api/bookings
Get all bookings.

**Response**
- Status: 200 OK
- Content-Type: application/json
```json
[
  {
    "id": "string",
    "movieId": "string",
    "customerName": "string",
    "showDate": "string",
    "showTime": "string",
    "numberOfSeats": number,
    "bookingDate": "string"
  }
]
```

#### GET /api/bookings/:id
Get details of a specific booking.

**Parameters**
- `id` (path parameter) - The unique identifier of the booking

**Response**
- Status: 200 OK
- Content-Type: application/json
```json
{
  "id": "string",
  "movieId": "string",
  "customerName": "string",
  "showDate": "string",
  "showTime": "string",
  "numberOfSeats": number,
  "bookingDate": "string"
}
```

**Error Responses**
- Status: 404 Not Found
```json
{
  "message": "Booking not found"
}
```

#### PUT /api/bookings/:id
Update a booking's show date and time.

**Parameters**
- `id` (path parameter) - The unique identifier of the booking

**Request Body**
- Content-Type: application/json
```json
{
  "showDate": "string", // Format: YYYY-MM-DD (optional)
  "showTime": "string"  // Format: HH:mm (optional)
}
```

**Response**
- Status: 200 OK
- Content-Type: application/json
```json
{
  "id": "string",
  "movieId": "string",
  "customerName": "string",
  "showDate": "string",
  "showTime": "string",
  "numberOfSeats": number,
  "bookingDate": "string"
}
```

**Error Responses**
- Status: 404 Not Found
```json
{
  "message": "Booking not found"
}
```
- Status: 400 Bad Request
```json
{
  "message": "Show date or time is required"
}
```
- Status: 400 Bad Request
```json
{
  "message": "Invalid show date or time"
}
```

#### DELETE /api/bookings/:id
Cancel a booking.

**Parameters**
- `id` (path parameter) - The unique identifier of the booking

**Response**
- Status: 200 OK
- Content-Type: application/json
```json
{
  "message": "Booking cancelled successfully"
}
```

**Error Responses**
- Status: 404 Not Found
```json
{
  "message": "Booking not found"
}
```

## Data Structure

The system uses an in-memory database with sample movies. Movies and bookings are stored in arrays and persist only during runtime.