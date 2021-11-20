import { Entity, Column, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity()
export default class Group {
  @PrimaryGeneratedColumn({ type: "int" })
  groupId?: number;

  @Column({
    unique: true,
  })
  name: string;

  @Column()
  password: string;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Timestamp;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Timestamp;

  constructor(name: string, password: string) {
    this.name = name;
    this.password = password;
  }
}
