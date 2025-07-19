import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { Env } from './infra/env'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const config = new DocumentBuilder()
		.setTitle('CRM Jurídico')
		.setDescription('application protocol inferface of CRM Jurídico')
		.setVersion('1.0')
		.build()

	const documentFactory = () => SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('/api-docs', app, documentFactory)

	const configService: ConfigService<Env, true> = app.get(ConfigService)

	const port = configService.get('PORT', { infer: true })

	await app.listen(port)
}

bootstrap()
