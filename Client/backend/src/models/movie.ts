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