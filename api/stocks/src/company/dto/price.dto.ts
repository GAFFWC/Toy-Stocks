import { ApiPreconditionFailedResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Response } from 'src/common/dto/response.dto';

export class Price {
    @ApiProperty({ description: '조회 일자', type: 'Date' })
    date: Date;

    @ApiProperty({ description: '현재가' })
    now: Number;

    @ApiProperty({ description: '고가' })
    high: Number;

    @ApiProperty({ description: '저가' })
    low: Number;

    @ApiProperty({ description: '전일 종가' })
    previous: Number;

    @ApiProperty({ description: '거래량' })
    volume: Number;
}
