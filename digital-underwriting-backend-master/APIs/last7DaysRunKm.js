import {
  getEndOfYesterdayIST,
  getStartOf7DaysAgoFromYesterdayIST,
} from "../Helper/timeAndDateFunctions.js";

export default async function last7DaysRunKm(vehicleNo) {
  try {
    // Step 1: Get the token
    const authResponse = await fetch(
      "https://apiplatform.intellicar.in/api/standard/gettoken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "ritesh.anand@echargeup.com",
          password: "MBGZijzxmf",
        }),
      }
    );

    if (!authResponse.ok) {
      throw new Error("Failed to get token");
    }

    const authData = await authResponse.json();
    const token = authData.data.token;

    // Step 2: Use the token to fetch data
    const dataResponse = await fetch(
      "https://apiplatform.intellicar.in/api/reports/echargeup/chg-dchg/aggregate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          vehicleno: vehicleNo,
          starttime: getStartOf7DaysAgoFromYesterdayIST(),
          endtime: getEndOfYesterdayIST(),
        }),
      }
    );

    console.log(getEndOfYesterdayIST(), getStartOf7DaysAgoFromYesterdayIST());

    if (!dataResponse.ok) {
      throw new Error("Failed to fetch data");
    }

    const result = await dataResponse.json();
    console.log(result);
    return result.data.map((val, i) => {
      if (i === result.data.length - 1)
        return {
          name: `Yesterday`,
          value: String(+val.total_distance.toFixed()),
        };
      return {
        name: `Day ${result.data.length - i}`,
        value: String(+val.total_distance.toFixed()),
      };
    });
  } catch (error) {
    return [];
  }
}
