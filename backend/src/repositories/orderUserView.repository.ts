import { EntityRepository, getManager } from "typeorm";
import OrderUserView from "../entities/orderUserView.entity";

@EntityRepository(OrderUserView)
export default class OrderUserViewRepository {
  private entityManager = getManager();

  public findByGroupId = async (groupId: number) => {
    const order = await this.entityManager.find(OrderUserView, { groupId });
    return order;
  };

  public findByUserId = async (userId: number) => {
    const order = await this.entityManager.find(OrderUserView, { userId });
    return order;
  };
}
