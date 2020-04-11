import User from '../models/user';

declare module '*.json' { 
  const value: any;
  export default value;
}

declare module "express-serve-static-core" {
    interface Request {
        user?: User;
    }
}
declare global {
  interface Error {}
}

interface IUser extends Partial<User> {
  PostCount: number;
  FollowingCount: number;
  FollowerCount: number;
}

export {
  IUser
};