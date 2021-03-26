import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter,
    ForbiddenException,
    HttpException,
    HttpStatus,
    NotFoundException,
} from '@nestjs/common';

const errorField = ['Error1', 'Error2', 'Error3'];

type CustomError = {
    status: HttpStatus;
    data: {
        code: string;
        message: string | string[];
    };
};

enum CustomErrorType {
    COMPANY_NOT_FOUND,
    PRICE_INFO_NOT_FOUND,
    GET_PRICE_FAILED,
    SEARCH_REQUIRES_COMPANY_TYPE,
    SEARCH_REQUIRES_EXACTLY_ONE_KEY,
    INVALID_SEARCH_KEYS,
}

export type ErrorCode = keyof typeof HttpStatus | keyof typeof CustomErrorType;
export type ErrorType = Partial<Record<ErrorCode, CustomError>>;

export const ERROR: ErrorType = {
    INTERNAL_SERVER_ERROR: {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {
            code: 'INTERNAL_SERVER_ERROR',
            message: '서버 오류',
        },
    },
    COMPANY_NOT_FOUND: {
        status: HttpStatus.BAD_REQUEST,
        data: {
            code: 'COMPANY_NOT_FOUND',
            message: '해당 Company가 없습니다.',
        },
    },
    PRICE_INFO_NOT_FOUND: {
        status: HttpStatus.BAD_REQUEST,
        data: {
            code: 'PRICE_INFO_NOT_FOUND',
            message: '해당 Company의 Price Info가 없습니다.',
        },
    },
    SEARCH_REQUIRES_EXACTLY_ONE_KEY: {
        status: HttpStatus.BAD_REQUEST,
        data: {
            code: 'SEARCH_REQUIRES_EXACTLY_ONE_KEY',
            message: '한 종류의 검색어만 가능합니다.',
        },
    },
    INVALID_SEARCH_KEYS: {
        status: HttpStatus.BAD_REQUEST,
        data: {
            code: 'INVALID_SEARCH_KEYS',
            message: 'name / products / sectors 중 하나의 검색어만 가능합니다.',
        },
    },
    GET_PRICE_FAILED: {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {
            code: 'GET_PRICE_FAILED',
            message: 'finance api 오류',
        },
    },
    SEARCH_REQUIRES_COMPANY_TYPE: {
        status: HttpStatus.BAD_REQUEST,
        data: {
            code: 'SEARCH_REQUIRES_COMPANY_TYPE',
            message: '상장 구분 값이 필요합니다.',
        },
    },
};

export const throwError = (code: ErrorCode, idx?: number[]) => {
    const error: CustomError = ERROR[code];

    if (idx) {
        error.data.message = errorField.filter((e, i) => {
            return idx.includes(i);
        });
    }

    throw new HttpException(error.data, error.status);
};

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
    catch(exception: NotFoundException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        response.status(403).json({
            result: false,
            error: {
                code: 'FORBIDDEN',
                message: '권한이 없습니다.',
            },
        });
    }
}

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const exceptionResponse = exception.getResponse();

        response.status(400).json({
            result: false,
            error: {
                code: 'BAD_REQUEST',
                massage: exceptionResponse['message'],
            },
        });
    }
}
