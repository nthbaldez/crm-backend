import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import { Prisma } from 'generated/prisma'
import * as request from 'supertest'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { MockAuthGuard } from '../../test/utils/mock-auth.guard'
import { AppModule } from '../app.module'

describe('Create Customer Controller (E2E)', () => {
	let app: INestApplication
	let prisma: PrismaService
	let _jwt: JwtService

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		})
			.overrideGuard(JwtAuthGuard)
			.useClass(MockAuthGuard)
			.compile()

		app = module.createNestApplication()

		prisma = module.get(PrismaService)
		_jwt = module.get(JwtService)

		await app.init()
	})

	test('[POST /customers] Criação de cliente', async () => {
		const hashedPassword = await hash('123456', 8)

		const userCreated: Prisma.UserCreateInput = await prisma.user.create({
			data: {
				name: 'John Doe',
				email: 'johndoe@email.com',
				password: hashedPassword,
			},
		})

		const { id } = userCreated

		await request(app.getHttpServer()).post('/login').send({
			email: 'johndoe@email.com',
			password: '123456',
		})

		// const token = jwt.sign({ sub: id })

		MockAuthGuard.userIdToInject = id || ''

		const customerPayload = {
			name: 'Ana Carolina Silva',
			email: 'ana.carolina@example.com',
			phone: '5511987654321',
			birthDate: '1990-05-15',
			street: 'Rua das Flores',
			number: '123',
			complement: 'Apto 45',
			city: 'São Paulo',
			state: 'SP',
			country: 'Brasil',
			zipCode: '01001-000',
		}

		await request(app.getHttpServer())
			.post('/customers')
			// .set('Authorization', `Bearer ${token}`)
			.send(customerPayload)

		const verifyCustomerOnDatabase = await prisma.customer.findUnique({
			where: {
				email: customerPayload.email,
			},
		})

		expect(verifyCustomerOnDatabase).toBeTruthy()
	})

	afterAll(async () => {
		await app.close()
	})
})
