
export interface Service {
  id: string;
  name: string;
  category: 'cabelo' | 'unha' | 'depilacao' | 'cilios';
  duration: number; // em minutos
  price: number;
  description: string;
}

export interface Employee {
  id: string;
  name: string;
  specialties: ('cabelo' | 'unha' | 'depilacao' | 'cilios')[];
  workingHours: {
    start: string; // HH:MM
    end: string; // HH:MM
  };
  workingDays: number[]; // 0-6 (domingo-sabado)
  avatar?: string;
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
  employee: Employee;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
}

export interface BookingForm {
  clientName: string;
  clientPhone: string;
  serviceId: string;
  employeeId: string;
  date: string;
  time: string;
  notes?: string;
}
