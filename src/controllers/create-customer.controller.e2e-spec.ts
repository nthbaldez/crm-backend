import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import * as request from 'supertest'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { MockAuthGuard } from '../../test/utils/mock-auth.guard'
import { AppModule } from '../app.module'

describe('Create Customer Controller (E2E)', () => {
	let app: INestApplication
	let prisma: PrismaService

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		})
			.overrideGuard(JwtAuthGuard)
			.useClass(MockAuthGuard)
			.compile()

		app = module.createNestApplication()
		prisma = module.get(PrismaService)

		await app.init()
	})

	test('[POST /customers] Criação de cliente', async () => {
		const hashedPassword = await hash('123456', 8)

		await prisma.user.create({
			data: {
				name: 'John Doe',
				email: 'johndoe@email.com',
				password: hashedPassword,
			},
		})

		await request(app.getHttpServer()).post('/login').send({
			email: 'johndoe@email.com',
			password: '123456',
		})

		const customerPayload = {
			name: 'Ana Carolina Silva',
			email: 'ana.carolina@example.com',
			phone: '5511987654321', // Exemplo de telefone com DDI e DDD
			birthDate: '1990-05-15', // Formato YYYY-MM-DD
			street: 'Rua das Flores',
			number: '123',
			complement: 'Apto 45',
			city: 'São Paulo',
			state: 'SP',
			country: 'Brasil',
			zipCode: '01001-000', // Exemplo de CEP
		}

		const response = await request(app.getHttpServer())
			.post('/customers')
			.send(customerPayload)

		console.log(response.statusCode)

		// const verifyCustomerOnDatabase = await prisma.customer.findUnique({
		// 	where: {
		// 		email: customerPayload.email,
		// 	},
		// })

		// console.log(verifyCustomerOnDatabase)
		// expect(verifyCustomerOnDatabase).toBeTruthy()
	})

	// test('[POST /accounts] Deve retornar status 409', () => {
	// 	return request(app.getHttpServer())
	// 		.post('/accounts')
	// 		.send({
	// 			name: 'John Doe',
	// 			email: 'johndoe@email.com',
	// 			password: '123456',
	// 		})
	// 		.expect(409)
	// })

	afterAll(async () => {
		await app.close()
	})
})
