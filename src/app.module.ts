import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateCustomerController } from './controllers/create-customer.controller'
import { AuthModule } from './infra/auth/auth.module'
import { PrismaService } from './infra/database/prisma/prisma.service'
import { envSchema } from './infra/env'

@Module({
	imports: [
		ConfigModule.forRoot({
			validate: (env) => envSchema.parse(env),
			isGlobal: true,
		}),
		AuthModule,
	],
	controllers: [
		CreateAccountController,
		AuthenticateController,
		CreateCustomerController,
	],
	providers: [PrismaService],
})
export class AppModule {}
