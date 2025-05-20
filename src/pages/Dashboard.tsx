
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Download, Globe, CalendarDays } from "lucide-react";
import { jsPDF } from "jspdf";
import { format, isEqual } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
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
    date?: Date;
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
    playerInfo: "Información del Jugador",
    name: "Nombre",
    position: "Posición",
    team: "Equipo",
    photo: "Foto",
    photoRecommendation: "Tamaño mínimo recomendado: 500x500 píxeles",
    adjustPhoto: "Ajustar Foto",
    zoom: "Zoom",
    movePhoto: "Arrastra para mover la foto",
    apply: "Aplicar",
    cancel: "Cancelar",
    stats: "Estadísticas Ofensivas",
    date: "Fecha",
    selectDate: "Seleccionar fecha",
    statLabels: {
      AB: "Veces al Bate",
      H: "Hits",
      doubles: "Dobles",
      triples: "Triples",
      HR: "Jonrones",
      RBI: "Carreras Impulsadas",
      R: "Carreras Anotadas",
      BB: "Bases por Bola",
      K: "Ponches",
      SB: "Bases Robadas"
    },
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
    allGames: "Todos los juegos",
    filterByDate: "Filtrar por fecha",
    addStats: "Agregar Estadísticas"
  },
  en: {
    title: "⚾ Baseball Statistics",
    greeting: "Hello",
    logout: "Logout",
    darkMode: "Dark Mode",
    language: "Language",
    saveStats: "Save Statistics",
    playerInfo: "Player Information",
    name: "Name",
    position: "Position",
    team: "Team",
    photo: "Photo",
    photoRecommendation: "Minimum recommended size: 500x500 pixels",
    adjustPhoto: "Adjust Photo",
    zoom: "Zoom",
    movePhoto: "Drag to move the photo",
    apply: "Apply",
    cancel: "Cancel",
    stats: "Offensive Statistics",
    date: "Date",
    selectDate: "Select date",
    statLabels: {
      AB: "At Bats",
      H: "Hits",
      doubles: "Doubles",
      triples: "Triples",
      HR: "Home Runs",
      RBI: "Runs Batted In",
      R: "Runs",
      BB: "Walks",
      K: "Strikeouts",
      SB: "Stolen Bases"
    },
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
    allGames: "All Games",
    filterByDate: "Filter by date",
    addStats: "Add Statistics"
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
      date: new Date(),
    },
  });
  
  const { toast } = useToast();
  const [user, setUser] = useState<{ name?: string; email: string } | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<"es" | "en">("es");
  const t = translations[language];
  const [dataModified, setDataModified] = useState(false);
  
  // Track all stats records
  const [allStats, setAllStats] = useState<PlayerStats[]>([]);
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [showAllStats, setShowAllStats] = useState(true);

  // Efecto para manejar el modo oscuro - updated to use BeatStars-like dark mode
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
    
    // Cargar historial de estadísticas
    const storedStats = localStorage.getItem("playerStatsHistory");
    if (storedStats) {
      setAllStats(JSON.parse(storedStats));
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
      setDataModified(true);
    } else if (name === "photo" && value) { // For our custom photo handler
      setPlayer({ ...player, photo: value });
      setDataModified(true);
    } else {
      setPlayer({ ...player, [name]: value });
      setDataModified(true);
    }
  };

  const handleStatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPlayer({
      ...player,
      stats: { ...player.stats, [name]: parseInt(value) || 0 },
    });
    setDataModified(true);
  };

  const handleDateChange = (date: Date | undefined) => {
    setPlayer({
      ...player,
      stats: { ...player.stats, date: date }
    });
    setDataModified(true);
  };

  const saveStats = () => {
    // Create a new entry with current date
    const newEntry = { ...player };
    
    // Save current player state
    localStorage.setItem("playerStats", JSON.stringify(player));
    
    // Update history
    const updatedStats = [...allStats, newEntry];
    setAllStats(updatedStats);
    localStorage.setItem("playerStatsHistory", JSON.stringify(updatedStats));
    
    toast({
      title: t.statsSaved,
      description: t.statsSuccessfullySaved,
    });
    
    // Reset the modified flag
    setDataModified(false);
  };

  const handleLanguageChange = (value: string) => {
    if (value === "es" || value === "en") {
      setLanguage(value);
      localStorage.setItem("language", value);
    }
  };
  
  const toggleFilter = (showAll: boolean) => {
    setShowAllStats(showAll);
    if (showAll) {
      setFilterDate(null);
    }
  };
  
  const filterStatsByDate = () => {
    if (showAllStats) {
      return allStats;
    }
    
    // Filter by specific date
    if (!filterDate) {
      return allStats;
    }
    
    return allStats.filter(stat => {
      if (!stat.stats.date) return false;
      const statDate = new Date(stat.stats.date);
      return statDate.toDateString() === filterDate.toDateString();
    });
  };
  
  const currentStats = useMemo(() => filterStatsByDate(), [allStats, showAllStats, filterDate]);
  
  const calculateAggregateStats = () => {
    if (currentStats.length === 0) {
      const numericStats: Record<string, number> = {};
      Object.entries(player.stats).forEach(([key, value]) => {
        if (key !== 'date' && typeof value === 'number') {
          numericStats[key] = value;
        }
      });
      return numericStats;
    }
    
    // Combine all filtered stats
    const aggregated: Record<string, number> = {};
    currentStats.forEach(stat => {
      Object.entries(stat.stats).forEach(([key, value]) => {
        if (key !== 'date' && typeof value === 'number') {
          aggregated[key] = (aggregated[key] || 0) + value;
        }
      });
    });
    
    return aggregated;
  };
  
  const aggregateStats = useMemo(() => calculateAggregateStats(), [currentStats, player.stats]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Improved PDF template with centered title and line design
    // Header with lines
    doc.setLineWidth(0.5);
    doc.line(20, 15, pageWidth - 20, 15); // Top line
    
    // Title
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(t.title, pageWidth / 2, 25, { align: 'center' });
    
    doc.setLineWidth(0.5);
    doc.line(20, 30, pageWidth - 20, 30); // Bottom line of title
    
    // Player information section
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`${t.playerInfo}:`, 20, 45);
    
    doc.setLineWidth(0.2);
    doc.line(20, 48, 100, 48); // Underline section title
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    // Player data with field labels
    const playerInfo = [
      `${t.name}: ${player.name || "-"}`,
      `${t.position}: ${player.position || "-"}`,
      `${t.team}: ${player.team || "-"}`,
      `${t.date}: ${player.stats.date ? format(new Date(player.stats.date), 'PP', { locale: language === "es" ? es : undefined }) : "-"}`
    ];
    
    let y = 55;
    playerInfo.forEach(info => {
      doc.text(info, 25, y);
      y += 7;
    });
    
    // Basic stats section
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`${t.stats}:`, 20, 85);
    
    doc.setLineWidth(0.2);
    doc.line(20, 88, 100, 88); // Underline section title
    
    // Stats in two columns with borders
    const basicStats = [
      [`AB: ${aggregateStats.AB || 0}`, `H: ${aggregateStats.H || 0}`],
      [`2B: ${aggregateStats.doubles || 0}`, `3B: ${aggregateStats.triples || 0}`],
      [`HR: ${aggregateStats.HR || 0}`, `RBI: ${aggregateStats.RBI || 0}`],
      [`R: ${aggregateStats.R || 0}`, `BB: ${aggregateStats.BB || 0}`],
      [`K: ${aggregateStats.K || 0}`, `SB: ${aggregateStats.SB || 0}`]
    ];
    
    // Draw stats in a table-like format
    y = 95;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    
    // Create a light gray background for the stats table
    doc.setFillColor(245, 245, 245);
    doc.rect(25, y-5, 160, 50, 'F');
    
    // Draw table borders
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.1);
    doc.rect(25, y-5, 160, 50);
    
    // Draw horizontal lines
    for (let i = 1; i < 5; i++) {
      doc.line(25, y-5+i*10, 185, y-5+i*10);
    }
    
    // Draw vertical line in middle
    doc.line(105, y-5, 105, y+45);
    
    // Add stats text
    basicStats.forEach((row, index) => {
      doc.text(row[0], 30, y + index * 10);
      doc.text(row[1], 110, y + index * 10);
    });
    
    // Advanced stats section
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`${t.advancedStats}:`, 20, 155);
    
    doc.setLineWidth(0.2);
    doc.line(20, 158, 120, 158); // Underline section title
    
    // Create another table for advanced stats
    const advancedStats = [
      [`${t.avg.title}: ${calcAVG(aggregateStats)}`, `${t.obp.title}: ${calcOBP(aggregateStats)}`],
      [`${t.slg.title}: ${calcSLG(aggregateStats)}`, `${t.ops.title}: ${calcOPS(aggregateStats)}`]
    ];
    
    // Draw advanced stats in a table-like format
    y = 165;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    
    // Create a light blue background for the advanced stats
    doc.setFillColor(235, 245, 255);
    doc.rect(25, y-5, 160, 25, 'F');
    
    // Draw table borders
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.1);
    doc.rect(25, y-5, 160, 25);
    
    // Draw horizontal line
    doc.line(25, y+5, 185, y+5);
    
    // Draw vertical line in middle
    doc.line(105, y-5, 105, y+20);
    
    // Add advanced stats text
    advancedStats.forEach((row, index) => {
      doc.text(row[0], 30, y + index * 10);
      doc.text(row[1], 110, y + index * 10);
    });
    
    // Add timestamp at the bottom
    const today = new Date();
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`${today.toLocaleDateString(language === "es" ? "es-ES" : "en-US")} - ${player.name || "Player"} Stats Report`, pageWidth / 2, 280, { align: 'center' });
    
    // Save PDF
    doc.save(`${player.name || "player"}_stats.pdf`);
    
    toast({
      title: t.exportSuccess,
      description: `${player.name || "player"}_stats.pdf`,
    });
  };

  const calcAVG = (stats: Record<string, number>) => {
    return stats.AB ? (stats.H / stats.AB).toFixed(3) : "0.000";
  };
  
  const calcOBP = (stats: Record<string, number>) => {
    const H = stats.H || 0;
    const BB = stats.BB || 0;
    const AB = stats.AB || 0;
    return (AB + BB) ? ((H + BB) / (AB + BB)).toFixed(3) : "0.000";
  };
  
  const calcSLG = (stats: Record<string, number>) => {
    const H = stats.H || 0;
    const doubles = stats.doubles || 0;
    const triples = stats.triples || 0;
    const HR = stats.HR || 0;
    const AB = stats.AB || 0;
    const singles = H - doubles - triples - HR;
    const totalBases = singles + 2 * doubles + 3 * triples + 4 * HR;
    return AB ? (totalBases / AB).toFixed(3) : "0.000";
  };
  
  const calcOPS = (stats: Record<string, number>) => {
    const obp = parseFloat(calcOBP(stats));
    const slg = parseFloat(calcSLG(stats));
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

      <PlayerCard player={player} onPlayerChange={handlePlayerChange} language={language} translations={translations} />
      
      <div className="mb-4 flex gap-2 items-center justify-end flex-wrap">
        <Button 
          variant={showAllStats ? "default" : "outline"} 
          size="sm"
          onClick={() => toggleFilter(true)}
        >
          {t.allGames}
        </Button>
        
        <Button 
          variant={!showAllStats ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setShowAllStats(false);
          }}
        >
          {t.filterByDate}
        </Button>
        
        {!showAllStats && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "w-[180px] justify-start text-left",
                  !filterDate && "text-muted-foreground"
                )}
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                {filterDate ? (
                  format(filterDate, "PPP", { locale: language === "es" ? es : undefined })
                ) : (
                  <span>{t.selectDate}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filterDate || undefined}
                onSelect={(date) => setFilterDate(date)}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        )}
      </div>
      
      <StatsForm 
        stats={player.stats} 
        onStatsChange={handleStatsChange} 
        onDateChange={handleDateChange}
        language={language} 
        translations={translations}
        onAddStats={saveStats}
        dataModified={dataModified}
      />

      <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">{t.advancedStats}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
          <div className="stat-card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-4 rounded-lg border shadow-sm text-center">
            <h2 className="text-lg font-bold text-blue-700 dark:text-blue-300">{t.avg.title}</h2>
            <p className="text-3xl font-semibold">{calcAVG(aggregateStats)}</p>
            <p className="text-sm text-muted-foreground mt-1">{t.avg.description}</p>
          </div>
          <div className="stat-card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-4 rounded-lg border shadow-sm text-center">
            <h2 className="text-lg font-bold text-green-700 dark:text-green-300">{t.obp.title}</h2>
            <p className="text-3xl font-semibold">{calcOBP(aggregateStats)}</p>
            <p className="text-sm text-muted-foreground mt-1">{t.obp.description}</p>
          </div>
          <div className="stat-card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 p-4 rounded-lg border shadow-sm text-center">
            <h2 className="text-lg font-bold text-purple-700 dark:text-purple-300">{t.slg.title}</h2>
            <p className="text-3xl font-semibold">{calcSLG(aggregateStats)}</p>
            <p className="text-sm text-muted-foreground mt-1">{t.slg.description}</p>
          </div>
          <div className="stat-card bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 p-4 rounded-lg border shadow-sm text-center">
            <h2 className="text-lg font-bold text-red-700 dark:text-red-300">{t.ops.title}</h2>
            <p className="text-3xl font-semibold">{calcOPS(aggregateStats)}</p>
            <p className="text-sm text-muted-foreground mt-1">{t.ops.description}</p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-center gap-4">
        <Button variant="secondary" size="lg" onClick={exportToPDF} className="px-8">
          <Download className="mr-2" />
          {t.exportPDF}
        </Button>
      </div>
    </div>
  );
}
