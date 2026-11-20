'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { Film, LogIn, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const { user, login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Email dan password wajib diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login gagal. Periksa email dan password Anda.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[75vh] px-2 sm:px-4">
      <div className="w-full max-w-md bg-white border-3 border-[#241B21] rounded-2xl p-6 sm:p-8 shadow-retro-lg ticket-border">
        {/* Ticket Header */}
        <div className="text-center pb-6 border-b-2 border-dashed border-[#241B21]">
          <div className="inline-flex p-3 bg-[#B5185F] text-[#FEFFE0] rounded-2xl border-2 border-[#241B21] shadow-retro-sm mb-3">
            <Film className="w-8 h-8" />
          </div>
          <h1 className="font-black text-2xl sm:text-3xl text-[#241B21]">Masuk ke Reelio</h1>
          <p className="text-xs sm:text-sm text-[#62535E] mt-1">
            Kelola arsip tontonan film & serial personalmu
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="py-6 space-y-4">
          {errorMessage && (
            <div className="p-3.5 bg-[#B5185F]/15 border-2 border-[#B5185F] rounded-xl text-xs sm:text-sm font-bold text-[#B5185F]">
              {errorMessage}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-black uppercase tracking-wider text-[#241B21]">
              Email Pengguna
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full px-4 py-3 bg-[#FEFFE0] border-2 border-[#241B21] rounded-xl text-[#241B21] font-medium shadow-retro-sm focus:outline-none focus:ring-2 focus:ring-[#B5185F]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs font-black uppercase tracking-wider text-[#241B21]">
              Kata Sandi
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-[#FEFFE0] border-2 border-[#241B21] rounded-xl text-[#241B21] font-medium shadow-retro-sm focus:outline-none focus:ring-2 focus:ring-[#B5185F]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-6 font-extrabold text-sm sm:text-base text-[#FEFFE0] bg-[#B5185F] border-2 border-[#241B21] rounded-xl shadow-retro hover:bg-[#93124C] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Sedang Memproses...</span>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Masuk Sekarang
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="pt-4 border-t-2 border-dashed border-[#241B21] text-center">
          <p className="text-xs sm:text-sm text-[#62535E]">
            Belum punya akun?{' '}
            <a
              href="/register"
              className="font-extrabold text-[#B5185F] underline hover:text-[#93124C]"
            >
              Daftar di sini
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
