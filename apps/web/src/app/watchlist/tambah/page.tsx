'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { CreateWatchlistPayload } from '../../../lib/types';
import { WatchlistForm } from '../../../components/WatchlistForm';
import { ArrowLeft, Clapperboard } from 'lucide-react';

export default function TambahTontonanPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (payload: CreateWatchlistPayload) => {
    setIsSubmitting(true);
    try {
      const res = await api.createWatchlistItem(payload);
      router.push(`/watchlist/${res.data.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Back button */}
      <div>
        <a
          href="/watchlist"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#241B21] hover:text-[#B5185F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Watchlist
        </a>
      </div>

      {/* Main card */}
      <div className="bg-white border-3 border-[#241B21] rounded-2xl p-6 sm:p-8 ticket-border">
        <div className="flex items-center gap-3 pb-6 mb-6 border-b-2 border-dashed border-[#241B21]">
          <div className="p-3 bg-[#B5185F] text-[#FEFFE0] rounded-2xl border-2 border-[#241B21] shadow-retro-sm">
            <Clapperboard className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-black text-2xl sm:text-3xl text-[#241B21]">
              Tambah Tontonan Baru
            </h1>
            <p className="text-xs sm:text-sm text-[#62535E]">
              Masukkan detail film atau serial yang ingin kamu simpan
            </p>
          </div>
        </div>

        <WatchlistForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          buttonLabel="Simpan ke Watchlist"
        />
      </div>
    </div>
  );
}
