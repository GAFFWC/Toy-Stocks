import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsObject } from "class-validator";

export class Response {
	@IsBoolean()
	@ApiProperty({ default: "boolean" })
	result: boolean;

	@ApiProperty()
	data?: object;

	@ApiProperty()
	error?: Error;
}
