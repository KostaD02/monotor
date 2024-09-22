import { Timestamps } from './timestamps';

export enum UserRole {
  Default = 'default',
  Admin = 'admin',
}

export interface User extends Timestamps {
  _id: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  email: string;
  password: string;
}

export type UserUnwantedKeys = 'password';
export type UserPayload = Omit<User, UserUnwantedKeys>;
