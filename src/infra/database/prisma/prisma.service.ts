import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from 'generated/prisma'
import { logsAdapter } from 'src/common/utils/logs.adapter'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	async onModuleInit() {
		try {
			await this.$connect()

			return logsAdapter.success('Database', 'Database connected')
		} catch (error) {
			logsAdapter.error(
				'Database',
				`Error connecting to database: ${error.message}`
			)
			process.exit(1)
		}
	}

	async onModuleDestroy() {
		return this.$disconnect()
	}
}
