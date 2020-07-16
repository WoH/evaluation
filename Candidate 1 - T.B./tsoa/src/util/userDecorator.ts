import "reflect-metadata";
import { Security as TsoaSecurity } from "tsoa";
const userMetadataKey = Symbol("required");

export function InjectUser() {
  return function (
    target: Object,
    propertyKey: string,
    parameterIndex: number
  ) {
    let existingUserParameters: number[] =
      Reflect.getOwnMetadata(userMetadataKey, target, propertyKey) || [];
    existingUserParameters.push(parameterIndex);

    Reflect.defineMetadata(
      userMetadataKey,
      existingUserParameters,
      target,
      propertyKey
    );
  };
}

export function Security(
  name:
    | string
    | {
        [name: string]: string[];
      },
  scopes?: string[]
) {
  return function (
    target: any,
    propertyName?: string,
    descriptor?: TypedPropertyDescriptor<Function>
  ) {
    TsoaSecurity(name, scopes)(target, propertyName, descriptor);

    if (typeof target === "function") {
      for (const methodName of Object.getOwnPropertyNames(target.prototype)) {
        let userParameters: number[] = Reflect.getOwnMetadata(
          userMetadataKey,
          target.prototype,
          methodName
        );

        if (userParameters) {
          const existing = target.prototype[methodName];

          target.prototype[methodName] = function () {
            for (let parameterIndex of userParameters) {
              arguments[parameterIndex] = arguments[parameterIndex].user;
            }

            return existing.apply(this, arguments);
          };
        }
      }

      return target;
    } else {
      const method = descriptor!.value;
      descriptor!.value = function () {
        let userParameters: number[] = Reflect.getOwnMetadata(
          userMetadataKey,
          target,
          propertyName!
        );

        if (userParameters) {
          for (let parameterIndex of userParameters) {
            arguments[parameterIndex] = arguments[parameterIndex].user;
          }
        }

        return method?.apply(this, arguments);
      };
    }
  };
}
