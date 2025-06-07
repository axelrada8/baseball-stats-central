
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Gift } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

interface PlanSelectionProps {
  onSelectPlan: (planType: 'free' | 'premium', billingCycle: 'monthly' | 'yearly') => void;
  showTitle?: boolean;
}

export default function PlanSelection({ onSelectPlan, showTitle = true }: PlanSelectionProps) {
  const { subscription, isTrialActive, daysRemaining } = useSubscription();

  const freeFeatures = [
    "Registro de estadísticas básicas",
    "Visualización de estadísticas",
    "7 días de prueba gratuita",
    "Acceso limitado"
  ];

  const premiumFeatures = [
    "Todas las funciones del plan gratuito",
    "Exportar estadísticas en PDF",
    "Análisis avanzados y gráficos",
    "Comparación de temporadas",
    "Estadísticas de pitcheo completas",
    "Soporte prioritario",
    "Sin limitaciones"
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {showTitle && (
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Elige tu Plan</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Selecciona el plan que mejor se adapte a tus necesidades
          </p>
        </div>
      )}

      {isTrialActive && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-800 dark:text-blue-200">
              ¡Estás en tu periodo de prueba! Te quedan {daysRemaining} días gratis.
            </span>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Plan Gratuito */}
        <Card className="relative border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Gift className="w-6 h-6 text-green-600" />
              <CardTitle className="text-2xl">Plan Gratuito</CardTitle>
            </div>
            <Badge variant="secondary" className="mx-auto">
              Prueba de 7 días
            </Badge>
            <div className="mt-4">
              <span className="text-3xl font-bold">Gratis</span>
              <span className="text-gray-600 dark:text-gray-300"> por 7 días</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-6">
              {freeFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            <Button 
              onClick={() => onSelectPlan('free', 'monthly')}
              variant="outline" 
              className="w-full"
              disabled={subscription?.plan_type === 'free'}
            >
              {subscription?.plan_type === 'free' ? 'Plan Actual' : 'Seleccionar Plan Gratuito'}
            </Button>
          </CardContent>
        </Card>

        {/* Plan Premium */}
        <Card className="relative border-2 border-yellow-400 hover:shadow-lg transition-shadow">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-yellow-500 text-black px-3 py-1">
              Más Popular
            </Badge>
          </div>
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="w-6 h-6 text-yellow-600" />
              <CardTitle className="text-2xl">Plan Premium</CardTitle>
            </div>
            <div className="mt-4 space-y-2">
              <div>
                <span className="text-3xl font-bold">$3.99</span>
                <span className="text-gray-600 dark:text-gray-300">/mes</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                o <span className="font-semibold">$30/año</span> (ahorra $17.88)
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-6">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <Button 
                onClick={() => onSelectPlan('premium', 'monthly')}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                disabled={subscription?.plan_type === 'premium' && subscription?.status === 'active'}
              >
                {subscription?.plan_type === 'premium' && subscription?.status === 'active' 
                  ? 'Plan Actual' 
                  : 'Pagar Mensual - $3.99/mes'
                }
              </Button>
              <Button 
                onClick={() => onSelectPlan('premium', 'yearly')}
                variant="outline"
                className="w-full border-yellow-400 text-yellow-700 hover:bg-yellow-50"
                disabled={subscription?.plan_type === 'premium' && subscription?.status === 'active'}
              >
                Pagar Anual - $30/año
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
