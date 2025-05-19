
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
  language: "en" | "es";
  translations: {
    es: {
      stats: string;
      statLabels: Record<string, string>;
    };
    en: {
      stats: string;
      statLabels: Record<string, string>;
    };
  };
}

export default function StatsForm({ stats, onStatsChange, language, translations }: StatsFormProps) {
  const t = translations[language];
  
  // Abbreviated stat labels for display
  const statAbbreviations: Record<string, string> = {
    AB: "AB",
    H: "H",
    doubles: "2B",
    triples: "3B",
    HR: "HR",
    RBI: "RBI",
    R: "R",
    BB: "BB",
    K: "K",
    SB: "SB"
  };

  return (
    <Card className="mb-6 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-0">
        <CardTitle className="text-xl font-bold text-center">{t.stats}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 p-6">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="stat-card bg-white dark:bg-gray-700 p-3 rounded-lg border shadow-sm">
            <Label htmlFor={key} className="font-medium text-primary block text-center">
              {statAbbreviations[key]}
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
            <p className="text-xs text-muted-foreground mt-1 text-center">{t.statLabels[key]}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
