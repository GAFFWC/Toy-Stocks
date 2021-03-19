import { HttpService, Injectable, ParseIntPipe, ValidationPipe } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Company } from "src/entities/company.entity";
import { Repository } from "typeorm";
import { GetCompanyInfoResponse } from "./dto/company.dto";
import { PriceInfo, PriceInfoResponse } from "./dto/price.dto";

import * as iconv from "iconv-lite";
import * as cheerio from "cheerio";
import { validate, ValidateBy, Validator } from "class-validator";

@Injectable()
export class InfoService {
	constructor(@InjectRepository(Company, "stocks") private readonly companies: Repository<Company>, private readonly http: HttpService) {}

	async getInfo(code: String): Promise<GetCompanyInfoResponse> {
		try {
			const company = await this.companies.findOne({
				where: {
					code: code
				}
			});

			if (!company) {
				throw new Error();
			}

			const priceInfo = await this.getPrice(company.code);

			if (!priceInfo.result) {
				throw new Error();
			}

			return {
				result: true,
				data: {
					company: company,
					price: priceInfo.data
				}
			};
		} catch (err) {
			console.error(err);
			return {
				result: false
			};
		}
		return;
	}
