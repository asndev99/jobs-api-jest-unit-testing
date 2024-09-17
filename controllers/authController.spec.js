import { registerUser } from "./authController";

const mockRequest = () => {
  return {
    body: {
      name: "asn dev",
      email: "backenddev99@gmail.com",
      password: "12345678",
    },
  };
};

const mockResponse = () => {
  return {
    status: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
  };
};

describe("Register User", () => {
  it("should register user", async () => {
    console.log("hello world");
  });
});
