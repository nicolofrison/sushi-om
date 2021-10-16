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
  const { cookies } = request;
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;
    try {
      const verificationResponse = jwt.verify(
        cookies.Authorization,
        secret
      ) as DataStoredInToken;
      const { id } = verificationResponse;
      const userRepo = getCustomRepository(UserRepository);
      const user = await userRepo.findOne({ userId: id });
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