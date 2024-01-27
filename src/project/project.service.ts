import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { Project } from '@src/types/graphql';
import { PrismaService } from '@src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}
  create(
    data: Prisma.ProjectCreateInput,
    areaIds: number[],
    parentId?: number,
  ): Promise<Project> {
    const dynamicAreas = areaIds
      ? { connect: areaIds.map((id) => ({ id })) }
      : {};

    const dynamicParent = parentId ? { connect: { id: parentId } } : {};

    return this.prisma.project.create({
      data: {
        ...data,
        uuid: uuidv4(),
        emoji: '👋',
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

  findAll(where: Prisma.ProjectWhereInput): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: {
        ...where,
        isArchived: false,
      },
    });
  }

  findArchived(): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: {
        isArchived: true,
      },
    });
  }

  findOne(where: Prisma.ProjectWhereUniqueInput): Promise<Project> {
    return this.prisma.project.findUnique({
      where,
    });
  }

  update(
    id: number,
    data: Prisma.ProjectUpdateInput,
    areaIds: number[],
  ): Promise<Project> {
    const dynamicAreas = areaIds
      ? { areas: { set: areaIds.map((id) => ({ id })) } }
      : {};
    return this.prisma.project.update({
      where: { id },
      data: {
        ...data,
        ...dynamicAreas,
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

  archive(id: number): Promise<Project> {
    return this.prisma.project.update({
      where: { id },
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

  unarchive(id: number): Promise<Project> {
    return this.prisma.project.update({
      where: { id },
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
        id: 'asc',
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
}
