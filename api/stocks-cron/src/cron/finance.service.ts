import { InjectRepository } from '@nestjs/typeorm';
import { Company, MarketType } from 'src/entities/company.entity';
import { Repository } from 'typeorm';
import * as yf from 'yahoo-finance';
import { Price } from './dto/price.dto';

export class FinanceService {
    constructor(@InjectRepository(Company, 'stocks') private readonly company: Repository<Company>) {}

    async price(company: Company): Promise<Price> {
        try {
            const symbol = company.code + '.' + (company.type === MarketType.KOSPI ? 'KS' : 'KQ');
            const result = await yf.quote({
                symbol: symbol,
                modules: ['price'],
            });

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
        }
    }
}
