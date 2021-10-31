/* eslint no-console: ["error", { allow: ["info", "error"] }] */
import * as express from "express";
import { Meta, param } from "express-validator";
import Controller from "../interfaces/controller.interface";
import validationMiddleware from "../middlewares/validation.middleware";
import HttpException from "../exceptions/HttpException";
import authMiddleware from "../middlewares/auth.middleware";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import UserPatch from "../interfaces/UserPatch.interface";
import UserDoesNotExistsException from "../exceptions/UserDoesNotExistsException";
import UsersService from "../services/users.service";

class UsersController implements Controller {
  public path = "/users";

  public router = express.Router();

  public userService = new UsersService();

  constructor() {
    this.initializeRoutes();
  }
  
  private async queryUserIdMiddleware(
    userId: number,
    meta: Meta
  ) {
    if (userId && (!meta.req.user.userId || meta.req.user.userId !== userId)) {
      throw new UserDoesNotExistsException();
    } else {
      return true;
    }
  }

  private initializeRoutes() {
    this.router
      .all(`${this.path}/:id`, authMiddleware)
      .get(
        `${this.path}/:id`,
        param("id").isInt().custom(this.queryUserIdMiddleware),
        this.getUser
      )
      .patch(
        `${this.path}/:id`,
        param("id").isInt().custom(this.queryUserIdMiddleware),
        validationMiddleware(UserPatch),
        this.updateUser
      );
  }

  private getUser = async (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction
  ) => {
    response.status(200);
    response.json(request.user);
  }

  private updateUser = async (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userId = +request.params.id;
    const userPatch: UserPatch = request.body;

    try {
      const updatedUser = await this.userService.updateUser(
        userId,
        userPatch
      );

      if (updatedUser != null) {
        response.status(200);
        response.json(updatedUser);
      }
    } catch (e) {
      if (
        e instanceof UserDoesNotExistsException
      ) {
        next(new HttpException(400, e.message, e.translationKey));
      } else {
        console.error(e);
        next(new HttpException(500, "Internal server error", "internalServerError"));
      }
    }
  };
}

export default UsersController;
