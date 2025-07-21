import {
	Body,
	Controller,
	HttpCode,
	Post,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ApiOperation } from '@nestjs/swagger'
import { compare } from 'bcryptjs'
import { PrismaService } from 'src/infra/database/prisma/prisma.service'
import z from 'zod'

const authenticateBodySchema = z.object({
	email: z.email(),
	password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/login')
export class AuthenticateController {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService
	) {}

	@ApiOperation({
		description: 'Login de usuário na plataforma',
	})
	@Post('/')
	@HttpCode(201)
	async handle(@Body() body: AuthenticateBodySchema) {
		const { email, password } = body

		const user = await this.prisma.user.findUnique({
			where: {
				email,
			},
		})

		if (!user) {
			throw new UnauthorizedException('Crendenciais invállidas.')
		}

		const isPasswordValid = await compare(password, user.password)

		if (!isPasswordValid) {
			throw new UnauthorizedException('Crendenciais invállidas.')
		}

		const accessToken = this.jwt.sign({ sub: user.id })

		return {
			access_token: accessToken,
		}
	}
}
