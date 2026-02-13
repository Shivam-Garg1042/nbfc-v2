import last7DaysRunKm from "../APIs/last7DaysRunKm.js";

export default async function calculateActionableWindow(drivers, ID) {
  let driver = drivers.filter((driver) => {
    return driver.CreatedID === ID;
  });
  driver = driver[0];

  // Last seven Daya KMs
  // const lastSevenDays = driver.lastSevenKms.split(",");
  // const lastSevenDaysData = lastSevenDays.map((km, i) => {
  //   if (i === lastSevenDays.length - 1)
  //     return {
  //       name: `Yesterday`,
  //       value: lastSevenDays[lastSevenDays.length - (i + 1)] || 0,
  //     };
  //   return {
  //     name: `Day ${lastSevenDays.length - i}`,
  //     value: lastSevenDays[lastSevenDays.length - (i + 1)] || 0,
  //   };
  // });
  const lastSevenDaysData = await last7DaysRunKm(driver.batteryID);

  // console.log(lastSevenDaysData);

  // Payment Trends
  const paymentTrends = driver.emidpd.split(",");
  const paymentTrendsData = paymentTrends.map((emi, i) => {
    return {
      name: `EMI ${i + 1}`,
      value: emi,
    };
  });

  // RunKm last 3 months
  function getLastThreeMonths() {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const today = new Date();
    let months = [];

    for (let i = 1; i <= 3; i++) {
      let monthIndex = today.getMonth() - i;
      if (monthIndex < 0) monthIndex += 12; // Handle wrap-around for previous year
      months.push(monthNames[monthIndex]);
    }

    return months.reverse(); // Reverse to keep order from oldest to newest
  }
  const months = getLastThreeMonths();
  const kms = [
    Math.round(driver.thirdLastRunKm) || 0,
    Math.round(driver.secondLastRunKm) || 0,
    Math.round(driver.lastRunKm) || 0,
  ];
  const runKmData = months.map((month, i) => {
    return {
      name: month,
      value: kms[i],
    };
  });

  return { lastSevenDaysData, paymentTrendsData, runKmData };
}
