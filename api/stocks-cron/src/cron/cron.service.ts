import { Inject, Injectable } from '@nestjs/common';
import { Client, ClientProxy, ClientRedis, ClientsModule, RedisContext, Transport } from '@nestjs/microservices';
import { RedisClient } from '@nestjs/microservices/external/redis.interface';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from 'rxjs';
import { RedisService } from 'src/cron/redis.service';
import { Company, MarketType } from 'src/entities/company.entity';
import { CustomRepositoryCannotInheritRepositoryError, Repository } from 'typeorm';
import * as yf from 'yahoo-finance';
import { GetCompanyInfoResponse } from './dto/info.dto';
import { Price } from './dto/price.dto';
import { FinanceService } from './finance.service';

@Injectable()
export class CronService {
    constructor(
        @Inject(RedisService) private readonly redisClient: RedisService,
        @InjectRepository(Company, 'stocks') private readonly companies: Repository<Company>,
        @Inject(FinanceService) private readonly finance: FinanceService,
    ) {}

    private running: boolean = false;
    private runningTest: boolean = false;

    // @Cron(CronExpression.EVERY_SECOND)
    // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'Asia/Seoul' })
    async update() {
        try {
            if (this.runningTest) {
                return;
            }
            this.runningTest = true;

            console.log('Redis Main Update Start');

            const companies = await this.companies.find();

            let kospi = [];
            let kosdaq = [];

            let testCount = 0;
            for await (const company of companies) {
                testCount += 1;
                const price = await this.finance.price(company);

                if (!price) {
                    continue;
                }

                const companyInfo = {
                    company: company,
                    price: price,
                };

                company.type === MarketType.KOSPI ? kospi.push(companyInfo) : kosdaq.push(companyInfo);

                if (testCount > 20) {
                    break;
                }
            }

            const kospiTops = kospi
                .sort((a: GetCompanyInfoResponse, b: GetCompanyInfoResponse) => b.price.volume - a.price.volume)
                .slice(0, 100);

            const kosdaqTops = kosdaq
                .sort((a: GetCompanyInfoResponse, b: GetCompanyInfoResponse) => b.price.volume - a.price.volume)
                .slice(0, 100);

            console.log('KOSPI update start');
            await this.redisClient.del('KOSPI');
            await this.redisClient.lset('KOSPI', kospi);

            console.log('KOSPI-TOPS update start');
            await this.redisClient.del('KOSPI-TOPS');
            await this.redisClient.lset('KOSPI-TOPS', kospiTops);

            console.log('KOSDAQ update start');
            await this.redisClient.del('KOSDAQ');
            await this.redisClient.lset('KOSDAQ', kosdaq);

            console.log('KOSDAQ-TOPS update start');
            await this.redisClient.del('KOSDAQ-TOPS');
            await this.redisClient.lset('KOSDAQ-TOPS', kosdaqTops);

            console.log('Redis Main Update Finished');
        } catch (err) {}
    }

    @Cron('* * 9-16 * * 1-5', { timeZone: 'Asia/Seoul' })
    async updatePrice() {
        if (this.running) {
            return;
        }

        this.running = true;

        // Do Something
        const kospiTops = await this.redisClient.lrange('KOSPI-TOPS', 0, -1);
        const kosdaqTops = await this.redisClient.lrange('KOSDAQ-TOPS', 0, -1);

        console.log(kospiTops);
        console.log(kosdaqTops);

        //
        // this.running = false;
    }
}
