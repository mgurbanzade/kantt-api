import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { Project } from '@src/types/graphql';
import { PrismaService } from '@src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}
  create(data: Prisma.ProjectCreateInput): Promise<Project> {
    return this.prisma.project.create({
      data: {
        ...data,
        uuid: uuidv4(),
      },
    });
  }

  findAll(where: Prisma.ProjectWhereInput): Promise<Project[]> {
    return this.prisma.project.findMany({
      where,
    });
  }

  findOne(where: Prisma.ProjectWhereUniqueInput): Promise<Project> {
    return this.prisma.project.findUnique({
      where,
    });
  }

  update(id: number, data: Prisma.ProjectUpdateInput): Promise<Project> {
    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  remove(where: Prisma.ProjectWhereUniqueInput): Promise<Project> {
    return this.prisma.project.delete({
      where,
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
}
