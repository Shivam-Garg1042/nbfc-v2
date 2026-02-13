import { gql } from "apollo-server-express";
import sheetCallRedis from "../RedisActions/sheetCallRedis.js";
import { calculateBusinessInsights } from "../Helper/calculateBusinessInsights.js";
import { creditRiskKarmaZoneFilter } from "../Helper/creditRiskKarmaZoneFilter.js";
import bothProtect from "../Controllers/protectController.js";
import jwt from "jsonwebtoken";

export const businessInsightsTypeDefs = gql`
  type Query {
    businessInsights(input: BusinessInsightsInput): BusinessInsightsData
  }
  input BusinessInsightsInput {
    credit: String
    risk: String
    zone: [String]
  }
  type BusinessInsightsData {
    error: Error
    settingGoogleSheetDataInfo: SettingGoogleSheetDataInfo
    gettingGoogleSheetDataInfo: Error
    data: Data
  }
  type SettingGoogleSheetDataInfo {
    dataSet: Boolean
    error: Error
  }
  type Error {
    status: Int
    message: String
  }
  type Data {
    length: String
    avgCredit: String
    resultRange: ResultRange
    vehicleFinanced: VehicleFinanced
    identityConfidence: IdentityConfidence
    phoneNameMatchScore: PhoneNameMatchScore
    driversUsingUpi: DriversUsingUpi
    digitalFootprint: DigitalFootprint
    socialFootprint: SocialFootprint
    socialMediaPlatform: SocialMediaPlatform
    phoneFootprint: PhoneFootprint
    digitalAge: DigitalAge
    phoneNetwork: PhoneNetwork
    uniqueCities: [String]
  }
  type ResultRange {
    lowCreditPercentage: String
    mediumCreditPercentage: String
    highCreditPercentage: String
  }
  type VehicleFinanced {
    yes: String
    no: String
  }
  type IdentityConfidence {
    high: String
    medium: String
    low: String
  }
  type PhoneNameMatchScore {
    high: String
    medium: String
    low: String
  }
  type DriversUsingUpi {
    yes: String
    no: String
  }
  type DigitalFootprint {
    high: String
    medium: String
    low: String
  }
  type SocialFootprint {
    high: String
    medium: String
    low: String
  }
  type SocialMediaPlatform {
    amazon: String
    whatsapp: String
    waBusiness: String
    instagram: String
    flipkart: String
    paytm: String
  }
  type PhoneFootprint {
    high: String
    medium: String
    low: String
  }
  type DigitalAge {
    high: String
    medium: String
    low: String
  }
  type PhoneNetwork {
    prepaid: String
    postpaid: String
  }
`;

export const businessInsightsResolvers = {
  Query: {
    businessInsights: async (_, { input }, { req }) => {
      // Authorize and Authentication Verification
      const protect = bothProtect(req, "businessInsights");

      if (protect?.status !== 200) {
        return protect;
      }
      const { credit, risk, zone } = input;
      // 1. Getting all Drivers
      const businessInsightsData = await sheetCallRedis();

      if (businessInsightsData.error === null && businessInsightsData.data) {
        // 2. Filtering drivers on Risk, Credit and Zone
        const filteredData = creditRiskKarmaZoneFilter(
          businessInsightsData.data,
          {
            credit,
            risk,
            zone,
          }
        );

        // 3. Calculating the Insights Data from filteres drivers
        let data = calculateBusinessInsights(filteredData);

        return {
          error: null,
          settingGoogleSheetDataInfo:
            businessInsightsData.settingGoogleSheetDataInfo,
          gettingGoogleSheetDataInfo:
            businessInsightsData.gettingGoogleSheetDataInfo,
          data,
        };
      } else if (businessInsightsData.data === null) {
        return {
          error: businessInsightsData.error,
          data: null,
        };
      } else {
        return { error: { status: 401, message: "Bad Request" }, data: null };
      }
    },
  },
};
