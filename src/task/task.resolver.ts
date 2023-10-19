import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';

@Resolver('Task')
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Mutation('createTask')
  @UseGuards(JwtAuthGuard)
  create(
    @Args('createTaskInput')
    createTaskInput: Prisma.TaskCreateInput,
  ) {
    return this.taskService.create(createTaskInput);
  }

  @Query('getAllTasks')
  @UseGuards(JwtAuthGuard)
  findAll(@Args('where') where: Prisma.TaskWhereInput) {
    return this.taskService.findAll(where);
  }

  @Query('getTask')
  @UseGuards(JwtAuthGuard)
  findOne(@Args('uuid') uuid: string) {
    return this.taskService.findOne({ uuid });
  }

  @Mutation('updateTask')
  // @UseGuards(JwtAuthGuard)
  update(
    @Args('id') id: number,
    @Args('updateTaskInput')
    updateTaskInput: Prisma.TaskUpdateInput,
  ) {
    return this.taskService.update(id, updateTaskInput);
  }

  @Mutation('removeTask')
  @UseGuards(JwtAuthGuard)
  remove(@Args('id') id: number) {
    return this.taskService.remove({ id });
  }

  // Fields
}
