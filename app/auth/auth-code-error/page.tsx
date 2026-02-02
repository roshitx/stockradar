import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function AuthCodeError() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <GlassCard elevated className="p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="p-4 rounded-full bg-negative/10">
              <AlertCircle className="w-10 h-10 text-negative" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold mb-3">Autentikasi Gagal</h1>
          
          <p className="text-muted-foreground mb-8">
            Terjadi kesalahan saat login dengan Google. Silakan coba lagi.
          </p>

          <div className="space-y-4">
            <Button asChild className="w-full" size="lg">
              <Link href="/auth/login">Kembali ke Login</Link>
            </Button>
            
            <Button variant="ghost" asChild className="w-full">
              <Link href="/">Kembali ke Beranda</Link>
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
