
import { Booking } from '@/types/booking';

const STORAGE_KEY = 'salon-bookings-data';

// Função para carregar dados do localStorage
const loadBookingsFromStorage = (): Booking[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Erro ao carregar agendamentos do localStorage:', error);
    return [];
  }
};

// Função para salvar dados no localStorage
const saveBookingsToStorage = (bookings: Booking[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  } catch (error) {
    console.error('Erro ao salvar agendamentos no localStorage:', error);
  }
};

// Carregar dados iniciais
let bookingsData: Booking[] = loadBookingsFromStorage();

export const getBookings = (): Booking[] => {
  // Sempre recarregar do localStorage para pegar dados mais recentes
  bookingsData = loadBookingsFromStorage();
  return [...bookingsData];
};

export const addBooking = (booking: Booking): void => {
  bookingsData = loadBookingsFromStorage();
  bookingsData.push(booking);
  saveBookingsToStorage(bookingsData);
};

export const updateBooking = (bookingId: string, updates: Partial<Booking>): void => {
  bookingsData = loadBookingsFromStorage();
  const index = bookingsData.findIndex(booking => booking.id === bookingId);
  if (index !== -1) {
    bookingsData[index] = { ...bookingsData[index], ...updates };
    saveBookingsToStorage(bookingsData);
  }
};

export const removeBooking = (bookingId: string): void => {
  bookingsData = loadBookingsFromStorage();
  bookingsData = bookingsData.filter(booking => booking.id !== bookingId);
  saveBookingsToStorage(bookingsData);
};

export const filterBookings = (predicate: (booking: Booking) => boolean): Booking[] => {
  const currentBookings = loadBookingsFromStorage();
  return currentBookings.filter(predicate);
};
