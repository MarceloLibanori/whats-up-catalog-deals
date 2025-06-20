
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Employee, Service } from '@/types/booking';
import { getEmployeesBySpecialty } from '@/data/employees';
import { User, Clock, Calendar } from 'lucide-react';

interface EmployeeSelectorProps {
  selectedService: Service;
  selectedEmployeeId: string;
  onEmployeeSelect: (employeeId: string) => void;
}

const categoryNames = {
  cabelo: 'Cabelo',
  unha: 'Unhas',
  depilacao: 'Depilação',
  cilios: 'Cílios'
};

const EmployeeSelector: React.FC<EmployeeSelectorProps> = ({
  selectedService,
  selectedEmployeeId,
  onEmployeeSelect
}) => {
  const availableEmployees = getEmployeesBySpecialty(selectedService.category);

  const formatWorkingDays = (workingDays: number[]) => {
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return workingDays.map(day => dayNames[day]).join(', ');
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Escolha o profissional para {selectedService.name}
        </h3>
        <Badge className="bg-pink-100 text-pink-800">
          {categoryNames[selectedService.category]}
        </Badge>
      </div>
      
      <div className="grid gap-4">
        {availableEmployees.map((employee) => (
          <Card
            key={employee.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedEmployeeId === employee.id 
                ? 'ring-2 ring-pink-500 bg-pink-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onEmployeeSelect(employee.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-full">
                  <User className="w-6 h-6 text-pink-600" />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-2">{employee.name}</h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {employee.workingHours.start} às {employee.workingHours.end}
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatWorkingDays(employee.workingDays)}
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {employee.specialties.map((specialty) => (
                        <Badge 
                          key={specialty} 
                          variant="outline" 
                          className="text-xs"
                        >
                          {categoryNames[specialty]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {availableEmployees.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          Nenhum profissional disponível para este serviço
        </p>
      )}
    </div>
  );
};

export default EmployeeSelector;
