import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ItemType, WatchStatus } from '@prisma/client';

export enum SortField {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  TITLE = 'title',
  RATING = 'rating',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
  ASC_UPPER = 'ASC',
  DESC_UPPER = 'DESC',
}

export class QueryWatchlistDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(WatchStatus, {
    message: 'Status harus PLAN_TO_WATCH, WATCHING, COMPLETED, atau DROPPED',
  })
  status?: WatchStatus;

  @IsOptional()
  @IsEnum(ItemType, { message: 'Jenis harus bernilai MOVIE atau SERIES' })
  type?: ItemType;

  @IsOptional()
  @IsString()
  sort?: string = 'createdAt';

  @IsOptional()
  @IsString()
  order?: string = 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page harus berupa angka integer' })
  @Min(1, { message: 'Page minimal 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit harus berupa angka integer' })
  @Min(1, { message: 'Limit minimal 1' })
  @Max(100, { message: 'Limit maksimal 100' })
  limit?: number = 10;
}
