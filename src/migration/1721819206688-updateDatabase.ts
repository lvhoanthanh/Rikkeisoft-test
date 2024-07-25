import {MigrationInterface, QueryRunner} from "typeorm";

export class updateDatabase1721819206688 implements MigrationInterface {
    name = 'updateDatabase1721819206688'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."categories_status_enum" AS ENUM('active', 'inactive', 'terminated')`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "name" character varying(50) NOT NULL, "description" text, "status" "public"."categories_status_enum" NOT NULL DEFAULT 'active', CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."products_status_enum" AS ENUM('active', 'inactive', 'terminated')`);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "name" character varying(50) NOT NULL, "description" text, "price" numeric NOT NULL, "status" "public"."products_status_enum" NOT NULL DEFAULT 'active', "categoryId" uuid, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nameOriginal" character varying(150) NOT NULL, "nameConvert" character varying(150) NOT NULL, "path" character varying NOT NULL, "extension" character varying, "size" character varying, "productId" uuid, CONSTRAINT "REL_57a86e1cc8eae915977547fdae" UNIQUE ("productId"), CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "userData" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "firstName" character varying(100), "lastName" character varying(100), "address" text, "userId" uuid, CONSTRAINT "REL_11d6b2885437338495e56f1cbc" UNIQUE ("userId"), CONSTRAINT "PK_77ba278e7818dfd0574bac1659a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'inactive', 'terminated')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "email" character varying(100) NOT NULL, "username" character varying(100), "password" character varying(100) NOT NULL, "status" "public"."users_status_enum" NOT NULL DEFAULT 'active', "roleId" uuid, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."roles_status_enum" AS ENUM('active', 'inactive', 'terminated')`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "name" character varying(30) NOT NULL, "description" text, "roleCode" character varying NOT NULL, "status" "public"."roles_status_enum" NOT NULL DEFAULT 'active', CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "UQ_6da95e99c706be73a6a4ba0c96a" UNIQUE ("roleCode"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."permissions_status_enum" AS ENUM('active', 'inactive', 'terminated')`);
        await queryRunner.query(`CREATE TABLE "permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "name" character varying(50) NOT NULL, "description" text, "status" "public"."permissions_status_enum" NOT NULL DEFAULT 'active', CONSTRAINT "UQ_48ce552495d14eae9b187bb6716" UNIQUE ("name"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refreshTokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "userId" character varying(300) NOT NULL, "isRevoked" boolean NOT NULL DEFAULT false, "expires" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_DATE + INTERVAL'30 day', CONSTRAINT "PK_c4a0078b846c2c4508473680625" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_permissions" ("permission" uuid NOT NULL, "role" uuid NOT NULL, CONSTRAINT "PK_9c116ac03805ca80baf3e8d2319" PRIMARY KEY ("permission", "role"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0ab5175ebb91e7a07f850acf42" ON "role_permissions" ("permission") `);
        await queryRunner.query(`CREATE INDEX "IDX_5d5086bd299f773d403574cf1c" ON "role_permissions" ("role") `);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "files" ADD CONSTRAINT "FK_57a86e1cc8eae915977547fdaeb" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "userData" ADD CONSTRAINT "FK_11d6b2885437338495e56f1cbca" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_0ab5175ebb91e7a07f850acf42e" FOREIGN KEY ("permission") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_5d5086bd299f773d403574cf1c8" FOREIGN KEY ("role") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_5d5086bd299f773d403574cf1c8"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_0ab5175ebb91e7a07f850acf42e"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"`);
        await queryRunner.query(`ALTER TABLE "userData" DROP CONSTRAINT "FK_11d6b2885437338495e56f1cbca"`);
        await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_57a86e1cc8eae915977547fdaeb"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ff56834e735fa78a15d0cf21926"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5d5086bd299f773d403574cf1c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0ab5175ebb91e7a07f850acf42"`);
        await queryRunner.query(`DROP TABLE "role_permissions"`);
        await queryRunner.query(`DROP TABLE "refreshTokens"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`DROP TYPE "public"."permissions_status_enum"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TYPE "public"."roles_status_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
        await queryRunner.query(`DROP TABLE "userData"`);
        await queryRunner.query(`DROP TABLE "files"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TYPE "public"."products_status_enum"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TYPE "public"."categories_status_enum"`);
    }

}
