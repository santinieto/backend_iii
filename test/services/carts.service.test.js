import { test, describe, beforeEach, mock } from "node:test";
import assert from "node:assert";
import esmock from "esmock";

describe("Carts Service", async () => {
  let cartService;
  let cartRepositoryMock;
  let productServiceMock;

  beforeEach(async () => {
    cartRepositoryMock = {
      createOne: mock.fn(),
      readAll: mock.fn(),
      readOne: mock.fn(),
      updateOne: mock.fn(),
      deleteOne: mock.fn(),
      addProductToCart: mock.fn(),
    };

    productServiceMock = {
      readOne: mock.fn(),
    };

    const { cartService: service } = await esmock(
      "../../src/services/carts.service.js",
      {
        "../../src/repositories/carts.repository.js": {
          default: cartRepositoryMock,
        },
        "../../src/services/products.service.js": {
          productService: productServiceMock,
        },
      }
    );
    cartService = service;
  });

  describe("addProductToCart", () => {
    test("should delegate to repository", async () => {
      const mockResult = { status: "success", cart: { _id: "cart1" } };
      cartRepositoryMock.addProductToCart.mock.mockImplementation(() => mockResult);

      const result = await cartService.addProductToCart("cart1", "prod1", 2);

      assert.strictEqual(cartRepositoryMock.addProductToCart.mock.calls.length, 1);
      assert.strictEqual(cartRepositoryMock.addProductToCart.mock.calls[0].arguments[0], "cart1");
      assert.strictEqual(cartRepositoryMock.addProductToCart.mock.calls[0].arguments[1], "prod1");
      assert.strictEqual(cartRepositoryMock.addProductToCart.mock.calls[0].arguments[2], 2);
      assert.deepStrictEqual(result, mockResult);
    });
  });

  describe("getDetailedCart", () => {
    test("should return null if cart not found", async () => {
      cartRepositoryMock.readOne.mock.mockImplementation(() => null);

      const result = await cartService.getDetailedCart("cart1");

      assert.strictEqual(result, null);
    });

    test("should build detailed cart with product information", async () => {
      const mockCart = {
        _id: "cart1",
        products: [
          { id: "prod1", quantity: 2 },
          { id: "prod2", quantity: 1 },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockProduct1 = { _id: "prod1", name: "Product 1", price: 100, discount: 10 };
      const mockProduct2 = { _id: "prod2", name: "Product 2", price: 200, discount: 0 };

      cartRepositoryMock.readOne.mock.mockImplementation(() => mockCart);
      productServiceMock.readOne.mock.mockImplementation((id) => {
        if (id === "prod1") return mockProduct1;
        if (id === "prod2") return mockProduct2;
        return null;
      });

      const result = await cartService.getDetailedCart("cart1");

      assert.strictEqual(result._id, "cart1");
      assert.strictEqual(result.products.length, 2);
      assert.strictEqual(result.products[0].name, "Product 1");
      assert.strictEqual(result.products[0].priceAtPurchase, 90); // 100 - 10%
      assert.strictEqual(result.products[0].subtotal, 180); // 90 * 2
      assert.strictEqual(result.products[1].name, "Product 2");
      assert.strictEqual(result.products[1].priceAtPurchase, 200);
      assert.strictEqual(result.products[1].subtotal, 200); // 200 * 1
      assert.strictEqual(result.total, 380); // 180 + 200
    });
  });

  describe("getAllDetailedCarts", () => {
    test("should return empty array if no carts", async () => {
      cartRepositoryMock.readAll.mock.mockImplementation(() => null);

      const result = await cartService.getAllDetailedCarts();

      assert.deepStrictEqual(result, []);
    });

    test("should build detailed carts for all carts", async () => {
      const mockCarts = [
        {
          _id: "cart1",
          products: [{ id: "prod1", quantity: 1 }],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockProduct = { _id: "prod1", name: "Product 1", price: 100, discount: 0 };

      cartRepositoryMock.readAll.mock.mockImplementation(() => mockCarts);
      productServiceMock.readOne.mock.mockImplementation(() => mockProduct);

      const result = await cartService.getAllDetailedCarts();

      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0]._id, "cart1");
      assert.strictEqual(result[0].total, 100);
    });
  });
});
