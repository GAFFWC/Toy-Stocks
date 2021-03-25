import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Error } from 'src/common/dto/error.dto';
import { throwError } from 'src/common/error.common';
import { GetCompanyInfoBySearchDTO } from '../dto/company.dto';

export const SearchCompany = createParamDecorator((data: GetCompanyInfoBySearchDTO, ctx: ExecutionContext) => {
    const possibleKeys = ['name', 'products', 'sectors'];
    const request = ctx.switchToHttp().getRequest();

    if (Object.keys(request.query).length !== 1) {
        console.log(Object.keys(request.query));
        return throwError('SEARCH_REQUIRES_EXACTLY_ONE_KEY');
    }

    const idx = possibleKeys.indexOf(Object.getOwnPropertyNames(request.query)[0]);

    return idx < 0 ? throwError('INVALID_SEARCH_KEYS') : request.query;
});
