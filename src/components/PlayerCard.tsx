
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "@/components/ui/dialog";

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
      movePhoto: string;
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
    };
  };
}

export default function PlayerCard({ player, onPlayerChange, language, translations }: PlayerCardProps) {
  const t = translations[language];
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [tempPhoto, setTempPhoto] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      
      // Create an image element to check dimensions
      const img = new Image();
      img.onload = function() {
        if (img.width < 500 || img.height < 500) {
          alert(`${t.photoRecommendation}`);
        }
        URL.revokeObjectURL(img.src);
      };
      img.src = url;
      
      setTempPhoto(url);
      setPosition({ x: 0, y: 0 });
      setZoom(100);
      setShowPhotoDialog(true); // Show dialog for adjustment
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
        dataset: {
          position: JSON.stringify(position),
          zoom: zoom.toString()
        }
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    onPlayerChange(photoEvent);
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isAdjusting) return;
    
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isAdjusting) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isAdjusting) return;
    
    // Allow more movement based on zoom level
    const maxOffset = zoom; // Scale the movement range with zoom
    const newX = Math.max(Math.min(e.clientX - dragStart.x, maxOffset), -maxOffset);
    const newY = Math.max(Math.min(e.clientY - dragStart.y, maxOffset), -maxOffset);
    
    setPosition({
      x: newX,
      y: newY
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !isAdjusting) return;
    
    const touch = e.touches[0];
    const maxOffset = zoom; // Scale the movement range with zoom
    const newX = Math.max(Math.min(touch.clientX - dragStart.x, maxOffset), -maxOffset);
    const newY = Math.max(Math.min(touch.clientY - dragStart.y, maxOffset), -maxOffset);
    
    setPosition({
      x: newX,
      y: newY
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    // Add global mouse up event listener to stop dragging even if mouse up outside component
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  // Enable adjusting when dialog is shown
  useEffect(() => {
    if (showPhotoDialog) {
      setIsAdjusting(true);
    }
  }, [showPhotoDialog]);

  return (
    <Card className="mb-6 bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        <div className="flex flex-col items-center justify-center">
          <Label className="mb-2 text-lg font-medium">{t.photo}</Label>
          <div className="relative mb-4 w-40 h-40">
            <div 
              className="w-40 h-40 rounded-full overflow-hidden player-photo"
              ref={imageRef}
            >
              <Avatar className="w-full h-full">
                <AvatarImage src={player.photo || ''} alt={player.name} />
                <AvatarFallback className="bg-primary/20 text-primary">
                  {player.name ? player.name.charAt(0).toUpperCase() : 'J'}
                </AvatarFallback>
              </Avatar>
            </div>
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
          
          <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogTitle>{t.adjustPhoto}</DialogTitle>
              <div className="flex flex-col items-center justify-center">
                <div 
                  className="w-64 h-64 rounded-full overflow-hidden player-photo photo-container"
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                  onMouseMove={handleMouseMove}
                  onTouchMove={handleTouchMove}
                  style={{ cursor: 'move' }}
                >
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
                    <Label htmlFor="zoom-slider" className="text-sm font-medium">
                      {t.zoom}: {zoom}%
                    </Label>
                    <Slider
                      id="zoom-slider"
                      min={100}
                      max={300}
                      step={5}
                      value={[zoom]}
                      onValueChange={handleZoomChange}
                      className="mt-2"
                    />
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    {t.movePhoto}
                  </p>
                </div>
              </div>
              <DialogFooter className="flex justify-between gap-2 mt-4">
                <Button variant="outline" onClick={cancelPhotoChanges}>{t.cancel}</Button>
                <Button onClick={applyPhotoChanges}>{t.apply}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
