
export interface Service {
  id: string;
  name: string;
  category: 'cabelo' | 'unha' | 'depilacao' | 'cilios';
  duration: number; // em minutos
  price: number;
  description: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Booking {
  id: string;
  clientName: string;
  clientPhone: string;
  service: Service;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
}

export interface BookingForm {
  clientName: string;
  clientPhone: string;
  serviceId: string;
  date: string;
  time: string;
  notes?: string;
}
