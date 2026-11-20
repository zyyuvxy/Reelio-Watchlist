import React from 'react';
import { WatchlistStats } from '../lib/types';
import { Film, Eye, Clock, CheckCircle2, XCircle, Star } from 'lucide-react';

interface StatsCardsProps {
  stats: WatchlistStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Total Tontonan',
      count: stats.total,
      subtitle: `${stats.byType.MOVIE} Film • ${stats.byType.SERIES} Serial`,
      href: '/watchlist',
      bgColor: 'bg-white',
      textColor: 'text-[#241B21]',
      icon: Film,
      badgeColor: 'bg-[#FEFFE0]',
    },
    {
      title: 'Sedang Ditonton',
      count: stats.byStatus.WATCHING,
      subtitle: 'Sedang berlangsung',
      href: '/watchlist?status=WATCHING',
      bgColor: 'bg-[#D0E86E]', // Lime Cream
      textColor: 'text-[#241B21]',
      icon: Eye,
      badgeColor: 'bg-white',
    },
    {
      title: 'Ingin Ditonton',
      count: stats.byStatus.PLAN_TO_WATCH,
      subtitle: 'Antrean berikutnya',
      href: '/watchlist?status=PLAN_TO_WATCH',
      bgColor: 'bg-[#35C1C2]', // Strong Cyan
      textColor: 'text-[#241B21]',
      icon: Clock,
      badgeColor: 'bg-white',
    },
    {
      title: 'Selesai',
      count: stats.byStatus.COMPLETED,
      subtitle: 'Telah ditonton',
      href: '/watchlist?status=COMPLETED',
      bgColor: 'bg-[#B5185F]', // Cherry Rose
      textColor: 'text-[#FEFFE0]', // Light Yellow text
      icon: CheckCircle2,
      badgeColor: 'bg-[#93124C]',
    },
    {
      title: 'Tidak Dilanjutkan',
      count: stats.byStatus.DROPPED,
      subtitle: 'Dihentikan',
      href: '/watchlist?status=DROPPED',
      bgColor: 'bg-[#E7DDE2]', // Soft Neutral
      textColor: 'text-[#241B21]',
      icon: XCircle,
      badgeColor: 'bg-white',
    },
    {
      title: 'Rata-rata Rating',
      count: stats.averageRating !== null ? `${stats.averageRating}` : '-',
      subtitle: stats.ratedCount > 0 ? `Dari ${stats.ratedCount} tontonan` : 'Belum ada rating',
      href: '/watchlist?sort=rating&order=desc',
      bgColor: 'bg-[#FEFFE0]',
      textColor: 'text-[#241B21]',
      icon: Star,
      badgeColor: 'bg-[#E7DDE2]',
      isRating: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <a
            key={card.title}
            href={card.href}
            className={`group relative p-4 rounded-2xl border-2 border-[#241B21] ${card.bgColor} ${card.textColor} ticket-border-interactive flex flex-col justify-between`}
            title={`Klik untuk memfilter: ${card.title}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider opacity-85">
                {card.title}
              </span>
              <div
                className={`p-1.5 rounded-lg border border-[#241B21] ${card.badgeColor} ${
                  card.textColor
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-1">
              <div className="flex items-baseline gap-1 font-black font-mono text-3xl sm:text-4xl tracking-tight">
                {card.count}
                {card.isRating && stats.averageRating !== null && (
                  <span className="text-xs font-normal opacity-80">/10</span>
                )}
              </div>
              <p className="text-[11px] font-medium mt-1 truncate opacity-85">
                {card.subtitle}
              </p>
            </div>
          </a>
        );
      })}
    </div>
  );
};
