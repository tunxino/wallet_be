import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseBase } from '../users/base.entity';
import { FundEntity } from './fund.entity';
import { FundDto } from './fund.dto';

@Injectable()
export class FundService {
  constructor(
    @InjectRepository(FundEntity)
    private fundRepository: Repository<FundEntity>,
  ) {}

  async create(fundDto: FundDto, userId: number): Promise<ResponseBase> {
    const { title, status, amount, note, createDate, endDate } = fundDto;

    // Create a new activity entity with the provided data
    const newActivity = this.fundRepository.create({
      title,
      status,
      amount,
      createDate,
      endDate,
      userId,
      note,
    });

    // Save the new activity entity to the database
    await this.fundRepository.save(newActivity);
    return {
      message: 'User created successfully',
      code: HttpStatus.CREATED,
    };
  }
}
