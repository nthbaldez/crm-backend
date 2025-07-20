import { Controller, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/infra/auth/jwt-auth.guard'

@Controller('/customers')
@UseGuards(JwtAuthGuard)
export class CreateCustomerController {
	@Post()
	async handle() {
		return 'ok'
	}
}
