
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { authService } from "@/services/authService";
import { sendWelcomeEmail } from "@/services/emailService";

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

      // Intentar registrar el usuario
      const registrationSuccess = authService.register({ name, email, password });
      
      if (!registrationSuccess) {
        toast({
          variant: "destructive",
          title: "Error en el registro",
          description: "Este email ya está registrado",
        });
        return;
      }

      // Enviar email de bienvenida
      const emailResult = await sendWelcomeEmail({ name, email });
      
      if (emailResult.success) {
        toast({
          title: "¡Registro exitoso!",
          description: `Bienvenido, ${name}. Se ha enviado un email de bienvenida a tu correo.`,
        });
      } else {
        toast({
          title: "Registro exitoso",
          description: `Bienvenido, ${name}. (No se pudo enviar el email de bienvenida)`,
        });
      }

      // Iniciar sesión automáticamente después del registro
      localStorage.setItem("user", JSON.stringify({ name, email }));
      onRegister();
      
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
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Crear una cuenta</CardTitle>
        <CardDescription className="text-center">
          Regístrate para comenzar a registrar tus estadísticas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input 
              id="name" 
              placeholder="Tu nombre" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="tu@correo.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Registrando..." : "Registrarse"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="link" onClick={onSwitchToLogin}>
          ¿Ya tienes cuenta? Inicia sesión
        </Button>
      </CardFooter>
    </Card>
  );
}
