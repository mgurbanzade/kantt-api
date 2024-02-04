import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ResourceService } from '../resource.service';

@Injectable()
export class ResourceAuthorGuard implements CanActivate {
  constructor(private resourceService: ResourceService) {}

  async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const requestedUser = request.user;
    const queryVariables = request.body.variables;

    if (!requestedUser || !queryVariables.uuid) {
      return false;
    }

    const resource = await this.resourceService.findOne({
      uuid: queryVariables.uuid,
    });

    return resource.authorId == requestedUser.userId;
  }
}
