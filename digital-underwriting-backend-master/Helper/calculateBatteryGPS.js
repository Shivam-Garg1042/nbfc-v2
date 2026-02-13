import gpsLocationBattery from "../APIs/gpsLocationBattery.js";

export default async function calculateBatteryGPS(batteryID) {
  const batteryLocation = await gpsLocationBattery(batteryID);

  if (batteryLocation.data === null || batteryLocation.data[0] === undefined)
    return { error: "yes", data: null };

  // console.log(batteryLocation);

  // We have got the 72 objects. Now we need to customize the data properties to send to the frontend
  let locationDataManipulation = batteryLocation.data.map((battery) => {
    return {
      lat: battery.latitude,
      lng: battery.longitude,
      batteryVoltage: battery.carbattery,
    };
  });

  // Also get the location address in the backend only to save time
  const apiKey = "AIzaSyByWS2RlWw3JJyvScuXtITwzxFf9tMlQ18";
  const responseLocation = await Promise.all(
    locationDataManipulation.map(async (battery) => {
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${battery.lat},${battery.lng}&key=${apiKey}`
        );
        const ans = await res.json();

        return {
          address: ans.results[0].formatted_address,
          ...battery,
        };
      } catch (err) {
        return {
          data: null,
        };
      }
    })
  );

  // return { error: null, data: locationDataManipulation };

  if (responseLocation[0].data === null) {
    locationDataManipulation = locationDataManipulation.map((val) => {
      return { address: "Not Found", ...val };
    });
    return { error: null, data: locationDataManipulation };
  } else {
    return { error: null, data: responseLocation };
  }
}
