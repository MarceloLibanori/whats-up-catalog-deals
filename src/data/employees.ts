
import { Employee } from '@/types/booking';

export const employees: Employee[] = [
  {
    id: 'emp-1',
    name: 'Maria Silva',
    specialties: ['cabelo', 'cilios'],
    workingHours: {
      start: '09:00',
      end: '18:00'
    },
    workingDays: [1, 2, 3, 4, 5, 6], // Segunda a sábado
    avatar: undefined
  },
  {
    id: 'emp-2',
    name: 'Ana Costa',
    specialties: ['unha', 'depilacao'],
    workingHours: {
      start: '08:00',
      end: '17:00'
    },
    workingDays: [1, 2, 3, 4, 5], // Segunda a sexta
    avatar: undefined
  },
  {
    id: 'emp-3',
    name: 'Carla Santos',
    specialties: ['cabelo', 'unha'],
    workingHours: {
      start: '10:00',
      end: '19:00'
    },
    workingDays: [2, 3, 4, 5, 6], // Terça a sábado
    avatar: undefined
  },
  {
    id: 'emp-4',
    name: 'Julia Oliveira',
    specialties: ['cilios', 'depilacao'],
    workingHours: {
      start: '09:00',
      end: '16:00'
    },
    workingDays: [1, 3, 5, 6], // Segunda, quarta, sexta e sábado
    avatar: undefined
  }
];

export const getEmployeesBySpecialty = (specialty: Employee['specialties'][0]) => {
  return employees.filter(employee => employee.specialties.includes(specialty));
};

export const getEmployeeById = (id: string) => {
  return employees.find(employee => employee.id === id);
};
