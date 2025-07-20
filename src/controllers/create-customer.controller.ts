import { Controller, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Controller('/customers')
@UseGuards(AuthGuard('jwt'))
export class CreateCustomerController {
	@Post()
	async handle() {
		return 'ok'
	}
}
