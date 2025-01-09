import { describe, it, expect, jest } from "@jest/globals";
import { userControllers } from "../../src/controllers/user.controllers";
import { NextFunction, Request, Response } from "express";
import AuthError from "../../src/error/AuthError";

describe("User COntroller", () => {
  it("returns a user with status 200", async () => {
    const req = {
      user: {
        username: "JohnDoe",
        email: "john@example.com",
        id: "123",
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    await userControllers.getUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      user: {
        username: "JohnDoe",
        email: "john@example.com",
        id: "123",
      },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("throws an AuthError when req.user is undefined", async () => {
    // Mock req, res, and next
    const req = {} as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    // Call the controller
    await userControllers.getUser(req, res, next);

    // The asyncHandler catches the thrown AuthError and calls next(error)
    expect(next).toHaveBeenCalledWith(expect.any(AuthError));
    // Confirm that res.status and res.json are NOT called in the error scenario
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
