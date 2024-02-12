import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { CreateTaskInput } from '@src/types/graphql';
import { CurrentUser } from '@src/user/user.decorator';
import { TaskAuthorGuard } from './guards/task-author.guard';
import { TaskService } from './task.service';

@Resolver('Task')
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Mutation('createTask')
  @UseGuards(JwtAuthGuard)
  create(
    @Args('createTaskInput')
    createTaskInput: CreateTaskInput,
  ) {
    return this.taskService.create(createTaskInput);
  }

  @Query('getAllTasks')
  @UseGuards(JwtAuthGuard)
  findAll(
    @Args('where') where: Prisma.TaskWhereInput,
    @CurrentUser() user: { userId: number },
  ) {
    return this.taskService.findAll(where, user.userId);
  }

  @Query('getArchivedTasks')
  @UseGuards(JwtAuthGuard)
  findArchived(@CurrentUser() user: { userId: number }) {
    return this.taskService.findArchived(user.userId);
  }

  @Query('getTask')
  @UseGuards(JwtAuthGuard, TaskAuthorGuard)
  findOne(@Args('uuid') uuid: string) {
    return this.taskService.findOne({ uuid });
  }

  @Mutation('updateTask')
  @UseGuards(JwtAuthGuard, TaskAuthorGuard)
  update(
    @Args('uuid') uuid: string,
    @Args('updateTaskInput')
    updateTaskInput: Prisma.TaskUpdateInput,
  ) {
    return this.taskService.update(uuid, updateTaskInput);
  }

  @Mutation('removeTask')
  @UseGuards(JwtAuthGuard, TaskAuthorGuard)
  remove(@Args('uuid') uuid: string) {
    return this.taskService.remove({ uuid });
  }

  @Mutation('archiveTask')
  @UseGuards(JwtAuthGuard, TaskAuthorGuard)
  archive(@Args('uuid') uuid: string) {
    return this.taskService.archive(uuid);
  }

  @Mutation('unarchiveTask')
  @UseGuards(JwtAuthGuard, TaskAuthorGuard)
  unarchive(@Args('uuid') uuid: string) {
    return this.taskService.unarchive(uuid);
  }
}
