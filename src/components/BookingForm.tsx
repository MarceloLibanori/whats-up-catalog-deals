import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import ServiceSelector from './ServiceSelector';
import EmployeeSelector from './EmployeeSelector';
import DateTimeSelector from './DateTimeSelector';
import GoogleAuthButton from './GoogleAuthButton';
import { useBooking } from '@/hooks/useBooking';
import { getServiceById } from '@/data/services';
import { getEmployeeById } from '@/data/employees';
import { BookingForm as BookingFormData } from '@/types/booking';
import { TimeSlot } from '@/types/booking';
import { MessageCircle, Calendar, Phone, User, CalendarPlus } from 'lucide-react';

const BookingForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>({
    clientName: '',
    clientPhone: '',
    serviceId: '',
    employeeId: '',
    date: '',
    time: '',
    notes: ''
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);

  const { createBooking, generateTimeSlots, generateWhatsAppMessage, openGoogleCalendar } = useBooking();

  const selectedService = getServiceById(formData.serviceId);
  const selectedEmployee = getEmployeeById(formData.employeeId);

  // Gerar horários disponíveis quando data ou funcionário mudarem
  useEffect(() => {
    const loadAvailableSlots = async () => {
      if (selectedDate && formData.employeeId) {
        const slots = await generateTimeSlots(selectedDate.toISOString().split('T')[0], formData.employeeId);
        setAvailableSlots(slots);
      } else {
        setAvailableSlots([]);
      }
    };

    loadAvailableSlots();
  }, [selectedDate, formData.employeeId, generateTimeSlots]);

  const handleServiceSelect = (serviceId: string) => {
    setFormData(prev => ({ 
      ...prev, 
      serviceId,
      employeeId: '', // Reset employee when service changes
      time: '' // Reset time when service changes
    }));
  };

  const handleEmployeeSelect = (employeeId: string) => {
    setFormData(prev => ({ 
      ...prev, 
      employeeId,
      time: '' // Reset time when employee changes
    }));
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
      case 2: return formData.employeeId !== '';
      case 3: return formData.date !== '' && formData.time !== '';
      case 4: return formData.clientName !== '' && formData.clientPhone !== '';
      default: return false;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Google Calendar Auth Button */}
      <div className="flex justify-center">
        <GoogleAuthButton />
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3, 4].map((stepNumber) => (
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
            {stepNumber < 4 && (
              <div className={`w-12 h-0.5 ${step > stepNumber ? 'bg-pink-600' : 'bg-gray-300'}`} />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl text-pink-700">
            {step === 1 && 'Escolha o Serviço'}
            {step === 2 && 'Escolha o Profissional'}
            {step === 3 && 'Data e Horário'}
            {step === 4 && 'Seus Dados'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <ServiceSelector
              selectedServiceId={formData.serviceId}
              onServiceSelect={(serviceId) => {
                setFormData(prev => ({ 
                  ...prev, 
                  serviceId,
                  employeeId: '', 
                  time: '' 
                }));
              }}
            />
          )}

          {step === 2 && selectedService && (
            <EmployeeSelector
              selectedService={selectedService}
              selectedEmployeeId={formData.employeeId}
              onEmployeeSelect={(employeeId) => {
                setFormData(prev => ({ 
                  ...prev, 
                  employeeId,
                  time: '' 
                }));
              }}
            />
          )}

          {step === 3 && (
            <div className="space-y-4">
              {selectedService && selectedEmployee && (
                <Card className="bg-pink-50 border-pink-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-pink-800 mb-2">Seleção atual:</h4>
                    <div className="space-y-1 text-sm">
                      <p className="text-pink-700"><strong>Serviço:</strong> {selectedService.name}</p>
                      <p className="text-pink-700"><strong>Profissional:</strong> {selectedEmployee.name}</p>
                      <p className="text-pink-600">
                        {selectedService.duration} min - R$ {selectedService.price.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <DateTimeSelector
                selectedDate={selectedDate}
                selectedTime={formData.time}
                availableSlots={availableSlots}
                onDateSelect={(date) => {
                  setSelectedDate(date);
                  if (date) {
                    setFormData(prev => ({ 
                      ...prev, 
                      date: date.toISOString().split('T')[0],
                      time: '' 
                    }));
                  }
                }}
                onTimeSelect={(time) => {
                  setFormData(prev => ({ ...prev, time }));
                }}
              />
            </div>
          )}

          {step === 4 && (
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
                    onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
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
                    onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
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
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
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
                    <p><strong>Profissional:</strong> {selectedEmployee?.name}</p>
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

            {step < 4 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!((step === 1 && formData.serviceId) || 
                           (step === 2 && formData.employeeId) || 
                           (step === 3 && formData.date && formData.time) || 
                           (step === 4 && formData.clientName && formData.clientPhone))}
                className="bg-pink-600 hover:bg-pink-700"
              >
                Próximo
              </Button>
            ) : (
              <Button
                onClick={async () => {
                  try {
                    const booking = await createBooking(formData);
                    const whatsappMessage = generateWhatsAppMessage(booking);

                    const phoneNumber = "5511947537240";
                    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;
                    window.open(whatsappUrl, '_blank');

                    setTimeout(() => {
                      openGoogleCalendar(booking);
                    }, 1000);

                    toast({
                      title: "Agendamento criado!",
                      description: "Seu agendamento foi enviado via WhatsApp e você pode adicionar ao Google Calendar.",
                    });

                    setFormData({
                      clientName: '',
                      clientPhone: '',
                      serviceId: '',
                      employeeId: '',
                      date: '',
                      time: '',
                      notes: ''
                    });
                    setSelectedDate(undefined);
                    setAvailableSlots([]);
                    setStep(1);

                  } catch (error) {
                    toast({
                      title: "Erro",
                      description: error instanceof Error ? error.message : "Não foi possível criar o agendamento. Tente novamente.",
                      variant: "destructive",
                    });
                  }
                }}
                disabled={!(formData.clientName && formData.clientPhone)}
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
