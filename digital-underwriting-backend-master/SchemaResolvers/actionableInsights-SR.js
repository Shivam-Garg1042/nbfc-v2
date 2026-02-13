import { gql } from "apollo-server-express";
import sheetCallRedis from "../RedisActions/sheetCallRedis.js";
import bothProtect from "../Controllers/protectController.js";
import actionableCalculation from "../Helper/actionableCalculation.js";
import NBFCNames from "../Helper/NBFCNames.js";

export const actionableInsightsTypeDefs = gql`
  type Query {
    actionableInsights(input: ActionableInsightInput!): ActionableInsightsData
    actionableInsightsSummary(input: ActionableInsightSummaryInput!): ActionableInsightsSummaryData
  }
  input ActionableInsightInput {
    offset: Int
    limit: Int
    actionable: String
    actionableInsights: String
  }
  input ActionableInsightSummaryInput {
    actionableInsights: String
  }
  type ActionableInsightsData {
    error: Error
    data: Data
  }
  type ActionableInsightsSummaryData {
    error: Error
    data: SummaryData
  }
  type SummaryData {
    topDrivers: Int
    bottomDrivers: Int
    paymentOnTime: Int
    paymentDelay: Int
    likelyToDefault: Int
  }
  type Error {
    status: Int
    message: String
  }
  type Data {
    total: String
    drivers: [Drivers]
  }
  type Drivers {
    driverID: String
    name: String
    batteryID: String
    mobile: String
    avgRunKm: String
    status: String
    action: String
    productType: String
  }
`;

export const actionableInsightsResolvers = {
  Query: {
    actionableInsights: async (_, { input }, { req }) => {
      const { offset = 0, limit = 6, actionable, actionableInsights } = input;

      // Authorize and Authentication Verification
      const protect = bothProtect(req, "actionableInsights");

      if (protect?.status !== 200) {
        return protect;
      }

      const payload = req.auth;
      const actionableInsightData = await sheetCallRedis();

      let nbfcArr = NBFCNames(actionableInsights);

      if (payload.role.role !== "admin" && payload.role.role !== "employee")
        nbfcArr = null;

      // hey added
      if (actionableInsightData.error === null && actionableInsightData.data) {
        // Filtering the drivers according to the organization
        if (payload.role.role !== "admin" && payload.role.role !== "employee") {
          actionableInsightData.data = actionableInsightData.data
            .filter(
              (driver) =>
                driver.NBFC.toLowerCase().split(" ").join("") ===
                payload.organization.toLowerCase()
            )
            .filter(
              (driver) => driver.initialStage.toLowerCase() === "disbursed"
            );
        }
        const ans = actionableCalculation(
          actionableInsightData.data,
          actionable,
          nbfcArr
        );
        return {
          error: null,
          data: {
            total: ans.total,
            drivers: ans.drivers.slice(offset, offset + limit),
          },
        };
      } else if (actionableInsightData.data === null) {
        return { error: actionableInsightData.error, data: null };
      } else {
        return { error: { status: 401, message: "Bad Request" }, data: null };
      }
    },
    
    actionableInsightsSummary: async (_, { input }, { req }) => {
      const { actionableInsights } = input;

      // Authorize and Authentication Verification
      const protect = bothProtect(req, "actionableInsights");

      if (protect?.status !== 200) {
        return protect;
      }

      const payload = req.auth;
      const actionableInsightData = await sheetCallRedis();

      let nbfcArr = NBFCNames(actionableInsights);

      if (payload.role.role !== "admin" && payload.role.role !== "employee")
        nbfcArr = null;

      if (actionableInsightData.error === null && actionableInsightData.data) {
        // Filtering the drivers according to the organization
        let filteredData = actionableInsightData.data;
        
        if (payload.role.role !== "admin" && payload.role.role !== "employee") {
          filteredData = filteredData
            .filter(
              (driver) =>
                driver.NBFC.toLowerCase().split(" ").join("") ===
                payload.organization.toLowerCase()
            )
            .filter(
              (driver) => driver.initialStage.toLowerCase() === "disbursed"
            );
        }

        // Calculate all counts in a single pass for efficiency
        const actionableTypes = ['topDrivers', 'bottomDrivers', 'paymentOnTime', 'paymentDelay', 'last7DaysRunKm'];
        const summary = {};
        
        actionableTypes.forEach(actionable => {
          const result = actionableCalculation(filteredData, actionable, nbfcArr);
          const keyMap = {
            'topDrivers': 'topDrivers',
            'bottomDrivers': 'bottomDrivers',
            'paymentOnTime': 'paymentOnTime',
            'paymentDelay': 'paymentDelay',
            'last7DaysRunKm': 'likelyToDefault'
          };
          summary[keyMap[actionable]] = parseInt(result.total) || 0;
        });

        return {
          error: null,
          data: summary
        };
      } else if (actionableInsightData.data === null) {
        return { error: actionableInsightData.error, data: null };
      } else {
        return { error: { status: 401, message: "Bad Request" }, data: null };
      }
    },
  },
};

