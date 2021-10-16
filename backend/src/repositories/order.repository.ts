import { EntityRepository, Repository } from "typeorm";
import Order from "../entities/order.entity";

@EntityRepository(Order)
export default class OrderRepository extends Repository<Order> {
  public createAndSave = async (
    userId: number,
    code: string,
    amount: number
  ) => {
    const order = new Order(userId, code, amount);
    return this.save(order);
  };

  public findByOrderId = async (orderId: number) =>
    (await this.findOne({ orderId })) ?? null;

  public findByUserId = async (userId: number) => {
    const order = await this.find({ userId });
    return order;
  };

  public findByUserIdAndCodeAndRound = async (
    userId: number,
    code: string,
    round: number
  ) =>
    (await this.findOne({
      userId,
      code,
      round,
    })) ?? null;
}
