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

	async getPrice(code: String): Promise<PriceInfoResponse> {
		const URL = `https://finance.naver.com/item/main.nhn?code=${code}`;
		const crawled = await this.http
			.get(URL, {
				responseType: "arraybuffer"
			})
			.toPromise()
			.then((res) => {
				if (res.status !== 200) {
					return false;
				}

				const $ = cheerio.load(iconv.decode(res.data, "EUC-KR"));
				return $(".blind")
					.find("dd")
					.text()
					.split(" ")
					.map((value) => {
						return value.replace(/[^0-9]/g, "");
					});
			})
			.catch((err) => {
				console.log(err);
				return false;
			});

		if (!crawled) {
			return {
				result: false
			};
		}

		try {
			const newPriceInfo = new PriceInfo();

			newPriceInfo.datetime = new Date(crawled[0] + "-" + crawled[1] + "-" + crawled[2] + " " + crawled[3] + ":" + crawled[4] + ":00");
			newPriceInfo.price = {
				now: parseInt(crawled[10]),
				yesterday: {
					start: parseInt(crawled[17]),
					highest: parseInt(crawled[18]),
					lowest: parseInt(crawled[20]),
					upperLimit: parseInt(crawled[19]),
					lowerLimit: parseInt(crawled[21])
				}
			};

			newPriceInfo.volume = parseInt(crawled[22]);

			return {
				result: true,
				data: newPriceInfo
			};
		} catch (err) {
			return {
				result: false
			};
		}
	}
}
