
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlanSelection from '@/components/PlanSelection';
import PayPalCheckout from '@/components/PayPalCheckout';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';

export default function Plans() {
  const [selectedPlan, setSelectedPlan] = useState<{
    type: 'free' | 'premium';
    billing: 'monthly' | 'yearly';
  } | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refetch } = useSubscription();

  // Redirigir si no está autenticado
  if (!user) {
    navigate('/');
    return null;
  }

  const handleSelectPlan = (planType: 'free' | 'premium', billingCycle: 'monthly' | 'yearly') => {
    if (planType === 'free') {
      // Para plan gratuito, simplemente redirigir al dashboard
      navigate('/dashboard');
      return;
    }

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {!selectedPlan ? (
        <PlanSelection onSelectPlan={handleSelectPlan} />
      ) : (
        <PayPalCheckout
          planType={selectedPlan.type}
          billingCycle={selectedPlan.billing}
          onBack={handleBack}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
