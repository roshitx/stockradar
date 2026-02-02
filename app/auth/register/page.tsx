'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { TrendingUp, Check } from 'lucide-react'
import { signUpWithEmail, signInWithGoogle } from '@/lib/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlassCard } from '@/components/ui/glass-card'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  async function handleGoogleSignIn() {
    setLoading(true)
    await signInWithGoogle()
  }
  
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    
    if (password !== confirmPassword) {
      toast.error('Password tidak cocok')
      setLoading(false)
      return
    }
    
    if (password.length < 6) {
      toast.error('Password minimal 6 karakter')
      setLoading(false)
      return
    }
    
    const result = await signUpWithEmail(email, password, name)
    
    if ('error' in result) {
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success('Akun berhasil dibuat!')
      router.push('/')
      router.refresh()
    }
  }
  
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden bg-slate-900">
        <Image 
          src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&q=80"
          alt="Trading dashboard"
          fill
          className="object-cover opacity-80"
          priority
        />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:40px_40px]" />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/20" />
        {/* Branding content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-8 lg:p-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-white">StockRadar</span>
          </div>
          {/* Tagline + Features */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white">Mulai pantau saham favoritmu</h2>
              <p className="mt-2 text-white/70">Buat akun gratis dan akses semua fitur</p>
            </div>
            {/* Feature checklist */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white/80">
                <div className="w-5 h-5 rounded-full bg-positive/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-positive" />
                </div>
                <span className="text-sm">Watchlist personal tanpa batas</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <div className="w-5 h-5 rounded-full bg-positive/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-positive" />
                </div>
                <span className="text-sm">Notifikasi harga real-time</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <div className="w-5 h-5 rounded-full bg-positive/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-positive" />
                </div>
                <span className="text-sm">Analisis portofolio lengkap</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-[40%] flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="w-full max-w-md animate-fade-in-up opacity-0">
          <GlassCard className="p-8" elevated>
            {/* Mobile logo - only visible on mobile */}
            <div className="lg:hidden flex justify-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">StockRadar</span>
              </div>
            </div>

            {/* Form header */}
            <div className="text-center space-y-2 mb-8">
              <h1 className="text-2xl font-bold tracking-tight">Daftar di StockRadar</h1>
              <p className="text-muted-foreground">Buat akun untuk mulai pantau saham</p>
            </div>

            {/* Google Sign-in Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Lanjutkan dengan Google
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Atau
                </span>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nama@email.com"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Ulangi password"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Mendaftar...' : 'Daftar'}
              </Button>
            </form>

            {/* Login link */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Sudah punya akun?{' '}
              <Link
                href="/auth/login"
                className="font-medium text-primary hover:underline"
              >
                Masuk
              </Link>
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
