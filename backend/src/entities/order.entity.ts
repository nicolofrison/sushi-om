import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import User from "./user.entity";

@Entity()
export default class Order {
  @PrimaryGeneratedColumn()
  orderId: number;

  @ManyToOne(() => User)
  userId: number;

  @Column()
  code: string;

  @Column()
  amount: number;

  @Column()
  checked: boolean;

  @Column()
  confirmed: boolean;
}
