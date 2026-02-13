import { gql } from "apollo-server-express";
import loginController from "../Controllers/loginController.js";

export const loginTypeDefs = gql`
  type Query {
    login(input: LoginInput!): UserLogin
  }
  input LoginInput {
    email: String
    password: String
  }
  type UserLogin {
    status: Int
    error: Error
    data: Data
  }
  type Error {
    status: Int
    message: String
  }
  type Data {
    name: String
    email: String
    role: Role
    organization: String
  }
  type Role {
    role: String
    permissions: [String]
  }
`;

export const loginResolvers = {
  Query: {
    login: async (_, { input }, { res }) => {
      const login = await loginController(input, res);

      if (login.status === 200) {
        return {
          status: 200,
          data: login.data,
          error: null,
        };
      } else {
        return {
          status: login.status || 400,
          data: null,
          error: login.error || "Bad request",
        };
      }
    },
  },
};
