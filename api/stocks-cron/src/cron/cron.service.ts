import { Inject, Injectable } from '@nestjs/common';
import { Client, ClientProxy, ClientRedis, ClientsModule, RedisContext, Transport } from '@nestjs/microservices';
import { RedisClient } from '@nestjs/microservices/external/redis.interface';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Subject } from 'rxjs';
import { RedisService } from 'src/cron/redis.service';
import * as yf from 'yahoo-finance';

@Injectable()
export class CronService {
    constructor(@Inject(RedisService) private readonly redisClient: RedisService) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'Asia/Seoul' })
    async updateTops() {}

    @Cron(CronExpression.EVERY_SECOND)
    async updatePrice() {
        const pong = this.redisClient.ping();

        const getTest = this.redisClient.get('test');
    }
}
