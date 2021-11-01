import { getCustomRepository } from "typeorm";
import OrderAlreadyConfirmedException from "../exceptions/OrderAlreadyConfirmedException";
import OrderDoesNotExistsException from "../exceptions/OrderDoesNotExistsException";
import OrderUserViewRepository from "../repositories/orderUserView.repository";
import OrderRepository from "../repositories/order.repository";
import OrderPost from "../interfaces/orderPost.interface";
import OrderAmountPatch from "../interfaces/OrderAmountPatch.interface";
import OrderCheckPatch from "../interfaces/OrderCheckPatch.interface";
import OrderIsNotConfirmedException from "../exceptions/OrderNotConfirmedYetException";

class OrdersService {
  private orderRepo = getCustomRepository(OrderRepository);

  private orderUserViewRepo = getCustomRepository(OrderUserViewRepository);

  public createOrder = async (userId: number, orderPost: OrderPost) => {
    // find if the "userId" inside "order" has already an order with "code" inside "order" and if it is not confirmed
    const alreadyExistentOrder =
      await this.orderRepo.findByUserIdAndCodeAndRound(
        userId,
        orderPost.code,
        null
      );

    if (alreadyExistentOrder) {
      alreadyExistentOrder.amount += orderPost.amount;

      const order = await this.orderRepo.save(alreadyExistentOrder);
      return order;
    }

    const order = await this.orderRepo.createAndSave(
      userId,
      orderPost.code,
      orderPost.amount
    );
    return order;
  };

  public readOrdersByUserId = async (userId: number) => {
    const orders = await this.orderRepo.findByUserId(userId);
    return orders;
  };

  public readOrdersByGroupId = async (groupId: number) => {
    const orders = await this.orderUserViewRepo.findByGroupId(groupId);
    return orders;
  };

  public readOrderByOrderIdAndUserId = async (
    orderId: number,
    userId: number
  ) => {
    const order = await this.orderRepo.findByOrderId(orderId);
    if (!order || order.userId !== userId) {
      throw new OrderDoesNotExistsException();
    }

    return order;
  };

  public updateOrderAmount = async (
    orderId: number,
    userId: number,
    orderAmountPatch: OrderAmountPatch
  ) => {
    // find if the "userId" inside "order" has already an order with "code" inside "order" and if it is not confirmed
    const alreadyExistentOrder = await this.orderRepo.findByOrderId(orderId);
    if (!alreadyExistentOrder || alreadyExistentOrder.userId !== userId) {
      throw new OrderDoesNotExistsException();
    }

    if (alreadyExistentOrder.round) {
      throw new OrderAlreadyConfirmedException();
    }

    alreadyExistentOrder.amount = orderAmountPatch.amount;
    const order = await this.orderRepo.save(alreadyExistentOrder);
    return order;
  };

  public updateOrderCheck = async (
    orderId: number,
    userId: number,
    orderCheckPatch: OrderCheckPatch 
  ) => {
    // find if the "userId" inside "order" has already an order with "code" inside "order" and if it is not confirmed
    const alreadyExistentOrder = await this.orderRepo.findByOrderId(orderId);
    if (!alreadyExistentOrder || alreadyExistentOrder.userId !== userId) {
      throw new OrderDoesNotExistsException();
    }

    if (!alreadyExistentOrder.round) {
      throw new OrderIsNotConfirmedException();
    }

    alreadyExistentOrder.checked = orderCheckPatch.checked;
    const order = await this.orderRepo.save(alreadyExistentOrder);
    return order;
  };

  public deleteOrder = async (orderId: number, userId: number) => {
    const order = await this.orderRepo.findByOrderId(orderId);
    if (!order || order.userId !== userId) {
      throw new OrderDoesNotExistsException();
    }

    if (order.round) {
      throw new OrderAlreadyConfirmedException();
    }

    const deletedOrder = await this.orderRepo.remove(order);
    return deletedOrder;
  };
}

export default OrdersService;
