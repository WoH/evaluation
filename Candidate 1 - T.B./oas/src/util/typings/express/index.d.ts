declare namespace Express {
  export interface Request {
    user: import("../../../users/user.entity").User;
  }
}
