import { getCustomRepository, In } from "typeorm";
import UserRepository from "../repositories/user.repository";
import UserPatch from "../interfaces/UserPatch.interface";
import UserDoesNotExistsException from "../exceptions/UserDoesNotExistsException";
import OrderRepository from "../repositories/order.repository";

class UsersService {
  private orderRepo = getCustomRepository(OrderRepository);

  private userRepo = getCustomRepository(UserRepository);

  public updateUser = async (
    userId: number,
    userPatch: UserPatch
  ) => {
    const alreadyExistentUser = await this.userRepo.findOne(userId);
    if (!alreadyExistentUser) {
      throw new UserDoesNotExistsException();
    }

    alreadyExistentUser.confirmed = userPatch.confirmed;
    const user = await this.userRepo.save(alreadyExistentUser);

    const groupUsers = await this.userRepo.find({ where: {groupId: user.groupId}});
    if (groupUsers.every(u => u.confirmed)) {
      const usersIds = groupUsers.map(u => u.userId);

      this.orderRepo.updateUsersRound(usersIds);
      this.userRepo.update({ userId: In(usersIds)}, { confirmed: false });
    }

    return user;
  };
}

export default UsersService;
