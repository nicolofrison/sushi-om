import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({
  expression: `
      SELECT "o"."orderId" AS "orderId","o"."code" AS "code","o"."amount" AS "amount","u"."userId" AS "userId","u"."name" AS "name","u"."surname" AS "surname","u"."username" AS "username","u"."groupId" AS "groupId","o"."checked" AS "checked","o"."confirmed" AS "confirmed"
      FROM ("order" "o" join "user" "u" on("o"."userId" = "u"."userId"))
  `,
})
export default class OrderUserView {
  @ViewColumn()
  orderId: number;

  @ViewColumn()
  code: string;

  @ViewColumn()
  amount: number;

  @ViewColumn()
  userId: number;

  @ViewColumn()
  name: string;

  @ViewColumn()
  surname: string;

  @ViewColumn()
  username: string;

  @ViewColumn()
  groupId: number;

  @ViewColumn()
  checked: boolean;

  @ViewColumn()
  confirmed: boolean;
}
