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
import { BoardService } from './board.service';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { Column } from '@src/types/graphql';

@Resolver('Board')
export class BoardResolver {
  constructor(private readonly boardService: BoardService) {}

  @Mutation('createBoard')
  @UseGuards(JwtAuthGuard)
  create(
    @Args('createBoardInput')
    createBoardInput: Prisma.BoardCreateInput,
  ) {
    return this.boardService.create(createBoardInput);
  }

  @Query('getAllBoards')
  @UseGuards(JwtAuthGuard)
  findAll(@Args('where') where: Prisma.BoardWhereInput) {
    return this.boardService.findAll(where);
  }

  @Query('getBoard')
  // @UseGuards(JwtAuthGuard)
  findOne(@Args('id') id: number) {
    return this.boardService.findOne({ id });
  }

  @Mutation('updateBoard')
  @UseGuards(JwtAuthGuard)
  update(
    @Args('id') id: number,
    @Args('updateBoardInput')
    updateBoardInput: Prisma.BoardUpdateInput,
  ) {
    return this.boardService.update(id, updateBoardInput);
  }

  @Mutation('removeBoard')
  @UseGuards(JwtAuthGuard)
  remove(@Args('id') id: number) {
    return this.boardService.remove({ id });
  }

  // Fields
  @ResolveField(() => [Column])
  columns(@Parent() board) {
    return this.boardService.columns(board.id);
  }
}
