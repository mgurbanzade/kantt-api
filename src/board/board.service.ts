import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Board } from '@src/types/graphql';
import { PrismaService } from '@src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BoardService {
  constructor(private prisma: PrismaService) {}
  create(data: Prisma.BoardCreateInput): Promise<Board> {
    return this.prisma.board.create({
      data: {
        ...data,
        uuid: uuidv4(),
      },
      include: {
        columns: true,
      },
    });
  }

  findAll(where: Prisma.BoardWhereInput): Promise<Board[]> {
    return this.prisma.board.findMany({
      where,
    });
  }

  findOne(where: Prisma.BoardWhereUniqueInput): Promise<Board> {
    return this.prisma.board.findUnique({
      where,
    });
  }

  update(id: number, data: Prisma.BoardUpdateInput): Promise<Board> {
    return this.prisma.board.update({
      where: { id },
      data,
    });
  }

  remove(where: Prisma.BoardWhereUniqueInput): Promise<Board> {
    return this.prisma.board.delete({
      where,
    });
  }

  // Fields
  columns(boardId: number) {
    return this.prisma.column.findMany({
      where: {
        boardId,
      },
    });
  }
}
