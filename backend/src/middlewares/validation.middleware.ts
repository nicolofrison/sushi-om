import { plainToClass } from "class-transformer"; // used to convert the request body into a class
import { validate, ValidationError } from "class-validator"; // used to check if the conversion from request body to class is not successfull and manage that situation
import * as express from "express";
import HttpException from "../exceptions/HttpException";

/**
 * Validations middleware that checks if the request body corrispond to the "type" class furnished as parameter
 * @template T
 * @param type
 * @param [skipMissingProperties] true if skip the validation of the properties that are null or undefined, otherwise false (default: false)
 * @returns middleware
 */
function validationMiddleware(type: any): express.RequestHandler {
  return (req, res, next) => {
    validate(plainToClass(type, req.body)).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors
          .map((error: ValidationError) => Object.values(error.constraints))
          .join(", ");
        next(new HttpException(400, message));
      } else {
        next();
      }
    });
  };
}

export default validationMiddleware;
