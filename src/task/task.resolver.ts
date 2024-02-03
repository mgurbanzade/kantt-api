import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { CreateTaskInput } from '@src/types/graphql';

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
  findAll(@Args('where') where: Prisma.TaskWhereInput) {
    return this.taskService.findAll(where);
  }

  @Query('getArchivedTasks')
  // @UseGuards(JwtAuthGuard)
  findArchived() {
    return this.taskService.findArchived();
  }

  @Query('getTask')
  @UseGuards(JwtAuthGuard)
  findOne(@Args('uuid') uuid: string) {
    return this.taskService.findOne({ uuid });
  }

  @Mutation('updateTask')
  // @UseGuards(JwtAuthGuard)
  update(
    @Args('uuid') uuid: string,
    @Args('updateTaskInput')
    updateTaskInput: Prisma.TaskUpdateInput,
  ) {
    return this.taskService.update(uuid, updateTaskInput);
  }

  @Mutation('removeTask')
  // @UseGuards(JwtAuthGuard)
  remove(@Args('uuid') uuid: string) {
    return this.taskService.remove({ uuid });
  }

  @Mutation('archiveTask')
  // @UseGuards(JwtAuthGuard, AuthorGuard)
  archive(@Args('uuid') uuid: string) {
    return this.taskService.archive(uuid);
  }

  @Mutation('unarchiveTask')
  // @UseGuards(JwtAuthGuard, AuthorGuard)
  unarchive(@Args('uuid') uuid: string) {
    return this.taskService.unarchive(uuid);
  }

  // Fields
}
