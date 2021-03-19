import { Response } from "src/common/dto/response.dto";

export class PriceInfo {
	datetime: Date;
	price: {
		now: Number;
		yesterday: {
			start: Number;
			highest: Number;
			lowest: Number;
			upperLimit: Number;
			lowerLimit: Number;
		};
	};
	volume: Number;
}

export class PriceInfoResponse extends Response {
	data?: PriceInfo;
}
