import { ApiProperty, getSchemaPath, IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { IsObject, ValidateNested } from 'class-validator';
import { Response } from 'src/common/dto/response.dto';
import { Company } from 'src/entities/company.entity';
import { PriceInfo } from './price.dto';

export class GetCompanyInfoResponse {
    @ApiProperty({ description: '회사 정보', type: Company })
    @ValidateNested()
    company: Company;

    @ApiProperty({ description: '가격 정보', type: PriceInfo })
    @ValidateNested()
    price: PriceInfo;
}

export class GetCompanyInfoBySearchDTO extends PickType(Company, ['name', 'products', 'sectors']) {
    @ApiProperty({ required: false })
    name: string;

    @ApiProperty({ required: false })
    products: string;

    @ApiProperty({ required: false })
    sectors: string;
}
