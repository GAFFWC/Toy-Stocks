import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CronModule } from './cron/cron.module';
import * as Joi from 'joi';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron/cron.service';
import { ClientRedis, ClientsModule, RedisContext, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev',
            validationSchema: Joi.object({
                DB_HOST: Joi.string().required(),
                DB_PORT: Joi.string().required(),
                DB_USERNAME: Joi.string().required(),
                DB_PASSWORD: Joi.string().required(),
                DB_NAME: Joi.string().required(),
                DB_CHARSET: Joi.string().required(),
                DB_TIMEZONE: Joi.string().required(),
            }),
        }),
        TypeOrmModule.forRoot({
            name: process.env.DB_NAME,
            type: 'mysql',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            charset: process.env.DB_CHARSET,
            timezone: process.env.DB_TIMEZONE,
            synchronize: true,
            logging: true,
            entities: [__dirname + '/entities/*{.ts,.js}'],
        }),

        ScheduleModule.forRoot(),
        CronModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
