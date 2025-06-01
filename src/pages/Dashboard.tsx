
import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CircleDollarSign, User2, ListChecks, BarChart4, Settings } from "lucide-react";
import PlayerCard from "@/components/PlayerCard";
import { useTheme } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface DashboardProps {
  language: "en" | "es";
  translations: {
    es: {
      title: string;
      subtitle: string;
      profile: string;
      statistics: string;
      settings: string;
      appearance: string;
      darkMode: string;
      generatePdf: string;
      selectDate: string;
      noDateSelected: string;
      playerInfo: string;
      name: string;
      position: string;
      team: string;
      photo: string;
      photoRecommendation: string;
      adjustPhoto: string;
      zoom: string;
      apply: string;
      cancel: string;
      movePhoto: string;
      selectPosition: string;
      searchPosition: string;
      noPositionFound: string;
    };
    en: {
      title: string;
      subtitle: string;
      profile: string;
      statistics: string;
      settings: string;
      appearance: string;
      darkMode: string;
      generatePdf: string;
      selectDate: string;
      noDateSelected: string;
      playerInfo: string;
      name: string;
      position: string;
      team: string;
      photo: string;
      photoRecommendation: string;
      adjustPhoto: string;
      zoom: string;
      apply: string;
      cancel: string;
      movePhoto: string;
      selectPosition: string;
      searchPosition: string;
      noPositionFound: string;
    };
  };
}

const Dashboard = ({ language, translations }: DashboardProps) => {
  const t = translations[language];
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(theme === "dark");
  const { toast } = useToast();

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    setTheme(newTheme);
    setIsDark(checked);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleGeneratePDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      let yPosition = 20;
      
      // Título principal
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      const title = "Estadísticas de Béisbol";
      const titleWidth = doc.getTextWidth(title);
      const titleX = (pageWidth - titleWidth) / 2;
      doc.text(title, titleX, yPosition);
      yPosition += 15;
      
      // Línea separadora
      doc.setLineWidth(0.5);
      doc.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 15;

      // Información del usuario
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Usuario: ${user?.email}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Fecha: ${date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : 'No seleccionada'}`, 20, yPosition);
      yPosition += 15;

      // Tabla de estadísticas (ejemplo)
      const tableData = [
        ["Partido", "Hits", "Carreras", "RBI"],
        ["Partido 1", "2", "1", "2"],
        ["Partido 2", "1", "0", "1"],
        ["Partido 3", "3", "2", "3"],
      ];

      autoTable(doc, {
        head: [tableData[0]],
        body: tableData.slice(1),
        startY: yPosition,
        margin: { horizontal: 20 },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 15;

      // Gráfico de rendimiento (simulado)
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text("Gráfico de Rendimiento", 20, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text("Este es un gráfico de ejemplo. Aquí irían los datos reales.", 20, yPosition);

      // Guardar el PDF
      doc.save("estadisticas_beisbol.pdf");
      toast({
        title: "PDF generado",
        description: "El archivo PDF se ha descargado correctamente",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo generar el archivo PDF",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-gray-900 dark:text-gray-100 flex flex-col">
      <header className="bg-white dark:bg-gray-900 shadow-md p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">{t.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            Cerrar sesión
          </Button>
        </div>
      </header>

      <div className="container mx-auto py-8 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna izquierda: Perfil del jugador */}
          <div className="md:col-span-1">
            <PlayerCard 
              language={language}
              translations={translations}
            />
          </div>

          {/* Columna central: Estadísticas */}
          <div className="md:col-span-2">
            <Card className="mb-6 bg-white dark:bg-gray-900 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-medium">{t.statistics}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="stat-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        <CircleDollarSign className="mr-2 h-4 w-4" />
                        Ganancias
                      </CardTitle>
                      {/* <MoreVertical className="h-4 w-4 cursor-pointer text-muted-foreground" /> */}
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+$201</div>
                      <p className="text-sm text-muted-foreground">
                        +20.1% desde el mes pasado
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="stat-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        <User2 className="mr-2 h-4 w-4" />
                        Nuevos jugadores
                      </CardTitle>
                      {/* <MoreVertical className="h-4 w-4 cursor-pointer text-muted-foreground" /> */}
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+721</div>
                      <p className="text-sm text-muted-foreground">
                        +52.1% desde el mes pasado
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="stat-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        <ListChecks className="mr-2 h-4 w-4" />
                        Tareas completadas
                      </CardTitle>
                      {/* <MoreVertical className="h-4 w-4 cursor-pointer text-muted-foreground" /> */}
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">78</div>
                      <p className="text-sm text-muted-foreground">
                        7% desde el mes pasado
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="stat-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        <BarChart4  className="mr-2 h-4 w-4" />
                        Rendimiento
                      </CardTitle>
                      {/* <MoreVertical className="h-4 w-4 cursor-pointer text-muted-foreground" /> */}
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+57%</div>
                      <p className="text-sm text-muted-foreground">
                        +13% desde el mes pasado
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6 bg-white dark:bg-gray-900 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-medium">{t.settings}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">{t.appearance}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.darkMode}
                      </p>
                    </div>
                    <Switch id="airplane-mode" checked={isDark} onCheckedChange={handleThemeChange} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">{t.generatePdf}</p>
                      <p className="text-xs text-muted-foreground">
                        Descarga un reporte en PDF de tus estadísticas.
                      </p>
                    </div>
                    <Button size="sm" onClick={handleGeneratePDF}>
                      Descargar PDF
                    </Button>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm font-medium leading-none">{t.selectDate}</p>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP", { locale: ptBR }) : <span>{t.noDateSelected}</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) =>
                            date > new Date() || date < new Date("2020-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <footer className="bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 p-4 text-center">
        <p>&copy; {new Date().getFullYear()} Baseball Stats App</p>
      </footer>
    </div>
  );
};

export default Dashboard;
