import * as typeorm from "typeorm";
import AuthPost from "interfaces/auth.interface";
import { getCustomRepository } from "typeorm";
import { mocked } from "ts-jest/utils";
import AuthenticationService from "./authentication.service";
import AuthenticationUtils from "../utils/authentication";
import UserRepository from "../repositories/user.repository";
import GroupAlreadyExistsException from "../exceptions/GroupAlreadyExistsException";
import GroupDoesNotExistsOrWrongPasswordException from "../exceptions/GroupDoesNotExistsOrWrongPasswordException";
import UserAlreadyExistsInTheGroupException from "../exceptions/UserAlreadyExistsInTheGroupException";

(typeorm as any).getRepository = jest.fn();

jest.mock("typeorm", () => {
  const actual = jest.requireActual("typeorm");
  return {
    ...actual,
    getCustomRepository: jest.fn(),
  };
});

describe("The AuthenticationService", () => {
  describe("create a group", () => {
    const authPost: AuthPost = {
      name: "name",
      surname: "surname",
      groupName: "groupName",
      groupPassword: "psw",
      signType: "createGroup",
    };

    const expectedUser = {
      userId: 1,
      name: authPost.name,
      surname: authPost.surname,
      username: null,
      groupId: 1,
      confirmed: false,
    };
    const expectedGroup = {
      groupId: 1,
      name: authPost.groupName,
      password: authPost.groupPassword,
    };

    const userRepo = {
      createAndSave: jest.fn().mockResolvedValueOnce(expectedUser),
    };
    const groupRepo = {
      createAndSave: jest.fn().mockResolvedValue(expectedGroup),
      findByName: jest.fn().mockResolvedValueOnce(null),
    };
    mocked(getCustomRepository).mockImplementation((customRepo) => {
      if (customRepo.name === UserRepository.name) {
        return userRepo;
      }
      return groupRepo;
    });
    const authenticationService = new AuthenticationService();

    it("should return the expected user", async () => {
      const addedUser = await authenticationService.createGroup(authPost);
      return expect(addedUser).toEqual(expectedUser);
    });
  });

  describe("create an already existent group", () => {
    const authPost: AuthPost = {
      name: "name",
      surname: "surname",
      groupName: "groupName",
      groupPassword: "psw",
      signType: "createGroup",
    };

    const expectedUser = {
      userId: 1,
      name: authPost.name,
      surname: authPost.surname,
      username: null,
      groupId: 1,
      confirmed: false,
    };
    const expectedGroup = {
      groupId: 1,
      name: authPost.groupName,
      password: authPost.groupPassword,
    };

    const userRepo = {
      createAndSave: jest.fn().mockResolvedValueOnce(expectedUser),
    };
    const groupRepo = {
      createAndSave: jest.fn().mockResolvedValue(expectedGroup),
      findByName: jest.fn().mockResolvedValueOnce(expectedGroup),
    };
    mocked(getCustomRepository).mockImplementation((customRepo) => {
      if (customRepo.name === UserRepository.name) {
        return userRepo;
      }
      return groupRepo;
    });
    const authenticationService = new AuthenticationService();

    it("should throw the GroupAlreadyExistsException", async () =>
      expect(authenticationService.createGroup(authPost)).rejects.toThrow(
        GroupAlreadyExistsException
      ));
  });

  describe("join a group", () => {
    const authPost: AuthPost = {
      name: "name",
      surname: "surname",
      groupName: "groupName",
      groupPassword: "psw",
      signType: "createGroup",
    };

    const expectedUser = {
      userId: 1,
      name: authPost.name,
      surname: authPost.surname,
      username: null,
      groupId: 1,
      confirmed: false,
    };

    it("should return the user with the expectedGroup id", async () => {
      const expectedGroup = {
        groupId: 1,
        name: authPost.groupName,
        password: await AuthenticationUtils.hash(authPost.groupPassword),
      };

      const userRepo = {
        createAndSave: jest.fn().mockResolvedValueOnce(expectedUser),
        findByNameAndSurnameAndGroupIdWithoutUsername: jest
          .fn()
          .mockResolvedValueOnce(null),
        findByUsernameAndGroupId: jest.fn().mockResolvedValueOnce(null),
      };
      const groupRepo = {
        findByName: jest.fn().mockResolvedValueOnce(expectedGroup),
      };
      mocked(getCustomRepository).mockImplementation((customRepo) => {
        if (customRepo.name === UserRepository.name) {
          return userRepo;
        }
        return groupRepo;
      });
      const authenticationService = new AuthenticationService();

      const user = await authenticationService.joinGroup(authPost);
      return expect(user).toEqual(expectedUser);
    });
  });

  describe("join a non existent group", () => {
    const authPost: AuthPost = {
      name: "name",
      surname: "surname",
      groupName: "groupName",
      groupPassword: "psw",
      signType: "createGroup",
    };

    const expectedUser = {
      userId: 1,
      name: authPost.name,
      surname: authPost.surname,
      username: null,
      groupId: 1,
      confirmed: false,
    };

    it("should thrown the GroupDoesNotExistsOrWrongPasswordException", async () => {
      const userRepo = {
        createAndSave: jest.fn().mockResolvedValueOnce(expectedUser),
        findByNameAndSurnameAndGroupIdWithoutUsername: jest
          .fn()
          .mockResolvedValueOnce(null),
        findByUsernameAndGroupId: jest.fn().mockResolvedValueOnce(null),
      };
      const groupRepo = {
        findByName: jest.fn().mockResolvedValueOnce(null),
      };
      mocked(getCustomRepository).mockImplementation((customRepo) => {
        if (customRepo.name === UserRepository.name) {
          return userRepo;
        }
        return groupRepo;
      });
      const authenticationService = new AuthenticationService();

      return expect(authenticationService.joinGroup(authPost)).rejects.toThrow(
        GroupDoesNotExistsOrWrongPasswordException
      );
    });
  });

  describe("join a a group with wrong password", () => {
    const authPost: AuthPost = {
      name: "name",
      surname: "surname",
      groupName: "groupName",
      groupPassword: "psw",
      signType: "createGroup",
    };

    const expectedUser = {
      userId: 1,
      name: authPost.name,
      surname: authPost.surname,
      username: null,
      groupId: 1,
      confirmed: false,
    };

    it("should thrown the GroupDoesNotExistsOrWrongPasswordException", async () => {
      const expectedGroup = {
        groupId: 1,
        name: authPost.groupName,
        password: await AuthenticationUtils.hash("psw1"),
      };
      const userRepo = {
        createAndSave: jest.fn().mockResolvedValueOnce(expectedUser),
        findByNameAndSurnameAndGroupIdWithoutUsername: jest
          .fn()
          .mockResolvedValueOnce(null),
        findByUsernameAndGroupId: jest.fn().mockResolvedValueOnce(null),
      };
      const groupRepo = {
        findByName: jest.fn().mockResolvedValueOnce(expectedGroup),
      };
      mocked(getCustomRepository).mockImplementation((customRepo) => {
        if (customRepo.name === UserRepository.name) {
          return userRepo;
        }
        return groupRepo;
      });
      const authenticationService = new AuthenticationService();

      return expect(authenticationService.joinGroup(authPost)).rejects.toThrow(
        GroupDoesNotExistsOrWrongPasswordException
      );
    });
  });

  describe("user join a group with already existent user with same name and surname and without username", () => {
    const authPost: AuthPost = {
      name: "name",
      surname: "surname",
      groupName: "groupName",
      groupPassword: "psw",
      signType: "createGroup",
    };

    const expectedUser = {
      userId: 1,
      name: authPost.name,
      surname: authPost.surname,
      username: null,
      groupId: 1,
      confirmed: false,
    };

    it("should thrown the UserAlreadyExistsInTheGroupException", async () => {
      const expectedGroup = {
        groupId: 1,
        name: authPost.groupName,
        password: await AuthenticationUtils.hash(authPost.groupPassword),
      };
      const userRepo = {
        createAndSave: jest.fn().mockResolvedValueOnce(expectedUser),
        findByNameAndSurnameAndGroupIdWithoutUsername: jest
          .fn()
          .mockResolvedValueOnce(expectedUser),
        findByUsernameAndGroupId: jest.fn().mockResolvedValueOnce(null),
      };
      const groupRepo = {
        findByName: jest.fn().mockResolvedValueOnce(expectedGroup),
      };
      mocked(getCustomRepository).mockImplementation((customRepo) => {
        if (customRepo.name === UserRepository.name) {
          return userRepo;
        }
        return groupRepo;
      });
      const authenticationService = new AuthenticationService();

      return expect(authenticationService.joinGroup(authPost)).rejects.toThrow(
        UserAlreadyExistsInTheGroupException
      );
    });
  });

  describe("user join a group with already existent user with same username", () => {
    const authPost: AuthPost = {
      name: "name",
      surname: "surname",
      username: "username",
      groupName: "groupName",
      groupPassword: "psw",
      signType: "createGroup",
    };

    const expectedUser = {
      userId: 1,
      name: authPost.name,
      surname: authPost.surname,
      username: "username",
      groupId: 1,
      confirmed: false,
    };

    it("should thrown the UserAlreadyExistsInTheGroupException", async () => {
      const expectedGroup = {
        groupId: 1,
        name: authPost.groupName,
        password: await AuthenticationUtils.hash(authPost.groupPassword),
      };
      const userRepo = {
        createAndSave: jest.fn().mockResolvedValueOnce(expectedUser),
        findByNameAndSurnameAndGroupIdWithoutUsername: jest
          .fn()
          .mockResolvedValueOnce(null),
        findByUsernameAndGroupId: jest.fn().mockResolvedValueOnce(expectedUser),
      };
      const groupRepo = {
        findByName: jest.fn().mockResolvedValueOnce(expectedGroup),
      };
      mocked(getCustomRepository).mockImplementation((customRepo) => {
        if (customRepo.name === UserRepository.name) {
          return userRepo;
        }
        return groupRepo;
      });
      const authenticationService = new AuthenticationService();

      return expect(authenticationService.joinGroup(authPost)).rejects.toThrow(
        UserAlreadyExistsInTheGroupException
      );
    });
  });

  describe("user with username join a group with already existent user with same name and surname but without username", () => {
    const authPost: AuthPost = {
      name: "name",
      surname: "surname",
      username: "username",
      groupName: "groupName",
      groupPassword: "psw",
      signType: "createGroup",
    };

    const alreadyExistentUser = {
      userId: 1,
      name: authPost.name,
      surname: authPost.surname,
      username: null,
      groupId: 1,
      confirmed: false,
    };
    const expectedUser = {
      userId: 2,
      name: authPost.name,
      surname: authPost.surname,
      username: authPost.username,
      groupId: 1,
      confirmed: false,
    };

    it("should return the expected user", async () => {
      const expectedGroup = {
        groupId: 1,
        name: authPost.groupName,
        password: await AuthenticationUtils.hash(authPost.groupPassword),
      };
      const userRepo = {
        createAndSave: jest.fn().mockResolvedValueOnce(expectedUser),
        findByNameAndSurnameAndGroupIdWithoutUsername: jest
          .fn()
          .mockResolvedValueOnce(alreadyExistentUser),
        findByUsernameAndGroupId: jest.fn().mockResolvedValueOnce(null),
      };
      const groupRepo = {
        findByName: jest.fn().mockResolvedValueOnce(expectedGroup),
      };
      mocked(getCustomRepository).mockImplementation((customRepo) => {
        if (customRepo.name === UserRepository.name) {
          return userRepo;
        }
        return groupRepo;
      });
      const authenticationService = new AuthenticationService();
      return expect(authenticationService.joinGroup(authPost)).resolves.toEqual(
        expectedUser
      );
    });
  });

  describe("user without username join a group with already existent user with same name and surname", () => {
    const authPost: AuthPost = {
      name: "name",
      surname: "surname",
      groupName: "groupName",
      groupPassword: "psw",
      signType: "createGroup",
    };

    const expectedUser = {
      userId: 2,
      name: authPost.name,
      surname: authPost.surname,
      username: null,
      groupId: 1,
      confirmed: false,
    };

    it("should return the expected user", async () => {
      const expectedGroup = {
        groupId: 1,
        name: authPost.groupName,
        password: await AuthenticationUtils.hash(authPost.groupPassword),
      };
      const userRepo = {
        createAndSave: jest.fn().mockResolvedValueOnce(expectedUser),
        findByNameAndSurnameAndGroupIdWithoutUsername: jest
          .fn()
          .mockResolvedValueOnce(null),
        findByUsernameAndGroupId: jest.fn().mockResolvedValueOnce(null),
      };
      const groupRepo = {
        findByName: jest.fn().mockResolvedValueOnce(expectedGroup),
      };
      mocked(getCustomRepository).mockImplementation((customRepo) => {
        if (customRepo.name === UserRepository.name) {
          return userRepo;
        }
        return groupRepo;
      });
      const authenticationService = new AuthenticationService();
      return expect(authenticationService.joinGroup(authPost)).resolves.toEqual(
        expectedUser
      );
    });
  });
});
