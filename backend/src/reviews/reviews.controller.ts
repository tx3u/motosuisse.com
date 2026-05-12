import {
  Body, Controller, Delete, Get, Param,
  ParseIntPipe, Patch, Post, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@ApiTags('reviews')
@Controller('api/reviews')
export class ReviewsController {
  constructor(private reviews: ReviewsService) {}

  /** Public — visible reviews for the homepage */
  @Get()
  findVisible() {
    return this.reviews.findVisible();
  }

  /** Admin — all reviews */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('admin')
  findAll() {
    return this.reviews.findAll();
  }

  /** Admin — create a review */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateReviewDto) {
    return this.reviews.create(dto);
  }

  /** Admin — toggle visibility */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/visibility')
  toggleVisibility(@Param('id', ParseIntPipe) id: number) {
    return this.reviews.toggleVisibility(id);
  }

  /** Admin — delete */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reviews.remove(id);
  }
}
