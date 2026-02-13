import { gql } from "apollo-server-express";
import sheetCallRedis from "../RedisActions/sheetCallRedis.js";
import { creditRiskKarmaZoneFilter } from "../Helper/creditRiskKarmaZoneFilter.js";
import redisClient from "../redisClient.js";
import NBFCNames from "../Helper/NBFCNames.js";
import bothProtect from "../Controllers/protectController.js";

export const onboardedTypeDefs = gql`
  type Query {
    onboarded(input: OnboardedInput): DriverData
  }
  input OnboardedInput {
    limit: Int
    offset: Int
    credit: String
    risk: String
    karma: String
    searchId: String
    onboarded: String
    vehicleType: String
  }
  type DriverData {
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
    onboardedManipulatedData: [OnboardedManipulatedData]
  }
  type OnboardedManipulatedData {
    id: String
    name: String
    avgDpd: String
    service: String
    runKm: String
    nps: String
    karma: String
    credit: String
    risk: String
    phone: String
    gender: String
    dob: String
    product: String
    batteryID: String
  }
`;

export const onboardedResolvers = {
  Query: {
    onboarded: async (_, { input }, { req }) => {
      // Authorize and Authentication Verification
      const protect = bothProtect(req, "onboardedDrivers");

      if (protect?.status !== 200) {
        return protect;
      }

      const payload = req.auth;
      let { limit = 6, offset = 0, credit, risk, karma, searchId, vehicleType } = input;

      let NBFCQuery = NBFCNames(input.onboarded);

      if (payload.role.role !== "admin" && payload.role.role !== "employee")
        NBFCQuery = null;

      const cacheKey = `CREDIT_${credit}_RISK_${risk}_KARMA_${karma}_${searchId}_${NBFCQuery}_${vehicleType}`;
      const cachedFilteredCombinationData = await redisClient.get(cacheKey);
      const response = JSON.parse(cachedFilteredCombinationData);

      let data;
      let onboardedManipulatedData = [];
      let driverData = {};
      let error = {};
      let settingGoogleSheetDataInfo;
      let gettingGoogleSheetDataInfo;

      if (!response?.onboardedManipulatedData) {
        // 1. Getting all drivers
        const onboardedData = await sheetCallRedis();

        // console.log(onboardedData.data.length);

        // console.log(
        //   onboardedData.data.filter((driver) => driver.NBFC === "Shivakari")
        //     .length
        // );

        if (onboardedData.error === null && onboardedData.data) {
          // Filtering the drivers according to the NBFC
          if (payload.role.role !== "admin" && payload.role.role !== "employee")
            onboardedData.data = onboardedData.data
              .filter(
                (driver) =>
                  driver.NBFC && 
                  driver.NBFC.toLowerCase().split(" ").join("") ===
                  payload.organization.toLowerCase()
              )
              .filter(
                (driver) => 
                  driver.initialStage && 
                  driver.initialStage.toLowerCase() === "disbursed"
              );
          // 2. Filtering drivers on credit, risk and karma
          data = creditRiskKarmaZoneFilter(onboardedData.data, {
            credit,
            risk,
            karma,
            searchId,
            NBFCQuery,
          });

          for (let i = 0; i < data.length; i++) {
            let row = {};
            row.id = data[i].CreatedID;
            row.name =
              data[i].OwnerFirstName.toLowerCase() +
              " " +
              data[i].LastName.toLowerCase();
            row.avgDpd = Number(data[i].avgDPD).toFixed(2);
            row.service = data[i].service;
            row.runKm = Number(data[i].runKm).toFixed(0);
            row.nps = data[i].NPS === 0 ? "-" : Number(data[i].NPS).toFixed(0);
            row.karma = data[i].karmaScore;
            row.credit = Number(data[i].creditScore);
            row.risk = Number(data[i].riskScore).toFixed(0);
            
           
            row.product = data[i].productType;
            row.phone = data[i].Contact_Number_of_Owner || "";
            row.gender = data[i].Owner_Gender || "";
            row.dob = data[i].Owners_DOB || "";
            row.batteryID = data[i].batteryID || "";
            onboardedManipulatedData.push(row);
          }

          // 3. Structuring the data accordingly
          driverData.onboardedManipulatedData = onboardedManipulatedData.sort(
            (a, b) => b.credit - a.credit
          );

          settingGoogleSheetDataInfo = onboardedData.settingGoogleSheetDataInfo;
          gettingGoogleSheetDataInfo = onboardedData.gettingGoogleSheetDataInfo;

          await redisClient.setEx(cacheKey, 3600 * 24, JSON.stringify(driverData));
        } else if (onboardedData.error && onboardedData.data === null) {
          error.status = onboardedData.error.status || 401;
          error.message = onboardedData.error.message || "Bad Request";
        } else if (onboardedData.data === null) {
          error.status = onboardedData.error.status || 401;
          error.message = onboardedData.error.message || "Bad Request";
        }
      }

      // 4. Handling Error State
      if (error.status && error.message) {
        return { data: null, error };
      }

      // 5. Paginating the drivers
      return response
        ? {
            error: null,
            data: {
              length: response.onboardedManipulatedData.length,
              onboardedManipulatedData: response.onboardedManipulatedData.slice(
                offset,
                offset + limit
              ),
            },
          }
        : {
            error: null,
            settingGoogleSheetDataInfo,
            gettingGoogleSheetDataInfo,
            data: {
              length: onboardedManipulatedData.length,
              onboardedManipulatedData:
                driverData.onboardedManipulatedData.slice(
                  offset,
                  offset + limit
                ),
            },
          };
    },
  },
};
