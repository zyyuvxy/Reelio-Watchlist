import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ItemType, WatchStatus } from '@prisma/client';

export class CreateWatchlistItemDto {
  @IsString({ message: 'Judul harus berupa teks' })
  @IsNotEmpty({ message: 'Judul tontonan wajib diisi' })
  @MaxLength(255, { message: 'Judul maksimal 255 karakter' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  title: string;

  @IsEnum(ItemType, { message: 'Jenis harus bernilai MOVIE atau SERIES' })
  @IsNotEmpty({ message: 'Jenis tontonan wajib dipilih' })
  type: ItemType;

  @IsEnum(WatchStatus, {
    message: 'Status harus PLAN_TO_WATCH, WATCHING, COMPLETED, atau DROPPED',
  })
  @IsNotEmpty({ message: 'Status wajib dipilih' })
  status: WatchStatus;

  @IsOptional()
  @IsString({ message: 'Genre harus berupa teks' })
  @MaxLength(100, { message: 'Genre maksimal 100 karakter' })
  @Transform(({ value }) => (typeof value === 'string' && value.trim() !== '' ? value.trim() : null))
  genre?: string | null;

  @IsOptional()
  @ValidateIf((o) => o.rating !== null && o.rating !== undefined && o.rating !== '')
  @Type(() => Number)
  @IsInt({ message: 'Rating harus berupa angka bulat 1-10' })
  @Min(1, { message: 'Rating minimal 1' })
  @Max(10, { message: 'Rating maksimal 10' })
  rating?: number | null;

  @IsOptional()
  @IsString({ message: 'Catatan harus berupa teks' })
  @MaxLength(2000, { message: 'Catatan maksimal 2000 karakter' })
  @Transform(({ value }) => (typeof value === 'string' && value.trim() !== '' ? value.trim() : null))
  notes?: string | null;
}
