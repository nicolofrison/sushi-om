import { EntityRepository, Repository } from "typeorm";
import Group from "../entities/group.entity";

@EntityRepository(Group)
export default class GroupRepository extends Repository<Group> {
  public createAndSave = async (name: string, password: string) => {
    const group = new Group(name, password);
    return this.save(group);
  };

  public findByName = async (name: string) => (await this.findOne({ name })) ?? null;
}
