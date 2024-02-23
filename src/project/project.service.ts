import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { Project, TasksOrdersInput } from '@src/types/graphql';
import { PrismaService } from '@src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

type CreateProjectParams = {
  data: Prisma.ProjectCreateInput;
  areaIds: number[];
  authorId: number;
  parentId?: number;
};

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}
  create({
    data,
    areaIds,
    authorId,
    parentId,
  }: CreateProjectParams): Promise<Project> {
    const dynamicAreas = areaIds
      ? { connect: areaIds.map((id) => ({ id })) }
      : {};

    const dynamicParent = parentId ? { connect: { id: parentId } } : {};

    return this.prisma.project.create({
      data: {
        ...data,
        uuid: uuidv4(),
        emoji: '👋',
        author: {
          connect: {
            id: authorId,
          },
        },
        parent: {
          ...dynamicParent,
        },
        areas: {
          ...dynamicAreas,
        },
        boards: {
          create: {
            uuid: uuidv4(),
            title: 'Board',
            columns: {
              create: [
                {
                  title: 'Todo',
                },
                {
                  title: 'In Progress',
                },
                {
                  title: 'Done',
                },
              ],
            },
          },
        },
      },
    });
  }

  findAll(
    where: Prisma.ProjectWhereInput,
    authorId: number,
  ): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: {
        ...where,
        isArchived: false,
        authorId,
      },
    });
  }

  findArchived({ authorId }: { authorId: number }): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: {
        isArchived: true,
        authorId,
      },
    });
  }

  findOne(where: Prisma.ProjectWhereUniqueInput): Promise<Project> {
    return this.prisma.project.findUnique({
      where,
    });
  }

  update(
    uuid: string,
    data: Prisma.ProjectUpdateInput,
    areaIds: number[],
  ): Promise<Project> {
    const dynamicAreas = areaIds
      ? { areas: { set: areaIds.map((id) => ({ id })) } }
      : {};
    return this.prisma.project.update({
      where: { uuid },
      data: {
        ...data,
        ...dynamicAreas,
      },
    });
  }

  async updateTasksOrders(
    uuid: string,
    data: TasksOrdersInput[],
  ): Promise<Project> {
    console.log({ data });
    return this.prisma.project.update({
      where: { uuid },
      data: {
        tasks: {
          updateMany: data.map((task) => {
            const { id, ...data } = task;

            return {
              where: {
                id,
              },
              data,
            };
          }),
        },
      },
    });
  }

  remove(where: Prisma.ProjectWhereUniqueInput): Promise<Project> {
    return this.prisma.project.delete({
      where,
      include: {
        boards: true,
      },
    });
  }

  archive(uuid: string): Promise<Project> {
    return this.prisma.project.update({
      where: { uuid },
      data: {
        isArchived: true,
        subprojects: {
          updateMany: {
            where: {
              isArchived: false,
            },
            data: {
              isArchived: true,
            },
          },
        },
      },
    });
  }

  unarchive(uuid: string): Promise<Project> {
    return this.prisma.project.update({
      where: { uuid },
      data: {
        isArchived: false,
      },
    });
  }

  // Fields
  author(id: number): Promise<User> {
    if (!id) return null;
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  boards(projectId: number) {
    return this.prisma.board.findMany({
      where: {
        projectId,
      },
    });
  }

  areas(projectId: number) {
    return this.prisma.project
      .findUnique({
        where: {
          id: projectId,
        },
      })
      .areas();
  }

  tasks(projectId: number) {
    return this.prisma.task.findMany({
      where: {
        projectId,
        isArchived: false,
      },
      orderBy: {
        listOrder: 'asc',
      },
    });
  }

  subprojects(id: number) {
    if (!id) return null;
    return this.prisma.project
      .findUnique({
        where: { id },
      })
      .subprojects();
  }

  resources(projectId: number) {
    return this.prisma.resource.findMany({
      where: {
        projectId,
      },
    });
  }
}
