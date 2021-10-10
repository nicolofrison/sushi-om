import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import User from "./user.entity";

@Entity()
export default class Order {
  @PrimaryGeneratedColumn({ type: "int" })
  orderId?: number;

  @ManyToOne(() => User)
  userId: number;

  @Column()
  code: string;

  @Column({ type: "int" })
  amount: number;

  @Column()
  checked?: boolean;

  @Column()
  confirmed?: boolean;

  constructor(userId: number, code: string, amount: number) {
    this.userId = userId;
    this.code = code;
    this.amount = amount;
  }
}
