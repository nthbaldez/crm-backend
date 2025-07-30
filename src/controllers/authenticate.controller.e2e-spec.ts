import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import * as request from 'supertest'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AppModule } from '../app.module'

describe('Authenticate Controller (E2E)', () => {
	let app: INestApplication
	let prisma: PrismaService

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile()

		app = module.createNestApplication()
		prisma = module.get(PrismaService)

		await app.init()
	})

	test('[POST /login] Autenticação de Usuário', async () => {
		const hashedPassword = await hash('123456', 8)

		await prisma.user.create({
			data: {
				name: 'John Doe',
				email: 'johndoe@email.com',
				password: hashedPassword,
			},
		})

		const response = await request(app.getHttpServer()).post('/login').send({
			email: 'johndoe@email.com',
			password: '123456',
		})

		expect(response.statusCode).toBe(201)
		expect(response.body).toEqual({
			access_token: expect.any(String),
		})
	})

	test('[POST /sessions] Deve retornar status 401', () => {
		return request(app.getHttpServer())
			.post('/login')
			.send({
				email: 'johndoe@email.com',
				password: '1234568888',
			})
			.expect(401)
	})

	afterAll(async () => {
		await app.close()
	})
})
