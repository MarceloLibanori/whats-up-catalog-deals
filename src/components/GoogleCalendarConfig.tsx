
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Settings, Calendar, Key } from 'lucide-react';

const GoogleCalendarConfig: React.FC = () => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('google-calendar-api-key') || '');
  const [isConfigured, setIsConfigured] = useState(!!localStorage.getItem('google-calendar-api-key'));

  const handleSaveConfig = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira a chave da API do Google Calendar",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('google-calendar-api-key', apiKey.trim());
    setIsConfigured(true);
    
    toast({
      title: "Configuração salva!",
      description: "Google Calendar foi configurado com sucesso",
    });
  };

  const handleRemoveConfig = () => {
    localStorage.removeItem('google-calendar-api-key');
    setApiKey('');
    setIsConfigured(false);
    
    toast({
      title: "Configuração removida",
      description: "Google Calendar foi desconectado",
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Google Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConfigured ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Google Calendar conectado</span>
            </div>
            <p className="text-sm text-gray-600">
              Os horários do Google Calendar serão verificados automaticamente para evitar conflitos.
            </p>
            <Button 
              variant="outline" 
              onClick={handleRemoveConfig}
              className="w-full"
            >
              Desconectar
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="apiKey" className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                Chave da API do Google Calendar
              </Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Cole sua API key aqui..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Obtenha sua chave em: Google Cloud Console → APIs & Services → Credentials
              </p>
            </div>
            <Button onClick={handleSaveConfig} className="w-full">
              <Settings className="w-4 h-4 mr-2" />
              Configurar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleCalendarConfig;
