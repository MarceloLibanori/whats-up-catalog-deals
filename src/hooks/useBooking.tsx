
import { useState, useCallback, useEffect } from 'react';
import { BookingForm, Booking, TimeSlot } from '@/types/booking';
import { getServiceById } from '@/data/services';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const useBooking = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Carregar agendamentos do localStorage na inicialização
  useEffect(() => {
    const savedBookings = localStorage.getItem('salon-bookings');
    if (savedBookings) {
      try {
        setBookings(JSON.parse(savedBookings));
      } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
      }
    }
  }, []);

  // Salvar agendamentos no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('salon-bookings', JSON.stringify(bookings));
  }, [bookings]);

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

  const updateBookingStatus = useCallback((bookingId: string, status: Booking['status']) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId ? { ...booking, status } : booking
      )
    );
  }, []);

  const cancelBooking = useCallback((bookingId: string) => {
    updateBookingStatus(bookingId, 'cancelled');
  }, [updateBookingStatus]);

  const confirmBooking = useCallback((bookingId: string) => {
    updateBookingStatus(bookingId, 'confirmed');
  }, [updateBookingStatus]);

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

Obrigado!`;

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
    const details = `Cliente: ${booking.clientName}\\nTelefone: ${booking.clientPhone}\\nServico: ${booking.service.name}\\nValor: R$ ${booking.service.price.toFixed(2).replace('.', ',')}${booking.notes ? `\\nObservacoes: ${booking.notes}` : ''}`;
    const location = 'Salao Bella - Rua das Flores, 123, Centro - Sao Paulo, SP';
    
    const baseUrl = 'https://calendar.google.com/calendar/render';
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: `${startFormatted}/${endFormatted}`,
      details: details,
      location: location,
      ctz: 'America/Sao_Paulo'
    });

    return `${baseUrl}?${params.toString()}`;
  }, []);

  const openGoogleCalendar = useCallback((booking: Booking) => {
    const calendarUrl = generateGoogleCalendarLink(booking);
    window.open(calendarUrl, '_blank');
  }, [generateGoogleCalendarLink]);

  const getBookingsByDate = useCallback((date: string) => {
    return bookings.filter(booking => booking.date === date && booking.status !== 'cancelled');
  }, [bookings]);

  const getBookingsByStatus = useCallback((status: Booking['status']) => {
    return bookings.filter(booking => booking.status === status);
  }, [bookings]);

  return {
    bookings,
    createBooking,
    updateBookingStatus,
    cancelBooking,
    confirmBooking,
    generateTimeSlots,
    generateWhatsAppMessage,
    generateGoogleCalendarLink,
    openGoogleCalendar,
    getBookingsByDate,
    getBookingsByStatus
  };
};
