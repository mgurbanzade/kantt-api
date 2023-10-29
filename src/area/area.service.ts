import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Area, Project } from '@src/types/graphql';
import { PrismaService } from '@src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AreaService {
  constructor(private prisma: PrismaService) {}
  create(data: Prisma.AreaCreateInput): Promise<Area> {
    return this.prisma.area.create({
      data: {
        ...data,
        uuid: uuidv4(),
      },
    });
  }

  findAll(where: Prisma.AreaWhereInput): Promise<Area[]> {
    return this.prisma.area.findMany({
      where,
    });
  }

  findOne(where: Prisma.AreaWhereUniqueInput): Promise<Area> {
    return this.prisma.area.findUnique({
      where,
    });
  }

  update(id: number, data: Prisma.AreaUpdateInput): Promise<Area> {
    return this.prisma.area.update({
      where: { id },
      data,
    });
  }

  remove(where: Prisma.AreaWhereUniqueInput): Promise<Area> {
    return this.prisma.area.delete({
      where,
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
