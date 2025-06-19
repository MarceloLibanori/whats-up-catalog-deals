
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TimeSlot } from '@/types/booking';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DateTimeSelectorProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  availableSlots: TimeSlot[];
  onDateSelect: (date: Date | undefined) => void;
  onTimeSelect: (time: string) => void;
}

const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  selectedDate,
  selectedTime,
  availableSlots,
  onDateSelect,
  onTimeSelect
}) => {
  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 2); // Até 2 meses no futuro

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Escolha a data:</h3>
        <Card>
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateSelect}
              disabled={(date) => date < today || date > maxDate}
              locale={ptBR}
              className="rounded-md border-0"
            />
          </CardContent>
        </Card>
      </div>

      {selectedDate && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Horários para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}:
          </h3>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {availableSlots.map((slot) => (
              <Button
                key={slot.time}
                variant={selectedTime === slot.time ? "default" : "outline"}
                disabled={!slot.available}
                onClick={() => onTimeSelect(slot.time)}
                className={`h-10 ${
                  selectedTime === slot.time 
                    ? 'bg-pink-600 hover:bg-pink-700' 
                    : slot.available 
                      ? 'hover:bg-pink-50 hover:border-pink-300' 
                      : 'opacity-50 cursor-not-allowed'
                }`}
              >
                {slot.time}
              </Button>
            ))}
          </div>
          
          {availableSlots.filter(slot => slot.available).length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              Não há horários disponíveis para esta data
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DateTimeSelector;
