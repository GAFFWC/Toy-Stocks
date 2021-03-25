import { ApiProperty } from '@nestjs/swagger';

export class Error {
    @ApiProperty({ description: '오류 코드' })
    code: string;

    @ApiProperty({ description: '오류 내용', type: 'string' })
    message: string | string[];
}
