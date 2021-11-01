import * as typeorm from "typeorm";
import { getCustomRepository } from "typeorm";
import { mocked } from "ts-jest/utils";
import OrderAlreadyConfirmedException from "../exceptions/OrderAlreadyConfirmedException";
import OrderDoesNotExistsException from "../exceptions/OrderDoesNotExistsException";
import OrderPost from "../interfaces/orderPost.interface";
import OrdersService from "./orders.service";
import OrderAmountPatch from "../interfaces/OrderAmountPatch.interface";
import OrderRepository from "../repositories/order.repository";

(typeorm as any).getRepository = jest.fn();

jest.mock("typeorm", () => {
  const actual = jest.requireActual("typeorm");
  return {
    ...actual,
    getCustomRepository: jest.fn(),
  };
});

describe("The OrderService", () => {
  describe("order creation", () => {
    describe("create an order", () => {
      const userId = 1;
      const orderPost: OrderPost = {
        code: "1",
        amount: 2,
      };

      const expectedOrder = {
        orderId: 1,
        userId,
        code: orderPost.code,
        amount: orderPost.amount,
      };

      const orderRepo = {
        findByUserIdAndCodeAndRound: jest.fn().mockResolvedValueOnce(null),
        createAndSave: jest.fn().mockResolvedValue(expectedOrder),
      };
      const orderUserViewRepository = {};
      mocked(getCustomRepository).mockImplementation((customRepo) => {
        if (customRepo.name === OrderRepository.name) {
          return orderRepo;
        }
        return orderUserViewRepository;
      });
      mocked(getCustomRepository).mockReturnValue(orderRepo);
      const ordersService = new OrdersService();

      it("should return the expected order", async () => {
        const addedOrder = await ordersService.createOrder(userId, orderPost);
        return expect(addedOrder).toEqual(expectedOrder);
      });
    });

    describe("create an order with already existent code", () => {
      const userId = 1;
      const orderPost: OrderPost = {
        code: "1",
        amount: 2,
      };

      const alreadyExistentOrder = {
        orderId: 1,
        userId,
        code: orderPost.code,
        amount: 5,
      };

      const expectedOrder = {
        orderId: 1,
        userId,
        code: orderPost.code,
        amount: alreadyExistentOrder.amount + orderPost.amount,
      };

      const orderRepo = {
        findByUserIdAndCodeAndRound: jest
          .fn()
          .mockResolvedValueOnce(alreadyExistentOrder),
        save: jest.fn().mockResolvedValue(expectedOrder),
      };
      const orderUserViewRepository = {};
      mocked(getCustomRepository).mockImplementation((customRepo) => {
        if (customRepo.name === OrderRepository.name) {
          return orderRepo;
        }
        return orderUserViewRepository;
      });
      const ordersService = new OrdersService();

      it("should return the expected order", async () => {
        const addedOrder = await ordersService.createOrder(userId, orderPost);
        return expect(addedOrder).toEqual(expectedOrder);
      });
    });
  });

  describe("order update", () => {
    describe("update an order", () => {
      const orderId = 1;
      const userId = 1;
      const orderAmountPatch: OrderAmountPatch = {
        amount: 2,
      };

      const alreadyExistentOrder = {
        orderId,
        userId,
        code: "1",
        amount: 5,
      };

      const expectedOrder = {
        orderId,
        userId,
        code: alreadyExistentOrder.code,
        amount: orderAmountPatch.amount,
      };

      const orderRepo = {
        findByOrderId: jest.fn().mockResolvedValueOnce(alreadyExistentOrder),
        save: jest.fn().mockResolvedValue(expectedOrder),
      };
      const orderUserViewRepository = {};
      mocked(getCustomRepository).mockImplementation((customRepo) => {
        if (customRepo.name === OrderRepository.name) {
          return orderRepo;
        }
        return orderUserViewRepository;
      });
      const ordersService = new OrdersService();

      it("should return the expected order", async () => {
        const updatedOrder = await ordersService.updateOrderAmount(
          orderId,
          userId,
          orderAmountPatch
        );
        return expect(updatedOrder).toEqual(expectedOrder);
      });
    });

    describe("update a not existent order", () => {
      const orderId = 1;
      const userId = 1;
      const orderAmountPatch: OrderAmountPatch = {
        amount: 2,
      };

      const orderRepo = {
        findByOrderId: jest.fn().mockResolvedValueOnce(null),
      };
      const orderUserViewRepository = {};
      mocked(getCustomRepository).mockImplementation((customRepo) => {
        if (customRepo.name === OrderRepository.name) {
          return orderRepo;
        }
        return orderUserViewRepository;
      });
      const ordersService = new OrdersService();

      it("should throw the OrderDoesNotExistsException the expected order", () =>
        expect(
          ordersService.updateOrderAmount(orderId, userId, orderAmountPatch)
        ).rejects.toEqual(new OrderDoesNotExistsException()));
    });

    describe("update an order with a different user", () => {
      const orderId = 1;
      const userId = 1;
      const orderAmountPatch: OrderAmountPatch = {
        amount: 2,
      };

      const alreadyExistentOrder = {
        orderId,
        userId: userId + 1,
        code: "1",
        amount: 5,
      };

      const orderRepo = {
        findByOrderId: jest.fn().mockResolvedValueOnce(alreadyExistentOrder),
      };
      const orderUserViewRepository = {};
      mocked(getCustomRepository).mockImplementation((customRepo) => {
        if (customRepo.name === OrderRepository.name) {
          return orderRepo;
        }
        return orderUserViewRepository;
      });
      const ordersService = new OrdersService();

      it("should throw the OrderDoesNotExistsException", () =>
        expect(
          ordersService.updateOrderAmount(orderId, userId, orderAmountPatch)
        ).rejects.toEqual(new OrderDoesNotExistsException()));
    });

    describe("update an already confirmed order", () => {
      const orderId = 1;
      const userId = 1;
      const orderAmountPatch: OrderAmountPatch = {
        amount: 2,
      };

      const alreadyExistentOrder = {
        orderId,
        userId,
        code: "1",
        amount: 5,
        round: 1,
      };

      const orderRepo = {
        findByOrderId: jest.fn().mockResolvedValueOnce(alreadyExistentOrder),
      };
      const orderUserViewRepository = {};
      mocked(getCustomRepository).mockImplementation((customRepo) => {
        if (customRepo.name === OrderRepository.name) {
          return orderRepo;
        }
        return orderUserViewRepository;
      });
      const ordersService = new OrdersService();

      it("should throw the OrderAlreadyConfirmedException", () =>
        expect(
          ordersService.updateOrderAmount(orderId, userId, orderAmountPatch)
        ).rejects.toEqual(new OrderAlreadyConfirmedException()));
    });
  });

  describe("order remove", () => {
    describe("remove an order", () => {
      const orderId = 1;
      const userId = 1;

      const alreadyExistentOrder = {
        orderId,
        userId,
        code: "1",
        amount: 5,
      };

      const orderRepo = {
        findByOrderId: jest.fn().mockResolvedValueOnce(alreadyExistentOrder),
        remove: jest.fn().mockResolvedValue(alreadyExistentOrder),
      };
      const orderUserViewRepository = {};
      mocked(getCustomRepository).mockImplementation((customRepo) => {
        if (customRepo.name === OrderRepository.name) {
          return orderRepo;
        }
        return orderUserViewRepository;
      });
      const ordersService = new OrdersService();

      it("should return the expected order", async () => {
        const deletedOrder = await ordersService.deleteOrder(orderId, userId);
        return expect(deletedOrder).toEqual(alreadyExistentOrder);
      });
    });

    describe("delete a not existent order", () => {
      const orderId = 1;
      const userId = 1;

      const orderRepo = {
        findByOrderId: jest.fn().mockResolvedValueOnce(null),
      };
      const orderUserViewRepository = {};
      mocked(getCustomRepository).mockImplementation((customRepo) => {
        if (customRepo.name === OrderRepository.name) {
          return orderRepo;
        }
        return orderUserViewRepository;
      });
      const ordersService = new OrdersService();

      it("should throw the OrderDoesNotExistsException the expected order", () =>
        expect(ordersService.deleteOrder(orderId, userId)).rejects.toEqual(
          new OrderDoesNotExistsException()
        ));
    });

    describe("delete an order with a different user", () => {
      const orderId = 1;
      const userId = 1;

      const alreadyExistentOrder = {
        orderId,
        userId: userId + 1,
        code: "1",
        amount: 5,
      };

      const orderRepo = {
        findByOrderId: jest.fn().mockResolvedValueOnce(alreadyExistentOrder),
      };
      const orderUserViewRepository = {};
      mocked(getCustomRepository).mockImplementation((customRepo) => {
        if (customRepo.name === OrderRepository.name) {
          return orderRepo;
        }
        return orderUserViewRepository;
      });
      const ordersService = new OrdersService();

      it("should throw the OrderDoesNotExistsException", () =>
        expect(ordersService.deleteOrder(orderId, userId)).rejects.toEqual(
          new OrderDoesNotExistsException()
        ));
    });

    describe("delete an already confirmed order", () => {
      const orderId = 1;
      const userId = 1;

      const alreadyExistentOrder = {
        orderId,
        userId,
        code: "1",
        amount: 5,
        round: 1,
      };

      const orderRepo = {
        findByOrderId: jest.fn().mockResolvedValueOnce(alreadyExistentOrder),
      };
      const orderUserViewRepository = {};
      mocked(getCustomRepository).mockImplementation((customRepo) => {
        if (customRepo.name === OrderRepository.name) {
          return orderRepo;
        }
        return orderUserViewRepository;
      });
      const ordersService = new OrdersService();

      it("should throw the OrderAlreadyConfirmedException", () =>
        expect(ordersService.deleteOrder(orderId, userId)).rejects.toEqual(
          new OrderAlreadyConfirmedException()
        ));
    });
  });
});
