export interface ErrorMessage {
  message: string;
  details?: string;
}

export interface ValidateErrorMessage {
  message: "Validation failed";
  details: { [name: string]: unknown };
}

export interface UnauthorizedErrorMessage extends ErrorMessage {
  message: "Unauthorized";
}

export interface NotFoundError extends ErrorMessage {
  message: "Not Found";
}

const notFoundError = {
  message: "Not Found",
} as const;

export { notFoundError };
