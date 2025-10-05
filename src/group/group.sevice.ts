import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense, ExpenseShare, Group, GroupMember } from './group.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupMember)
    private readonly groupMemberRepository: Repository<GroupMember>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(ExpenseShare)
    private readonly expenseShareRepository: Repository<ExpenseShare>,
  ) {}

  // async createGroup(
  //   dto: CreateGroupDto,
  //   creatorId: number,
  // ): Promise<ResponseBase> {
  //   const { name, memberIds } = dto;
  //
  //   const group = this.groupRepository.create({ name });
  //
  //   // Nếu memberIds không tồn tại hoặc rỗng, chỉ thêm creatorId
  //   const uniqueUserIds = Array.from(
  //     new Set([creatorId, ...(memberIds?.length ? memberIds : [])]),
  //   );
  //
  //   const users = await this.userRepository.findByIds(uniqueUserIds);
  //
  //   const members: GroupMember[] = users.map((u) => {
  //     const gm = new GroupMember();
  //     gm.userId = u.id;
  //     gm.group = group;
  //     gm.user = u;
  //     return gm;
  //   });
  //
  //   group.members = members;
  //
  //   await this.groupRepository.save(group);
  //   // await this.groupMemberRepository.save(members);
  //   return {
  //     message: 'Group created successfully',
  //     code: HttpStatus.CREATED,
  //     data: {
  //       groupId: group.id,
  //       name: group.name,
  //       members: group.members.map((u) => ({
  //         id: u.userId,
  //         name: u.user.name,
  //         email: u.user.email,
  //       })),
  //     },
  //   };
  // }
  //
  // async searchUsers(
  //   keyword: string,
  //   excludeUserId: number,
  // ): Promise<Partial<User>[]> {
  //   return this.userRepository.find({
  //     where: [
  //       { name: ILike(`%${keyword}%`), id: Not(excludeUserId) },
  //       { email: ILike(`%${keyword}%`), id: Not(excludeUserId) },
  //     ],
  //     select: ['id', 'name', 'email'],
  //   });
  // }
  //
  // async getGroupsByUser(userId: number): Promise<ResponseBase> {
  //   const groups = await this.groupRepository
  //     .createQueryBuilder('group')
  //     .leftJoinAndSelect('group.members', 'member')
  //     .leftJoinAndSelect('member.user', 'user')
  //     .where((qb) => {
  //       const subQuery = qb
  //         .subQuery()
  //         .select('gm.groupId')
  //         .from(GroupMember, 'gm')
  //         .where('gm.userId = :userId')
  //         .getQuery();
  //       return 'group.id IN ' + subQuery;
  //     })
  //     .setParameter('userId', userId)
  //     .getMany();
  //
  //   return {
  //     message: 'Fetched groups successfully',
  //     code: HttpStatus.OK,
  //     data: groups.map((g) => ({
  //       id: g.id,
  //       name: g.name,
  //       members: g.members.map((gm) => ({
  //         id: gm.userId,
  //         name: gm.user.name,
  //         email: gm.user.email,
  //       })),
  //     })),
  //   };
  // }
  //
  // async inviteUserToGroup(dto: InviteUserDto): Promise<ResponseBase> {
  //   const { groupId, userId } = dto;
  //
  //   const group = await this.groupRepository.findOne({
  //     where: { id: groupId },
  //     relations: ['members', 'members.user'],
  //   });
  //
  //   if (!group) throw new NotFoundException('Group not found');
  //
  //   const user = await this.userRepository.findOneBy({ id: userId });
  //   if (!user) throw new NotFoundException('User not found');
  //
  //   const isAlreadyMember = group.members.some((m) => m.user.id === userId);
  //   if (isAlreadyMember) {
  //     return { message: 'User is already a member', code: HttpStatus.OK };
  //   }
  //
  //   const newMember = new GroupMember();
  //   newMember.userId = user.id;
  //   newMember.group = group;
  //   newMember.user = user;
  //   await this.groupMemberRepository.save(newMember);
  //
  //   return {
  //     message: 'User invited to group successfully',
  //     code: HttpStatus.CREATED,
  //   };
  // }
  //
  // async createExpense(dto: CreateExpenseDto): Promise<ResponseBase> {
  //   const { title, note, amount, payerId, shares, groupId } = dto;
  //
  //   const group = await this.groupRepository.findOne({
  //     where: { id: groupId },
  //     relations: ['members', 'members.user'],
  //   });
  //   if (!group) throw new NotFoundException('Group not found');
  //
  //   const userIdsInGroup = group.members.map((m) => m.user.id);
  //   const shareUserIds = shares.map((s) => s.userId);
  //
  //   // Validate: User phải trong group
  //   for (const uid of shareUserIds) {
  //     if (!userIdsInGroup.includes(uid)) {
  //       throw new BadRequestException('User ${uid} is not in the group');
  //     }
  //   }
  //
  //   if (!userIdsInGroup.includes(payerId)) {
  //     throw new BadRequestException('Payer ${payerId} is not in the group');
  //   }
  //
  //   const payer = await this.userRepository.findOneBy({ id: payerId });
  //   if (!payer) throw new NotFoundException('Payer not found');
  //
  //   const isCustomShare = shares.some((s) => typeof s.shareAmount === 'number');
  //
  //   // Validate: nếu có ít nhất 1 người có shareAmount thì tất cả phải có
  //   if (
  //     isCustomShare &&
  //     shares.some((s) => typeof s.shareAmount !== 'number')
  //   ) {
  //     throw new BadRequestException(
  //       'When using custom shareAmount, all users must provide it.',
  //     );
  //   }
  //
  //   const finalShares = isCustomShare
  //     ? shares.map((s) => ({ ...s, shareAmount: s.shareAmount! }))
  //     : shares.map((s) => ({
  //         ...s,
  //         shareAmount: Math.floor(amount / shares.length),
  //       }));
  //
  //   const totalShared = finalShares.reduce((sum, s) => sum + s.shareAmount, 0);
  //   if (totalShared !== amount) {
  //     throw new BadRequestException(
  //       'Total shared amount $totalShared does not match expense amount (${amount})',
  //     );
  //   }
  //
  //   const expense = this.expenseRepository.create({
  //     title,
  //     note,
  //     amount,
  //     payer,
  //     groupId,
  //     shares: [],
  //   });
  //   await this.expenseRepository.save(expense);
  //
  //   const shareEntities: ExpenseShare[] = [];
  //
  //   for (const share of finalShares) {
  //     const user = await this.userRepository.findOneBy({ id: share.userId });
  //     if (!user) continue;
  //
  //     const shareEntity = this.expenseShareRepository.create({
  //       user,
  //       expense,
  //       shareAmount: share.shareAmount,
  //     });
  //
  //     shareEntities.push(shareEntity);
  //   }
  //
  //   await this.expenseShareRepository.save(shareEntities);
  //
  //   return {
  //     message: 'Expense created successfully',
  //     code: HttpStatus.CREATED,
  //   };
  // }
  //
  // async getExpensesByGroup(groupId: string): Promise<ResponseBase> {
  //   const expenses = await this.expenseRepository.find({
  //     where: { groupId },
  //     relations: ['payer', 'shares', 'shares.user'],
  //     order: { createdAt: 'DESC' },
  //   });
  //
  //   const result = expenses.map((expense) => {
  //     return {
  //       id: expense.id,
  //       title: expense.title,
  //       note: expense.note,
  //       amount: expense.amount,
  //       createdAt: expense.createdAt,
  //       payer: {
  //         id: expense.payer.id,
  //         name: expense.payer.name,
  //         email: expense.payer.email,
  //       },
  //       shares: expense.shares.map((share) => {
  //         const paidAmount =
  //           share.user.id === expense.payer.id ? expense.amount : 0;
  //         const balance = (paidAmount - share.shareAmount).toFixed(2);
  //
  //         return {
  //           user: {
  //             id: share.user.id,
  //             name: share.user.name,
  //             email: share.user.email,
  //           },
  //           shareAmount: share.shareAmount,
  //           paidAmount,
  //           balance,
  //         };
  //       }),
  //     };
  //   });
  //
  //   return {
  //     message: 'Fetched expenses successfully',
  //     code: HttpStatus.OK,
  //     data: result,
  //   };
  // }

  // async getSettleSummary(groupId: string): Promise<ResponseBase> {
  //   const group = await this.groupRepository.findOne({
  //     where: { id: groupId },
  //     relations: ['members', 'members.user'],
  //   });
  //   if (!group) throw new NotFoundException('Group not found');
  //
  //   const expenses = await this.expenseRepository.find({
  //     where: { id: groupId },
  //     relations: ['payer', 'shares', 'shares.user'],
  //   });
  //
  //   const balanceMap = new Map<
  //     number,
  //     { name: string; email: string; totalPaid: number; totalOwed: number }
  //   >();
  //
  //   for (const member of group.members) {
  //     balanceMap.set(member.user.id, {
  //       name: member.user.name,
  //       email: member.user.email,
  //       totalPaid: 0,
  //       totalOwed: 0,
  //     });
  //   }
  //
  //   // for (const expense of expenses) {
  //   //   // Cộng tiền người trả
  //   //   const payerInfo = balanceMap.get(expense.payer.id);
  //   //   if (payerInfo) {
  //   //     payerInfo.totalPaid += expense.amount;
  //   //   }
  //   //
  //   //   // Cộng phần share của từng người
  //   //   for (const share of expense.shares) {
  //   //     const shareInfo = balanceMap.get(share.user.id);
  //   //     if (shareInfo) {
  //   //       shareInfo.totalOwed += share.shareAmount;
  //   //     }
  //   //   }
  //   // }
  //
  //   const result = Array.from(balanceMap.entries()).map(([userId, info]) => ({
  //     userId,
  //     name: info.name,
  //     email: info.email,
  //     totalPaid: parseFloat(info.totalPaid.toFixed(2)),
  //     totalOwed: parseFloat(info.totalOwed.toFixed(2)),
  //     balance: parseFloat((info.totalPaid - info.totalOwed).toFixed(2)),
  //   }));
  //
  //   return {
  //     message: 'Calculated settle balances successfully',
  //     code: HttpStatus.OK,
  //     data: result,
  //   };
  // }

  // async deleteAll(): Promise<ResponseBase> {
  //   await this.groupMemberRepository.delete({});
  //   await this.groupRepository.delete({});
  //
  //   return {
  //     message: 'successfully',
  //     code: HttpStatus.OK,
  //   };
  // }
}
