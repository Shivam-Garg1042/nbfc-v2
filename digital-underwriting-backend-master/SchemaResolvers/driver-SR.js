import { gql } from "apollo-server-express";
import sheetCallRedis from "../RedisActions/sheetCallRedis.js";
import { calculateVehicleAge } from "../Helper/calculateVehicleAge.js";
import { calculateSocialFootPrint } from "../Helper/calculateSocialFootPrint.js";
import { getMonthsPassed } from "../Helper/calculateMonthsPassed.js";

export const driverTypeDefs = gql`
  type Query {
    driver(input: String!): DriverData
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
    id: String
    status: String
    onboardedDate: String
    cardData: CardData
    personalInformation: PersonalInformation
    contactInformation: ContactInformation
    vehicleInformation: VehicleInformation
    financialInformation: FinancialInformation
    footprintsAndRisk: FootprintsAndRisk
    businessInformation: BusinessInformation
    socialMediaInformation: SocialMediaInformation
    runKmInformation: RunKmInformation
    earningVsExpense: EarningVsExpense
    emi: String

  }

  type CardData {
    service: String
    runKm: String
    lossDays: String
    karmaScore: String
    nps: String
    avgDpd: String
    aon: String
  }

  type PersonalInformation {
    firstName: String
    lastName: String
    dob: String
    gender: String
    maritalStatus: String
    noOfChildren: String
    permanentAddress: String
    city: String
    state: String
    assetHandoverDay : String
  }

  type ContactInformation {
    mobile: String
    aadhaar: String
    pan: String
    vpa: String
    source: String
  }

  type VehicleInformation {
    vehicleFinanced: String
    vehicleType: String
    vehicleRegistrationNumber: String
    vehicleModel: String
    serviceType: String
    registrationDate: String
    vehicleAgeInMonths: String
  }

  type FinancialInformation {
    bankAccountNumber: String
    IFSCCode: String
    downPayment: String
    tenure: String
    creditScore: String
    avgDpd: String
    emiDpd: String
    emiAmount : String
  }

  type FootprintsAndRisk {
    riskScore: String
    socialFootPrint: String
    digitalFootPrint: String
    phoneFootPrint: String
    telecomRisk: String
    socialScore: String
    identityConfidence: String
  }

  type BusinessInformation {
    businessSegment: String
    serviceType: String
  }

  type SocialMediaInformation {
    amazon: String
    flipkart: String
    instagram: String
    waBusiness: String
    paytm: String
    whatsapp: String
  }

  type RunKmInformation {
    thirdLastRunKm: String
    secondLastRunKm: String
    lastRunKm: String
  }
  type EarningVsExpense {
    earningInformation: EarningInformation
    expenseInformation: ExpenseInformation
  }
  type EarningInformation {
    thirdLastEarning: String
    secondLastEarning: String
    lastEarning: String
  }
  type ExpenseInformation {
    thirdLastExpense: String
    secondLastExpense: String
    lastExpense: String
  }
`;

export const driverResolvers = {
  Query: {
    driver: async (_, { input }) => {
      const drivers = await sheetCallRedis();

      if (drivers.error === null && drivers.data) {
        const driverData = drivers.data.find(
          (driver) => driver.CreatedID === input
        );

        const monthsPassed = getMonthsPassed(driverData.Onboarding_Date);

        function ageOnNetwork(date) {
          const startDate = new Date(date);
          const currentDate = new Date();

          const timeDiff = currentDate - startDate; // Difference in milliseconds
          const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // Convert to days

          return dayDiff;
        }
        function toFix(value, fix = 0) {
          return value !== "" ? value.toFixed(fix) : "";
        }

        const driverManipulatedData = {
          id: driverData.CreatedID,
          status: driverData.Status,
          onboardedDate: driverData.Onboarding_Date.split("T")[0],
          cardData: {
            service: driverData.service,
            runKm: toFix(driverData.runKm),
            lossDays: driverData.lossDays,
            karmaScore: driverData.karmaScore,
            nps: toFix(driverData.NPS) === "0" ? "-" : toFix(driverData.NPS),
            avgDpd:
              toFix(driverData.avgDPD) === "" ? "-" : toFix(driverData.avgDPD),
            aon: ageOnNetwork(driverData.Onboarding_Date),
          },
          personalInformation: {
            firstName: driverData.OwnerFirstName,
            lastName: driverData.LastName,
            dob: driverData.Owners_DOB.split("T")[0],
            gender: driverData.Owner_Gender,
            maritalStatus: driverData.MaritalStatus,
            noOfChildren: driverData.NoofChildren,
            permanentAddress: driverData.Owner_Permanent_Address,
            city: driverData.Es_City,
            state: driverData.State,
            assetHandoverDay : driverData.assetHandoverDay
          },
          contactInformation: {
            mobile: driverData.Contact_Number_of_Owner,
            aadhaar: driverData.Owner_Aadhaar_Number,
            pan: driverData.Owner_PAN_Number,
            vpa: driverData.vpa,
            source: driverData.source,
          },
          vehicleInformation: {
            vehicleFinanced: driverData.vehicleFinance,
            vehicleType: driverData.VehicleType,
            vehicleRegistrationNumber: driverData.VehicleRegistrationNumber,
            vehicleModel: driverData.VehicleModel,
            serviceType: driverData.ServiceType,
            registrationDate: driverData.PurchaseDate, // If you have purchase date
            vehicleAgeInMonths: calculateVehicleAge(driverData.PurchaseDate), // Assuming you have a helper function for this
          },
          financialInformation: {
            bankAccountNumber: driverData.Bank_Account_Number,
            IFSCCode: driverData.IFSC_Code,
            downPayment: driverData.DownPayment,
            tenure: driverData.Tenure,
            creditScore: driverData.creditScore,
            avgDpd:
              driverData.avgDPD === ""
                ? driverData.avgDPD
                : driverData.avgDPD.toFixed(2),
            emiDpd: driverData.emidpd,
            emiAmount: driverData.emiAmount,
          },
          footprintsAndRisk: {
            riskScore: driverData.riskScore,
            socialFootPrint: calculateSocialFootPrint(
              driverData.socialFootprintScore
            ),
            digitalFootPrint: driverData.digitalFootprint?.toLowerCase(),
            phoneFootPrint: driverData.phoneFootprint?.toLowerCase(),
            telecomRisk: driverData.telecomRisk,
            socialScore: driverData.socialScore,
            identityConfidence: driverData.identityConfidence,
          },
          businessInformation: {
            businessSegment: driverData.BusinessSegment,
            serviceType: driverData.ServiceType,
          },
          socialMediaInformation: {
            amazon: driverData.amazon,
            flipkart: driverData.flipkart,
            instagram: driverData.instagram,
            waBusiness: driverData.waBusiness,
            paytm: driverData.paytm,
            whatsapp: driverData.whatsapp,
          },
          runKmInformation: {
            thirdLastRunKm: toFix(driverData.thirdLastRunKm),
            secondLastRunKm: toFix(driverData.secondLastRunKm),
            lastRunKm: toFix(driverData.lastRunKm),
          },
          earningVsExpense: {
            earningInformation: {
              thirdLastEarning: (driverData.thirdLastRunKm * 15 * 25).toFixed(),
              secondLastEarning: (
                driverData.secondLastRunKm *
                15 *
                25
              ).toFixed(),
              lastEarning: (driverData.lastRunKm * 15 * 25).toFixed(),
            },
            expenseInformation: {
              thirdLastExpense: (
                driverData.thirdLastRunKm * 0.5 * 25 +
                (monthsPassed > 2
                  ? driverData.emiAmount
                    ? +driverData.emiAmount
                    : 0
                  : 0)
              ).toFixed(),
              secondLastExpense: (
                driverData.secondLastRunKm * 0.5 * 25 +
                (monthsPassed > 1
                  ? driverData.emiAmount
                    ? +driverData.emiAmount
                    : 0
                  : 0)
              ).toFixed(),
              lastExpense: (
                driverData.lastRunKm * 0.5 * 25 +
                (monthsPassed > 0
                  ? driverData.emiAmount
                    ? +driverData.emiAmount
                    : 0
                  : 0)
              ).toFixed(),
            },
          },

          emi: driverData.emidpd,
        };

        return {
          error: null,
          settingGoogleSheetDataInfo: drivers.settingGoogleSheetDataInfo,
          gettingGoogleSheetDataInfo: drivers.gettingGoogleSheetDataInfo,
          data: driverManipulatedData,
        };
      } else if (drivers.data === null && drivers.error) {
        return {
          data: null,
          error: {
            status: drivers.error.status || 401,
            message: drivers.error.message || "Bad Request",
          },
        };
      } else {
        return {
          data: null,
          error: {
            status: 401,
            message: "Bad Request",
          },
        };
      }
    },
  },
};
