import { HttpService, Injectable, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company, MarketType } from 'src/entities/company.entity';
import { Like, Repository } from 'typeorm';
import { GetCompanyInfoBySearchDTO, GetCompanyInfoResponse } from './dto/company.dto';
import { Price } from './dto/price.dto';

import * as yf from 'yahoo-finance';
import { ERROR, throwError } from 'src/common/error.common';

@Injectable()
export class InfoService {
    constructor(
        @InjectRepository(Company, 'stocks') private readonly companies: Repository<Company>,
        private readonly http: HttpService,
    ) {}

    async getInfo(code: String): Promise<GetCompanyInfoResponse> {
        try {
            const company = await this.companies.findOne({
                where: {
                    code: code,
                },
            });

            if (!company) {
                throw new Error('PRICE_INFO_NOT_FOUND');
            }

            const price = await this.getPrice(company);

            if (!price) {
                throw new Error('PRICE_INFO_NOT_FOUND');
            }
            return {
                company: company,
                price: price,
            };
        } catch (err) {
            console.error(err);
            if (Object.keys(ERROR).includes(err.message)) {
                throwError(err.message);
            } else {
                throwError('INTERNAL_SERVER_ERROR');
            }
        }
    }

    async getSearch(getCompanyInfoBySearchDTO: GetCompanyInfoBySearchDTO): Promise<GetCompanyInfoResponse[]> {
        try {
            const where = {};

            where['type'] = MarketType.KOSDAQ;

            const key = Object.getOwnPropertyNames(getCompanyInfoBySearchDTO).filter((key) => {
                return key != 'type';
            })[0];

            where[`${key}`] = Like(`%${getCompanyInfoBySearchDTO[key]}%`);

            const search = await this.companies.find({
                where: where,
            });

            let result = [];

            for await (const company of search) {
                const price = await this.getPrice(company);

                result.push({
                    company: company,
                    price: price,
                });
            }

            return result;
        } catch (err) {
            console.error(err);
            if (Object.keys(ERROR).includes(err.message)) {
                throwError(err.message);
            } else {
                throwError('INTERNAL_SERVER_ERROR');
            }
        }
        return;
    }
    async getPrice(company: Company): Promise<Price> {
        const symbol = company.code + '.' + (company.type === MarketType.KOSPI ? 'KS' : 'KQ');

        const result = await yf
            .quote({
                symbol: symbol,
                modules: ['price'],
            })
            .then((res) => {
                return res;
            })
            .catch((err) => {
                console.error(err);
                throw new Error('GET_PRICE_FAILED');
            });

        try {
            const price = new Price();

            price.date = new Date(result.price.regularMarketTime);
            price.date.setHours(price.date.getHours() + 9);
            price.date.setMinutes(price.date.getMinutes() + 20);

            price.now = result.price.regularMarketPrice;
            price.low = result.price.regularMarketDayLow;
            price.high = result.price.regularMarketDayHigh;
            price.previous = result.price.regularMarketPreviousClose;
            price.volume = result.price.regularMarketVolume;

            return price;
        } catch (err) {
            console.error(err);
            throwError('GET_PRICE_FAILED');
        }
        return;
    }
}
