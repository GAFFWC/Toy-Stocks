import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class companyMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if (req.hostname === 'health.check') {
            return res.status(200).send('OK');
        } else {
            next();
        }
    }
}
