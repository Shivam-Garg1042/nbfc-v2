import { gql } from "apollo-server-express";
import bothProtect from "../Controllers/protectController.js";
import sheetCallRedis from "../RedisActions/sheetCallRedis.js";
import serviceDropDownList from "../Helper/serviceDropDownList.js";

export const serviceDropDownTypeDefs = gql`
  type Query {
    serviceDropDown: serviceDropDown
  }
  type serviceDropDown {
    error: Error
    data: [String]
  }
  type Error {
    status: Int
    message: String
  }
`;

export const serviceDropDownResolvers = {
  Query: {
    serviceDropDown: async (_, { input }, { req }) => {
      // Authorize and Authentication Verification
      const protect = bothProtect(req, "NBFCDashboard");

      if (protect?.status !== 200) {
        return protect;
      }

      const payload = req.auth;
      const driversData = await sheetCallRedis();

      if (driversData.error === null && driversData.data) {
        const OEMList = serviceDropDownList(
          payload.role.role,
          payload.organization,
          driversData.data
        );
        return { data: OEMList, error: null };
      } else {
        return {
          data: null,
          error: {
            status: 400,
            message: "Bad Request",
          },
        };
      }
    },
  },
};
