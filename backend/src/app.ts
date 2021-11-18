/* eslint no-console: ["error", { allow: ["info", "error"] }] */
import * as express from "express";
import * as cors from 'cors';
import Controller from "./interfaces/controller.interface";
import errorMiddleware from "./middlewares/error.middleware";

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.initializePreRequestMiddlewares();
    this.initializeControllers(controllers);
    this.initializePostRequestMiddlewares();
  }

  private initializePreRequestMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  private initializePostRequestMiddlewares() {
    this.app.use(errorMiddleware);
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.info(`App listening on the port ${process.env.PORT}`);
    });
  }
}

export default App;
