import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PizarraImageUploaderProps {
  currentImageUrl: string | null;
  onUploadSuccess: () => void;
}

const validateFileSignature = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const bytes = new Uint8Array(e.target?.result as ArrayBuffer);
      const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47;
      const isJpeg = bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;
      resolve(isPng || isJpeg);
    };
    reader.onerror = () => resolve(false);
    reader.readAsArrayBuffer(file.slice(0, 4));
  });
};

const PizarraImageUploader = ({ currentImageUrl, onUploadSuccess }: PizarraImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Tipo de archivo inválido',
        description: 'Solo se permiten archivos PNG, JPG o JPEG',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Archivo muy grande',
        description: 'El archivo debe ser menor a 5MB',
        variant: 'destructive',
      });
      return;
    }

    const isValidImage = await validateFileSignature(file);
    if (!isValidImage) {
      toast({
        title: 'Archivo inválido',
        description: 'El contenido del archivo no corresponde a una imagen válida',
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'No hay archivo seleccionado',
        description: 'Por favor selecciona una imagen primero',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      const { data: existingFiles } = await supabase.storage
        .from('pizarra')
        .list();

      if (existingFiles && existingFiles.length > 0) {
        const filesToDelete = existingFiles.map(f => f.name);
        await supabase.storage.from('pizarra').remove(filesToDelete);
      }

      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `pizarra-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('pizarra')
        .upload(fileName, selectedFile, {
          cacheControl: '0',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      toast({
        title: 'Imagen actualizada',
        description: 'La pizarra se ha actualizado correctamente',
      });

      setPreviewUrl(null);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onUploadSuccess();
    } catch (error) {
      toast({
        title: 'Error al subir imagen',
        description: error instanceof Error ? error.message : 'Ocurrió un error al subir la imagen',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const cancelPreview = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <AlertCircle className="h-5 w-5" />
        <h3 className="font-semibold">Panel de Administración</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Imagen actual:</p>
          <div className="aspect-[9/16] max-h-64 bg-muted rounded-lg overflow-hidden">
            {currentImageUrl ? (
              <img
                src={currentImageUrl}
                alt="Pizarra actual"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Sin imagen
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            {previewUrl ? 'Vista previa:' : 'Nueva imagen:'}
          </p>
          <div className="aspect-[9/16] max-h-64 bg-muted rounded-lg overflow-hidden border-2 border-dashed border-border">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Vista previa"
                className="w-full h-full object-contain"
              />
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  Click para seleccionar
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  PNG, JPG (max 5MB)
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      </div>

      {previewUrl && (
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={cancelPreview} disabled={isUploading}>
            Cancelar
          </Button>
          <Button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Confirmar y Subir
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PizarraImageUploader;
