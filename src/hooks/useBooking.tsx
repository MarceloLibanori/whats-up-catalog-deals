
import { useState, useCallback } from 'react';
import { BookingForm, Booking, TimeSlot } from '@/types/booking';
import { getServiceById } from '@/data/services';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
    const formattedDate = format(new Date(booking.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    
    const message = `*AGENDAMENTO SALAO BELLA*

*Cliente:* ${booking.clientName}
*Telefone:* ${booking.clientPhone}

*Servico:* ${booking.service.name}
*Data:* ${formattedDate}
*Horario:* ${booking.time}
*Duracao:* ${booking.service.duration} minutos
*Valor:* R$ ${booking.service.price.toFixed(2).replace('.', ',')}

${booking.notes ? `*Observacoes:* ${booking.notes}` : ''}

Gostaria de confirmar este agendamento!

Obrigado(a)!`;

    return encodeURIComponent(message);
  }, []);

  const generateGoogleCalendarLink = useCallback((booking: Booking) => {
    // Criar data/hora de início
    const [year, month, day] = booking.date.split('-');
    const [hour, minute] = booking.time.split(':');
    
    const startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
    const endDate = new Date(startDate.getTime() + booking.service.duration * 60000);
    
    // Formatar datas para o Google Calendar (formato: YYYYMMDDTHHMMSSZ)
    const formatCalendarDate = (date: Date) => {
      const pad = (num: number) => num.toString().padStart(2, '0');
      
      return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
    };

    const startFormatted = formatCalendarDate(startDate);
    const endFormatted = formatCalendarDate(endDate);
    
    const title = `${booking.service.name} - ${booking.clientName}`;
    const details = `Cliente: ${booking.clientName}%0ATelefone: ${booking.clientPhone}%0AServico: ${booking.service.name}%0AValor: R$ ${booking.service.price.toFixed(2).replace('.', ',')}${booking.notes ? `%0AObservacoes: ${booking.notes}` : ''}`;
    const location = 'Salao Bella - Rua das Flores, 123, Centro - Sao Paulo, SP';
    
    const baseUrl = 'https://calendar.google.com/calendar/render';
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: `${startFormatted}/${endFormatted}`,
      details: details.replace(/%0A/g, '\n'),
      location: location,
      ctz: 'America/Sao_Paulo'
    });

    return `${baseUrl}?${params.toString()}`;
  }, []);

  const openGoogleCalendar = useCallback((booking: Booking) => {
    const calendarUrl = generateGoogleCalendarLink(booking);
    window.open(calendarUrl, '_blank');
  }, [generateGoogleCalendarLink]);

  return {
    bookings,
    createBooking,
    generateTimeSlots,
    generateWhatsAppMessage,
    generateGoogleCalendarLink,
    openGoogleCalendar
  };
};
