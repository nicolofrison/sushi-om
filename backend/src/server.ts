/* eslint no-console: ["error", { allow: ["info", "error"] }] */
import "dotenv/config";
import "reflect-metadata";
import { createConnection } from "typeorm";
import App from "./app";
import validateEnv from "./utils/validateEnv"; // validate environment variables
import config from "./ormconfig";

import AuthenticationController from "./controllers/authentication.controller";
import OrdersController from "./controllers/orders.controller";

validateEnv();

(async () => {
  try {
    await createConnection(config);
  } catch (error) {
    console.error("Error while connecting to the database", error);
    return error;
  }
  const app = new App([new AuthenticationController(), new OrdersController()]);
  app.listen();

  return null;
})();
