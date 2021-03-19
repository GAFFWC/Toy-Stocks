import { HttpModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Company } from "src/entities/company.entity";
import { InfoController } from "./info.controller";
import { InfoService } from "./info.service";

@Module({
	imports: [TypeOrmModule.forFeature([Company], "stocks"), HttpModule],
	controllers: [InfoController],
	providers: [InfoService]
})
export class InfoModule {}
