
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import ServiceSelector from './ServiceSelector';
import DateTimeSelector from './DateTimeSelector';
import { useBooking } from '@/hooks/useBooking';
import { getServiceById } from '@/data/services';
import { BookingForm as BookingFormData } from '@/types/booking';
import { MessageCircle, Calendar, Phone, User, CalendarPlus } from 'lucide-react';

const BookingForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>({
    clientName: '',
    clientPhone: '',
    serviceId: '',
    date: '',
    time: '',
    notes: ''
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const { createBooking, generateTimeSlots, generateWhatsAppMessage, openGoogleCalendar } = useBooking();

  const availableSlots = selectedDate 
    ? generateTimeSlots(selectedDate.toISOString().split('T')[0])
    : [];

  const handleServiceSelect = (serviceId: string) => {
    setFormData(prev => ({ ...prev, serviceId }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFormData(prev => ({ 
        ...prev, 
        date: date.toISOString().split('T')[0],
        time: '' // Reset time when date changes
      }));
    }
  };

  const handleTimeSelect = (time: string) => {
    setFormData(prev => ({ ...prev, time }));
  };

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceedToNextStep = () => {
    switch (step) {
      case 1: return formData.serviceId !== '';
      case 2: return formData.date !== '' && formData.time !== '';
      case 3: return formData.clientName !== '' && formData.clientPhone !== '';
      default: return false;
    }
  };

  const handleSubmit = () => {
    try {
      const booking = createBooking(formData);
      const whatsappMessage = generateWhatsAppMessage(booking);

      // Abrir WhatsApp
      const phoneNumber = "5511947537240"; // Substitua pelo número do salão
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;
      window.open(whatsappUrl, '_blank');

      // Abrir Google Calendar após um pequeno delay
      setTimeout(() => {
        openGoogleCalendar(booking);
      }, 1000);

      toast({
        title: "Agendamento criado!",
        description: "Seu agendamento foi enviado via WhatsApp e você pode adicionar ao Google Calendar.",
      });

      // Reset form
      setFormData({
        clientName: '',
        clientPhone: '',
        serviceId: '',
        date: '',
        time: '',
        notes: ''
      });
      setSelectedDate(undefined);
      setStep(1);

    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o agendamento. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const selectedService = getServiceById(formData.serviceId);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step >= stepNumber
                  ? 'bg-pink-600 border-pink-600 text-white'
                  : 'border-gray-300 text-gray-400'
              }`}
            >
              {stepNumber}
            </div>
            {stepNumber < 3 && (
              <div className={`w-12 h-0.5 ${step > stepNumber ? 'bg-pink-600' : 'bg-gray-300'}`} />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl text-pink-700">
            {step === 1 && 'Escolha o Serviço'}
            {step === 2 && 'Data e Horário'}
            {step === 3 && 'Seus Dados'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <ServiceSelector
              selectedServiceId={formData.serviceId}
              onServiceSelect={handleServiceSelect}
            />
          )}

          {step === 2 && (
            <div className="space-y-4">
              {selectedService && (
                <Card className="bg-pink-50 border-pink-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-pink-800">Serviço selecionado:</h4>
                    <p className="text-pink-700">{selectedService.name}</p>
                    <p className="text-sm text-pink-600">
                      {selectedService.duration} min - R$ {selectedService.price.toFixed(2).replace('.', ',')}
                    </p>
                  </CardContent>
                </Card>
              )}
              
              <DateTimeSelector
                selectedDate={selectedDate}
                selectedTime={formData.time}
                availableSlots={availableSlots}
                onDateSelect={handleDateSelect}
                onTimeSelect={handleTimeSelect}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nome completo
                  </Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="clientPhone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Telefone/WhatsApp
                  </Label>
                  <Input
                    id="clientPhone"
                    value={formData.clientPhone}
                    onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Observações (opcional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Alguma observação especial..."
                  rows={3}
                />
              </div>

              {/* Resumo do agendamento */}
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <h4 className="font-medium text-gray-800 mb-2">Resumo do agendamento:</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Serviço:</strong> {selectedService?.name}</p>
                    <p><strong>Data:</strong> {selectedDate?.toLocaleDateString('pt-BR')}</p>
                    <p><strong>Horário:</strong> {formData.time}</p>
                    <p><strong>Duração:</strong> {selectedService?.duration} minutos</p>
                    <p><strong>Valor:</strong> R$ {selectedService?.price.toFixed(2).replace('.', ',')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
            >
              Voltar
            </Button>

            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceedToNextStep()}
                className="bg-pink-600 hover:bg-pink-700"
              >
                Próximo
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceedToNextStep()}
                className="bg-pink-600 hover:bg-pink-700"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                <CalendarPlus className="w-4 h-4 mr-2" />
                Enviar Agendamento
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingForm;
