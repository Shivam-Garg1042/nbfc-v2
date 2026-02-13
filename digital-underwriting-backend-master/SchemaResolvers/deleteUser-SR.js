import { gql } from "apollo-server-express";
import bothProtect from "../Controllers/protectController.js";
import userModel from "../MongoDB/userModel.js";

export const deleteUserTypeDefs = gql`
  type Query {
    deleteUser(input: DeleteUserInput!): DeleteUserData
  }
  input DeleteUserInput {
    email: String
  }
  type DeleteUserData {
    status: Int
    error: Error
  }
  type Error {
    status: Int
    message: String
  }
`;

export const deleteUserResolvers = {
  Query: {
    deleteUser: async (_, { input }, { req }) => {
      // Authorize and Authentication Verification
      const protect = bothProtect(req, "userManagement");

      if (protect?.status !== 200) {
        return protect;
      }

      let delUser = await userModel.deleteOne({ email: input.email });

      if (delUser.acknowledged && delUser.deletedCount === 1)
        return { error: null, status: 200 };
      if (delUser.acknowledged && delUser.deletedCount === 0)
        return {
          error: {
            status: 400,
            message: "user does not exist or already deleted.",
          },
          status: 400,
        };
      return {
        error: { status: 400, message: "something went wrong" },
        status: 400,
      };
    },
  },
};
