
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Toggle, toggleVariants } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Download, Globe } from "lucide-react";
import { jsPDF } from "jspdf";
import PlayerCard from "@/components/PlayerCard";
import StatsForm from "@/components/StatsForm";

interface PlayerStats {
  name: string;
  position: string;
  team: string;
  photo: string | null;
  stats: {
    AB: number;
    H: number;
    doubles: number;
    triples: number;
    HR: number;
    RBI: number;
    R: number;
    BB: number;
    K: number;
    SB: number;
  };
}

// Traducciones
const translations = {
  es: {
    title: "⚾ Estadísticas de Béisbol",
    greeting: "Hola",
    logout: "Cerrar Sesión",
    darkMode: "Modo Oscuro",
    language: "Idioma",
    saveStats: "Guardar Estadísticas",
    advancedStats: "Estadísticas Avanzadas",
    avg: {
      title: "AVG",
      description: "Promedio de Bateo"
    },
    obp: {
      title: "OBP",
      description: "Porcentaje de Embasado"
    },
    slg: {
      title: "SLG",
      description: "Porcentaje de Slugging"
    },
    ops: {
      title: "OPS",
      description: "On-base Plus Slugging"
    },
    exportPDF: "Exportar a PDF",
    statsSaved: "Estadísticas guardadas",
    statsSuccessfullySaved: "Tus estadísticas han sido guardadas correctamente.",
    exportSuccess: "PDF exportado correctamente",
  },
  en: {
    title: "⚾ Baseball Statistics",
    greeting: "Hello",
    logout: "Logout",
    darkMode: "Dark Mode",
    language: "Language",
    saveStats: "Save Statistics",
    advancedStats: "Advanced Statistics",
    avg: {
      title: "AVG",
      description: "Batting Average"
    },
    obp: {
      title: "OBP",
      description: "On-Base Percentage"
    },
    slg: {
      title: "SLG",
      description: "Slugging Percentage"
    },
    ops: {
      title: "OPS",
      description: "On-base Plus Slugging"
    },
    exportPDF: "Export to PDF",
    statsSaved: "Statistics saved",
    statsSuccessfullySaved: "Your statistics have been saved successfully.",
    exportSuccess: "PDF exported successfully",
  }
};

export default function Dashboard() {
  const [player, setPlayer] = useState<PlayerStats>({
    name: "",
    position: "",
    team: "",
    photo: null,
    stats: {
      AB: 0,
      H: 0,
      doubles: 0,
      triples: 0,
      HR: 0,
      RBI: 0,
      R: 0,
      BB: 0,
      K: 0,
      SB: 0,
    },
  });
  const { toast } = useToast();
  const [user, setUser] = useState<{ name?: string; email: string } | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<"es" | "en">("es");
  const t = translations[language];

  // Efecto para manejar el modo oscuro
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem("darkMode", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    // Cargar preferencia de tema
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme === "dark") {
      setDarkMode(true);
    }

    // Cargar idioma preferido
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage === "en" || savedLanguage === "es") {
      setLanguage(savedLanguage);
    }

    // Cargar datos del usuario del localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Cargar datos del jugador del localStorage
    const storedPlayer = localStorage.getItem("playerStats");
    if (storedPlayer) {
      setPlayer(JSON.parse(storedPlayer));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  const handlePlayerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files && files.length > 0) {
      setPlayer({ ...player, photo: URL.createObjectURL(files[0]) });
    } else {
      setPlayer({ ...player, [name]: value });
    }
  };

  const handleStatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPlayer({
      ...player,
      stats: { ...player.stats, [name]: parseInt(value) || 0 },
    });
  };

  const saveStats = () => {
    localStorage.setItem("playerStats", JSON.stringify(player));
    toast({
      title: t.statsSaved,
      description: t.statsSuccessfullySaved,
    });
  };

  const handleLanguageChange = (value: string) => {
    if (value === "es" || value === "en") {
      setLanguage(value);
      localStorage.setItem("language", value);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Título
    doc.setFontSize(20);
    doc.text(t.title, pageWidth / 2, 20, { align: 'center' });
    
    // Información del jugador
    doc.setFontSize(16);
    doc.text(`${player.name || "Sin nombre"}`, 20, 40);
    doc.setFontSize(12);
    doc.text(`${player.position || "Sin posición"} - ${player.team || "Sin equipo"}`, 20, 50);
    
    // Estadísticas básicas
    doc.setFontSize(14);
    doc.text("Estadísticas:", 20, 70);
    
    const stats = [
      `AB: ${player.stats.AB}`,
      `H: ${player.stats.H}`,
      `2B: ${player.stats.doubles}`,
      `3B: ${player.stats.triples}`,
      `HR: ${player.stats.HR}`,
      `RBI: ${player.stats.RBI}`,
      `R: ${player.stats.R}`,
      `BB: ${player.stats.BB}`,
      `K: ${player.stats.K}`,
      `SB: ${player.stats.SB}`
    ];
    
    let y = 80;
    stats.forEach(stat => {
      doc.text(stat, 20, y);
      y += 10;
    });
    
    // Estadísticas avanzadas
    doc.setFontSize(14);
    doc.text("Estadísticas avanzadas:", 120, 70);
    
    const advancedStats = [
      `AVG: ${calcAVG()}`,
      `OBP: ${calcOBP()}`,
      `SLG: ${calcSLG()}`,
      `OPS: ${calcOPS()}`
    ];
    
    y = 80;
    advancedStats.forEach(stat => {
      doc.text(stat, 120, y);
      y += 10;
    });
    
    // Guardar PDF
    doc.save(`${player.name || "jugador"}_stats.pdf`);
    
    toast({
      title: t.exportSuccess,
      description: `${player.name || "Player"}_stats.pdf`,
    });
  };

  const calcAVG = () => player.stats.AB ? (player.stats.H / player.stats.AB).toFixed(3) : "0.000";
  
  const calcOBP = () => {
    const { H, BB, AB } = player.stats;
    return (AB + BB) ? ((H + BB) / (AB + BB)).toFixed(3) : "0.000";
  };
  
  const calcSLG = () => {
    const { H, doubles, triples, HR, AB } = player.stats;
    const singles = H - doubles - triples - HR;
    const totalBases = singles + 2 * doubles + 3 * triples + 4 * HR;
    return AB ? (totalBases / AB).toFixed(3) : "0.000";
  };
  
  const calcOPS = () => {
    const obp = parseFloat(calcOBP());
    const slg = parseFloat(calcSLG());
    return (obp + slg).toFixed(3);
  };

  return (
    <div className={`max-w-7xl mx-auto p-4 ${darkMode ? 'dark' : ''}`}>
      <header className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">{t.title}</h1>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center space-x-2 mr-4">
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
            <Label htmlFor="dark-mode">{t.darkMode}</Label>
          </div>

          <div className="flex items-center space-x-2 mr-4">
            <Globe className="h-4 w-4" />
            <ToggleGroup type="single" value={language} onValueChange={handleLanguageChange}>
              <ToggleGroupItem value="es">ES</ToggleGroupItem>
              <ToggleGroupItem value="en">EN</ToggleGroupItem>
            </ToggleGroup>
          </div>

          <p className="text-muted-foreground ml-4">
            {t.greeting}, <span className="font-medium">{user?.name || user?.email}</span>
          </p>
          <Button variant="outline" onClick={handleLogout}>
            {t.logout}
          </Button>
        </div>
      </header>

      <PlayerCard player={player} onPlayerChange={handlePlayerChange} />
      
      <StatsForm stats={player.stats} onStatsChange={handleStatsChange} />

      <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">{t.advancedStats}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
          <div className="stat-card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-4 rounded-lg border shadow-sm text-center">
            <h2 className="text-lg font-bold text-blue-700 dark:text-blue-300">{t.avg.title}</h2>
            <p className="text-3xl font-semibold">{calcAVG()}</p>
            <p className="text-sm text-muted-foreground mt-1">{t.avg.description}</p>
          </div>
          <div className="stat-card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-4 rounded-lg border shadow-sm text-center">
            <h2 className="text-lg font-bold text-green-700 dark:text-green-300">{t.obp.title}</h2>
            <p className="text-3xl font-semibold">{calcOBP()}</p>
            <p className="text-sm text-muted-foreground mt-1">{t.obp.description}</p>
          </div>
          <div className="stat-card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 p-4 rounded-lg border shadow-sm text-center">
            <h2 className="text-lg font-bold text-purple-700 dark:text-purple-300">{t.slg.title}</h2>
            <p className="text-3xl font-semibold">{calcSLG()}</p>
            <p className="text-sm text-muted-foreground mt-1">{t.slg.description}</p>
          </div>
          <div className="stat-card bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 p-4 rounded-lg border shadow-sm text-center">
            <h2 className="text-lg font-bold text-red-700 dark:text-red-300">{t.ops.title}</h2>
            <p className="text-3xl font-semibold">{calcOPS()}</p>
            <p className="text-sm text-muted-foreground mt-1">{t.ops.description}</p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <Button size="lg" onClick={saveStats} className="px-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          {t.saveStats}
        </Button>
        
        <Button variant="secondary" size="lg" onClick={exportToPDF} className="px-8">
          <Download className="mr-2" />
          {t.exportPDF}
        </Button>
      </div>
    </div>
  );
}
