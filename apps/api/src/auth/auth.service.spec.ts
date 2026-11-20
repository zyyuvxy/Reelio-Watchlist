import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully and return user without passwordHash', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 'u-1',
        name: 'Budi Cinephile',
        email: 'budi@reelio.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.register({
        name: 'Budi Cinephile',
        email: 'budi@reelio.com',
        password: 'password123',
      });

      expect(result.id).toBe('u-1');
      expect(result.email).toBe('budi@reelio.com');
      expect((result as any).passwordHash).toBeUndefined();
      expect(mockPrismaService.user.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email is already registered', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'existing-id',
        email: 'budi@reelio.com',
      });

      await expect(
        service.register({
          name: 'Budi',
          email: 'budi@reelio.com',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return token and user info on valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('secret123', 10);
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'u-1',
        name: 'Budi',
        email: 'budi@reelio.com',
        passwordHash: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.login({
        email: 'budi@reelio.com',
        password: 'secret123',
      });

      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.user.email).toBe('budi@reelio.com');
      expect((result.user as any).passwordHash).toBeUndefined();
    });

    it('should throw UnauthorizedException on wrong password', async () => {
      const hashedPassword = await bcrypt.hash('secret123', 10);
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'u-1',
        email: 'budi@reelio.com',
        passwordHash: hashedPassword,
      });

      await expect(
        service.login({
          email: 'budi@reelio.com',
          password: 'wrong-password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'nonexistent@reelio.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
