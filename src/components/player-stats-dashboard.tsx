
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "./theme-provider"
import { Save, Edit3, Camera, Plus, RotateCcw, FileDown, BarChart3, Calendar, Target } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TotalsModal } from "./totals-modals"

interface PlayerStats {
  name: string
  position: string
  team: string
  photo?: string
  // Daily stats
  games: number
  atBats: number
  runs: number
  hits: number
  doubles: number
  triples: number
  homeRuns: number
  rbi: number
  stolenBases: number
  caughtStealing: number
  walks: number
  strikeouts: number
  // Advanced metrics (calculated)
  battingAverage: number
  onBasePercentage: number
  sluggingPercentage: number
  ops: number
}

interface PitchingStats {
  inningsPitched: number
  hitsAllowed: number
  runsAllowed: number
  earnedRuns: number
  walksAllowed: number
  strikeoutsPitched: number
  hitBatters: number
  wildPitches: number
  balks: number
  wins: number
  losses: number
  saves: number
  era: number
  whip: number
  kbb: number
  baa: number
}

const translations = {
  en: {
    playerStats: "Baseball Statistics",
    playerInfo: "Player Information",
    batting: "Batting",
    pitching: "Pitching",
    offensiveStats: "Offensive Statistics",
    advancedMetrics: "Advanced Statistics",
    addData: "Add Data",
    dailyData: "Daily Data",
    name: "Name",
    position: "Position",
    team: "Team",
    photo: "Photo",
    date: "Date",
    selectPosition: "Select position...",
    recommendedSize: "Recommended minimum size: 500x500 pixels",
    // Stats with abbreviations
    games: "G",
    atBats: "AB",
    runs: "R",
    hits: "H",
    doubles: "2B",
    triples: "3B",
    homeRuns: "HR",
    rbi: "RBI",
    stolenBases: "SB",
    caughtStealing: "CS",
    walks: "BB",
    strikeouts: "K",
    // Full names for tooltips
    gamesPlayed: "Games Played",
    atBatsLong: "At Bats",
    runsLong: "Runs",
    hitsLong: "Hits",
    doublesLong: "Doubles",
    triplesLong: "Triples",
    homeRunsLong: "Home Runs",
    rbiLong: "Runs Batted In",
    stolenBasesLong: "Stolen Bases",
    caughtStealingLong: "Caught Stealing",
    walksLong: "Walks",
    strikeoutsLong: "Strikeouts",
    // Advanced metrics
    battingAverage: "AVG",
    onBasePercentage: "OBP",
    sluggingPercentage: "SLG",
    ops: "OPS",
    battingAverageLong: "Batting Average",
    onBasePercentageLong: "On-Base Percentage",
    sluggingPercentageLong: "Slugging Percentage",
    opsLong: "On-base Plus Slugging",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    addStats: "Add Stats",
    resetData: "Reset Data",
    exportPDF: "Export to PDF",
    viewTotals: "View Totals",
    doublesTripleHRNote:
      "Doubles, triples and home runs also count as hits. Statistics calculated according to MLB standards.",
    pitchingStats: "Pitching Statistics",
    inningsPitched: "IP",
    hitsAllowed: "H",
    runsAllowed: "R",
    earnedRuns: "ER",
    walksAllowed: "BB",
    strikeoutsPitched: "K",
    hitBatters: "HBP",
    wildPitches: "WP",
    balks: "BK",
    wins: "W",
    losses: "L",
    saves: "SV",
    era: "ERA",
    whip: "WHIP",
    kbb: "K/BB",
    baa: "BAA",
    inningsPitchedLong: "Innings Pitched",
    hitsAllowedLong: "Hits Allowed",
    runsAllowedLong: "Runs Allowed",
    earnedRunsLong: "Earned Runs",
    walksAllowedLong: "Walks Allowed",
    strikeoutsPitchedLong: "Strikeouts",
    hitBattersLong: "Hit by Pitch",
    wildPitchesLong: "Wild Pitches",
    balksLong: "Balks",
    winsLong: "Wins",
    lossesLong: "Losses",
    savesLong: "Saves",
    eraLong: "Earned Run Average",
    whipLong: "Walks + Hits per Innings Pitched",
    kbbLong: "Strikeout to Walk Ratio",
    baaLong: "Batting Average Against",
  },
  es: {
    playerStats: "Estadísticas de Béisbol",
    playerInfo: "Información del Jugador",
    batting: "Bateo",
    pitching: "Pitcheo",
    offensiveStats: "Estadísticas Ofensivas",
    advancedMetrics: "Estadísticas Avanzadas",
    addData: "Agregar Datos",
    dailyData: "Datos del Día",
    name: "Nombre",
    position: "Posición",
    team: "Equipo",
    photo: "Foto",
    date: "Fecha",
    selectPosition: "Seleccionar posición...",
    recommendedSize: "Tamaño mínimo recomendado: 500x500 píxeles",
    // Stats with abbreviations
    games: "J",
    atBats: "AB",
    runs: "C",
    hits: "H",
    doubles: "2B",
    triples: "3B",
    homeRuns: "HR",
    rbi: "CI",
    stolenBases: "BR",
    caughtStealing: "AR",
    walks: "BB",
    strikeouts: "K",
    // Full names for tooltips
    gamesPlayed: "Juegos Jugados",
    atBatsLong: "Veces al Bate",
    runsLong: "Carreras",
    hitsLong: "Hits",
    doublesLong: "Dobles",
    triplesLong: "Triples",
    homeRunsLong: "Jonrones",
    rbiLong: "Carreras Impulsadas",
    stolenBasesLong: "Bases Robadas",
    caughtStealingLong: "Atrapado Robando",
    walksLong: "Bases por Bola",
    strikeoutsLong: "Ponches",
    // Advanced metrics
    battingAverage: "AVG",
    onBasePercentage: "OBP",
    sluggingPercentage: "SLG",
    ops: "OPS",
    battingAverageLong: "Promedio de Bateo",
    onBasePercentageLong: "Porcentaje de Embasado",
    sluggingPercentageLong: "Porcentaje de Slugging",
    opsLong: "On-base Plus Slugging",
    edit: "Editar",
    save: "Guardar",
    cancel: "Cancelar",
    addStats: "Agregar Datos",
    resetData: "Reiniciar Datos",
    exportPDF: "Exportar a PDF",
    viewTotals: "Ver Totales",
    doublesTripleHRNote:
      "Los dobles, triples y jonrones también cuentan como hits. Estadísticas calculadas según estándares MLB.",
    pitchingStats: "Estadísticas de Pitcheo",
    inningsPitched: "EL",
    hitsAllowed: "H",
    runsAllowed: "CP",
    earnedRuns: "CL",
    walksAllowed: "BB",
    strikeoutsPitched: "K",
    hitBatters: "GP",
    wildPitches: "WP",
    balks: "BK",
    wins: "V",
    losses: "D",
    saves: "S",
    era: "ERA",
    whip: "WHIP",
    kbb: "K/BB",
    baa: "BAA",
    inningsPitchedLong: "Entradas Lanzadas",
    hitsAllowedLong: "Hits Permitidos",
    runsAllowedLong: "Carreras Permitidas",
    earnedRunsLong: "Carreras Limpias",
    walksAllowedLong: "Bases por Bola",
    strikeoutsPitchedLong: "Ponches",
    hitBattersLong: "Golpeados",
    wildPitchesLong: "Wild Pitches",
    balksLong: "Balks",
    winsLong: "Victorias",
    lossesLong: "Derrotas",
    savesLong: "Salvados",
    eraLong: "Promedio de Carreras Limpias",
    whipLong: "Walks + Hits por Entradas Lanzadas",
    kbbLong: "Ratio de Ponches a Bases por Bola",
    baaLong: "Promedio de Bateo en Contra",
  },
}

const positions = [
  { value: "C", label: "C - Catcher" },
  { value: "1B", label: "1B - First Base" },
  { value: "2B", label: "2B - Second Base" },
  { value: "3B", label: "3B - Third Base" },
  { value: "SS", label: "SS - Shortstop" },
  { value: "LF", label: "LF - Left Field" },
  { value: "CF", label: "CF - Center Field" },
  { value: "RF", label: "RF - Right Field" },
  { value: "P", label: "P - Pitcher" },
  { value: "DH", label: "DH - Designated Hitter" },
]

export function PlayerStatsDashboard() {
  const { language } = useTheme()
  const t = translations[language]
  const [isEditing, setIsEditing] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  const [playerInfo, setPlayerInfo] = useState({
    name: "",
    position: "",
    team: "",
    photo: "",
  })

  const [dailyStats, setDailyStats] = useState<PlayerStats>({
    name: "",
    position: "",
    team: "",
    games: 0,
    atBats: 0,
    runs: 0,
    hits: 0,
    doubles: 0,
    triples: 0,
    homeRuns: 0,
    rbi: 0,
    stolenBases: 0,
    caughtStealing: 0,
    walks: 0,
    strikeouts: 0,
    battingAverage: 0,
    onBasePercentage: 0,
    sluggingPercentage: 0,
    ops: 0,
  })

  const [pitchingStats, setPitchingStats] = useState<PitchingStats>({
    inningsPitched: 0,
    hitsAllowed: 0,
    runsAllowed: 0,
    earnedRuns: 0,
    walksAllowed: 0,
    strikeoutsPitched: 0,
    hitBatters: 0,
    wildPitches: 0,
    balks: 0,
    wins: 0,
    losses: 0,
    saves: 0,
    era: 0,
    whip: 0,
    kbb: 0,
    baa: 0,
  })

  const [showTotalsModal, setShowTotalsModal] = useState(false)
  const [isPitchingEditing, setIsPitchingEditing] = useState(false)

  const calculateAdvancedStats = (stats: PlayerStats) => {
    const avg = stats.atBats > 0 ? stats.hits / stats.atBats : 0
    const obp = stats.atBats + stats.walks > 0 ? (stats.hits + stats.walks) / (stats.atBats + stats.walks) : 0
    const totalBases = stats.hits + stats.doubles + stats.triples * 2 + stats.homeRuns * 3
    const slg = stats.atBats > 0 ? totalBases / stats.atBats : 0

    return {
      battingAverage: Number(avg.toFixed(3)),
      onBasePercentage: Number(obp.toFixed(3)),
      sluggingPercentage: Number(slg.toFixed(3)),
      ops: Number((obp + slg).toFixed(3)),
    }
  }

  const calculatePitchingStats = (stats: PitchingStats) => {
    const era = stats.inningsPitched > 0 ? (stats.earnedRuns * 9) / stats.inningsPitched : 0
    const whip = stats.inningsPitched > 0 ? (stats.hitsAllowed + stats.walksAllowed) / stats.inningsPitched : 0
    const kbb = stats.walksAllowed > 0 ? stats.strikeoutsPitched / stats.walksAllowed : 0
    const baa = stats.hitsAllowed > 0 && stats.inningsPitched > 0 ? stats.hitsAllowed / (stats.inningsPitched * 3) : 0

    return {
      era: Number(era.toFixed(2)),
      whip: Number(whip.toFixed(2)),
      kbb: Number(kbb.toFixed(2)),
      baa: Number(baa.toFixed(3)),
    }
  }

  const handleSave = () => {
    const advanced = calculateAdvancedStats(dailyStats)
    setDailyStats((prev) => ({ ...prev, ...advanced }))
    setIsEditing(false)
  }

  const handlePitchingSave = () => {
    const advanced = calculatePitchingStats(pitchingStats)
    setPitchingStats((prev) => ({ ...prev, ...advanced }))
    setIsPitchingEditing(false)
  }

  const handleInputChange = (field: keyof PlayerStats, value: string | number) => {
    setDailyStats((prev) => ({ ...prev, [field]: value }))
  }

  const handlePitchingInputChange = (field: keyof PitchingStats, value: number) => {
    setPitchingStats((prev) => ({ ...prev, [field]: value }))
  }

  const handlePlayerInfoChange = (field: string, value: string) => {
    setPlayerInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleReset = () => {
    setDailyStats({
      name: "",
      position: "",
      team: "",
      games: 0,
      atBats: 0,
      runs: 0,
      hits: 0,
      doubles: 0,
      triples: 0,
      homeRuns: 0,
      rbi: 0,
      stolenBases: 0,
      caughtStealing: 0,
      walks: 0,
      strikeouts: 0,
      battingAverage: 0,
      onBasePercentage: 0,
      sluggingPercentage: 0,
      ops: 0,
    })
  }

  const statsConfig = [
    { key: "atBats", label: t.atBats, fullName: t.atBatsLong },
    { key: "hits", label: t.hits, fullName: t.hitsLong },
    { key: "doubles", label: t.doubles, fullName: t.doublesLong },
    { key: "triples", label: t.triples, fullName: t.triplesLong },
    { key: "homeRuns", label: t.homeRuns, fullName: t.homeRunsLong },
    { key: "rbi", label: t.rbi, fullName: t.rbiLong },
    { key: "runs", label: t.runs, fullName: t.runsLong },
    { key: "walks", label: t.walks, fullName: t.walksLong },
    { key: "strikeouts", label: t.strikeouts, fullName: t.strikeoutsLong },
    { key: "stolenBases", label: t.stolenBases, fullName: t.stolenBasesLong },
  ]

  const pitchingStatsConfig = [
    { key: "inningsPitched", label: t.inningsPitched, fullName: t.inningsPitchedLong },
    { key: "hitsAllowed", label: t.hitsAllowed, fullName: t.hitsAllowedLong },
    { key: "runsAllowed", label: t.runsAllowed, fullName: t.runsAllowedLong },
    { key: "earnedRuns", label: t.earnedRuns, fullName: t.earnedRunsLong },
    { key: "walksAllowed", label: t.walksAllowed, fullName: t.walksAllowedLong },
    { key: "strikeoutsPitched", label: t.strikeoutsPitched, fullName: t.strikeoutsPitchedLong },
    { key: "hitBatters", label: t.hitBatters, fullName: t.hitBattersLong },
    { key: "wildPitches", label: t.wildPitches, fullName: t.wildPitchesLong },
    { key: "balks", label: t.balks, fullName: t.balksLong },
    { key: "wins", label: t.wins, fullName: t.winsLong },
    { key: "losses", label: t.losses, fullName: t.lossesLong },
    { key: "saves", label: t.saves, fullName: t.savesLong },
  ]

  const advancedStats = calculateAdvancedStats(dailyStats)

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      {/* Player Profile Section */}
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Photo Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={playerInfo.photo || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl bg-muted">
                    {playerInfo.name ? playerInfo.name.charAt(0).toUpperCase() : "J"}
                  </AvatarFallback>
                </Avatar>
                <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">{t.photo}</p>
                <p className="text-xs text-muted-foreground">{t.recommendedSize}</p>
              </div>
            </div>

            {/* Player Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="playerName">{t.name}</Label>
                  <Input
                    id="playerName"
                    value={playerInfo.name}
                    onChange={(e) => handlePlayerInfoChange("name", e.target.value)}
                    placeholder="Jheyluis Reyes"
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">{t.position}</Label>
                  <Select
                    value={playerInfo.position}
                    onValueChange={(value) => handlePlayerInfoChange("position", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.selectPosition} />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((pos) => (
                        <SelectItem key={pos.value} value={pos.value}>
                          {pos.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="team">{t.team}</Label>
                <Input
                  id="team"
                  value={playerInfo.team}
                  onChange={(e) => handlePlayerInfoChange("team", e.target.value)}
                  placeholder="Equipo"
                  className="text-lg"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Tabs */}
      <Tabs defaultValue="batting" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="batting" className="flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            {t.batting}
          </TabsTrigger>
          <TabsTrigger value="pitching" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {t.pitching}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="batting" className="space-y-6">
          {/* Offensive Stats Section */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Edit3 className="h-5 w-5" />
                    {t.offensiveStats}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{t.doublesTripleHRNote}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {t.addData}
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    {t.dailyData}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date Picker */}
              <div className="flex items-center gap-4">
                <Label htmlFor="date" className="text-sm font-medium">
                  {t.date}
                </Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-auto"
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {statsConfig.map(({ key, label, fullName }) => (
                  <div key={key} className="text-center space-y-2">
                    <div className="text-sm font-medium text-primary">{label}</div>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={dailyStats[key as keyof PlayerStats]}
                        onChange={(e) => handleInputChange(key as keyof PlayerStats, Number(e.target.value))}
                        className="text-center text-lg font-semibold"
                        min="0"
                      />
                    ) : (
                      <div className="text-2xl font-bold">{dailyStats[key as keyof PlayerStats]}</div>
                    )}
                    <div className="text-xs text-muted-foreground">{fullName}</div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 pt-4">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {t.addStats}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      {t.cancel}
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4" />
                    {t.resetData}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Advanced Stats Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">{t.advancedMetrics}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg text-center">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">{t.battingAverage}</div>
                  <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                    {advancedStats.battingAverage.toFixed(3)}
                  </div>
                  <div className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">{t.battingAverageLong}</div>
                </div>

                <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-lg text-center">
                  <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                    {t.onBasePercentage}
                  </div>
                  <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {advancedStats.onBasePercentage.toFixed(3)}
                  </div>
                  <div className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">{t.onBasePercentageLong}</div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-950/20 p-6 rounded-lg text-center">
                  <div className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-2">
                    {t.sluggingPercentage}
                  </div>
                  <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                    {advancedStats.sluggingPercentage.toFixed(3)}
                  </div>
                  <div className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">
                    {t.sluggingPercentageLong}
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-950/20 p-6 rounded-lg text-center">
                  <div className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-2">{t.ops}</div>
                  <div className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                    {advancedStats.ops.toFixed(3)}
                  </div>
                  <div className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-1">{t.opsLong}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Buttons */}
          <div className="flex justify-center gap-4">
            <Button variant="destructive" className="flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              {t.exportPDF}
            </Button>
            <Button onClick={() => setShowTotalsModal(true)} className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {t.viewTotals}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="pitching" className="space-y-6">
          {/* Pitching Stats Section */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {t.pitchingStats}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPitchingEditing(!isPitchingEditing)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {t.addData}
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    {t.dailyData}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date Picker */}
              <div className="flex items-center gap-4">
                <Label htmlFor="pitching-date" className="text-sm font-medium">
                  {t.date}
                </Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="pitching-date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-auto"
                  />
                </div>
              </div>

              {/* Left side stats grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="grid grid-cols-1 gap-4">
                  {pitchingStatsConfig.slice(0, 6).map(({ key, label, fullName }) => (
                    <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="text-sm font-medium">{fullName}</div>
                      {isPitchingEditing ? (
                        <Input
                          type="number"
                          value={pitchingStats[key as keyof PitchingStats]}
                          onChange={(e) =>
                            handlePitchingInputChange(key as keyof PitchingStats, Number(e.target.value))
                          }
                          className="w-20 text-center"
                          min="0"
                          step={key === "inningsPitched" ? "0.1" : "1"}
                        />
                      ) : (
                        <div className="text-lg font-semibold w-20 text-center">
                          {pitchingStats[key as keyof PitchingStats]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Right side stats grid */}
                <div className="grid grid-cols-1 gap-4">
                  {pitchingStatsConfig.slice(6).map(({ key, label, fullName }) => (
                    <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="text-sm font-medium">{fullName}</div>
                      {isPitchingEditing ? (
                        <Input
                          type="number"
                          value={pitchingStats[key as keyof PitchingStats]}
                          onChange={(e) =>
                            handlePitchingInputChange(key as keyof PitchingStats, Number(e.target.value))
                          }
                          className="w-20 text-center"
                          min="0"
                        />
                      ) : (
                        <div className="text-lg font-semibold w-20 text-center">
                          {pitchingStats[key as keyof PitchingStats]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 pt-4">
                {isPitchingEditing ? (
                  <>
                    <Button onClick={handlePitchingSave} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {t.addStats}
                    </Button>
                    <Button variant="outline" onClick={() => setIsPitchingEditing(false)}>
                      {t.cancel}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      {t.dailyData}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        setPitchingStats({
                          inningsPitched: 0,
                          hitsAllowed: 0,
                          runsAllowed: 0,
                          earnedRuns: 0,
                          walksAllowed: 0,
                          strikeoutsPitched: 0,
                          hitBatters: 0,
                          wildPitches: 0,
                          balks: 0,
                          wins: 0,
                          losses: 0,
                          saves: 0,
                          era: 0,
                          whip: 0,
                          kbb: 0,
                          baa: 0,
                        })
                      }
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      {t.resetData}
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pitching Advanced Stats Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">{t.advancedMetrics}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg text-center">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">{t.era}</div>
                  <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                    {calculatePitchingStats(pitchingStats).era.toFixed(2)}
                  </div>
                  <div className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">{t.eraLong}</div>
                </div>

                <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-lg text-center">
                  <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">{t.whip}</div>
                  <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {calculatePitchingStats(pitchingStats).whip.toFixed(2)}
                  </div>
                  <div className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">{t.whipLong}</div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-950/20 p-6 rounded-lg text-center">
                  <div className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-2">{t.kbb}</div>
                  <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                    {calculatePitchingStats(pitchingStats).kbb.toFixed(2)}
                  </div>
                  <div className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">{t.kbbLong}</div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-950/20 p-6 rounded-lg text-center">
                  <div className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-2">{t.baa}</div>
                  <div className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                    {calculatePitchingStats(pitchingStats).baa.toFixed(3)}
                  </div>
                  <div className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-1">{t.baaLong}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Buttons */}
          <div className="flex justify-center gap-4">
            <Button variant="destructive" className="flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              {t.exportPDF}
            </Button>
            <Button onClick={() => setShowTotalsModal(true)} className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {t.viewTotals}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      <TotalsModal
        isOpen={showTotalsModal}
        onClose={() => setShowTotalsModal(false)}
        data={dailyStats}
      />
    </div>
  )
}

export type { PlayerStats }
export type { PitchingStats }
