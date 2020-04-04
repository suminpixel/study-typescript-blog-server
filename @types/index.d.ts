import User from '../models/user';

declare module '*.json' { 
  const value: any;
  export default value;
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