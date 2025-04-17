import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './controller/cats.controller';
import { CatsService } from './controller/cats.service';
import { LoggerMiddleware } from './common/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityModule } from './activity_user/activity.module';
import { FundModule } from './fund/fund.module';
import { CategoryModule } from './category/category.module';
import { WalletModule } from './wallet/wallet.module';
import { BudgetModule } from './budget/budget.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const isSsl = configService.get<boolean>('DATABASE_SSL'); // Get SSL flag from environment variables
        return {
          type: 'postgres',
          host: configService.get('DATABASE_HOST'),
          port: +configService.get<number>('DATABASE_PORT'),
          username: configService.get('DATABASE_USERNAME'),
          password: configService.get('DATABASE_PASSWORD'),
          database: configService.get('DATABASE_NAME'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: false, // Set to false in production
          logging: true, // Enable logging
          logger: 'advanced-console',
          ssl: isSsl
            ? { rejectUnauthorized: false } // Allow self-signed cert
            : false, // Disable SSL if not required
          extra: {
            max: 10, // 👈 tối đa 10 connection
          },
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ActivityModule,
    CategoryModule,
    WalletModule,
    FundModule,
    BudgetModule,
  ],
  controllers: [AppController, CatsController],
  providers: [AppService, CatsService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(CatsController);
  }
}
