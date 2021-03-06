import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientRedis, ClientsModule, Transport } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { RedisService } from 'src/cron/redis.service';
import { Company } from 'src/entities/company.entity';
import { CronService } from './cron.service';
import { FinanceService } from './finance.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Company], 'stocks'),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev',
            validationSchema: Joi.object({
                REDIS_HOST: Joi.string().required(),
                REDIS_PORT: Joi.string().optional(),
                REDIS_PASSWORD: Joi.string().required(),
            }),
        }),
        ClientsModule.register([
            {
                name: 'redis',
                transport: Transport.REDIS,
                options: {
                    host: process.env.REDIS_HOST,
                    password: process.env.REDIS_PASSWORD,
                },
            },
        ]),
    ],
    providers: [CronService, RedisService, FinanceService],
})
export class CronModule {}
