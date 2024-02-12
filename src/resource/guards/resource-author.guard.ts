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
    const uuid = queryVariables.uuid || queryVariables.where.uuid;

    if (!requestedUser || !uuid) {
      return false;
    }

    let resource;

    if (uuid === 'ROOT') {
      resource = await this.resourceService.getRootResource(
        requestedUser.userId,
      );
    } else {
      resource = await this.resourceService.findOne({
        uuid,
      });
    }

    return resource.authorId == requestedUser.userId;
  }
}
