import { Request } from "express";
import jwt from "jsonwebtoken";
import { getConnection } from "typeorm";
import { UserEntity, User } from "./users/user.entity";
import { Exception } from "tsoa";

export class AuthenticateError extends Error implements Exception {
  readonly status = 401;

  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, AuthenticateError.prototype);
  }
}

export function expressAuthentication(
  request: Request,
  securityName: string,
  _scopes?: string[]
) {
  if (securityName === "jwt") {
    const param: string | undefined =
      request.body.token ||
      request.query.token ||
      request.headers["x-access-token"] ||
      request.headers["authorization"];

    const token = param?.match(/^Bearer (.*)$/)?.[1] || null;

    return new Promise((resolve, reject) => {
      if (!token) {
        return reject(new AuthenticateError("No token provided"));
      }
      jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
        if (err) {
          return reject(new AuthenticateError(err.message));
        } else {
          getConnection()
            .getRepository(UserEntity)
            .findOne((decoded as User).id)
            .then((user: UserEntity | undefined) => {
              if (user) {
                return resolve(user.toJSON());
              } else {
                return reject(new AuthenticateError("User not found"));
              }
            });
        }
      });
    });
  } else {
    throw new AuthenticateError("No matching authentication found");
  }
}
