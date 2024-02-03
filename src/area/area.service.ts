import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Area, Project } from '@src/types/graphql';
import { PrismaService } from '@src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AreaService {
  constructor(private prisma: PrismaService) {}
  create(data: Prisma.AreaCreateInput, authorId: number): Promise<Area> {
    return this.prisma.area.create({
      data: {
        ...data,
        author: {
          connect: {
            id: authorId,
          },
        },
        uuid: uuidv4(),
        emoji: '🎁',
      },
    });
  }

  findAll(where: Prisma.AreaWhereInput): Promise<Area[]> {
    return this.prisma.area.findMany({
      where: {
        isArchived: false,
        ...where,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findArchived(): Promise<Area[]> {
    return this.prisma.area.findMany({
      where: {
        isArchived: true,
      },
    });
  }

  findOne(where: Prisma.AreaWhereUniqueInput): Promise<Area> {
    return this.prisma.area.findUnique({
      where,
    });
  }

  update(uuid: string, data: Prisma.AreaUpdateInput): Promise<Area> {
    return this.prisma.area.update({
      where: { uuid },
      data,
    });
  }

  remove(where: Prisma.AreaWhereUniqueInput): Promise<Area> {
    return this.prisma.area.delete({
      where,
    });
  }

  archive(uuid: string): Promise<Area> {
    return this.prisma.area.update({
      where: { uuid },
      data: {
        isArchived: true,
      },
    });
  }

  unarchive(uuid: string): Promise<Area> {
    return this.prisma.area.update({
      where: { uuid },
      data: {
        isArchived: false,
      },
    });
  }

  // Fields
  parent(parentId: number): Promise<Area> {
    if (!parentId) return null;
    return this.prisma.area.findUnique({
      where: { id: parentId },
    });
  }

  projects(id: number): Promise<Project[]> {
    if (!id) return null;
    return this.prisma.area
      .findUnique({
        where: { id },
      })
      .projects();
  }

  subareas(id: number) {
    if (!id) return null;
    return this.prisma.area
      .findUnique({
        where: { id },
      })
      .subareas();
  }
}
