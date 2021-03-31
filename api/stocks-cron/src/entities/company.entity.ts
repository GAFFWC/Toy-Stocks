import { IsDate, IsEnum, IsNumber, IsNumberString, IsString, IsUrl } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum MarketType {
    KOSPI,
    KOSDAQ,
}

@Entity()
export class Company {
    @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
    companyUid: number;

    // 시장 구분
    @IsEnum(MarketType)
    @Column({ type: 'enum', enum: MarketType, nullable: false, comment: '시장 구분 (KOSPI, KOSDAQ, KONEX)' })
    type: MarketType;

    // 이름
    @IsString()
    @Column({ type: 'varchar', nullable: false, comment: '이름' })
    name: String;

    // 종목 코드
    @IsString()
    @IsNumber()
    @Column({ type: 'varchar', nullable: false, comment: '종목 코드' })
    code: String;

    // // TODO -> enum type
    // // 업종 카테고리
    // @IsString()
    // @Column({ type: "char", nullable: true, comment: "업종 카테고리 - 추후 enum으로 변경" })
    // category: String;

    // 업종
    @IsString()
    @Column({ type: 'varchar', comment: '업종' })
    sectors: String;

    // 주요 제품
    @IsString()
    @Column({ type: 'varchar', comment: '주요 제품' })
    products: String;

    // 상장일
    @IsDate()
    @Column({ type: 'date', comment: '상장일' })
    listingDate: Date;

    // 홈페이지
    @IsUrl()
    @Column({ type: 'varchar', comment: '홈페이지', nullable: true })
    url: String;

    // 지역
    // TODO -> enum type
    @IsString()
    @Column({ type: 'varchar', comment: '지역' })
    location: String;

    @CreateDateColumn({ type: 'datetime', precision: null, default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'datetime',
        precision: null,
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;
}
