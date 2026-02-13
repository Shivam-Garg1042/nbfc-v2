import { gql } from "graphql-tag";
import { vehicleResolvers, vehicleTypeDefs } from "../Vehicle-SR.js";
import { creditResolvers, creditTypeDefs } from "../credit-SR.js";
import { riskTypeDefs, riskResolvers } from "../risk-SR.js";
import { dashboardTypeDefs, dashboardResolvers } from "../dashboard-SR.js";
import { onboardedTypeDefs, onboardedResolvers } from "../onboarded-SR.js";
import { driverTypeDefs, driverResolvers } from "../driver-SR.js";
import { newUserTypeDefs, newUserResolvers } from "../newUser-SR.js";
import { loginTypeDefs, loginResolvers } from "../login-SR.js";
import { deleteUserTypeDefs, deleteUserResolvers } from "../deleteUser-SR.js";
import {
  serviceDropDownTypeDefs,
  serviceDropDownResolvers,
} from "../serviceDropDown-SR.js";
import {
  batteryControlTypeDefs,
  batteryControlResolvers,
} from "../batteryControl-SR.js";
import {
  batteryLocationTypeDefs,
  batteryLocationResolvers,
} from "../batteryLocation-SR.js";
import {
  actionableWindowTypeDefs,
  actionableWindowResolvers,
} from "../actionableWindow-SR.js";
import {
  actionableInsightsTypeDefs,
  actionableInsightsResolvers,
} from "../actionableInsights-SR.js";
import {
  serviceDashboardTypeDefs,
  serviceDashboardResolvers,
} from "../serviceDashboard-SR.js";
import {
  userManagementTypeDefs,
  userManagementResolvers,
} from "../userManagement-SR.js";
import {
  nbfcDashboardTypeDefs,
  nbfcDashboardResolvers,
} from "../nbfcDashboard-SR.js";

import {
  onboardedRiskTypeDefs,
  onboardedRiskResolvers,
} from "../onboardedRisk-SR.js";
import {
  businessInsightsTypeDefs,
  businessInsightsResolvers,
} from "../businessInsights-SR.js";

const typeDefs = gql`
  ${vehicleTypeDefs}
  ${creditTypeDefs}
  ${riskTypeDefs}
  ${dashboardTypeDefs}
  ${onboardedTypeDefs}
  ${driverTypeDefs}
  ${businessInsightsTypeDefs}
  ${onboardedRiskTypeDefs}
  ${newUserTypeDefs}
  ${loginTypeDefs}
  ${nbfcDashboardTypeDefs}
  ${userManagementTypeDefs}
  ${deleteUserTypeDefs}
  ${serviceDashboardTypeDefs}
  ${actionableInsightsTypeDefs}
  ${actionableWindowTypeDefs}
  ${batteryLocationTypeDefs}
  ${batteryControlTypeDefs}
  ${serviceDropDownTypeDefs}
`;

const resolvers = {
  Query: {
    vehicle: vehicleResolvers.Query.vehicle,
    credit: creditResolvers.Query.credit,
    risk: riskResolvers.Query.risk,
    dashboard: dashboardResolvers.Query.dashboard,
    onboarded: onboardedResolvers.Query.onboarded,
    driver: driverResolvers.Query.driver,
    businessInsights: businessInsightsResolvers.Query.businessInsights,
    onboardedRisk: onboardedRiskResolvers.Query.onboardedRisk,
    newUser: newUserResolvers.Query.newUser,
    login: loginResolvers.Query.login,
    nbfcDashboard: nbfcDashboardResolvers.Query.nbfcDashboard,
    userManagement: userManagementResolvers.Query.userManagement,
    deleteUser: deleteUserResolvers.Query.deleteUser,
    serviceDashboard: serviceDashboardResolvers.Query.serviceDashboard,
    actionableInsights: actionableInsightsResolvers.Query.actionableInsights,
    actionableInsightsSummary: actionableInsightsResolvers.Query.actionableInsightsSummary,
    actionableWindow: actionableWindowResolvers.Query.actionableWindow,
    batteryLocation: batteryLocationResolvers.Query.batteryLocation,
    batteryControl: batteryControlResolvers.Query.batteryControl,
    serviceDropDown: serviceDropDownResolvers.Query.serviceDropDown,
  },
};

export { typeDefs, resolvers };
