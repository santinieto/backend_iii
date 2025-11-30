import { test, describe, beforeEach, mock } from "node:test";
import assert from "node:assert";
import esmock from "esmock";

describe("Auth Controller", async () => {
  let req, res;
  let authController;
  let usersManagerMock;

  beforeEach(async () => {
    req = {
      body: {},
      params: {},
      user: null,
      token: null,
      method: "POST",
      originalUrl: "/api/auth/test",
    };
    res = {
      status: mock.fn(() => res),
      json: mock.fn(),
      cookie: mock.fn(() => res),
      clearCookie: mock.fn(() => res),
      json401: mock.fn(),
    };

    usersManagerMock = {
      readBy: mock.fn(),
      updateById: mock.fn(),
    };

    authController = await esmock(
      "../../src/controllers/auth.controller.js",
      {
        "../../src/data/dao.factory.js": {
          usersManager: usersManagerMock,
        },
      }
    );
  });

  describe("register", () => {
    test("should return 201 with user ID", async () => {
      req.user = { _id: "user123" };
      await authController.register(req, res);
      assert.strictEqual(res.status.mock.calls.length, 1);
      assert.strictEqual(res.status.mock.calls[0].arguments[0], 201);
      assert.strictEqual(res.json.mock.calls.length, 1);
      assert.strictEqual(res.json.mock.calls[0].arguments[0].response, "user123");
      assert.strictEqual(res.json.mock.calls[0].arguments[0].status, "success");
    });
  });

  describe("verifyAccount", () => {
    test("should return 401 if user not found", async () => {
      req.body = { email: "test@test.com", verificationCode: "123" };
      usersManagerMock.readBy.mock.mockImplementation(() => null);
      await authController.verifyAccount(req, res);
      assert.strictEqual(res.json401.mock.calls.length, 1);
      assert.strictEqual(
        res.json401.mock.calls[0].arguments[0],
        "Error al verificar cuenta"
      );
    });

    test("should verify user and return 200", async () => {
      req.body = { email: "test@test.com", verificationCode: "123" };
      const mockUser = { _id: "user123", email: "test@test.com" };
      usersManagerMock.readBy.mock.mockImplementation(() => mockUser);
      usersManagerMock.updateById.mock.mockImplementation(() => {});
      await authController.verifyAccount(req, res);
      assert.strictEqual(res.status.mock.calls.length, 1);
      assert.strictEqual(res.status.mock.calls[0].arguments[0], 200);
      assert.strictEqual(res.json.mock.calls.length, 1);
    });
  });

  describe("login", () => {
    test("should set cookie and return token", async () => {
      req.token = "jwt-token-123";
      await authController.login(req, res);
      assert.strictEqual(res.cookie.mock.calls.length, 1);
      assert.strictEqual(res.cookie.mock.calls[0].arguments[0], "token");
      assert.strictEqual(res.cookie.mock.calls[0].arguments[1], "jwt-token-123");
      assert.strictEqual(res.status.mock.calls.length, 1);
      assert.strictEqual(res.status.mock.calls[0].arguments[0], 200);
    });
  });

  describe("logout", () => {
    test("should clear cookie and return success", async () => {
      await authController.logout(req, res);
      assert.strictEqual(res.clearCookie.mock.calls.length, 1);
      assert.strictEqual(res.clearCookie.mock.calls[0].arguments[0], "token");
      assert.strictEqual(res.status.mock.calls.length, 1);
      assert.strictEqual(res.status.mock.calls[0].arguments[0], 200);
    });
  });

  describe("profile", () => {
    test("should return user profile", async () => {
      req.user = { _id: "user123", name: "Test User" };
      await authController.profile(req, res);
      assert.strictEqual(res.status.mock.calls.length, 1);
      assert.strictEqual(res.status.mock.calls[0].arguments[0], 200);
      assert.strictEqual(res.json.mock.calls.length, 1);
      assert.deepStrictEqual(res.json.mock.calls[0].arguments[0].response, req.user);
    });
  });
});
