'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../lib/auth-context';
import { api } from '../../../../lib/api';
import { WatchlistItem, CreateWatchlistPayload } from '../../../../lib/types';
import { WatchlistForm } from '../../../../components/WatchlistForm';
import { ArrowLeft, Edit3, AlertCircle, RefreshCw } from 'lucide-react';

export default function EditTontonanPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [item, setItem] = useState<WatchlistItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItem = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getWatchlistItem(id);
      setItem(data);
    } catch (err: any) {
      setError(err.message || 'Tontonan tidak ditemukan atau akses ditolak');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
      return;
    }

    if (user && id) {
      fetchItem();
    }
  }, [user, authLoading, id, router, fetchItem]);

  const handleSubmit = async (payload: CreateWatchlistPayload) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await api.updateWatchlistItem(id, payload);
      router.push(`/watchlist/${id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="h-6 w-32 bg-[#E7DDE2] rounded animate-pulse" />
        <div className="h-96 bg-white border-2 border-[#241B21] rounded-2xl ticket-border-sm animate-pulse" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-white border-3 border-[#B5185F] rounded-2xl p-8 ticket-border text-center space-y-4">
        <div className="w-16 h-16 bg-[#B5185F]/15 border-2 border-[#B5185F] rounded-2xl flex items-center justify-center mx-auto text-[#B5185F]">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="font-black text-2xl text-[#241B21]">Gagal Memuat Data</h2>
        <p className="text-sm text-[#62535E]">
          {error || 'Data tontonan tidak dapat diakses untuk diedit.'}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={fetchItem}
            className="px-5 py-2.5 font-bold text-sm bg-white border-2 border-[#241B21] rounded-xl ticket-border-sm hover:bg-[#E7DDE2]"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Coba Lagi
          </button>
          <a
            href="/watchlist"
            className="px-5 py-2.5 font-extrabold text-sm text-[#FEFFE0] bg-[#B5185F] border-2 border-[#241B21] rounded-xl shadow-retro hover:bg-[#93124C]"
          >
            Kembali ke Watchlist
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Back button */}
      <div>
        <a
          href={`/watchlist/${item.id}`}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#241B21] hover:text-[#B5185F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Detail Tontonan
        </a>
      </div>

      {/* Main Form Card */}
      <div className="bg-white border-3 border-[#241B21] rounded-2xl p-6 sm:p-8 ticket-border">
        <div className="flex items-center gap-3 pb-6 mb-6 border-b-2 border-dashed border-[#241B21]">
          <div className="p-3 bg-[#35C1C2] text-[#241B21] rounded-2xl border-2 border-[#241B21] shadow-retro-sm">
            <Edit3 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-black text-2xl sm:text-3xl text-[#241B21]">
              Edit Tontonan
            </h1>
            <p className="text-xs sm:text-sm text-[#62535E]">
              Perbarui status, rating, atau catatan untuk &ldquo;{item.title}&rdquo;
            </p>
          </div>
        </div>

        <WatchlistForm
          initialData={item}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          buttonLabel="Perbarui Tontonan"
        />
      </div>
    </div>
  );
}
