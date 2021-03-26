import { createParamDecorator, ExecutionContext, ParseIntPipe } from '@nestjs/common';
import { throwError } from 'src/common/error.common';
import { GetCompanyInfoBySearchDTO } from '../dto/company.dto';

export const SearchCompany = createParamDecorator((data: GetCompanyInfoBySearchDTO, ctx: ExecutionContext) => {
    const possibleKeys = ['name', 'products', 'sectors'];
    const request = ctx.switchToHttp().getRequest();

    if (!request.query.type) {
        throwError('SEARCH_REQUIRES_COMPANY_TYPE');
    }

    if (isNaN(request.query.type)) {
        throwError('SEARCH_REQUIRES_COMPANY_TYPE');
    }

    request.query.type = parseInt(request.query.type);

    if (Object.keys(request.query).length !== 2) {
        return throwError('SEARCH_REQUIRES_EXACTLY_ONE_KEY');
    }

    const idx = possibleKeys.indexOf(
        Object.getOwnPropertyNames(request.query).filter((key) => {
            return key != 'type';
        })[0],
    );

    return idx < 0 ? throwError('INVALID_SEARCH_KEYS') : request.query;
});
