import {
  AuthResponse,
  CreateWatchlistPayload,
  PaginatedWatchlist,
  UpdateWatchlistPayload,
  User,
  WatchlistItem,
  WatchlistStats,
} from './types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:4000';

export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('reelio_token');
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('reelio_token', token);
}

export function clearToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('reelio_token');
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    let errorMsg = 'Terjadi kesalahan pada permintaan ke server';
    if (data?.message) {
      errorMsg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
    }
    throw new ApiError(errorMsg, response.status);
  }

  return data as T;
}

export const api = {
  // Auth endpoints
  async register(payload: { name: string; email: string; password: string }) {
    return request<{ statusCode: number; message: string; data: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async login(payload: { email: string; password: string }) {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getMe() {
    return request<{ statusCode: number; data: User }>('/auth/me');
  },

  // Watchlist endpoints
  async getWatchlist(params: {
    search?: string;
    status?: string;
    type?: string;
    sort?: string;
    order?: string;
    page?: number;
    limit?: number;
  } = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    if (params.type && params.type !== 'ALL') query.append('type', params.type);
    if (params.sort) query.append('sort', params.sort);
    if (params.order) query.append('order', params.order);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<PaginatedWatchlist>(`/watchlist${queryString}`);
  },

  async getWatchlistStats() {
    return request<WatchlistStats>('/watchlist/stats');
  },

  async getWatchlistItem(id: string) {
    return request<WatchlistItem>(`/watchlist/${id}`);
  },

  async createWatchlistItem(payload: CreateWatchlistPayload) {
    return request<{ statusCode: number; message: string; data: WatchlistItem }>('/watchlist', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateWatchlistItem(id: string, payload: UpdateWatchlistPayload) {
    return request<{ statusCode: number; message: string; data: WatchlistItem }>(
      `/watchlist/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      },
    );
  },

  async deleteWatchlistItem(id: string) {
    return request<{ statusCode: number; message: string }>(`/watchlist/${id}`, {
      method: 'DELETE',
    });
  },
};
