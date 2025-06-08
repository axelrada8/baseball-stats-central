
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (password !== confirmPassword) {
        toast({
          variant: "destructive",
          title: "Error en el registro",
          description: "Las contraseñas no coinciden",
        });
        return;
      }
      
      if (!name || !email || !password) {
        toast({
          variant: "destructive",
          title: "Error en el registro",
          description: "Por favor, complete todos los campos",
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

      const { error } = await signUp(email, password, name);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error en el registro",
          description: error.message.includes("already registered") 
            ? "Este email ya está registrado" 
            : "Error al crear la cuenta",
        });
        return;
      }

      toast({
        title: "¡Registro exitoso!",
        description: `Bienvenido, ${name}. Ahora elige tu plan.`,
      });

      // Redirigir directamente a la selección de planes después del registro exitoso
      navigate('/plans');
      
    } catch (error) {
      console.error('Error en el registro:', error);
      toast({
        variant: "destructive",
        title: "Error en el registro",
        description: "Ocurrió un error inesperado. Inténtalo de nuevo.",
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
          Regístrate para comenzar tu prueba gratuita de 7 días
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Nombre completo</Label>
            <Input 
              id="name" 
              placeholder="Tu nombre" 
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
              placeholder="tu@correo.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            {isLoading ? "Registrando..." : "Comenzar Prueba Gratuita"}
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
