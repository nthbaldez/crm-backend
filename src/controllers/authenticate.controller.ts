import { Controller, Post } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Controller('/login')
export class AuthenticateController {
	constructor(private jwt: JwtService) {}

	@Post('/')
	// @HttpCode(201)
	async handle() {
		const token = this.jwt.sign({ sub: 'user-id' })

		return token
	}
}
