
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
  date?: Date;
  startDate?: Date;
  endDate?: Date;
}

interface StatsFormProps {
  stats: StatsData;
  onStatsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateChange: (date: Date | undefined) => void;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  language: "en" | "es";
  translations: {
    es: {
      stats: string;
      statLabels: Record<string, string>;
      date: string;
      startDate: string;
      endDate: string;
      selectDate: string;
    };
    en: {
      stats: string;
      statLabels: Record<string, string>;
      date: string;
      startDate: string;
      endDate: string;
      selectDate: string;
    };
  };
}

export default function StatsForm({ 
  stats, 
  onStatsChange, 
  onDateChange, 
  onStartDateChange, 
  onEndDateChange, 
  language, 
  translations 
}: StatsFormProps) {
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
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center mb-6 justify-between gap-4 flex-wrap">
          <div className="grid grid-cols-1 gap-2 w-full md:w-auto">
            <Label htmlFor="date" className="font-medium text-primary block">
              {t.date}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full md:w-[240px] pl-3 text-left font-normal",
                    !stats.date && "text-muted-foreground"
                  )}
                >
                  {stats.date ? (
                    format(stats.date, "PPP", { locale: language === "es" ? es : undefined })
                  ) : (
                    <span>{t.selectDate}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={stats.date}
                  onSelect={onDateChange}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Date range filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full md:w-auto">
            <div>
              <Label htmlFor="startDate" className="font-medium text-primary block">
                {t.startDate}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="startDate"
                    variant="outline"
                    className={cn(
                      "w-full md:w-[180px] pl-3 text-left font-normal",
                      !stats.startDate && "text-muted-foreground"
                    )}
                  >
                    {stats.startDate ? (
                      format(stats.startDate, "PPP", { locale: language === "es" ? es : undefined })
                    ) : (
                      <span>{t.selectDate}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={stats.startDate}
                    onSelect={onStartDateChange}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="endDate" className="font-medium text-primary block">
                {t.endDate}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="endDate"
                    variant="outline"
                    className={cn(
                      "w-full md:w-[180px] pl-3 text-left font-normal",
                      !stats.endDate && "text-muted-foreground"
                    )}
                  >
                    {stats.endDate ? (
                      format(stats.endDate, "PPP", { locale: language === "es" ? es : undefined })
                    ) : (
                      <span>{t.selectDate}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={stats.endDate}
                    onSelect={onEndDateChange}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {Object.entries(stats)
            .filter(([key]) => !['date', 'startDate', 'endDate'].includes(key))
            .map(([key, value]) => (
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
        </div>
      </CardContent>
    </Card>
  );
}
