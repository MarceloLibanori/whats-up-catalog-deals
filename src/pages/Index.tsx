
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/ProductCard';
import Cart from '@/components/Cart';
import { useCart } from '@/hooks/useCart';
import { products } from '@/data/products';
import { Search, Filter, ShoppingBag, Star, Gift } from 'lucide-react';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartSummary,
    generateWhatsAppMessage
  } = useCart();

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSendWhatsApp = () => {
    const message = generateWhatsAppMessage();
    const whatsappNumber = "5511999999999"; // Substitua pelo seu número
    const url = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(url, '_blank');
  };

  const summary = getCartSummary();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <ShoppingBag className="w-10 h-10" />
              <h1 className="text-4xl font-bold">TechStore</h1>
            </div>
            <p className="text-xl text-blue-100">Catálogo Premium de Produtos</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <Badge className="bg-white/20 text-white border-white/30">
                <Gift className="w-4 h-4 mr-1" />
                5% OFF em 3+ itens
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30">
                <Star className="w-4 h-4 mr-1" />
                10% OFF em 5+ itens
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar com filtros */}
          <div className="lg:col-span-1">
            <Card className="mb-6 bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-0 bg-white shadow-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Filter className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-700">Categorias</span>
                  </div>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "ghost"}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full justify-start ${
                        selectedCategory === category 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {category === 'all' ? 'Todos os Produtos' : category}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Carrinho */}
            <Cart
              items={cartItems}
              summary={summary}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              onSendWhatsApp={handleSendWhatsApp}
              onClearCart={clearCart}
            />
          </div>

          {/* Lista de produtos */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {selectedCategory === 'all' ? 'Todos os Produtos' : selectedCategory}
              </h2>
              <p className="text-gray-600">
                {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <Card className="p-12 text-center bg-gradient-to-br from-gray-50 to-white border-0 shadow-lg">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-500">
                  Tente ajustar sua busca ou filtros
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ShoppingBag className="w-6 h-6" />
            <span className="text-xl font-bold">TechStore</span>
          </div>
          <p className="text-gray-400">
            Seu catálogo digital completo • Descontos progressivos • Envio direto via WhatsApp
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
