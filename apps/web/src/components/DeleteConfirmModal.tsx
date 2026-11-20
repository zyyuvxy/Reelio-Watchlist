import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  itemTitle: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  itemTitle,
  isDeleting = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#241B21]/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#FEFFE0] border-3 border-[#241B21] rounded-2xl p-6 shadow-retro-lg ticket-border">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b-2 border-dashed border-[#241B21]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#B5185F] text-[#FEFFE0] rounded-xl border-2 border-[#241B21]">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-[#241B21]">Konfirmasi Hapus</h3>
              <p className="text-xs text-[#62535E]">Tindakan ini tidak dapat dibatalkan</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="p-1 rounded-lg hover:bg-[#E7DDE2] text-[#241B21] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="py-6 space-y-3">
          <p className="text-sm sm:text-base text-[#241B21]">
            Apakah Anda yakin ingin menghapus tontonan ini dari watchlist Anda?
          </p>
          <div className="p-3 bg-[#E7DDE2] border-2 border-[#241B21] rounded-xl">
            <span className="text-xs uppercase font-bold text-[#62535E] block">Judul Tontonan:</span>
            <span className="font-extrabold text-base text-[#241B21] break-words">
              &ldquo;{itemTitle}&rdquo;
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t-2 border-dashed border-[#241B21]">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="w-full sm:w-auto px-5 py-2.5 font-bold text-[#241B21] bg-white border-2 border-[#241B21] rounded-xl ticket-border-sm hover:bg-[#E7DDE2] transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 font-bold text-[#FEFFE0] bg-[#B5185F] border-2 border-[#241B21] rounded-xl ticket-border-sm hover:bg-[#93124C] transition-all disabled:opacity-50"
          >
            {isDeleting ? (
              <span className="animate-pulse">Menghapus...</span>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
