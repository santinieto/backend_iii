import { describe, it, beforeEach, afterEach } from "node:test";
import { assert } from "chai";
import sinon from "sinon";
import esmock from "esmock";

describe("Product Service", () => {
    let productService;
    let productRepositoryMock;

    beforeEach(async () => {
        // Create repository mock
        productRepositoryMock = {
            readAll: sinon.stub(),
            readOne: sinon.stub(),
            createOne: sinon.stub(),
            updateOne: sinon.stub(),
            deleteOne: sinon.stub(),
        };

        // Mock the dependencies
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

    afterEach(() => {
        sinon.restore();
    });

    describe("readAll", () => {
        const testCases = [
            {
                description: "should return all products when repository returns data",
                mockReturn: [
                    { _id: "prod1", name: "Product 1", price: 100 },
                    { _id: "prod2", name: "Product 2", price: 200 },
                    { _id: "prod3", name: "Product 3", price: 300 },
                ],
                expected: {
                    length: 3,
                    firstId: "prod1",
                    firstPrice: 100,
                },
            },
            {
                description: "should return empty array when no products exist",
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
            {
                description: "should return single product",
                mockReturn: [{ _id: "prod1", name: "Only Product", price: 50 }],
                expected: {
                    length: 1,
                    firstId: "prod1",
                    firstPrice: 50,
                },
            },
        ];

        testCases.forEach(({ description, mockReturn, expected }) => {
            it(description, async () => {
                productRepositoryMock.readAll.resolves(mockReturn);

                const result = await productService.readAll();

                assert.isTrue(productRepositoryMock.readAll.calledOnce);

                if (expected === null) {
                    assert.isNull(result);
                } else {
                    assert.isArray(result);
                    assert.lengthOf(result, expected.length);
                    if (expected.firstId) {
                        assert.equal(result[0]._id, expected.firstId);
                        assert.equal(result[0].price, expected.firstPrice);
                    }
                }
            });
        });
    });

    describe("readOne", () => {
        const testCases = [
            {
                description: "should return product when found",
                productId: "prod123",
                mockReturn: { _id: "prod123", name: "Test Product", price: 150 },
                expectedId: "prod123",
                expectedName: "Test Product",
            },
            {
                description: "should return null when product not found",
                productId: "nonexistent",
                mockReturn: null,
                expectedId: null,
                expectedName: null,
            },
            {
                description: "should handle empty string ID",
                productId: "",
                mockReturn: null,
                expectedId: null,
                expectedName: null,
            },
            {
                description: "should return product with discount",
                productId: "prod456",
                mockReturn: { _id: "prod456", name: "Discounted Product", price: 200, discount: 20 },
                expectedId: "prod456",
                expectedName: "Discounted Product",
            },
        ];

        testCases.forEach(({ description, productId, mockReturn, expectedId, expectedName }) => {
            it(description, async () => {
                productRepositoryMock.readOne.resolves(mockReturn);

                const result = await productService.readOne(productId);

                assert.isTrue(productRepositoryMock.readOne.calledOnceWith(productId));

                if (expectedId === null) {
                    assert.isNull(result);
                } else {
                    assert.isObject(result);
                    assert.equal(result._id, expectedId);
                    assert.equal(result.name, expectedName);
                }
            });
        });
    });

    describe("createOne", () => {
        const testCases = [
            {
                description: "should create product with basic data",
                data: { name: "New Product", price: 100 },
                mockReturn: { _id: "newProd1", name: "New Product", price: 100 },
                expectedId: "newProd1",
                expectedPrice: 100,
            },
            {
                description: "should create product with discount",
                data: { name: "Discounted Product", price: 200, discount: 15 },
                mockReturn: { _id: "newProd2", name: "Discounted Product", price: 200, discount: 15 },
                expectedId: "newProd2",
                expectedPrice: 200,
            },
            {
                description: "should create product with all fields",
                data: {
                    name: "Complete Product",
                    price: 300,
                    discount: 10,
                    stock: 50,
                    category: "Electronics",
                },
                mockReturn: {
                    _id: "newProd3",
                    name: "Complete Product",
                    price: 300,
                    discount: 10,
                    stock: 50,
                    category: "Electronics",
                },
                expectedId: "newProd3",
                expectedPrice: 300,
            },
        ];

        testCases.forEach(({ description, data, mockReturn, expectedId, expectedPrice }) => {
            it(description, async () => {
                productRepositoryMock.createOne.resolves(mockReturn);

                const result = await productService.createOne(data);

                assert.isTrue(productRepositoryMock.createOne.calledOnceWith(data));
                assert.isObject(result);
                assert.equal(result._id, expectedId);
                assert.equal(result.price, expectedPrice);
            });
        });
    });

    describe("updateOne", () => {
        const testCases = [
            {
                description: "should update product price",
                productId: "prod123",
                data: { price: 250 },
                mockReturn: { _id: "prod123", name: "Product", price: 250 },
                expectedPrice: 250,
            },
            {
                description: "should update product name and price",
                productId: "prod456",
                data: { name: "Updated Product", price: 350 },
                mockReturn: { _id: "prod456", name: "Updated Product", price: 350 },
                expectedPrice: 350,
            },
            {
                description: "should return null when product not found",
                productId: "nonexistent",
                data: { price: 100 },
                mockReturn: null,
                expectedPrice: null,
            },
            {
                description: "should update discount",
                productId: "prod789",
                data: { discount: 25 },
                mockReturn: { _id: "prod789", name: "Product", price: 100, discount: 25 },
                expectedPrice: 100,
            },
        ];

        testCases.forEach(({ description, productId, data, mockReturn, expectedPrice }) => {
            it(description, async () => {
                productRepositoryMock.updateOne.resolves(mockReturn);

                const result = await productService.updateOne(productId, data);

                assert.isTrue(productRepositoryMock.updateOne.calledOnceWith(productId, data));

                if (expectedPrice === null) {
                    assert.isNull(result);
                } else {
                    assert.isObject(result);
                    assert.equal(result.price, expectedPrice);
                }
            });
        });
    });

    describe("deleteOne", () => {
        const testCases = [
            {
                description: "should delete product successfully",
                productId: "prod123",
                mockReturn: { _id: "prod123", deleted: true },
                expectedDeleted: true,
            },
            {
                description: "should return null when product not found",
                productId: "nonexistent",
                mockReturn: null,
                expectedDeleted: null,
            },
            {
                description: "should delete product with empty string ID",
                productId: "",
                mockReturn: null,
                expectedDeleted: null,
            },
            {
                description: "should delete product and return confirmation",
                productId: "prod999",
                mockReturn: { _id: "prod999", name: "Deleted Product", deleted: true },
                expectedDeleted: true,
            },
        ];

        testCases.forEach(({ description, productId, mockReturn, expectedDeleted }) => {
            it(description, async () => {
                productRepositoryMock.deleteOne.resolves(mockReturn);

                const result = await productService.deleteOne(productId);

                assert.isTrue(productRepositoryMock.deleteOne.calledOnceWith(productId));

                if (expectedDeleted === null) {
                    assert.isNull(result);
                } else {
                    assert.isObject(result);
                }
            });
        });
    });
});
