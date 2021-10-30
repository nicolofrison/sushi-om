import { IsBoolean } from "class-validator";

export default class UserPatch {
  @IsBoolean()
  confirmed: boolean;
}
