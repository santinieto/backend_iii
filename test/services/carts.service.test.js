import { describe, it, beforeEach, afterEach } from "node:test";
import { assert } from "chai";
import sinon from "sinon";
import esmock from "esmock";

describe("Cart Service", () => {
    let cartService;
    let cartRepositoryMock;
    let productServiceMock;

    beforeEach(async () => {
        // Create mocks
        cartRepositoryMock = {
            readAll: sinon.stub(),
            readOne: sinon.stub(),
            createOne: sinon.stub(),
            updateOne: sinon.stub(),
            deleteOne: sinon.stub(),
            addProductToCart: sinon.stub(),
        };

        productServiceMock = {
            readOne: sinon.stub(),
        };

        // Mock the dependencies
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

    afterEach(() => {
        sinon.restore();
    });

    describe("readAll", () => {
        const testCases = [
            {
                description: "should return all carts when repository returns data",
                mockReturn: [
                    { _id: "cart1", products: [] },
                    { _id: "cart2", products: [] },
                ],
                expected: {
                    length: 2,
                    firstId: "cart1",
                },
            },
            {
                description: "should return empty array when no carts exist",
                mockReturn: [],
                expected: {
                    length: 0,
                },
            },
            {
                description: "should handle null return from repository",
                mockReturn: null,
                expected: null,
            },
        ];

        testCases.forEach(({ description, mockReturn, expected }) => {
            it(description, async () => {
                cartRepositoryMock.readAll.resolves(mockReturn);

                const result = await cartService.readAll();

                assert.isTrue(cartRepositoryMock.readAll.calledOnce);

                if (expected === null) {
                    assert.isNull(result);
                } else {
                    assert.isArray(result);
                    assert.lengthOf(result, expected.length);
                    if (expected.firstId) {
                        assert.equal(result[0]._id, expected.firstId);
                    }
                }
            });
        });
    });

    describe("readOne", () => {
        const testCases = [
            {
                description: "should return cart when found",
                cartId: "cart123",
                mockReturn: { _id: "cart123", products: [] },
                expectedId: "cart123",
            },
            {
                description: "should return null when cart not found",
                cartId: "nonexistent",
                mockReturn: null,
                expectedId: null,
            },
            {
                description: "should handle empty string ID",
                cartId: "",
                mockReturn: null,
                expectedId: null,
            },
        ];

        testCases.forEach(({ description, cartId, mockReturn, expectedId }) => {
            it(description, async () => {
                cartRepositoryMock.readOne.resolves(mockReturn);

                const result = await cartService.readOne(cartId);

                assert.isTrue(cartRepositoryMock.readOne.calledOnceWith(cartId));

                if (expectedId === null) {
                    assert.isNull(result);
                } else {
                    assert.isObject(result);
                    assert.equal(result._id, expectedId);
                }
            });
        });
    });

    describe("createOne", () => {
        const testCases = [
            {
                description: "should create cart with empty products array",
                data: { products: [] },
                mockReturn: { _id: "newCart1", products: [] },
                expectedId: "newCart1",
            },
            {
                description: "should create cart with products",
                data: { products: [{ id: "prod1", quantity: 2 }] },
                mockReturn: { _id: "newCart2", products: [{ id: "prod1", quantity: 2 }] },
                expectedId: "newCart2",
            },
        ];

        testCases.forEach(({ description, data, mockReturn, expectedId }) => {
            it(description, async () => {
                cartRepositoryMock.createOne.resolves(mockReturn);

                const result = await cartService.createOne(data);

                assert.isTrue(cartRepositoryMock.createOne.calledOnceWith(data));
                assert.isObject(result);
                assert.equal(result._id, expectedId);
            });
        });
    });

    describe("updateOne", () => {
        const testCases = [
            {
                description: "should update cart successfully",
                cartId: "cart123",
                data: { products: [{ id: "prod1", quantity: 5 }] },
                mockReturn: { _id: "cart123", products: [{ id: "prod1", quantity: 5 }] },
                expectedQuantity: 5,
            },
            {
                description: "should return null when cart not found",
                cartId: "nonexistent",
                data: { products: [] },
                mockReturn: null,
                expectedQuantity: null,
            },
        ];

        testCases.forEach(({ description, cartId, data, mockReturn, expectedQuantity }) => {
            it(description, async () => {
                cartRepositoryMock.updateOne.resolves(mockReturn);

                const result = await cartService.updateOne(cartId, data);

                assert.isTrue(cartRepositoryMock.updateOne.calledOnceWith(cartId, data));

                if (expectedQuantity === null) {
                    assert.isNull(result);
                } else {
                    assert.isObject(result);
                    assert.equal(result.products[0].quantity, expectedQuantity);
                }
            });
        });
    });

    describe("deleteOne", () => {
        const testCases = [
            {
                description: "should delete cart successfully",
                cartId: "cart123",
                mockReturn: { _id: "cart123", deleted: true },
                expectedDeleted: true,
            },
            {
                description: "should return null when cart not found",
                cartId: "nonexistent",
                mockReturn: null,
                expectedDeleted: null,
            },
        ];

        testCases.forEach(({ description, cartId, mockReturn, expectedDeleted }) => {
            it(description, async () => {
                cartRepositoryMock.deleteOne.resolves(mockReturn);

                const result = await cartService.deleteOne(cartId);

                assert.isTrue(cartRepositoryMock.deleteOne.calledOnceWith(cartId));

                if (expectedDeleted === null) {
                    assert.isNull(result);
                } else {
                    assert.isObject(result);
                }
            });
        });
    });

    describe("addProductToCart", () => {
        const testCases = [
            {
                description: "should add product with quantity 1",
                cartId: "cart123",
                productId: "prod1",
                quantity: 1,
                mockReturn: { _id: "cart123", products: [{ id: "prod1", quantity: 1 }] },
                expectedQuantity: 1,
            },
            {
                description: "should add product with quantity 5",
                cartId: "cart123",
                productId: "prod2",
                quantity: 5,
                mockReturn: { _id: "cart123", products: [{ id: "prod2", quantity: 5 }] },
                expectedQuantity: 5,
            },
            {
                description: "should handle adding to non-existent cart",
                cartId: "nonexistent",
                productId: "prod1",
                quantity: 1,
                mockReturn: null,
                expectedQuantity: null,
            },
        ];

        testCases.forEach(({ description, cartId, productId, quantity, mockReturn, expectedQuantity }) => {
            it(description, async () => {
                cartRepositoryMock.addProductToCart.resolves(mockReturn);

                const result = await cartService.addProductToCart(cartId, productId, quantity);

                assert.isTrue(
                    cartRepositoryMock.addProductToCart.calledOnceWith(cartId, productId, quantity)
                );

                if (expectedQuantity === null) {
                    assert.isNull(result);
                } else {
                    assert.isObject(result);
                    assert.equal(result.products[0].quantity, expectedQuantity);
                }
            });
        });
    });

    describe("getDetailedCart", () => {
        const testCases = [
            {
                description: "should return detailed cart with product information",
                cartId: "cart123",
                cartData: {
                    _id: "cart123",
                    products: [{ id: "prod1", quantity: 2 }],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                productData: {
                    _id: "prod1",
                    name: "Product 1",
                    price: 100,
                    discount: 10,
                },
                expectedTotal: 180, // (100 - 10) * 2 = 180
                expectedProductName: "Product 1",
            },
            {
                description: "should handle cart with multiple products",
                cartId: "cart456",
                cartData: {
                    _id: "cart456",
                    products: [
                        { id: "prod1", quantity: 1 },
                        { id: "prod2", quantity: 3 },
                    ],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                productData: [
                    { _id: "prod1", name: "Product 1", price: 50, discount: 0 },
                    { _id: "prod2", name: "Product 2", price: 30, discount: 10 },
                ],
                expectedTotal: 131, // 50*1 + (30-3)*3 = 50 + 81 = 131
                expectedProductName: null,
            },
            {
                description: "should return null when cart not found",
                cartId: "nonexistent",
                cartData: null,
                productData: null,
                expectedTotal: null,
                expectedProductName: null,
            },
            {
                description: "should handle product with no discount",
                cartId: "cart789",
                cartData: {
                    _id: "cart789",
                    products: [{ id: "prod1", quantity: 3 }],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                productData: {
                    _id: "prod1",
                    name: "Product No Discount",
                    price: 200,
                    discount: 0,
                },
                expectedTotal: 600, // 200 * 3 = 600
                expectedProductName: "Product No Discount",
            },
        ];

        testCases.forEach(({ description, cartId, cartData, productData, expectedTotal, expectedProductName }) => {
            it(description, async () => {
                cartRepositoryMock.readOne.resolves(cartData);

                if (cartData && Array.isArray(productData)) {
                    // Multiple products case
                    productData.forEach((prod, index) => {
                        productServiceMock.readOne.onCall(index).resolves(prod);
                    });
                } else if (cartData && productData) {
                    // Single product case
                    productServiceMock.readOne.resolves(productData);
                }

                const result = await cartService.getDetailedCart(cartId);

                assert.isTrue(cartRepositoryMock.readOne.calledOnceWith(cartId));

                if (expectedTotal === null) {
                    assert.isNull(result);
                } else {
                    assert.isObject(result);
                    assert.equal(result.total, expectedTotal);
                    assert.isArray(result.products);

                    if (expectedProductName) {
                        assert.equal(result.products[0].name, expectedProductName);
                    }
                }
            });
        });
    });

    describe("getAllDetailedCarts", () => {
        const testCases = [
            {
                description: "should return empty array when no carts exist",
                allCarts: [],
                expectedLength: 0,
            },
            {
                description: "should return detailed carts for all carts",
                allCarts: [
                    {
                        _id: "cart1",
                        products: [{ id: "prod1", quantity: 1 }],
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        _id: "cart2",
                        products: [{ id: "prod2", quantity: 2 }],
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                ],
                productData: [
                    { _id: "prod1", name: "Product 1", price: 100, discount: 0 },
                    { _id: "prod2", name: "Product 2", price: 50, discount: 10 },
                ],
                expectedLength: 2,
                expectedTotals: [100, 90], // 100*1, (50-5)*2
            },
            {
                description: "should return empty array when repository returns null",
                allCarts: null,
                expectedLength: 0,
            },
        ];

        testCases.forEach(({ description, allCarts, productData, expectedLength, expectedTotals }) => {
            it(description, async () => {
                cartRepositoryMock.readAll.resolves(allCarts);

                if (allCarts && allCarts.length > 0 && productData) {
                    productData.forEach((prod) => {
                        productServiceMock.readOne.withArgs(prod._id).resolves(prod);
                    });
                }

                const result = await cartService.getAllDetailedCarts();

                assert.isArray(result);
                assert.lengthOf(result, expectedLength);

                if (expectedTotals) {
                    expectedTotals.forEach((total, index) => {
                        assert.equal(result[index].total, total);
                    });
                }
            });
        });
    });
});
