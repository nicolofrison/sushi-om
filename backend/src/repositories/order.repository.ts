import { EntityRepository, In, MaxKey, Repository } from "typeorm";
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

    public updateUsersRound = async (
      usersIds: number[]
    ) => {
      const rounds = await this.find({
        select: ["round"],
        where: { userId: In(usersIds)}
      });
      let maxRound = 0;
      if (rounds.length > 0 && rounds.map(o => o.round).every(r => r)) {
        maxRound = Math.max(...rounds.map(o => o.round).filter(r => r));
      }
      await this.update({ userId: In(usersIds), round: null}, {round: maxRound + 1});
    }
}
