'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';
import { api } from '../../../lib/api';
import { WatchlistItem } from '../../../lib/types';
import { StatusBadge } from '../../../components/StatusBadge';
import { TypeBadge } from '../../../components/TypeBadge';
import { StarRating } from '../../../components/StarRating';
import { DeleteConfirmModal } from '../../../components/DeleteConfirmModal';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  Tag,
  FileText,
  AlertCircle,
  RefreshCw,
  Film,
} from 'lucide-react';

export default function DetailTontonanPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [item, setItem] = useState<WatchlistItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDetail = useCallback(async () => {
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
      fetchDetail();
    }
  }, [user, authLoading, id, router, fetchDetail]);

  const handleDeleteConfirm = async () => {
    if (!item) return;
    setIsDeleting(true);
    try {
      await api.deleteWatchlistItem(item.id);
      router.push('/watchlist');
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus tontonan');
      setIsDeleting(false);
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="h-6 w-32 bg-[#E7DDE2] rounded animate-pulse" />
        <div className="h-80 bg-white border-2 border-[#241B21] rounded-2xl ticket-border-sm animate-pulse" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-white border-3 border-[#B5185F] rounded-2xl p-8 ticket-border text-center space-y-4">
        <div className="w-16 h-16 bg-[#B5185F]/15 border-2 border-[#B5185F] rounded-2xl flex items-center justify-center mx-auto text-[#B5185F]">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="font-black text-2xl text-[#241B21]">Item Tidak Ditemukan</h2>
        <p className="text-sm text-[#62535E]">
          {error || 'Item tontonan ini mungkin telah dihapus atau Anda tidak memiliki akses.'}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={fetchDetail}
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

  const createdDate = new Date(item.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const updatedDate = new Date(item.updatedAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Back button */}
      <div>
        <a
          href="/watchlist"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#241B21] hover:text-[#B5185F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Watchlist
        </a>
      </div>

      {/* Detail Ticket Card */}
      <article className="bg-white border-3 border-[#241B21] rounded-2xl p-6 sm:p-10 ticket-border space-y-6">
        {/* Header badges & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-dashed border-[#241B21]">
          <div className="flex flex-wrap items-center gap-2.5">
            <TypeBadge type={item.type} size="md" />
            <StatusBadge status={item.status} size="md" />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <a
              href={`/watchlist/${item.id}/edit`}
              className="flex items-center gap-1.5 px-4 py-2 font-bold text-xs sm:text-sm text-[#241B21] bg-white border-2 border-[#241B21] rounded-xl ticket-border-sm hover:bg-[#FEFFE0] transition-colors"
            >
              <Edit3 className="w-4 h-4 text-[#B5185F]" />
              Edit
            </a>
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 font-bold text-xs sm:text-sm text-[#B5185F] bg-white border-2 border-[#241B21] rounded-xl ticket-border-sm hover:bg-[#E7DDE2] transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Hapus
            </button>
          </div>
        </div>

        {/* Title */}
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#62535E] font-bold block mb-1">
            Judul Tontonan
          </span>
          <h1 className="font-black text-3xl sm:text-4xl text-[#241B21] leading-tight">
            {item.title}
          </h1>
        </div>

        {/* Meta details grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-[#FEFFE0] border-2 border-[#241B21] rounded-2xl ticket-border-sm">
          {/* Rating */}
          <div className="space-y-1">
            <span className="text-xs font-black uppercase text-[#62535E] block">
              Rating Pribadi
            </span>
            <div className="pt-1">
              <StarRating value={item.rating} size="lg" />
            </div>
          </div>

          {/* Genre */}
          <div className="space-y-1">
            <span className="text-xs font-black uppercase text-[#62535E] block">
              Genre
            </span>
            <div className="pt-1">
              {item.genre ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1 bg-white text-[#241B21] border-2 border-[#241B21] rounded-xl shadow-retro-sm">
                  <Tag className="w-3.5 h-3.5 text-[#B5185F]" />
                  {item.genre}
                </span>
              ) : (
                <span className="text-sm font-medium text-[#62535E] italic">
                  Tidak ditentukan
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Personal Notes */}
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#62535E] flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#B5185F]" />
            Catatan Pribadi & Ulasan
          </span>
          {item.notes ? (
            <div className="p-5 bg-white border-2 border-[#241B21] rounded-2xl text-sm sm:text-base leading-relaxed text-[#241B21] whitespace-pre-wrap shadow-retro-sm">
              {item.notes}
            </div>
          ) : (
            <p className="text-sm text-[#62535E] italic p-4 bg-[#E7DDE2]/50 border-2 border-dashed border-[#241B21]/30 rounded-xl">
              Belum ada catatan pribadi untuk tontonan ini. Klik tombol Edit untuk menambahkan kesan, kutipan, atau review.
            </p>
          )}
        </div>

        {/* Timestamps */}
        <div className="pt-6 border-t-2 border-dashed border-[#241B21] flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-[#62535E] gap-2">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Ditambahkan: {createdDate}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Terakhir diubah: {updatedDate}
          </span>
        </div>
      </article>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        itemTitle={item.title}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
