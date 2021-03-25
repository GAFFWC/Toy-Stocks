import { Controller, Get, HttpStatus, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
    ApiExtraModels,
    ApiOperation,
    ApiParam,
    ApiProperty,
    ApiQuery,
    ApiResponse,
    ApiTags,
    getSchemaPath,
} from '@nestjs/swagger';
import { Error } from 'src/common/dto/error.dto';
import { Response } from 'src/common/dto/response.dto';
import { Company } from 'src/entities/company.entity';
import { SearchCompany } from './decorator/company.decorator';
import { GetCompanyInfoBySearchDTO, GetCompanyInfoResponse } from './dto/company.dto';
import { PriceInfo } from './dto/price.dto';
import { InfoService } from './info.service';

@Controller('company')
@ApiTags('company')
@ApiExtraModels(GetCompanyInfoResponse, GetCompanyInfoResponse, Company, PriceInfo, Error)
export class InfoController {
    constructor(private readonly infoService: InfoService) {}

    @Get('/search')
    @ApiOperation({ summary: '회사 정보 검색' })
    @ApiQuery({ type: GetCompanyInfoBySearchDTO })
    @ApiResponse({ status: HttpStatus.OK, type: [GetCompanyInfoResponse] })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: Error })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: Error })
    getCompanyInfoBySearch(
        @SearchCompany() getCompanyInfoBySearchDTO: GetCompanyInfoBySearchDTO,
    ): Promise<GetCompanyInfoResponse[]> {
        return this.infoService.getSearch(getCompanyInfoBySearchDTO);
    }

    @Get(':code')
    @ApiOperation({ summary: '종목코드 별 정보 조회' })
    @ApiParam({ name: 'code', type: String, description: '종목 코드' })
    @ApiResponse({ status: HttpStatus.OK, type: GetCompanyInfoResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: Error })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: Error })
    getCompanyInfo(@Param('code') code: string): Promise<GetCompanyInfoResponse> {
        return this.infoService.getInfo(code);
    }
}
