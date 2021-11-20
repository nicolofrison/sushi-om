/* eslint no-console: ["error", { allow: ["info", "error"] }] */
import "dotenv/config";
import "reflect-metadata";
import { createConnection } from "typeorm";
import App from "./app";
import validateEnv from "./utils/validateEnv"; // validate environment variables
import config from "./ormconfig";

import AuthenticationController from "./controllers/authentication.controller";
import OrdersController from "./controllers/orders.controller";
import UsersController from "./controllers/users.controller";

import GroupsService from "./services/groups.service";

validateEnv();

(async () => {
  try {
    await createConnection(config);
    
    setInterval(async () => {
      const expirationTimeInSeconds = +process.env.JWT_EXPIRATION;
      const groupService = new GroupsService();
      groupService.deleteExpiredGroups(expirationTimeInSeconds);
    }, +(process.env.DELETE_GROUPS_INTERVAL));

  } catch (error) {
    console.error("Error while connecting to the database", error);
    return error;
  }
  const app = new App([new AuthenticationController(), new OrdersController(), new UsersController()]);
  app.listen();

  return null;
})();
