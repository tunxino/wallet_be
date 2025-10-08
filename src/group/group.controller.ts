import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { GroupService } from './group.sevice';
import { CreateExpenseDto, CreateGroupDto, InviteUserDto } from './group.dto';

@Controller('groups')
@UseGuards(AuthGuard) // Bảo vệ tất cả route
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  // Lấy thông tin user hiện tại từ token
  // private getUserId(req: Request): string {
  //   return (req.user as any).id;
  // }

  @Post()
  async createGroup(@Body() dto: CreateGroupDto, @Request() req) {
    return this.groupService.createGroup(dto, req.user.id);
  }

  @Get('/search-users')
  async searchUsers(@Query('keyword') keyword: string, @Request() req) {
    return this.groupService.searchUsers(keyword, req.user.id);
  }

  @Post('/invite')
  async inviteUser(@Body() dto: InviteUserDto) {
    return this.groupService.inviteUserToGroup(dto);
  }

  // @Post('/join')
  // async joinGroup(@Body() dto: JoinGroupDto, @Req() req) {
  //   const userId = req.user.id;
  //   return this.groupService.joinGroup(dto, userId);
  // }

  @Get('/settle-summary')
  getSettleSummary(@Param('groupId') groupId: string) {
    return this.groupService.getSettleSummary(groupId);
  }

  @Get('/expenses')
  getExpenses(@Param('groupId') groupId: string) {
    return this.groupService.getExpensesByGroup(groupId);
  }

  @Post('/createExpense')
  async createExpense(@Body() dto: CreateExpenseDto) {
    return this.groupService.createExpense(dto);
  }

  @Get()
  async getGroups(@Request() req) {
    return this.groupService.getGroupsByUser(req.user.id);
  }
}
