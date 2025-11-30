import { test, describe, beforeEach, mock } from "node:test";
import assert from "node:assert";
import esmock from "esmock";

describe("Orders Service", async () => {
  let ordersService;
  let ordersRepositoryMock;

  beforeEach(async () => {
    ordersRepositoryMock = {
      createOne: mock.fn(),
      readAll: mock.fn(),
      readOne: mock.fn(),
      updateOne: mock.fn(),
      deleteOne: mock.fn(),
    };

    const { ordersService: service } = await esmock(
      "../../src/services/orders.service.js",
      {
        "../../src/repositories/orders.repository.js": {
          default: ordersRepositoryMock,
        },
      }
    );
    ordersService = service;
  });

  describe("readAll", () => {
    test("should delegate to repository", async () => {
      const mockOrders = [{ _id: "order1" }, { _id: "order2" }];
      ordersRepositoryMock.readAll.mock.mockImplementation(() => mockOrders);

      const result = await ordersService.readAll();

      assert.strictEqual(ordersRepositoryMock.readAll.mock.calls.length, 1);
      assert.deepStrictEqual(result, mockOrders);
    });
  });

  describe("readOne", () => {
    test("should delegate to repository", async () => {
      const mockOrder = { _id: "order1", total: 100 };
      ordersRepositoryMock.readOne.mock.mockImplementation(() => mockOrder);

      const result = await ordersService.readOne("order1");

      assert.strictEqual(ordersRepositoryMock.readOne.mock.calls.length, 1);
      assert.strictEqual(ordersRepositoryMock.readOne.mock.calls[0].arguments[0], "order1");
      assert.deepStrictEqual(result, mockOrder);
    });
  });

  describe("createOne", () => {
    test("should delegate to repository", async () => {
      const mockData = { cart_id: "cart1", total: 100 };
      const mockOrder = { ...mockData, _id: "order1" };
      ordersRepositoryMock.createOne.mock.mockImplementation(() => mockOrder);

      const result = await ordersService.createOne(mockData);

      assert.strictEqual(ordersRepositoryMock.createOne.mock.calls.length, 1);
      assert.deepStrictEqual(ordersRepositoryMock.createOne.mock.calls[0].arguments[0], mockData);
      assert.deepStrictEqual(result, mockOrder);
    });
  });

  describe("updateOne", () => {
    test("should delegate to repository", async () => {
      const mockData = { status: "shipped" };
      const mockOrder = { _id: "order1", status: "shipped" };
      ordersRepositoryMock.updateOne.mock.mockImplementation(() => mockOrder);

      const result = await ordersService.updateOne("order1", mockData);

      assert.strictEqual(ordersRepositoryMock.updateOne.mock.calls.length, 1);
      assert.strictEqual(ordersRepositoryMock.updateOne.mock.calls[0].arguments[0], "order1");
      assert.deepStrictEqual(ordersRepositoryMock.updateOne.mock.calls[0].arguments[1], mockData);
      assert.deepStrictEqual(result, mockOrder);
    });
  });

  describe("deleteOne", () => {
    test("should delegate to repository", async () => {
      ordersRepositoryMock.deleteOne.mock.mockImplementation(() => true);

      const result = await ordersService.deleteOne("order1");

      assert.strictEqual(ordersRepositoryMock.deleteOne.mock.calls.length, 1);
      assert.strictEqual(ordersRepositoryMock.deleteOne.mock.calls[0].arguments[0], "order1");
      assert.strictEqual(result, true);
    });
  });
});
