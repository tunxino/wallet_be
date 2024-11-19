import {
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

@UseInterceptors(LoggingInterceptor)
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @UseGuards(AuthGuard)
  @Post()
  async getCategoriesByUserId(@Request() req): Promise<Category[]> {
    return this.categoryService.getCategoriesByUserId(req.user.id);
  }
}
