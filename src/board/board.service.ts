import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Board } from '@src/types/graphql';
import { PrismaService } from '@src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BoardService {
  constructor(private prisma: PrismaService) {}
  async create(
    data: Prisma.BoardCreateInput,
    projectId: number,
  ): Promise<Board> {
    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        tasks: true,
        boards: true,
      },
    });

    if (project.boards.length > 0) {
      throw new Error('Project may have only 1 board');
    }

    const taskIds = project.tasks.map((task) => task.id);

    return this.prisma.board.create({
      data: {
        ...data,
        uuid: uuidv4(),
        project: {
          connect: {
            id: projectId,
          },
        },
        tasks: {
          connect: taskIds.map((id) => ({ id })),
        },
        columns: {
          create: [
            {
              title: 'To do',
              tasks: {
                connect: taskIds.map((id) => ({ id })),
              },
            },
            {
              title: 'In progress',
            },
            {
              title: 'Done',
            },
          ],
        },
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
      orderBy: {
        id: 'asc',
      },
    });
  }
}
