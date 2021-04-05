import { ApiPreconditionFailedResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Response } from 'src/common/dto/response.dto';

export class Price {
    @ApiProperty({ description: '조회 일자', type: 'Date' })
    date: Date;

    @ApiProperty({ description: '현재가' })
    now: number;

    @ApiProperty({ description: '고가' })
    high: number;

    @ApiProperty({ description: '저가' })
    low: number;

    @ApiProperty({ description: '전일 종가' })
    previous: number;

    @ApiProperty({ description: '거래량' })
    volume: number;
}
