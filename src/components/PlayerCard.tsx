
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
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
import { Trash2, Camera } from "lucide-react";

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
  const { profile, loading, updateProfile, uploadPhoto, removePhoto } = useProfile();
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (loading) {
    return (
      <Card className="mb-6 bg-white dark:bg-black shadow-md">
        <CardContent className="p-6 text-center">
          <div className="text-lg text-gray-900 dark:text-white">Cargando perfil...</div>
        </CardContent>
      </Card>
    );
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    await uploadPhoto(file);
    setIsUploading(false);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

  const handleRemovePhoto = async () => {
    await removePhoto();
  };

  return (
    <Card className="mb-6 bg-white dark:bg-black shadow-md hover:shadow-lg transition-shadow duration-300 border-gray-200 dark:border-gray-800">
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        <div className="flex flex-col items-center justify-center">
          <Label className="mb-2 text-lg font-medium text-gray-900 dark:text-white">{t.photo}</Label>
          <div className="relative mb-4 w-40 h-40">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
              <Avatar className="w-full h-full">
                <AvatarImage 
                  src={profile?.photo_url || ''} 
                  alt={profile?.name || 'Usuario'} 
                  className="object-cover w-full h-full"
                />
                <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-2xl">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="absolute -bottom-2 -right-2 flex gap-1">
              <Button
                variant="default"
                size="sm"
                className="rounded-full p-2 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </Button>
              
              {profile?.photo_url && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="rounded-full p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-gray-900 dark:text-white">
                        ¿Eliminar foto de perfil?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                        Esta acción no se puede deshacer. La foto de perfil será eliminada permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="text-gray-900 dark:text-white border-gray-200 dark:border-gray-700">
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleRemovePhoto}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
            {t.photoRecommendation}
          </p>
        </div>
        
        <div className="grid gap-4">
          <div>
            <Label htmlFor="name" className="text-lg font-medium text-gray-900 dark:text-white">{t.name}</Label>
            <Input 
              id="name"
              value={profile?.name || ''} 
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="mt-1 bg-white dark:bg-black border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              placeholder={t.name}
            />
          </div>
          <div>
            <Label htmlFor="position" className="text-lg font-medium text-gray-900 dark:text-white">{t.position}</Label>
            <Select value={profile?.position || ''} onValueChange={handlePositionSelect}>
              <SelectTrigger className="mt-1 bg-white dark:bg-black border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                <SelectValue placeholder={t.selectPosition || "Select position..."}>
                  {profile?.position && (
                    <div className="flex items-center gap-2">
                      <span>{getPositionEmoji(profile.position)}</span>
                      <span>{getPositionLabel(profile.position)}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-black border-gray-300 dark:border-gray-700">
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
              className="mt-1 bg-white dark:bg-black border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              placeholder={t.team}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
