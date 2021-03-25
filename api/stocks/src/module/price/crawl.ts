import { HttpModule, Module } from '@nestjs/common';
import { PriceInfo } from 'src/company/dto/price.dto';

@Module({
    imports: [HttpModule],
    providers: [PriceInfo],
})
export class GetPriceInfoModule {}
