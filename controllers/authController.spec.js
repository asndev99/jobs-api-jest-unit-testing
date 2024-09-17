import { registerUser } from "./authController";
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
});
