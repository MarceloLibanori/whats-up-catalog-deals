
import { useState, useCallback } from 'react';
import { BookingForm, Booking, TimeSlot } from '@/types/booking';
import { getServiceById } from '@/data/services';

export const useBooking = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Horários disponíveis (9h às 18h)
  const generateTimeSlots = useCallback((date: string): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute of [0, 30]) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Verifica se o horário está ocupado
        const isBooked = bookings.some(booking => 
          booking.date === date && booking.time === time && booking.status !== 'cancelled'
        );
        
        slots.push({
          time,
          available: !isBooked
        });
      }
    }
    return slots;
  }, [bookings]);

  const createBooking = useCallback((bookingData: BookingForm): Booking => {
    const service = getServiceById(bookingData.serviceId);
    if (!service) {
      throw new Error('Serviço não encontrado');
    }

    const newBooking: Booking = {
      id: Date.now().toString(),
      clientName: bookingData.clientName,
      clientPhone: bookingData.clientPhone,
      service,
      date: bookingData.date,
      time: bookingData.time,
      status: 'pending',
      notes: bookingData.notes
    };

    setBookings(prev => [...prev, newBooking]);
    return newBooking;
  }, []);

  const generateWhatsAppMessage = useCallback((booking: Booking) => {
    const message = `*AGENDAMENTO SALAO BELLA*

*Cliente:* ${booking.clientName}
*Telefone:* ${booking.clientPhone}

*Serviço:* ${booking.service.name}
*Data:* ${new Date(booking.date).toLocaleDateString('pt-BR')}
*Horário:* ${booking.time}
*Duração:* ${booking.service.duration} minutos
*Valor:* R$ ${booking.service.price.toFixed(2).replace('.', ',')}

${booking.notes ? `*Observações:* ${booking.notes}` : ''}

Gostaria de confirmar este agendamento!

Obrigado(a)! 💅✨`;

    return encodeURIComponent(message);
  }, []);

  const generateGoogleCalendarLink = useCallback((booking: Booking) => {
    const startDate = new Date(`${booking.date}T${booking.time}:00`);
    const endDate = new Date(startDate.getTime() + booking.service.duration * 60000);
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `${booking.service.name} - ${booking.clientName}`,
      dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
      details: `Cliente: ${booking.clientName}\nTelefone: ${booking.clientPhone}\nServiço: ${booking.service.name}\nValor: R$ ${booking.service.price.toFixed(2)}${booking.notes ? `\nObservações: ${booking.notes}` : ''}`,
      location: 'Salão Bella'
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }, []);

  return {
    bookings,
    createBooking,
    generateTimeSlots,
    generateWhatsAppMessage,
    generateGoogleCalendarLink
  };
};
