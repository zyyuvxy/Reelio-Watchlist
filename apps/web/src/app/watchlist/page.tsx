'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { api } from '../../lib/api';
import { WatchlistItem } from '../../lib/types';
import { WatchlistCard } from '../../components/WatchlistCard';
import { DeleteConfirmModal } from '../../components/DeleteConfirmModal';
import {
  Search,
  ArrowUpDown,
  PlusCircle,
  RefreshCw,
  AlertCircle,
  Film,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

function WatchlistContent() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedStatus, setSelectedStatus] = useState<string>(searchParams.get('status') || 'ALL');
  const [selectedType, setSelectedType] = useState<string>(searchParams.get('type') || 'ALL');
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'createdAt');
  const [sortOrder, setSortOrder] = useState<string>(searchParams.get('order') || 'desc');
  const [page, setPage] = useState<number>(Number(searchParams.get('page')) || 1);

  // Data states
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Delete modal state
  const [itemToDelete, setItemToDelete] = useState<WatchlistItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchWatchlist = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getWatchlist({
        search: searchTerm.trim() || undefined,
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
        type: selectedType !== 'ALL' ? selectedType : undefined,
        sort: sortBy,
        order: sortOrder,
        page,
        limit: 8,
      });

      setItems(res.items);
      setTotalPages(res.meta.totalPages);
      setTotalItems(res.meta.total);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat daftar tontonan');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedStatus, selectedType, sortBy, sortOrder, page]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
      return;
    }

    if (user) {
      fetchWatchlist();
    }
  }, [user, authLoading, router, fetchWatchlist]);

  // Handle URL query sync when query params change externally
  useEffect(() => {
    const urlStatus = searchParams.get('status');
    if (urlStatus && urlStatus !== selectedStatus) {
      setSelectedStatus(urlStatus);
      setPage(1);
    }
  }, [searchParams, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchWatchlist();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('ALL');
    setSelectedType('ALL');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteWatchlistItem(itemToDelete.id);
      setItemToDelete(null);
      await fetchWatchlist();
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus item');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-3 border-[#241B21] rounded-2xl p-6 ticket-border">
        <div>
          <h1 className="font-black text-2xl sm:text-3xl text-[#241B21]">Daftar Watchlist</h1>
          <p className="text-xs sm:text-sm text-[#62535E] mt-1">
            Total {totalItems} film & serial tersimpan di arsip pribadimu
          </p>
        </div>

        <a
          href="/watchlist/tambah"
          className="flex items-center justify-center gap-2 px-5 py-3 font-extrabold text-sm sm:text-base text-[#FEFFE0] bg-[#B5185F] border-2 border-[#241B21] rounded-xl shadow-retro hover:bg-[#93124C] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          + Tambah Tontonan
        </a>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border-2 border-[#241B21] rounded-2xl p-4 sm:p-5 ticket-border-sm space-y-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-[#62535E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari judul tontonan..."
              className="w-full pl-11 pr-4 py-2.5 bg-[#FEFFE0] border-2 border-[#241B21] rounded-xl text-sm font-semibold text-[#241B21] placeholder:text-[#62535E]/70 focus:outline-none focus:ring-2 focus:ring-[#B5185F]"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#62535E] hover:text-[#241B21]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 font-bold text-sm bg-[#35C1C2] text-[#241B21] border-2 border-[#241B21] rounded-xl ticket-border-sm hover:bg-[#2AA5A6] transition-colors"
          >
            Cari
          </button>
        </form>

        {/* Filter controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t-2 border-dashed border-[#241B21]/20">
          {/* Status Filter */}
          <div className="space-y-1">
            <label className="block text-[11px] font-black uppercase text-[#62535E]">
              Status Tontonan
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-[#FEFFE0] border-2 border-[#241B21] rounded-xl text-xs sm:text-sm font-bold text-[#241B21] focus:outline-none focus:ring-2 focus:ring-[#B5185F]"
            >
              <option value="ALL">Semua Status</option>
              <option value="PLAN_TO_WATCH">Ingin Ditonton</option>
              <option value="WATCHING">Sedang Ditonton</option>
              <option value="COMPLETED">Selesai</option>
              <option value="DROPPED">Tidak Dilanjutkan</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="space-y-1">
            <label className="block text-[11px] font-black uppercase text-[#62535E]">
              Jenis
            </label>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-[#FEFFE0] border-2 border-[#241B21] rounded-xl text-xs sm:text-sm font-bold text-[#241B21] focus:outline-none focus:ring-2 focus:ring-[#B5185F]"
            >
              <option value="ALL">Semua Jenis</option>
              <option value="MOVIE">Film (Movie)</option>
              <option value="SERIES">Serial (Series)</option>
            </select>
          </div>

          {/* Sort Field */}
          <div className="space-y-1">
            <label className="block text-[11px] font-black uppercase text-[#62535E]">
              Urutkan Berdasarkan
            </label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-[#FEFFE0] border-2 border-[#241B21] rounded-xl text-xs sm:text-sm font-bold text-[#241B21] focus:outline-none focus:ring-2 focus:ring-[#B5185F]"
            >
              <option value="createdAt">Tanggal Ditambahkan</option>
              <option value="rating">Rating Skor</option>
              <option value="title">Judul (Alfabetis)</option>
              <option value="updatedAt">Terakhir Diperbarui</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="space-y-1">
            <label className="block text-[11px] font-black uppercase text-[#62535E]">
              Arah Urutan
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#FEFFE0] border-2 border-[#241B21] rounded-xl text-xs sm:text-sm font-bold text-[#241B21] hover:bg-[#E7DDE2] transition-colors"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                {sortOrder === 'desc' ? 'Terbesar / Terbaru' : 'Terkecil / Terlama'}
              </button>

              {(selectedStatus !== 'ALL' || selectedType !== 'ALL' || searchTerm) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  title="Reset Filter"
                  className="px-3 py-2 bg-[#E7DDE2] border-2 border-[#241B21] rounded-xl text-xs font-bold text-[#241B21] hover:bg-[#D4C7CD]"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-5 bg-white border-2 border-[#B5185F] rounded-2xl shadow-retro-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-[#B5185F]">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
          <button
            type="button"
            onClick={fetchWatchlist}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-[#B5185F] text-[#FEFFE0] border-2 border-[#241B21] rounded-xl ticket-border-sm hover:bg-[#93124C]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Coba Lagi
          </button>
        </div>
      )}

      {/* Grid or Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="h-52 bg-white border-2 border-[#241B21] rounded-2xl p-5 animate-pulse ticket-border-sm"
            />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <WatchlistCard
              key={item.id}
              item={item}
              onDeleteClick={(selected) => setItemToDelete(selected)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border-2 border-dashed border-[#241B21] rounded-2xl p-8 sm:p-12 text-center space-y-4 ticket-border-sm">
          <div className="w-16 h-16 bg-[#D0E86E] border-2 border-[#241B21] rounded-2xl flex items-center justify-center mx-auto shadow-retro-sm">
            <Film className="w-8 h-8 text-[#241B21]" />
          </div>
          <div>
            <h3 className="font-black text-lg text-[#241B21]">
              Tidak Ada Tontonan yang Cocok
            </h3>
            <p className="text-xs sm:text-sm text-[#62535E] max-w-md mx-auto mt-1">
              {searchTerm || selectedStatus !== 'ALL' || selectedType !== 'ALL'
                ? 'Tidak ditemukan tontonan yang sesuai dengan filter atau pencarian Anda. Coba reset filter.'
                : 'Watchlist pribadimu masih kosong. Mulai tambahkan tontonan baru sekarang!'}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {searchTerm || selectedStatus !== 'ALL' || selectedType !== 'ALL' ? (
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-5 py-2.5 font-bold text-sm bg-white border-2 border-[#241B21] rounded-xl ticket-border-sm hover:bg-[#E7DDE2]"
              >
                Hapus Filter Pencarian
              </button>
            ) : null}
            <a
              href="/watchlist/tambah"
              className="inline-flex items-center gap-2 px-5 py-2.5 font-extrabold text-sm text-[#FEFFE0] bg-[#B5185F] border-2 border-[#241B21] rounded-xl shadow-retro hover:bg-[#93124C]"
            >
              <PlusCircle className="w-4 h-4" />
              + Tambah Tontonan
            </a>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-[#241B21]">
          <p className="text-xs font-mono text-[#62535E]">
            Halaman {page} dari {totalPages} ({totalItems} tontonan)
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="flex items-center gap-1 px-3.5 py-2 bg-white border-2 border-[#241B21] rounded-xl text-xs font-bold text-[#241B21] ticket-border-sm hover:bg-[#E7DDE2] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Sebelumnya
            </button>
            <button
              type="button"
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              className="flex items-center gap-1 px-3.5 py-2 bg-white border-2 border-[#241B21] rounded-xl text-xs font-bold text-[#241B21] ticket-border-sm hover:bg-[#E7DDE2] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Berikutnya
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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

export default function WatchlistPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-24 bg-white border-2 border-[#241B21] rounded-2xl animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-52 bg-white border-2 border-[#241B21] rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      }
    >
      <WatchlistContent />
    </Suspense>
  );
}
