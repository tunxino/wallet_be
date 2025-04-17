import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBudgetDetailDto {
  @IsString()
  icon: string; // Icon for the budget detail

  @IsNumber()
  amount: number; // Amount for the budget detail

  @IsString()
  name: string; // Name of the budget detail
}

export class CreateBudgetDto {
  @IsNumber()
  amount: number; // The total amount for the budget

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBudgetDetailDto) // Use CreateBudgetDetailDto for each item in the array
  details: CreateBudgetDetailDto[]; // List of BudgetDetail objects
}

export class EditBudgetDto {
  @IsString()
  id: string;

  @IsNumber()
  amount: number; // The total amount for the budget

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBudgetDetailDto) // Use CreateBudgetDetailDto for each item in the array
  details: CreateBudgetDetailDto[]; // List of BudgetDetail objects
}
