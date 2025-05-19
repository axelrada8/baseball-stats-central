
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface PlayerData {
  name: string;
  position: string;
  team: string;
  photo: string | null;
}

interface PlayerCardProps {
  player: PlayerData;
  onPlayerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  language: "en" | "es";
  translations: {
    es: {
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
    };
    en: {
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
    };
  };
}

export default function PlayerCard({ player, onPlayerChange, language, translations }: PlayerCardProps) {
  const t = translations[language];
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [tempPhoto, setTempPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setTempPhoto(url);
      setIsAdjusting(true);
    } else {
      onPlayerChange(e);
    }
  };

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0]);
  };

  const applyPhotoChanges = () => {
    const photoEvent = {
      target: {
        name: "photo",
        value: tempPhoto,
        files: null,
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    onPlayerChange(photoEvent);
    setIsAdjusting(false);
  };

  const cancelPhotoChanges = () => {
    setIsAdjusting(false);
    setTempPhoto(null);
    setZoom(100);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="mb-6 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        <div className="flex flex-col items-center justify-center">
          <Label className="mb-2 text-lg font-medium">{t.photo}</Label>
          <div className="relative mb-4">
            <Avatar className="w-40 h-40 player-photo">
              {isAdjusting && tempPhoto ? (
                <div className="w-full h-full overflow-hidden">
                  <img 
                    src={tempPhoto} 
                    alt="Preview" 
                    className="object-cover w-full h-full"
                    style={{ transform: `scale(${zoom / 100})` }}
                  />
                </div>
              ) : (
                <>
                  <AvatarImage src={player.photo || ''} alt={player.name} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {player.name ? player.name.charAt(0).toUpperCase() : 'J'}
                  </AvatarFallback>
                </>
              )}
            </Avatar>
            <div className="absolute -bottom-2 -right-2">
              <div className="relative overflow-hidden bg-primary hover:bg-primary/80 text-white p-2 rounded-full cursor-pointer transition-colors">
                <Input 
                  ref={fileInputRef}
                  type="file" 
                  name="photo" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera">
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mt-1 text-center">
            {t.photoRecommendation}
          </p>
          
          {isAdjusting && (
            <div className="w-full max-w-xs mt-4 space-y-4">
              <div>
                <Label htmlFor="zoom-slider" className="text-sm font-medium">
                  {t.zoom}: {zoom}%
                </Label>
                <Slider
                  id="zoom-slider"
                  min={100}
                  max={200}
                  step={5}
                  value={[zoom]}
                  onValueChange={handleZoomChange}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2 justify-center mt-2">
                <Button size="sm" variant="outline" onClick={cancelPhotoChanges}>
                  {t.cancel}
                </Button>
                <Button size="sm" onClick={applyPhotoChanges}>
                  {t.apply}
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="name" className="text-lg font-medium">{t.name}</Label>
            <Input 
              id="name"
              name="name" 
              value={player.name} 
              onChange={onPlayerChange} 
              className="mt-1"
              placeholder={t.name}
            />
          </div>
          <div>
            <Label htmlFor="position" className="text-lg font-medium">{t.position}</Label>
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
            <Label htmlFor="team" className="text-lg font-medium">{t.team}</Label>
            <Input 
              id="team"
              name="team" 
              value={player.team} 
              onChange={onPlayerChange} 
              className="mt-1"
              placeholder={t.team}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
