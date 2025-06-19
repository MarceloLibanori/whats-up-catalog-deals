
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookingForm from '@/components/BookingForm';
import BookingManager from '@/components/BookingManager';
import { Scissors, Sparkles, Heart, Clock, Phone, MapPin, Calendar, Settings } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-xl">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Scissors className="w-12 h-12" />
              <h1 className="text-5xl font-bold">Salão Bella</h1>
              <Sparkles className="w-12 h-12" />
            </div>
            <p className="text-xl text-pink-100 mb-6">
              Realce sua beleza com nossos serviços especializados
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4" />
                <span>Cabelo</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Unhas</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>Depilação</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Cílios</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="booking" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="booking" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Novo Agendamento
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Gerenciar Agendamentos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="booking">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Informações do salão */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="bg-gradient-to-br from-white to-pink-50 border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-pink-700 mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Horário de Funcionamento
                    </h3>
                    <div className="space-y-2 text-gray-600">
                      <p><strong>Segunda a Sexta:</strong> 9h às 18h</p>
                      <p><strong>Sábado:</strong> 9h às 17h</p>
                      <p><strong>Domingo:</strong> Fechado</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                      <Phone className="w-5 h-5" />
                      Contato
                    </h3>
                    <div className="space-y-2 text-gray-600">
                      <p><strong>WhatsApp:</strong> (11) 94753-7240</p>
                      <p><strong>Instagram:</strong> @salaobella</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Localização
                    </h3>
                    <div className="space-y-2 text-gray-600">
                      <p>Rua das Flores, 123</p>
                      <p>Centro - São Paulo, SP</p>
                      <p>CEP: 01234-567</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-white to-green-50 border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-green-700 mb-4">
                      Como funciona?
                    </h3>
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-start gap-3">
                        <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</div>
                        <p>Escolha o serviço desejado</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</div>
                        <p>Selecione data e horário</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</div>
                        <p>Preencha seus dados</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</div>
                        <p>Confirme via WhatsApp</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Formulário de agendamento */}
              <div className="lg:col-span-2">
                <Card className="bg-white border-0 shadow-xl">
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Agende seu horário
                      </h2>
                      <p className="text-gray-600">
                        Escolha o serviço, data e horário que melhor se adequa à sua agenda
                      </p>
                    </div>
                    
                    <BookingForm />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="manage">
            <div className="max-w-6xl mx-auto">
              <Card className="bg-white border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                      Gerenciar Agendamentos
                    </h2>
                    <p className="text-gray-600">
                      Visualize, confirme e gerencie todos os agendamentos
                    </p>
                  </div>
                  
                  <BookingManager />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
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

export default Index;
