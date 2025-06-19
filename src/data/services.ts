
import { Service } from '@/types/booking';

export const services: Service[] = [
  // Cabelo
  {
    id: 'cabelo-1',
    name: 'Corte Feminino',
    category: 'cabelo',
    duration: 60,
    price: 80,
    description: 'Corte personalizado para cabelo feminino'
  },
  {
    id: 'cabelo-2',
    name: 'Corte Masculino',
    category: 'cabelo',
    duration: 30,
    price: 40,
    description: 'Corte masculino tradicional ou moderno'
  },
  {
    id: 'cabelo-3',
    name: 'Coloração',
    category: 'cabelo',
    duration: 120,
    price: 150,
    description: 'Coloração completa do cabelo'
  },
  {
    id: 'cabelo-4',
    name: 'Escova e Finalização',
    category: 'cabelo',
    duration: 45,
    price: 60,
    description: 'Escova modeladora e finalização'
  },

  // Unha
  {
    id: 'unha-1',
    name: 'Manicure Simples',
    category: 'unha',
    duration: 45,
    price: 35,
    description: 'Manicure tradicional com esmaltação'
  },
  {
    id: 'unha-2',
    name: 'Pedicure Simples',
    category: 'unha',
    duration: 60,
    price: 45,
    description: 'Pedicure tradicional com esmaltação'
  },
  {
    id: 'unha-3',
    name: 'Unha em Gel',
    category: 'unha',
    duration: 90,
    price: 80,
    description: 'Aplicação de unha em gel com design'
  },
  {
    id: 'unha-4',
    name: 'Nail Art',
    category: 'unha',
    duration: 120,
    price: 100,
    description: 'Decoração artística nas unhas'
  },

  // Depilação
  {
    id: 'depilacao-1',
    name: 'Pernas Completas',
    category: 'depilacao',
    duration: 60,
    price: 70,
    description: 'Depilação completa das pernas'
  },
  {
    id: 'depilacao-2',
    name: 'Axilas',
    category: 'depilacao',
    duration: 15,
    price: 25,
    description: 'Depilação das axilas'
  },
  {
    id: 'depilacao-3',
    name: 'Virilha',
    category: 'depilacao',
    duration: 30,
    price: 50,
    description: 'Depilação da região íntima'
  },
  {
    id: 'depilacao-4',
    name: 'Buço',
    category: 'depilacao',
    duration: 10,
    price: 20,
    description: 'Depilação do buço'
  },

  // Cílios
  {
    id: 'cilios-1',
    name: 'Extensão de Cílios Clássica',
    category: 'cilios',
    duration: 120,
    price: 120,
    description: 'Aplicação clássica de extensão de cílios'
  },
  {
    id: 'cilios-2',
    name: 'Extensão Volume Russo',
    category: 'cilios',
    duration: 150,
    price: 180,
    description: 'Técnica volume russo para cílios volumosos'
  },
  {
    id: 'cilios-3',
    name: 'Manutenção de Cílios',
    category: 'cilios',
    duration: 90,
    price: 80,
    description: 'Manutenção da extensão de cílios'
  },
  {
    id: 'cilios-4',
    name: 'Laminação de Cílios',
    category: 'cilios',
    duration: 60,
    price: 90,
    description: 'Laminação para cílios naturais'
  }
];

export const getServicesByCategory = (category: Service['category']) => {
  return services.filter(service => service.category === category);
};

export const getServiceById = (id: string) => {
  return services.find(service => service.id === id);
};
