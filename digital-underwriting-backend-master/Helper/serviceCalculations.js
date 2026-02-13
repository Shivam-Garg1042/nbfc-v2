import serviceHeaderFilterCalc from "./serviceHeaderFilterCalc.js";

export default function serviceCalculations(
  serviceDataAll,
  driversData,
  serviceList,
  headerFilters
) {
  let serviceData = serviceDataAll;

  if (serviceList) {
    serviceList = serviceList.split(",");
    serviceData = serviceData.filter((service) => {
      return serviceList.includes(service.batteryOEM);
    });

    driversData = driversData.filter((driver) => {
      return serviceList.includes(driver["Battery OEM"]);
    });
  }

  // Header Filters
  serviceData = headerFilters
    ? serviceHeaderFilterCalc(serviceData, headerFilters)
    : serviceData;

  // TotalCases
  const totalCases = serviceData.length;
  // Closed
  const closed = serviceData.filter(
    (val) =>
      val.currentStatus === "Closed" ||
      val.currentStatus.toLowerCase() === "close"
  ).length;
  // Pending
  const pending = serviceData.filter(
    (val) => val.currentStatus === "Pending"
  ).length;
  // RTP
  const RTP = serviceData.filter((val) => val.currentStatus === "RTP").length;
  // Pickup Pending
  const pickupPending = serviceData.filter(
    (val) => val.currentStatus === "RTP" && val.RTPInPlantDate === ""
  ).length;
  // Pickup Done
  const pickupDone = serviceData.filter(
    (val) => val.currentStatus === "RTP" && val.RTPInPlantDate !== ""
  ).length;

  // TAT service Engineer
  const TATServiceEngineer = function () {
    const filteredData = serviceData.filter((item) => {
      // console.log(item.totalTATRange);
      return item.totalTATRange.trim() !== "";
    });
    const ans = filteredData.reduce((accum, serviceFault) => {
      if (serviceFault["totalTATRange"] !== "") {
        accum[serviceFault["totalTATRange"]] =
          (accum[serviceFault["totalTATRange"]] || 0) + 1;
      }
      return accum;
    }, {});

    const res = Object.entries(ans).map(([key, val]) => {
      return {
        name: key,
        value: Math.round((val / filteredData.length) * 100),
      };
    });

    return res;
  };
  // TATDriverFacing
  const TATDriverFacing = () => {
    const order = ["0-2 Days", "3-4 Days", "4-5 Days", "5+ Days"];

    const filteredData = serviceData.filter(
      (item) => item.totalTATRange.trim() !== ""
    );

    const countMap = filteredData.reduce((acc, item) => {
      acc[item.totalTATRange] = (acc[item.totalTATRange] || 0) + 1;
      return acc;
    }, {});

    const totalCount = filteredData.length;

    const result = Object.entries(countMap).map(([key, count]) => ({
      name: key,
      value: Math.ceil((count / totalCount) * 100),
    }));

    return result.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
  };
  // Resolution
  const resolution = function () {
    const filteredData = serviceData.filter(
      (item) => item.resolvedBy.trim() !== ""
    );
    const ans = filteredData.reduce((accum, val) => {
      accum[val.resolvedBy] = (accum[val.resolvedBy] || 0) + 1;
      return accum;
    }, {});

    const totalCount = filteredData.length;

    const result = Object.entries(ans).map(([key, count]) => ({
      name: key,
      value: Math.ceil((count / totalCount) * 100),
    }));

    return !result[0] ? [{ name: "No Data", value: 0 }] : result;
  };
  // Top Resolution Type
  const topResolutionType = function () {
    const filteredData = serviceData.filter(
      (item) => item.foundedIssues.trim() !== ""
    );
    const ans = filteredData.reduce((accum, val) => {
      accum[val.foundedIssues] = (accum[val.foundedIssues] || 0) + 1;
      return accum;
    }, {});

    const totalCount = filteredData.length;

    const result = Object.entries(ans).map(([key, count]) => {
      return {
        name: key,
        value: Math.ceil((count / totalCount) * 100),
      };
    });

    return result.filter((val) => {
      return +val.value >= 2;
    });
  };
  // RunKms
  const runKmRange = ["0-20", "21-40", "41-60", "61-80", "81-1000"];
  const runKMs = function () {
    const driverKMs = runKmRange.map((runkm) => {
      let splitRunKm = runkm.split("-");
      return driversData.filter(
        (driver) =>
          Math.ceil(driver.runKm) >= splitRunKm[0] &&
          Math.ceil(driver.runKm) <= splitRunKm[1]
      ).length;
    });

    const sum = driverKMs.reduce((accum, val) => accum + val, 0);
    const res = driverKMs.map((val) => ((val / sum) * 100).toFixed());

    const ans = res.map((val, i) => {
      return { value: res[i], name: runKmRange[i] };
    });

    return ans;
  };
  // Recurrence Fault
  const recurrenceFault = function () {
    const filteredData = serviceData.filter(
      (item) => item.repeatRange.trim() !== ""
    );
    const ans = filteredData.reduce((accum, serviceFault) => {
      if (serviceFault["repeatRange"] !== "") {
        accum[serviceFault["repeatRange"]] =
          (accum[serviceFault["repeatRange"]] || 0) + 1;
      }
      return accum;
    }, {});

    const res = Object.entries(ans).map(([key, val]) => {
      return {
        name: key,
        value: Math.round((val / filteredData.length) * 100),
      };
    });

    return res;
  };
  // Fault Rate
  const faultRate = function () {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Months are 1-based now

    let driverCounts = [];
    for (let i = 6; i >= 1; i--) {
      // Skip the current month by subtracting (i + 1) instead of i
      const targetDate = new Date(currentYear, currentMonth - (i + 1), 1);
      const targetYear = targetDate.getFullYear();
      const targetMonth = targetDate.getMonth() + 1;

      // Count drivers onboarded up to this month
      const count = driversData.filter((driver) => {
        const onboardingDate = new Date(driver.Onboarding_Date);
        const onboardYear = onboardingDate.getFullYear();
        const onboardMonth = onboardingDate.getMonth() + 1;

        return (
          onboardYear < targetYear ||
          (onboardYear === targetYear && onboardMonth <= targetMonth)
        );
      }).length;

      driverCounts.push({
        name: targetDate
          .toLocaleString("en-US", { month: "short" })
          .toLowerCase(),
        value: count,
      });
    }

    let faultCounts = [];
    for (let i = 6; i >= 1; i--) {
      // Exclude the current month by subtracting (i + 1)
      const targetDate = new Date(currentYear, currentMonth - (i + 1), 1);
      const targetYear = targetDate.getFullYear();
      const targetMonth = targetDate.getMonth() + 1;

      // Count drivers who were onboarded **only** in this specific month
      const count = serviceData.filter((driver) => {
        const onboardingDate = new Date(driver.complaintDate);
        return (
          onboardingDate.getFullYear() === targetYear &&
          onboardingDate.getMonth() + 1 === targetMonth
        );
      }).length;

      faultCounts.push({
        name: targetDate
          .toLocaleString("en-US", { month: "short" })
          .toLowerCase(),
        value: count,
      });
    }

    const ans = faultCounts.map((val, i) => {
      return {
        name: val.name,
        value: Math.round((+val.value / +driverCounts[i].value) * 100),
      };
    });

    return ans;
  };
  // Repeat Faults
  // const repeatFaults = function () {
  //   let ranges = {
  //     1: 0,
  //     "2-3": 0,
  //     "4-6": 0,
  //     ">=7": 0,
  //   };
  //   const ans = serviceData.reduce((accum, val) => {
  //     accum[val.batteryNumber] = (accum[val.batteryNumber] || 0) + 1;
  //     return accum;
  //   }, {});

  //   const res = Object.entries(ans).map(([key, val]) => {
  //     if (val === 1) ranges["1"] += 1;
  //     if (val === 2 || val === 3) ranges["2-3"] += 1;
  //     if (val >= 4 && val <= 6) ranges["4-6"] += 1;
  //     if (val >= 7) ranges[">=7"] += 1;
  //   });

  //   const output = Object.entries(ranges).map(([key, val]) => {
  //     return {
  //       name: key,
  //       value: Math.round((val / res.length) * 100),
  //     };
  //   });

  //   return output;
  // };
  // OEM: onFeild & RTP
  const OEMOnFeildAndRTP = function () {
    let SLAOnFeild = {
      ">48Hrs": 0,
      "<48Hrs": 0,
    };
    let SLARTP = {
      ">48Hrs": 0,
      "<48Hrs": 0,
    };
    let filteredData = serviceData.filter((val) => {
      return val.resolvedBy !== "" && val.resolvedBy !== "Chargeup";
    });

    const RTPInPlantDateBlank = filteredData.filter((val) => {
      return val.RTPInPlantDate === "";
    });
    const RTPInPlantDateNotBlank = filteredData.filter((val) => {
      return val.RTPInPlantDate !== "";
    });

    if ((RTPInPlantDateBlank.length === 0, RTPInPlantDateNotBlank.length === 0))
      return {
        SLAOnFeild: [
          { name: ">48Hrs", value: 0 },
          { name: "<48Hrs", value: 0 },
        ],
        SLARTP: [
          { name: ">48Hrs", value: 0 },
          { name: "<48Hrs", value: 0 },
        ],
      };

    // SLA: On Feild
    RTPInPlantDateBlank.map((val) => {
      if (val.SLA === ">48 Hrs") SLAOnFeild[">48Hrs"] += 1;
      if (val.SLA === "<48 Hrs") SLAOnFeild["<48Hrs"] += 1;
    });
    // SLA: RTP
    RTPInPlantDateNotBlank.map((val) => {
      if (val.SLA === ">48 Hrs") SLARTP[">48Hrs"] += 1;
      if (val.SLA === "<48 Hrs") SLARTP["<48Hrs"] += 1;
    });

    let count = 0;
    RTPInPlantDateNotBlank.map((val) => {
      val.SLA === "<48 Hrs" && count++;
    });

    SLAOnFeild = Object.entries(SLAOnFeild).map(([key, val]) => {
      return {
        name: key,
        value: Math.round((val / RTPInPlantDateBlank.length) * 100),
      };
    });
    SLARTP = Object.entries(SLARTP).map(([key, val]) => {
      return {
        name: key,
        value: Math.round((val / RTPInPlantDateNotBlank.length) * 100),
      };
    });

    return { SLAOnFeild, SLARTP };
  };
  // Vehicle fault and contribution
  const vehicleFaultAndContribution = function () {
    // 1. Get all types of vehicles and their strength (>=10)
    const ans = driversData.reduce((accum, driver) => {
      accum[driver["Vehicle OEM"]] = (accum[driver["Vehicle OEM"]] || 0) + 1;
      return accum;
    }, {});

    let response = [];

    Object.entries(ans).forEach(([key, val]) => {
      if (key !== "" && +ans[key] >= 10)
        response.push({ name: key, contribution: val, fault: 0 });
    });
    // console.log(response);

    // 2. Update the fault count for each vehicle
    serviceData.forEach((serviceFault) => {
      response.forEach((vehicle) => {
        if (serviceFault.vehicleOEM === vehicle.name) {
          vehicle.fault += 1; // Correct way to update `fault`
        }
      });
    });

    return response;
  };

  const data = {
    summaryData: {
      totalCases,
      closed,
      pending,
      RTP,
      pickupPending,
      pickupDone,
    },
    TATServiceEngineer: TATServiceEngineer(),
    TATDriverFacingData: TATDriverFacing(),
    resolution: resolution(),
    topResolutionType: topResolutionType(),
    runKms: runKMs(),
    recurrenceFault: recurrenceFault(),
    faultRate: faultRate(),
    OEMOnFeildAndRTP: OEMOnFeildAndRTP(),
    vehicleFaultAndContribution: vehicleFaultAndContribution(),
  };

  return data;
}
