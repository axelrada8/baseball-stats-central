
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">Cargando...</div>
    </div>;
  }
  
  return user ? <>{children}</> : <Navigate to="/" />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">Cargando...</div>
    </div>;
  }
  
  return user ? <Navigate to="/dashboard" /> : <>{children}</>;
};

// Default translations
const translations = {
  es: {
    title: "Panel de Control",
    subtitle: "Gestiona tus estadísticas de béisbol",
    profile: "Perfil del Jugador",
    statistics: "Estadísticas",
    settings: "Configuración",
    appearance: "Apariencia",
    darkMode: "Modo oscuro",
    generatePdf: "Generar PDF",
    selectDate: "Seleccionar fecha",
    noDateSelected: "Ninguna fecha seleccionada",
    playerInfo: "Información del Jugador",
    name: "Nombre",
    position: "Posición",
    team: "Equipo",
    photo: "Foto",
    photoRecommendation: "Recomendación de foto",
    adjustPhoto: "Ajustar foto",
    zoom: "Zoom",
    apply: "Aplicar",
    cancel: "Cancelar",
    movePhoto: "Mover foto",
    selectPosition: "Seleccionar posición",
    searchPosition: "Buscar posición",
    noPositionFound: "No se encontró ninguna posición"
  },
  en: {
    title: "Dashboard",
    subtitle: "Manage your baseball statistics",
    profile: "Player Profile",
    statistics: "Statistics",
    settings: "Settings",
    appearance: "Appearance",
    darkMode: "Dark mode",
    generatePdf: "Generate PDF",
    selectDate: "Select date",
    noDateSelected: "No date selected",
    playerInfo: "Player Information",
    name: "Name",
    position: "Position",
    team: "Team",
    photo: "Photo",
    photoRecommendation: "Photo recommendation",
    adjustPhoto: "Adjust photo",
    zoom: "Zoom",
    apply: "Apply",
    cancel: "Cancel",
    movePhoto: "Move photo",
    selectPosition: "Select position",
    searchPosition: "Search position",
    noPositionFound: "No position found"
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route 
                path="/" 
                element={
                  <PublicRoute>
                    <Index />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard language="es" translations={translations} />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
