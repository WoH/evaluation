import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getConnection } from "typeorm";
import { UserEntity, User } from "../users/user.entity";

export class AuthenticateError extends Error {
  readonly status = 401;

  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, AuthenticateError.prototype);
  }
}

/**
 * Authentication middleware. Sets req["user"]
 */
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const param: string | undefined =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers["authorization"];

  const token = param?.match(/^Bearer (.*)$/)?.[1] || null;

  if (!token) {
    return next(new AuthenticateError("No token provided"));
  }

  jwt.verify(token, process.env.JWT_SECRET!, async (err, decoded) => {
    if (err) {
      next(new AuthenticateError(err.message));
    } else {
      await getConnection()
        .getRepository(UserEntity)
        .findOne((decoded as User)?.id)
        .then((user: UserEntity | undefined) => {
          if (user) {
            req.user = user.toJSON();
            next();
          } else {
            next(new AuthenticateError("User not found"));
          }
        });
    }
  });
};
