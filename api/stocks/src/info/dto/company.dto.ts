import { ApiProperty, getSchemaPath, IntersectionType, PickType } from "@nestjs/swagger";
import { IsObject, ValidateNested } from "class-validator";
import { Response } from "src/common/dto/response.dto";
import { Company } from "src/entities/company.entity";
import { PriceInfo } from "./price.dto";

export class GetCompanyInfoResponse extends Response {
	@ApiProperty({
		description: "해당 종목 코드의 회사 / 가격 정보",
		properties: {
			company: { $ref: getSchemaPath(Company) },
			price: { $ref: getSchemaPath(PriceInfo) }
		}
	})
	@ValidateNested()
	data?: {
		company: Company;
		price: PriceInfo;
	};
}
