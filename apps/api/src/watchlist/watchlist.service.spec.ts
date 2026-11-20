import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { PrismaService } from '../prisma/prisma.service';

describe('WatchlistService', () => {
  let service: WatchlistService;
  let prisma: PrismaService;

  const mockPrismaService = {
    watchlistItem: {
      findMany: jest.fn(),
      count: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      aggregate: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WatchlistService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<WatchlistService>(WatchlistService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should query items specifically for the active user with pagination', async () => {
      mockPrismaService.watchlistItem.findMany.mockResolvedValue([
        { id: 'item-1', userId: 'user-1', title: 'Inception' },
      ]);
      mockPrismaService.watchlistItem.count.mockResolvedValue(1);

      const result = await service.findAll('user-1', { page: 1, limit: 10 });

      expect(result.items.length).toBe(1);
      expect(result.meta.total).toBe(1);
      expect(mockPrismaService.watchlistItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId: 'user-1' }),
        }),
      );
    });
  });

  describe('findOne (User Data Isolation)', () => {
    it('should return item when it belongs to active user', async () => {
      mockPrismaService.watchlistItem.findFirst.mockResolvedValue({
        id: 'item-1',
        userId: 'user-1',
        title: 'Interstellar',
      });

      const result = await service.findOne('user-1', 'item-1');
      expect(result.id).toBe('item-1');
      expect(mockPrismaService.watchlistItem.findFirst).toHaveBeenCalledWith({
        where: { id: 'item-1', userId: 'user-1' },
      });
    });

    it('should throw NotFoundException if item belongs to another user (User A cannot view User B)', async () => {
      // findFirst returns null because userId does not match
      mockPrismaService.watchlistItem.findFirst.mockResolvedValue(null);

      await expect(service.findOne('user-1', 'item-owned-by-user-2')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update and delete isolation', () => {
    it('should disallow User A from modifying User B item', async () => {
      mockPrismaService.watchlistItem.findFirst.mockResolvedValue(null);

      await expect(
        service.update('user-1', 'item-user-2', { title: 'Hacked' }),
      ).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.watchlistItem.update).not.toHaveBeenCalled();
    });

    it('should disallow User A from deleting User B item', async () => {
      mockPrismaService.watchlistItem.findFirst.mockResolvedValue(null);

      await expect(
        service.remove('user-1', 'item-user-2'),
      ).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.watchlistItem.delete).not.toHaveBeenCalled();
    });
  });

  describe('getStats', () => {
    it('should calculate statistics isolated to active user', async () => {
      mockPrismaService.watchlistItem.count
        .mockResolvedValueOnce(5) // total
        .mockResolvedValueOnce(2) // planToWatch
        .mockResolvedValueOnce(1) // watching
        .mockResolvedValueOnce(1) // completed
        .mockResolvedValueOnce(1) // dropped
        .mockResolvedValueOnce(3) // movies
        .mockResolvedValueOnce(2); // series

      mockPrismaService.watchlistItem.aggregate.mockResolvedValue({
        _avg: { rating: 8.5 },
        _count: { rating: 4 },
      });

      const stats = await service.getStats('user-1');

      expect(stats.total).toBe(5);
      expect(stats.byStatus.PLAN_TO_WATCH).toBe(2);
      expect(stats.byStatus.WATCHING).toBe(1);
      expect(stats.byStatus.COMPLETED).toBe(1);
      expect(stats.byStatus.DROPPED).toBe(1);
      expect(stats.byType.MOVIE).toBe(3);
      expect(stats.byType.SERIES).toBe(2);
      expect(stats.averageRating).toBe(8.5);
    });
  });
});
