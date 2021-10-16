import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateDatabase1634395402229 implements MigrationInterface {
    name = 'CreateDatabase1634395402229'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "group" ("groupId" SERIAL NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8a45300fd825918f3b40195fbdc" UNIQUE ("name"), CONSTRAINT "PK_52a5b0126abd6ad70828290e822" PRIMARY KEY ("groupId"))`);
        await queryRunner.query(`CREATE TABLE "user" ("userId" SERIAL NOT NULL, "name" character varying NOT NULL, "surname" character varying NOT NULL, "username" character varying, "confirmed" boolean NOT NULL DEFAULT false, "groupIdGroupId" integer, CONSTRAINT "uniqueUsername" UNIQUE ("username", "groupIdGroupId"), CONSTRAINT "uniqueName" UNIQUE ("name", "surname", "username", "groupIdGroupId"), CONSTRAINT "PK_d72ea127f30e21753c9e229891e" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`CREATE TABLE "order" ("orderId" SERIAL NOT NULL, "code" character varying NOT NULL, "amount" integer NOT NULL, "checked" boolean NOT NULL, "round" integer NOT NULL, "userIdUserId" integer, CONSTRAINT "PK_b075313d4d7e1c12f1a6e6359e8" PRIMARY KEY ("orderId"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_54ab1825c1859c5cf53e1af7473" FOREIGN KEY ("groupIdGroupId") REFERENCES "group"("groupId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_394929fa45658ed4fb73fcf0030" FOREIGN KEY ("userIdUserId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE VIEW "order_user_view" AS SELECT "o"."orderId" AS "orderId", "o"."code" AS "code", "o"."amount" AS "amount", "o"."checked" AS "checked", "o"."round" AS "round", "u"."userId" AS "userId", "u"."name" AS "name", "u"."surname" AS "surname", "u"."username" AS "username", "u"."groupIdGroupId" AS "groupId" FROM "order" "o" LEFT JOIN "user" "u" ON "o"."userIdUserId" = "u"."userId"`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, ["VIEW","public","order_user_view","SELECT \"o\".\"orderId\" AS \"orderId\", \"o\".\"code\" AS \"code\", \"o\".\"amount\" AS \"amount\", \"o\".\"checked\" AS \"checked\", \"o\".\"round\" AS \"round\", \"u\".\"userId\" AS \"userId\", \"u\".\"name\" AS \"name\", \"u\".\"surname\" AS \"surname\", \"u\".\"username\" AS \"username\", \"u\".\"groupIdGroupId\" AS \"groupId\" FROM \"order\" \"o\" LEFT JOIN \"user\" \"u\" ON \"o\".\"userIdUserId\" = \"u\".\"userId\""]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ["VIEW","public","order_user_view"]);
        await queryRunner.query(`DROP VIEW "order_user_view"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_394929fa45658ed4fb73fcf0030"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_54ab1825c1859c5cf53e1af7473"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "group"`);
    }

}
