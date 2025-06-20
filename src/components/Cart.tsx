
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, MessageCircle } from 'lucide-react';

const Cart = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold">Carrinho</h2>
          </div>
        </div>

        {/* Conteúdo do carrinho */}
        <div className="p-4">
          <div className="text-center py-8">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Cart component - Em desenvolvimento</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
