import { gql } from "apollo-server-express";
import sheetCallRedis from "../RedisActions/sheetCallRedis.js";
import bothProtect from "../Controllers/protectController.js";
import calculateActionableWindow from "../Helper/calculateActionableWindow.js";

export const actionableWindowTypeDefs = gql`
  type Query {
    actionableWindow(input: ActionableWindowInput!): ActionableWindowsData
  }
  input ActionableWindowInput {
    FBID: String
  }
  type ActionableWindowsData {
    error: Error
    data: Data
  }
  type Error {
    status: Int
    message: String
  }
  type Data {
    lastSevenDaysData: [ChartActionableWindowData]
    paymentTrendsData: [ChartActionableWindowData]
    runKmData: [RunKmMonthData]
  }
  type ChartActionableWindowData {
    name: String
    value: String
  }
  type RunKmMonthData {
    name: String
    value: String
  }
`;

export const actionableWindowResolvers = {
  Query: {
    actionableWindow: async (_, { input }, { req }) => {
      // Authorize and Authentication Verification
      const protect = bothProtect(req, "actionableInsights");

      console.log(protect);
      if (protect?.status !== 200) {
        return protect;
      }

      const actionableWindowData = await sheetCallRedis();

      if (actionableWindowData.error === null && actionableWindowData.data) {
        const res = await calculateActionableWindow(
          actionableWindowData.data,
          input.FBID
        );
        return {
          error: null,
          data: {
            lastSevenDaysData: res.lastSevenDaysData,
            paymentTrendsData: res.paymentTrendsData,
            runKmData: res.runKmData,
          },
        };
      } else if (actionableWindowData.data === null) {
        return { error: actionableWindowData.error, data: null };
      } else {
        return { error: { status: 401, message: "Bad Request" }, data: null };
      }
    },
  },
};
