import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value?: number | null;
  onChange?: (val: number | null) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  interactive = false,
  size = 'md',
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const starSize = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4 sm:w-5 sm:h-5',
    lg: 'w-6 h-6',
  }[size];

  if (!interactive) {
    if (value === null || value === undefined) {
      return (
        <span className="text-xs sm:text-sm font-medium text-[#62535E] italic">
          Belum dinilai
        </span>
      );
    }

    return (
      <div className="inline-flex items-center gap-1.5 bg-[#FEFFE0] px-2.5 py-1 rounded-md border-2 border-[#241B21]">
        <Star className={`${starSize} fill-[#B5185F] text-[#B5185F]`} />
        <span className="font-bold text-[#241B21] text-xs sm:text-sm font-mono">
          {value}<span className="text-[#62535E] font-normal">/10</span>
        </span>
      </div>
    );
  }

  const currentVal = hoverRating ?? value ?? 0;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1 flex-wrap">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <button
            key={star}
            type="button"
            className="p-1 rounded transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#B5185F]"
            onClick={() => onChange?.(value === star ? null : star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(null)}
            title={`Rating ${star}/10`}
          >
            <Star
              className={`${starSize} transition-colors ${
                star <= currentVal
                  ? 'fill-[#B5185F] text-[#B5185F]'
                  : 'text-[#62535E] hover:text-[#B5185F]'
              }`}
            />
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-[#241B21]">
        <span className="font-bold font-mono">
          {currentVal > 0 ? `${currentVal}/10 Skor` : 'Pilih skor 1 - 10 (opsional)'}
        </span>
        {value !== null && value !== undefined && (
          <button
            type="button"
            onClick={() => onChange?.(null)}
            className="text-xs text-[#B5185F] underline hover:font-bold"
          >
            Hapus rating
          </button>
        )}
      </div>
    </div>
  );
};
