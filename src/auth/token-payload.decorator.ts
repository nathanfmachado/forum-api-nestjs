import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { TokenPayloadModel } from './jwt.strategy';

export const TokenPayload = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return request.user as TokenPayloadModel;
  },
);
