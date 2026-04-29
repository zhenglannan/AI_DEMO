import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    const prismaClient = this as PrismaClient & {
      $on(eventType: 'beforeExit', callback: () => Promise<void>): void;
    };

    prismaClient.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
