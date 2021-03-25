import { HttpService, Injectable, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { Like, Repository } from 'typeorm';
import { GetCompanyInfoBySearchDTO, GetCompanyInfoResponse } from './dto/company.dto';
import { PriceInfo, PriceInfoResponse } from './dto/price.dto';

import * as iconv from 'iconv-lite';
import * as cheerio from 'cheerio';
import * as axios from 'axios';
import { throwError } from 'rxjs';
import { ERROR } from 'src/common/error.common';

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
                throw new Error('COMPANY_NOT_FOUND');
            }

            const priceInfo = await this.getPrice(code);

            if (!priceInfo.result) {
                throw new Error('PRICE_INFO_NOT_FOUND');
            }

            return {
                company: company,
                price: priceInfo.data,
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
            const key = Object.keys(getCompanyInfoBySearchDTO)[0];
            const where = {};

            where[`${key}`] = Like(`%${getCompanyInfoBySearchDTO[key]}%`);

            const search = await this.companies.find({
                where: where,
            });

            let result = [];

            for await (const company of search) {
                const priceInfo = await this.getPrice(company.code);

                if (!priceInfo.result) {
                    continue;
                }

                result.push({
                    company: company,
                    price: priceInfo.data,
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
    async getPrice(code: String): Promise<PriceInfoResponse> {
        const URL = `https://finance.naver.com/item/main.nhn?code=${code}`;
        const crawled = await axios
            .default({
                url: URL,
                method: 'GET',
                responseType: 'arraybuffer',
            })
            .then((res) => {
                if (res.status !== 200) {
                    return false;
                }
                const $ = cheerio.load(iconv.decode(res.data, 'EUC-KR'));
                return $('.blind')
                    .find('dd')
                    .text()
                    .split(' ')
                    .map((value) => {
                        return value.replace(/[^0-9]/g, '');
                    });
            })
            .catch((err) => {
                console.log(err);
                return false;
            });

        try {
            if (!crawled) {
                throw new Error('PRICE_INFO_NOT_FOUND');
            }

            const newPriceInfo = new PriceInfo();

            newPriceInfo.datetime = new Date(
                crawled[0] + '-' + crawled[1] + '-' + crawled[2] + ' ' + crawled[3] + ':' + crawled[4] + ':00',
            );
            newPriceInfo.datetime.setHours(newPriceInfo.datetime.getHours() + 9);

            newPriceInfo.price = {
                now: parseInt(crawled[10]),
                yesterday: {
                    start: parseInt(crawled[17]),
                    highest: parseInt(crawled[19]),
                    lowest: parseInt(crawled[18]),
                    upperLimit: parseInt(crawled[20]),
                    lowerLimit: parseInt(crawled[21]),
                },
            };

            newPriceInfo.volume = parseInt(crawled[22]);

            return {
                result: true,
                data: newPriceInfo,
            };
        } catch (err) {
            return {
                result: false,
            };
        }
    }
}
