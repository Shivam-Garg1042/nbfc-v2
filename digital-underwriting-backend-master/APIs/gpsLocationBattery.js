import axios from "axios";
import https from "https";

const getPastTimestamp = (daysAgo) =>
  Date.now() - daysAgo * 24 * 60 * 60 * 1000;
function getEvenlySpacedObjects(arr, count = 72) {
  const step = Math.floor((arr.length - 1) / (count - 1));
  return Array.from({ length: count }, (_, i) => arr[i * step]);
}

export default async function gpsLocationBattery(batteryID) {
  const urlToken = "https://apiplatform.intellicar.in/api/standard/gettoken";
  const urlLocation =
    "https://apiplatform.intellicar.in/api/standard/getgpshistory";
  const options = {
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  };

  try {
    const responseToken = await axios.post(
      urlToken,
      { username: "echargeupnew.api", password: "intellicar@123" },
      options
    );

    const responseLocation = await axios.post(
      urlLocation,
      {
        token: responseToken.data.data.token,
        vehicleno: batteryID,
        starttime: getPastTimestamp(3),
        endtime: Date.now(),
      },
      options
    );
    const ans = getEvenlySpacedObjects(responseLocation.data.data);
    // const ans = responseLocation.data.data;
    return {
      error: null,
      data: ans,
    };
  } catch (error) {
    return {
      error: {
        status: 400,
        message: "Something went wrong, try after sometime.",
      },
      data: null,
    };
  }
}
