import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { createConnection } from "typeorm";
import { registerUsers } from "./users/user.controller";
import { registerTodos } from "./todos/todo.controller";
import { AuthenticateError } from "./util/authenticationMiddleware";
import swaggerUi from "swagger-ui-express";

createConnection()
  .then(async () => {
    const app = express();
    app.use(bodyParser.json());

    app.use("/api", swaggerUi.serve, async (_req: Request, res: Response) => {
      return res.send(
        swaggerUi.generateHTML(await import("../build/openapi.json"))
      );
    });

    registerUsers(app);
    registerTodos(app);

    app.use(function errorHandler(
      err: unknown,
      _req: Request,
      res: Response,
      next: NextFunction
    ): Response | void {
      if (err instanceof AuthenticateError) {
        console.warn("Authentication Error", err);
        return res.status(401).json({
          message: "Unauthorized",
          details: "Authorization failed",
        });
      }

      if (err instanceof Error) {
        console.error(err);
        return res.status(500).json({
          message: "Internal Server Error",
        });
      }

      next();
    });

    // run app
    app.listen(3001);

    console.log("Express application is up and running on port 3001");
  })
  .catch((error) => console.log("TypeORM connection error: ", error));
