import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { CreateWatchlistItemDto } from './dto/create-watchlist-item.dto';
import { UpdateWatchlistItemDto } from './dto/update-watchlist-item.dto';
import { QueryWatchlistDto } from './dto/query-watchlist.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../auth/current-user.decorator';

@Controller('watchlist')
@UseGuards(JwtAuthGuard)
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: QueryWatchlistDto,
  ) {
    return this.watchlistService.findAll(user.id, query);
  }

  /**
   * IMPORTANT: GET /watchlist/stats must be defined BEFORE /watchlist/:id
   * to avoid route parameter collision.
   */
  @Get('stats')
  @HttpCode(HttpStatus.OK)
  async getStats(@CurrentUser() user: AuthenticatedUser) {
    return this.watchlistService.getStats(user.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.watchlistService.findOne(user.id, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createDto: CreateWatchlistItemDto,
  ) {
    const item = await this.watchlistService.create(user.id, createDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Item tontonan berhasil ditambahkan',
      data: item,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateDto: UpdateWatchlistItemDto,
  ) {
    const item = await this.watchlistService.update(user.id, id, updateDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Item tontonan berhasil diperbarui',
      data: item,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    const result = await this.watchlistService.remove(user.id, id);
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }
}
