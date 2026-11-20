'use client';

import React, { useState } from 'react';
import { ItemType, WatchStatus, CreateWatchlistPayload, WatchlistItem } from '../lib/types';
import { StarRating } from './StarRating';
import { Film, Tv, CheckCircle2, Clock, Eye, XCircle } from 'lucide-react';

interface WatchlistFormProps {
  initialData?: WatchlistItem | null;
  onSubmit: (data: CreateWatchlistPayload) => Promise<void>;
  isSubmitting?: boolean;
  buttonLabel?: string;
}

export const WatchlistForm: React.FC<WatchlistFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
  buttonLabel = 'Simpan Tontonan',
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [type, setType] = useState<ItemType>(initialData?.type || 'MOVIE');
  const [status, setStatus] = useState<WatchStatus>(initialData?.status || 'PLAN_TO_WATCH');
  const [genre, setGenre] = useState(initialData?.genre || '');
  const [rating, setRating] = useState<number | null>(initialData?.rating ?? null);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('Judul tontonan wajib diisi');
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        type,
        status,
        genre: genre.trim() || null,
        rating: rating !== null ? Number(rating) : null,
        notes: notes.trim() || null,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menyimpan data');
    }
  };

  const statusOptions: { value: WatchStatus; label: string; icon: any; color: string }[] = [
    {
      value: 'PLAN_TO_WATCH',
      label: 'Ingin Ditonton',
      icon: Clock,
      color: 'bg-[#35C1C2] text-[#241B21]',
    },
    {
      value: 'WATCHING',
      label: 'Sedang Ditonton',
      icon: Eye,
      color: 'bg-[#D0E86E] text-[#241B21]',
    },
    {
      value: 'COMPLETED',
      label: 'Selesai',
      icon: CheckCircle2,
      color: 'bg-[#B5185F] text-[#FEFFE0]',
    },
    {
      value: 'DROPPED',
      label: 'Tidak Dilanjutkan',
      icon: XCircle,
      color: 'bg-[#E7DDE2] text-[#241B21]',
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div className="p-4 bg-[#B5185F]/15 border-2 border-[#B5185F] rounded-xl text-sm font-semibold text-[#B5185F]">
          {errorMessage}
        </div>
      )}

      {/* Judul */}
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-black uppercase text-[#241B21]">
          Judul Film / Serial <span className="text-[#B5185F]">*</span>
        </label>
        <input
          id="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Misal: Spirited Away, Severance, Aruna & Lidahnya"
          className="w-full px-4 py-3 bg-white border-2 border-[#241B21] rounded-xl text-[#241B21] font-medium shadow-retro-sm focus:outline-none focus:ring-2 focus:ring-[#B5185F]"
        />
      </div>

      {/* Jenis: Movie / Series */}
      <div className="space-y-2">
        <label className="block text-sm font-black uppercase text-[#241B21]">
          Jenis Tontonan <span className="text-[#B5185F]">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setType('MOVIE')}
            className={`flex items-center justify-center gap-2 p-3 font-bold rounded-xl border-2 border-[#241B21] transition-all ${
              type === 'MOVIE'
                ? 'bg-[#35C1C2] text-[#241B21] shadow-retro-sm translate-x-0.5 translate-y-0.5'
                : 'bg-white text-[#241B21] hover:bg-[#FEFFE0]'
            }`}
          >
            <Film className="w-5 h-5" />
            Film (Movie)
          </button>
          <button
            type="button"
            onClick={() => setType('SERIES')}
            className={`flex items-center justify-center gap-2 p-3 font-bold rounded-xl border-2 border-[#241B21] transition-all ${
              type === 'SERIES'
                ? 'bg-[#35C1C2] text-[#241B21] shadow-retro-sm translate-x-0.5 translate-y-0.5'
                : 'bg-white text-[#241B21] hover:bg-[#FEFFE0]'
            }`}
          >
            <Tv className="w-5 h-5" />
            Serial (Series)
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <label className="block text-sm font-black uppercase text-[#241B21]">
          Status Tontonan <span className="text-[#B5185F]">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {statusOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = status === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatus(opt.value)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 border-[#241B21] text-xs font-bold transition-all ${
                  isSelected
                    ? `${opt.color} shadow-retro-sm scale-102`
                    : 'bg-white text-[#241B21] hover:bg-[#E7DDE2]'
                }`}
              >
                <Icon className="w-4 h-4 mb-1" />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Genre & Rating */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Genre */}
        <div className="space-y-2">
          <label htmlFor="genre" className="block text-sm font-black uppercase text-[#241B21]">
            Genre <span className="text-xs font-normal text-[#62535E]">(Opsional)</span>
          </label>
          <input
            id="genre"
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="Misal: Drama, Sci-Fi, Indie, Thriller"
            className="w-full px-4 py-3 bg-white border-2 border-[#241B21] rounded-xl text-[#241B21] font-medium shadow-retro-sm focus:outline-none focus:ring-2 focus:ring-[#B5185F]"
          />
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <label className="block text-sm font-black uppercase text-[#241B21]">
            Rating Pribadi <span className="text-xs font-normal text-[#62535E]">(1 - 10)</span>
          </label>
          <div className="p-3 bg-white border-2 border-[#241B21] rounded-xl shadow-retro-sm">
            <StarRating
              value={rating}
              onChange={(val) => setRating(val)}
              interactive={true}
              size="md"
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label htmlFor="notes" className="block text-sm font-black uppercase text-[#241B21]">
          Catatan Pribadi <span className="text-xs font-normal text-[#62535E]">(Opsional)</span>
        </label>
        <textarea
          id="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Tulis ulasan singkat, alasan menonton, atau kutipan favorit..."
          className="w-full px-4 py-3 bg-white border-2 border-[#241B21] rounded-xl text-[#241B21] font-medium shadow-retro-sm focus:outline-none focus:ring-2 focus:ring-[#B5185F]"
        />
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-dashed border-[#241B21]">
        <a
          href="/watchlist"
          className="px-5 py-3 font-bold text-[#241B21] bg-white border-2 border-[#241B21] rounded-xl ticket-border-sm hover:bg-[#E7DDE2] transition-colors"
        >
          Batal
        </a>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 font-extrabold text-[#FEFFE0] bg-[#B5185F] border-2 border-[#241B21] rounded-xl shadow-retro hover:bg-[#93124C] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50"
        >
          {isSubmitting ? 'Menyimpan...' : buttonLabel}
        </button>
      </div>
    </form>
  );
};
