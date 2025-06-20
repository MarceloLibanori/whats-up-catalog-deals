
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBooking } from '@/hooks/useBooking';
import { Booking } from '@/types/booking';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Calendar, 
  Clock, 
  Phone, 
  User, 
  CheckCircle, 
  XCircle, 
  MessageCircle,
  ExternalLink,
  Scissors,
  Trash2
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const BookingManager: React.FC = () => {
  const { 
    bookings, 
    confirmBooking, 
    cancelBooking,
    deleteBooking,
    generateWhatsAppMessage,
    openGoogleCalendar,
    getBookingsByStatus 
  } = useBooking();

  const pendingBookings = getBookingsByStatus('pending');
  const confirmedBookings = getBookingsByStatus('confirmed');
  const cancelledBookings = getBookingsByStatus('cancelled');

  const handleConfirm = (bookingId: string) => {
    confirmBooking(bookingId);
    toast({
      title: "Agendamento confirmado!",
      description: "O agendamento foi confirmado com sucesso.",
    });
  };

  const handleCancel = (bookingId: string) => {
    cancelBooking(bookingId);
    toast({
      title: "Agendamento cancelado",
      description: "O agendamento foi cancelado.",
      variant: "destructive",
    });
  };

  const handleDelete = (bookingId: string) => {
    deleteBooking(bookingId);
    toast({
      title: "Agendamento excluído",
      description: "O agendamento foi excluído permanentemente.",
      variant: "destructive",
    });
  };

  const handleWhatsApp = (booking: Booking) => {
    const message = generateWhatsAppMessage(booking);
    const phoneNumber = "5511947537240";
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank');
  };

  const StatusBadge = ({ status }: { status: Booking['status'] }) => {
    const variants = {
      pending: { variant: 'outline' as const, color: 'text-yellow-600', text: 'Pendente' },
      confirmed: { variant: 'default' as const, color: 'text-green-600', text: 'Confirmado' },
      cancelled: { variant: 'destructive' as const, color: 'text-red-600', text: 'Cancelado' }
    };

    const config = variants[status];
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const BookingCard = ({ booking, showActions = true }: { booking: Booking; showActions?: boolean }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg">{booking.clientName}</h3>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Phone className="w-4 h-4" />
              {booking.clientPhone}
            </p>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-pink-600" />
            <span>{format(new Date(booking.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-pink-600" />
            <span>{booking.time} ({booking.service.duration} min)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Scissors className="w-4 h-4 text-pink-600" />
            <span><strong>Profissional:</strong> {booking.employee.name}</span>
          </div>
          <div className="text-sm">
            <strong>Serviço:</strong> {booking.service.name}
          </div>
          <div className="text-sm">
            <strong>Valor:</strong> R$ {booking.service.price.toFixed(2).replace('.', ',')}
          </div>
          {booking.notes && (
            <div className="text-sm">
              <strong>Observações:</strong> {booking.notes}
            </div>
          )}
        </div>

        {showActions && (
          <div className="flex gap-2 flex-wrap">
            {booking.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleConfirm(booking.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Confirmar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleCancel(booking.id)}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Cancelar
                </Button>
              </>
            )}
            
            {booking.status === 'confirmed' && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleCancel(booking.id)}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
            )}
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleWhatsApp(booking)}
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              WhatsApp
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => openGoogleCalendar(booking)}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Google Agenda
            </Button>

            {(booking.status === 'confirmed' || booking.status === 'cancelled') && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(booking.id)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Excluir
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">Nenhum agendamento encontrado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{pendingBookings.length}</div>
            <div className="text-sm text-gray-600">Pendentes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{confirmedBookings.length}</div>
            <div className="text-sm text-gray-600">Confirmados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{cancelledBookings.length}</div>
            <div className="text-sm text-gray-600">Cancelados</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pendentes ({pendingBookings.length})</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmados ({confirmedBookings.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelados ({cancelledBookings.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4">
          {pendingBookings.length === 0 ? (
            <p className="text-center text-gray-500 py-4">Nenhum agendamento pendente</p>
          ) : (
            pendingBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="confirmed" className="space-y-4">
          {confirmedBookings.length === 0 ? (
            <p className="text-center text-gray-500 py-4">Nenhum agendamento confirmado</p>
          ) : (
            confirmedBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="cancelled" className="space-y-4">
          {cancelledBookings.length === 0 ? (
            <p className="text-center text-gray-500 py-4">Nenhum agendamento cancelado</p>
          ) : (
            cancelledBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookingManager;
