import { gql } from "apollo-server-express";
import bothProtect from "../Controllers/protectController.js";
import calculateBatteryGPS from "../Helper/calculateBatteryGPS.js";

export const batteryLocationTypeDefs = gql`
  type Query {
    batteryLocation(input: BatteryLocationInput): BatteryLocationData
  }
  input BatteryLocationInput {
    batteryID: String!
  }
  type BatteryLocationData {
    error: Error
    data: [Data]
  }
  type Error {
    status: Int
    message: String
  }
  type Data {
    lat: String
    lng: String
    batteryVoltage: String
    address: String
  }
`;

export const batteryLocationResolvers = {
  Query: {
    batteryLocation: async (_, { input }, { req }) => {
      // Authorize and Authentication Verification
      const protect = bothProtect(req, "actionableInsights");

      if (protect?.status !== 200) {
        return protect;
      }

      const batteryLocationData = await calculateBatteryGPS(input.batteryID);

      if (batteryLocationData.error === null && batteryLocationData.data) {
        return batteryLocationData;
      } else if (batteryLocationData.data === null) {
        return { error: batteryLocationData.error, data: null };
      } else {
        return { error: { status: 400, message: "Bad Request" }, data: null };
      }
    },
  },
};
