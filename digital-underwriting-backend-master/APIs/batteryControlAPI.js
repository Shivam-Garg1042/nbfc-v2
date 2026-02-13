import axios from "axios";
import https from "https";

export default async function batteryControlAPI(actionType, batteryID) {
  const urlToken = "https://apiplatform.intellicar.in/api/standard/gettoken";
  const urlBatteryControl = `https://apiplatform.intellicar.in/api/mosfetcontrol/${actionType}`;
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

    const responseBattery = await axios.post(
      urlBatteryControl,
      {
        batteryid: batteryID,
        type: "discharge",
        token: responseToken.data.data.token,
      },
      options
    );

    return {
      error: null,
      data: {
        status: responseBattery.data.status,
        message: responseBattery.data.msg,
      },
    };
  } catch (error) {
    return {
      error: {
        status: 400,
        message: error.response.data.msg,
      },
      data: null,
    };
  }
}
