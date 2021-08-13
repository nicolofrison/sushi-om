import { EntityRepository, Repository } from "typeorm";
import User from "../entities/user.entity";

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
  public createAndSave = async (
    name: string,
    surname: string,
    username: string,
    groupId: number
  ) => {
    const group = new User(name, surname, username, groupId);
    return this.save(group);
  };

  public findByNameAndSurnameAndGroupIdWithoutUsername = async (
    name: string,
    surname: string,
    groupId: number
  ) => (
      (await this.findOne({
        name,
        surname,
        username: null,
        groupId,
      })) ?? null
    );

  public findByUsernameAndGroupId = async (
    username: string,
    groupId: number
  ) => (
      (await this.findOne({ username, groupId })) ?? null
    );
}
