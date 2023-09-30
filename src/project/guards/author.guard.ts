import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ProjectService } from '../project.service';

@Injectable()
export class AuthorGuard implements CanActivate {
  constructor(private projectService: ProjectService) {}

  async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const requestedUser = request.user;
    const queryVariables = request.body.variables;

    if (!requestedUser || !queryVariables.id) {
      return false;
    }

    const project = await this.projectService.findOne({
      id: Number(queryVariables.id),
    });

    return project.authorId == requestedUser.id;
  }
}
