import {MigrationInterface, QueryRunner} from "typeorm";

export class updateDatabase1721901150924 implements MigrationInterface {
    name = 'updateDatabase1721901150924'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refreshTokens" ALTER COLUMN "expires" SET DEFAULT CURRENT_DATE + INTERVAL'30 day'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refreshTokens" ALTER COLUMN "expires" SET DEFAULT (CURRENT_DATE + '30 days')`);
    }

}
