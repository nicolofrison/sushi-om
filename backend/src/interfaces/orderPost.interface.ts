import { IsInt, IsPositive, IsString, IsNotEmpty } from "class-validator";

export default class OrderPost {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsInt()
  @IsPositive()
  amount: number;
}
