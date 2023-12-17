import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateTaskInput, Task } from '@src/types/graphql';
import { PrismaService } from '@src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}
  create(createTaskInput: CreateTaskInput): Promise<Task> {
    const { boardId, columnId, projectId, ...rest } = createTaskInput;
    const dynamicBoard = boardId ? { board: { connect: { id: boardId } } } : {};
    const dynamicColumn = columnId
      ? { column: { connect: { id: columnId } } }
      : {};
    const dynamicProject = projectId
      ? { project: { connect: { id: projectId } } }
      : {};

    return this.prisma.task.create({
      data: {
        ...rest,
        uuid: uuidv4(),
        ...dynamicBoard,
        ...dynamicColumn,
        ...dynamicProject,
      },
    });
  }

  createMany(
    data: Prisma.TaskCreateManyInput[],
  ): Prisma.PrismaPromise<Prisma.BatchPayload> {
    return this.prisma.task.createMany({
      data,
    });
  }

  findAll(where: Prisma.TaskWhereInput): Promise<Task[]> {
    return this.prisma.task.findMany({
      where,
    });
  }

  findOne(where: Prisma.TaskWhereUniqueInput): Promise<Task> {
    return this.prisma.task.findUnique({
      where,
    });
  }

  update(id: number, data: Prisma.TaskUpdateInput): Promise<Task> {
    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  remove(where: Prisma.TaskWhereUniqueInput): Promise<Task> {
    return this.prisma.task.delete({
      where,
    });
  }

  // Fields
}
