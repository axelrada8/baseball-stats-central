
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlanSelection from '@/components/PlanSelection';
import PayPalCheckout from '@/components/PayPalCheckout';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function Plans() {
  const [selectedPlan, setSelectedPlan] = useState<{
    type: 'premium';
    billing: 'monthly' | 'yearly';
  } | null>(null);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { refetch } = useSubscription();

  console.log('Plans page - User:', user, 'Auth loading:', authLoading);

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Redirigir si no está autenticado
  if (!user) {
    console.log('No user found, redirecting to home');
    navigate('/');
    return null;
  }

  const handleSelectPlan = (planType: 'free' | 'premium', billingCycle: 'monthly' | 'yearly') => {
    console.log('Plan selected:', planType, billingCycle);
    
    if (planType === 'free') {
      // Para plan gratuito, simplemente redirigir al dashboard
      navigate('/dashboard');
      return;
    }

    // Solo para plan premium
    setSelectedPlan({
      type: planType,
      billing: billingCycle
    });
  };

  const handlePaymentSuccess = () => {
    refetch();
    navigate('/dashboard');
  };

  const handleBack = () => {
    setSelectedPlan(null);
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header con botón de regreso */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Button
            onClick={handleBackToLogin}
            variant="ghost"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Button>
        </div>
      </div>

      {!selectedPlan ? (
        <div className="py-8">
          <PlanSelection onSelectPlan={handleSelectPlan} />
        </div>
      ) : (
        <div className="py-8">
          <PayPalCheckout
            planType={selectedPlan.type}
            billingCycle={selectedPlan.billing}
            onBack={handleBack}
            onSuccess={handlePaymentSuccess}
          />
        </div>
      )}
    </div>
  );
}
