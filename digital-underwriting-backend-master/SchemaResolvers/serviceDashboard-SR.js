import { gql } from "apollo-server-express";
import bothProtect from "../Controllers/protectController.js";
import sheetCallRedisService from "../RedisActions/sheetCallRedisService.js";
import sheetCallRedis from "../RedisActions/sheetCallRedis.js";
import serviceCalculations from "../Helper/serviceCalculations.js";
import createCamelCase from "../Helper/createCamelCase.js";

export const serviceDashboardTypeDefs = gql`
  type Query {
    serviceDashboard(input: SerciveInput!): serviceDashboard
  }
  input SerciveInput {
    serviceList: String
    headerFilters: HeaderFilters
  }
  input HeaderFilters {
    BMS: [String]
    complaintDate: YearMonth
    handoverDate: YearMonth
    zone: [String]
  }
  input YearMonth {
    year2024: [String]
    year2023: [String]
    year2025: [String]
  }
  type serviceDashboard {
    error: Error
    data: Data
  }
  type Error {
    status: Int
    message: String
  }
  type Data {
    summaryData: SummaryData
    TATServiceEngineer: [ChartDataType]
    TATDriverFacingData: [ChartDataType]
    resolution: [ChartDataType]
    topResolutionType: [ChartDataType]
    runKms: [ChartDataType]
    recurrenceFault: [ChartDataType]
    faultRate: [ChartDataType]
    OEMOnFeildAndRTP: OEMOnFeildAndRTP
    vehicleFaultAndContribution: [VehicleFaultAndContribution]
  }
  type SummaryData {
    totalCases: String
    closed: String
    pending: String
    RTP: String
    pickupPending: String
    pickupDone: String
  }
  type VehicleFaultAndContribution {
    name: String
    contribution: String
    fault: String
  }
  type OEMOnFeildAndRTP {
    SLAOnFeild: [ChartDataType]
    SLARTP: [ChartDataType]
  }
  type ChartDataType {
    name: String
    value: Int
  }
`;

export const serviceDashboardResolvers = {
  Query: {
    serviceDashboard: async (_, { input }, { req }) => {
      // Authorize and Authentication Verification
      const protect = bothProtect(req, "service");

      if (protect?.status !== 200) {
        return protect;
      }

      const payload = req.auth;
      const [serviceData, driversData] = await Promise.all([
        sheetCallRedisService(),
        sheetCallRedis(),
      ]);

      if (
        serviceData.error === null &&
        serviceData.data &&
        driversData.error === null &&
        driversData.data
      ) {
        let ans = serviceData.data.map((val) => {
          return {
            batteryNumber: val["Battery No."],
            city: val.City,
            complaintDate: val["Complaint Date"],
            foundedIssues: val["Founded Issues"],
            currentStatus: val["Current Status"],
            RTPInPlantDate: val["RTP in Plant Date"],
            RTPReturnedDate: val["RTP Returned Date"],
            totalTATRange: val["TAT Service egr"],
            driverLossDaysRange: val["TAT Driver loss"],
            repeatRange: val["REPEAT RANGE"],
            resolvedBy: val["RESLOVED BY"],
            handoverDate: val["HANDOVER DATE"],
            SLA: val.SLA,
            batteryId: val["Battery ID"], // Extra space removed from key name
            assetHandoverDate: val["Asset Handover Date"],
            vehicleOEM: val["Vehicle OEM"],
            batteryOEM: val["OEM"],
            nbfc: val["NBFC"],
            BMS: val["BMS"],
          };
        });

        if (payload.role.role === "nbfc") {
          ans = ans.filter((service) => {
            return (
              createCamelCase(service.nbfc.toLowerCase()) ===
              payload.organization
            );
          });
          driversData.data = driversData.data.filter((driver) => {
            return (
              createCamelCase(driver.NBFC.toLowerCase()) ===
              payload.organization
            );
          });
        }
        if (payload.role.role === "oem") {
          ans = ans.filter((service) => {
            return service.batteryOEM.toLowerCase() === payload.organization;
          });

          driversData.data = driversData.data.filter((driver) => {
            return driver["Battery OEM"].toLowerCase() === payload.organization;
          });
        }

        const serviceCalculatedData = serviceCalculations(
          ans,
          driversData.data,
          input.serviceList,
          input.headerFilters
        );
        return { data: serviceCalculatedData, error: null };
      } else if (
        serviceData.error &&
        serviceData.data === null &&
        driversData.data === null &&
        driversData.data
      ) {
        return {
          data: null,
          error: {
            status: serviceData.error.status || 400,
            message: serviceData.error.message || "Bad Request",
          },
        };
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
