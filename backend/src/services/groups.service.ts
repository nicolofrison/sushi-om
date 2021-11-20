import { getCustomRepository, In, MoreThan, Raw } from "typeorm";

import GroupRepository from "../repositories/group.repository";

class GroupsService {
  private static instance: GroupsService;

  public static getInstance(): GroupsService {
    if (!this.instance) {
      this.instance = new GroupsService();
    }

    return this.instance;
  }

  private groupRepo = getCustomRepository(GroupRepository);

  public deleteExpiredGroups = async (
    expirationTimeInSeconds: number
  ) => {
    await this.groupRepo.query(`
      DELETE FROM "group"
      WHERE "createdAt"::timestamp + CONCAT($1::VARCHAR, ' seconds')::interval < NOW();
    `, [expirationTimeInSeconds]);
  };
}

export default GroupsService;
