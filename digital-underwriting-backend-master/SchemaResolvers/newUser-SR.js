import { gql } from "apollo-server-express";
import newUserController from "../Controllers/newUserController.js";

export const newUserTypeDefs = gql`
  type Query {
    newUser(input: NewUserInput!): UserCreated
  }
  input NewUserInput {
    name: String
    email: String
    password: String
    phone: String
    role: String
    organization: String
  }
  type UserCreated {
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
    password: String
  }
`;

export const newUserResolvers = {
  Query: {
    newUser: async (_, { input }) => {
      const newUser = await newUserController(input);

      if (newUser.status === 200) {
        return {
          status: 200,
          error: null,
          data: {
            name: input.name,
            email: input.email,
            password: input.password,
          },
        };
      } else {
        return {
          status: newUser.status,
          data: null,
          error: newUser.error,
        };
      }
    },
  },
};
