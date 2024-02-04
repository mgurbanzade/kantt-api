import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AreaService } from '../area.service';

@Injectable()
export class AreaAuthorGuard implements CanActivate {
  constructor(private areaService: AreaService) {}

  async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const requestedUser = request.user;
    const queryVariables = request.body.variables;

    if (!requestedUser || !queryVariables.uuid) {
      return false;
    }

    const area = await this.areaService.findOne({
      uuid: queryVariables.uuid,
    });

    return area.authorId == requestedUser.userId;
  }
}
