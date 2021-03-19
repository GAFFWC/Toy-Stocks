import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { GetCompanyInfoResponse } from "./dto/company.dto";
import { InfoService } from "./info.service";

@Controller("info")
export class InfoController {
	constructor(private readonly infoService: InfoService) {}

	@Get(":code")
	getCompanyInfo(@Param("code", ParseIntPipe) code: number): Promise<GetCompanyInfoResponse> {
		return;
	}
}
