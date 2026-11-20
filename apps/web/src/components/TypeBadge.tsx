import React from 'react';
import { ItemType } from '../lib/types';
import { Film, Tv } from 'lucide-react';

interface TypeBadgeProps {
  type: ItemType;
  size?: 'sm' | 'md';
}

export const TYPE_LABELS: Record<ItemType, string> = {
  MOVIE: 'Film',
  SERIES: 'Serial',
};

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type, size = 'md' }) => {
  const isMovie = type === 'MOVIE';
  const Icon = isMovie ? Film : Tv;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-md border-2 border-[#241B21] bg-white text-[#241B21] ${
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs sm:text-sm px-2.5 py-1'
      }`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      {TYPE_LABELS[type]}
    </span>
  );
};
