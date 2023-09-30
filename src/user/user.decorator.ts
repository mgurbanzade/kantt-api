// user.decorator.ts
import { createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data, req) => {
  return req.args.find((el) => !!el && !!el.req).req.user;
});
