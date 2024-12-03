import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { ResponseBase } from '../users/base.entity';
import { CategoryDto, ReorderCategoriesDto } from './category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getCategoriesByUserId(userId: number): Promise<Category[]> {
    return this.categoryRepository.find({ where: { userId: userId } });
  }

  async createCategory(
    categoryDto: CategoryDto,
    userId: number,
  ): Promise<ResponseBase> {
    const newCategory = this.categoryRepository.create({
      userId: userId,
      category: categoryDto.category,
      type: categoryDto.type,
      title: categoryDto.title,
      icon: categoryDto.icon,
    });
    await this.categoryRepository.save(newCategory);

    return {
      message: 'Create Category successfully',
      code: HttpStatus.CREATED,
    };
  }

  async reorderCategories(
    reorderedCategories: ReorderCategoriesDto[],
  ): Promise<ResponseBase> {
    for (const categoryData of reorderedCategories) {
      await this.categoryRepository.update(categoryData.id, {
        userId: categoryData.userId,
        category: categoryData.category,
        type: categoryData.type,
        title: categoryData.title,
        icon: categoryData.icon,
      });
    }
    return {
      message: 'Reorder Categories successfully',
      code: HttpStatus.ACCEPTED,
    }; // Return the updated list of categories
  }

  async deleteById(id: string): Promise<ResponseBase> {
    await this.categoryRepository.delete({ id: id });

    return {
      message: 'delete Categories',
      code: HttpStatus.ACCEPTED,
    };
  }
}
