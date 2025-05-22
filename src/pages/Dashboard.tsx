import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Calculator, Globe, PenSquare } from "lucide-react";
import { jsPDF } from "jspdf";
import { format, isEqual } from "date-fns";
import { es } from "date-fns/locale";
import PlayerCard from "@/components/PlayerCard";
import StatsForm from "@/components/StatsForm";
import PitchingStatsForm from "@/components/PitchingStatsForm";

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

interface PitchingStats {
  IP: number;
  H: number;
  R: number;
  ER: number;
  BB: number;
  K: number;
  HBP: number;
  WP: number;
  BK: number;
  W: number;
  L: number;
  SV: number;
  date?: Date;
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
    pitchingStatLabels: {
      IP: "Entradas Lanzadas",
      H: "Hits Permitidos",
      R: "Carreras Permitidas",
      ER: "Carreras Limpias",
      BB: "Bases por Bola",
      K: "Ponches",
      HBP: "Golpeados",
      WP: "Wild Pitches",
      BK: "Balks",
      W: "Victorias",
      L: "Derrotas",
      SV: "Salvados"
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
    era: {
      title: "ERA",
      description: "Promedio de Carreras Limpias"
    },
    whip: {
      title: "WHIP",
      description: "Walks + Hits por Entradas Lanzadas"
    },
    kbb: {
      title: "K/BB",
      description: "Ratio de Ponches a Bases por Bola"
    },
    baa: {
      title: "BAA",
      description: "Promedio de Bateo en Contra"
    },
    k9: {
      title: "K/9",
      description: "Ponches por 9 Entradas"
    },
    exportPDF: "Exportar a PDF",
    statsSaved: "Estadísticas guardadas",
    statsSuccessfullySaved: "Tus estadísticas han sido guardadas correctamente.",
    exportSuccess: "PDF exportado correctamente",
    allGames: "Todos los juegos",
    filterByDate: "Filtrar por fecha",
    addStats: "Agregar Datos",
    searchByDay: "Datos del Día",
    reset: "Reiniciar Datos",
    resetConfirm: "¿Estás seguro?",
    resetSuccess: "Datos reiniciados correctamente",
    noDataForDate: "No hay datos para esta fecha",
    resetWarning: "Se perderán todos los datos guardados anteriormente. ¿Estás seguro de que quieres continuar?",
    confirmDelete: "Sí, borrar todo",
    selectPosition: "Seleccionar posición...",
    searchPosition: "Buscar posición...",
    noPositionFound: "No se encontró ninguna posición.",
    battingTab: "Bateo",
    pitchingTab: "Pitcheo",
    pitchingStats: "Estadísticas de Pitcheo",
    viewTotalStats: "Ver Totales",
    totalStats: "Estadísticas Totales",
    totalStatsDescription: "Resumen de todas las estadísticas agregadas",
    close: "Cerrar",
    dateRange: "Rango de Fechas",
    allDates: "Todas las Fechas"
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
    pitchingStatLabels: {
      IP: "Innings Pitched",
      H: "Hits Allowed",
      R: "Runs Allowed",
      ER: "Earned Runs",
      BB: "Walks",
      K: "Strikeouts",
      HBP: "Hit By Pitch",
      WP: "Wild Pitches",
      BK: "Balks",
      W: "Wins",
      L: "Losses",
      SV: "Saves"
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
    era: {
      title: "ERA",
      description: "Earned Run Average"
    },
    whip: {
      title: "WHIP",
      description: "Walks + Hits per Inning Pitched"
    },
    kbb: {
      title: "K/BB",
      description: "Strikeout to Walk Ratio"
    },
    baa: {
      title: "BAA",
      description: "Batting Average Against"
    },
    k9: {
      title: "K/9",
      description: "Strikeouts per 9 Innings"
    },
    exportPDF: "Export to PDF",
    statsSaved: "Statistics saved",
    statsSuccessfullySaved: "Your statistics have been saved successfully.",
    exportSuccess: "PDF exported successfully",
    allGames: "All Games",
    filterByDate: "Filter by date",
    addStats: "Add Stats",
    searchByDay: "Day Stats",
    reset: "Reset Data",
    resetConfirm: "Are you sure?",
    resetSuccess: "Data reset successfully",
    noDataForDate: "No data for this date",
    resetWarning: "All previously saved data will be lost. Are you sure you want to continue?",
    confirmDelete: "Yes, delete all",
    selectPosition: "Select position...",
    searchPosition: "Search position...",
    noPositionFound: "No position found.",
    battingTab: "Batting",
    pitchingTab: "Pitching",
    pitchingStats: "Pitching Statistics",
    viewTotalStats: "View Totals",
    totalStats: "Total Statistics",
    totalStatsDescription: "Summary of all added statistics",
    close: "Close",
    dateRange: "Date Range",
    allDates: "All Dates"
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
  
  const [pitching, setPitching] = useState<PitchingStats>({
    IP: 0,
    H: 0,
    R: 0,
    ER: 0,
    BB: 0,
    K: 0,
    HBP: 0,
    WP: 0,
    BK: 0,
    W: 0,
    L: 0,
    SV: 0,
    date: new Date(),
  });
  
  const { toast } = useToast();
  const [user, setUser] = useState<{ name?: string; email: string } | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<"es" | "en">("es");
  const [showTotalsDialog, setShowTotalsDialog] = useState<boolean>(false);
  const t = translations[language];
  const [dataModified, setDataModified] = useState(false);
  const [pitchingDataModified, setPitchingDataModified] = useState(false);
  
  // Track all stats records
  const [allStats, setAllStats] = useState<PlayerStats[]>([]);
  const [allPitchingStats, setAllPitchingStats] = useState<(PitchingStats & {name: string; team: string; position: string})[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDayStats, setShowDayStats] = useState(false);
  const [dayStats, setDayStats] = useState<PlayerStats["stats"] | null>(null);
  const [dayPitchingStats, setDayPitchingStats] = useState<PitchingStats | null>(null);
  const [activeTab, setActiveTab] = useState<"batting" | "pitching">("batting");

  // Efecto para manejar el modo oscuro - updated to use true black dark mode
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
    
    // Cargar datos de pitcheo del localStorage
    const storedPitching = localStorage.getItem("pitchingStats");
    if (storedPitching) {
      setPitching(JSON.parse(storedPitching));
    }
    
    // Cargar historial de estadísticas
    const storedStats = localStorage.getItem("playerStatsHistory");
    if (storedStats) {
      setAllStats(JSON.parse(storedStats));
    }
    
    // Cargar historial de estadísticas de pitcheo
    const storedPitchingStats = localStorage.getItem("pitchingStatsHistory");
    if (storedPitchingStats) {
      setAllPitchingStats(JSON.parse(storedPitchingStats));
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

  const handlePositionSelect = (position: string) => {
    setPlayer({ ...player, position });
    setDataModified(true);
  };

  const handleStatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPlayer({
      ...player,
      stats: { ...player.stats, [name]: parseInt(value) || 0 },
    });
    setDataModified(true);
  };

  const handlePitchingStatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = name === "IP" ? parseFloat(value) || 0 : parseInt(value) || 0;
    setPitching({
      ...pitching,
      [name]: numValue,
    });
    setPitchingDataModified(true);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (activeTab === "batting") {
      setPlayer({
        ...player,
        stats: { ...player.stats, date: date }
      });
    } else {
      setPitching({
        ...pitching,
        date: date
      });
    }
    
    // Also update the selected date for filtering
    if (date) {
      setSelectedDate(date);
    }
  };

  const addStats = () => {
    if (activeTab === "batting") {
      if (!player.stats.date) {
        player.stats.date = new Date();
      }
      
      // Create a new entry with current date
      const newEntry = { ...player };
      
      // Update history
      const updatedStats = [...allStats, newEntry];
      setAllStats(updatedStats);
      localStorage.setItem("playerStatsHistory", JSON.stringify(updatedStats));
      
      // Save current player state
      localStorage.setItem("playerStats", JSON.stringify(player));
      
      toast({
        title: t.statsSaved,
        description: t.statsSuccessfullySaved,
      });
      
      // Reset the modified flag
      setDataModified(false);
      
      // Reset stats to zero after adding
      setPlayer({
        ...player,
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
          date: new Date()
        }
      });
    } else {
      // Pitching stats
      if (!pitching.date) {
        pitching.date = new Date();
      }
      
      // Create a new entry with current date
      const newPitchingEntry = { 
        ...pitching,
        name: player.name,
        position: player.position,
        team: player.team
      };
      
      // Update history
      const updatedPitchingStats = [...allPitchingStats, newPitchingEntry];
      setAllPitchingStats(updatedPitchingStats);
      localStorage.setItem("pitchingStatsHistory", JSON.stringify(updatedPitchingStats));
      
      // Save current pitching state
      localStorage.setItem("pitchingStats", JSON.stringify(pitching));
      
      toast({
        title: t.statsSaved,
        description: t.statsSuccessfullySaved,
      });
      
      // Reset the modified flag
      setPitchingDataModified(false);
      
      // Reset pitching stats to zero after adding
      setPitching({
        IP: 0,
        H: 0,
        R: 0,
        ER: 0,
        BB: 0,
        K: 0,
        HBP: 0,
        WP: 0,
        BK: 0,
        W: 0,
        L: 0,
        SV: 0,
        date: new Date()
      });
    }
  };

  const searchDayStats = () => {
    if (activeTab === "batting") {
      if (!player.stats.date) {
        return;
      }

      setSelectedDate(player.stats.date);
      setShowDayStats(true);
      
      // Find stats for this specific date
      const statsForDay = allStats.filter(stat => {
        if (!stat.stats.date) return false;
        const statDate = new Date(stat.stats.date);
        return statDate.toDateString() === player.stats.date?.toDateString();
      });
      
      if (statsForDay.length > 0) {
        // Calculate aggregate stats for this day - Fix the TypeScript error here
        const aggregatedStats = calculateAggregateStatsForEntries(statsForDay);
        
        // Create a properly typed stats object
        const typedDayStats: PlayerStats["stats"] = {
          AB: aggregatedStats.AB || 0,
          H: aggregatedStats.H || 0,
          doubles: aggregatedStats.doubles || 0,
          triples: aggregatedStats.triples || 0,
          HR: aggregatedStats.HR || 0,
          RBI: aggregatedStats.RBI || 0,
          R: aggregatedStats.R || 0,
          BB: aggregatedStats.BB || 0,
          K: aggregatedStats.K || 0,
          SB: aggregatedStats.SB || 0,
          date: player.stats.date
        };
        
        setDayStats(typedDayStats);
      } else {
        setDayStats(null);
        toast({
          title: t.noDataForDate,
          description: format(player.stats.date, "PPP", { locale: language === "es" ? es : undefined }),
        });
      }
    } else {
      // Pitching stats
      if (!pitching.date) {
        return;
      }

      setSelectedDate(pitching.date);
      setShowDayStats(true);
      
      // Find pitching stats for this specific date
      const pitchingStatsForDay = allPitchingStats.filter(stat => {
        if (!stat.date) return false;
        const statDate = new Date(stat.date);
        return statDate.toDateString() === pitching.date?.toDateString();
      });
      
      if (pitchingStatsForDay.length > 0) {
        // Calculate aggregate pitching stats for this day
        const aggregatedPitchingStats = calculateAggregatePitchingStats(pitchingStatsForDay);
        
        // Create a properly typed pitching stats object
        const typedPitchingStats: PitchingStats = {
          IP: aggregatedPitchingStats.IP || 0,
          H: aggregatedPitchingStats.H || 0,
          R: aggregatedPitchingStats.R || 0,
          ER: aggregatedPitchingStats.ER || 0,
          BB: aggregatedPitchingStats.BB || 0,
          K: aggregatedPitchingStats.K || 0,
          HBP: aggregatedPitchingStats.HBP || 0,
          WP: aggregatedPitchingStats.WP || 0,
          BK: aggregatedPitchingStats.BK || 0,
          W: aggregatedPitchingStats.W || 0,
          L: aggregatedPitchingStats.L || 0,
          SV: aggregatedPitchingStats.SV || 0,
          date: pitching.date
        };
        
        setDayPitchingStats(typedPitchingStats);
      } else {
        setDayPitchingStats(null);
        toast({
          title: t.noDataForDate,
          description: format(pitching.date, "PPP", { locale: language === "es" ? es : undefined }),
        });
      }
    }
  };

  const resetStats = () => {
    if (activeTab === "batting") {
      // Clear all batting stats
      setAllStats([]);
      localStorage.removeItem("playerStatsHistory");
      
      // Reset current batting stats
      setPlayer({
        ...player,
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
          date: new Date()
        }
      });
      
      localStorage.setItem("playerStats", JSON.stringify({
        ...player,
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
          date: new Date()
        }
      }));
    } else {
      // Clear all pitching stats
      setAllPitchingStats([]);
      localStorage.removeItem("pitchingStatsHistory");
      
      // Reset current pitching stats
      setPitching({
        IP: 0,
        H: 0,
        R: 0,
        ER: 0,
        BB: 0,
        K: 0,
        HBP: 0,
        WP: 0,
        BK: 0,
        W: 0,
        L: 0,
        SV: 0,
        date: new Date()
      });
      
      localStorage.setItem("pitchingStats", JSON.stringify({
        IP: 0,
        H: 0,
        R: 0,
        ER: 0,
        BB: 0,
        K: 0,
        HBP: 0,
        WP: 0,
        BK: 0,
        W: 0,
        L: 0,
        SV: 0,
        date: new Date()
      }));
    }
    
    // Reset UI state
    setShowDayStats(false);
    setSelectedDate(null);
    setDataModified(false);
    setPitchingDataModified(false);
    setDayStats(null);
    setDayPitchingStats(null);
    
    toast({
      title: t.resetSuccess,
    });
  };

  const handleLanguageChange = (value: string) => {
    if (value === "es" || value === "en") {
      setLanguage(value);
      localStorage.setItem("language", value);
    }
  };
  
  const filterStatsByDate = () => {
    if (!showDayStats || !selectedDate) {
      return allStats;
    }
    
    // Filter by specific date
    return allStats.filter(stat => {
      if (!stat.stats.date) return false;
      const statDate = new Date(stat.stats.date);
      return statDate.toDateString() === selectedDate.toDateString();
    });
  };
  
  const filterPitchingStatsByDate = () => {
    if (!showDayStats || !selectedDate) {
      return allPitchingStats;
    }
    
    // Filter by specific date
    return allPitchingStats.filter(stat => {
      if (!stat.date) return false;
      const statDate = new Date(stat.date);
      return statDate.toDateString() === selectedDate.toDateString();
    });
  };
  
  // This useMemo determines which stats to display based on whether we're showing all stats or just day stats
  const currentStats = useMemo(() => {
    return showDayStats ? filterStatsByDate() : allStats;
  }, [allStats, showDayStats, selectedDate]);
  
  const currentPitchingStats = useMemo(() => {
    return showDayStats ? filterPitchingStatsByDate() : allPitchingStats;
  }, [allPitchingStats, showDayStats, selectedDate]);
  
  // Helper function to calculate aggregate stats for a set of entries
  const calculateAggregateStatsForEntries = (entries: PlayerStats[]) => {
    if (entries.length === 0) {
      return {
        AB: 0,
        H: 0,
        doubles: 0,
        triples: 0,
        HR: 0,
        RBI: 0,
        R: 0,
        BB: 0,
        K: 0,
        SB: 0
      };
    }
    
    const aggregated: Record<string, number> = {
      AB: 0,
      H: 0,
      doubles: 0,
      triples: 0,
      HR: 0,
      RBI: 0,
      R: 0,
      BB: 0,
      K: 0,
      SB: 0
    };

    entries.forEach(stat => {
      // Add basic stats
      aggregated.AB += stat.stats.AB || 0;
      aggregated.doubles += stat.stats.doubles || 0;
      aggregated.triples += stat.stats.triples || 0;
      aggregated.HR += stat.stats.HR || 0;
      aggregated.RBI += stat.stats.RBI || 0;
      aggregated.R += stat.stats.R || 0;
      aggregated.BB += stat.stats.BB || 0;
      aggregated.K += stat.stats.K || 0;
      aggregated.SB += stat.stats.SB || 0;
      
      // For hits, sum the explicit hits plus doubles, triples, and HRs
      // This counts all hits including extra-base hits
      aggregated.H += stat.stats.H || 0;
    });
    
    return aggregated;
  };
  
  // Helper function to calculate aggregate pitching stats
  const calculateAggregatePitchingStats = (entries: (PitchingStats & {name: string; team: string; position: string})[]) => {
    if (entries.length === 0) {
      return {
        IP: 0,
        H: 0,
        R: 0,
        ER: 0,
        BB: 0,
        K: 0,
        HBP: 0,
        WP: 0,
        BK: 0,
        W: 0,
        L: 0,
        SV: 0
      };
    }
    
    const aggregated: Record<string, number> = {};
    
    entries.forEach(stat => {
      Object.entries(stat).forEach(([key, value]) => {
        if (key !== 'date' && key !== 'name' && key !== 'team' && key !== 'position' && typeof value === 'number') {
          aggregated[key] = (aggregated[key] || 0) + value;
        }
      });
    });
    
    return aggregated;
  };
  
  const aggregateStats = useMemo(() => {
    return calculateAggregateStatsForEntries(currentStats);
  }, [currentStats]);
  
  const aggregatePitchingStats = useMemo(() => {
    return calculateAggregatePitchingStats(currentPitchingStats);
  }, [currentPitchingStats]);
  
  // Aggregate all stats (not filtered by date)
  const allTimeAggregateStats = useMemo(() => {
    return calculateAggregateStatsForEntries(allStats);
  }, [allStats]);
  
  const allTimeAggregatePitchingStats = useMemo(() => {
    return calculateAggregatePitchingStats(allPitchingStats);
  }, [allPitchingStats]);

  const handleViewTotals = () => {
    setShowTotalsDialog(true);
  };

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
    
    if (activeTab === "batting") {
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
    } else {
      // Pitching stats section
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(`${t.pitchingStats}:`, 20, 85);
      
      doc.setLineWidth(0.2);
      doc.line(20, 88, 120, 88); // Underline section title
      
      // Stats in two columns with borders
      const pitchingBasicStats = [
        [`IP: ${aggregatePitchingStats.IP || 0}`, `H: ${aggregatePitchingStats.H || 0}`],
        [`R: ${aggregatePitchingStats.R || 0}`, `ER: ${aggregatePitchingStats.ER || 0}`],
        [`BB: ${aggregatePitchingStats.BB || 0}`, `K: ${aggregatePitchingStats.K || 0}`],
        [`HBP: ${aggregatePitchingStats.HBP || 0}`, `WP: ${aggregatePitchingStats.WP || 0}`],
        [`BK: ${aggregatePitchingStats.BK || 0}`, `W: ${aggregatePitchingStats.W || 0}-${aggregatePitchingStats.L || 0}, SV: ${aggregatePitchingStats.SV || 0}`]
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
      pitchingBasicStats.forEach((row, index) => {
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
      const advancedPitchingStats = [
        [`${t.era.title}: ${calcERA(aggregatePitchingStats)}`, `${t.whip.title}: ${calcWHIP(aggregatePitchingStats)}`],
        [`${t.kbb.title}: ${calcKBB(aggregatePitchingStats)}`, `${t.baa.title}: ${calcBAA(aggregatePitchingStats)}`]
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
      advancedPitchingStats.forEach((row, index) => {
        doc.text(row[0], 30, y + index * 10);
        doc.text(row[1], 110, y + index * 10);
      });
    }
    
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
    // Total hits includes H (singles) + doubles + triples + HR
    const totalHits = stats.H || 0;
    return stats.AB ? (totalHits / stats.AB).toFixed(3) : "0.000";
  };
  
  const calcOBP = (stats: Record<string, number>) => {
    // MLB Standard: OBP = (H + BB + HBP) / (AB + BB + HBP + SF)
    // Since we don't track HBP and SF, we use a simplified version
    const totalHits = stats.H || 0;
    const BB = stats.BB || 0;
    const AB = stats.AB || 0;
    
    // In MLB, this would include HBP in both numerator and denominator
    // and SF in the denominator, but we don't track those stats
    return (AB + BB) ? ((totalHits + BB) / (AB + BB)).toFixed(3) : "0.000";
  };
  
  const calcSLG = (stats: Record<string, number>) => {
    // Singles = H - (2B + 3B + HR)
    const singles = Math.max(0, (stats.H || 0) - (stats.doubles || 0) - (stats.triples || 0) - (stats.HR || 0));
    const doubles = stats.doubles || 0;
    const triples = stats.triples || 0;
    const HR = stats.HR || 0;
    const AB = stats.AB || 0;
    
    // Calculate total bases: singles + 2*doubles + 3*triples + 4*HR
    // This is the standard MLB formula for SLG
    const totalBases = singles + 2 * doubles + 3 * triples + 4 * HR;
    
    return AB ? (totalBases / AB).toFixed(3) : "0.000";
  };
  
  const calcOPS = (stats: Record<string, number>) => {
    // OPS = OBP + SLG (standard MLB formula)
    const obp = parseFloat(calcOBP(stats));
    const slg = parseFloat(calcSLG(stats));
    return (obp + slg).toFixed(3);
  };
  
  // Pitching statistics calculations - all match MLB standards
  const calcERA = (stats: Record<string, number>) => {
    const ER = stats.ER || 0;
    const IP = stats.IP || 0;
    return IP ? ((ER * 9) / IP).toFixed(2) : "0.00";
  };
  
  const calcWHIP = (stats: Record<string, number>) => {
    const H = stats.H || 0;
    const BB = stats.BB || 0;
    const IP = stats.IP || 0;
    return IP ? ((H + BB) / IP).toFixed(2) : "0.00";
  };
  
  const calcKBB = (stats: Record<string, number>) => {
    const K = stats.K || 0;
    const BB = stats.BB || 0;
    return BB ? (K / BB).toFixed(2) : K > 0 ? "∞" : "0.00";
  };
  
  // Replace K/9 with Batting Average Against (BAA)
  const calcBAA = (stats: Record<string, number>) => {
    const H = stats.H || 0;
    // MLB calculates BAA as H / (AB), but we don't track AB for pitchers
    // Instead we can estimate AB as IP * 3 (approx. outs) plus hits
    const IP = stats.IP || 0;
    const estimatedAB = (IP * 3) + H;
    return estimatedAB ? (H / estimatedAB).toFixed(3) : "0.000";
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

      <PlayerCard 
        player={player} 
        onPlayerChange={handlePlayerChange} 
        onPositionSelect={handlePositionSelect}
        language={language} 
        translations={translations} 
      />
      
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "batting" | "pitching")} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="batting" className="flex items-center gap-2">
            <span role="img" aria-label="batting" className="text-lg">🏏</span>
            {t.battingTab}
          </TabsTrigger>
          <TabsTrigger value="pitching" className="flex items-center gap-2">
            <span role="img" aria-label="pitching" className="text-lg">⚾</span>
            {t.pitchingTab}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="batting" className="tab-content">
          <StatsForm 
            stats={player.stats} 
            onStatsChange={handleStatsChange} 
            onDateChange={handleDateChange}
            language={language} 
            translations={translations}
            onAddStats={addStats}
            onSearchDay={searchDayStats}
            onResetStats={resetStats}
            dataModified={dataModified}
            dayStats={dayStats || undefined}
            isShowingDayStats={showDayStats}
          />
          
          <Card className="bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-center">
                {t.advancedStats}
                {showDayStats && selectedDate && (
                  <span className="block text-sm font-normal text-muted-foreground mt-1">
                    {format(selectedDate, "PPP", { locale: language === "es" ? es : undefined })}
                  </span>
                )}
              </CardTitle>
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
        </TabsContent>
        <TabsContent value="pitching" className="tab-content">
          <PitchingStatsForm 
            stats={pitching}
            onStatsChange={handlePitchingStatsChange}
            onDateChange={handleDateChange}
            language={language}
            translations={translations}
            onAddStats={addStats}
            onSearchDay={searchDayStats}
            onResetStats={resetStats}
            dataModified={pitchingDataModified}
            dayStats={dayPitchingStats || undefined}
            isShowingDayStats={showDayStats}
          />
          
          <Card className="bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-center">
                {t.advancedStats}
                {showDayStats && selectedDate && (
                  <span className="block text-sm font-normal text-muted-foreground mt-1">
                    {format(selectedDate, "PPP", { locale: language === "es" ? es : undefined })}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
              <div className="stat-card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-4 rounded-lg border shadow-sm text-center">
                <h2 className="text-lg font-bold text-blue-700 dark:text-blue-300">{t.era.title}</h2>
                <p className="text-3xl font-semibold">{calcERA(aggregatePitchingStats)}</p>
                <p className="text-sm text-muted-foreground mt-1">{t.era.description}</p>
              </div>
              <div className="stat-card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-4 rounded-lg border shadow-sm text-center">
                <h2 className="text-lg font-bold text-green-700 dark:text-green-300">{t.whip.title}</h2>
                <p className="text-3xl font-semibold">{calcWHIP(aggregatePitchingStats)}</p>
                <p className="text-sm text-muted-foreground mt-1">{t.whip.description}</p>
              </div>
              <div className="stat-card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 p-4 rounded-lg border shadow-sm text-center">
                <h2 className="text-lg font-bold text-purple-700 dark:text-purple-300">{t.kbb.title}</h2>
                <p className="text-3xl font-semibold">{calcKBB(aggregatePitchingStats)}</p>
                <p className="text-sm text-muted-foreground mt-1">{t.kbb.description}</p>
              </div>
              <div className="stat-card bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 p-4 rounded-lg border shadow-sm text-center">
                <h2 className="text-lg font-bold text-red-700 dark:text-red-300">{t.baa.title}</h2>
                <p className="text-3xl font-semibold">{calcBAA(aggregatePitchingStats)}</p>
                <p className="text-sm text-muted-foreground mt-1">{t.baa.description}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-center gap-4">
        <Button variant="secondary" size="lg" onClick={exportToPDF} className="px-8">
          <Download className="mr-2" />
          {t.exportPDF}
        </Button>
        
        <Button variant="default" size="lg" onClick={handleViewTotals} className="px-8">
          <Calculator className="mr-2" />
          {t.viewTotalStats}
        </Button>
      </div>

      {/* Dialog para mostrar estadísticas totales */}
      <Dialog open={showTotalsDialog} onOpenChange={setShowTotalsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{t.totalStats}</DialogTitle>
            <DialogDescription>{t.totalStatsDescription}</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <h3 className="text-lg font-semibold mb-4">{t.dateRange}: {t.allDates}</h3>
            
            <div className="space-y-6">
              {/* Batting Stats */}
              <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
                <h4 className="font-bold text-md mb-2 flex items-center gap-2">
                  <span role="img" aria-label="batting">🏏</span>
                  {t.battingTab}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div className="stat-item">
                    <span className="text-muted-foreground text-sm">{t.statLabels.AB}:</span>
                    <span className="font-medium ml-2">{allTimeAggregateStats.AB || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="text-muted-foreground text-sm">{t.statLabels.H}:</span>
                    <span className="font-medium ml-2">{allTimeAggregateStats.H || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="text-muted-foreground text-sm">{t.statLabels.doubles}:</span>
                    <span className="font-medium ml-2">{allTimeAggregateStats.doubles || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="text-muted-foreground text-sm">{t.statLabels.triples}:</span>
                    <span className="font-medium ml-2">{allTimeAggregateStats.triples || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="text-muted-foreground text-sm">{t.statLabels.HR}:</span>
                    <span className="font-medium ml-2">{allTimeAggregateStats.HR || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="text-muted-foreground text-sm">{t.statLabels.RBI}:</span>
                    <span className="font-medium ml-2">{allTimeAggregateStats.RBI || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="text-muted-foreground text-sm">{t.statLabels.R}:</span>
                    <span className="font-medium ml-2">{allTimeAggregateStats.R || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="text-muted-foreground text-sm">{t.statLabels.BB}:</span>
                    <span className="font-medium ml-2">{allTimeAggregateStats.BB || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="text-muted-foreground text-sm">{t.statLabels.K}:</span>
                    <span className="font-medium ml-2">{allTimeAggregateStats.K || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="text-muted-foreground text-sm">{t.statLabels.SB}:</span>
                    <span className="font-medium ml-2">{allTimeAggregateStats.SB || 0}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t">
                  <div className="stat-item">
                    <span className="text-muted-foreground text-sm">{t.avg.title}:</span>
                    <span className="font-medium ml-2">{calcAVG(allTimeAggregateStats)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="text-muted-foreground text-sm">{t.obp.title}:</span>
                    <span className="font-medium ml-2">{calcOBP(allTimeAggregateStats)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="text-muted-foreground text-sm">{t.slg.title}:</span>
                    <span className="font-medium ml-2">{calcSLG(allTimeAggregateStats)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="text-muted-foreground text-sm">{t.ops.title}:</span>
                    <span className="font-medium ml-2">{calcOPS(allTimeAggregateStats)}</span>
                  </div>
                </div>
              </div>
              
              {/* Pitching Stats */}
              <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
                <h4 className="font-bold text-md mb-2 flex items-center gap-2">
                  <span role="img" aria-label="pitching">⚾</span>
                  {t.pitchingTab}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div className="stat-item">
                    <span className="text-muted-foreground text-sm">{t.pitchingStatLabels.IP}:</span>
                    <span className="font-medium ml-2">{allTimeAggregatePitchingStats.IP || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="text-muted-foreground text-sm">{t.pitchingStatLabels.H}:</span>
                    <span className="font-medium ml-2">{allTimeAggregatePitchingStats.H || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="text-muted-foreground text-sm">{t.pitchingStatLabels.R}:</span>
                    <span className="font-medium ml-2">{allTimeAggregatePitchingStats.R || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="text-muted-foreground text-sm">{t.pitchingStatLabels.ER}:</span>
                    <span className="font-medium ml-2">{allTimeAggregatePitchingStats.ER || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="text-muted-foreground text-sm">{t.pitchingStatLabels.BB}:</span>
                    <span className="font-medium ml-2">{allTimeAggregatePitchingStats.BB || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="text-muted-foreground text-sm">{t.pitchingStatLabels.K}:</span>
                    <span className="font-medium ml-2">{allTimeAggregatePitchingStats.K || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="text-muted-foreground text-sm">{t.pitchingStatLabels.HBP}:</span>
                    <span className="font-medium ml-2">{allTimeAggregatePitchingStats.HBP || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="text-muted-foreground text-sm">{t.pitchingStatLabels.WP}:</span>
                    <span className="font-medium ml-2">{allTimeAggregatePitchingStats.WP || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="text-muted-foreground text-sm">{t.pitchingStatLabels.BK}:</span>
                    <span className="font-medium ml-2">{allTimeAggregatePitchingStats.BK || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="text-muted-foreground text-sm">{t.pitchingStatLabels.W}-{t.pitchingStatLabels.L}:</span>
                    <span className="font-medium ml-2">
                      {allTimeAggregatePitchingStats.W || 0}-{allTimeAggregatePitchingStats.L || 0}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="text-muted-foreground text-sm">{t.pitchingStatLabels.SV}:</span>
                    <span className="font-medium ml-2">{allTimeAggregatePitchingStats.SV || 0}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t">
                  <div className="stat-item">
                    <span className="text-muted-foreground text-sm">{t.era.title}:</span>
                    <span className="font-medium ml-2">{calcERA(allTimeAggregatePitchingStats)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="text-muted-foreground text-sm">{t.whip.title}:</span>
                    <span className="font-medium ml-2">{calcWHIP(allTimeAggregatePitchingStats)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="text-muted-foreground text-sm">{t.kbb.title}:</span>
                    <span className="font-medium ml-2">{calcKBB(allTimeAggregatePitchingStats)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="text-muted-foreground text-sm">{t.baa.title}:</span>
                    <span className="font-medium ml-2">{calcBAA(allTimeAggregatePitchingStats)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-4">
            <Button onClick={() => setShowTotalsDialog(false)}>
              {t.close}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
