
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import BookingManager from '@/components/BookingManager';
import AdminLogin from '@/components/AdminLogin';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Settings, Scissors, Sparkles, LogOut, Calendar } from 'lucide-react';

const ManageBookings = () => {
  const { isAdmin, logout } = useAuth();

  if (!isAdmin) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-xl">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Settings className="w-8 h-8" />
                <h1 className="text-3xl font-bold">Gerenciar Agendamentos</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/google-calendar-settings">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Calendar className="w-4 h-4 mr-2" />
                  Google Calendar
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Scissors className="w-6 h-6" />
                <span className="text-lg font-semibold">Salão Bella</span>
                <Sparkles className="w-6 h-6" />
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="text-white hover:bg-white/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
          <p className="text-pink-100 mt-2">
            Visualize, confirme e gerencie todos os agendamentos
          </p>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-white border-0 shadow-xl">
            <CardContent className="p-8">
              <BookingManager />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Scissors className="w-6 h-6" />
            <span className="text-xl font-bold">Salão Bella</span>
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="text-gray-400">
            Sua beleza é nossa paixão • Agendamento online via WhatsApp
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ManageBookings;
