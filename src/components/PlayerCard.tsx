
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PlayerData {
  name: string;
  position: string;
  team: string;
  photo: string | null;
}

interface PlayerCardProps {
  player: PlayerData;
  onPlayerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PlayerCard({ player, onPlayerChange }: PlayerCardProps) {
  return (
    <Card className="mb-6 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        <div className="flex flex-col items-center justify-center">
          <Label className="mb-2 text-lg font-medium">Foto del jugador</Label>
          <div className="relative mb-4">
            <Avatar className="w-40 h-40 player-photo">
              <AvatarImage src={player.photo || ''} alt={player.name} />
              <AvatarFallback className="bg-primary/20 text-primary">
                {player.name ? player.name.charAt(0).toUpperCase() : 'J'}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2">
              <div className="relative overflow-hidden bg-primary hover:bg-primary/80 text-white p-2 rounded-full cursor-pointer transition-colors">
                <Input 
                  type="file" 
                  name="photo" 
                  accept="image/*" 
                  onChange={onPlayerChange} 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera">
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="name" className="text-lg font-medium">Nombre</Label>
            <Input 
              id="name"
              name="name" 
              value={player.name} 
              onChange={onPlayerChange} 
              className="mt-1"
              placeholder="Nombre del jugador"
            />
          </div>
          <div>
            <Label htmlFor="position" className="text-lg font-medium">Posición</Label>
            <Input 
              id="position"
              name="position" 
              value={player.position} 
              onChange={onPlayerChange} 
              className="mt-1"
              placeholder="CF, 3B, SS, P, etc."
            />
          </div>
          <div>
            <Label htmlFor="team" className="text-lg font-medium">Equipo</Label>
            <Input 
              id="team"
              name="team" 
              value={player.team} 
              onChange={onPlayerChange} 
              className="mt-1"
              placeholder="Nombre del equipo"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
