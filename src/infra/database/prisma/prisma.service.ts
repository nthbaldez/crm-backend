import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "generated/prisma";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
		try {
			return await this.$connect();
		} catch (error) {
			process.exit(1);
		}
	}

  async onModuleDestroy() {
    return this.$disconnect()   
  }
}
