import { gql } from "apollo-server-express";
import sheetCallRedis from "../RedisActions/sheetCallRedis.js";
import bothProtect from "../Controllers/protectController.js";
import jwt from "jsonwebtoken";
import userModel from "../MongoDB/userModel.js";

export const userManagementTypeDefs = gql`
  type Query {
    userManagement: UserManagementData
  }
  type UserManagementData {
    error: Error
    data: [Data]
  }
  type Error {
    status: Int
    message: String
  }
  type Data {
    name: String
    email: String
    phone: String
    role: Role
    organization: String
  }
  type Role {
    role: String
  }
`;

export const userManagementResolvers = {
  Query: {
    userManagement: async (_, {}, { req }) => {
      // Authorize and Authentication Verification
      const protect = bothProtect(req, "userManagement");

      if (protect?.status !== 200) {
        return protect;
      }
      //   const token = req.cookies.jwt;
      //   const payload = jwt.verify(token, process.env.JWT_SECRET1_KEY);

      let users = await userModel
        .find({}, { password: 0, __v: 0, _id: 0 })
        .populate("role");

      if (users) {
        users = users.filter((user) => user.role.role !== "admin");
        return { error: null, data: users };
      }
      return {
        error: { status: 400, message: "something went wrong" },
        data: null,
      };
    },
  },
};
