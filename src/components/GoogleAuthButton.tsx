
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { googleCalendarService } from '@/services/googleCalendar';
import { Calendar, LogIn, LogOut } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const GoogleAuthButton: React.FC = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await googleCalendarService.initializeAuth();
        setIsSignedIn(googleCalendarService.isSignedIn());
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
      }
    };

    initAuth();
  }, []);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await googleCalendarService.signIn();
      setIsSignedIn(true);
      toast({
        title: "Conectado ao Google Calendar!",
        description: "Agora os agendamentos serão sincronizados automaticamente.",
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast({
        title: "Erro ao conectar",
        description: "Não foi possível conectar ao Google Calendar. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await googleCalendarService.signOut();
      setIsSignedIn(false);
      toast({
        title: "Desconectado",
        description: "Você foi desconectado do Google Calendar.",
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (isSignedIn) {
    return (
      <Button
        variant="outline"
        onClick={handleSignOut}
        className="flex items-center gap-2"
      >
        <Calendar className="w-4 h-4" />
        <LogOut className="w-4 h-4" />
        Desconectar Google
      </Button>
    );
  }

  return (
    <Button
      onClick={handleSignIn}
      disabled={isLoading}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
    >
      <Calendar className="w-4 h-4" />
      <LogIn className="w-4 h-4" />
      {isLoading ? 'Conectando...' : 'Conectar Google Calendar'}
    </Button>
  );
};

export default GoogleAuthButton;
