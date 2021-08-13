import { IsIn, IsOptional, IsString } from "class-validator";

export default class AuthPost {
  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsString()
  groupName: string;

  @IsString()
  groupPassword: string;

  @IsString()
  @IsIn(["createGroup", "joinGroup"])
  signType: "createGroup" | "joinGroup";
}
