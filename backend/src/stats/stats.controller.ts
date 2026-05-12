import { Controller, Get, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StatsService } from './stats.service';

@ApiTags('stats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/stats')
export class StatsController {
  constructor(private stats: StatsService) {}

  @Get()
  getMotosStats() {
    return this.stats.getMotosStats();
  }

  @Get('views')
  getViews(@Query('motoId', new ParseIntPipe({ optional: true })) motoId?: number) {
    return this.stats.getViewsTimeline(motoId);
  }
}
