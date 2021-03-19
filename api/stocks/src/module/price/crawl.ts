import { HttpModule, Module } from "@nestjs/common";
import { PriceInfo } from "src/info/dto/price.dto";

@Module({
	imports: [HttpModule],
	providers: [PriceInfo]
})
export class GetPriceInfoModule {}
