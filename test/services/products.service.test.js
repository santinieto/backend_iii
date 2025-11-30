import { test, describe, beforeEach, mock } from "node:test";
import assert from "node:assert";
import esmock from "esmock";

describe("Products Service", async () => {
  let productService;
  let productRepositoryMock;

  beforeEach(async () => {
    productRepositoryMock = {
      createOne: mock.fn(),
      readAll: mock.fn(),
      readOne: mock.fn(),
      updateOne: mock.fn(),
      deleteOne: mock.fn(),
    };

    const { productService: service } = await esmock(
      "../../src/services/products.service.js",
      {
        "../../src/repositories/products.repository.js": {
          default: productRepositoryMock,
        },
      }
    );
    productService = service;
  });

  describe("readAll", () => {
    test("should delegate to repository", async () => {
      const mockProducts = [{ _id: "prod1" }, { _id: "prod2" }];
      productRepositoryMock.readAll.mock.mockImplementation(() => mockProducts);

      const result = await productService.readAll();

      assert.strictEqual(productRepositoryMock.readAll.mock.calls.length, 1);
      assert.deepStrictEqual(result, mockProducts);
    });
  });

  describe("readOne", () => {
    test("should delegate to repository", async () => {
      const mockProduct = { _id: "prod1", name: "Product 1" };
      productRepositoryMock.readOne.mock.mockImplementation(() => mockProduct);

      const result = await productService.readOne("prod1");

      assert.strictEqual(productRepositoryMock.readOne.mock.calls.length, 1);
      assert.strictEqual(productRepositoryMock.readOne.mock.calls[0].arguments[0], "prod1");
      assert.deepStrictEqual(result, mockProduct);
    });
  });

  describe("createOne", () => {
    test("should delegate to repository", async () => {
      const mockData = { name: "New Product", price: 100 };
      const mockProduct = { ...mockData, _id: "prod1" };
      productRepositoryMock.createOne.mock.mockImplementation(() => mockProduct);

      const result = await productService.createOne(mockData);

      assert.strictEqual(productRepositoryMock.createOne.mock.calls.length, 1);
      assert.deepStrictEqual(productRepositoryMock.createOne.mock.calls[0].arguments[0], mockData);
      assert.deepStrictEqual(result, mockProduct);
    });
  });

  describe("updateOne", () => {
    test("should delegate to repository", async () => {
      const mockData = { price: 150 };
      const mockProduct = { _id: "prod1", name: "Product 1", price: 150 };
      productRepositoryMock.updateOne.mock.mockImplementation(() => mockProduct);

      const result = await productService.updateOne("prod1", mockData);

      assert.strictEqual(productRepositoryMock.updateOne.mock.calls.length, 1);
      assert.strictEqual(productRepositoryMock.updateOne.mock.calls[0].arguments[0], "prod1");
      assert.deepStrictEqual(productRepositoryMock.updateOne.mock.calls[0].arguments[1], mockData);
      assert.deepStrictEqual(result, mockProduct);
    });
  });

  describe("deleteOne", () => {
    test("should delegate to repository", async () => {
      productRepositoryMock.deleteOne.mock.mockImplementation(() => true);

      const result = await productService.deleteOne("prod1");

      assert.strictEqual(productRepositoryMock.deleteOne.mock.calls.length, 1);
      assert.strictEqual(productRepositoryMock.deleteOne.mock.calls[0].arguments[0], "prod1");
      assert.strictEqual(result, true);
    });
  });
});
