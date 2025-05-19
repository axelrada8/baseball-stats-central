
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
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
      RBI: number: 0,
      R: 0,
      BB: 0,
      K: 0,
      SB: 0,
    },
  });
  const { toast } = useToast();
  const [user, setUser] = useState<{ name?: string; email: string } | null>(null);

  useEffect(() => {
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
      title: "Estadísticas guardadas",
      description: "Tus estadísticas han sido guardadas correctamente.",
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
    <div className="max-w-7xl mx-auto p-4">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">⚾ Estadísticas de Béisbol</h1>
        <div className="flex items-center gap-4">
          <p className="text-muted-foreground">
            Hola, <span className="font-medium">{user?.name || user?.email}</span>
          </p>
          <Button variant="outline" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <PlayerCard player={player} onPlayerChange={handlePlayerChange} />
      
      <StatsForm stats={player.stats} onStatsChange={handleStatsChange} />

      <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">Estadísticas Avanzadas</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
          <div className="stat-card bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border shadow-sm text-center">
            <h2 className="text-lg font-bold text-blue-700">AVG</h2>
            <p className="text-3xl font-semibold">{calcAVG()}</p>
            <p className="text-sm text-muted-foreground mt-1">Promedio de Bateo</p>
          </div>
          <div className="stat-card bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border shadow-sm text-center">
            <h2 className="text-lg font-bold text-green-700">OBP</h2>
            <p className="text-3xl font-semibold">{calcOBP()}</p>
            <p className="text-sm text-muted-foreground mt-1">Porcentaje de Embasado</p>
          </div>
          <div className="stat-card bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border shadow-sm text-center">
            <h2 className="text-lg font-bold text-purple-700">SLG</h2>
            <p className="text-3xl font-semibold">{calcSLG()}</p>
            <p className="text-sm text-muted-foreground mt-1">Porcentaje de Slugging</p>
          </div>
          <div className="stat-card bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border shadow-sm text-center">
            <h2 className="text-lg font-bold text-red-700">OPS</h2>
            <p className="text-3xl font-semibold">{calcOPS()}</p>
            <p className="text-sm text-muted-foreground mt-1">On-base Plus Slugging</p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-center">
        <Button size="lg" onClick={saveStats} className="px-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          Guardar Estadísticas
        </Button>
      </div>
    </div>
  );
}
