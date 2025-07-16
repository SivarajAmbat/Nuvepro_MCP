# API Documentation

## Movies Endpoints

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

## Bookings Endpoints

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
  "showDate": "string",
  "showTime": "string"  
}
```
