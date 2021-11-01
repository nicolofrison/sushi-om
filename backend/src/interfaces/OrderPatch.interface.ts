import { IsBoolean, IsInt, IsOptional, IsPositive } from "class-validator";

export default class OrderPut {
  @IsInt()
  @IsPositive()
  @IsOptional()
  amount?: number;
  
  @IsBoolean()
  @IsOptional()
  checked?: boolean;
}