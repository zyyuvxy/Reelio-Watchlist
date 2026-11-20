import React from 'react';
import { WatchStatus } from '../lib/types';

interface StatusBadgeProps {
  status: WatchStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const STATUS_LABELS: Record<WatchStatus, string> = {
  PLAN_TO_WATCH: 'Ingin Ditonton',
  WATCHING: 'Sedang Ditonton',
  COMPLETED: 'Selesai',
  DROPPED: 'Tidak Dilanjutkan',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'PLAN_TO_WATCH':
        // Strong Cyan #35C1C2 with Plum Ink text
        return 'bg-[#35C1C2] text-[#241B21] border-[#241B21]';
      case 'WATCHING':
        // Lime Cream #D0E86E with Plum Ink text
        return 'bg-[#D0E86E] text-[#241B21] border-[#241B21]';
      case 'COMPLETED':
        // Cherry Rose #B5185F with Light Yellow text
        return 'bg-[#B5185F] text-[#FEFFE0] border-[#241B21]';
      case 'DROPPED':
        // Soft Neutral #E7DDE2 with Plum Ink text
        return 'bg-[#E7DDE2] text-[#241B21] border-[#241B21]';
      default:
        return 'bg-[#E7DDE2] text-[#241B21] border-[#241B21]';
    }
  };

  const sizeClass = {
    sm: 'text-xs px-2 py-0.5 border',
    md: 'text-xs sm:text-sm font-semibold px-2.5 py-1 border-2',
    lg: 'text-sm sm:text-base font-bold px-3.5 py-1.5 border-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full tracking-wide shadow-sm uppercase font-mono ${getBadgeStyle()} ${sizeClass}`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
};
