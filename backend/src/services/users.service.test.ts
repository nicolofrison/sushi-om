import * as typeorm from "typeorm";
import { getCustomRepository } from "typeorm";
import { mocked } from "ts-jest/utils";
import User from "../entities/user.entity";
import Group from "../entities/group.entity";
import UsersService from "./users.service";
import UserPatch from "../interfaces/UserPatch.interface";
import UserDoesNotExistsException from "../exceptions/UserDoesNotExistsException";

(typeorm as any).getRepository = jest.fn();

jest.mock("typeorm", () => {
  const actual = jest.requireActual("typeorm");
  return {
    ...actual,
    getCustomRepository: jest.fn(),
  };
});

describe("The UserService", () => {
  
  describe("user update", () => {
    describe("update a user", () => {
      const userId = 1;
      const userPatch: UserPatch = {
        confirmed: true,
      };

      const alreadyExistentGroup: Group = {
        name: "groupName",
        password: "pass",
        groupId: 1
      }

      const alreadyExistentUser: User = {
        group: alreadyExistentGroup,
        groupId: 1,
        name: "name",
        surname: "surname",
        username: null,
        confirmed: false,
        userId: userId
      };

      const expectedUser: User = {...alreadyExistentUser, confirmed: userPatch.confirmed};

      const userRepo = {
        findOne: jest.fn().mockResolvedValueOnce(alreadyExistentUser),
        save: jest.fn().mockResolvedValue(expectedUser),
      };
      const orderUserViewRepository = {};
      mocked(getCustomRepository).mockImplementation((customRepo) => {
        return userRepo;
      });
      const usersService = new UsersService();

      it("should return the expected user", async () => {
        const updatedUser = await usersService.updateUser(
          userId,
          userPatch
        );
        return expect(updatedUser).toEqual(expectedUser);
      });
    });

    describe("update a not existent user", () => {
      const userId = 1;
      const userPatch: UserPatch = {
        confirmed: true,
      };

      const userRepo = {
        findOne: jest.fn().mockResolvedValueOnce(null),
      };
      mocked(getCustomRepository).mockReturnValue(userRepo);
      const usersService = new UsersService();

      it("should throw the UserDoesNotExistsException", () =>
        expect(
          usersService.updateUser(userId, userPatch)
        ).rejects.toEqual(new UserDoesNotExistsException()));
    });
  });
});
