import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import z from 'zod'
import { logsAdapter } from '@/common/utils/logs.adapter'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayloadSchema } from '@/infra/auth/jwt.strategy'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'

const queryParamsSchema = z
	.string()
	.optional()
	.default('1')
	.transform(Number)
	.pipe(z.number().min(1))

type QueryParamsSchema = z.infer<typeof queryParamsSchema>

const queryValidationPipe = new ZodValidationPipe(queryParamsSchema)

@Controller('/customers')
@UseGuards(JwtAuthGuard)
export class GetCustomersController {
	constructor(private prisma: PrismaService) {}

	@Get()
	async handle(
		@CurrentUser() user: UserPayloadSchema,
		@Query('page', queryValidationPipe) page: QueryParamsSchema
	) {
		logsAdapter.info('Get Customers Controller', user.sub)

		const perPage = 6

		const customers = await this.prisma.customer.findMany({
			take: perPage,
			skip: (page - 1) * perPage,
			where: {
				createdById: user.sub,
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		return { customers }
	}
}
