import { Controller, Get, HttpStatus, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiParam, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'src/common/dto/response.dto';
import { Company } from 'src/entities/company.entity';
import { GetCompanyInfoBySearchDTO, GetCompanyInfoResponse } from './dto/company.dto';
import { PriceInfo } from './dto/price.dto';
import { InfoService } from './info.service';

@Controller('info')
@ApiTags('info')
@ApiExtraModels(GetCompanyInfoResponse, GetCompanyInfoResponse, Company, PriceInfo)
export class InfoController {
    constructor(private readonly infoService: InfoService) {}

    @Get(':code')
    @ApiOperation({ summary: '종목코드 별 정보 조회' })
    @ApiParam({ name: 'code', type: String, description: '종목 코드' })
    @ApiResponse({ status: HttpStatus.OK, type: GetCompanyInfoResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: Response })
    getCompanyInfo(@Param('code') code: string): Promise<GetCompanyInfoResponse> {
        return this.infoService.getInfo(code);
    }

    @Get('/search')
    getCompanyInfoBySearch(
        @Query() getCompanyInfoBySearchDTO: GetCompanyInfoBySearchDTO,
    ): Promise<GetCompanyInfoResponse> {
        return;
    }
}
