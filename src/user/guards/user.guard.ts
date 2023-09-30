import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class UserGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const requestedUser = request.user;
    const queryVariables = request.body.variables;

    if (!requestedUser || !queryVariables.id) {
      return false;
    }

    return queryVariables.id === requestedUser.userId;
  }
}
