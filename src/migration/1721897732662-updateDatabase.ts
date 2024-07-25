import {MigrationInterface, QueryRunner} from "typeorm";

export class updateDatabase1721897732662 implements MigrationInterface {
    name = 'updateDatabase1721897732662'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"`);
        await queryRunner.query(`ALTER TABLE "refreshTokens" ALTER COLUMN "expires" SET DEFAULT CURRENT_DATE + INTERVAL'30 day'`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "UQ_48ce552495d14eae9b187bb6716" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "UQ_48ce552495d14eae9b187bb6716"`);
        await queryRunner.query(`ALTER TABLE "refreshTokens" ALTER COLUMN "expires" SET DEFAULT (CURRENT_DATE + '30 days')`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
