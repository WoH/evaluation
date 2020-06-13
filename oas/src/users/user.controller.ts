import { Express, Request } from "express";
import { UserService, UserLoginDto, ConflictError } from "./user.service";
import { sign } from "jsonwebtoken";
import { User } from "./user.entity";
import { ErrorMessage } from "../util/errors";

export function registerUsers(app: Express) {
  const userService = new UserService();

  /**
   * @api [post] /users
   *    produces:
   *      - "application/json"
   *    requestBody:
   *      required: true
   *      content:
   *        "application/json":
   *          schema:
   *            $ref: "#/components/schemas/UserLoginDto"
   *    responses:
   *      "200":
   *        content:
   *          "application/json":
   *            schema:
   *              $ref: "#/components/schemas/User"
   *      "400":
   *        content:
   *          "application/json":
   *            schema:
   *              $ref: "#/components/schemas/ErrorMessage"
   *      "500":
   *        description: "Unexpected error"
   *        content:
   *          "application/json":
   *            schema:
   *              $ref: "#/components/schemas/ErrorMessage"
   **/
  app.post(
    "/users",
    async (req: Request<{}, User | ErrorMessage, UserLoginDto>, res) => {
      try {
        return res.json(await userService.create(req.body));
      } catch (err) {
        if (err instanceof ConflictError) {
          return res.status(400).json({
            message: "Validation failed",
            details: { name: "username already taken" },
          });
        }
        throw err;
      }
    }
  );

  /**
   * @api [post] /users/login
   *    produces:
   *      - "application/json"
   *    requestBody:
   *      required: true
   *      content:
   *        "application/json":
   *          schema:
   *            $ref: "#/components/schemas/UserLoginDto"
   *    responses:
   *      "200":
   *        content:
   *          "application/json":
   *            schema:
   *              type: object
   *              required:
   *                - token
   *              properties:
   *                token:
   *                  type: string
   *      "401":
   *        description: "Unauthorized"
   *        content:
   *          "application/json":
   *            schema:
   *              $ref: "#/components/schemas/ErrorMessage"
   *      "404":
   *        description: "Not Found"
   *        content:
   *          "application/json":
   *            schema:
   *              $ref: "#/components/schemas/ErrorMessage"
   *      "500":
   *        description: "Unexpected error"
   *        content:
   *          "application/json":
   *            schema:
   *              $ref: "#/components/schemas/ErrorMessage"
   **/
  app.post(
    "/users/login",
    async (
      req: Request<{}, ErrorMessage | { token: string }, UserLoginDto>,
      res
    ) => {
      const [user] = await userService.find({ name: req.body.name });

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      if (!(await userService.checkPasswork(user.id, req.body.password))) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const token = sign(
        { id: user.id, name: user.name },
        process.env.JWT_SECRET!,
        { expiresIn: "2 days" }
      );

      return res.json({ token });
    }
  );
}
