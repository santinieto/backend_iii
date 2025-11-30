import { test, describe, beforeEach, mock } from "node:test";
import assert from "node:assert";
import esmock from "esmock";

describe("Products Controller", async () => {
  let req, res;
  let productsController;
  let productServiceMock;

  beforeEach(async () => {
    req = {
      body: {},
      params: {},
    };
    res = {
      json200: mock.fn(),
      json201: mock.fn(),
      json400: mock.fn(),
      json404: mock.fn(),
      json500: mock.fn(),
    };

    productServiceMock = {
      createOne: mock.fn(),
      readAll: mock.fn(),
      readOne: mock.fn(),
      updateOne: mock.fn(),
      deleteOne: mock.fn(),
    };

    productsController = await esmock(
      "../../src/controllers/products.controller.js",
      {
        "../../src/services/products.service.js": {
          productService: productServiceMock,
        },
      }
    );
  });

  describe("readAll", () => {
    test("should return 404 if no products found", async () => {
      productServiceMock.readAll.mock.mockImplementation(() => []);
      await productsController.readAll(req, res);
      assert.strictEqual(res.json404.mock.calls.length, 1);
    });

    test("should return 200 with products", async () => {
      const mockProducts = [{ _id: "prod1" }];
      productServiceMock.readAll.mock.mockImplementation(() => mockProducts);
      await productsController.readAll(req, res);
      assert.strictEqual(res.json200.mock.calls.length, 1);
      assert.deepStrictEqual(res.json200.mock.calls[0].arguments[0], mockProducts);
    });
  });

  describe("readOne", () => {
    test("should return 404 if product not found", async () => {
      req.params.pid = "invalid";
      productServiceMock.readOne.mock.mockImplementation(() => null);
      await productsController.readOne(req, res);
      assert.strictEqual(res.json404.mock.calls.length, 1);
    });

    test("should return 200 with product", async () => {
      req.params.pid = "prod1";
      const mockProduct = { _id: "prod1" };
      productServiceMock.readOne.mock.mockImplementation(() => mockProduct);
      await productsController.readOne(req, res);
      assert.strictEqual(res.json200.mock.calls.length, 1);
      assert.deepStrictEqual(res.json200.mock.calls[0].arguments[0], mockProduct);
    });
  });

  describe("createOne", () => {
    test("should return 400 if required fields are missing", async () => {
      req.body = { name: "Test" };
      await productsController.createOne(req, res);
      assert.strictEqual(res.json400.mock.calls.length, 1);
    });

    test("should return 500 if creation fails", async () => {
      req.body = {
        name: "Test",
        price: 100,
        discount: 0,
        category: "Test",
        description: "Test",
        stock: 10,
        code: "TEST1",
        status: true,
      };
      productServiceMock.createOne.mock.mockImplementation(() => null);
      await productsController.createOne(req, res);
      assert.strictEqual(res.json500.mock.calls.length, 1);
      assert.strictEqual(
        res.json500.mock.calls[0].arguments[0],
        "Error al crear el producto"
      );
    });

    test("should return 201 if created successfully", async () => {
      req.body = {
        name: "Test",
        price: 100,
        discount: 0,
        category: "Test",
        description: "Test",
        stock: 10,
        code: "TEST1",
        status: true,
      };
      const mockProduct = { ...req.body, _id: "prod1" };
      productServiceMock.createOne.mock.mockImplementation(() => mockProduct);
      await productsController.createOne(req, res);
      assert.strictEqual(res.json201.mock.calls.length, 1);
      assert.deepStrictEqual(res.json201.mock.calls[0].arguments[0], mockProduct);
    });
  });
});
