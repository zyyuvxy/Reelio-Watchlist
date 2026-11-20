export type ItemType = 'MOVIE' | 'SERIES';

export type WatchStatus = 'PLAN_TO_WATCH' | 'WATCHING' | 'COMPLETED' | 'DROPPED';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface WatchlistItem {
  id: string;
  userId: string;
  title: string;
  type: ItemType;
  status: WatchStatus;
  genre: string | null;
  rating: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WatchlistStats {
  total: number;
  byStatus: {
    PLAN_TO_WATCH: number;
    WATCHING: number;
    COMPLETED: number;
    DROPPED: number;
  };
  byType: {
    MOVIE: number;
    SERIES: number;
  };
  averageRating: number | null;
  ratedCount: number;
}

export interface PaginatedWatchlist {
  items: WatchlistItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateWatchlistPayload {
  title: string;
  type: ItemType;
  status: WatchStatus;
  genre?: string | null;
  rating?: number | null;
  notes?: string | null;
}

export interface UpdateWatchlistPayload {
  title?: string;
  type?: ItemType;
  status?: WatchStatus;
  genre?: string | null;
  rating?: number | null;
  notes?: string | null;
}

export interface AuthResponse {
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    user: User;
  };
}
