import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class TaskAuthorGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const requestedUser = request.user;
    const queryVariables = request.body.variables;
    const uuid = queryVariables.uuid || queryVariables.where.uuid;

    if (!requestedUser || !uuid) {
      return false;
    }

    const task = await this.prisma.task.findUnique({
      where: { uuid },
      include: { project: true },
    });

    return task.project.authorId == requestedUser.userId;
  }
}
