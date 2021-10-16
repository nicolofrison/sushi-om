import { IsInt, IsPositive } from "class-validator";

export default class OrderPut {
  @IsInt()
  @IsPositive()
  amount: number;
}
