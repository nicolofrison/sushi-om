import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { DataStoredInToken, TokenData } from "../interfaces/jwt.interface";
import User from "../entities/user.entity";

export default class AuthenticationUtils {
  public static createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = {
      user
    };
    const secret = process.env.JWT_SECRET;
    const expiresIn = parseInt(process.env.JWT_EXPIRATION, 10); // an hour
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

  public static hash = async (toHash: string) => bcrypt.hash(toHash, 10);

  public static passwordIsEqualToHashed = async (
    plain: string,
    hashed: string
  ): Promise<boolean> => bcrypt.compare(plain, hashed);
}
