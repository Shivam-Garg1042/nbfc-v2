function emidpdAvg(emidpdArr) {
  return Math.round(
    emidpdArr.split(",").reduce((accum, val) => +val + accum, 0) /
      emidpdArr.split(",").length
  );
}

export default function actionableCalculation(drivers, actionable, nbfcArr) {
  function calcAvg(val) {
    const res = Math.round(
      val.split(",").reduce((acc, km) => acc + +km, 0) / val.split(",").length
    );

    return res === 0 ? "NA" : String(res);
  }

  let customisedDrivers = drivers.filter(
    (driver) => driver.Status === "Active"
  );

  if (nbfcArr) {
    customisedDrivers = customisedDrivers.filter((driver) =>
      nbfcArr.includes(driver.NBFC)
    );
  }

  if (actionable === "last7DaysRunKm") {
    customisedDrivers = customisedDrivers.filter((driver) => {
      return (
        +calcAvg(driver.lastSevenKms) <= 20 && +emidpdAvg(driver.emidpd) > 7
      );
    });
  }
  if (actionable === "paymentOnTime") {
    customisedDrivers = customisedDrivers.filter((driver) => {
      return +driver.paymentPrediction === 1;
    });
  }
  if (actionable === "paymentDelay") {
    customisedDrivers = customisedDrivers.filter((driver) => {
      return +driver.paymentPrediction === 0;
    });
  }
  if (actionable === "bottomDrivers") {
    customisedDrivers = customisedDrivers.filter((driver) => {
      return +driver.karmaScore <= 350;
    });
  }
  if (actionable === "topDrivers") {
    customisedDrivers = customisedDrivers.filter((driver) => {
      return +driver.karmaScore >= 700;
    });
  }

  customisedDrivers = customisedDrivers.sort(
    (a, b) => +calcAvg(a.lastSevenKms) + +calcAvg(b.lastSevenKms)
  );

  const ans = customisedDrivers.map((driver) => {
    return {
      driverID: driver.CreatedID,
      name: `${driver.OwnerFirstName + " " + driver.LastName}`,
      batteryID: driver.batteryID,
      mobile: String(driver.Contact_Number_of_Owner),
      avgRunKm: calcAvg(driver.lastSevenKms),
      status: "NA",
      action: "NA",
      product : String(driver.productType),
    };
  });

  return { total: ans.length, drivers: ans };
}
