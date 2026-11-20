import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWatchlistItemDto } from './dto/create-watchlist-item.dto';
import { UpdateWatchlistItemDto } from './dto/update-watchlist-item.dto';
import { QueryWatchlistDto } from './dto/query-watchlist.dto';

@Injectable()
export class WatchlistService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, query: QueryWatchlistDto) {
    const {
      search,
      status,
      type,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
    } = query;

    const where: Prisma.WatchlistItemWhereInput = {
      userId,
    };

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    if (search && search.trim() !== '') {
      where.title = {
        contains: search.trim(),
        mode: 'insensitive',
      };
    }

    // Determine safe sort field
    const validSortFields = ['createdAt', 'updatedAt', 'title', 'rating'];
    const sortField = validSortFields.includes(sort) ? sort : 'createdAt';
    const sortOrder = order.toLowerCase() === 'asc' ? 'asc' : 'desc';

    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Math.min(100, Number(limit) || 10));
    const skip = (safePage - 1) * safeLimit;

    const [items, total] = await Promise.all([
      this.prisma.watchlistItem.findMany({
        where,
        orderBy: {
          [sortField]: sortOrder,
        },
        skip,
        take: safeLimit,
      }),
      this.prisma.watchlistItem.count({ where }),
    ]);

    const totalPages = Math.ceil(total / safeLimit) || 1;

    return {
      items,
      meta: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages,
      },
    };
  }

  async getStats(userId: string) {
    const [
      total,
      planToWatch,
      watching,
      completed,
      dropped,
      movies,
      series,
      ratedItems,
    ] = await Promise.all([
      this.prisma.watchlistItem.count({ where: { userId } }),
      this.prisma.watchlistItem.count({ where: { userId, status: 'PLAN_TO_WATCH' } }),
      this.prisma.watchlistItem.count({ where: { userId, status: 'WATCHING' } }),
      this.prisma.watchlistItem.count({ where: { userId, status: 'COMPLETED' } }),
      this.prisma.watchlistItem.count({ where: { userId, status: 'DROPPED' } }),
      this.prisma.watchlistItem.count({ where: { userId, type: 'MOVIE' } }),
      this.prisma.watchlistItem.count({ where: { userId, type: 'SERIES' } }),
      this.prisma.watchlistItem.aggregate({
        where: {
          userId,
          rating: { not: null },
        },
        _avg: { rating: true },
        _count: { rating: true },
      }),
    ]);

    const avgRating = ratedItems._avg.rating !== null
      ? Number(ratedItems._avg.rating.toFixed(1))
      : null;

    return {
      total,
      byStatus: {
        PLAN_TO_WATCH: planToWatch,
        WATCHING: watching,
        COMPLETED: completed,
        DROPPED: dropped,
      },
      byType: {
        MOVIE: movies,
        SERIES: series,
      },
      averageRating: avgRating,
      ratedCount: ratedItems._count.rating,
    };
  }

  async findOne(userId: string, id: string) {
    const item = await this.prisma.watchlistItem.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!item) {
      throw new NotFoundException('Item tontonan tidak ditemukan');
    }

    return item;
  }

  async create(userId: string, createDto: CreateWatchlistItemDto) {
    return this.prisma.watchlistItem.create({
      data: {
        userId,
        title: createDto.title,
        type: createDto.type,
        status: createDto.status,
        genre: createDto.genre ?? null,
        rating: createDto.rating ?? null,
        notes: createDto.notes ?? null,
      },
    });
  }

  async update(userId: string, id: string, updateDto: UpdateWatchlistItemDto) {
    // Ensure item exists and is owned by active user
    await this.findOne(userId, id);

    const data: Prisma.WatchlistItemUpdateInput = {};

    if (updateDto.title !== undefined) data.title = updateDto.title;
    if (updateDto.type !== undefined) data.type = updateDto.type;
    if (updateDto.status !== undefined) data.status = updateDto.status;
    if (updateDto.genre !== undefined) data.genre = updateDto.genre;
    if (updateDto.rating !== undefined) data.rating = updateDto.rating;
    if (updateDto.notes !== undefined) data.notes = updateDto.notes;

    return this.prisma.watchlistItem.update({
      where: { id },
      data,
    });
  }

  async remove(userId: string, id: string) {
    // Ensure item exists and is owned by active user
    await this.findOne(userId, id);

    await this.prisma.watchlistItem.delete({
      where: { id },
    });

    return { message: 'Item tontonan berhasil dihapus' };
  }
}
