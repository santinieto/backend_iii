import { describe, it, beforeEach, afterEach } from "node:test";
import { assert } from "chai";
import sinon from "sinon";
import esmock from "esmock";

describe("Orders Service", () => {
    let ordersService;
    let ordersRepositoryMock;

    beforeEach(async () => {
        // Create repository mock
        ordersRepositoryMock = {
            readAll: sinon.stub(),
            readOne: sinon.stub(),
            createOne: sinon.stub(),
            updateOne: sinon.stub(),
            deleteOne: sinon.stub(),
        };

        // Mock the dependencies
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

    afterEach(() => {
        sinon.restore();
    });

    describe("readAll", () => {
        const testCases = [
            {
                description: "should return all orders when repository returns data",
                mockReturn: [
                    { _id: "order1", total: 100 },
                    { _id: "order2", total: 200 },
                ],
                expected: {
                    length: 2,
                    firstId: "order1",
                },
            },
            {
                description: "should return empty array when no orders exist",
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
                ordersRepositoryMock.readAll.resolves(mockReturn);

                const result = await ordersService.readAll();

                assert.isTrue(ordersRepositoryMock.readAll.calledOnce);

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
                description: "should return order when found",
                orderId: "order123",
                mockReturn: { _id: "order123", total: 150 },
                expectedId: "order123",
            },
            {
                description: "should return null when order not found",
                orderId: "nonexistent",
                mockReturn: null,
                expectedId: null,
            },
        ];

        testCases.forEach(({ description, orderId, mockReturn, expectedId }) => {
            it(description, async () => {
                ordersRepositoryMock.readOne.resolves(mockReturn);

                const result = await ordersService.readOne(orderId);

                assert.isTrue(ordersRepositoryMock.readOne.calledOnceWith(orderId));

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
                description: "should create order with basic data",
                data: { userId: "user1", products: [] },
                mockReturn: { _id: "newOrder1", userId: "user1", products: [] },
                expectedId: "newOrder1",
                expectedUserId: "user1",
            },
        ];

        testCases.forEach(({ description, data, mockReturn, expectedId, expectedUserId }) => {
            it(description, async () => {
                ordersRepositoryMock.createOne.resolves(mockReturn);

                const result = await ordersService.createOne(data);

                assert.isTrue(ordersRepositoryMock.createOne.calledOnceWith(data));
                assert.isObject(result);
                assert.equal(result._id, expectedId);
                assert.equal(result.userId, expectedUserId);
            });
        });
    });

    describe("updateOne", () => {
        const testCases = [
            {
                description: "should update order status",
                orderId: "order123",
                data: { status: "completed" },
                mockReturn: { _id: "order123", status: "completed" },
                expectedStatus: "completed",
            },
            {
                description: "should return null when order not found",
                orderId: "nonexistent",
                data: { status: "shipped" },
                mockReturn: null,
                expectedStatus: null,
            },
        ];

        testCases.forEach(({ description, orderId, data, mockReturn, expectedStatus }) => {
            it(description, async () => {
                ordersRepositoryMock.updateOne.resolves(mockReturn);

                const result = await ordersService.updateOne(orderId, data);

                assert.isTrue(ordersRepositoryMock.updateOne.calledOnceWith(orderId, data));

                if (expectedStatus === null) {
                    assert.isNull(result);
                } else {
                    assert.isObject(result);
                    assert.equal(result.status, expectedStatus);
                }
            });
        });
    });

    describe("deleteOne", () => {
        const testCases = [
            {
                description: "should delete order successfully",
                orderId: "order123",
                mockReturn: { _id: "order123", deleted: true },
                expectedDeleted: true,
            },
            {
                description: "should return null when order not found",
                orderId: "nonexistent",
                mockReturn: null,
                expectedDeleted: null,
            },
        ];

        testCases.forEach(({ description, orderId, mockReturn, expectedDeleted }) => {
            it(description, async () => {
                ordersRepositoryMock.deleteOne.resolves(mockReturn);

                const result = await ordersService.deleteOne(orderId);

                assert.isTrue(ordersRepositoryMock.deleteOne.calledOnceWith(orderId));

                if (expectedDeleted === null) {
                    assert.isNull(result);
                } else {
                    assert.isObject(result);
                }
            });
        });
    });
});
