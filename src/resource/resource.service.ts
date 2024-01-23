import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  ConnectResourceInput,
  CreateResourceInput,
  Resource,
} from '@src/types/graphql';
import { PrismaService } from '@src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ResourceService {
  constructor(private prisma: PrismaService) {}
  create(
    createResourceInput: CreateResourceInput,
    connectResourceInput: ConnectResourceInput,
  ): Promise<Resource> {
    const { projectId, taskId, parentId } = connectResourceInput;
    const dynamicParent = parentId
      ? { parent: { connect: { id: parentId } } }
      : {};
    const dynamicProject = projectId
      ? {
          project: {
            connect: {
              id: connectResourceInput.projectId,
            },
          },
        }
      : {};

    const dynamicTask = taskId
      ? {
          task: {
            connect: {
              id: connectResourceInput.taskId,
            },
          },
        }
      : {};

    return this.prisma.resource.create({
      data: {
        uuid: uuidv4(),
        ...createResourceInput,
        ...dynamicParent,
        ...dynamicProject,
        ...dynamicTask,
      },
    });
  }

  createMany(
    data: Prisma.ResourceCreateManyInput[],
  ): Prisma.PrismaPromise<Prisma.BatchPayload> {
    return this.prisma.resource.createMany({
      data,
    });
  }

  findAll(where: Prisma.ResourceWhereInput): Promise<Resource[]> {
    return this.prisma.resource.findMany({
      where,
    });
  }

  findOne(where: Prisma.ResourceWhereUniqueInput): Promise<Resource> {
    return this.prisma.resource.findUnique({
      where,
    });
  }

  getRootResource(): Promise<Resource> {
    const where: Prisma.ResourceWhereInput = {
      isRoot: true,
    };

    return this.prisma.resource.findFirst({
      where,
    });
  }

  update(id: number, data: Prisma.ResourceUpdateInput): Promise<Resource> {
    return this.prisma.resource.update({
      where: { id },
      data,
    });
  }

  remove(where: Prisma.ResourceWhereUniqueInput): Promise<Resource> {
    return this.prisma.resource.delete({
      where,
    });
  }

  // Fields
  project(resourceId: number): Promise<Resource> {
    return this.prisma.resource
      .findUnique({ where: { id: resourceId } })
      .project();
  }

  task(resourceId: number): Promise<Resource> {
    return this.prisma.resource
      .findUnique({ where: { id: resourceId } })
      .task();
  }

  subResources(resourceId: number): Promise<Resource[]> {
    return this.prisma.resource
      .findUnique({ where: { id: resourceId } })
      .subResources();
  }
}
