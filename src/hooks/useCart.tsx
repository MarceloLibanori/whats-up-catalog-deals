
import { useState, useCallback } from 'react';
import { Product, CartItem, CartSummary } from '@/types';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getCartSummary = useCallback((): CartSummary => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    let discount = 0;
    if (itemCount >= 5) {
      discount = subtotal * 0.10; // 10% de desconto para 5+ itens
    } else if (itemCount >= 3) {
      discount = subtotal * 0.05; // 5% de desconto para 3+ itens
    }
    
    const total = subtotal - discount;
    
    return { subtotal, discount, total, itemCount };
  }, [cartItems]);

  const generateWhatsAppMessage = useCallback(() => {
    const summary = getCartSummary();
    let message = "🛒 *Meu Pedido:*\n\n";
    
    cartItems.forEach(item => {
      message += `• ${item.product.name}\n`;
      message += `  Qtd: ${item.quantity}x - R$ ${(item.product.price * item.quantity).toFixed(2)}\n\n`;
    });
    
    message += `💰 *Resumo:*\n`;
    message += `Subtotal: R$ ${summary.subtotal.toFixed(2)}\n`;
    
    if (summary.discount > 0) {
      const discountPercent = summary.itemCount >= 5 ? '10%' : '5%';
      message += `Desconto (${discountPercent}): -R$ ${summary.discount.toFixed(2)}\n`;
    }
    
    message += `*Total: R$ ${summary.total.toFixed(2)}*\n\n`;
    message += "Gostaria de finalizar este pedido! 😊";
    
    return encodeURIComponent(message);
  }, [cartItems, getCartSummary]);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartSummary,
    generateWhatsAppMessage
  };
};
