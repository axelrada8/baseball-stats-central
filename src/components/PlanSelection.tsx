
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Gift, Star } from "lucide-react";
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
    "1 dispositivo",
    "Acceso básico"
  ];

  const premiumFeatures = [
    "Todas las funciones del plan gratuito",
    "Exportar estadísticas en PDF",
    "Análisis avanzados y gráficos",
    "Comparación de temporadas",
    "Estadísticas de pitcheo completas",
    "Dispositivos ilimitados",
    "Soporte prioritario",
    "Almacenamiento en la nube"
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {showTitle && (
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Selecciona el plan ideal para ti
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Elige el plan que mejor se adapte a tus necesidades de seguimiento de béisbol
          </p>
        </div>
      )}

      {isTrialActive && (
        <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-2 justify-center">
            <Gift className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-800 dark:text-blue-200">
              ¡Estás en tu periodo de prueba! Te quedan {daysRemaining} días gratis.
            </span>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Plan Gratuito */}
        <Card className="relative border-2 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="text-center pb-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-t-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Gift className="w-8 h-8 text-green-600" />
              <CardTitle className="text-2xl font-bold">Plan Básico</CardTitle>
            </div>
            <Badge variant="secondary" className="mx-auto bg-green-100 text-green-800">
              Prueba de 7 días
            </Badge>
            <div className="mt-4">
              <span className="text-4xl font-bold text-green-600">Gratis</span>
              <div className="text-gray-600 dark:text-gray-300">por 7 días</div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4 mb-8">
              {freeFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
            <Button 
              onClick={() => onSelectPlan('free', 'monthly')}
              variant="outline" 
              className="w-full border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 transition-colors"
              disabled={subscription?.plan_type === 'free'}
            >
              {subscription?.plan_type === 'free' ? 'Plan Actual' : 'Comenzar Prueba Gratuita'}
            </Button>
          </CardContent>
        </Card>

        {/* Plan Premium */}
        <Card className="relative border-2 border-yellow-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-red-500 text-white px-4 py-1 flex items-center gap-1">
              <Star className="w-4 h-4" />
              Más Popular
            </Badge>
          </div>
          <CardHeader className="text-center pb-4 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-t-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="w-8 h-8 text-yellow-600" />
              <CardTitle className="text-2xl font-bold">Plan Premium</CardTitle>
            </div>
            <Badge className="mx-auto bg-yellow-200 text-yellow-800">
              4K + HDR
            </Badge>
            <div className="mt-4 space-y-2">
              <div>
                <span className="text-4xl font-bold text-yellow-700">$3.99</span>
                <div className="text-gray-600 dark:text-gray-300">Precio mensual</div>
              </div>
              <div className="text-sm text-green-600 font-medium">
                o <span className="font-bold">$30/año</span> (ahorra $17.88)
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4 mb-8">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-yellow-600" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <Button 
                onClick={() => onSelectPlan('premium', 'monthly')}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold transition-all duration-300"
                disabled={subscription?.plan_type === 'premium' && subscription?.status === 'active'}
              >
                {subscription?.plan_type === 'premium' && subscription?.status === 'active' 
                  ? 'Plan Actual' 
                  : 'Elegir Plan Mensual'
                }
              </Button>
              <Button 
                onClick={() => onSelectPlan('premium', 'yearly')}
                variant="outline"
                className="w-full border-yellow-400 text-yellow-700 hover:bg-yellow-50 hover:border-yellow-500 transition-colors"
                disabled={subscription?.plan_type === 'premium' && subscription?.status === 'active'}
              >
                Elegir Plan Anual (Mejor Precio)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mt-8 text-sm text-gray-500">
        <p>Puedes cancelar en cualquier momento. Sin compromisos.</p>
      </div>
    </div>
  );
}
