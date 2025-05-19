
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StatsData {
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
}

interface StatsFormProps {
  stats: StatsData;
  onStatsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function StatsForm({ stats, onStatsChange }: StatsFormProps) {
  const statLabels: Record<string, string> = {
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
  };

  return (
    <Card className="mb-6 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-0">
        <CardTitle className="text-xl font-bold text-center">Estadísticas Ofensivas</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 p-6">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="stat-card bg-white p-3 rounded-lg border shadow-sm">
            <Label htmlFor={key} className="font-medium text-primary block text-center">
              {statLabels[key] || key}
            </Label>
            <Input
              id={key}
              name={key}
              type="number"
              min="0"
              value={value}
              onChange={onStatsChange}
              className="mt-1 text-center"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
