export interface Movie {
  id: string;
  title: string;
  description: string;
  duration: number;
  showDateTimes: {
    date: string;
    time: string;
  }[];
  availableSeats: number;
}

export interface Booking {
  id: string;
  movieId: string;
  customerName: string;
  showDate: string;
  showTime: string;
  numberOfSeats: number;
  bookingDate: string;
  movie?: {
    title: string;
    description: string;
    duration: number;
  };
}

export interface CreateBookingRequest {
  movieId: string;
  customerName: string;
  showDate: string;
  showTime: string;
  numberOfSeats: number;
}

export interface UpdateBookingRequest {
  showDate?: string;
  showTime?: string;
}

export interface CreateMovieRequest {
  title: string;
  description: string;
  duration: number;
  showDateTimes: {
    date: string;
    time: string;
  }[];
  availableSeats: number;
}
