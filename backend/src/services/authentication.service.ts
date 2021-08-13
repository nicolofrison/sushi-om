import { getCustomRepository } from "typeorm";
import GroupRepository from "../repositories/group.repository";
import UserRepository from "../repositories/user.repository";
import AuthPost from "../interfaces/auth.interface";
import AuthenticationUtils from "../utils/authentication";
import GroupAlreadyExistsException from '../exceptions/GroupAlreadyExistsException';
import GroupDoesNotExistsOrWrongPasswordException from '../exceptions/GroupDoesNotExistsOrWrongPasswordException';
import UserAlreadyExistsInTheGroupException from '../exceptions/UserAlreadyExistsInTheGroupException';

class AuthenticationService {

  private groupRepo = getCustomRepository(GroupRepository);

  private userRepo = getCustomRepository(UserRepository);

  public createGroup = async (authData: AuthPost) => {
    const alreadyExistentGroup = await this.groupRepo.findByName(
      authData.groupName
    );
    if (alreadyExistentGroup != null) {
      throw new GroupAlreadyExistsException();
    }

    const hashedPassword = await AuthenticationUtils.hash(
      authData.groupPassword
    );
    const createdGroup = await this.groupRepo.createAndSave(
      authData.groupName,
      hashedPassword
    );

    const user = await this.userRepo.createAndSave(
      authData.name,
      authData.surname,
      authData.username ?? null,
      createdGroup.groupId
    );
    return user;
  };

  public joinGroup = async (authData: AuthPost) => {
    const alreadyExistentGroup = await this.groupRepo.findByName(
      authData.groupName
    );
    if (alreadyExistentGroup == null) {
      throw new GroupDoesNotExistsOrWrongPasswordException();
    }

    if (
      (await AuthenticationUtils.passwordIsEqualToHashed(
        authData.groupPassword,
        alreadyExistentGroup.password
      )) === false
    ) {
      throw new GroupDoesNotExistsOrWrongPasswordException();
    }

    let alreadyExistentUser = null;
    if (authData.username != null) {
      alreadyExistentUser = await this.userRepo.findByUsernameAndGroupId(
        authData.username,
        alreadyExistentGroup.groupId
      );
    } else {
      alreadyExistentUser =
        await this.userRepo.findByNameAndSurnameAndGroupIdWithoutUsername(
          authData.name,
          authData.surname,
          alreadyExistentGroup.groupId
        );
    }

    if (alreadyExistentUser != null) {
      throw new UserAlreadyExistsInTheGroupException();
    }

    const user = await this.userRepo.createAndSave(
      authData.name,
      authData.surname,
      authData.username ?? null,
      alreadyExistentGroup.groupId
    )
    return user;
  };
}

export default AuthenticationService;
