import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import User from "./user.entity";

@Entity()
export default class Order {
  @PrimaryGeneratedColumn({ type: "int" })
  orderId?: number;

  @ManyToOne(type => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: number;

  @Column()
  code: string;

  @Column({ type: "int" })
  amount: number;

  @Column({default: false})
  checked: boolean;

  @Column({ type: "int", nullable: true })
  round?: number;

  constructor(userId: number, code: string, amount: number) {
    this.userId = userId;
    this.code = code;
    this.amount = amount;
  }
}
