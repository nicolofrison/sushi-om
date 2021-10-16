import { ViewColumn, ViewEntity, Connection } from "typeorm";
import Order from "./order.entity";
import User from "./user.entity";

@ViewEntity({ 
    expression: (connection: Connection) => connection.createQueryBuilder()
        .select("o.orderId", "orderId")
        .addSelect("o.code", "code")
        .addSelect("o.amount", "amount")
        .addSelect("u.userId", "userId")
        .addSelect("u.name", "name")
        .addSelect("u.surname", "surname")
        .addSelect("u.username", "username")
        .addSelect("u.groupId", "groupId")
        .addSelect("o.checked", "checked")
        .addSelect("o.round", "round")
        .from(Order, "o")
        .leftJoin(User, "u", "o.userId = u.userId")
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
  round?: number;
}
