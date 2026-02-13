import { gql } from "apollo-server-express";
import sheetCallRedis from "../RedisActions/sheetCallRedis.js";
import { calculateSocialFootPrint } from "../Helper/calculateSocialFootPrint.js";
import { calculateWhereIStand } from "../Helper/calculateWhereIStand.js";

export const onboardedRiskTypeDefs = gql`
  type Query {
    onboardedRisk(input: OnboardedRiskInput): DriverDetails
  }
  input OnboardedRiskInput {
    id: String
  }
  type DriverDetails {
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
    riskScore: Float
    digital: Digital
    identity: Identity
    social: Social
    telecom: Telecom
    whereIStand: [WhereIStand]
  }
  type Digital {
    digitalFootprint: String
    affluenceScore: Float
    digitalPaymentScore: Float
    vpa: String
  }
  type Identity {
    identityConfidence: String
    phoneFootprint: String
    digitalAge: Float
    nameMatchScore: Float
  }
  type Social {
    socialFootprint: String
    socialMediaScore: Float
    socialMediaCount: Float
    ecommerceScore: Float
  }
  type Telecom {
    telecomRisk: String
    isPhoneReachable: String
    billing: String
    portHistory: String
  }
  type WhereIStand {
    score: String
    percent: String
    color: String
  }
`;

export const onboardedRiskResolvers = {
  Query: {
    onboardedRisk: async (_, { input }) => {
      const drivers = await sheetCallRedis();

      if (drivers.error === null && drivers.data) {
        const driverData = drivers.data.find(
          (driver) => driver.CreatedID === input.id
        );

        let data = {
          riskScore: driverData.riskScore,
          digital: {
            digitalFootprint: driverData.digitalFootprint,
            affluenceScore: driverData.affluenceScore,
            digitalPaymentScore: driverData.digitalPaymentScore,
            vpa: driverData.vpa,
          },
          identity: {
            identityConfidence: driverData.identityConfidence,
            phoneFootprint: driverData.phoneFootprint,
            digitalAge: driverData.digitalage,
            nameMatchScore: driverData.phoneNameMatchScore,
          },
          social: {
            socialFootprint: calculateSocialFootPrint(
              +driverData.socialFootprintScore
            ),
            socialMediaScore: driverData.socialScore,
            socialMediaCount: socialMediaCount(driverData),
            ecommerceScore: driverData.ecommerceScore,
          },
          telecom: {
            telecomRisk: driverData.telecomRisk,
            isPhoneReachable: driverData.phoneReachable,
            billing: driverData.phoneNetwork,
            portHistory: driverData.portingHistory,
          },
          whereIStand: calculateWhereIStand(drivers.data),
        };

        // console.log(data);

        return {
          error: null,
          settingGoogleSheetDataInfo: drivers.settingGoogleSheetDataInfo,
          gettingGoogleSheetDataInfo: drivers.gettingGoogleSheetDataInfo,
          data,
        };
      } else if (drivers.data === null && drivers.error) {
        return drivers;
      } else if (drivers.data === null) {
        return { error: { status: 401, message: "Bad Request" }, data: null };
      }
    },
  },
};

function socialMediaCount(data) {
  // List of social media keys to check
  const socialMediaKeys = [
    "amazon",
    "flipkart",
    "whatsapp",
    "waBusiness",
    "instagram",
    "paytm",
  ];

  // Filter and count the ones with the value "Account Found"
  const accountFoundCount = socialMediaKeys.reduce((count, key) => {
    return count + (data[key] === "Account Found" ? 1 : 0);
  }, 0);

  return accountFoundCount;
}
