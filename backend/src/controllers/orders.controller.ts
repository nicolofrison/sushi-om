/* eslint no-console: ["error", { allow: ["info", "error"] }] */
import * as express from "express";
import { param } from "express-validator";
import Controller from "../interfaces/controller.interface";
import validationMiddleware from "../middlewares/validation.middleware";
import HttpException from "../exceptions/HttpException";
import OrdersService from "../services/orders.service";
import OrderPost from "../interfaces/orderPost.interface";
import authMiddleware from "../middlewares/auth.middleware";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import OrderPut from "../interfaces/orderPut.interface";
import OrderAlreadyConfirmedException from "../exceptions/OrderAlreadyConfirmedException";
import OrderDoesNotExistsException from "../exceptions/OrderDoesNotExistsException";

class OrdersController implements Controller {
  public path = "/orders";

  public router = express.Router();

  public orderService = new OrdersService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .all(`${this.path}`, authMiddleware)
      .get(`${this.path}`, this.getOrders)
      .get(`${this.path}/:id`, param("id").isInt(), this.getOrder)
      .delete(`${this.path}/:id`, param("id").isInt(), this.deleteOrder)
      .post(`${this.path}`, validationMiddleware(OrderPost), this.createOrder)
      .put(
        `${this.path}/:id`,
        param("id").isInt(),
        validationMiddleware(OrderPut),
        this.updateOrder
      );
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
      next(new HttpException(500, "Internal server error"));
    }
  };

  private updateOrder = async (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const orderId = parseInt(request.params.id, 10);
    const orderData: OrderPut = request.body;

    try {
      const updatedOrder = await this.orderService.updateOrder(
        orderId,
        request.user.userId,
        orderData
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
        next(new HttpException(400, e.message));
      } else {
        console.error(e);
        next(new HttpException(500, "Internal server error"));
      }
    }
  };

  private getOrders = async (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      response.status(200);
      response.json(
        await this.orderService.readOrdersByUserId(request.user.userId)
      );
    } catch (e) {
      console.error(e);
      next(new HttpException(500, "Internal server error"));
    }
  };

  private getOrder = async (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const orderId = parseInt(request.params.id, 10);
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
        next(new HttpException(400, e.message));
      } else {
        console.error(e);
        next(new HttpException(500, "Internal server error"));
      }
    }
  };

  private deleteOrder = async (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const orderId = parseInt(request.params.id, 10);

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
        next(new HttpException(400, e.message));
      } else {
        console.error(e);
        next(new HttpException(500, "Internal server error"));
      }
    }
  };
}

export default OrdersController;
