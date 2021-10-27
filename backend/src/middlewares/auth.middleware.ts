import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getCustomRepository } from "typeorm";
import UserRepository from "../repositories/user.repository";
import {
  AuthenticationTokenException,
  AuthenticationTokenExceptionType,
} from "../exceptions/authenticationExceptions";
import { DataStoredInToken } from "../interfaces/jwt.interface";
import RequestWithUser from "../interfaces/requestWithUser.interface";

async function authMiddleware(
  request: RequestWithUser,
  response: Response,
  next: NextFunction
) {
  const { headers } = request;
  const authorization = headers?.authorization;
  if (authorization) {
    console.log(authorization);
    const secret = process.env.JWT_SECRET;
    try {
      const verificationResponse = jwt.verify(
        authorization,
        secret
      ) as DataStoredInToken;
      const { userId } = verificationResponse.user;
      const userRepo = getCustomRepository(UserRepository);
      const user = await userRepo.findOne(userId);
      if (user) {
        request.user = user;
        next();
      } else {
        next(
          new AuthenticationTokenException(
            AuthenticationTokenExceptionType.Wrong
          )
        );
      }
    } catch (error) {
      next(
        new AuthenticationTokenException(AuthenticationTokenExceptionType.Wrong)
      );
    }
  } else {
    next(
      new AuthenticationTokenException(AuthenticationTokenExceptionType.Missing)
    );
  }
}

export default authMiddleware;
