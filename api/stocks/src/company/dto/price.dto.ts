import { ApiPreconditionFailedResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Response } from 'src/common/dto/response.dto';

class Price {
    @ApiProperty({ description: '현재가' })
    now: Number;

    @ApiProperty({
        description: '전일 최종 정보',
        properties: {
            start: { type: 'number', description: '전일 시가' },
            highest: { type: 'number', description: '전일 고가' },
            lowest: { type: 'number', description: '전일 저가' },
            upperLimit: { type: 'number', description: '전일 상한가' },
            lowerLimit: { type: 'number', description: '전일 하한가' },
        },
    })
    yesterday: {
        start: Number;
        highest: Number;
        lowest: Number;
        upperLimit: Number;
        lowerLimit: Number;
    };
}

export class PriceInfo extends Price {
    @ApiProperty({ description: '가격 조회 일자' })
    datetime: Date;

    @ApiProperty({
        description: '가격 정보',
        type: Price,
    })
    price: Price;

    @ApiProperty({ description: '거래량' })
    volume: Number;
}

export class PriceInfoResponse extends Response {
    data?: PriceInfo;
}
