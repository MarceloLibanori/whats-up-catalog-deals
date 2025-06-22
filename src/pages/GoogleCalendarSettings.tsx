
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Key, AlertCircle, CheckCircle, Settings } from 'lucide-react';
import AdminLogin from '@/components/AdminLogin';
import { useAuth } from '@/contexts/AuthContext';

const GoogleCalendarSettings = () => {
  const { isAdmin } = useAuth();
  const [apiKey, setApiKey] = useState(localStorage.getItem('google-calendar-api-key') || '');
  const [isConfigured, setIsConfigured] = useState(!!localStorage.getItem('google-calendar-api-key'));
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  if (!isAdmin) {
    return <AdminLogin />;
  }

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
    setTestResult(null);

    try {
      // Carregar e testar a API do Google
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

      await new Promise((resolve) => {
        window.gapi.load('client', resolve);
      });

      await window.gapi.client.init({
        apiKey: apiKey.trim(),
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      });

      // Testar uma requisição simples
      await window.gapi.client.calendar.calendarList.list();
      
      localStorage.setItem('google-calendar-api-key', apiKey.trim());
      setIsConfigured(true);
      setTestResult('success');
      
      toast({
        title: "Sucesso!",
        description: "Google Calendar configurado com sucesso",
      });
    } catch (error) {
      console.error('Erro ao testar API key:', error);
      setTestResult('error');
      toast({
        title: "Erro",
        description: "Chave da API inválida ou sem permissões para Google Calendar",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const handleRemoveConfig = () => {
    localStorage.removeItem('google-calendar-api-key');
    setApiKey('');
    setIsConfigured(false);
    setTestResult(null);
    
    toast({
      title: "Configuração removida",
      description: "Google Calendar foi desconectado",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-xl">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <Link to="/manage-bookings">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Configurações Google Calendar</h1>
            </div>
          </div>
          <p className="text-pink-100 mt-2">
            Configure a integração com o Google Calendar para sincronizar agendamentos
          </p>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-6 h-6" />
                Configuração da API
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status atual */}
              <div className="p-4 rounded-lg border-2 border-dashed">
                <div className="flex items-center gap-3">
                  {isConfigured ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">Google Calendar Conectado</p>
                        <p className="text-sm text-green-600">A sincronização está ativa</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-6 h-6 text-amber-600" />
                      <div>
                        <p className="font-medium text-amber-800">Google Calendar Desconectado</p>
                        <p className="text-sm text-amber-600">Configure a API para ativar a sincronização</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Instruções */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-3">Como obter a chave da API:</h3>
                <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                  <li>Acesse <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">Google Cloud Console</a></li>
                  <li>Crie um novo projeto ou selecione um existente</li>
                  <li>Vá em "APIs & Services" → "Library"</li>
                  <li>Procure por "Google Calendar API" e ative</li>
                  <li>Vá em "APIs & Services" → "Credentials"</li>
                  <li>Clique em "Create credentials" → "API key"</li>
                  <li>Copie a chave gerada e cole abaixo</li>
                </ol>
              </div>

              {/* Configuração */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="apiKey" className="flex items-center gap-2 mb-2">
                    <Key className="w-4 h-4" />
                    Chave da API do Google Calendar
                  </Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Sua chave da API aqui..."
                    className="font-mono"
                  />
                  {apiKey.startsWith('AIza') && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ Formato da chave parece correto
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={handleSaveConfig} 
                    disabled={isLoading || !apiKey.trim()}
                    className="flex-1"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {isLoading ? 'Testando...' : 'Salvar e Testar'}
                  </Button>
                  
                  {isConfigured && (
                    <Button 
                      variant="outline" 
                      onClick={handleRemoveConfig}
                      className="flex-1"
                    >
                      Desconectar
                    </Button>
                  )}
                </div>

                {testResult && (
                  <div className={`p-3 rounded-lg ${
                    testResult === 'success' 
                      ? 'bg-green-50 border border-green-200 text-green-800' 
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}>
                    {testResult === 'success' ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Conexão estabelecida com sucesso!</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>Falha na conexão. Verifique a chave da API.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Informações adicionais */}
              {isConfigured && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Como funciona:</h4>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                    <li>Horários ocupados no Google Calendar são automaticamente bloqueados</li>
                    <li>Novos agendamentos são criados no seu calendário</li>
                    <li>A verificação acontece em tempo real durante o agendamento</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GoogleCalendarSettings;
