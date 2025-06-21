
import { Booking } from '@/types/booking';

// Array para armazenar os agendamentos em memória
let bookingsData: Booking[] = [];

export const getBookings = (): Booking[] => {
  return [...bookingsData];
};

export const addBooking = (booking: Booking): void => {
  bookingsData.push(booking);
};

export const updateBooking = (bookingId: string, updates: Partial<Booking>): void => {
  const index = bookingsData.findIndex(booking => booking.id === bookingId);
  if (index !== -1) {
    bookingsData[index] = { ...bookingsData[index], ...updates };
  }
};

export const removeBooking = (bookingId: string): void => {
  bookingsData = bookingsData.filter(booking => booking.id !== bookingId);
};

export const filterBookings = (predicate: (booking: Booking) => boolean): Booking[] => {
  return bookingsData.filter(predicate);
};
