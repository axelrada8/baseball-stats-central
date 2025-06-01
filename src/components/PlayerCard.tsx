
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select";
import { useProfile } from "@/hooks/useProfile";

interface PlayerCardProps {
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
      movePhoto: string;
      selectPosition: string;
      searchPosition: string;
      noPositionFound: string;
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
      movePhoto: string;
      selectPosition: string;
      searchPosition: string;
      noPositionFound: string;
    };
  };
}

const positions = [
  { value: "P", label: "Pitcher", emoji: "⚾" },
  { value: "C", label: "Catcher", emoji: "🧤" },
  { value: "1B", label: "First Base", emoji: "🥇" },
  { value: "2B", label: "Second Base", emoji: "🥈" },
  { value: "3B", label: "Third Base", emoji: "🥉" },
  { value: "SS", label: "Shortstop", emoji: "🔹" },
  { value: "LF", label: "Left Field", emoji: "🌿" },
  { value: "CF", label: "Center Field", emoji: "🎯" },
  { value: "RF", label: "Right Field", emoji: "🌟" },
  { value: "DH", label: "Designated Hitter", emoji: "🏏" },
  { value: "UTIL", label: "Utility", emoji: "🔧" },
];

export default function PlayerCard({ language, translations }: PlayerCardProps) {
  const t = translations[language];
  const { profile, loading, updateProfile, uploadPhoto } = useProfile();
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [tempPhoto, setTempPhoto] = useState<string | null>(null);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (loading) {
    return (
      <Card className="mb-6 bg-white dark:bg-gray-900 shadow-md">
        <CardContent className="p-6 text-center">
          <div className="text-lg">Cargando perfil...</div>
        </CardContent>
      </Card>
    );
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const photoUrl = await uploadPhoto(file);
    
    if (photoUrl) {
      setTempPhoto(photoUrl);
      setPosition({ x: 0, y: 0 });
      setZoom(100);
      setShowPhotoDialog(true);
    }
    
    setIsUploading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    updateProfile({ [field]: value });
  };

  const handlePositionSelect = (selectedPosition: string) => {
    updateProfile({ position: selectedPosition });
  };

  const getPositionLabel = (value: string) => {
    const position = positions.find(pos => pos.value === value);
    return position ? position.label : value;
  };

  const getPositionEmoji = (value: string) => {
    const position = positions.find(pos => pos.value === value);
    return position ? position.emoji : "";
  };

  const applyPhotoChanges = () => {
    setShowPhotoDialog(false);
    setIsAdjusting(false);
  };

  const cancelPhotoChanges = () => {
    setShowPhotoDialog(false);
    setIsAdjusting(false);
    setTempPhoto(null);
    setZoom(100);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Card className="mb-6 bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        <div className="flex flex-col items-center justify-center">
          <Label className="mb-2 text-lg font-medium text-gray-900 dark:text-white">{t.photo}</Label>
          <div className="relative mb-4 w-40 h-40">
            <div className="w-40 h-40 rounded-full overflow-hidden">
              <Avatar className="w-full h-full">
                <AvatarImage src={profile?.photo_url || ''} alt={profile?.name || 'Usuario'} />
                <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="absolute -bottom-2 -right-2">
              <Button
                variant="default"
                size="sm"
                className="rounded-full p-2 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                )}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
            {t.photoRecommendation}
          </p>
          
          <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogTitle className="text-gray-900 dark:text-white">{t.adjustPhoto}</DialogTitle>
              <div className="flex flex-col items-center justify-center">
                <div className="w-64 h-64 rounded-full overflow-hidden" style={{ cursor: 'move' }}>
                  {tempPhoto && (
                    <div className="w-full h-full overflow-hidden">
                      <img 
                        src={tempPhoto} 
                        alt="Preview" 
                        className="object-cover w-full h-full"
                        style={{ 
                          transform: `scale(${zoom / 100}) translate(${position.x / (zoom / 50)}px, ${position.y / (zoom / 50)}px)`,
                          transformOrigin: 'center'
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div className="w-full max-w-xs mt-6 space-y-4">
                  <div>
                    <Label htmlFor="zoom-slider" className="text-sm font-medium text-gray-900 dark:text-white">
                      {t.zoom}: {zoom}%
                    </Label>
                    <Slider
                      id="zoom-slider"
                      min={100}
                      max={300}
                      step={5}
                      value={[zoom]}
                      onValueChange={(value) => setZoom(value[0])}
                      className="mt-2"
                    />
                  </div>
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                    {t.movePhoto}
                  </p>
                </div>
              </div>
              <DialogFooter className="flex justify-between gap-2 mt-4">
                <Button variant="outline" onClick={cancelPhotoChanges}>{t.cancel}</Button>
                <Button onClick={applyPhotoChanges} className="bg-green-600 hover:bg-green-700 text-white">{t.apply}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid gap-4">
          <div>
            <Label htmlFor="name" className="text-lg font-medium text-gray-900 dark:text-white">{t.name}</Label>
            <Input 
              id="name"
              value={profile?.name || ''} 
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              placeholder={t.name}
            />
          </div>
          <div>
            <Label htmlFor="position" className="text-lg font-medium text-gray-900 dark:text-white">{t.position}</Label>
            <Select value={profile?.position || ''} onValueChange={handlePositionSelect}>
              <SelectTrigger className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                <SelectValue placeholder={t.selectPosition || "Select position..."}>
                  {profile?.position && (
                    <div className="flex items-center gap-2">
                      <span>{getPositionEmoji(profile.position)}</span>
                      <span>{getPositionLabel(profile.position)}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                <SelectGroup>
                  <SelectLabel className="text-gray-900 dark:text-white">{t.position}</SelectLabel>
                  {positions.map((pos) => (
                    <SelectItem key={pos.value} value={pos.value} className="text-gray-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <span>{pos.emoji}</span>
                        <span>{pos.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="team" className="text-lg font-medium text-gray-900 dark:text-white">{t.team}</Label>
            <Input 
              id="team"
              value={profile?.team || ''} 
              onChange={(e) => handleInputChange('team', e.target.value)}
              className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              placeholder={t.team}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
