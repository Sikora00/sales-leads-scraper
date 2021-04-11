import { Module, OnModuleInit } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import dbConfig from '../db/configuration';
import { MikroORM } from '@mikro-orm/core';

@Module({
  imports: [
    ConfigModule.forFeature(dbConfig),
    MikroOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const { database, type, port, username, password } = configService.get(
          'database'
        );

        return {
          autoLoadEntities: true,
          dbName: database,
          type,
          port,
          user: username,
          password,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class MikroOrmRootModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}
  async onModuleInit(): Promise<void> {
    const generator = this.orm.getSchemaGenerator();
    await generator.updateSchema();
  }
}
