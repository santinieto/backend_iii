import { test, describe, beforeEach, mock } from "node:test";
import assert from "node:assert";
import esmock from "esmock";

describe("Carts Controller", async () => {
  let req, res;
  let cartsController;
  let cartServiceMock;

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
      status: mock.fn(() => res),
      json: mock.fn(),
    };

    cartServiceMock = {
      createOne: mock.fn(),
      readAll: mock.fn(),
      readOne: mock.fn(),
      addProductToCart: mock.fn(),
      updateOne: mock.fn(),
      deleteOne: mock.fn(),
    };

    cartsController = await esmock(
      "../../src/controllers/carts.controller.js",
      {
        "../../src/services/carts.service.js": {
          cartService: cartServiceMock,
        },
      }
    );
  });

  describe("createOne", () => {
    test("should return 400 if products is not an array", async () => {
      req.body.products = "invalid";
      await cartsController.createOne(req, res);
      assert.strictEqual(res.json400.mock.calls.length, 1);
      assert.strictEqual(
        res.json400.mock.calls[0].arguments[0],
        "El campo 'products' debe ser un arreglo válido."
      );
    });

    test("should return 500 if cart creation fails", async () => {
      req.body.products = [];
      cartServiceMock.createOne.mock.mockImplementation(() => null);
      await cartsController.createOne(req, res);
      assert.strictEqual(res.json500.mock.calls.length, 1);
      assert.strictEqual(
        res.json500.mock.calls[0].arguments[0],
        "Error al crear el carrito."
      );
    });

    test("should return 201 if cart is created successfully", async () => {
      req.body.products = [];
      const mockCart = { _id: "cart1", products: [] };
      cartServiceMock.createOne.mock.mockImplementation(() => mockCart);
      await cartsController.createOne(req, res);
      assert.strictEqual(res.json201.mock.calls.length, 1);
      assert.deepStrictEqual(res.json201.mock.calls[0].arguments[0], mockCart);
    });
  });

  describe("readAll", () => {
    test("should return 404 if no carts found", async () => {
      cartServiceMock.readAll.mock.mockImplementation(() => []);
      await cartsController.readAll(req, res);
      assert.strictEqual(res.json404.mock.calls.length, 1);
    });

    test("should return 200 with carts", async () => {
      const mockCarts = [{ _id: "cart1" }];
      cartServiceMock.readAll.mock.mockImplementation(() => mockCarts);
      await cartsController.readAll(req, res);
      assert.strictEqual(res.json200.mock.calls.length, 1);
      assert.deepStrictEqual(res.json200.mock.calls[0].arguments[0], mockCarts);
    });
  });

  describe("readOne", () => {
    test("should return 404 if cart not found", async () => {
      req.params.cid = "invalid";
      cartServiceMock.readOne.mock.mockImplementation(() => null);
      await cartsController.readOne(req, res);
      assert.strictEqual(res.json404.mock.calls.length, 1);
    });

    test("should return 200 with cart", async () => {
      req.params.cid = "cart1";
      const mockCart = { _id: "cart1" };
      cartServiceMock.readOne.mock.mockImplementation(() => mockCart);
      await cartsController.readOne(req, res);
      assert.strictEqual(res.status.mock.calls.length, 1);
      assert.strictEqual(res.status.mock.calls[0].arguments[0], 200);
      assert.strictEqual(res.json.mock.calls.length, 1);
      assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], mockCart);
    });
  });
});
