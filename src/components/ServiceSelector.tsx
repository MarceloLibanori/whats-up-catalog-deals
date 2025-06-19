
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Service } from '@/types/booking';
import { services } from '@/data/services';
import { Clock, DollarSign } from 'lucide-react';

interface ServiceSelectorProps {
  selectedServiceId: string;
  onServiceSelect: (serviceId: string) => void;
}

const categoryNames = {
  cabelo: 'Cabelo',
  unha: 'Unhas',
  depilacao: 'Depilação',
  cilios: 'Cílios'
};

const categoryColors = {
  cabelo: 'bg-pink-100 text-pink-800',
  unha: 'bg-purple-100 text-purple-800',
  depilacao: 'bg-blue-100 text-blue-800',
  cilios: 'bg-green-100 text-green-800'
};

const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  selectedServiceId,
  onServiceSelect
}) => {
  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<Service['category'], Service[]>);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Escolha o serviço:</h3>
      
      {Object.entries(groupedServices).map(([category, categoryServices]) => (
        <div key={category}>
          <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Badge className={categoryColors[category as Service['category']]}>
              {categoryNames[category as Service['category']]}
            </Badge>
          </h4>
          
          <div className="grid gap-3">
            {categoryServices.map((service) => (
              <Card
                key={service.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedServiceId === service.id 
                    ? 'ring-2 ring-pink-500 bg-pink-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onServiceSelect(service.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{service.name}</h5>
                      <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                      
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          {service.duration} min
                        </div>
                        <div className="flex items-center gap-1 text-sm font-medium text-pink-600">
                          <DollarSign className="w-4 h-4" />
                          R$ {service.price.toFixed(2).replace('.', ',')}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceSelector;
