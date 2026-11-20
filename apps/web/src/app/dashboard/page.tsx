'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { api } from '../../lib/api';
import { WatchlistStats, WatchlistItem } from '../../lib/types';
import { StatsCards } from '../../components/StatsCards';
import { WatchlistCard } from '../../components/WatchlistCard';
import { DeleteConfirmModal } from '../../components/DeleteConfirmModal';
import {
  Film,
  PlusCircle,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<WatchlistStats | null>(null);
  const [recentItems, setRecentItems] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Delete modal state
  const [itemToDelete, setItemToDelete] = useState<WatchlistItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsRes, watchlistRes] = await Promise.all([
        api.getWatchlistStats(),
        api.getWatchlist({ limit: 4, sort: 'createdAt', order: 'desc' }),
      ]);
      setStats(statsRes);
      setRecentItems(watchlistRes.items);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data dashboard');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
      return;
    }

    if (user) {
      fetchDashboardData();
    }
  }, [user, authLoading, router, fetchDashboardData]);

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteWatchlistItem(itemToDelete.id);
      setItemToDelete(null);
      await fetchDashboardData();
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus item');
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading || (!user && isLoading)) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-28 bg-[#E7DDE2] border-2 border-[#241B21] rounded-2xl ticket-border-sm" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-28 bg-[#E7DDE2] border-2 border-[#241B21] rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Greeting Banner */}
      <section className="relative overflow-hidden bg-white border-3 border-[#241B21] rounded-2xl p-6 sm:p-8 ticket-border">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D0E86E] border-2 border-[#241B21] rounded-full text-xs font-black uppercase text-[#241B21] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#B5185F]" />
              Katalog Sinema Pribadi
            </div>
            <h1 className="font-black text-2xl sm:text-4xl text-[#241B21] tracking-tight">
              Halo, <span className="text-[#B5185F]">{user?.name}</span>! 🍿
            </h1>
            <p className="text-sm sm:text-base text-[#62535E] mt-1 max-w-xl">
              Catat, kelompokkan, dan pantau seluruh film serta serial yang ingin atau sedang kamu tonton.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/watchlist/tambah"
              className="flex items-center gap-2 px-5 py-3 font-extrabold text-sm sm:text-base text-[#FEFFE0] bg-[#B5185F] border-2 border-[#241B21] rounded-xl shadow-retro hover:bg-[#93124C] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <PlusCircle className="w-5 h-5" />
              + Tambah Tontonan
            </a>
            <a
              href="/watchlist"
              className="flex items-center gap-2 px-5 py-3 font-bold text-sm sm:text-base text-[#241B21] bg-[#35C1C2] border-2 border-[#241B21] rounded-xl shadow-retro-sm hover:bg-[#2AA5A6] transition-all"
            >
              Lihat Semua Watchlist
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Error state */}
      {error && (
        <div className="p-5 bg-white border-2 border-[#B5185F] rounded-2xl shadow-retro-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-[#B5185F]">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
          <button
            type="button"
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-[#B5185F] text-[#FEFFE0] border-2 border-[#241B21] rounded-xl ticket-border-sm hover:bg-[#93124C]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Coba Lagi
          </button>
        </div>
      )}

      {/* Statistics Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-black text-xl text-[#241B21] flex items-center gap-2">
            <span>Statistik Tontonan</span>
          </h2>
          <span className="text-xs font-mono text-[#62535E]">
            Klik kartu untuk memfilter
          </span>
        </div>

        {stats ? (
          <StatsCards stats={stats} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-28 bg-[#E7DDE2] border-2 border-[#241B21] rounded-2xl animate-pulse" />
            ))}
          </div>
        )}
      </section>

      {/* Recent Watchlist Items */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-black text-xl text-[#241B21]">Tontonan Terbaru</h2>
            <p className="text-xs text-[#62535E]">Baru saja kamu tambahkan ke daftar</p>
          </div>
          <a
            href="/watchlist"
            className="text-xs sm:text-sm font-bold text-[#B5185F] hover:underline flex items-center gap-1"
          >
            Buka Semua ({stats?.total || 0})
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-48 bg-white border-2 border-[#241B21] rounded-2xl p-5 animate-pulse ticket-border-sm"
              />
            ))}
          </div>
        ) : recentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentItems.map((item) => (
              <WatchlistCard
                key={item.id}
                item={item}
                onDeleteClick={(selected) => setItemToDelete(selected)}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="bg-white border-2 border-dashed border-[#241B21] rounded-2xl p-8 sm:p-12 text-center space-y-4 ticket-border-sm">
            <div className="w-16 h-16 bg-[#D0E86E] border-2 border-[#241B21] rounded-2xl flex items-center justify-center mx-auto shadow-retro-sm">
              <Film className="w-8 h-8 text-[#241B21]" />
            </div>
            <div>
              <h3 className="font-black text-lg text-[#241B21]">Belum Ada Tontonan Tersimpan</h3>
              <p className="text-xs sm:text-sm text-[#62535E] max-w-md mx-auto mt-1">
                Watchlist pribadimu masih kosong. Tambahkan film atau serial pertama yang ingin kamu tonton sekarang!
              </p>
            </div>
            <a
              href="/watchlist/tambah"
              className="inline-flex items-center gap-2 px-6 py-3 font-extrabold text-sm text-[#FEFFE0] bg-[#B5185F] border-2 border-[#241B21] rounded-xl shadow-retro hover:bg-[#93124C] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <PlusCircle className="w-5 h-5" />
              + Tambah Tontonan Sekarang
            </a>
          </div>
        )}
      </section>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!itemToDelete}
        itemTitle={itemToDelete?.title || ''}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
