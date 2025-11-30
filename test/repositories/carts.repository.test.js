import { test, describe, beforeEach, mock } from "node:test";
import assert from "node:assert";
import esmock from "esmock";

describe("Carts Repository", async () => {
  let cartRepository;
  let cartsManagerMock;
  let CartDTOMock;

  beforeEach(async () => {
    // Create fresh mocks for each test
    cartsManagerMock = {
      createCart: mock.fn(),
      readAll: mock.fn(),
      readById: mock.fn(),
      updateCart: mock.fn(),
      destroyById: mock.fn(),
      addProductToCart: mock.fn(),
    };

    CartDTOMock = class {
      constructor(data) {
        return data;
      }
    };

    const module = await esmock(
      "../../src/repositories/carts.repository.js",
      {
        "../../src/data/dao.factory.js": {
          cartsManager: cartsManagerMock,
        },
        "../../src/dto/carts.dto.js": {
          default: CartDTOMock,
        },
      }
    );
    cartRepository = module.default;
  });

  describe("createOne", () => {
    test("should apply DTO and call manager createCart", async () => {
      const mockData = { products: [] };
      const mockCart = { _id: "cart1", products: [] };
      cartsManagerMock.createCart.mock.mockImplementation(function() {
        return mockCart;
      });

      const result = await cartRepository.createOne(mockData);

      assert.strictEqual(cartsManagerMock.createCart.mock.calls.length, 1);
      assert.deepStrictEqual(result, mockCart);
    });
  });

  describe("readAll", () => {
    test("should call manager readAll", async () => {
      const mockCarts = [{ _id: "cart1" }];
      cartsManagerMock.readAll.mock.mockImplementation(() => mockCarts);

      const result = await cartRepository.readAll();

      assert.strictEqual(cartsManagerMock.readAll.mock.calls.length, 1);
      assert.deepStrictEqual(result, mockCarts);
    });
  });

  describe("readOne", () => {
    test("should call manager readById", async () => {
      const mockCart = { _id: "cart1" };
      cartsManagerMock.readById.mock.mockImplementation(() => mockCart);

      const result = await cartRepository.readOne("cart1");

      assert.strictEqual(cartsManagerMock.readById.mock.calls.length, 1);
      assert.strictEqual(cartsManagerMock.readById.mock.calls[0].arguments[0], "cart1");
      assert.deepStrictEqual(result, mockCart);
    });
  });

  describe("updateOne", () => {
    test("should call manager updateCart", async () => {
      const mockData = { products: [{ id: "prod1", quantity: 2 }] };
      const mockCart = { _id: "cart1", ...mockData };
      cartsManagerMock.updateCart.mock.mockImplementation(function() {
        return mockCart;
      });

      const result = await cartRepository.updateOne("cart1", mockData);

      assert.strictEqual(cartsManagerMock.updateCart.mock.calls.length, 1);
      assert.strictEqual(cartsManagerMock.updateCart.mock.calls[0].arguments[0], "cart1");
      assert.deepStrictEqual(cartsManagerMock.updateCart.mock.calls[0].arguments[1], mockData);
      assert.deepStrictEqual(result, mockCart);
    });
  });

  describe("deleteOne", () => {
    test("should call manager destroyById", async () => {
      cartsManagerMock.destroyById.mock.mockImplementation(() => true);

      const result = await cartRepository.deleteOne("cart1");

      assert.strictEqual(cartsManagerMock.destroyById.mock.calls.length, 1);
      assert.strictEqual(cartsManagerMock.destroyById.mock.calls[0].arguments[0], "cart1");
      assert.strictEqual(result, true);
    });
  });

  describe("addProductToCart", () => {
    test("should call manager addProductToCart", async () => {
      const mockResult = { status: "success" };
      cartsManagerMock.addProductToCart.mock.mockImplementation(() => mockResult);

      const result = await cartRepository.addProductToCart("cart1", "prod1", 2);

      assert.strictEqual(cartsManagerMock.addProductToCart.mock.calls.length, 1);
      assert.strictEqual(cartsManagerMock.addProductToCart.mock.calls[0].arguments[0], "cart1");
      assert.strictEqual(cartsManagerMock.addProductToCart.mock.calls[0].arguments[1], "prod1");
      assert.strictEqual(cartsManagerMock.addProductToCart.mock.calls[0].arguments[2], 2);
      assert.deepStrictEqual(result, mockResult);
    });
  });
});
