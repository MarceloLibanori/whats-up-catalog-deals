
import BookingForm from "@/components/BookingForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pink-700 mb-2">Salão Bella</h1>
          <p className="text-gray-600">Agende seu horário de beleza</p>
        </div>

        <BookingForm />
      </div>
    </div>
  );
};

export default Index;
