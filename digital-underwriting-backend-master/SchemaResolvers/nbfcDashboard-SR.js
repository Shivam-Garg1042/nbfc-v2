import { gql } from "apollo-server-express";
import bothProtect from "../Controllers/protectController.js";
import sheetCallRedis from "../RedisActions/sheetCallRedis.js";
import calculateNBFCDashboard from "../Helper/calculateNBFCDashboard.js";
import breakCamelCase from "../Helper/breakCamelCase.js";

export const nbfcDashboardTypeDefs = gql`
  type Query {
    nbfcDashboard(input: nbfcDashboardInput!): nbfcDashboard
  }
  input nbfcDashboardInput {
    nbfc: String
  }
  type nbfcDashboard {
    error: Error
    data: Data
  }
  type Error {
    status: Int
    message: String
  }
  type Data {
    cardsData: CardsData
    runKMData: [RunKMData]
    disbursmentByMonth: [DisbursmentByMonth]
    DisbursmentByCity: [DisbursmentByCity]
    LoginByMonth: [LoginByMonth]
    caseDetails: [CaseDetails]
    rejectionReasons: [RejectionReasons]
  }
  type CardsData {
    totalCases: TotalCases
    approved: Approved
    DOGenerated: DOGenerated
    disbursed: Disbursed
    DisbursPending: DisbursPending
    opportunityLost: OpportunityLost
  }
  type TotalCases {
    totalCases: Int
    NPA: Int
  }
  type Approved {
    approved: Int
    amount: String
  }
  type Disbursed {
    disbursed: Int
    amount: String
    active: Int
    closed: Int
    activeAmount: String
    closedAmount: String
    emiAmount: String
  }
  type DisbursPending {
    DisbursPending: Int
    amount: String
  }
  type DOGenerated {
    DOGenerated: Int
    amount: String
  }
  type OpportunityLost {
    opportunityLost: Int
    amount: String
  }
  type RunKMData {
    value: Int
    name: String
  }
  type DisbursmentByMonth {
    name: String
    value: Int
    drivers: Int
  }
  type DisbursmentByCity {
    name: String
    value: Int
    drivers: Int
  }
  type LoginByMonth {
    name: String
    drivers: Int
  }
  type CaseDetails {
    month: String
    disbursed: Int
    approved: Int
    rejected: Int
    total: Int
  }
  type RejectionReasons {
    name: String
    value: Int
  }
`;

export const nbfcDashboardResolvers = {
  Query: {
    nbfcDashboard: async (_, { input }, { req }) => {
      const { nbfc } = input;
      // Authorize and Authentication Verification
      const protect = bothProtect(req, "NBFCDashboard");

      if (protect?.status !== 200) {
        return protect;
      }

      const payload = req.auth;
      
    // const payload = {
    //     role: { role: "admin" },
    //     organization: "chargeup"
    //   };
      const NBFCDashboardData = await sheetCallRedis();

      if (NBFCDashboardData.error === null && NBFCDashboardData.data) {
        let nbfcList;
        if (nbfc && nbfc.trim() !== "") {
          nbfcList = nbfc
            .split(",")
            .map((val) => breakCamelCase(val).toLowerCase());
          
        }

        if (payload.role.role !== "admin" && payload.role.role !== "employee") {
          nbfcList = undefined;
          
        }
        if (payload.role.role !== "admin" && payload.role.role !== "employee")
          NBFCDashboardData.data = NBFCDashboardData.data.filter(
            (driver) =>
              driver.stageTwoNBFC.toLowerCase().split(" ").join("") ===
              payload.organization.toLowerCase()
          );

        const NBFCMoldedData = calculateNBFCDashboard(
          NBFCDashboardData.data,
          nbfcList
        );

        return {
          error: null,
          data: NBFCMoldedData,
        };
      } else if (NBFCDashboardData.error && NBFCDashboardData.data === null) {
        error.status = NBFCDashboardData.error.status || 401;
        error.message = NBFCDashboardData.error.message || "Bad Request";
      } else if (NBFCDashboardData.data === null) {
        error.status = NBFCDashboardData.error.status || 401;
        error.message = NBFCDashboardData.error.message || "Bad Request";
      }
    },
  },
};
