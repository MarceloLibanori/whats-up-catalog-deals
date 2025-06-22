
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Settings, Calendar, Key, AlertCircle } from 'lucide-react';

const GoogleCalendarConfig: React.FC = () => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('google-calendar-api-key') || '');
  const [isConfigured, setIsConfigured] = useState(!!localStorage.getItem('google-calendar-api-key'));
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveConfig = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira a chave da API do Google Calendar",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Testar a chave da API
      await window.gapi?.load('client', async () => {
        try {
          await window.gapi.client.init({
            apiKey: apiKey.trim(),
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
          });

          // Testar uma requisição simples
          await window.gapi.client.calendar.calendarList.list();
          
          localStorage.setItem('google-calendar-api-key', apiKey.trim());
          setIsConfigured(true);
          
          toast({
            title: "Configuração salva!",
            description: "Google Calendar foi configurado com sucesso",
          });
        } catch (error) {
          console.error('Erro ao testar API key:', error);
          toast({
            title: "Erro",
            description: "Chave da API inválida ou sem permissões para Google Calendar",
            variant: "destructive",
          });
        }
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao conectar com Google Calendar. Verifique sua chave da API.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
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
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">Como obter a chave da API:</p>
                  <ol className="mt-2 text-yellow-700 list-decimal list-inside space-y-1">
                    <li>Acesse o Google Cloud Console</li>
                    <li>Crie um projeto ou selecione um existente</li>
                    <li>Vá em "APIs & Services" → "Credentials"</li>
                    <li>Clique em "Create credentials" → "API key"</li>
                    <li>Ative a "Google Calendar API" no projeto</li>
                  </ol>
                </div>
              </div>
            </div>
            
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
            </div>
            <Button 
              onClick={handleSaveConfig} 
              className="w-full"
              disabled={isLoading}
            >
              <Settings className="w-4 h-4 mr-2" />
              {isLoading ? 'Testando...' : 'Configurar'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleCalendarConfig;
