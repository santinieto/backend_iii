import { test, describe, beforeEach, mock } from "node:test";
import assert from "node:assert";
import esmock from "esmock";

describe("Orders Repository", async () => {
  let orderRepository;
  let ordersManagerMock;
  let OrderDTOMock;

  beforeEach(async () => {
    ordersManagerMock = {
      createOne: mock.fn(),
      readAll: mock.fn(),
      readById: mock.fn(),
      updateById: mock.fn(),
      destroyById: mock.fn(),
    };

    OrderDTOMock = class {
      constructor(data) {
        return data;
      }
    };

    const module = await esmock(
      "../../src/repositories/orders.repository.js",
      {
        "../../src/data/dao.factory.js": {
          ordersManager: ordersManagerMock,
        },
        "../../src/dto/orders.dto.js": {
          default: OrderDTOMock,
        },
      }
    );
    orderRepository = module.default;
  });

  describe("createOne", () => {
    test("should apply DTO and call manager createOne", async () => {
      const mockData = { cart_id: "cart1", total: 100 };
      const mockOrder = { _id: "order1", ...mockData };
      ordersManagerMock.createOne.mock.mockImplementation(function() {
        return mockOrder;
      });

      const result = await orderRepository.createOne(mockData);

      assert.strictEqual(ordersManagerMock.createOne.mock.calls.length, 1);
      assert.deepStrictEqual(result, mockOrder);
    });
  });

  describe("readAll", () => {
    test("should call manager readAll", async () => {
      const mockOrders = [{ _id: "order1" }];
      ordersManagerMock.readAll.mock.mockImplementation(() => mockOrders);

      const result = await orderRepository.readAll();

      assert.strictEqual(ordersManagerMock.readAll.mock.calls.length, 1);
      assert.deepStrictEqual(result, mockOrders);
    });
  });

  describe("readOne", () => {
    test("should call manager readById", async () => {
      const mockOrder = { _id: "order1" };
      ordersManagerMock.readById.mock.mockImplementation(() => mockOrder);

      const result = await orderRepository.readOne("order1");

      assert.strictEqual(ordersManagerMock.readById.mock.calls.length, 1);
      assert.strictEqual(ordersManagerMock.readById.mock.calls[0].arguments[0], "order1");
      assert.deepStrictEqual(result, mockOrder);
    });
  });

  describe("updateOne", () => {
    test("should call manager updateById", async () => {
      const mockData = { status: "shipped" };
      const mockOrder = { _id: "order1", status: "shipped" };
      ordersManagerMock.updateById.mock.mockImplementation(function() {
        return mockOrder;
      });

      const result = await orderRepository.updateOne("order1", mockData);

      assert.strictEqual(ordersManagerMock.updateById.mock.calls.length, 1);
      assert.strictEqual(ordersManagerMock.updateById.mock.calls[0].arguments[0], "order1");
      assert.deepStrictEqual(ordersManagerMock.updateById.mock.calls[0].arguments[1], mockData);
      assert.deepStrictEqual(result, mockOrder);
    });
  });

  describe("deleteOne", () => {
    test("should call manager destroyById", async () => {
      ordersManagerMock.destroyById.mock.mockImplementation(() => true);

      const result = await orderRepository.deleteOne("order1");

      assert.strictEqual(ordersManagerMock.destroyById.mock.calls.length, 1);
      assert.strictEqual(ordersManagerMock.destroyById.mock.calls[0].arguments[0], "order1");
      assert.strictEqual(result, true);
    });
  });
});
