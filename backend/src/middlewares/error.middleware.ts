import { Request, Response } from "express";
import HttpException from "../exceptions/HttpException";

/**
 * Errors middleware to call after the initialization of the controllers called only if exception passed to "next" function in the cycle steps before this one
 * @param error
 * @param request
 * @param response
 * @param next
 */
function errorMiddleware(
  error: HttpException,
  request: Request,
  response: Response
) {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";
  response.status(status).send({
    status,
    message,
  });
}

export default errorMiddleware;
