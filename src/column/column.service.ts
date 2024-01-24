import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Column, CreateColumnInput } from '@src/types/graphql';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class ColumnService {
  constructor(private prisma: PrismaService) {}
  create(data: CreateColumnInput): Promise<Column> {
    const { boardId, ...rest } = data;
    return this.prisma.column.create({
      data: {
        ...rest,
        board: {
          connect: {
            id: boardId,
          },
        },
      },
    });
  }

  createMany(
    data: Prisma.ColumnCreateManyInput,
  ): Prisma.PrismaPromise<Prisma.BatchPayload> {
    return this.prisma.column.createMany({
      data,
    });
  }

  findAll(where: Prisma.ColumnWhereInput): Promise<Column[]> {
    return this.prisma.column.findMany({
      where,
    });
  }

  findOne(where: Prisma.ColumnWhereUniqueInput): Promise<Column> {
    return this.prisma.column.findUnique({
      where,
    });
  }

  update(id: number, data: Prisma.ColumnUpdateInput): Promise<Column> {
    return this.prisma.column.update({
      where: { id },
      data,
    });
  }

  remove(where: Prisma.ColumnWhereUniqueInput): Promise<Column> {
    return this.prisma.column.delete({
      where,
    });
  }

  // Fields
  tasks(columnId: number) {
    return this.prisma.task.findMany({
      where: {
        columnId,
        isArchived: false,
      },
    });
  }
}
