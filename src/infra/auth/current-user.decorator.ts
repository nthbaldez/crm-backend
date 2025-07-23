import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserPayloadSchema } from './jwt.strategy'

export const CurrentUser = createParamDecorator(
	(_: never, context: ExecutionContext): UserPayloadSchema => {
		const request = context.switchToHttp().getRequest()
		return request.user
	}
)
