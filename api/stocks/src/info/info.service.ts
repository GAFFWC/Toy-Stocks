import { HttpService, Injectable, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { Like, Repository } from 'typeorm';
import { GetCompanyInfoBySearchDTO, GetCompanyInfoResponse } from './dto/company.dto';
import { PriceInfo, PriceInfoResponse } from './dto/price.dto';

import * as iconv from 'iconv-lite';
import * as cheerio from 'cheerio';
import * as axios from 'axios';
import { validate, ValidateBy, Validator } from 'class-validator';
import { threadId } from 'worker_threads';

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
                result: true,
                data: {
                    company: company,
                    price: priceInfo.data,
                },
            };
        } catch (err) {
            console.error(err);
            return {
                result: false,
            };
        }
    }

    async getSearch(getCompanyInfoBySearchDTO: GetCompanyInfoBySearchDTO): Promise<GetCompanyInfoResponse> {
        try {
            const searchkeys = Object.keys(getCompanyInfoBySearchDTO);
            if (searchkeys.length === 1) {
                throw new Error('SEARCH_REQUIRES_EXACTLY_ONE_KEY');
            }
            const where = {};

            switch (searchkeys[0]) {
                case 'name':
                    where['name'] = Like(`%${getCompanyInfoBySearchDTO.name}`);
                    break;
                default:
                    break;
            }

            const searchResult = await this.companies.find({
                where: where,
            });
        } catch (err) {}
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
