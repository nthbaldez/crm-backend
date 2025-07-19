import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CreateAccountController } from './controllers/create-account.controller'
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
	controllers: [CreateAccountController],
	providers: [PrismaService],
})
export class AppModule {}
