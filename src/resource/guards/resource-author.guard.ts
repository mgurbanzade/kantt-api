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
    if (!requestedUser || !queryVariables.where.uuid) {
      return false;
    }

    let resource;

    if (queryVariables.where.uuid === 'ROOT') {
      resource = await this.resourceService.getRootResource(
        requestedUser.userId,
      );
    } else {
      resource = await this.resourceService.findOne({
        uuid: queryVariables.where.uuid,
      });
    }

    return resource.authorId == requestedUser.userId;
  }
}
