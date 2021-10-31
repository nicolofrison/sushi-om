import { IsInt, IsPositive } from "class-validator";

export default class OrderAmountPatch {
  @IsInt()
  @IsPositive()
  amount: number;
}
