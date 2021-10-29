import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getCustomRepository } from "typeorm";
import UserRepository from "../repositories/user.repository";
import {
  AuthenticationException,
  AuthenticationExceptionType,
} from "../exceptions/AuthenticationExceptions";
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
          new AuthenticationException(
            AuthenticationExceptionType.WrongAuthenticationToken
          )
        );
      }
    } catch (error) {

      const jwtError = error as jwt.JsonWebTokenError;
      if (jwtError) {
        console.error(jwtError.name);
        console.error(jwtError.message);
        if (jwtError.name === "TokenExpiredError") {
          next(new AuthenticationException(AuthenticationExceptionType.ExpiredAuthenticationToken));
        } else {
          next(new AuthenticationException(AuthenticationExceptionType.WrongAuthenticationToken));
        }
      } else {
        next(
          new AuthenticationException(AuthenticationExceptionType.General)
        );
      }
    }
  } else {
    next(
      new AuthenticationException(AuthenticationExceptionType.MissingOrWrongAuthenticationToken)
    );
  }
}

export default authMiddleware;
