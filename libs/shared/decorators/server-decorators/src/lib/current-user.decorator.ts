import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from '@monotor/interfaces';

export const CurrentUser = createParamDecorator(
  async (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user as UserPayload;
  },
);
