import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/infra/auth/current-user.decorator'
import { UserPayloadSchema } from 'src/infra/auth/jwt.strategy'
import { JwtAuthGuard } from 'src/infra/auth/jwt-auth.guard'
import { PrismaService } from 'src/infra/database/prisma/prisma.service'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import z from 'zod'

const createCustomerBodySchema = z.object({
	name: z.string(),
	email: z.email(),
	phone: z.string(),
	birthDate: z.coerce.date(),
	street: z.string(),
	number: z.string(),
	complement: z.string().optional().nullable(),
	city: z.string(),
	state: z.string(),
	country: z.string(),
	zipCode: z.string().optional().nullable(),
})

type CreateCustomerBodySchema = z.infer<typeof createCustomerBodySchema>

const validationPipe = new ZodValidationPipe(createCustomerBodySchema)

@Controller('/customers')
@UseGuards(JwtAuthGuard)
export class CreateCustomerController {
	constructor(private prisma: PrismaService) {}

	@Post()
	async handle(
		@CurrentUser() user: UserPayloadSchema,
		@Body(validationPipe) body: CreateCustomerBodySchema
	) {
		const { sub } = user
		const {
			name,
			email,
			phone,
			birthDate,
			street,
			number,
			complement,
			city,
			state,
			country,
			zipCode,
		} = body
		// console.log(body)

		await this.prisma.customer.create({
			data: {
				name,
				email,
				phone,
				birthDate,
				street,
				number,
				complement,
				city,
				state,
				country,
				zipCode,
				createdById: sub,
			},
		})
	}
}
