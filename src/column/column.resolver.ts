import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ColumnService } from './column.service';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { Task } from '@src/types/graphql';

@Resolver('Column')
export class ColumnResolver {
  constructor(private readonly columnService: ColumnService) {}

  @Mutation('createColumn')
  @UseGuards(JwtAuthGuard)
  create(
    @Args('createColumnInput')
    createColumnInput: Prisma.ColumnCreateInput,
  ) {
    return this.columnService.create(createColumnInput);
  }

  @Query('getAllColumns')
  @UseGuards(JwtAuthGuard)
  findAll(@Args('where') where: Prisma.ColumnWhereInput) {
    return this.columnService.findAll(where);
  }

  @Query('getColumn')
  @UseGuards(JwtAuthGuard)
  findOne(@Args('id') id: number) {
    return this.columnService.findOne({ id });
  }

  @Mutation('updateColumn')
  // @UseGuards(JwtAuthGuard)
  update(
    @Args('id') id: number,
    @Args('updateColumnInput')
    updateColumnInput: Prisma.ColumnUpdateInput,
  ) {
    return this.columnService.update(id, updateColumnInput);
  }

  @Mutation('removeColumn')
  @UseGuards(JwtAuthGuard)
  remove(@Args('id') id: number) {
    return this.columnService.remove({ id });
  }

  // Fields
  @ResolveField(() => [Task])
  tasks(@Parent() column) {
    return this.columnService.tasks(column.id);
  }
}
