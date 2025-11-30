import { test, describe, beforeEach, mock } from "node:test";
import assert from "node:assert";
import esmock from "esmock";

describe("Products Repository", async () => {
  let productRepository;
  let productsManagerMock;
  let ProductDTOMock;

  beforeEach(async () => {
    productsManagerMock = {
      createOne: mock.fn(),
      readAll: mock.fn(),
      readById: mock.fn(),
      updateById: mock.fn(),
      destroyById: mock.fn(),
    };

    ProductDTOMock = class {
      constructor(data) {
        return data;
      }
    };

    const module = await esmock(
      "../../src/repositories/products.repository.js",
      {
        "../../src/data/dao.factory.js": {
          productsManager: productsManagerMock,
        },
        "../../src/dto/products.dto.js": {
          default: ProductDTOMock,
        },
      }
    );
    productRepository = module.default;
  });

  describe("createOne", () => {
    test("should apply DTO and call manager createOne", async () => {
      const mockData = { name: "Product 1", price: 100 };
      const mockProduct = { _id: "prod1", ...mockData };
      productsManagerMock.createOne.mock.mockImplementation(function() {
        return mockProduct;
      });

      const result = await productRepository.createOne(mockData);

      assert.strictEqual(productsManagerMock.createOne.mock.calls.length, 1);
      assert.deepStrictEqual(result, mockProduct);
    });
  });

  describe("readAll", () => {
    test("should call manager readAll", async () => {
      const mockProducts = [{ _id: "prod1" }];
      productsManagerMock.readAll.mock.mockImplementation(() => mockProducts);

      const result = await productRepository.readAll();

      assert.strictEqual(productsManagerMock.readAll.mock.calls.length, 1);
      assert.deepStrictEqual(result, mockProducts);
    });
  });

  describe("readOne", () => {
    test("should call manager readById", async () => {
      const mockProduct = { _id: "prod1" };
      productsManagerMock.readById.mock.mockImplementation(() => mockProduct);

      const result = await productRepository.readOne("prod1");

      assert.strictEqual(productsManagerMock.readById.mock.calls.length, 1);
      assert.strictEqual(productsManagerMock.readById.mock.calls[0].arguments[0], "prod1");
      assert.deepStrictEqual(result, mockProduct);
    });
  });

  describe("updateOne", () => {
    test("should call manager updateById", async () => {
      const mockData = { price: 150 };
      const mockProduct = { _id: "prod1", price: 150 };
      productsManagerMock.updateById.mock.mockImplementation(function() {
        return mockProduct;
      });

      const result = await productRepository.updateOne("prod1", mockData);

      assert.strictEqual(productsManagerMock.updateById.mock.calls.length, 1);
      assert.strictEqual(productsManagerMock.updateById.mock.calls[0].arguments[0], "prod1");
      assert.deepStrictEqual(productsManagerMock.updateById.mock.calls[0].arguments[1], mockData);
      assert.deepStrictEqual(result, mockProduct);
    });
  });

  describe("deleteOne", () => {
    test("should call manager destroyById", async () => {
      productsManagerMock.destroyById.mock.mockImplementation(() => true);

      const result = await productRepository.deleteOne("prod1");

      assert.strictEqual(productsManagerMock.destroyById.mock.calls.length, 1);
      assert.strictEqual(productsManagerMock.destroyById.mock.calls[0].arguments[0], "prod1");
      assert.strictEqual(result, true);
    });
  });
});
