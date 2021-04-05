import { ValidateNested } from 'class-validator';
import { Company } from 'src/entities/company.entity';
import { Price } from './price.dto';

export class GetCompanyInfoResponse {
    @ValidateNested()
    company: Company;

    @ValidateNested()
    price: Price;
}
