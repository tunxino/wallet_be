import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LoggingInterceptor } from '../common/logging.interceptor';

import { CategoryService } from './category.service';
import { AuthGuard } from '../auth/auth.guard';
import { Category } from './category.entity';
import { ResponseBase } from '../users/base.entity';
import {
  CategoryDto,
  DeleteCategoriesDto,
  ReorderCategoriesDto,
} from './category.dto';

@UseInterceptors(LoggingInterceptor)
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @UseGuards(AuthGuard)
  @Post()
  async getCategoriesByUserId(@Request() req): Promise<Category[]> {
    return this.categoryService.getCategoriesByUserId(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Post('create')
  async createCategory(
    @Body() categoryDto: CategoryDto,
    @Request() req,
  ): Promise<ResponseBase> {
    return this.categoryService.createCategory(categoryDto, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Post('update/reorder')
  async reorderCategories(
    @Body() reorderCategoriesDto: ReorderCategoriesDto[],
  ): Promise<ResponseBase> {
    return this.categoryService.reorderCategories(reorderCategoriesDto);
  }

  @UseGuards(AuthGuard)
  @Post('delete')
  async deleteCategory(
    @Body() deleteCategoriesDto: DeleteCategoriesDto,
  ): Promise<ResponseBase> {
    return this.categoryService.deleteById(deleteCategoriesDto.id);
  }
}
