import { loginUser, registerUser } from "./authController";
import bcrypt from "bcryptjs";
import User from "../models/users";
import { getJwtToken } from "../utils/helpers";

jest.mock("../utils/helpers", () => ({
  getJwtToken: jest.fn(() => "jwt_token"),
}));

// Mock request and response objects
const mockRequest = () => ({
  body: {
    name: "asn dev",
    email: "backenddev99@gmail.com",
    password: "12345678",
  },
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
};

const userLogin = {
  email: "asn@yopmail.com",
  password: "12345678",
};

const mockUser = {
  _id: "5a9427648b0beebeb69579f5",
  name: "asn dev",
  email: "backenddev99@gmail.com",
  password: "12345678",
};

afterEach(() => {
  jest.restoreAllMocks();
});
describe("Register User", () => {
  it("should register user", async () => {
    jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPassword");
    jest.spyOn(User, "create").mockResolvedValue(mockUser);

    const mockReq = mockRequest();
    const mockRes = mockResponse();

    await registerUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(bcrypt.hash).toHaveBeenCalledWith("12345678", 10);
    expect(User.create).toHaveBeenCalledWith({
      name: "asn dev",
      email: "backenddev99@gmail.com",
      password: "hashedPassword",
    });
    expect(mockRes.json).toHaveBeenCalledWith({
      token: "jwt_token",
    });
  });

  it("should throw validation errror", async () => {
    const mockReq = (mockRequest().body = { body: {} });
    const mockRes = mockResponse();

    await registerUser(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Please enter all values",
    });
  });

  it("should throw error of duplication while creating user", async () => {
    jest.spyOn(bcrypt, "hash").mockResolvedValueOnce("hashedPassword");
    jest.spyOn(User, "create").mockRejectedValueOnce({ code: 11000 });

    const mockReq = mockRequest();
    const mockRes = mockResponse();

    await registerUser(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Duplicate email",
    });
  });
});

describe("Login User", () => {
  it("Should Throw missing email or password", async () => {
    const mockReq = (mockRequest().body = { body: {} });
    const mockRes = mockResponse();

    await loginUser(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Please enter email & Password",
    });
  });

  it("Should throw Invalid Email or Password", async () => {
    jest.spyOn(User, "findOne").mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValueOnce(null),
    }));

    const mockReq = (mockRequest().body = { body: userLogin });
    const mockRes = mockResponse();

    await loginUser(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Invalid Email or Password",
    });
  });
});
