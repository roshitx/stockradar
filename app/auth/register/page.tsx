'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { signUpWithEmail } from '@/lib/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
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
    <div className="container flex items-center justify-center min-h-screen py-10">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Daftar di StockRadar</h1>
          <p className="text-muted-foreground">
            Buat akun untuk mulai pantau saham
          </p>
        </div>
        
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
        
        <p className="text-center text-sm text-muted-foreground">
          Sudah punya akun?{' '}
          <Link
            href="/auth/login"
            className="font-medium text-primary hover:underline"
          >
            Masuk
          </Link>
        </p>
      </div>
    </div>
  )
}
