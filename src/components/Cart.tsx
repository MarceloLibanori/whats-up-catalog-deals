
import { CartItem, CartSummary } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Minus, Plus, Trash2, Send } from 'lucide-react';

interface CartProps {
  items: CartItem[];
  summary: CartSummary;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onSendWhatsApp: () => void;
  onClearCart: () => void;
}

const Cart = ({ items, summary, onUpdateQuantity, onRemoveItem, onSendWhatsApp, onClearCart }: CartProps) => {
  if (items.length === 0) {
    return (
      <Card className="sticky top-4 bg-gradient-to-br from-gray-50 to-white border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 text-lg">Seu carrinho está vazio</p>
          <p className="text-gray-400 text-sm mt-2">Adicione produtos para começar!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-4 bg-gradient-to-br from-white to-gray-50 border-0 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Carrinho ({summary.itemCount} {summary.itemCount === 1 ? 'item' : 'itens'})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 max-h-96 overflow-y-auto">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-12 h-12 object-cover rounded-md"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-gray-800 truncate">
                  {item.product.name}
                </h4>
                <p className="text-xs text-gray-600">R$ {item.product.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                  className="w-8 h-8 p-0"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                  className="w-8 h-8 p-0"
                >
                  <Plus className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onRemoveItem(item.product.id)}
                  className="w-8 h-8 p-0 ml-2"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>R$ {summary.subtotal.toFixed(2)}</span>
          </div>
          
          {summary.discount > 0 && (
            <>
              <div className="flex justify-between text-sm text-green-600">
                <span>Desconto ({summary.itemCount >= 5 ? '10%' : '5%'}):</span>
                <span>-R$ {summary.discount.toFixed(2)}</span>
              </div>
              {summary.itemCount >= 3 && summary.itemCount < 5 && (
                <Badge variant="secondary" className="w-full justify-center bg-green-100 text-green-800">
                  🎉 Mais 2 itens = 10% de desconto!
                </Badge>
              )}
            </>
          )}
          
          {summary.itemCount < 3 && (
            <Badge variant="secondary" className="w-full justify-center bg-blue-100 text-blue-800">
              Adicione {3 - summary.itemCount} itens para 5% OFF!
            </Badge>
          )}
          
          <Separator />
          
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span className="text-green-600">R$ {summary.total.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="space-y-2 mt-4">
          <Button
            onClick={onSendWhatsApp}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <Send className="w-4 h-4 mr-2" />
            Enviar pelo WhatsApp
          </Button>
          <Button
            onClick={onClearCart}
            variant="outline"
            className="w-full"
          >
            Limpar Carrinho
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Cart;
