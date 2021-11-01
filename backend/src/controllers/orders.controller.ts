/* eslint no-console: ["error", { allow: ["info", "error"] }] */
import * as express from "express";
import { Meta, param, query } from "express-validator";
import Controller from "../interfaces/controller.interface";
import validationMiddleware from "../middlewares/validation.middleware";
import HttpError from "../httpErrors/HttpError";
import OrdersService from "../services/orders.service";
import OrderPost from "../interfaces/orderPost.interface";
import authMiddleware from "../middlewares/auth.middleware";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import OrderAmountPatch from "../interfaces/OrderAmountPatch.interface";
import OrderCheckPatch from "../interfaces/orderCheckPatch.interface";
import OrderAlreadyConfirmedException from "../exceptions/OrderAlreadyConfirmedException";
import OrderDoesNotExistsException from "../exceptions/OrderDoesNotExistsException";
import GroupDoesNotExistsException from "../exceptions/GroupDoesNotExistsException";
import ServerHttpError from "../httpErrors/ServerHttpError";
import OrderPatch from "../interfaces/OrderPatch.interface";
import OrderIsNotConfirmedException from "../exceptions/OrderNotConfirmedYetException";

class OrdersController implements Controller {
  public path = "/orders";

  public router = express.Router();

  public orderService = new OrdersService();

  constructor() {
    this.initializeRoutes();
  }
  
  private async queryGroupIdMiddleware(
    groupId: number,
    meta: Meta
  ) {
    if (groupId && (!meta.req.user.groupId || meta.req.user.groupId !== groupId)) {
      throw new GroupDoesNotExistsException();
    } else {
      return true;
    }
  }

  private async queryUserIdMiddleware(
    userId: number,
    meta: Meta
  ) {
    if (userId && (!meta.req.user.userId || meta.req.user.userId !== userId)) {
      throw new GroupDoesNotExistsException();
    } else {
      return true;
    }
  }

  private initializeRoutes() {
    this.router
      .all(`${this.path}`, authMiddleware)
      .all(`${this.path}/:id`, authMiddleware)
      .get(`${this.path}`, 
        query("groupId").optional().isInt().custom(this.queryGroupIdMiddleware), 
        query("userId").optional().isInt().custom(this.queryUserIdMiddleware), 
        this.getOrders)
      .get(`${this.path}/:id`, param("id").isInt(), this.getOrder)
      .delete(`${this.path}/:id`, param("id").isInt(), this.deleteOrder)
      .post(`${this.path}`, validationMiddleware(OrderPost), this.createOrder)
      .patch(
        `${this.path}/:id`,
        param("id").isInt(),
        validationMiddleware(OrderPatch),
        this.updateOrder);
  }

  private createOrder = async (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const orderData: OrderPost = request.body;

    try {
      const createdOrder = await this.orderService.createOrder(
        request.user.userId,
        orderData
      );

      if (createdOrder != null) {
        response.status(200);
        response.json(createdOrder);
      }
    } catch (e) {
      console.error(e);
      next(new ServerHttpError());
    }
  };

  private updateOrder = async (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const orderId = +request.params.id;
    const orderData: OrderPatch = request.body;

    try {
      let updatedOrder = null;
      if (orderData.amount !== undefined) {
        updatedOrder = await this.orderService.updateOrderAmount(
          orderId,
          request.user.userId,
          orderData as OrderAmountPatch
        );
      } else if (orderData.checked !== undefined) {
        updatedOrder = await this.orderService.updateOrderCheck(
          orderId,
          request.user.userId,
          orderData as OrderCheckPatch
        );
      } else {
        next(new HttpError(400, "Invalid request data", "invalidRequestData"));
      }
      
      if (updatedOrder != null) {
        response.status(200);
        response.json(updatedOrder);
      }
    } catch (e) {
      if (e instanceof OrderAlreadyConfirmedException 
        || e instanceof OrderDoesNotExistsException 
        || e instanceof OrderIsNotConfirmedException
      ) {
        next(new HttpError(400, e.message, e.translationKey));
      } else {
        console.error(e);
        next(new ServerHttpError());
      }
    }
  };

  private getOrders = async (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const groupId = +request.query.groupId;
      const userId = +request.query.userId;

      let orders = [];
      if (userId) {
        orders = await this.orderService.readOrdersByUserId(userId);
      } else {
        orders = await this.orderService.readOrdersByGroupId(request.user.groupId);
      }
      
      response.status(200);
      response.json(orders);
    } catch (e) {
      console.error(e);
      next(new ServerHttpError());
    }
  };

  private getOrder = async (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const orderId = +request.params.id;
    try {
      response.status(200);
      response.json(
        await this.orderService.readOrderByOrderIdAndUserId(
          orderId,
          request.user.userId
        )
      );
    } catch (e) {
      if (e instanceof OrderDoesNotExistsException) {
        next(new HttpError(400, e.message, e.translationKey));
      } else {
        console.error(e);
        next(new ServerHttpError());
      }
    }
  };

  private deleteOrder = async (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const orderId = +request.params.id;
    
    try {
      const updatedOrder = await this.orderService.deleteOrder(
        orderId,
        request.user.userId
      );

      if (updatedOrder != null) {
        response.status(200);
        response.json(updatedOrder);
      }
    } catch (e) {
      if (
        e instanceof OrderAlreadyConfirmedException ||
        e instanceof OrderDoesNotExistsException
      ) {
        next(new HttpError(400, e.message, e.translationKey));
      } else {
        console.error(e);
        next(new ServerHttpError());
      }
    }
  };
}

export default OrdersController;
