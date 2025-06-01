
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Profile {
  id: string;
  name: string | null;
  position: string | null;
  team: string | null;
  photo_url: string | null;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
      } else {
        // Crear perfil si no existe
        const newProfile = {
          id: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario',
          position: null,
          team: null,
          photo_url: null
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
        } else {
          setProfile(createdProfile);
        }
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo actualizar el perfil",
        });
        return;
      }

      setProfile(data);
      toast({
        title: "Perfil actualizado",
        description: "Los cambios se guardaron correctamente",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el perfil",
      });
    }
  };

  const uploadPhoto = async (file: File): Promise<string | null> => {
    if (!user) return null;

    try {
      // Crear nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/profile.${fileExt}`;

      // Subir archivo a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo subir la foto",
        });
        return null;
      }

      // Obtener URL pública
      const { data } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo subir la foto",
      });
      return null;
    }
  };

  const deletePhoto = async () => {
    if (!user || !profile?.photo_url) return false;

    try {
      // Extraer el path del archivo de la URL
      const fileName = `${user.id}/profile.jpg`; // Asumimos extensión jpg por defecto
      
      // Eliminar archivo de Supabase Storage
      const { error: deleteError } = await supabase.storage
        .from('profile-photos')
        .remove([fileName]);

      if (deleteError) {
        console.error('Error deleting photo from storage:', deleteError);
      }

      // Actualizar perfil para remover la URL de la foto
      await updateProfile({ photo_url: null });
      
      return true;
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la foto",
      });
      return false;
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    uploadPhoto,
    deletePhoto,
    refetch: fetchProfile
  };
}
