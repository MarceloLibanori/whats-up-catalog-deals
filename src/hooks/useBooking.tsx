import { useState, useCallback, useEffect } from 'react';
import { BookingForm, Booking, TimeSlot } from '@/types/booking';
import { getServiceById } from '@/data/services';
import { getEmployeeById } from '@/data/employees';
import { getBookings, addBooking, updateBooking, removeBooking, filterBookings } from '@/data/bookings';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const useBooking = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Carregar agendamentos na inicialização
  useEffect(() => {
    setBookings(getBookings());
  }, []);

  // Gerar horários considerando disponibilidade do funcionário
  const generateTimeSlots = useCallback((date: string, employeeId: string): TimeSlot[] => {
    const employee = getEmployeeById(employeeId);
    if (!employee) return [];

    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();

    // Verificar se o funcionário trabalha neste dia
    if (!employee.workingDays.includes(dayOfWeek)) {
      return [];
    }

    const slots: TimeSlot[] = [];
    const [startHour, startMinute] = employee.workingHours.start.split(':').map(Number);
    const [endHour, endMinute] = employee.workingHours.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    // Gerar slots de 30 em 30 minutos
    for (let time = startTime; time < endTime; time += 30) {
      const hour = Math.floor(time / 60);
      const minute = time % 60;
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // Verificar se o horário está ocupado para este funcionário usando os dados atuais
      const currentBookings = getBookings();
      const isBooked = currentBookings.some(booking => 
        booking.date === date && 
        booking.time === timeString && 
        booking.employee.id === employeeId &&
        booking.status !== 'cancelled'
      );
      
      slots.push({
        time: timeString,
        available: !isBooked
      });
    }

    return slots;
  }, []);

  const createBooking = useCallback((bookingData: BookingForm): Booking => {
    const service = getServiceById(bookingData.serviceId);
    const employee = getEmployeeById(bookingData.employeeId);
    
    if (!service) {
      throw new Error('Serviço não encontrado');
    }
    
    if (!employee) {
      throw new Error('Funcionário não encontrado');
    }

    const newBooking: Booking = {
      id: Date.now().toString(),
      clientName: bookingData.clientName,
      clientPhone: bookingData.clientPhone,
      service,
      employee,
      date: bookingData.date,
      time: bookingData.time,
      status: 'pending',
      notes: bookingData.notes
    };

    addBooking(newBooking);
    setBookings(getBookings());
    return newBooking;
  }, []);

  const updateBookingStatus = useCallback((bookingId: string, status: Booking['status']) => {
    updateBooking(bookingId, { status });
    setBookings(getBookings());
  }, []);

  const cancelBooking = useCallback((bookingId: string) => {
    updateBookingStatus(bookingId, 'cancelled');
  }, [updateBookingStatus]);

  const confirmBooking = useCallback((bookingId: string) => {
    updateBookingStatus(bookingId, 'confirmed');
  }, [updateBookingStatus]);

  const deleteBooking = useCallback((bookingId: string) => {
    removeBooking(bookingId);
    setBookings(getBookings());
  }, []);

  const generateWhatsAppMessage = useCallback((booking: Booking) => {
    const formattedDate = format(new Date(booking.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    
    const message = `*AGENDAMENTO SALAO BELLA*

*Cliente:* ${booking.clientName}
*Telefone:* ${booking.clientPhone}

*Servico:* ${booking.service.name}
*Profissional:* ${booking.employee.name}
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
    
    const formatCalendarDate = (date: Date) => {
      const pad = (num: number) => num.toString().padStart(2, '0');
      
      return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
    };

    const startFormatted = formatCalendarDate(startDate);
    const endFormatted = formatCalendarDate(endDate);
    
    const title = `${booking.service.name} - ${booking.clientName}`;
    const details = `Cliente: ${booking.clientName}\\nTelefone: ${booking.clientPhone}\\nServico: ${booking.service.name}\\nProfissional: ${booking.employee.name}\\nValor: R$ ${booking.service.price.toFixed(2).replace('.', ',')}${booking.notes ? `\\nObservacoes: ${booking.notes}` : ''}`;
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
    return filterBookings(booking => booking.date === date && booking.status !== 'cancelled');
  }, []);

  const getBookingsByStatus = useCallback((status: Booking['status']) => {
    return filterBookings(booking => booking.status === status);
  }, []);

  const getBookingsByEmployee = useCallback((employeeId: string) => {
    return filterBookings(booking => booking.employee.id === employeeId && booking.status !== 'cancelled');
  }, []);

  return {
    bookings,
    createBooking,
    updateBookingStatus,
    cancelBooking,
    confirmBooking,
    deleteBooking,
    generateTimeSlots,
    generateWhatsAppMessage,
    generateGoogleCalendarLink,
    openGoogleCalendar,
    getBookingsByDate,
    getBookingsByStatus,
    getBookingsByEmployee
  };
};
