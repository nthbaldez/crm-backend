import {
	Body,
	ConflictException,
	Controller,
	Post,
	UseGuards,
} from '@nestjs/common'
import z from 'zod'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayloadSchema } from '@/infra/auth/jwt.strategy'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'

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

		const hasAlreadyExistsCustomerWithThisEmail =
			await this.prisma.customer.findUnique({
				where: {
					email,
				},
			})

		if (hasAlreadyExistsCustomerWithThisEmail) {
			throw new ConflictException('E-mail de cliente já existe.')
		}

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
