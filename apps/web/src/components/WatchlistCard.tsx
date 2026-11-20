import React from 'react';
import { WatchlistItem } from '../lib/types';
import { StatusBadge } from './StatusBadge';
import { TypeBadge } from './TypeBadge';
import { StarRating } from './StarRating';
import { Edit3, Trash2, ArrowUpRight, Tag, Calendar } from 'lucide-react';

interface WatchlistCardProps {
  item: WatchlistItem;
  onDeleteClick: (item: WatchlistItem) => void;
}

export const WatchlistCard: React.FC<WatchlistCardProps> = ({ item, onDeleteClick }) => {
  const formattedDate = new Date(item.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="group relative bg-white border-2 border-[#241B21] rounded-2xl p-5 ticket-border-interactive flex flex-col justify-between">
      {/* Top badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <TypeBadge type={item.type} size="sm" />
          <StatusBadge status={item.status} size="sm" />
        </div>

        {/* Title */}
        <h3 className="font-black text-xl text-[#241B21] line-clamp-2 leading-snug group-hover:text-[#B5185F] transition-colors">
          <a href={`/watchlist/${item.id}`} className="hover:underline">
            {item.title}
          </a>
        </h3>

        {/* Metadata: Genre & Rating */}
        <div className="flex flex-wrap items-center gap-2 my-3">
          <StarRating value={item.rating} size="sm" />

          {item.genre && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 bg-[#E7DDE2] text-[#241B21] border border-[#241B21] rounded-md">
              <Tag className="w-3 h-3 text-[#B5185F]" />
              {item.genre}
            </span>
          )}
        </div>

        {/* Notes excerpt if any */}
        {item.notes && (
          <p className="text-xs sm:text-sm text-[#62535E] line-clamp-2 bg-[#FEFFE0] p-2.5 rounded-xl border border-[#241B21]/20 italic my-2">
            &ldquo;{item.notes}&rdquo;
          </p>
        )}
      </div>

      {/* Footer & Actions */}
      <div className="pt-3 mt-2 border-t-2 border-dashed border-[#241B21]/30 flex items-center justify-between">
        <span className="text-[11px] font-mono text-[#62535E] flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formattedDate}
        </span>

        <div className="flex items-center gap-1.5">
          <a
            href={`/watchlist/${item.id}`}
            title="Lihat Detail"
            className="p-1.5 text-[#241B21] hover:text-[#B5185F] hover:bg-[#FEFFE0] rounded-lg border border-transparent hover:border-[#241B21] transition-all"
          >
            <ArrowUpRight className="w-4 h-4" />
          </a>
          <a
            href={`/watchlist/${item.id}/edit`}
            title="Edit Tontonan"
            className="p-1.5 text-[#241B21] hover:text-[#B5185F] hover:bg-[#FEFFE0] rounded-lg border border-transparent hover:border-[#241B21] transition-all"
          >
            <Edit3 className="w-4 h-4" />
          </a>
          <button
            type="button"
            onClick={() => onDeleteClick(item)}
            title="Hapus Tontonan"
            className="p-1.5 text-[#241B21] hover:text-[#B5185F] hover:bg-[#E7DDE2] rounded-lg border border-transparent hover:border-[#241B21] transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
