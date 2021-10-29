import { getCustomRepository } from "typeorm";
import UserRepository from "../repositories/user.repository";
import UserPatch from "../interfaces/UserPatch.interface";
import UserDoesNotExistsException from "../exceptions/UserDoesNotExistsException";

class UsersService {
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
    return user;
  };
}

export default UsersService;
