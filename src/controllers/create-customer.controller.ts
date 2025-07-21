import { Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/infra/auth/current-user.decorator'
import { UserPayloadSchema } from 'src/infra/auth/jwt.strategy'
import { JwtAuthGuard } from 'src/infra/auth/jwt-auth.guard'

@Controller('/customers')
@UseGuards(JwtAuthGuard)
export class CreateCustomerController {
	@Post()
	async handle(@CurrentUser() user: UserPayloadSchema) {
		console.log(user)
	}
}
