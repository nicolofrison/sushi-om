import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  ManyToOne,
} from "typeorm";
import Group from "./group.entity";

@Entity()
@Unique("uniqueName", ["name", "surname", "username", "groupId"])
@Unique("uniqueUsername", ["username", "groupId"])
export default class User {
  @PrimaryGeneratedColumn()
  public userId?: number;

  @Column()
  public name: string;

  @Column()
  public surname: string;

  @Column({
    default: null,
  })
  public username: string;

  @ManyToOne(() => Group)
  public groupId: number;

  @Column({
    default: false,
  })
  public confirmed?: boolean;

  constructor(
    name: string,
    surname: string,
    username: string,
    groupId: number
  ) {
    this.name = name;
    this.surname = surname;
    this.username = username;
    this.groupId = groupId;
  }
}
