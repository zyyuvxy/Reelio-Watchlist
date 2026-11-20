'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { Film, UserPlus, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const { user, register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    if (!name.trim()) {
      setErrorMessage('Nama lengkap wajib diisi');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Email wajib diisi');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registrasi gagal. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[75vh] px-2 sm:px-4">
      <div className="w-full max-w-md bg-white border-3 border-[#241B21] rounded-2xl p-6 sm:p-8 shadow-retro-lg ticket-border">
        {/* Ticket Header */}
        <div className="text-center pb-6 border-b-2 border-dashed border-[#241B21]">
          <div className="inline-flex p-3 bg-[#35C1C2] text-[#241B21] rounded-2xl border-2 border-[#241B21] shadow-retro-sm mb-3">
            <Film className="w-8 h-8" />
          </div>
          <h1 className="font-black text-2xl sm:text-3xl text-[#241B21]">Buat Akun Reelio</h1>
          <p className="text-xs sm:text-sm text-[#62535E] mt-1">
            Mulai arsipkan perjalanan sinematik pribadimu
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
            <label htmlFor="name" className="block text-xs font-black uppercase tracking-wider text-[#241B21]">
              Nama Lengkap
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Misal: Adimas Cinephile"
              className="w-full px-4 py-3 bg-[#FEFFE0] border-2 border-[#241B21] rounded-xl text-[#241B21] font-medium shadow-retro-sm focus:outline-none focus:ring-2 focus:ring-[#B5185F]"
            />
          </div>

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
              Kata Sandi (Min. 6 Karakter)
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

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="block text-xs font-black uppercase tracking-wider text-[#241B21]">
              Konfirmasi Kata Sandi
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              <span className="animate-pulse">Mendaftarkan Akun...</span>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Daftar Akun Baru
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="pt-4 border-t-2 border-dashed border-[#241B21] text-center">
          <p className="text-xs sm:text-sm text-[#62535E]">
            Sudah memiliki akun?{' '}
            <a
              href="/login"
              className="font-extrabold text-[#B5185F] underline hover:text-[#93124C]"
            >
              Masuk di sini
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
