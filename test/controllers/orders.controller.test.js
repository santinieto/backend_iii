import { test, describe, beforeEach, mock } from "node:test";
import assert from "node:assert";
import esmock from "esmock";

describe("Orders Controller", async () => {
  let req, res;
  let ordersController;
  let ordersServiceMock;
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
    };

    ordersServiceMock = {
      createOne: mock.fn(),
      readAll: mock.fn(),
      readOne: mock.fn(),
      updateOne: mock.fn(),
      deleteOne: mock.fn(),
    };

    cartServiceMock = {
      getDetailedCart: mock.fn(),
    };

    ordersController = await esmock(
      "../../src/controllers/orders.controller.js",
      {
        "../../src/services/orders.service.js": {
          ordersService: ordersServiceMock,
        },
        "../../src/services/carts.service.js": {
          cartService: cartServiceMock,
        },
      }
    );
  });

  describe("readAll", () => {
    test("should return 404 if no orders found", async () => {
      ordersServiceMock.readAll.mock.mockImplementation(() => []);
      await ordersController.readAll(req, res);
      assert.strictEqual(res.json404.mock.calls.length, 1);
    });

    test("should return 200 with orders", async () => {
      const mockOrders = [{ _id: "order1" }];
      ordersServiceMock.readAll.mock.mockImplementation(() => mockOrders);
      await ordersController.readAll(req, res);
      assert.strictEqual(res.json200.mock.calls.length, 1);
      assert.deepStrictEqual(res.json200.mock.calls[0].arguments[0], mockOrders);
    });
  });

  describe("createOne", () => {
    test("should return 400 if required fields are missing", async () => {
      req.body = { cart_id: "cart1" };
      await ordersController.createOne(req, res);
      assert.strictEqual(res.json400.mock.calls.length, 1);
    });

    test("should return 500 if creation fails", async () => {
      req.body = {
        cart_id: "cart1",
        products: [],
        total: 100,
        paymentMethod: "credit_card",
        shippingAddress: "123 Main St",
      };
      ordersServiceMock.createOne.mock.mockImplementation(() => null);
      await ordersController.createOne(req, res);
      assert.strictEqual(res.json500.mock.calls.length, 1);
      assert.strictEqual(
        res.json500.mock.calls[0].arguments[0],
        "Error al crear la orden"
      );
    });

    test("should return 201 if created successfully", async () => {
      req.body = {
        cart_id: "cart1",
        products: [],
        total: 100,
        paymentMethod: "credit_card",
        shippingAddress: "123 Main St",
      };
      const mockOrder = { ...req.body, _id: "order1" };
      ordersServiceMock.createOne.mock.mockImplementation(() => mockOrder);
      await ordersController.createOne(req, res);
      assert.strictEqual(res.json201.mock.calls.length, 1);
      assert.deepStrictEqual(res.json201.mock.calls[0].arguments[0], mockOrder);
    });
  });

  describe("createOneFromCart", () => {
    test("should return 404 if cart not found", async () => {
      req.params.cid = "cart1";
      cartServiceMock.getDetailedCart.mock.mockImplementation(() => null);
      await ordersController.createOneFromCart(req, res);
      assert.strictEqual(res.json404.mock.calls.length, 1);
      assert.strictEqual(
        res.json404.mock.calls[0].arguments[0],
        "Carrito no encontrado"
      );
    });

    test("should create order from cart successfully", async () => {
      req.params.cid = "cart1";
      const mockCart = {
        _id: "cart1",
        products: [{ id: "prod1", quantity: 2 }],
        total: 200,
      };
      const mockOrder = { _id: "order1", cart_id: "cart1" };
      cartServiceMock.getDetailedCart.mock.mockImplementation(() => mockCart);
      ordersServiceMock.createOne.mock.mockImplementation(() => mockOrder);
      await ordersController.createOneFromCart(req, res);
      assert.strictEqual(res.json201.mock.calls.length, 1);
      assert.deepStrictEqual(res.json201.mock.calls[0].arguments[0], mockOrder);
    });
  });

  describe("readOne", () => {
    test("should return 404 if order not found", async () => {
      req.params.oid = "invalid";
      ordersServiceMock.readOne.mock.mockImplementation(() => null);
      await ordersController.readOne(req, res);
      assert.strictEqual(res.json404.mock.calls.length, 1);
    });

    test("should return 200 with order", async () => {
      req.params.oid = "order1";
      const mockOrder = { _id: "order1" };
      ordersServiceMock.readOne.mock.mockImplementation(() => mockOrder);
      await ordersController.readOne(req, res);
      assert.strictEqual(res.json200.mock.calls.length, 1);
      assert.deepStrictEqual(res.json200.mock.calls[0].arguments[0], mockOrder);
    });
  });

  describe("updateOne", () => {
    test("should return 400 if update fails", async () => {
      req.params.oid = "order1";
      req.body = { status: "shipped" };
      ordersServiceMock.updateOne.mock.mockImplementation(() => null);
      await ordersController.updateOne(req, res);
      assert.strictEqual(res.json400.mock.calls.length, 1);
    });

    test("should return 200 if updated successfully", async () => {
      req.params.oid = "order1";
      req.body = { status: "shipped" };
      const mockOrder = { _id: "order1", status: "shipped" };
      ordersServiceMock.updateOne.mock.mockImplementation(() => mockOrder);
      await ordersController.updateOne(req, res);
      assert.strictEqual(res.json200.mock.calls.length, 1);
      assert.deepStrictEqual(res.json200.mock.calls[0].arguments[0], mockOrder);
    });
  });

  describe("deleteOne", () => {
    test("should return 404 if order not found", async () => {
      req.params.oid = "invalid";
      ordersServiceMock.deleteOne.mock.mockImplementation(() => null);
      await ordersController.deleteOne(req, res);
      assert.strictEqual(res.json404.mock.calls.length, 1);
    });

    test("should return 200 if deleted successfully", async () => {
      req.params.oid = "order1";
      ordersServiceMock.deleteOne.mock.mockImplementation(() => true);
      await ordersController.deleteOne(req, res);
      assert.strictEqual(res.json200.mock.calls.length, 1);
    });
  });
});
