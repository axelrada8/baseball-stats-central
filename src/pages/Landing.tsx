
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Instagram, Mail, Star, Crown, Gift, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Login from "@/components/Login";
import Register from "@/components/Register";

const Landing = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedPlan, setSelectedPlan] = useState<{
    type: 'free' | 'premium';
    billing?: 'monthly' | 'yearly';
    price: number;
  } | null>(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard");
  };

  const handleRegister = () => {
    // El componente Register ya maneja la navegación
  };

  const handlePlanSelection = (planType: 'free' | 'premium', billing?: 'monthly' | 'yearly') => {
    const planData = {
      type: planType,
      billing,
      price: planType === 'free' ? 0 : billing === 'yearly' ? 29.99 : 2.99
    };
    
    setSelectedPlan(planData);
    setShowAuth(true);
    setAuthMode('register');
    
    // Guardar el plan seleccionado en localStorage para usarlo después del registro
    localStorage.setItem('selectedPlan', JSON.stringify(planData));
  };

  const handleBackToPlans = () => {
    setSelectedPlan(null);
    setShowAuth(false);
    localStorage.removeItem('selectedPlan');
  };

  const handleSwitchAuth = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
  };

  if (showAuth) {
    return (
      <div className="min-h-screen flex flex-col baseball-stadium-bg">
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md mb-8 text-center">
            <Button
              onClick={handleBackToPlans}
              variant="ghost"
              className="mb-4 text-white hover:text-white/80"
            >
              ← Volver a selección de planes
            </Button>
            
            {selectedPlan && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 text-white">
                <h3 className="font-semibold mb-2">Plan seleccionado:</h3>
                <div className="flex items-center justify-center gap-2">
                  {selectedPlan.type === 'free' ? (
                    <Gift className="w-5 h-5" />
                  ) : (
                    <Crown className="w-5 h-5" />
                  )}
                  <span>
                    {selectedPlan.type === 'free' 
                      ? 'Plan Gratuito (7 días)' 
                      : `Plan Premium ${selectedPlan.billing === 'yearly' ? '(Anual)' : '(Mensual)'}`
                    }
                  </span>
                  <span className="font-bold">
                    ${selectedPlan.price === 0 ? 'Gratis' : selectedPlan.price}
                  </span>
                </div>
              </div>
            )}
          </div>

          {authMode === 'login' ? (
            <Login 
              onLogin={handleLogin} 
              onSwitchToRegister={handleSwitchAuth}
            />
          ) : (
            <Register 
              onRegister={handleRegister} 
              onSwitchToLogin={handleSwitchAuth}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col baseball-stadium-bg">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-md">
            ⚾ Baseball Stats Tracker
          </h1>
          <p className="text-white/90 text-2xl mb-8">
            La herramienta definitiva para registrar y analizar tus estadísticas de béisbol
          </p>
          
          {/* Social Media Icons */}
          <div className="flex justify-center gap-4 mb-8">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110"
            >
              <Instagram className="w-6 h-6 text-white" />
            </a>
            <a 
              href="mailto:contact@baseballstats.com"
              className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110"
            >
              <Mail className="w-6 h-6 text-white" />
            </a>
          </div>

          <div className="flex gap-4 justify-center mb-12">
            <Button
              onClick={() => {setShowAuth(true); setAuthMode('login');}}
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
            >
              Iniciar Sesión
            </Button>
            <Button
              onClick={() => {setShowAuth(true); setAuthMode('register');}}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Comenzar Ahora
            </Button>
          </div>
        </div>

        {/* Plan Selection */}
        <div className="w-full max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">
              Elige tu plan
            </h2>
            <p className="text-white/80 text-xl">
              Selecciona el plan que mejor se adapte a tus necesidades
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plan Gratuito */}
            <Card className="relative border-2 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/95">
              <CardHeader className="text-center pb-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-t-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Gift className="w-8 h-8 text-green-600" />
                  <CardTitle className="text-2xl font-bold">Plan Gratuito</CardTitle>
                </div>
                <Badge variant="secondary" className="mx-auto bg-green-100 text-green-800">
                  Prueba de 7 días
                </Badge>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-green-600">Gratis</span>
                  <div className="text-gray-600">por 7 días</div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4 mb-8">
                  {[
                    "Registro de estadísticas básicas",
                    "Visualización de estadísticas",
                    "Acceso por 7 días",
                    "1 dispositivo"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={() => handlePlanSelection('free')}
                  variant="outline" 
                  className="w-full border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400"
                >
                  Comenzar Prueba Gratuita
                </Button>
              </CardContent>
            </Card>

            {/* Plan Premium */}
            <Card className="relative border-2 border-yellow-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-yellow-50 to-orange-50">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-red-500 text-white px-4 py-1 flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  Más Popular
                </Badge>
              </div>
              <CardHeader className="text-center pb-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-t-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Crown className="w-8 h-8 text-yellow-600" />
                  <CardTitle className="text-2xl font-bold">Plan Premium</CardTitle>
                </div>
                <Badge className="mx-auto bg-yellow-200 text-yellow-800">
                  Acceso Completo
                </Badge>
                <div className="mt-4 space-y-2">
                  <div>
                    <span className="text-4xl font-bold text-yellow-700">$2.99</span>
                    <div className="text-gray-600">por mes</div>
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    o <span className="font-bold">$29.99/año</span> (ahorra $5.89)
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4 mb-8">
                  {[
                    "Todas las funciones del plan gratuito",
                    "Acceso ilimitado",
                    "Exportar estadísticas en PDF",
                    "Análisis avanzados y gráficos",
                    "Estadísticas de pitcheo completas",
                    "Dispositivos ilimitados",
                    "Soporte prioritario"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-yellow-600" />
                      </div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <Button 
                    onClick={() => handlePlanSelection('premium', 'monthly')}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold"
                  >
                    Elegir Plan Mensual - $2.99
                  </Button>
                  <Button 
                    onClick={() => handlePlanSelection('premium', 'yearly')}
                    variant="outline"
                    className="w-full border-yellow-400 text-yellow-700 hover:bg-yellow-50 hover:border-yellow-500"
                  >
                    Elegir Plan Anual - $29.99
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8 text-sm text-white/70">
            <p>Puedes cancelar en cualquier momento. Sin compromisos.</p>
          </div>
        </div>
      </div>
      
      <footer className="bg-black/80 text-white p-4 text-center">
        <p>© {new Date().getFullYear()} Baseball Stats App</p>
      </footer>
    </div>
  );
};

export default Landing;
