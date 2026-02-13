import { gql } from "apollo-server-express";
import creditAPI from "../APIs/creditAPI.js";
import bothProtect from "../Controllers/protectController.js";

export const creditTypeDefs = gql`
  type CreditHeader {
    firstName: String
    lastName: String
    mobile: String
    pan: String
  }

  type CreditData {
    clientId: String
    firstName: String
    lastName: String
    mobile: String
    pan: String
    creditScore: String
    creditReportLink: String
    creditReport: String
  }

  type CreditResponse {
    transactionId: String
    status: String
    timestamp: String
    header: CreditHeader
    data: CreditData
  }

  input CreditInput {
    firstName: String!
    lastName: String!
    mobile: String!
    pan: String!
  }

  extend type Query {
    credit(input: CreditInput!): CreditResponse
  }
`;

export const creditResolvers = {
  Query: {
    credit: async (_, { input }, { req }) => {
      // Authorize and Authentication Verification
      const protect = bothProtect(req, "verification");

      if (protect?.status !== 200) {
        return {
          statusCode: protect.status,
          error: { status: protect.status, message: protect.error.message },
          data: null,
        };
      }

      const creditData = await creditAPI(input);

      if (creditData.statusCode && creditData.statusCode === 200) {
        const responseData = creditData.data;
        
        return {
          data: {
            transactionId: responseData.clientId,
            status: 'SUCCESS',
            timestamp: new Date().toISOString(),
            header: {
              firstName: input.firstName,
              lastName: input.lastName,
              mobile: input.mobile,
              pan: input.pan
            },
            data: {
              clientId: responseData.clientId,
              firstName: responseData.firstName,
              lastName: responseData.lastName,
              mobile: responseData.mobile,
              pan: responseData.pan,
              creditScore: responseData.creditScore,
              creditReportLink: responseData.creditReportLink,
              creditReport: responseData.creditReport
            }
          },
        };
      } else {
        return {
          statusCode: creditData.statusCode || 500,
          error: {
            statusCode: creditData.statusCode?.toString() || "500",
            message: creditData.error || "Credit report generation failed",
          },
          data: null,
        };
      }
    },
  },
};
