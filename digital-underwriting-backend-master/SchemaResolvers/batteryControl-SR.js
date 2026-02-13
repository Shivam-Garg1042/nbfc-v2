import { gql } from "apollo-server-express";
import bothProtect from "../Controllers/protectController.js";
import batteryControlAPI from "../APIs/batteryControlAPI.js";

export const batteryControlTypeDefs = gql`
  type Query {
    batteryControl(input: BatteryControlInput): BatteryControlData
  }
  input BatteryControlInput {
    actionType: String
    batteryID: String
  }
  type BatteryControlData {
    error: Error
    data: Data
  }
  type Error {
    status: Int
    message: String
  }
  type Data {
    status: String
    message: String
  }
`;

export const batteryControlResolvers = {
  Query: {
    batteryControl: async (_, { input }, { req }) => {
      // Authorize and Authentication Verification
      const protect = bothProtect(req, "actionableInsights");

      if (protect?.status !== 200) {
        return protect;
      }

      const batteryControlData = await batteryControlAPI(
        input.actionType,
        input.batteryID
      );

      if (batteryControlData.error === null && batteryControlData.data) {
        return batteryControlData;
      } else if (batteryControlData.data === null) {
        return { error: batteryControlData.error, data: null };
      } else {
        return { error: { status: 401, message: "Bad Request" }, data: null };
      }
    },
  },
};
