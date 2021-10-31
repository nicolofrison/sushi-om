/* eslint no-console: ["error", { allow: ["info", "error"] }] */
import * as express from "express";
import Controller from "../interfaces/controller.interface";
import validationMiddleware from "../middlewares/validation.middleware";
import AuthPost from "../interfaces/auth.interface";
import AuthenticationService from "../services/authentication.service";
import AuthenticationUtils from "../utils/authentication";
import GroupAlreadyExistsException from "../exceptions/GroupAlreadyExistsException";
import GroupDoesNotExistsOrWrongPasswordException from "../exceptions/GroupDoesNotExistsOrWrongPasswordException";
import UserAlreadyExistsInTheGroupException from "../exceptions/UserAlreadyExistsInTheGroupException";
import HttpError from "../httpErrors/HttpError";
import ServerHttpError from "../httpErrors/ServerHttpError";

class AuthenticationController implements Controller {
  public path = "/auth";

  public router = express.Router();

  public authenticationService = new AuthenticationService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(AuthPost),
      this.registration
    );
  }

  private registration = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const authData: AuthPost = request.body;

    try {
      let createdUser = null;
      if (authData.signType === "createGroup") {
        createdUser = await this.authenticationService.createGroup(authData);
      } else {
        createdUser = await this.authenticationService.joinGroup(authData);
      }

      if (createdUser != null) {
        const token = AuthenticationUtils.createToken(createdUser);
        createdUser.accessToken = token;

        response.status(200);
        response.send(createdUser);
      }
    } catch (e) {
      if (
        e instanceof GroupAlreadyExistsException ||
        e instanceof GroupDoesNotExistsOrWrongPasswordException ||
        e instanceof UserAlreadyExistsInTheGroupException
      ) {
        next(new HttpError(400, e.message, e.translationKey));
      } else {
        console.error(e);
        next(new ServerHttpError());
      }
    }
  };
}

export default AuthenticationController;
