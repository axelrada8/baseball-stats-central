
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface RegisterProps {
  onRegister: () => void;
  onSwitchToLogin: () => void;
}

export default function Register({ onRegister, onSwitchToLogin }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validaciones del lado del cliente
      if (!name.trim() || !email.trim() || !password) {
        toast({
          variant: "destructive",
          title: "Error en el registro",
          description: "Por favor, complete todos los campos",
        });
        return;
      }

      if (!validateEmail(email)) {
        toast({
          variant: "destructive",
          title: "Error en el registro",
          description: "Por favor, ingrese un email válido (ejemplo: usuario@correo.com)",
        });
        return;
      }
      
      if (password !== confirmPassword) {
        toast({
          variant: "destructive",
          title: "Error en el registro",
          description: "Las contraseñas no coinciden",
        });
        return;
      }

      if (password.length < 6) {
        toast({
          variant: "destructive",
          title: "Error en el registro",
          description: "La contraseña debe tener al menos 6 caracteres",
        });
        return;
      }

      console.log('Attempting to register with:', { email, name });
      const { error } = await signUp(email, password, name);
      
      if (error) {
        console.error('Registration error:', error);
        
        let errorMessage = "Error al crear la cuenta";
        
        if (error.message.includes("already registered") || error.message.includes("User already registered")) {
          errorMessage = "Este email ya está registrado. Intenta iniciar sesión.";
        } else if (error.message.includes("invalid") && error.message.includes("email")) {
          errorMessage = "El formato del email no es válido. Usa un email real (ejemplo: tu@correo.com)";
        } else if (error.message.includes("Password")) {
          errorMessage = "La contraseña no cumple con los requisitos";
        } else if (error.message.includes("rate limit")) {
          errorMessage = "Demasiados intentos. Espera un momento antes de intentar de nuevo.";
        } else {
          errorMessage = `Error: ${error.message}`;
        }
        
        toast({
          variant: "destructive",
          title: "Error en el registro",
          description: errorMessage,
        });
        return;
      }

      console.log('Registration successful');
      
      // Obtener el plan seleccionado del localStorage
      const selectedPlanData = localStorage.getItem('selectedPlan');
      if (selectedPlanData) {
        const planData = JSON.parse(selectedPlanData);
        console.log('Plan data found:', planData);
        
        // Si es plan premium, redirigir a PayPal
        if (planData.type === 'premium') {
          toast({
            title: "¡Registro exitoso!",
            description: `Bienvenido, ${name}. Ahora procede con el pago de tu plan premium.`,
          });
          
          // Actualizar la suscripción en la base de datos para reflejar el plan seleccionado
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase
              .from('subscriptions')
              .update({
                plan_type: 'premium',
                amount: planData.price,
                currency: 'USD'
              })
              .eq('user_id', user.id);
          }
          
          // Redirigir a PayPal checkout con los datos del plan
          navigate('/payment', { 
            state: { 
              planType: planData.type,
              billingCycle: planData.billing,
              amount: planData.price
            }
          });
        } else {
          // Plan gratuito - redirigir directamente al dashboard
          toast({
            title: "¡Registro exitoso!",
            description: `Bienvenido, ${name}. Tu prueba gratuita de 7 días ha comenzado.`,
          });
          navigate('/dashboard');
        }
        
        localStorage.removeItem('selectedPlan');
      } else {
        // Sin plan seleccionado, redirigir al dashboard
        toast({
          title: "¡Registro exitoso!",
          description: `Bienvenido, ${name}.`,
        });
        navigate('/dashboard');
      }
      
    } catch (error) {
      console.error('Unexpected error during registration:', error);
      toast({
        variant: "destructive",
        title: "Error en el registro",
        description: "Ocurrió un error inesperado. Verifica tu conexión e inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">Crear una cuenta</CardTitle>
        <CardDescription className="text-center text-gray-600 dark:text-gray-300">
          Regístrate para comenzar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Nombre completo</Label>
            <Input 
              id="name" 
              placeholder="Tu nombre completo" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Correo Electrónico</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="ejemplo@correo.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
              required
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Contraseña</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">Confirmar Contraseña</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              placeholder="Confirma tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
          </div>
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
            {isLoading ? "Registrando..." : "Crear Cuenta"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="link" onClick={onSwitchToLogin} className="text-green-600 hover:text-green-700">
          ¿Ya tienes cuenta? Inicia sesión
        </Button>
      </CardFooter>
    </Card>
  );
}
