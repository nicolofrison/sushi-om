import User from "entities/user.entity";

export interface DataStoredInToken {
  user: User;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}
