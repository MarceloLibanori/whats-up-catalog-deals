
import { useState } from "react";
import BookingForm from "@/components/BookingForm";
import GoogleCalendarConfig from "@/components/GoogleCalendarConfig";
import { Button } from "@/components/ui/button";
import { Settings, Calendar } from "lucide-react";

const Index = () => {
  const [showConfig, setShowConfig] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pink-700 mb-2">Salão Bella</h1>
          <p className="text-gray-600">Agende seu horário de beleza</p>
        </div>

        <div className="flex justify-center mb-6">
          <Button 
            variant="outline" 
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            {showConfig ? 'Ocultar' : 'Configurar'} Google Calendar
          </Button>
        </div>

        {showConfig && (
          <div className="flex justify-center mb-8">
            <GoogleCalendarConfig />
          </div>
        )}

        <BookingForm />
      </div>
    </div>
  );
};

export default Index;
