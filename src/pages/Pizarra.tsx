import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";
import AdminLoginDialog from "@/components/AdminLoginDialog";
import PizarraImageUploader from "@/components/PizarraImageUploader";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const FETCH_TIMEOUT_MS = 10000;

const Pizarra = () => {
  const { isAdmin, loading } = useAuth();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

  const fetchLatestImage = async () => {
    setImageLoading(true);
    try {
      const fetchPromise = supabase.storage
        .from('pizarra')
        .list('', { limit: 1, sortBy: { column: 'created_at', order: 'desc' } });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), FETCH_TIMEOUT_MS)
      );

      const { data: files, error } = await Promise.race([fetchPromise, timeoutPromise]);

      if (error) throw error;

      if (files && files.length > 0) {
        const { data: urlData } = supabase.storage
          .from('pizarra')
          .getPublicUrl(files[0].name);
        setImageUrl(urlData.publicUrl);
      } else {
        setImageUrl('/pizarra1112.png');
      }
    } catch {
      setImageUrl('/pizarra1112.png');
    } finally {
      setImageLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestImage();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in">
              <div className="flex items-center justify-center gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Pizarra de Rosario
                </h1>
                <AdminLoginDialog />
              </div>
              <div className="w-24 h-1 bg-accent mx-auto mb-6 rounded-full" />
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Precios actualizados del mercado
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              {!loading && isAdmin && (
                <PizarraImageUploader
                  currentImageUrl={imageUrl}
                  onUploadSuccess={fetchLatestImage}
                />
              )}

              <div className="bg-muted/30 rounded-xl p-4 border border-border">
                <div className="w-full aspect-[9/16] bg-muted rounded-lg overflow-hidden">
                  {imageLoading ? (
                    <Skeleton className="w-full h-full" />
                  ) : imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Pizarra de Rosario — precios de cereales"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No hay imagen disponible
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default Pizarra;
